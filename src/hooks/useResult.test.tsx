import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { DiagnosisData } from "@/app/DiagnosisData";
import type { DiagnosisState } from "@/app/DiagnosisState";
import useResult from "@/hooks/useResult";

// Mock the context provider internals to provide specific test data
vi.mock("@/app/DiagnosisState", async () => {
  const originalModule = await vi.importActual<DiagnosisState>(
    "@/app/DiagnosisState",
  );
  return {
    ...originalModule,
    useDiagnosisState: () => ({
      status: "completed",
      // 'type1' is selected twice, 'type2' once, 'type3' once.
      answers: { 1: "a", 2: "c", 3: "d", 4: "e" },
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
        { typeAnswers: [{ questionId: 1, optionId: "a", typeIds: ["type1"] }] },
        { typeAnswers: [{ questionId: 2, optionId: "c", typeIds: ["type1"] }] },
        { typeAnswers: [{ questionId: 3, optionId: "d", typeIds: ["type2"] }] },
        { typeAnswers: [{ questionId: 4, optionId: "e", typeIds: ["type3"] }] },
      ],
      kutoTypes: {
        type1: { displayName: "Type 1" },
        type2: { displayName: "Type 2" },
        type3: { displayName: "Type 3" },
        "00": { displayName: "Default Type" },
      },
    }),
  };
});

describe("useResult Hook", () => {
  it("should calculate the result type with the highest count", () => {
    const { result } = renderHook(() => useResult());

    // Expect 'type1' because it has the highest count (2)
    expect(result.current.resultTypeId).toBe("type1");
    expect(result.current.resultType.displayName).toBe("Type 1");
  });

  it("should calculate match rates correctly", () => {
    const { result } = renderHook(() => useResult());

    const type1Rate = result.current.matchRates.find((r) => r.id === "type1");
    const type2Rate = result.current.matchRates.find((r) => r.id === "type2");
    const type3Rate = result.current.matchRates.find((r) => r.id === "type3");

    // 2 out of 4 questions -> 50%
    expect(type1Rate?.rate).toBe(50);
    // 1 out of 4 questions -> 25%
    expect(type2Rate?.rate).toBe(25);
    // 1 out of 4 questions -> 25%
    expect(type3Rate?.rate).toBe(25);
  });
});
