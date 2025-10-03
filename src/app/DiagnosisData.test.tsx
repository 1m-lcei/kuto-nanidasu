import { act, render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createDiagnosisDataProvider,
  type DiagnosisData,
  useDiagnosisData,
} from "@/app/DiagnosisData";
import type { KutoTypeInfo, Question } from "@/types/KutoDiagnosisTypes";

const mockKutoTypes: Record<string, KutoTypeInfo> = {
  type1: {
    displayName: "テストタイプ1",
    expertName: "専門家1",
    expertAccountLink: "https://example.com/expert1",
    flavorText: "これはテストタイプ1です。",
  },
};

const mockQuestions: Question[] = [
  {
    description: "質問1です",
    typeAnswers: {
      a: { typeIds: ["type1"], description: "回答A" },
      b: { typeIds: ["type2"], description: "回答B" },
    },
  },
];

const mockDiagnosisData: DiagnosisData = {
  questions: mockQuestions,
  kutoTypes: mockKutoTypes,
};

const TestConsumer = () => {
  const data = useDiagnosisData();
  return <div data-testid="data">{JSON.stringify(data)}</div>;
};

describe("DiagnosisData features", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("createDiagnosisDataProvider", () => {
    it("Promiseが解決された場合、子コンポーネントにデータが渡されること", async () => {
      const resolvedPromise = Promise.resolve(mockDiagnosisData);
      const DiagnosisDataProvider =
        createDiagnosisDataProvider(resolvedPromise);

      await act(async () => {
        render(
          <Suspense fallback={<div>ローディング...</div>}>
            <DiagnosisDataProvider>
              <TestConsumer />
            </DiagnosisDataProvider>
          </Suspense>,
        );
      });

      const dataDiv = await screen.findByTestId("data");
      expect(dataDiv).toHaveTextContent(JSON.stringify(mockDiagnosisData));
    });
  });

  describe("useDiagnosisData", () => {
    it("Providerの外部で呼び出すとエラーがスローされること", () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => render(<TestConsumer />)).toThrow(
        "Failed to get DiagnosisDataContext.",
      );

      errorSpy.mockRestore();
    });
  });
});
