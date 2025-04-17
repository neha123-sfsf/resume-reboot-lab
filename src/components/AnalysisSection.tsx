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
  resume_feedback: ResumeFeedbackData | string;
  job_recommendations: JobRecommendation[] | string;
}

// Helper to parse resume feedback (string or object)
const parseResumeFeedback = (feedback: ResumeFeedbackData | string): ResumeFeedbackData => {
  if (typeof feedback === 'object' && feedback !== null) {
    return feedback;
  }
  const lines = (feedback as string).split('\n').map(line => line.trim()).filter(Boolean);
  return {
    format_score: 80,
    parsing_score: 80,
    feedback_points: lines.length
      ? [{ type: 'success', message: lines[0] }]
      : [{ type: 'warning', message: 'No feedback available.' }],
    improvement_suggestions: lines.slice(1),
  };
};

// Helper to parse job recommendations (array or string)
const parseJobRecommendations = (jobs: JobRecommendation[] | string): JobRecommendation[] => {
  if (Array.isArray(jobs)) {
    return jobs;
  }
  if (typeof jobs === "string") {
    const lines = jobs.split('\n').map(line => line.trim()).filter(Boolean);
    return lines.map((line, idx) => ({
      id: `rec-${idx}`,
      title: line,
      company: "N/A",
      location: "N/A",
      matchScore: 0,
      datePosted: "",
      summary: line,
      coverLetterUrl: undefined,
    }));
  }
  return [];
};

const AnalysisSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const analyzeResume = async () => {
      try {
        const formData = new FormData();
        formData.append("mode", "all");

        // Optionally add resume_file if you want to send it
        const resumeFile = localStorage.getItem("uploadedResume");
        if (resumeFile) {
          formData.append("resume_file", new Blob([resumeFile]), "resume.pdf");
        }

        const response = await fetch("https://nehapatil03-404jobnotfound.hf.space/analyze", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
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

  // Normalize reasoning for ATSScoreModule
  const normalizedReasoning: { [key: string]: string[] } = {};
  const rawReasoning = analysisResult.ats_score?.reasoning || {};
  Object.entries(rawReasoning).forEach(([key, val]) => {
    if (Array.isArray(val)) {
      normalizedReasoning[key] = val;
    } else if (typeof val === "string") {
      normalizedReasoning[key] = val.split("\n").filter(Boolean);
    } else {
      normalizedReasoning[key] = [];
    }
  });

  const atsScoreProps = {
    score: analysisResult.ats_score.score,
    matched_keywords: analysisResult.ats_score.keywords?.matched || [],
    missed_keywords: analysisResult.ats_score.keywords?.unmatched || [],
    tips: normalizedReasoning["Conclusion"] || [],
    reasoning: normalizedReasoning,
  };

  const feedbackData = parseResumeFeedback(analysisResult.resume_feedback);
  const jobRecsData = parseJobRecommendations(analysisResult.job_recommendations);

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
          <ResumeFeedbackModule feedback={feedbackData} />
          <JobRecommendationsModule jobs={jobRecsData} />
        </div>
      </div>
    </section>
  );
};

export default AnalysisSection;
