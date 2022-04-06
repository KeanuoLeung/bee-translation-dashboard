import {
  Box,
  Button,
  Modal,
  TextareaAutosize,
  Typography
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { TranslationItem } from "./App";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4
};

type CompProps = {
  open: boolean;
  onClose: () => void;
  translationItems: TranslationItem[];
  editingId: string;
  onSubmit: (e: TranslationItem) => void;
  namespace: string;
};

function EditModal({
  open,
  onClose,
  translationItems,
  editingId,
  onSubmit,
  namespace
}: CompProps) {
  const [en, setEn] = useState("");
  const [zh, setZh] = useState("");
  const translationItemRef = useRef<TranslationItem>();

  useEffect(() => {
    if (!open) return;
    console.log("translation items", translationItems, editingId);
    const curItem = translationItems.find((item) => item._id === editingId);
    translationItemRef.current = curItem;
    console.log("cur item", curItem);
    setEn(curItem?.en ?? "");
    setZh(curItem?.zh ?? "");
  }, [open, translationItems, editingId]);
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography>🇬🇧</Typography>
        <TextareaAutosize
          aria-label="empty textarea"
          placeholder="Empty"
          style={{ width: "100%" }}
          value={en}
          onChange={(e) => {
            setEn(e.target.value);
          }}
        />
        <Typography>🇨🇳</Typography>
        <TextareaAutosize
          aria-label="empty textarea"
          placeholder="Empty"
          style={{ width: "100%" }}
          value={zh}
          onChange={(e) => {
            setZh(e.target.value);
          }}
        />
        <Button
          variant="contained"
          onClick={() => {
            if (translationItemRef?.current) {
              onSubmit({ ...translationItemRef.current, zh: zh, en: en });
              // TODO: call update api
              fetch("https://qckvcf.api.cloudendpoint.cn/updateTranslation", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  namespace,
                  key: translationItemRef.current.key,
                  en,
                  zh
                })
              });
              onClose();
            }
          }}
        >
          Save
        </Button>
      </Box>
    </Modal>
  );
}

export default EditModal;
