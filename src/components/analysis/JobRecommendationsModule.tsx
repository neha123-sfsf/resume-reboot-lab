import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Briefcase,
  FileDown,
  ExternalLink,
} from 'lucide-react';
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

interface JobRecommendationsModuleProps {
  jobs: JobRecommendation[];
}

const JobRecommendationsModule: React.FC<JobRecommendationsModuleProps> = ({ jobs }) => {
  const [isExpanded, setIsExpanded] = useState(true); // Expand by default
  const [generatingCoverLetter, setGeneratingCoverLetter] = useState<string | null>(null);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDownloadCoverLetter = async (jobId: string, url?: string) => {
    if (!url) {
      toast.error("No cover letter URL available for this job.");
      return;
    }

    try {
      setGeneratingCoverLetter(jobId);
      window.open(url, '_blank');
      toast.success('Cover letter download started');
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download cover letter");
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
        <Button
          variant="ghost"
          onClick={toggleExpand}
          aria-expanded={isExpanded}
        >
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
        <div className={cn('transition-all')}>
          {jobs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No job recommendations found.
            </div>
          ) : (
            <ul className="space-y-6">
              {jobs.map((job) => (
                <li
                  key={job.id}
                  className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <div className="text-gray-600">
                      {job.company} &mdash; {job.location}
                    </div>
                    <div className="text-sm text-gray-400 mb-2">
                      Posted: {job.datePosted}
                    </div>
                    <div className="text-sm text-gray-700 mb-2">
                      Match Score:{' '}
                      <span className="font-bold">{job.matchScore}%</span>
                    </div>
                    <div className="text-gray-800 mb-2">{job.summary}</div>
                  </div>
                  <div className="flex flex-col gap-2 mt-4 md:mt-0 md:ml-6">
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleDownloadCoverLetter(job.id, job.coverLetterUrl)
                      }
                      disabled={generatingCoverLetter === job.id}
                      className="flex items-center gap-2"
                    >
                      <FileDown className="w-4 h-4" />
                      {generatingCoverLetter === job.id
                        ? 'Generating...'
                        : 'Download Cover Letter'}
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
