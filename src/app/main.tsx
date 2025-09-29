import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import "@/app/index.css";
import AppRouter from "@/app/AppRouter";
import { DiagnosisDataProvider } from "@/app/DiagnosisData";
import { DiagnosisProvider } from "@/app/DiagnosisState";

const root = document.getElementById("root") as ReactDOM.Container;

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <DiagnosisDataProvider>
      <DiagnosisProvider>
        <AppRouter />
      </DiagnosisProvider>
    </DiagnosisDataProvider>
  </BrowserRouter>,
);
