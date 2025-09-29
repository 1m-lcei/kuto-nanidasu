import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DiagnosisDataProvider, useDiagnosisData } from "@/app/DiagnosisData";
import { useDiagnosisDispatch, useQuestionState } from "@/app/DiagnosisState";
import QuestionPage from "@/components/QuestionPage";
import type { Question } from "@/types/KutoDiagnosisTypes";

vi.mock("@/app/DiagnosisState", () => ({
  useDiagnosisContext: vi.fn(),
  useDiagnosisDispatch: vi.fn(),
  useQuestionState: vi.fn(),
}));

vi.mock("@/app/DiagnosisData", () => ({
  DiagnosisDataProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useDiagnosisData: vi.fn(),
}));

describe("QuestionPage", () => {
  const mockQuestion: Question = {
    typeAnswers: [
      { questionId: 1, optionId: "optionA", typeIds: ["t1"] },
      { questionId: 1, optionId: "optionB", typeIds: ["t2"] },
    ],
  };
  const mockQuestions: Question[] = [mockQuestion];
  const mockDispatch = vi.fn();

  beforeEach(() => {
    (useDiagnosisDispatch as ReturnType<typeof vi.fn>).mockReturnValue(
      mockDispatch,
    );
    (useDiagnosisData as ReturnType<typeof vi.fn>).mockReturnValue({
      questions: mockQuestions,
      kutoTypes: {},
    });
    (useQuestionState as ReturnType<typeof vi.fn>).mockReturnValue({
      currentQuestionIndex: 0,
      selectedOptionId: null,
    });
    mockDispatch.mockClear();
  });

  it("現在の問題に応じた各要素の表示", () => {
    (useQuestionState as ReturnType<typeof vi.fn>).mockReturnValue({
      currentQuestionIndex: 0,
      selectedOptionId: "optionA", // 選択済み状態
    });

    render(
      <DiagnosisDataProvider>
        <QuestionPage />
      </DiagnosisDataProvider>,
    );

    expect(screen.getByText("1問目")).toBeInTheDocument();
    expect(screen.getByAltText("選択肢 optionA")).toBeInTheDocument();
    expect(screen.getByAltText("選択肢 optionB")).toBeInTheDocument();
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("value", "0"); // currentQuestionIndex が 0 なので 0%
  });

  it("SELECT_ANSWER が発火", () => {
    render(
      <DiagnosisDataProvider>
        <QuestionPage />
      </DiagnosisDataProvider>,
    );

    const optionALabel = screen.getByAltText("選択肢 optionA");
    fireEvent.click(optionALabel);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "SELECT_ANSWER",
      payload: "optionA",
    });
  });

  it("ボタンの disabled", () => {
    (useQuestionState as ReturnType<typeof vi.fn>).mockReturnValue({
      currentQuestionIndex: 0,
      selectedOptionId: null, // 未選択状態
    });
    render(
      <DiagnosisDataProvider>
        <QuestionPage />
      </DiagnosisDataProvider>,
    );

    const submitButton = screen.getByRole("button", { name: "次へ" });
    expect(submitButton).toBeDisabled();
  });

  it("SUBMIT_ANSWER の発火", () => {
    (useQuestionState as ReturnType<typeof vi.fn>).mockReturnValue({
      currentQuestionIndex: 0,
      selectedOptionId: "optionA", // 選択済み状態
    });
    render(
      <DiagnosisDataProvider>
        <QuestionPage />
      </DiagnosisDataProvider>,
    );

    const submitButton = screen.getByRole("button", { name: "次へ" });
    expect(submitButton).not.toBeDisabled();

    fireEvent.click(submitButton);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "SUBMIT_ANSWER",
      payload: 1,
    });
  });
});
