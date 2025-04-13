import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateCoverLetter } from '@/lib/api';
import { toast } from 'sonner';
import { FileDown } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

const CoverLetterGenerator: React.FC = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetterContent, setCoverLetterContent] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobTitle || !companyName || !jobDescription) {
      toast.error('Please fill all fields');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await generateCoverLetter(jobTitle, companyName, jobDescription);

      if (response.status === 'success' && response.data) {
        if (response.data.cover_letter) {
          setCoverLetterContent(response.data.cover_letter);
          if (response.data.path) {
            setDownloadUrl(`https://404jobnotfound-nehapatil03.hf.space/download/${response.data.path}`);
          }
          toast.success('Cover letter generated successfully');
        } else {
          toast.error('Failed to generate cover letter content');
        }
      } else {
        toast.error('Failed to generate cover letter');
      }
    } catch (error) {
      console.error('Error generating cover letter:', error);
      toast.error('An error occurred while generating the cover letter');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <div className="ml-16 transition-all duration-300 py-8 px-4 md:px-8">
        <h1 className="text-3xl font-bold mb-6">Cover Letter Generator</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Cover Letter</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label htmlFor="job-title" className="block text-sm font-medium mb-1">
                    Job Title
                  </label>
                  <Input
                    id="job-title"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Frontend Developer"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="company-name" className="block text-sm font-medium mb-1">
                    Company Name
                  </label>
                  <Input
                    id="company-name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Inc."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="job-description" className="block text-sm font-medium mb-1">
                    Job Description
                  </label>
                  <Textarea
                    id="job-description"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="min-h-[200px]"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Generate Cover Letter'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Cover Letter Preview</span>
                {coverLetterContent && downloadUrl && (
                  <Button size="sm" variant="outline" onClick={handleDownload}>
                    <FileDown className="mr-1 h-4 w-4" />
                    Download
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {coverLetterContent ? (
                <div className="prose max-w-none">
                  <div className="bg-white p-4 border rounded-md whitespace-pre-wrap">
                    {coverLetterContent}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  {isGenerating ? (
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 border-2 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
                      <p>Generating your cover letter...</p>
                    </div>
                  ) : (
                    <p>Fill in the form and click "Generate Cover Letter" to see a preview here</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterGenerator;
