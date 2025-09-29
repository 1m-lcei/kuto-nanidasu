import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DiagnosisDataProvider, useDiagnosisData } from "@/app/DiagnosisData";
import type { KutoTypeInfo, Question } from "@/types/KutoDiagnosisTypes";

const mockQuestions: Question[] = [
  {
    typeAnswers: [
      { questionId: 1, optionId: "a", typeIds: ["type1"] },
      { questionId: 1, optionId: "b", typeIds: ["type2"] },
    ],
  },
  {
    typeAnswers: [
      { questionId: 2, optionId: "c", typeIds: ["type1"] },
      { questionId: 2, optionId: "d", typeIds: ["type3"] },
    ],
  },
];

const mockKutoTypes: Record<string, KutoTypeInfo> = {
  type1: {
    displayName: "タイプ1",
    expertName: "エキスパート1",
    expertAccountLink: "https://example.com/expert1",
    flavorText: "これはタイプ1です。",
  },
  type2: {
    displayName: "タイプ2",
    expertName: "エキスパート2",
    expertAccountLink: "https://example.com/expert2",
    flavorText: "これはタイプ2です。",
  },
};

// Test component to consume the context
const TestConsumer = () => {
  const { questions, kutoTypes } = useDiagnosisData();
  return (
    <div>
      <span>Question ID: {questions[0]?.typeAnswers[0]?.questionId}</span>
      <span>Kuto Type: {kutoTypes.type1?.displayName}</span>
    </div>
  );
};

describe("DiagnosisDataProvider", () => {
  // vi.spyOn を使うため、ここで mockClear する必要はなくなります。
  // afterEach の restoreAllMocks でクリーンアップされます。
  beforeEach(() => {});

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("ローディングの表示", () => {
    vi.spyOn(globalThis, "fetch").mockReturnValue(new Promise(() => {})); // Never resolves
    render(
      <DiagnosisDataProvider>
        <TestConsumer />
      </DiagnosisDataProvider>,
    );
    expect(screen.getByText("ローディング中...")).toBeInTheDocument();
  });

  it("フェッチ失敗の表示", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      new Error("Failed to fetch"),
    );
    render(
      <DiagnosisDataProvider>
        <TestConsumer />
      </DiagnosisDataProvider>,
    );
    await waitFor(() => {
      expect(
        screen.getByText(
          "データの読み込みに失敗しました。時間をおいて再度お試しください。",
        ),
      ).toBeInTheDocument();
    });
  });

  it("フェッチデータの表示", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation((url) => {
      if (url === "/questions.json") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockQuestions),
        } as Response);
      }
      if (url === "/kutoTypes.json") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockKutoTypes),
        } as Response);
      }
      return Promise.reject(new Error(`Unknown URL: ${url}`));
    });

    render(
      <DiagnosisDataProvider>
        <TestConsumer />
      </DiagnosisDataProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Question ID: 1")).toBeInTheDocument();
      expect(screen.getByText("Kuto Type: タイプ1")).toBeInTheDocument();
    });
  });

  it("DiagnosisDataContext 外での例外", () => {
    // Suppress console.error for this test because React will log the error
    const originalError = console.error;
    console.error = vi.fn();

    expect(() => render(<TestConsumer />)).toThrow(
      "Failed to get DiagnosisDataContext.",
    );

    // Restore console.error
    console.error = originalError;
  });
});
