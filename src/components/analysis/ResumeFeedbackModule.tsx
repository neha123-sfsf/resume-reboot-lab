import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, FileCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const ResumeFeedbackModule: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackData, setFeedbackData] = useState<any>(null);

  useEffect(() => {
    fetchResumeFeedback();
  }, []);

  const fetchResumeFeedback = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("mode", "resume_feedback");

      const response = await fetch("https://nehapatil03-404jobnotfound.hf.space/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to fetch resume feedback");

      const result = await response.json();

      if (Array.isArray(result.feedback_points)) {
        setFeedbackData(result);
      } else {
        toast.error("Unexpected resume feedback response");
      }
    } catch (error) {
      console.error("Error fetching resume feedback:", error);
      toast.error("An error occurred while fetching resume feedback");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const formatScore = feedbackData?.format_score || 0;
  const parsingScore = feedbackData?.parsing_score || 0;
  const feedbackPoints = feedbackData?.feedback_points || [];
  const improvementSuggestions = feedbackData?.improvement_suggestions || [];

  return (
    <div className={cn(
      "gradient-card gradient-card-peach transition-all duration-500 animate-fade-in",
      isExpanded ? "p-8" : "p-6"
    )}>
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Resume Feedback</h3>
        <div className="flex items-center">
          {isLoading && (
            <div className="mr-4">
              <div className="w-6 h-6 border-2 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <Button
            onClick={toggleExpand}
            variant="outline"
            className="p-2"
            disabled={isLoading}
          >
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>
      </div>

      {!isExpanded && (
        <div className="mt-4">
          <p className="text-gray-700">
            {isLoading
              ? 'Loading resume feedback...'
              : 'Your resume is well-structured but has a few areas for improvement. Expand to see detailed feedback.'}
          </p>
        </div>
      )}

      {isExpanded && (
        <div className="mt-6 space-y-6 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white bg-opacity-70 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <FileCheck className="text-blue-500 mr-2" />
                <h4 className="font-semibold text-lg">Format Analysis</h4>
              </div>
              <div className="flex items-center mb-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${formatScore}%` }}></div>
                </div>
                <span className="text-sm font-medium">{formatScore}%</span>
              </div>
              <p className="text-gray-600">
                Your resume format is clean and professional. ATS-friendly structure detected.
              </p>
            </div>

            <div className="bg-white bg-opacity-70 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <FileCheck className="text-green-500 mr-2" />
                <h4 className="font-semibold text-lg">Parsing Test</h4>
              </div>
              <div className="flex items-center mb-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${parsingScore}%` }}></div>
                </div>
                <span className="text-sm font-medium">{parsingScore}%</span>
              </div>
              <p className="text-gray-600">
                Your resume parsed successfully. Key sections were detected correctly.
              </p>
            </div>
          </div>

          <div className="bg-white bg-opacity-70 p-4 rounded-lg">
            <h4 className="font-semibold text-lg mb-4">Detailed Feedback</h4>
            <ul className="space-y-3">
              {feedbackPoints.map((point: any, index: number) => (
                <li key={index} className="flex items-start">
                  {point.type === 'success' && <CheckCircle className="text-green-500 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />}
                  {point.type === 'warning' && <AlertCircle className="text-yellow-500 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />}
                  {point.type === 'error' && <AlertCircle className="text-red-500 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />}
                  <span className={cn(
                    point.type === 'success' && "text-green-800",
                    point.type === 'warning' && "text-yellow-800",
                    point.type === 'error' && "text-red-800"
                  )}>
                    {point.message}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white bg-opacity-70 p-4 rounded-lg">
            <h4 className="font-semibold text-lg mb-2">Improvement Suggestions</h4>
            <ul className="list-disc pl-5 space-y-1">
              {improvementSuggestions.map((suggestion: string, index: number) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeFeedbackModule;
