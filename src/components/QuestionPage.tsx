import { useDiagnosisData } from "@/app/DiagnosisData";
import { useDiagnosisDispatch, useDiagnosisState } from "@/app/DiagnosisState";
import AnswerOptionItem from "@/components/AnswerOptionItem";
import EasterEggImage from "@/components/EasterEggImage";
import Picture from "@/components/Picture";
import type { AnswerOption } from "@/types/KutoDiagnosisTypes";

function QuestionPage() {
  const { questions } = useDiagnosisData();
  const { sessionId, currentQuestionIndex, selectedOptionId } =
    useDiagnosisState();
  const dispatch = useDiagnosisDispatch();

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return;
  }

  const questionNumber = currentQuestionIndex + 1;
  const questionCount = questions.length;
  const progress =
    questionCount === 0 ? 0 : (currentQuestionIndex / questions.length) * 100;

  return (
    <div className="flex flex-col items-center py-4 md:py-8 px-2 gap-4 md:gap-8">
      <div className="flex flex-col">
        <h2 className="text-xl md:text-2xl font-bold ml-2 mb-1">
          {questionNumber}問目
        </h2>
        <div className="card card-sm card-border">
          <div className="card-body">
            <Picture
              pathWithoutExtension={`/images/defenses/${questionNumber.toString().padStart(2, "0")}`}
              sourceExtension="png"
              alt={currentQuestion.description}
              className="max-w-full object-contain"
            />
          </div>
        </div>
      </div>
      <p className="text-sm md:text-base">
        あなたの<span className="font-semibold">考えに最も近い攻撃編成</span>
        は？
      </p>
      <ul className="flex flex-col gap-2">
        {[
          ...Object.entries(currentQuestion.typeAnswers),
          ["none", { typeIds: [], description: "" }] as [string, AnswerOption],
        ].map(([id, option]) => (
          <li key={id}>
            <AnswerOptionItem
              key={id}
              id={id}
              option={option}
              imgPathWithoutExtension={`/images/attacks/${questionNumber.toString().padStart(2, "0")}_${id}`}
              groupName={`question-${questionNumber}`}
              isSelected={selectedOptionId === id}
              onSelect={() => dispatch({ type: "SELECT_ANSWER", payload: id })}
            />
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="btn btn-neutral btn-md md:btn-lg"
        disabled={!selectedOptionId}
        onClick={() =>
          dispatch({ type: "SUBMIT_ANSWER", payload: questions.length })
        }
      >
        次へ
      </button>
      <progress
        className="progress w-1/2 progress-info"
        value={progress}
        max="100"
      ></progress>
      <EasterEggImage
        sessionId={sessionId}
        currentQuestionIndex={currentQuestionIndex}
      />
    </div>
  );
}

export default QuestionPage;
