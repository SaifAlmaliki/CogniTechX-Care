import React, { useState } from "react";

import { FileUploader } from "@/components/FileUploader";

const ReportAnalysisPage = () => {
  const [analysisResult, setAnalysisResult] = useState("");

  const handleFilesChange = async (files: File[]) => {
    if (files.length > 0) {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      try {
        const response = await fetch("/api/report-analysis", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        setAnalysisResult(data.analysis);
      } catch (error) {
        console.error("Error analyzing report:", error);
      }
    }
  };

  return (
    <div>
      <h1>Upload Medical Report</h1>
      <FileUploader files={[]} onChange={handleFilesChange} />
      <h2>Analysis Result</h2>
      <p>{analysisResult}</p>
    </div>
  );
};

export default ReportAnalysisPage;
