import { useDiagnosisDispatch } from "@/app/DiagnosisState";
import Logo from "@/components/Logo";

function StartPage() {
  const dispatch = useDiagnosisDispatch();

  const handleOnClick = () => {
    dispatch({ type: "START_DIAGNOSIS" });
  };

  return (
    <div className="flex flex-col items-center gap-4 md:gap-8 px-4 py-4 md:py-8">
      <Logo />
      <p className="text-sm md:text-base">
        あなたの
        <span className="font-bold text-base md:text-lg mx-1">
          戦術対抗戦タイプ🧠
        </span>
        を診断します。
      </p>
      <button type="button" className="btn btn-neutral" onClick={handleOnClick}>
        診断を始める
      </button>
    </div>
  );
}

export default StartPage;
