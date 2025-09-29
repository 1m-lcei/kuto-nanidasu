import Picture from "@/components/Picture";
import type { AnswerOption } from "@/types/KutoDiagnosisTypes";

interface AnswerOptionItemProps {
  option: AnswerOption;
  groupName: string;
  isSelected: boolean;
  onSelect: (option: AnswerOption) => void;
}

function AnswerOptionItem({
  option,
  groupName,
  isSelected,
  onSelect,
}: AnswerOptionItemProps) {
  const isNone = option.optionId === "none";

  return (
    <label
      htmlFor={`option-${option.optionId}`}
      className={`cursor-pointer p-2 md:p-4 flex items-center gap-2 md:gap-4 rounded-lg
        ring-2 ${isSelected ? "ring-neutral" : "ring-transparent hover:ring-neutral-400"}`}
    >
      <input
        id={`option-${option.optionId}`}
        type="radio"
        name={groupName}
        className="radio radio-neutral radio-xs md:radio-md"
        checked={isSelected}
        onChange={() => onSelect(option)}
        aria-label={`選択肢 ${option.optionId}`}
      />
      {isNone ? (
        <span className="text-sm md:text-base py-2 md:py-4">
          上記からは選べない
        </span>
      ) : (
        <Picture
          pathWithoutExtension={`/images/attacks/${option.questionId.toString().padStart(2, "0")}_${option.optionId}`}
          sourceExtension=".png"
          alt={`選択肢 ${option.optionId}`}
        />
      )}
    </label>
  );
}

export default AnswerOptionItem;
