import { useDiagnosisDispatch } from "@/app/DiagnosisState";
import Logo from "@/components/Logo";

function StartPage() {
  const dispatch = useDiagnosisDispatch();

  return (
    <div className="flex flex-col items-center justify-center gap-4 md:gap-8 px-8 text-center">
      <Logo />
      <p className="text-sm md:text-base">
        あなたの<span className="font-bold">戦術対抗戦タイプ</span>
        🧠を診断します。
      </p>
      <button
        type="button"
        onClick={() => dispatch({ type: "START_DIAGNOSIS" })}
        className="btn btn-neutral"
      >
        診断を始める
      </button>
    </div>
  );
}

export default StartPage;
