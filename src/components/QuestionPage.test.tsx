import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDiagnosisData } from "@/app/DiagnosisData";
import { DiagnosisDataProvider } from "@/app/DiagnosisDataProvider";
import { useDiagnosisDispatch, useDiagnosisState } from "@/app/DiagnosisState";
import QuestionPage from "@/components/QuestionPage";
import type { Question } from "@/types/KutoDiagnosisTypes";

vi.mock("@/app/DiagnosisState", () => ({
  useDiagnosisState: vi.fn(),
  useDiagnosisDispatch: vi.fn(),
}));

vi.mock("@/app/DiagnosisData", () => ({
  useDiagnosisData: vi.fn(),
}));

vi.mock("@/app/DiagnosisDataProvider", () => ({
  DiagnosisDataProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
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
    window.scrollTo = vi.fn();
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

  it("scrolls to the top immediately when shown", () => {
    render(
      <DiagnosisDataProvider>
        <QuestionPage />
      </DiagnosisDataProvider>,
    );

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  });
});
