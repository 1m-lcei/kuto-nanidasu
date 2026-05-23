import { describe, expect, it } from "vitest";
import {
  determinesEasterEggDisplay,
  EASTER_EGG_DISPLAY_RATE,
  EASTER_EGG_ROTATED_RATE,
} from "@/components/EasterEggImage";

describe("determinesEasterEggDisplay", () => {
  it("returns the same result for the same session and question", () => {
    const result = determinesEasterEggDisplay("test-session-id", 3);

    expect(determinesEasterEggDisplay("test-session-id", 3)).toEqual(result);
  });

  it("keeps the deterministic distribution close to configured rates", () => {
    const sessionCount = 10000;
    const questionCount = 10;
    let shownCount = 0;
    let rotatedCount = 0;

    for (let sessionIndex = 0; sessionIndex < sessionCount; sessionIndex++) {
      for (
        let questionIndex = 0;
        questionIndex < questionCount;
        questionIndex++
      ) {
        const { isShown, isRotated } = determinesEasterEggDisplay(
          `session-${sessionIndex}`,
          questionIndex,
        );

        if (isShown) {
          shownCount++;
        }
        if (isRotated) {
          rotatedCount++;
        }
      }
    }

    const trialCount = sessionCount * questionCount;
    const shownRate = shownCount / trialCount;
    const rotatedRate = rotatedCount / trialCount;

    expect(shownRate).toBeGreaterThan(EASTER_EGG_DISPLAY_RATE - 0.005);
    expect(shownRate).toBeLessThan(EASTER_EGG_DISPLAY_RATE + 0.005);
    expect(rotatedRate).toBeGreaterThan(EASTER_EGG_ROTATED_RATE - 0.003);
    expect(rotatedRate).toBeLessThan(EASTER_EGG_ROTATED_RATE + 0.003);
  });
});
