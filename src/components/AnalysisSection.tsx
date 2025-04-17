import React, { useEffect, useState } from 'react';
import ATSScoreModule from './analysis/ATSScoreModule';
import ResumeFeedbackModule from './analysis/ResumeFeedbackModule';
import JobRecommendationsModule from './analysis/JobRecommendationsModule';

interface FeedbackPoint {
  type: 'success' | 'warning' | 'error';
  message: string;
}

interface ResumeFeedbackData {
  format_score: number;
  parsing_score: number;
  feedback_points: FeedbackPoint[];
  improvement_suggestions: string[];
}

interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  location: string;
  matchScore: number;
  datePosted: string;
  summary: string;
  coverLetterUrl?: string;
}

interface AnalysisResult {
  ats_score: {
    score: number;
    reasoning: { [key: string]: string | string[] };
    keywords?: {
      matched: string[];
      unmatched: string[];
    };
  };
  resume_feedback: ResumeFeedbackData;
  job_recommendations: JobRecommendation[];
}

const AnalysisSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const analyzeResume = async () => {
      try {
        const formData = new FormData();
  
        // Get the resume file from localStorage
        const resumeFile = localStorage.getItem("uploadedResume");
        if (resumeFile) {
          // If resumeFile is a string (e.g., base64 or plain text), convert it to a Blob
          // If it's a base64 string, you may need to decode it accordingly
          formData.append("resume_file", new Blob([resumeFile]), "resume.pdf");
        }
  
        formData.append("mode", "all");
  
        const response = await fetch("https://nehapatil03-404jobnotfound.hf.space/analyze", {
          method: "POST",
          body: formData,
        });
  
        const data = await response.json();
        console.log("✅ Backend Response:", data);
        setAnalysisResult(data);
        setIsVisible(true);
      } catch (error) {
        console.error("❌ Failed to fetch analysis:", error);
      }
    };
  
    analyzeResume();
  }, []);
  

  if (!isVisible || !analysisResult) {
    return null;
  }

  // === Normalize reasoning ===
  const normalizedReasoning: { [key: string]: string[] } = {};
  const rawReasoning = analysisResult.ats_score.reasoning || {};
  Object.entries(rawReasoning).forEach(([key, val]) => {
    if (Array.isArray(val)) {
      normalizedReasoning[key] = val;
    } else if (typeof val === "string") {
      normalizedReasoning[key] = val.split("\n").filter(Boolean);
    } else {
      normalizedReasoning[key] = [];
    }
  });

  // ✅ Construct ATS props
  const atsScoreProps = {
    score: analysisResult.ats_score.score,
    matched_keywords: analysisResult.ats_score.keywords?.matched || [],
    missed_keywords: analysisResult.ats_score.keywords?.unmatched || [],
    tips: normalizedReasoning["Conclusion"] || [],
    reasoning: normalizedReasoning,
  };

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
          <ATSScoreModule {...atsScoreProps} />
          <ResumeFeedbackModule feedback={analysisResult.resume_feedback} />
          <JobRecommendationsModule jobs={analysisResult.job_recommendations} />
        </div>
      </div>
    </section>
  );
};

export default AnalysisSection;
