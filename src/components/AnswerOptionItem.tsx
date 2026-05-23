import Picture from "@/components/Picture";
import type { AnswerOption } from "@/types/KutoDiagnosisTypes";

interface AnswerOptionItemProps {
  id: string;
  option: AnswerOption;
  groupName: string;
  imgPathWithoutExtension: string;
  isSelected: boolean;
  onSelect: (option: string) => void;
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
  const handleOnChange = () => onSelect(id);

  const uniqueId = `option-${groupName}-${id}`;

  return (
    <label
      htmlFor={uniqueId}
      className={`cursor-pointer p-2 md:p-4 flex items-center gap-2 md:gap-4 rounded-lg
        ring-2 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
          isSelected ? "ring-neutral bg-neutral/5" : "ring-transparent hover:ring-neutral-400"
        }`}
    >
      <input
        id={uniqueId}
        type="radio"
        name={groupName}
        className="radio radio-neutral radio-xs md:radio-md"
        checked={isSelected}
        onChange={handleOnChange}
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
