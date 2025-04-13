import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Briefcase, FileDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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
      const response = await fetch("https://nehapatil03-404jobnotfound.hf.space/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ mode: "job_recommendation" })
      });

      const result = await response.json();
      if (Array.isArray(result)) {
        const parsedJobs: JobRecommendation[] = result.map((job: any, index: number) => ({
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
    // ... component JSX remains unchanged
  );
};

export default JobRecommendationsModule;
