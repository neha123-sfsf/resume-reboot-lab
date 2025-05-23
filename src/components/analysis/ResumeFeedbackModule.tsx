import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  FileCheck,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

interface ResumeFeedbackModuleProps {
  feedback: ResumeFeedbackData;
}

const ResumeFeedbackModule: React.FC<ResumeFeedbackModuleProps> = ({ feedback }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  const formatScore = feedback.format_score || 0;
  const parsingScore = feedback.parsing_score || 0;
  const feedbackPoints = feedback.feedback_points || [];
  const improvementSuggestions = feedback.improvement_suggestions || [];

  return (
    <div
      className={cn(
        'gradient-card gradient-card-peach transition-all duration-500 animate-fade-in',
        isExpanded ? 'p-8' : 'p-6'
      )}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Resume Feedback</h3>
        <Button
          onClick={toggleExpand}
          variant="outline"
          className="p-2"
        >
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>

      {!isExpanded && (
        <div className="mt-4">
          <p className="text-gray-700">
            Your resume is well-structured but has a few areas for improvement.
            Expand to see detailed feedback.
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
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{ width: `${formatScore}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{formatScore}%</span>
              </div>
              <p className="text-gray-600">
                Your resume format is clean and professional. ATS-friendly
                structure detected.
              </p>
            </div>

            <div className="bg-white bg-opacity-70 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <FileCheck className="text-green-500 mr-2" />
                <h4 className="font-semibold text-lg">Parsing Test</h4>
              </div>
              <div className="flex items-center mb-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: `${parsingScore}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{parsingScore}%</span>
              </div>
              <p className="text-gray-600">
                Your resume parsed successfully. Key sections were detected
                correctly.
              </p>
            </div>
          </div>

          <div className="bg-white bg-opacity-70 p-4 rounded-lg">
            <h4 className="font-semibold text-lg mb-4">Detailed Feedback</h4>
            <ul className="space-y-3">
              {feedbackPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  {point.type === 'success' && (
                    <CheckCircle className="text-green-500 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                  )}
                  {point.type === 'warning' && (
                    <AlertCircle className="text-yellow-500 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                  )}
                  {point.type === 'error' && (
                    <AlertCircle className="text-red-500 mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                  )}
                  <span
                    className={cn(
                      point.type === 'success' && 'text-green-800',
                      point.type === 'warning' && 'text-yellow-800',
                      point.type === 'error' && 'text-red-800'
                    )}
                  >
                    {point.message}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white bg-opacity-70 p-4 rounded-lg">
            <h4 className="font-semibold text-lg mb-2">Improvement Suggestions</h4>
            <ul className="list-disc pl-5 space-y-1">
              {improvementSuggestions.map((suggestion, index) => (
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
