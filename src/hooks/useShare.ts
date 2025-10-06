import { useCallback } from "react";
import type { KutoTypeInfo } from "@/types/KutoDiagnosisTypes";
import { isMobile } from "@/utils/device";

type UseShareResult = {
  share: () => void;
};

/**
 * 診断結果を共有するためのロジックを提供するカスタムフック
 * @param resultType - 共有する診断結果のタイプオブジェクト
 * @param topRate - 診断結果の一致率
 */
export function useShare(
  resultType: KutoTypeInfo,
  topRate: number,
): UseShareResult {
  const share = useCallback(async () => {
    const text = `✅ あなたの対抗戦タイプは ―― ${resultType.flavorText}「${resultType.displayName}」タイプ！ (${topRate}%)\n\n何出す超会議 (S9)  #kuto_nanidasu\nhttps://1m-lcei.github.io/kuto-nanidasu/`;

    if (isMobile() && navigator.share) {
      try {
        await navigator.share({
          text: text,
        });
      } catch (error) {
        // AbortErrorはユーザーが共有をキャンセルした場合なので無視
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error("Web Share API failed:", error);
        }
      }
    } else {
      const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(
        text,
      )}`;
      window.open(twitterUrl, "_blank", "noopener");
    }
  }, [resultType, topRate]);

  return { share };
}
