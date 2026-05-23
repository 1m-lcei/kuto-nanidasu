import { useMemo } from "react";
import Picture from "@/components/Picture";

type EasterEggImageProps = {
  sessionId: string;
  currentQuestionIndex: number;
};

export const EASTER_EGG_DISPLAY_RATE = 0.05;
export const EASTER_EGG_ROTATED_RATE = 0.01;

function hashStringToUint32(value: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }

  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;
  return hash >>> 0;
}

function getDeterministicRandom(
  seed: string,
  index: number,
  salt: string,
): number {
  return hashStringToUint32(`${seed}:${index}:${salt}`) / 0x100000000;
}

export function determinesEasterEggDisplay(sessionId: string, index: number) {
  const displayValue = getDeterministicRandom(sessionId, index, "display");
  const rotateValue = getDeterministicRandom(sessionId, index, "rotate");
  const isShown = displayValue < EASTER_EGG_DISPLAY_RATE;

  return {
    isShown,
    isRotated:
      isShown &&
      rotateValue < EASTER_EGG_ROTATED_RATE / EASTER_EGG_DISPLAY_RATE,
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
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
    >
      <Picture
        pathWithoutExtension="images/easteregg"
        sourceExtension="png"
        alt=""
        className={
          isRotated
            ? "absolute bottom-4 left-4 mix-blend-multiply opacity-20 w-[min(16.6667vw,16.6667vh)] origin-bottom-right rotate-90 -translate-x-11/12"
            : "absolute bottom-4 left-4 mix-blend-multiply opacity-20 w-[min(16.6667vw,16.6667vh)]"
        }
      />
    </div>
  );
}

export default EasterEggImage;
