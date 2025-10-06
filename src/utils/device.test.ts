import { afterEach, describe, expect, test } from "vitest";
import { isMobile } from "./device";

const originalUserAgent = navigator.userAgent;
const originalMaxTouchPoints = navigator.maxTouchPoints;
const originalUserAgentData = (
  navigator as Navigator & { userAgentData?: { mobile: boolean } | null }
).userAgentData;

describe("isMobile", () => {
  afterEach(() => {
    // 各テスト後にプロパティを元に戻す
    Object.defineProperty(navigator, "userAgent", {
      get: () => originalUserAgent,
      configurable: true,
    });
    Object.defineProperty(navigator, "maxTouchPoints", {
      get: () => originalMaxTouchPoints,
      configurable: true,
    });
    Object.defineProperty(navigator, "userAgentData", {
      get: () => originalUserAgentData,
      configurable: true,
    });
  });

  const mockUserAgent = (ua: string) => {
    Object.defineProperty(navigator, "userAgent", {
      get: () => ua,
      configurable: true,
    });
  };

  const mockMaxTouchPoints = (points: number) => {
    Object.defineProperty(navigator, "maxTouchPoints", {
      get: () => points,
      configurable: true,
    });
  };

  const mockUserAgentData = (data: { mobile: boolean } | null) => {
    Object.defineProperty(navigator, "userAgentData", {
      get: () => data,
      configurable: true,
    });
  };

  test("should return true for mobile user agents", () => {
    const mobileUserAgents = [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1",
      "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36",
      "Mozilla/5.0 (iPod touch; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1",
    ];

    for (const ua of mobileUserAgents) {
      mockUserAgent(ua);
      mockUserAgentData(null);
      expect(isMobile()).toBe(true);
    }
  });

  test("should return true for iPad user agent with touch points", () => {
    const ipadUserAgent =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15";
    mockUserAgent(ipadUserAgent);
    mockMaxTouchPoints(5);
    mockUserAgentData(null);
    expect(isMobile()).toBe(true);
  });

  test("should return false for desktop user agents", () => {
    const desktopUserAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    ];

    for (const ua of desktopUserAgents) {
      mockUserAgent(ua);
      mockMaxTouchPoints(0);
      mockUserAgentData(null);
      expect(isMobile()).toBe(false);
    }
  });

  test("should return false for non-touch Mac", () => {
    const macUserAgent =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15";
    mockUserAgent(macUserAgent);
    mockMaxTouchPoints(0);
    mockUserAgentData(null);
    expect(isMobile()).toBe(false);
  });

  test("should use userAgentData when available", () => {
    mockUserAgentData({ mobile: true });
    expect(isMobile()).toBe(true);

    mockUserAgentData({ mobile: false });
    mockUserAgent("Desktop");
    mockMaxTouchPoints(0);
    expect(isMobile()).toBe(false);
  });
});
