import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import { useDiagnosisState } from "@/app/DiagnosisState";
import QuestionPage from "@/components/QuestionPage";
import ResultPage from "@/components/ResultPage";
import StartPage from "@/components/StartPage";

function AppRouter() {
  const navigate = useNavigate();
  const { status } = useDiagnosisState();

  useEffect(() => {
    switch (status) {
      case "idle":
        navigate("/", { replace: true });
        break;
      case "in-progress":
        navigate("/question", { replace: true });
        break;
      case "completed":
        navigate("/result", { replace: true });
        break;
      default:
        break;
    }
  }, [status, navigate]);

  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/question" element={<QuestionPage />} />
      <Route path="/questions" element={<Navigate to="/question" replace />} />
      <Route path="/result" element={<ResultPage />} />
    </Routes>
  );
}

export default AppRouter;
