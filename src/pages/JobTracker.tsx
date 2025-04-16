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
import { ChevronDown, Plus, Trash, Link } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { Input } from '@/components/ui/input';

interface Job {
  id: string;
  resumeName: string;
  role: string;
  company: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  dateAdded: Date;
  links: {
    applicationURL: string;
    linkedinProfile: string;
  };
}

const JobTracker: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: '1',
      resumeName: 'My_Resume.pdf',
      role: 'Frontend Developer',
      company: 'Tech Innovations Inc.',
      status: 'Pending',
      dateAdded: new Date('2023-04-10'),
      links: {
        applicationURL: '',
        linkedinProfile: '',
      },
    },
    {
      id: '2',
      resumeName: 'Resume_Updated.pdf',
      role: 'UI/UX Engineer',
      company: 'Creative Solutions',
      status: 'Accepted',
      dateAdded: new Date('2023-04-05'),
      links: {
        applicationURL: '',
        linkedinProfile: '',
      },
    },
    {
      id: '3',
      resumeName: 'Resume_Latest.docx',
      role: 'Full Stack Developer',
      company: 'Digital Platforms Ltd.',
      status: 'Rejected',
      dateAdded: new Date('2023-04-01'),
      links: {
        applicationURL: '',
        linkedinProfile: '',
      },
    },
  ]);

  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  const updateJobStatus = (
    jobId: string,
    status: 'Pending' | 'Accepted' | 'Rejected'
  ) => {
    setJobs(
      jobs.map((job) =>
        job.id === jobId ? { ...job, status } : job
      )
    );
  };

  const deleteJob = (jobId: string) => {
    setJobs(jobs.filter((job) => job.id !== jobId));
  };

  const handleLinkChange = (
    jobId: string,
    linkType: 'applicationURL' | 'linkedinProfile',
    value: string
  ) => {
    setJobs(
      jobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              links: {
                ...job.links,
                [linkType]: value,
              },
            }
          : job
      )
    );
  };

  const toggleEditing = (jobId: string) => {
    setEditingJobId(editingJobId === jobId ? null : jobId);
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
                <TableHead>Links</TableHead>
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
                            job.status === 'Accepted'
                              ? 'text-green-600'
                              : job.status === 'Rejected'
                              ? 'text-red-600'
                              : 'text-yellow-600'
                          }`}
                        >
                          {job.status}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => updateJobStatus(job.id, 'Pending')}
                        >
                          Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateJobStatus(job.id, 'Accepted')}
                        >
                          Accepted
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateJobStatus(job.id, 'Rejected')}
                        >
                          Rejected
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>{job.dateAdded.toLocaleDateString()}</TableCell>
                  <TableCell>
                    {editingJobId === job.id ? (
                      <>
                        <Input
                          type="url"
                          placeholder="Application URL"
                          value={job.links.applicationURL}
                          onChange={(e) =>
                            handleLinkChange(
                              job.id,
                              'applicationURL',
                              e.target.value
                            )
                          }
                        />
                        <Input
                          type="url"
                          placeholder="LinkedIn Profile URL"
                          value={job.links.linkedinProfile}
                          onChange={(e) =>
                            handleLinkChange(
                              job.id,
                              'linkedinProfile',
                              e.target.value
                            )
                          }
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleEditing(job.id)}
                        >
                          Save
                        </Button>
                      </>
                    ) : (
                      <div className="flex gap-2">
                        {job.links.applicationURL && (
                          <a
                            href={job.links.applicationURL}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Link className="w-4 h-4 text-blue-500" />
                          </a>
                        )}
                        {job.links.linkedinProfile && (
                          <a
                            href={job.links.linkedinProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Link className="w-4 h-4 text-blue-500" />
                          </a>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleEditing(job.id)}
                        >
                          Edit Links
                        </Button>
                      </div>
                    )}
                  </TableCell>
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
