import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDiagnosisDispatch } from "@/app/DiagnosisState";
import StartPage from "@/components/StartPage";

vi.mock("@/app/DiagnosisState", () => ({
  useDiagnosisDispatch: vi.fn(),
}));

describe("StartPage", () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    (useDiagnosisDispatch as ReturnType<typeof vi.fn>).mockReturnValue(
      mockDispatch,
    );
    mockDispatch.mockClear();
  });

  it("START_DIAGNOSIS が発火", () => {
    render(
      <BrowserRouter>
        <StartPage />
      </BrowserRouter>,
    );

    const startButton = screen.getByRole("button", { name: "診断を始める" });
    fireEvent.click(startButton);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({ type: "START_DIAGNOSIS" });
  });
});
