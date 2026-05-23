import { useDiagnosisDispatch } from "@/app/DiagnosisState";
import Logo from "@/components/Logo";

function StartPage() {
  const dispatch = useDiagnosisDispatch();

  const handleOnClick = () => {
    dispatch({ type: "START_DIAGNOSIS" });
  };

  return (
    <div className="flex flex-col items-center gap-4 md:gap-8 px-4 py-4 md:py-8">
      <h1 className="sr-only">何出す超会議 (S9) 戦術対抗戦診断</h1>
      <Logo />
      <p className="text-sm md:text-base">
        あなたの
        <span className="font-bold text-base md:text-lg mx-1">
          戦術対抗戦タイプ🧠
        </span>
        を診断します。
      </p>
      <button
        type="button"
        className="btn btn-neutral transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
        onClick={handleOnClick}
      >
        診断を始める
      </button>
    </div>
  );
}

export default StartPage;
