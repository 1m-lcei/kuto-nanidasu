import { useMemo } from "react";
import Picture from "@/components/Picture";

type EasterEggImageProps = {
  sessionId: string;
  currentQuestionIndex: number;
};

function determinesEasterEggDisplay() {
  const randomValue = Math.random();
  return {
    isShown: randomValue < 0.05,
    isRotated: randomValue < 0.01,
  };
}

function EasterEggImage({
  sessionId,
  currentQuestionIndex,
}: EasterEggImageProps) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: 同一のセッションIDかつ質問番号の場合に結果を保存
  const { isShown, isRotated } = useMemo(determinesEasterEggDisplay, [
    sessionId,
    currentQuestionIndex,
  ]);

  if (!isShown) {
    return null;
  }

  return (
    <Picture
      pathWithoutExtension="images/easteregg"
      sourceExtension="png"
      alt="Easter Egg"
      className={
        isRotated
          ? "fixed bottom-4 left-4 -z-10 pointer-events-none mix-blend-multiply opacity-20 w-[min(16.6667vw,16.6667vh)] origin-bottom-right rotate-90 -translate-x-11/12"
          : "fixed bottom-4 left-4 -z-10 pointer-events-none mix-blend-multiply opacity-20 w-[min(16.6667vw,16.6667vh)]"
      }
    />
  );
}

export default EasterEggImage;
