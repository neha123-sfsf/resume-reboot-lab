
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Plus, Trash } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

interface Job {
  id: string;
  resumeName: string;
  role: string;
  company: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  dateAdded: Date;
}

const JobTracker: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: '1',
      resumeName: 'My_Resume.pdf',
      role: 'Frontend Developer',
      company: 'Tech Innovations Inc.',
      status: 'Pending',
      dateAdded: new Date('2023-04-10')
    },
    {
      id: '2',
      resumeName: 'Resume_Updated.pdf',
      role: 'UI/UX Engineer',
      company: 'Creative Solutions',
      status: 'Accepted',
      dateAdded: new Date('2023-04-05')
    },
    {
      id: '3',
      resumeName: 'Resume_Latest.docx',
      role: 'Full Stack Developer',
      company: 'Digital Platforms Ltd.',
      status: 'Rejected',
      dateAdded: new Date('2023-04-01')
    }
  ]);

  const updateJobStatus = (jobId: string, status: 'Pending' | 'Accepted' | 'Rejected') => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status } : job
    ));
  };

  const deleteJob = (jobId: string) => {
    setJobs(jobs.filter(job => job.id !== jobId));
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      
      <div className="ml-16 transition-all duration-300 py-8 px-4 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Job Application Tracker</h1>
          <Button size="sm" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Add Application
          </Button>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resume</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.resumeName}</TableCell>
                  <TableCell>{job.role}</TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`w-28 justify-between ${
                            job.status === 'Accepted' ? 'text-green-600' :
                            job.status === 'Rejected' ? 'text-red-600' :
                            'text-yellow-600'
                          }`}
                        >
                          {job.status}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => updateJobStatus(job.id, 'Pending')}>
                          Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateJobStatus(job.id, 'Accepted')}>
                          Accepted
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateJobStatus(job.id, 'Rejected')}>
                          Rejected
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>{job.dateAdded.toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteJob(job.id)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default JobTracker;
