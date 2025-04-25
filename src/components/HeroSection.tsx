
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
        
        <div className="mt-12 relative group animate-fade-in delay-200">
          <div className="overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
            <img 
              src="https://images.unsplash.com/photo-1551038247-3d9af20df552" 
              alt="Professional workspace" 
              className="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-2xl"></div>
          </div>
        </div>
        
        <Button 
          onClick={scrollToUpload} 
          className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in delay-300"
        >
          Start Your Journey
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
