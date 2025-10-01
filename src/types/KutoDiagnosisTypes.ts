export type KutoTypeInfo = {
  displayName: string;
  expertName: string;
  expertAccountLink: string;
  flavorText: string;
};

export type AnswerOption = {
  typeIds: string[];
  description: string;
};

export type Question = {
  description: string;
  typeAnswers: Record<string, AnswerOption>;
};
