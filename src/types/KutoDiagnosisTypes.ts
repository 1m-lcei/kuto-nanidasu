export type KutoTypeInfo = {
  displayName: string;
  expertName: string;
  expertAccountLink: string;
  flavorText: string;
};

export type AnswerOption = {
  questionId: number;
  optionId: string;
  typeIds: string[];
};

export type Question = {
  typeAnswers: AnswerOption[];
};
