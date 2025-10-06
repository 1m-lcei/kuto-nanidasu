import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type { KutoTypeInfo } from "@/types/KutoDiagnosisTypes";
import * as device from "@/utils/device";
import { useShare } from "./useShare";

// モックの準備
vi.mock("@/utils/device");

describe("useShare", () => {
  const mockResultType: KutoTypeInfo = {
    displayName: "アリス",
    flavorText: "なりたい存在は自分自身で決める",
    expertName: "（なし）",
    expertAccountLink: "",
  };
  const mockTopRate = 98;

  beforeEach(() => {
    // Web Share APIのモック
    Object.defineProperty(navigator, "share", {
      value: vi.fn().mockResolvedValue(undefined),
      writable: true,
      configurable: true,
    });
    // window.openのモック
    vi.spyOn(window, "open").mockImplementation(vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const expectedText = `✅ あなたの対抗戦タイプは ―― なりたい存在は自分自身で決める「アリス」タイプ！ (98%)\n\n何出す超会議 (S9)  #kuto_nanidasu\nhttps://1m-lcei.github.io/kuto-nanidasu/`;

  test("should call Web Share API on mobile", () => {
    vi.spyOn(device, "isMobile").mockReturnValue(true);

    const { result } = renderHook(() => useShare(mockResultType, mockTopRate));
    result.current.share();

    expect(navigator.share).toHaveBeenCalledWith({
      text: expectedText,
    });
    expect(window.open).not.toHaveBeenCalled();
  });

  test("should open Twitter Intent URL on desktop", () => {
    vi.spyOn(device, "isMobile").mockReturnValue(false);

    const { result } = renderHook(() => useShare(mockResultType, mockTopRate));
    result.current.share();

    const expectedUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(
      expectedText,
    )}`;

    expect(window.open).toHaveBeenCalledWith(expectedUrl, "_blank", "noopener");
    expect(navigator.share).not.toHaveBeenCalled();
  });

  test("should open Twitter Intent URL when Web Share API is not available", () => {
    vi.spyOn(device, "isMobile").mockReturnValue(true);
    Object.defineProperty(navigator, "share", {
      value: undefined,
      configurable: true,
    });

    const { result } = renderHook(() => useShare(mockResultType, mockTopRate));
    result.current.share();

    const expectedUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(
      expectedText,
    )}`;

    expect(window.open).toHaveBeenCalledWith(expectedUrl, "_blank", "noopener");
  });
});
