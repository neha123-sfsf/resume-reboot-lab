
import React from 'react';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  const scrollToUpload = () => {
    const uploadSection = document.getElementById('upload');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero" 
      className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-br from-white to-soft-blue"
    >
      <div className="max-w-4xl mx-auto text-center animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          404: Job Not Found? We Can Fix That!
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          Upload your resume, paste a job description, and get instant feedback to land your dream job.
        </p>
        
        <div className="mb-16 relative">
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80" 
            alt="Job search illustration" 
            className="rounded-lg shadow-xl"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
        </div>
        
        <Button 
          onClick={scrollToUpload} 
          className="button-primary text-lg animate-pulse"
        >
          Get Started
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
