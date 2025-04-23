
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
      className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-br from-soft-blue to-white"
    >
      <div className="max-w-4xl mx-auto text-center animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
          Opportune: Rejection into Redirection
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          Transform career setbacks into strategic opportunities with AI-powered insights.
        </p>
        
        <div className="mb-16 relative group">
          <img 
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" 
            alt="Modern workspace with coding laptop" 
            className="rounded-xl shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-3xl"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
        </div>
        
        <Button 
          onClick={scrollToUpload} 
          className="button-primary text-lg animate-pulse"
        >
          Start Your Journey
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
