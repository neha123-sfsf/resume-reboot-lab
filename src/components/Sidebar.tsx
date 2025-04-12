
import React, { useState } from 'react';
import { Home, FileText, Clipboard, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarLinkProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isExpanded: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon: Icon, label, href, isExpanded }) => {
  return (
    <a 
      href={href} 
      className={cn(
        "flex items-center p-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300",
        isExpanded ? "justify-start" : "justify-center"
      )}
    >
      <Icon className="h-5 w-5" />
      {isExpanded && <span className="ml-4">{label}</span>}
    </a>
  );
};

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleMouseEnter = () => setIsExpanded(true);
  const handleMouseLeave = () => setIsExpanded(false);

  return (
    <div 
      className={cn(
        "fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-10",
        isExpanded ? "w-64" : "w-16"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-4 flex items-center justify-center">
        {isExpanded ? (
          <h2 className="text-lg font-semibold">404: Job Not Found</h2>
        ) : (
          <span className="text-xl font-bold">404</span>
        )}
      </div>
      
      <div className="mt-8 space-y-2 px-2">
        <SidebarLink icon={Home} label="Home Page" href="#hero" isExpanded={isExpanded} />
        <SidebarLink icon={FileText} label="Generate Cover Letter" href="#" isExpanded={isExpanded} />
        <SidebarLink icon={Clipboard} label="Job Tracker" href="#" isExpanded={isExpanded} />
        <SidebarLink icon={Bot} label="Career Chat Bot" href="#" isExpanded={isExpanded} />
      </div>
    </div>
  );
};

export default Sidebar;
