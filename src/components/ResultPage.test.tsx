import { act, fireEvent, render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createDiagnosisDataProvider,
  type DiagnosisData,
} from "@/app/DiagnosisData";
import { useDiagnosisDispatch, useDiagnosisState } from "@/app/DiagnosisState";
import type { KutoTypeInfo, Question } from "@/types/KutoDiagnosisTypes";
import ResultPage from "./ResultPage";

// 状態管理フックをモック化
vi.mock("@/app/DiagnosisState", async (importOriginal) => {
  const original =
    await importOriginal<typeof import("@/app/DiagnosisState")>();
  return {
    ...original,
    useDiagnosisState: vi.fn(),
    useDiagnosisDispatch: vi.fn(),
  };
});

// --- 型定義に準拠したモックデータ --- //
const mockKutoTypes: Record<string, KutoTypeInfo> = {
  type1: {
    displayName: "テストタイプ1",
    flavorText: "あなたはすごい",
    expertName: "テスト専門家1",
    expertAccountLink: "https://example.com/1",
  },
  type2: {
    displayName: "テストタイプ2",
    flavorText: "あなたはまあまあ",
    expertName: "テスト専門家2",
    expertAccountLink: "https://example.com/2",
  },
};

const mockQuestions: Question[] = [
  {
    description: "質問1",
    typeAnswers: { a: { typeIds: ["type1"], description: "回答A" } },
  },
  {
    description: "質問2",
    typeAnswers: { c: { typeIds: ["type1"], description: "回答C" } },
  },
  {
    description: "質問3",
    typeAnswers: { e: { typeIds: ["type2"], description: "回答E" } },
  },
];

const mockDiagnosisData: DiagnosisData = {
  questions: mockQuestions,
  kutoTypes: mockKutoTypes,
};

const resolvedPromise = Promise.resolve(mockDiagnosisData);
const TestDiagnosisDataProvider = createDiagnosisDataProvider(resolvedPromise);

describe("ResultPage", () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.mocked(useDiagnosisDispatch).mockReturnValue(mockDispatch);
    vi.mocked(useDiagnosisState).mockReturnValue({
      sessionId: "test-session-id",
      status: "completed",
      answers: { 0: "a", 1: "c", 2: "e" }, // type1に2票, type2に1票
      currentQuestionIndex: 0, // statusが'completed'の時は0
      selectedOptionId: null,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    mockDispatch.mockClear();
  });

  // `act`でラップしたrender関数
  const renderComponent = async () => {
    await act(async () => {
      render(
        <Suspense fallback={<div>ローディング...</div>}>
          <TestDiagnosisDataProvider>
            <ResultPage />
          </TestDiagnosisDataProvider>
        </Suspense>,
      );
    });
  };

  it("最多得票タイプの情報が正しく表示されること", async () => {
    await renderComponent();

    // actで更新が完了しているので、getByで同期的に要素を取得できる
    expect(
      screen.getByRole("heading", { name: "テストタイプ1", level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getByAltText("テストタイプ1")).toHaveAttribute(
      "src",
      "images/icons/type1.jpg",
    );
    expect(screen.getByText(/あなたはすごい/)).toBeInTheDocument();
    expect(screen.getByText("テスト専門家1")).toBeInTheDocument();
  });

  it("すべての一致率が正しく計算・表示されること", async () => {
    await renderComponent();

    const listItems = screen.getAllByRole("listitem");
    const type1Item = listItems.find((li) =>
      li.textContent?.includes("テストタイプ1"),
    );
    const type2Item = listItems.find((li) =>
      li.textContent?.includes("テストタイプ2"),
    );

    expect(type1Item).toHaveTextContent("67");
    expect(type2Item).toHaveTextContent("33");
  });

  it("「もう一度診断する」ボタンでRESTART_DIAGNOSISが発火すること", async () => {
    await renderComponent();

    const restartButton = screen.getByRole("button", {
      name: "もう一度診断する",
    });
    fireEvent.click(restartButton);

    expect(mockDispatch).toHaveBeenCalledWith({ type: "RESTART_DIAGNOSIS" });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
});
