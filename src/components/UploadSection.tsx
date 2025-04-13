import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { uploadResume } from '@/lib/api';

const UploadSection: React.FC = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
      const formData = new FormData();
      formData.append("file", resumeFile);

      // Step 1: Upload the file to the backend
      const uploadRes = await fetch("https://nehapatil03-404jobnotfound.hf.space/upload_resume/", {
        method: "POST",
        body: formData
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.text();
        throw new Error(`Upload error: ${uploadRes.status} - ${err}`);
      }

      const uploadData = await uploadRes.json();
      const resumeFileName = uploadData.resume_file;

      // Step 2: Analyze the resume
      const analyzeRes = await fetch("https://nehapatil03-404jobnotfound.hf.space/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          mode: "upload",
          resume_file: resumeFileName,
          job_description: jobDescription,
          application_status: "rejected"
        })
      });

      if (!analyzeRes.ok) {
        const err = await analyzeRes.text();
        throw new Error(`Analysis error: ${analyzeRes.status} - ${err}`);
      }

      const analyzeData = await analyzeRes.json();
      toast.success('Analysis complete!');
      const analysisSection = document.getElementById('analysis');
      if (analysisSection) {
        analysisSection.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error during upload:', error);
      toast.error('An unexpected error occurred. Please try again.');
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

            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover-scale cursor-pointer bg-white/80"
            >
              <input {...getInputProps()} accept=".pdf,.doc,.docx" />
              <Upload className="h-12 w-12 text-gray-400 mb-4 mx-auto" />
              <span className="text-gray-600 mb-2 block">
                {resumeFile ? getShortFileName(resumeFile.name) : 'Click or drag a file to upload'}
              </span>
              <span className="text-sm text-gray-400">PDF or Word files only</span>
            </div>
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
