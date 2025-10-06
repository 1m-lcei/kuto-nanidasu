import { useMemo } from "react";
import Picture from "./Picture";

type EasterEggImageProps = {
  sessionId: string;
  currentQuestionIndex: number;
};

function determinesEasterEggDisplay(
  sessionId: string,
  currentQuestionIndex: number,
) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: セッションIDとページ番号でメモ化する
  return useMemo(() => {
    const randomValue = Math.random();
    return {
      isShown: randomValue < 0.05,
      isRotated: randomValue < 0.01,
    };
  }, [sessionId, currentQuestionIndex]);
}

function EasterEggImage({
  sessionId,
  currentQuestionIndex,
}: EasterEggImageProps) {
  const { isShown, isRotated } = determinesEasterEggDisplay(
    sessionId,
    currentQuestionIndex,
  );

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
