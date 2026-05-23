import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AppRouter from "@/app/AppRouter";
import { useDiagnosisState } from "@/app/DiagnosisState";

vi.mock("@/app/DiagnosisState", () => ({
  useDiagnosisState: vi.fn(),
}));

vi.mock("@/components/StartPage", () => ({
  default: () => <div>Start Page</div>,
}));

vi.mock("@/components/QuestionPage", () => ({
  default: () => <div>Question Page</div>,
}));

vi.mock("@/components/ResultPage", () => ({
  default: () => <div>Result Page</div>,
}));

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

describe("AppRouter", () => {
  beforeEach(() => {
    vi.mocked(useDiagnosisState).mockReset();
  });

  it.each([
    ["idle", "/"],
    ["in-progress", "/question"],
    ["completed", "/result"],
  ] as const)(
    "restores %s sessions from every app page",
    async (status, expectedPath) => {
      vi.mocked(useDiagnosisState).mockReturnValue({
        sessionId: "test-session-id",
        status,
        answers: {},
        currentQuestionIndex: 0,
        selectedOptionId: null,
      });

      for (const initialPath of ["/", "/question", "/questions", "/result"]) {
        render(
          <MemoryRouter initialEntries={[initialPath]}>
            <AppRouter />
            <LocationProbe />
          </MemoryRouter>,
        );

        await waitFor(() => {
          expect(screen.getByTestId("location")).toHaveTextContent(
            expectedPath,
          );
        });
        cleanup();
      }
    },
  );
});
