
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Briefcase, FileDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getJobRecommendations, generateCoverLetter, JobRecommendation } from '@/lib/api';

const JobRecommendationsModule: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jobListings, setJobListings] = useState<JobRecommendation[]>([]);
  const [generatingCoverLetter, setGeneratingCoverLetter] = useState<string | null>(null);

  useEffect(() => {
    fetchJobRecommendations();
  }, []);

  const fetchJobRecommendations = async () => {
    setIsLoading(true);
    try {
      const response = await getJobRecommendations();
      if (response.status === 'success' && response.data) {
        setJobListings(response.data);
      } else {
        toast.error('Failed to load job recommendations');
      }
    } catch (error) {
      console.error('Error fetching job recommendations:', error);
      toast.error('An error occurred while fetching job recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDownloadCoverLetter = async (jobId: string) => {
    setGeneratingCoverLetter(jobId);
    try {
      const response = await generateCoverLetter(jobId);
      if (response.status === 'success' && response.data) {
        if (response.data.download_url) {
          window.open(response.data.download_url, '_blank');
          toast.success('Cover letter downloaded');
        } else if (response.data.content) {
          // If we get content instead of URL, create downloadable file
          const blob = new Blob([response.data.content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Cover_Letter_${jobId}.docx`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          toast.success('Cover letter downloaded');
        } else {
          toast.error('Cover letter format not supported');
        }
      } else {
        toast.error('Failed to generate cover letter');
      }
    } catch (error) {
      console.error('Error generating cover letter:', error);
      toast.error('An error occurred while generating the cover letter');
    } finally {
      setGeneratingCoverLetter(null);
    }
  };

  return (
    <div className={cn(
      "gradient-card gradient-card-green transition-all duration-500 animate-fade-in",
      isExpanded ? "p-8" : "p-6"
    )}>
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Job Recommendations</h3>
        
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
        <div className="mt-6 space-y-4">
          {jobListings.slice(0, 2).map(job => (
            <div key={job.id} className="bg-white bg-opacity-70 p-4 rounded-lg flex items-start justify-between hover-scale">
              <div>
                <h4 className="font-semibold">{job.title}</h4>
                <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
              </div>
              <div className="text-right">
                <span className={cn(
                  "inline-block rounded-full px-3 py-1 text-sm font-semibold",
                  job.matchScore >= 90 ? "bg-green-100 text-green-800" :
                  job.matchScore >= 80 ? "bg-blue-100 text-blue-800" :
                  "bg-yellow-100 text-yellow-800"
                )}>
                  {job.matchScore}% Match
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {isExpanded && (
        <div className="mt-6 space-y-6 animate-fade-in">
          <div className="bg-white bg-opacity-70 p-4 rounded-lg">
            <h4 className="flex items-center font-semibold text-lg mb-4">
              <Briefcase className="mr-2 h-5 w-5" />
              Top Job Matches
            </h4>
            
            <div className="space-y-4">
              {jobListings.map(job => (
                <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                  <div className="flex justify-between">
                    <div>
                      <h5 className="font-semibold text-lg">{job.title}</h5>
                      <p className="text-gray-600">{job.company}</p>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "inline-block rounded-full px-3 py-1 text-sm font-semibold",
                        job.matchScore >= 90 ? "bg-green-100 text-green-800" :
                        job.matchScore >= 80 ? "bg-blue-100 text-blue-800" :
                        "bg-yellow-100 text-yellow-800"
                      )}>
                        {job.matchScore}% Match
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-500">{job.location} • Posted {job.datePosted}</p>
                      <p className="mt-2 text-gray-700">{job.summary}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center"
                      onClick={() => handleDownloadCoverLetter(job.id)}
                      disabled={generatingCoverLetter === job.id}
                    >
                      {generatingCoverLetter === job.id ? (
                        <div className="w-4 h-4 border-2 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <FileDown className="mr-1 h-4 w-4" />
                      )}
                      {generatingCoverLetter === job.id ? 'Generating...' : 'Cover Letter'}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center"
                      disabled={!job.coverLetterUrl}
                    >
                      <ExternalLink className="mr-1 h-4 w-4" />
                      View Job
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white bg-opacity-70 p-4 rounded-lg">
            <h4 className="font-semibold text-lg mb-2">Why These Jobs?</h4>
            <p className="text-gray-700">
              These job recommendations are based on the skills and experience in your resume, matched with the keywords in the job descriptions. The match score indicates how well your profile aligns with each job's requirements.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobRecommendationsModule;
