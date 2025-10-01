import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DiagnosisDataProvider, useDiagnosisData } from "@/app/DiagnosisData";
import { useDiagnosisDispatch, useDiagnosisState } from "@/app/DiagnosisState";
import QuestionPage from "@/components/QuestionPage";
import type { Question } from "@/types/KutoDiagnosisTypes";

vi.mock("@/app/DiagnosisState", () => ({
  useDiagnosisState: vi.fn(),
  useDiagnosisDispatch: vi.fn(),
}));

vi.mock("@/app/DiagnosisData", () => ({
  DiagnosisDataProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useDiagnosisData: vi.fn(),
}));

describe("QuestionPage", () => {
  const mockQuestion: Question = {
    description: "Test Question 1",
    typeAnswers: {
      optionA: { typeIds: ["t1"], description: "Alt Text for Option A" },
      optionB: { typeIds: ["t2"], description: "Alt Text for Option B" },
    },
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
    (useDiagnosisState as ReturnType<typeof vi.fn>).mockReturnValue({
      sessionId: "test-session-id",
      currentQuestionIndex: 0,
      selectedOptionId: null,
    });
    mockDispatch.mockClear();
  });

  it("現在の問題に応じた各要素の表示", () => {
    (useDiagnosisState as ReturnType<typeof vi.fn>).mockReturnValue({
      sessionId: "test-session-id",
      currentQuestionIndex: 0,
      selectedOptionId: "optionA", // 選択済み状態
    });

    render(
      <DiagnosisDataProvider>
        <QuestionPage />
      </DiagnosisDataProvider>,
    );

    expect(screen.getByText("1問目")).toBeInTheDocument();
    screen.getByAltText("Alt Text for Option A");
    expect(screen.getByAltText("Alt Text for Option B")).toBeInTheDocument();
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("value", "0"); // currentQuestionIndex が 0 なので 0%
  });

  it("SELECT_ANSWER が発火", () => {
    render(
      <DiagnosisDataProvider>
        <QuestionPage />
      </DiagnosisDataProvider>,
    );

    const optionALabel = screen.getByAltText("Alt Text for Option A");
    fireEvent.click(optionALabel);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "SELECT_ANSWER",
      payload: "optionA",
    });
  });

  it("ボタンの disabled", () => {
    (useDiagnosisState as ReturnType<typeof vi.fn>).mockReturnValue({
      sessionId: "test-session-id",
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
    (useDiagnosisState as ReturnType<typeof vi.fn>).mockReturnValue({
      sessionId: "test-session-id",
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
