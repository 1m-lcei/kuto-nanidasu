import { useMemo } from "react";

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

  const imageSrc = "images/easteregg";

  return (
    <div className="fixed bottom-4 left-0 -z-10 pointer-events-none mix-blend-multiply opacity-30 w-1/6">
      <picture>
        <source srcSet={`${imageSrc}.avif`} type="image/avif" />
        <img
          src={`${imageSrc}.png`}
          alt="Easter Egg"
          className={
            isRotated ? "origin-bottom-right rotate-90 -translate-x-1/2" : ""
          }
        />
      </picture>
    </div>
  );
}

export default EasterEggImage;
