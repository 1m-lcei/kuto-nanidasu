import { createContext, type ReactNode, use, useEffect, useState } from "react";
import Debug from "@/hooks/useDebug";
import type { KutoTypeInfo, Question } from "@/types/KutoDiagnosisTypes";

export type DiagnosisData = {
  questions: Question[];
  kutoTypes: Record<string, KutoTypeInfo>;
};

export const DiagnosisDataContext = createContext<DiagnosisData | undefined>(
  undefined,
);

export const DiagnosisDataProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [fetchStatus, setFetchStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [kutoTypes, setKutoTypes] = useState<Record<string, KutoTypeInfo>>({});

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [questionsResponse, kutoTypesResponse] = await Promise.all([
          fetch("/questions.json"),
          fetch("/kutoTypes.json"),
        ]);
        if (!questionsResponse.ok || !kutoTypesResponse.ok) {
          throw new Error("Failed to fetch initial data.");
        }
        const questionsData = await questionsResponse.json();
        const kutoTypesData = await kutoTypesResponse.json();
        setQuestions(questionsData);
        setKutoTypes(kutoTypesData);

        Debug.log("OK: fetch");
        setFetchStatus("success");
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        setFetchStatus("error");
      }
    };
    fetchInitialData();
  }, []);

  if (fetchStatus === "loading") {
    return <div>ローディング中...</div>;
  } else if (fetchStatus === "error") {
    return (
      <div>
        データの読み込みに失敗しました。時間をおいて再度お試しください。
      </div>
    );
  }

  return (
    <DiagnosisDataContext value={{ questions, kutoTypes }}>
      {children}
    </DiagnosisDataContext>
  );
};

export function useDiagnosisData() {
  const context = use(DiagnosisDataContext);
  if (context === undefined) {
    throw new Error("Failed to get DiagnosisDataContext.");
  }

  const { questions, kutoTypes } = context;
  return { questions, kutoTypes };
}
