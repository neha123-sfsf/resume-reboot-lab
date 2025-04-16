import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Briefcase, FileDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchJobRecommendations = async () => {
    setIsLoading(true);
    try {
      const result = await apiService.getJobRecommendations();
      if (result.status === "success" && Array.isArray(result.data)) {
        const parsedJobs: JobRecommendation[] = result.data.map((job: any, index: number) => ({
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
        toast.error(result.message || "Failed to load job recommendations");
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
      const result = await apiService.generateCoverLetterForJob(jobId);
      if (result.status === "success" && result.data) {
        const { path, cover_letter } = result.data as any;
        if (path) {
          const downloadUrl = `https://nehapatil03-404jobnotfound.hf.space/download/${path}`;
          window.open(downloadUrl, "_blank");
          toast.success("Cover letter downloaded");
        } else if (cover_letter) {
          const blob = new Blob([cover_letter], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
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
      } else {
        toast.error(result.message || "Cover letter not available");
      }
    } catch (error) {
      console.error("Error generating cover letter:", error);
      toast.error("An error occurred while generating the cover letter");
    } finally {
      setGeneratingCoverLetter(null);
    }
  };

  return (
    <section className="my-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Briefcase className="w-6 h-6" />
          Job Recommendations
        </h2>
        <Button variant="ghost" onClick={toggleExpand} aria-expanded={isExpanded}>
          {isExpanded ? (
            <>
              Hide <ChevronUp className="ml-2 w-4 h-4" />
            </>
          ) : (
            <>
              Show <ChevronDown className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className={cn("transition-all", isLoading && "opacity-50 pointer-events-none")}>
          {isLoading ? (
            <div className="text-center py-8">Loading job recommendations...</div>
          ) : jobListings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No job recommendations found.</div>
          ) : (
            <ul className="space-y-6">
              {jobListings.map((job) => (
                <li key={job.id} className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <div className="text-gray-600">{job.company} &mdash; {job.location}</div>
                    <div className="text-sm text-gray-400 mb-2">Posted: {job.datePosted}</div>
                    <div className="text-sm text-gray-700 mb-2">Match Score: <span className="font-bold">{job.matchScore}%</span></div>
                    <div className="text-gray-800 mb-2">{job.summary}</div>
                  </div>
                  <div className="flex flex-col gap-2 mt-4 md:mt-0 md:ml-6">
                    <Button
                      variant="outline"
                      onClick={() => handleDownloadCoverLetter(job.id)}
                      disabled={generatingCoverLetter === job.id}
                      className="flex items-center gap-2"
                    >
                      <FileDown className="w-4 h-4" />
                      {generatingCoverLetter === job.id ? "Generating..." : "Download Cover Letter"}
                    </Button>
                    {job.coverLetterUrl && (
                      <a
                        href={job.coverLetterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 flex items-center gap-1 text-sm hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Cover Letter
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
};

export default JobRecommendationsModule;
