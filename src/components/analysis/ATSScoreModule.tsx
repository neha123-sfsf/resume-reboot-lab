
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const ATSScoreModule: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock data
  const atsScore = 78;
  const matchedKeywords = [
    'React', 'TypeScript', 'UI/UX', 'Frontend Development', 'JavaScript',
    'Responsive Design', 'API Integration', 'Git', 'Agile'
  ];
  const missedKeywords = [
    'Vue.js', 'CI/CD', 'Docker', 'AWS', 'Redux'
  ];

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

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
              <span className="block text-3xl font-bold">{atsScore}%</span>
              <span className="text-sm text-gray-600">ATS Match</span>
            </div>
          )}
          
          <Button 
            onClick={toggleExpand} 
            variant="outline"
            className="p-2"
          >
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
                  <span className="text-4xl font-bold">{atsScore}%</span>
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
                    strokeDasharray={`${atsScore}, 100`}
                  />
                </svg>
              </div>
            </div>
            
            <div className="text-center mb-4">
              <h4 className="font-semibold text-lg">
                {atsScore >= 70 ? 'Good Match!' : 'Needs Improvement'}
              </h4>
              <p className="text-gray-600">
                Your resume matches {atsScore}% of keywords from the job description.
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
                {matchedKeywords.map(keyword => (
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
                {missedKeywords.map(keyword => (
                  <Badge key={keyword} className="bg-red-100 text-red-800 hover:bg-red-200">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white bg-opacity-70 p-4 rounded-lg">
            <h4 className="font-semibold text-lg mb-2">Optimization Tips</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Include more of the missing keywords naturally in your resume.</li>
              <li>Format your resume to be easily readable by ATS systems.</li>
              <li>Use standard section headings that ATS systems recognize.</li>
              <li>Remove graphics, tables, and complex formatting that can confuse ATS systems.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSScoreModule;
