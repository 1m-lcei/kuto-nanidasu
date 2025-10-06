import { useMemo } from "react";
import { useDiagnosisData } from "@/app/DiagnosisData";
import { useDiagnosisState } from "@/app/DiagnosisState";

function useResult() {
  const { sessionId, answers } = useDiagnosisState();
  const { questions, kutoTypes } = useDiagnosisData();

  // biome-ignore lint/correctness/useExhaustiveDependencies: セッションIDで結果をメモ化する
  const result = useMemo(() => {
    // [question index]: optionId → [optionId]: count
    const answerCounts = new Map<string, number>();
    for (let i = 0; i < questions.length; i++) {
      const optionId = answers[i];
      if (optionId) {
        const cur = questions[i];
        const answeredOption = cur.typeAnswers[optionId];
        if (answeredOption) {
          for (const typeId of answeredOption.typeIds) {
            answerCounts.set(typeId, (answerCounts.get(typeId) || 0) + 1);
          }
        }
      }
    }

    // 00抜きIDリスト。念のためソート
    const majorTypesIds = Object.keys(kutoTypes)
      .filter((id) => id !== "00")
      .sort();
    // 00抜きIDのカウント
    const majorTypeCounts = majorTypesIds.map((id) => ({
      id,
      count: answerCounts.get(id) || 0,
    }));
    // 一致率
    const questionCount = questions.length;
    const matchRates = majorTypeCounts.map(({ id, count }) => ({
      id,
      kutoType: kutoTypes[id],
      rate: questionCount === 0 ? 0 : Math.round((count / questionCount) * 100),
    }));

    let resultTypeId = "00";
    if (majorTypeCounts.length > 0) {
      let maxCount = 0;
      for (const { id, count } of majorTypeCounts) {
        // maxCount < count のときに更新: 若いID優先
        if (maxCount < count) {
          maxCount = count;
          resultTypeId = id;
        }
      }
    }

    return {
      resultTypeId: resultTypeId,
      resultType: kutoTypes[resultTypeId],
      matchRates: matchRates,
    };
  }, [sessionId]);

  return result;
}

export default useResult;
