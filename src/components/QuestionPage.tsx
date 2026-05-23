import { useLayoutEffect, useMemo } from "react";
import { useDiagnosisData } from "@/app/DiagnosisData";
import { useDiagnosisDispatch, useDiagnosisState } from "@/app/DiagnosisState";
import AnswerOptionItem from "@/components/AnswerOptionItem";
import EasterEggImage from "@/components/EasterEggImage";
import Picture from "@/components/Picture";
import type { AnswerOption } from "@/types/KutoDiagnosisTypes";
import { shuffle } from "@/utils/shuffle";
import { DaggerIcon, ShieldIcon } from "./SvgIcons";

function QuestionPage() {
  const { questions } = useDiagnosisData();
  const { sessionId, currentQuestionIndex, selectedOptionId } =
    useDiagnosisState();
  const dispatch = useDiagnosisDispatch();

  // biome-ignore lint/correctness/useExhaustiveDependencies: 必要
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentQuestionIndex]);

  const currentQuestion = questions[currentQuestionIndex];
  const shuffledOptions = useMemo(() => {
    if (!currentQuestion) {
      return [];
    }
    const options = Object.entries(currentQuestion.typeAnswers);
    shuffle(options);
    return options;
  }, [currentQuestion]);

  if (!currentQuestion) {
    return null;
  }

  const questionNumber = currentQuestionIndex + 1;
  const questionCount = questions.length;
  const progress =
    questionCount === 0 ? 0 : (currentQuestionIndex / questions.length) * 100;

  const handleOnSelect = (id: string) => {
    dispatch({ type: "SELECT_ANSWER", payload: id });
  };

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SUBMIT_ANSWER", payload: questions.length });
  };

  return (
    <>
      <div className="flex flex-col items-center py-4 md:py-8 px-2 gap-2 md:gap-4">
        <div className="container w-auto mb-2">
          <div className="flex items-end mb-1 ml-1 md:ml-0">
            <ShieldIcon className="w-7 md:w-8 h-7 md:h-8" />
            <h2 className="text-xl md:text-2xl font-bold">
              {questionNumber}問目
            </h2>
          </div>
          <div className="card card-xs md:card-sm card-border">
            <div className="card-body">
              <Picture
                pathWithoutExtension={`images/defenses/${questionNumber.toString().padStart(2, "0")}`}
                sourceExtension="png"
                alt={currentQuestion.description}
                className="max-w-full object-contain"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center md:items-end">
          <DaggerIcon className="w-6 md:w-8 h-6 md:h-8 rotate-180" />
          <h3 className="text-base md:text-lg font-bold">何出す？</h3>
          <p className="text-sm md:text-base">
            （
            <span className="font-semibold underline -underline-offset-2 decoration-4 decoration-amber-100">
              考えに近い
            </span>
            編成）
          </p>
        </div>
        <form
          onSubmit={handleOnSubmit}
          className="flex flex-col items-center gap-2"
        >
          <ul className="flex flex-col gap-2">
            {[
              ...shuffledOptions,
              ["none", { typeIds: [], description: "" }] as [
                string,
                AnswerOption,
              ],
            ].map(([id, option]) => (
              <li key={id}>
                <AnswerOptionItem
                  key={id}
                  id={id}
                  option={option}
                  imgPathWithoutExtension={`images/attacks/${questionNumber.toString().padStart(2, "0")}_${id}`}
                  groupName={`question-${questionNumber}`}
                  isSelected={selectedOptionId === id}
                  onSelect={handleOnSelect}
                />
              </li>
            ))}
          </ul>
          <button
            type="submit"
            className="btn btn-neutral btn-md md:btn-lg transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            disabled={!selectedOptionId}
          >
            次へ
          </button>
        </form>
        <progress
          className="progress w-1/2 progress-info"
          value={progress}
          max="100"
        ></progress>
      </div>
      <EasterEggImage
        sessionId={sessionId}
        currentQuestionIndex={currentQuestionIndex}
      />
    </>
  );
}

export default QuestionPage;
