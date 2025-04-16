
import React, { useEffect, useState } from 'react';
import ATSScoreModule from './analysis/ATSScoreModule';
import ResumeFeedbackModule from './analysis/ResumeFeedbackModule';
import JobRecommendationsModule from './analysis/JobRecommendationsModule';

const AnalysisSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    const analyzeResume = async () => {
      const resumeFile = localStorage.getItem("uploadedResume");
      const jobDescription = localStorage.getItem("jobDescription") || "";
      const applicationStatus = localStorage.getItem("applicationStatus") || "";

      if (!resumeFile) return;

      const formData = new FormData();
      formData.append("resume_file", new Blob([resumeFile]), "resume.pdf");
      formData.append("job_description", jobDescription);
      formData.append("application_status", applicationStatus);

      const response = await fetch("https://nehapatil03-404jobnotfound.hf.space/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("✅ Backend Response:", data);
      setAnalysisResult(data);
      setIsVisible(true);
    };

    analyzeResume();
  }, []);

  if (!isVisible || !analysisResult) {
    return null;
  }

  return (
    <section 
      id="analysis" 
      className="min-h-screen py-24 px-6 bg-gradient-to-br from-white to-soft-blue"
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center animate-fade-in">
          Your Resume Analysis
        </h2>
        
        <div className="space-y-10">
          <ATSScoreModule score={analysisResult.ats_score} />
          <ResumeFeedbackModule feedback={analysisResult.resume_feedback} />
          <JobRecommendationsModule jobs={analysisResult.job_recommendations} />
        </div>
      </div>
    </section>
  );
};

export default AnalysisSection;
