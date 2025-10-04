import Picture from "@/components/Picture";
import type { AnswerOption } from "@/types/KutoDiagnosisTypes";

interface AnswerOptionItemProps {
  id: string;
  option: AnswerOption;
  groupName: string;
  imgPathWithoutExtension: string;
  isSelected: boolean;
  onSelect: (option: AnswerOption) => void;
}

function AnswerOptionItem({
  id,
  option,
  groupName,
  imgPathWithoutExtension,
  isSelected,
  onSelect,
}: AnswerOptionItemProps) {
  const isNone = id === "none";

  return (
    <label
      htmlFor={`option-${id}`}
      className={`cursor-pointer p-2 md:p-4 flex items-center gap-2 md:gap-4 rounded-lg
        ring-2 ${isSelected ? "ring-neutral" : "ring-transparent hover:ring-neutral-400"}`}
    >
      <input
        id={`option-${id}`}
        type="radio"
        name={groupName}
        className="radio radio-neutral radio-xs md:radio-md"
        checked={isSelected}
        onChange={() => onSelect(option)}
      />
      {isNone ? (
        <span className="text-sm md:text-base py-2 md:py-4">
          上記からは選べない
        </span>
      ) : (
        <Picture
          pathWithoutExtension={imgPathWithoutExtension}
          sourceExtension="png"
          alt={option.description}
          className="max-w-full object-contain"
        />
      )}
    </label>
  );
}

export default AnswerOptionItem;
