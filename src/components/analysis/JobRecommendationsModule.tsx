
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Briefcase, FileDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  datePosted: string;
  summary: string;
  matchScore: number;
}

const JobRecommendationsModule: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock data
  const jobListings: JobListing[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'Tech Innovations Inc.',
      location: 'San Francisco, CA (Remote)',
      datePosted: '2 days ago',
      summary: 'Looking for an experienced frontend developer with React, TypeScript, and UI/UX skills to join our growing team.',
      matchScore: 92
    },
    {
      id: '2',
      title: 'UI/UX Engineer',
      company: 'Creative Solutions',
      location: 'New York, NY',
      datePosted: '1 week ago',
      summary: 'Seeking a talented UI/UX engineer with strong frontend skills to design and implement beautiful user interfaces.',
      matchScore: 88
    },
    {
      id: '3',
      title: 'Full Stack Developer',
      company: 'Digital Platforms Ltd.',
      location: 'Austin, TX (Hybrid)',
      datePosted: '3 days ago',
      summary: 'Join our team to build responsive web applications using modern JavaScript frameworks and backend technologies.',
      matchScore: 82
    },
    {
      id: '4',
      title: 'Frontend Architect',
      company: 'WebScale Solutions',
      location: 'Chicago, IL',
      datePosted: '5 days ago',
      summary: 'Lead our frontend development efforts and architect scalable solutions for enterprise clients.',
      matchScore: 76
    },
    {
      id: '5',
      title: 'React Developer',
      company: 'App Studios',
      location: 'Seattle, WA (Remote)',
      datePosted: '1 day ago',
      summary: 'Create engaging user experiences with React, Redux, and modern CSS frameworks.',
      matchScore: 75
    }
  ];

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDownloadCoverLetter = (jobId: string) => {
    toast.success(`Generating cover letter for job #${jobId}...`);
    // In a real app, this would download or generate a cover letter
  };

  return (
    <div className={cn(
      "gradient-card gradient-card-green transition-all duration-500 animate-fade-in",
      isExpanded ? "p-8" : "p-6"
    )}>
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Job Recommendations</h3>
        
        <Button 
          onClick={toggleExpand} 
          variant="outline"
          className="p-2"
        >
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </Button>
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
                    >
                      <FileDown className="mr-1 h-4 w-4" />
                      Cover Letter
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center"
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
