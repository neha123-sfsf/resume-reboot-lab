import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface ATSScoreProps {
  score: number;
  matched_keywords: string[];
  missed_keywords: string[];
  tips: string[];
  reasoning: { [key: string]: string[] };
}

const ATSScoreModule: React.FC<ATSScoreProps> = ({
  score,
  matched_keywords,
  missed_keywords,
  tips,
  reasoning
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className={cn(
      "gradient-card gradient-card-blue transition-all duration-500 animate-fade-in",
      isExpanded ? "p-8" : "p-6"
    )}>
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">ATS Score Analysis</h3>
        <div className="flex items-center">
          {!isExpanded && (
            <div className="mr-4 text-center">
              <span className="block text-3xl font-bold">{score}%</span>
              <span className="text-sm text-gray-600">ATS Match</span>
            </div>
          )}
          <Button onClick={toggleExpand} variant="outline" className="p-2">
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 space-y-6 animate-fade-in">
          <div className="bg-white bg-opacity-70 p-4 rounded-lg">
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold">{score}%</span>
                </div>
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#EAEAEA"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#33C3F0"
                    strokeWidth="3"
                    strokeDasharray={`${score}, 100`}
                  />
                </svg>
              </div>
            </div>
            <div className="text-center mb-4">
              <h4 className="font-semibold text-lg">
                {score >= 70 ? 'Good Match!' : 'Needs Improvement'}
              </h4>
              <p className="text-gray-600">
                Your resume matches {score}% of keywords from the job description.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white bg-opacity-70 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <Check className="text-green-500 mr-2" />
                <h4 className="font-semibold text-lg">Keywords Matched</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {matched_keywords.map((keyword) => (
                  <Badge key={keyword} className="bg-green-100 text-green-800 hover:bg-green-200">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-white bg-opacity-70 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <X className="text-red-500 mr-2" />
                <h4 className="font-semibold text-lg">Keywords Missing</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {missed_keywords.length > 0 ? missed_keywords.map((keyword) => (
                  <Badge key={keyword} className="bg-red-100 text-red-800 hover:bg-red-200">
                    {keyword}
                  </Badge>
                )) : <p className="text-gray-500 text-sm">Not available</p>}
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-70 p-4 rounded-lg">
            <h4 className="font-semibold text-lg mb-2">Detailed Reasoning</h4>
            {Object.entries(reasoning).map(([section, lines]) => (
              <div key={section} className="mb-4">
                <h5 className="font-medium">{section}</h5>
                {lines.map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            ))}
          </div>

          <div className="bg-white bg-opacity-70 p-4 rounded-lg">
            <h4 className="font-semibold text-lg mb-2">Optimization Tips</h4>
            <ul className="list-disc pl-5 space-y-1">
              {tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSScoreModule;
