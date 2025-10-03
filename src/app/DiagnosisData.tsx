import { createContext, type ReactNode, use } from "react";
import type { KutoTypeInfo, Question } from "@/types/KutoDiagnosisTypes";

export type DiagnosisData = {
  questions: Question[];
  kutoTypes: Record<string, KutoTypeInfo>;
};

export const DiagnosisDataContext = createContext<DiagnosisData | undefined>(
  undefined,
);

export function createDiagnosisDataProvider(promise: Promise<DiagnosisData>) {
  return function DiagnosisDataProvider({ children }: { children: ReactNode }) {
    const data = use(promise);

    return <DiagnosisDataContext value={data}>{children}</DiagnosisDataContext>;
  };
}

export function useDiagnosisData() {
  const context = use(DiagnosisDataContext);
  if (context === undefined) {
    throw new Error("Failed to get DiagnosisDataContext.");
  }

  return context;
}
