import { useMemo } from "react";
import { useDiagnosisData } from "@/app/DiagnosisData";
import { useDiagnosisState } from "@/app/DiagnosisState";
import type { KutoTypeInfo, Question } from "@/types/KutoDiagnosisTypes";

function useResult() {
  const { sessionId, answers } = useDiagnosisState();
  const { questions, kutoTypes } = useDiagnosisData();

  const fallbackId = "00"; // 一致ゼロの場合の特殊ID

  function generateAnswerCounts(
    questions: Question[],
    answers: Record<number, string>,
  ) {
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

    return answerCounts;
  }

  function generateMajorTypeCounts(
    kutoTypes: Record<string, KutoTypeInfo>,
    answerCounts: Map<string, number>,
  ) {
    return new Map(
      Object.keys(kutoTypes)
        .filter((id) => id !== fallbackId)
        .sort() // 念のためソート
        .map((id) => [id, answerCounts.get(id) || 0]),
    );
  }

  function generateMatchRates(
    questionCount: number,
    kutoTypes: Record<string, KutoTypeInfo>,
    majorTypeCounts: Map<string, number>,
  ) {
    const matchRates = new Map<
      string,
      { kutoType: KutoTypeInfo; rate: number }
    >();

    majorTypeCounts.forEach((count, id) => {
      matchRates.set(id, {
        kutoType: kutoTypes[id],
        rate:
          questionCount === 0 ? 0 : Math.round((count / questionCount) * 100),
      });
    });

    return matchRates;
  }

  function determinesResultTypeId(majorTypeCounts: Map<string, number>) {
    let resultTypeId = fallbackId;

    let maxCount = 0;
    majorTypeCounts.forEach((count, id) => {
      // maxCount < count のときに更新: 若いID優先
      if (maxCount < count) {
        maxCount = count;
        resultTypeId = id;
      }
    });

    return resultTypeId;
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: セッションIDで結果をメモ化する
  const result = useMemo(() => {
    // [question index]: optionId → [optionId]: count
    const answerCounts = generateAnswerCounts(questions, answers);
    // 00抜きIDのカウント
    const majorTypeCounts = generateMajorTypeCounts(kutoTypes, answerCounts);
    // 一致率
    const matchRates = generateMatchRates(
      questions.length,
      kutoTypes,
      majorTypeCounts,
    );
    // 結果タイプ
    const resultTypeId = determinesResultTypeId(majorTypeCounts);

    return {
      resultTypeId: resultTypeId,
      resultType: kutoTypes[resultTypeId],
      resultMatchRate:
        resultTypeId !== fallbackId
          ? (matchRates.get(resultTypeId)?.rate ?? 0)
          : 100, // "00"の場合は100%
      matchRates: matchRates,
    };
  }, [sessionId]);

  return result;
}

export default useResult;
