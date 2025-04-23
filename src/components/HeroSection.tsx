
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
      className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-br from-[#E3F2FD] to-white"
    >
      <div className="max-w-5xl mx-auto text-center space-y-8">
        <div className="animate-fade-in space-y-2">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900">
            Opportune
          </h1>
          <p className="text-lg md:text-xl text-gray-600 italic">
            Rejection into Redirection
          </p>
        </div>
        
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto animate-fade-in delay-100">
          Optimize your resume to get more interviews with our AI-powered insights
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in delay-200">
            <div className="aspect-square rounded-xl overflow-hidden mb-4">
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" 
                alt="Modern workspace" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">Resume Analysis</h3>
            <p className="text-gray-600">Get detailed insights on how to improve your resume's impact</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in delay-300">
            <div className="aspect-square rounded-xl overflow-hidden mb-4">
              <img 
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984" 
                alt="Career growth" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">Job Matching</h3>
            <p className="text-gray-600">Find the perfect opportunities that match your skills and experience</p>
          </div>
        </div>
        
        <Button 
          onClick={scrollToUpload} 
          className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in delay-400"
        >
          Start Your Journey
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
