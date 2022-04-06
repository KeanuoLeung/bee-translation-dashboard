import { useEffect } from "react";
import "./styles.css";

const exampleTranslationItem = {
  _id: "624d4f437b28e354360a4d01",
  key: "hello",
  en: "Hello",
  zh: "你好呀",
  namespace: "test",
  createdAt: "2022-04-06T08:28:51.155Z",
  updatedAt: "2022-04-06T08:32:00.462Z"
};

type TranslationItem = typeof exampleTranslationItem;

export default function App() {
  useEffect(() => {
    fetch(
      "https://qckvcf.api.cloudendpoint.cn/getAllTranslations?namespace=test"
    )
      .then((e) => e.json())
      .then((e: TranslationItem[]) => {
        console.log(e);
      });
  }, []);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
