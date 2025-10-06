import {
  createContext,
  type ReactNode,
  use,
  useEffect,
  useReducer,
} from "react";

export type DiagnosisStatus = "idle" | "in-progress" | "completed";

/**
 * @param answers - { [questionId]: optionId }
 */
export type DiagnosisState = {
  sessionId: string;
  status: DiagnosisStatus;
  answers: Record<number, string>;
  currentQuestionIndex: number;
  selectedOptionId: string | null;
};

type DiagnosisAction =
  | { type: "START_DIAGNOSIS" }
  | { type: "RESTART_DIAGNOSIS" }
  | { type: "SELECT_ANSWER"; payload: string } // optionId
  | { type: "SUBMIT_ANSWER"; payload: number }; // question count

const initialDiagnosisState: DiagnosisState = {
  sessionId: crypto.randomUUID(),
  status: "idle",
  answers: {},
  currentQuestionIndex: 0,
  selectedOptionId: null,
};

export const DiagnosisContext = createContext<
  | { state: DiagnosisState; dispatch: React.Dispatch<DiagnosisAction> }
  | undefined
>(undefined);

const restoreState = (initialState: DiagnosisState) => {
  try {
    const savedSession = sessionStorage.getItem("diagnosis-session");
    if (savedSession) {
      const session = JSON.parse(savedSession) as DiagnosisState;
      if (session.status) {
        return session;
      }
    }
  } catch (error) {
    console.warn("Failed to load session from sessionStorage:", error);
  }

  return initialState;
};

export const DiagnosisProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(
    diagnosisReducer,
    initialDiagnosisState,
    restoreState,
  );

  useEffect(() => {
    try {
      sessionStorage.setItem("diagnosis-session", JSON.stringify(state));
    } catch (error) {
      console.warn("Failed to save session to sessionStorage:", error);
    }
  }, [state]);

  return (
    <DiagnosisContext value={{ state, dispatch }}>{children}</DiagnosisContext>
  );
};

// Reducer パターン実装
const diagnosisReducer = (
  state: DiagnosisState,
  action: DiagnosisAction,
): DiagnosisState => {
  switch (action.type) {
    case "START_DIAGNOSIS":
      return {
        sessionId: crypto.randomUUID(),
        status: "in-progress",
        currentQuestionIndex: 0,
        answers: {},
        selectedOptionId: null,
      };
    case "SELECT_ANSWER":
      return {
        ...state,
        selectedOptionId: action.payload,
      };
    case "SUBMIT_ANSWER": {
      const selectedOptionId = state.selectedOptionId;
      if (!selectedOptionId) {
        // 選択されていない場合は返す。（ただし現状のUIでは、ボタンを disable するため起こらない）
        return state;
      }

      const i = state.currentQuestionIndex;
      state.answers[i] = selectedOptionId;
      const nextIndex = i + 1;

      if (nextIndex < action.payload) {
        return {
          ...state,
          status: "in-progress",
          currentQuestionIndex: nextIndex,
          selectedOptionId: null,
        };
      } else {
        return {
          ...state,
          status: "completed",
          currentQuestionIndex: 0,
          selectedOptionId: null,
        };
      }
    }
    case "RESTART_DIAGNOSIS":
      sessionStorage.removeItem("diagnosis-session");
      return initialDiagnosisState;
    default:
      return state;
  }
};

export function useDiagnosisState() {
  const context = use(DiagnosisContext);
  if (!context) {
    throw new Error("Failed to get DiagnosisContext");
  }

  return context.state;
}

export function useDiagnosisDispatch() {
  const context = use(DiagnosisContext);
  if (!context) {
    throw new Error("Failed to get DiagnosisContext");
  }

  return context.dispatch;
}
