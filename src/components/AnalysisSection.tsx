
import React, { useEffect, useState } from 'react';
import ATSScoreModule from './analysis/ATSScoreModule';
import ResumeFeedbackModule from './analysis/ResumeFeedbackModule';
import JobRecommendationsModule from './analysis/JobRecommendationsModule';

const AnalysisSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has submitted a resume
    const checkSubmission = async () => {
      // In a real app, we would check if there's data from the API
      // For now, we'll just make it visible
      setIsVisible(true);
    };

    checkSubmission();
  }, []);

  if (!isVisible) {
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
          <ATSScoreModule />
          <ResumeFeedbackModule />
          <JobRecommendationsModule />
        </div>
      </div>
    </section>
  );
};

export default AnalysisSection;
