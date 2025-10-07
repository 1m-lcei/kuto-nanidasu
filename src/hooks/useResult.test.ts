import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { DiagnosisData } from "@/app/DiagnosisData";
import type { DiagnosisState } from "@/app/DiagnosisState";
import useResult from "@/hooks/useResult";

vi.mock("@/app/DiagnosisState", async () => {
  const originalModule = await vi.importActual<DiagnosisState>(
    "@/app/DiagnosisState",
  );
  return {
    ...originalModule,
    useDiagnosisState: () => ({
      status: "completed",
      // 'type1' is selected twice, 'type2' once, 'type3' once.
      answers: { 0: "a", 1: "c", 2: "d", 3: "e" },
      currentQuestionIndex: 0,
      selectedOptionId: null,
    }),
  };
});

vi.mock("@/app/DiagnosisData", async () => {
  const originalModule = await vi.importActual<DiagnosisData>(
    "@/app/DiagnosisData",
  );
  return {
    ...originalModule,
    useDiagnosisData: () => ({
      questions: [
        {
          description: "Q1",
          typeAnswers: { a: { typeIds: ["type1"], description: "Desc a" } },
        },
        {
          description: "Q2",
          typeAnswers: { c: { typeIds: ["type1"], description: "Desc c" } },
        },
        {
          description: "Q3",
          typeAnswers: { d: { typeIds: ["type2"], description: "Desc d" } },
        },
        {
          description: "Q4",
          typeAnswers: { e: { typeIds: ["type3"], description: "Desc e" } },
        },
      ],
      kutoTypes: {
        type1: {
          displayName: "Type 1",
          expertName: "",
          expertAccountLink: "",
          flavorText: "",
        },
        type2: {
          displayName: "Type 2",
          expertName: "",
          expertAccountLink: "",
          flavorText: "",
        },
        type3: {
          displayName: "Type 3",
          expertName: "",
          expertAccountLink: "",
          flavorText: "",
        },
        "00": {
          displayName: "Default Type",
          expertName: "",
          expertAccountLink: "",
          flavorText: "",
        },
      },
    }),
  };
});

describe("useResult Hook", () => {
  it("結果タイプの選択", () => {
    const { result } = renderHook(() => useResult());

    // Expect 'type1' because it has the highest count (2)
    expect(result.current.resultTypeId).toBe("type1");
    expect(result.current.resultType.displayName).toBe("Type 1");
  });

  it("一致率の計算", () => {
    const { result } = renderHook(() => useResult());

    const type1Data = result.current.matchRates.get("type1");
    const type2Data = result.current.matchRates.get("type2");
    const type3Data = result.current.matchRates.get("type3");

    // 2 out of 4 questions -> 50%
    expect(type1Data?.rate).toBe(50);
    // 1 out of 4 questions -> 25%
    expect(type2Data?.rate).toBe(25);
    // 1 out of 4 questions -> 25%
    expect(type3Data?.rate).toBe(25);
  });
});
