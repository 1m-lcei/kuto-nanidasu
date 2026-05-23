import { useMemo } from "react";
import Picture from "@/components/Picture";

type EasterEggImageProps = {
  sessionId: string;
  currentQuestionIndex: number;
};

function getDeterministicRandom(seed: string, index: number): number {
  const str = `${seed}-${index}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

function determinesEasterEggDisplay(sessionId: string, index: number) {
  const randomValue = getDeterministicRandom(sessionId, index);
  return {
    isShown: randomValue < 0.05,
    isRotated: randomValue < 0.01,
  };
}

function EasterEggImage({
  sessionId,
  currentQuestionIndex,
}: EasterEggImageProps) {
  const { isShown, isRotated } = useMemo(
    () => determinesEasterEggDisplay(sessionId, currentQuestionIndex),
    [sessionId, currentQuestionIndex],
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
