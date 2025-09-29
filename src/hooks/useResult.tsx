import { useDiagnosisData } from "@/app/DiagnosisData";
import { useDiagnosisState } from "@/app/DiagnosisState";

function useResult() {
  const { answers } = useDiagnosisState();
  const { questions, kutoTypes } = useDiagnosisData();

  const answerCounts = new Map<string, number>();

  // Calculate counts for each typeId based on answers
  for (const question of questions) {
    const answeredOptionId = answers[question.typeAnswers[0].questionId];
    if (answeredOptionId) {
      const answeredOption = question.typeAnswers.find(
        (opt) => opt.optionId === answeredOptionId,
      );
      if (answeredOption) {
        for (const typeId of answeredOption.typeIds) {
          answerCounts.set(typeId, (answerCounts.get(typeId) || 0) + 1);
        }
      }
    }
  }

  const majorTypesIds = Object.keys(kutoTypes).filter((id) => id !== "00");
  const majorTypeCounts = majorTypesIds.map((id) => ({
    id,
    count: answerCounts.get(id) || 0,
  }));

  const totalQuestions = questions.length;
  const matchRates = majorTypeCounts.map(({ id, count }) => ({
    id,
    kutoType: kutoTypes[id],
    rate: totalQuestions === 0 ? 0 : Math.round((count / totalQuestions) * 100),
  }));

  let resultTypeId = "00";
  if (majorTypeCounts.length > 0) {
    const maxCount = Math.max(...majorTypeCounts.map((c) => c.count));
    if (maxCount > 0) {
      const topTypes = majorTypeCounts.filter((c) => c.count === maxCount);
      resultTypeId = topTypes.sort((a, b) => a.id.localeCompare(b.id))[0].id;
    }
  }

  return {
    resultTypeId: resultTypeId,
    resultType: kutoTypes[resultTypeId],
    matchRates: matchRates,
  };
}

export default useResult;
