import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import "./styles.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import moment from "moment";

import EditModal from "./EditModal";
import { Alert } from "@mui/material";

const exampleTranslationItem = {
  _id: "624d4f437b28e354360a4d01",
  key: "hello",
  en: "Hello",
  zh: "你好呀",
  namespace: "test",
  createdAt: "2022-04-06T08:28:51.155Z",
  updatedAt: "2022-04-06T08:32:00.462Z"
};

export type TranslationItem = typeof exampleTranslationItem;

const darkTheme = createTheme({
  palette: {
    mode: "dark"
  }
});

const namespaces = ["default"];

const rows: GridRowsProp = [
  { id: 1, col1: "Hello", col2: "World" },
  { id: 2, col1: "DataGridPro", col2: "is Awesome" },
  { id: 3, col1: "MUI", col2: "is Amazing" }
];

const columns: GridColDef[] = [
  { field: "key", headerName: "Key", width: 150 },
  { field: "en", headerName: "En🇬🇧", width: 300 },
  { field: "zh", headerName: "Zh🇨🇳", width: 300 },
  { field: "createdAt", headerName: "Created At", width: 300 }
];

export default function App() {
  const [namespace, setNamespace] = useState("default");
  const [translations, setTranslations] = useState<TranslationItem[]>([]);
  useEffect(() => {
    fetch(
      "https://qckvcf.api.cloudendpoint.cn/getAllTranslations?namespace=" +
        namespace
    )
      .then((e) => e.json())
      .then((e: TranslationItem[]) => {
        console.log(e);
        setTranslations(e);
      });
  }, [namespace]);
  const [editId, setEditId] = useState("");

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <EditModal
        namespace={namespace}
        editingId={editId}
        open={Boolean(editId)}
        onClose={() => {
          setEditId("");
        }}
        translationItems={translations}
        onSubmit={(e) => {
          const _translations = [...translations];
          const curitem = _translations.find((item) => item._id === e._id);
          if (curitem) {
            curitem.zh = e.zh;
            curitem.en = e.en;
          }
        }}
      />
      <Alert severity="info">Double click on row to edit.😄</Alert>
      <Alert severity="info">
        Remember click bottom button to sync translation file.😄
      </Alert>
      <div style={{ height: "80vh", width: "100%" }}>
        <DataGrid
          onCellEditStop={(e) => {
            console.log("cell edit stop", e);
          }}
          onCellEditCommit={(e) => {
            console.log("cell editing", e);
          }}
          onRowDoubleClick={(e) => {
            console.log("row dbl click", e);
            setEditId(e.id.toString());
          }}
          experimentalFeatures={{ newEditingApi: true }}
          rows={translations
            .sort(
              (a, b) =>
                Number(new Date(b.createdAt).valueOf()) -
                Number(new Date(a.createdAt).valueOf())
            )
            .map((item) => ({
              ...item,
              id: item._id,
              createdAt: moment(item.createdAt).fromNow()
            }))}
          columns={columns}
        />
      </div>
      <Button
        variant="contained"
        onClick={() => {
          fetch("https://qckvcf.api.cloudendpoint.cn/syncTranslations")
            .then((e) => e.json())
            .then((e) => {
              console.log("synced", e);
            });
        }}
      >
        Sync All Translations to AWS S3 Bucket
      </Button>
    </ThemeProvider>
  );
}
