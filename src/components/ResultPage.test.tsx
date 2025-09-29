import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDiagnosisDispatch } from "@/app/DiagnosisState";
import useResult from "@/hooks/useResult";
import ResultPage from "./ResultPage";

vi.mock("@/hooks/useResult");
vi.mock("@/app/DiagnosisState", () => ({
  useDiagnosisDispatch: vi.fn(),
}));

describe("ResultPage", () => {
  const mockDispatch = vi.fn();
  const mockResult = {
    resultTypeId: "type1",
    resultType: {
      displayName: "テストタイプ",
      flavorText: "あなたはすごい",
      expertName: "テスト専門家",
      expertAccountLink: "https://example.com",
    },
    matchRates: [
      {
        id: "type1",
        kutoType: { displayName: "テストタイプ", expertName: "テスト専門家" },
        rate: 80,
      },
      {
        id: "type2",
        kutoType: { displayName: "別のタイプ", expertName: "別の専門家" },
        rate: 20,
      },
    ],
  };

  beforeEach(() => {
    (useResult as ReturnType<typeof vi.fn>).mockReturnValue(mockResult);
    (useDiagnosisDispatch as ReturnType<typeof vi.fn>).mockReturnValue(
      mockDispatch,
    );
    mockDispatch.mockClear();
  });

  it("結果タイプ情報の表示", () => {
    render(<ResultPage />);

    expect(
      screen.getByRole("heading", { name: "テストタイプ", level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getByText(/あなたはすごい/)).toBeInTheDocument();
    expect(screen.getByText("テスト専門家")).toBeInTheDocument();
    expect(screen.getByAltText("テストタイプタイプ")).toHaveAttribute(
      "src",
      "images/icons/type1.jpg",
    );
  });

  it("一致率の表示", () => {
    render(<ResultPage />);

    const listItems = screen.getAllByRole("listitem");

    const type1Item = listItems.find((li) =>
      li.textContent?.includes("テストタイプ"),
    );
    const type2Item = listItems.find((li) =>
      li.textContent?.includes("別のタイプ"),
    );

    expect(type1Item).toHaveTextContent("80");
    expect(type2Item).toHaveTextContent("20");
  });

  it("RESTART_DIAGNOSIS の発火", () => {
    render(<ResultPage />);

    const restartButton = screen.getByRole("button", {
      name: "もう一度診断する",
    });
    fireEvent.click(restartButton);

    expect(mockDispatch).toHaveBeenCalledWith({ type: "RESTART_DIAGNOSIS" });
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
});
