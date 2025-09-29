import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  DiagnosisProvider,
  type DiagnosisState,
  useDiagnosisDispatch,
  useDiagnosisState,
} from "@/app/DiagnosisState";

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "sessionStorage", {
  value: sessionStorageMock,
});

const TestComponent = () => {
  const state = useDiagnosisState();
  const dispatch = useDiagnosisDispatch();

  return (
    <div>
      <div data-testid="status">{state.status}</div>
      <div data-testid="current-index">{state.currentQuestionIndex}</div>
      <div data-testid="selected-option">{state.selectedOptionId}</div>
      <div data-testid="answers">{JSON.stringify(state.answers)}</div>
      <button
        type="button"
        onClick={() => dispatch({ type: "START_DIAGNOSIS" })}
      >
        Start
      </button>
      <button
        type="button"
        onClick={() => dispatch({ type: "SELECT_ANSWER", payload: "opt1" })}
      >
        Select
      </button>
      <button
        type="button"
        onClick={() => dispatch({ type: "SUBMIT_ANSWER", payload: 10 })}
      >
        Submit
      </button>
      <button
        type="button"
        onClick={() => dispatch({ type: "RESTART_DIAGNOSIS" })}
      >
        Restart
      </button>
    </div>
  );
};

describe("DiagnosisState Management", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("初期状態の確認", () => {
    render(
      <DiagnosisProvider>
        <TestComponent />
      </DiagnosisProvider>,
    );
    expect(screen.getByTestId("status").textContent).toBe("idle");
    expect(screen.getByTestId("current-index").textContent).toBe("0");
  });

  it("START_DIAGNOSIS の処理", () => {
    render(
      <DiagnosisProvider>
        <TestComponent />
      </DiagnosisProvider>,
    );
    fireEvent.click(screen.getByText("Start"));
    expect(screen.getByTestId("status").textContent).toBe("in-progress");
  });

  it("SELECT_ANSWER の処理", () => {
    render(
      <DiagnosisProvider>
        <TestComponent />
      </DiagnosisProvider>,
    );
    fireEvent.click(screen.getByText("Select"));
    expect(screen.getByTestId("selected-option").textContent).toBe("opt1");
  });

  it("SUBMIT_ANSWER の処理（次の質問がある場合）", () => {
    render(
      <DiagnosisProvider>
        <TestComponent />
      </DiagnosisProvider>,
    );
    fireEvent.click(screen.getByText("Select"));
    fireEvent.click(screen.getByText("Submit"));

    expect(screen.getByTestId("status").textContent).toBe("in-progress");
    expect(screen.getByTestId("current-index").textContent).toBe("1");
    expect(screen.getByTestId("answers").textContent).toContain('"1":"opt1"');
    expect(screen.getByTestId("selected-option").textContent).toBe("");
  });

  it("SUBMIT_ANSWER の処理（完了の場合）", () => {
    render(
      <DiagnosisProvider>
        <TestComponent />
      </DiagnosisProvider>,
    );
    // Simulate being on the last question
    fireEvent.click(screen.getByText("Start")); // to set status
    for (let i = 0; i < 9; i++) {
      fireEvent.click(screen.getByText("Select"));
      fireEvent.click(screen.getByText("Submit"));
    }

    // Final question
    fireEvent.click(screen.getByText("Select"));
    fireEvent.click(screen.getByText("Submit"));

    expect(screen.getByTestId("status").textContent).toBe("completed");
  });

  it("RESTART_DIAGNOSIS の処理", () => {
    render(
      <DiagnosisProvider>
        <TestComponent />
      </DiagnosisProvider>,
    );
    fireEvent.click(screen.getByText("Start"));
    fireEvent.click(screen.getByText("Restart"));
    expect(screen.getByTestId("status").textContent).toBe("idle");
  });

  it("sessionStorage への記録", () => {
    const setItemSpy = vi.spyOn(sessionStorage, "setItem");
    render(
      <DiagnosisProvider>
        <TestComponent />
      </DiagnosisProvider>,
    );

    fireEvent.click(screen.getByText("Start"));

    expect(setItemSpy).toHaveBeenCalledWith(
      "diagnosis-session",
      expect.stringContaining('"status":"in-progress"'),
    );
    setItemSpy.mockRestore();
  });

  it("sessionStorage による復帰", () => {
    const initialState: DiagnosisState = {
      status: "in-progress",
      currentQuestionIndex: 5,
      answers: { 1: "a", 2: "b" },
      selectedOptionId: "c",
    };
    sessionStorage.setItem("diagnosis-session", JSON.stringify(initialState));

    render(
      <DiagnosisProvider>
        <TestComponent />
      </DiagnosisProvider>,
    );

    expect(screen.getByTestId("status").textContent).toBe("in-progress");
    expect(screen.getByTestId("current-index").textContent).toBe("5");
    expect(screen.getByTestId("answers").textContent).toContain('"2":"b"');
  });
});
