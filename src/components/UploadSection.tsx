import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { API_BASE_URL, ANALYZE_ENDPOINT, UPLOAD_ENDPOINT } from '@/lib/api'; // <-- Ensure UPLOAD_ENDPOINT is exported

const UploadSection: React.FC = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const validFileTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (file && validFileTypes.includes(file.type)) {
      setResumeFile(file);
      toast.success('Resume uploaded successfully!');
    } else {
      toast.error('Please upload a PDF or Word document.');
    }
  };

  const handleJobDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescription(e.target.value);
  };

  const handleSubmit = async () => {
    if (!resumeFile) {
      toast.error('Please upload your resume.');
      return;
    }

    if (!jobDescription.trim()) {
      toast.error('Please enter a job description.');
      return;
    }

    setIsUploading(true);

    try {
      // === Step 1: Upload to /upload_resume ===
      const uploadForm = new FormData();
      uploadForm.append("resume_file", resumeFile);
      uploadForm.append("jd_text", jobDescription);
      uploadForm.append("application_status", "rejected");

      const uploadResponse = await fetch(`${API_BASE_URL}/upload_resume`, {
        method: "POST",
        body: uploadForm,
      });

      if (!uploadResponse.ok) {
        const err = await uploadResponse.text();
        throw new Error(`Upload error: ${err}`);
      }

      // === Step 2: Trigger /analyze for ATS score ===
      const analyzeForm = new FormData();
      analyzeForm.append("mode", "ats_score");

      const analyzeResponse = await fetch(ANALYZE_ENDPOINT, {
        method: "POST",
        body: analyzeForm,
      });

      if (!analyzeResponse.ok) {
        const err = await analyzeResponse.text();
        throw new Error(`Analysis error: ${err}`);
      }

      const analysisResult = await analyzeResponse.json();
      console.log('✅ Analysis Result:', analysisResult);
      toast.success('Resume analyzed successfully!');

      // Optional: Scroll to results section
      const analysisSection = document.getElementById('analysis');
      if (analysisSection) {
        analysisSection.scrollIntoView({ behavior: 'smooth' });
      }

    } catch (error) {
      console.error('❌ Upload/Analysis error:', error);
      toast.error(error instanceof Error ? error.message : 'Unexpected error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  const getShortFileName = (name: string) =>
    name.length > 30 ? name.slice(0, 15) + '...' + name.slice(-10) : name;

  return (
    <section id="upload" className="min-h-screen py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center animate-fade-in">
          Upload Your Resume &amp; Job Description
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="gradient-card gradient-card-blue p-8 animate-fade-in h-full" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-2xl font-semibold mb-4">Upload Resume</h3>
            <p className="text-gray-600 mb-6">
              Upload your resume in PDF or Word format to get an analysis on how well it matches the job description.
            </p>

            <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white/80 cursor-pointer block hover-scale">
              <Upload className="h-12 w-12 text-gray-400 mb-4 mx-auto" />
              <span className="text-gray-600 mb-2 block">
                {resumeFile ? getShortFileName(resumeFile.name) : 'Click to upload your resume'}
              </span>
              <span className="text-sm text-gray-400">PDF or Word files only</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={onFileChange}
              />
            </label>
          </div>

          <div className="gradient-card gradient-card-peach p-8 animate-fade-in h-full" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-2xl font-semibold mb-4">Job Description</h3>
            <p className="text-gray-600 mb-6">
              Paste the job description you're interested in to see how well your resume matches.
            </p>

            <Textarea
              placeholder="Paste the job description here..."
              className="input-primary min-h-[200px]"
              value={jobDescription}
              onChange={handleJobDescriptionChange}
            />
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button
            onClick={handleSubmit}
            className="button-primary text-lg animate-fade-in"
            disabled={isUploading}
          >
            {isUploading ? 'Analyzing...' : 'Submit for Analysis'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
