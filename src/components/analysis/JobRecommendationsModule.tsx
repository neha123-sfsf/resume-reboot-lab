
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Briefcase, FileDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { apiService } from '@/lib/api';

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
      const response = await apiService.getJobRecommendations();
      if (response.status === "success" && Array.isArray(response.data)) {
        const parsedJobs: JobRecommendation[] = response.data.map((job: any, index: number) => ({
          id: `job-${index}`,
          title: job.title || job.job_title || "Untitled",
          company: job.company || job.employer_name || "Unknown Company",
          location: job.location || job.job_city || "Unknown Location",
          matchScore: job.match_score || Math.floor(Math.random() * 21) + 80,
          datePosted: job.posted || "Recently",
          summary: job.description || job.summary || "No summary available.",
          coverLetterUrl: job.cover_letter_url || ""
        }));
        setJobListings(parsedJobs);
      } else {
        toast.error("Failed to load job recommendations");
      }
    } catch (error) {
      console.error("Error fetching job recommendations:", error);
      toast.error("An error occurred while fetching job recommendations");
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
      const response = await fetch("https://nehapatil03-404jobnotfound.hf.space/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ mode: "cover_letter", job_id: jobId })
      });

      const result = await response.json();
      if (result?.path) {
        const downloadUrl = `https://nehapatil03-404jobnotfound.hf.space/download/${result.path}`;
        window.open(downloadUrl, "_blank");
        toast.success("Cover letter downloaded");
      } else if (result?.cover_letter) {
        const blob = new Blob([result.cover_letter], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Cover_Letter_${jobId}.docx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.success("Cover letter downloaded");
      } else {
        toast.error("Cover letter not available");
      }
    } catch (error) {
      console.error("Error generating cover letter:", error);
      toast.error("An error occurred while generating the cover letter");
    } finally {
      setGeneratingCoverLetter(null);
    }
  };

  return (
    <Card className={cn("mb-6", isExpanded ? "bg-white" : "bg-gradient-to-br from-blue-50 to-violet-50")}>
      <CardHeader 
        className={cn(
          "cursor-pointer flex flex-row items-center justify-between", 
          isExpanded ? "border-b" : ""
        )}
        onClick={toggleExpand}
      >
        <div className="flex items-center">
          <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
          <CardTitle className="text-xl">Job Recommendations</CardTitle>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </CardHeader>
      
      <CardContent className={cn(
        "transition-all duration-300 overflow-hidden",
        isExpanded ? "max-h-[2000px]" : "max-h-[190px]"
      )}>
        {isLoading ? (
          <div className="space-y-4 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
                <Skeleton className="h-10 w-[140px] rounded-md" />
              </div>
            ))}
          </div>
        ) : jobListings.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>No job recommendations found.</p>
            <Button onClick={fetchJobRecommendations} variant="outline" className="mt-4">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {jobListings.slice(0, isExpanded ? jobListings.length : 2).map((job) => (
              <div key={job.id} className="border rounded-md p-4 shadow-sm bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <p className="text-sm text-gray-600">
                      {job.company} • {job.location}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Posted {job.datePosted}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded">
                      {job.matchScore}% Match
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mt-3 line-clamp-2">{job.summary}</p>
                
                <div className="flex justify-between mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://www.google.com/search?q=${encodeURIComponent(`${job.title} ${job.company} job`)}`, "_blank");
                    }}
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    View Job
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadCoverLetter(job.id);
                    }}
                    disabled={generatingCoverLetter === job.id}
                  >
                    {generatingCoverLetter === job.id ? (
                      "Generating..."
                    ) : (
                      <>
                        <FileDown className="h-3.5 w-3.5 mr-1" />
                        Cover Letter
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
            
            {!isExpanded && jobListings.length > 2 && (
              <Button 
                variant="ghost" 
                onClick={toggleExpand} 
                className="w-full text-sm text-blue-600 hover:text-blue-800"
              >
                Show {jobListings.length - 2} more jobs
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobRecommendationsModule;
