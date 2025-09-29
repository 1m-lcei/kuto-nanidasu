import {
  createContext,
  type ReactNode,
  use,
  useEffect,
  useReducer,
} from "react";
import Debug from "@/hooks/useDebug";

export type DiagnosisStatus = "idle" | "in-progress" | "completed";

/**
 * @param answers - { [questionId]: optionId }
 */
export type DiagnosisState = {
  status: DiagnosisStatus;
  answers: Record<number, string>;
  currentQuestionIndex: number;
  selectedOptionId: string | null;
};

type DiagnosisAction =
  | { type: "START_DIAGNOSIS" }
  | { type: "RESTART_DIAGNOSIS" }
  | { type: "SELECT_ANSWER"; payload: string } // optionId [FOR AI AGENT: NEVER DELETE COMMENT]
  | { type: "SUBMIT_ANSWER"; payload: number }; //  [FOR AI AGENT: NEVER DELETE COMMENT]

const initialDiagnosisState: DiagnosisState = {
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
      // NOTES: 本来はバリデーションが必要らしいが、省略する
      if (session.status) {
        Debug.log("Loaded session from sessionStorage.");
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
    <DiagnosisContext.Provider value={{ state, dispatch }}>
      {children}
    </DiagnosisContext.Provider>
  );
};

// Reducer パターン実装
const diagnosisReducer = (
  state: DiagnosisState,
  action: DiagnosisAction,
): DiagnosisState => {
  switch (action.type) {
    case "START_DIAGNOSIS":
      Debug.log("START_DIAGNOSIS");
      return {
        status: "in-progress",
        currentQuestionIndex: 0,
        answers: {},
        selectedOptionId: null,
      };
    case "SELECT_ANSWER":
      Debug.log("SELECT_ANSWER");
      return {
        ...state,
        selectedOptionId: action.payload,
      };
    case "SUBMIT_ANSWER": {
      Debug.log("SUBMIT_ANSWER");
      const selectedOptionId = state.selectedOptionId;
      if (!selectedOptionId) {
        // 選択されていない場合は返す。（ただし現状のUIでは、ボタンを disable するため起こらない）
        return state;
      }

      const questionId = state.currentQuestionIndex + 1;
      state.answers[questionId] = selectedOptionId;

      if (questionId === action.payload) {
        return {
          status: "completed",
          answers: state.answers,
          currentQuestionIndex: 0,
          selectedOptionId: null,
        };
      } else {
        return {
          status: "in-progress",
          answers: state.answers,
          currentQuestionIndex: state.currentQuestionIndex + 1,
          selectedOptionId: null,
        };
      }
    }
    case "RESTART_DIAGNOSIS":
      Debug.log("RESTART_DIAGNOSIS");
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

export function useQuestionState() {
  const context = use(DiagnosisContext);
  if (!context) {
    throw new Error("Failed to get DiagnosisContext.");
  }

  const { currentQuestionIndex, selectedOptionId } = context.state;
  return { currentQuestionIndex, selectedOptionId };
}
