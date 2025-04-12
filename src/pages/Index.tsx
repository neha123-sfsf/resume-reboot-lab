
import React, { useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import UploadSection from '@/components/UploadSection';
import AnalysisSection from '@/components/AnalysisSection';
import Sidebar from '@/components/Sidebar';

const Index: React.FC = () => {
  useEffect(() => {
    // Set up CTRL + ALT + Recruit keyboard shortcut
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.altKey && event.key === 'r') {
        console.log('CTRL + ALT + Recruit shortcut activated');
        console.log('API Endpoint: https://404jobnotfound-nehapatil03.hf.space/analyze');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      
      <div className="ml-16 transition-all duration-300"> {/* Adjust margin to account for sidebar */}
        <HeroSection />
        <UploadSection />
        <AnalysisSection />
      </div>
    </div>
  );
};

export default Index;
