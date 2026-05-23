import { useRef, useState } from "react";
import { useDiagnosisDispatch } from "@/app/DiagnosisState";
import ContactModal from "@/components/ContactModal";
import Logo from "@/components/Logo";
import useResult from "@/hooks/useResult";
import { useShare } from "@/hooks/useShare";
import Picture from "./Picture";

function ResultPage() {
  const { resultTypeId, resultType, resultMatchRate, matchRates } = useResult();
  const dispatch = useDiagnosisDispatch();
  const { share } = useShare(resultType, resultMatchRate);

  const { displayName, flavorText, expertName, expertAccountLink } = resultType;

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [showExpertName, setShowExpertName] = useState(false);

  const handleOnChangeExpertNameShown = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setShowExpertName(e.target.checked);
  };
  const handleOnClickRestart = () => {
    dispatch({ type: "RESTART_DIAGNOSIS" });
  };
  const handleOnClickToShowContactModal = () => {
    dialogRef.current?.showModal();
  };

  return (
    <>
      <div className="flex flex-col items-center gap-2 md:gap-4 px-4 py-4 md:py-8">
        <h1 className="sr-only">何出す超会議 (S9) - 診断結果</h1>
        <Logo />
        <div className="card md:card-border md:card-side md:border-1 md:border-neutral-400 md-2 md:md-0">
          <figure>
            <Picture
              pathWithoutExtension={`images/icons/${resultTypeId}`}
              sourceExtension="jpg"
              alt={displayName}
              className="max-w-[224px] sm:max-w-[256px] md:max-w-[288px] lg:max-w-[320px] mb-4 md:mb-0 rounded-2xl md:rounded-none"
            />
          </figure>
          <div className="card-body p-2 md:p-6 items-center justify-center gap-4 md:gap-8">
            <p className="grow-0 text-sm md:text-base">
              <span className="md:text-lg font-semibold pr-1 underline decoration-accent decoration-4 underline-offset-0">
                {flavorText}
              </span>
              あなたは……
            </p>
            <div className="flex items-baseline">
              <h2 className="card-title text-5xl md:text-6xl font-bold">
                {displayName}
              </h2>
              <p className="w-fit grow-0 text-lg">タイプです！</p>
            </div>
            <p className="grow-0 text-xs md:text-sm">
              診断モデルの先生:
              {expertAccountLink ? (
                <a
                  href={expertAccountLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-info ml-1 md:text-lg font-semibold"
                >
                  {expertName}
                  <span className="sr-only">（新しいウィンドウで開きます）</span>
                </a>
              ) : (
                <span className="ml-1 md:text-lg">{expertName}</span>
              )}
            </p>
          </div>
        </div>
        <h3 className="hidden">一致率</h3>
        <div className="w-full max-w-md md:max-w-3xl mb-4">
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-1 md:gap-x-4 md:gap-y-2">
            {Array.from(matchRates.entries()).map(
              ([id, { kutoType, rate }]) => (
                <li
                  key={id}
                  className="w-full p-2 box-border border border-neutral-400 text-xs md:text-base flex justify-between items-center"
                >
                  <span>
                    {showExpertName
                      ? kutoType.expertName
                      : kutoType.displayName}
                  </span>
                  <span className="flex items-baseline gap-0.5 text-xs md:text-sm">
                    <span className="text-neutral-400">一致率:</span>
                    <span className="inline-block w-[3ch] text-right text-sm md:text-base">
                      {rate}
                    </span>
                    %
                  </span>
                </li>
              ),
            )}
          </ul>
          <div className="flex justify-end pt-2">
            <label className="label text-xs md:text-sm">
              <input
                type="checkbox"
                name="showExpertNameToggle"
                checked={showExpertName}
                onChange={handleOnChangeExpertNameShown}
                className="toggle toggle-sm md:toggle-md"
              />
              診断モデルの先生名を表示
            </label>
          </div>
        </div>
        <div className="flex gap-4 mb-1">
          <button
            type="button"
            onClick={handleOnClickRestart}
            className="btn btn-neutral transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
          >
            もう一度診断する
          </button>
          <a
            href="https://note.com/1m_lcei/n/n17eafb434e54"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-neutral transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
          >
            📝解説 (note記事)
            <span className="sr-only">（新しいウィンドウで開きます）</span>
          </a>
        </div>
        <button
          type="button"
          onClick={share}
          className="btn btn-link transition-all duration-200 hover:scale-[1.05] active:scale-[0.95]"
        >
          結果をシェアする
        </button>
        <button
          type="button"
          className="link link-hover text-sm"
          onClick={handleOnClickToShowContactModal}
        >
          連絡先・使用画像
        </button>
      </div>
      <ContactModal ref={dialogRef} />
    </>
  );
}

export default ResultPage;
