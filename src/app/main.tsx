import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter } from "react-router";
import "@/app/index.css";
import AppRouter from "@/app/AppRouter";
import { DiagnosisDataProvider } from "@/app/DiagnosisDataProvider";
import { DiagnosisProvider } from "@/app/DiagnosisState";

const root = document.getElementById("root") as ReactDOM.Container;

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <ErrorBoundary
      fallback={
        <div className="p-4 text-center">
          ❌ データの取得に失敗しました。時間をおいて再度お試しください。
        </div>
      }
    >
      <Suspense
        fallback={
          <div className="p-4 text-center">⏳️ データのローディング中...</div>
        }
      >
        <DiagnosisDataProvider>
          <DiagnosisProvider>
            <AppRouter />
          </DiagnosisProvider>
        </DiagnosisDataProvider>
      </Suspense>
    </ErrorBoundary>
  </BrowserRouter>,
);
