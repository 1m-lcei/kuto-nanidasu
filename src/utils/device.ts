/**
 * 現在のデバイスがモバイルまたはタブレット端末であるかを判定する
 * @returns モバイルまたはタブレットであればtrue
 */
export function isMobile(): boolean {
  // 1. User-Agent Client Hints API (利用可能であれば最も優先)
  if (navigator?.userAgentData?.mobile) {
    return true;
  }

  // 2. iPad/iPadOSの判定 (MacのUA + マルチタッチ)
  if (
    /macintosh/i.test(navigator.userAgent) &&
    navigator.maxTouchPoints &&
    navigator.maxTouchPoints > 1
  ) {
    return true;
  }

  // 3. その他のモバイル端末の判定 (正規表現フォールバック)
  return /iphone|ipod|(android|nokia|blackberry|bb10;).+mobile|android.+fennec|opera.+mobi|windows phone|symbianos/i.test(
    navigator.userAgent,
  );
}
