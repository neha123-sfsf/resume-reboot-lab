import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiService } from '@/lib/api'; // Use centralized apiService
import { toast } from 'sonner';
import { FileDown } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

const CoverLetterGenerator: React.FC = () => {
  const [coverLetterContent, setCoverLetterContent] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Call API to generate cover letter directly
    const fetchCoverLetter = async () => {
      setIsGenerating(true);

      try {
        const result = await apiService.generateCoverLetter(); // No input required from user
        if (result.status === "success" && result.data) {
          if (result.data.cover_letter) {
            setCoverLetterContent(result.data.cover_letter);
            if (result.data.path) {
              setDownloadUrl(`https://nehapatil03-404jobnotfound.hf.space/download/${result.data.path}`);
            }
            toast.success('Cover letter generated successfully');
          } else {
            toast.error('Failed to generate cover letter content');
          }
        } else {
          toast.error(result.message || 'Failed to generate cover letter');
        }
      } catch (error) {
        console.error('Error generating cover letter:', error);
        toast.error('An error occurred while generating the cover letter');
      } finally {
        setIsGenerating(false);
      }
    };

    fetchCoverLetter();

  }, []); // Empty dependency array: runs only once on mount


  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <div className="ml-16 transition-all duration-300 py-8 px-4 md:px-8">
        <h1 className="text-3xl font-bold mb-6">Cover Letter</h1>

        <div className="grid md:grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Cover Letter Preview</span>
                {coverLetterContent && (
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
                    <p>Loading your cover letter...</p>
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
