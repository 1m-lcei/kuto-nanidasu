import {
  createDiagnosisDataProvider,
  type DiagnosisData,
} from "@/app/DiagnosisData.tsx";

export function loadDiagnosisData(): Promise<DiagnosisData> {
  return Promise.all([
    fetch("questions.json").then((res) => {
      if (!res.ok) throw new Error("Failed to fetch questions.json");
      return res.json();
    }),
    fetch("kutoTypes.json").then((res) => {
      if (!res.ok) throw new Error("Failed to fetch kutoTypes.json");
      return res.json();
    }),
  ]).then(([questions, kutoTypes]) => ({ questions, kutoTypes }));
}

// NOTES:
// テスト環境におけるURL解決の問題をバイパスするために、DiagnosisData.tsx からファイルを分離
// （`loadDiagnosisData()` がファイル読み込みで走るとモックが間に合わない）
export const DiagnosisDataProvider = createDiagnosisDataProvider(
  loadDiagnosisData(),
);
