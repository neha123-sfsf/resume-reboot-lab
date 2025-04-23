
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Clipboard, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  
  const navigationItems = [
    { 
      name: 'Home Page',
      icon: <Home size={20} />,
      path: '/' 
    },
    { 
      name: 'Cover Letter',
      icon: <FileText size={20} />,
      path: '/cover-letter' 
    },
    { 
      name: 'Job Tracker',
      icon: <Clipboard size={20} />,
      path: '/job-tracker' 
    },
    { 
      name: 'Career Chat',
      icon: <MessageSquare size={20} />,
      path: '/chatbot' 
    }
  ];
  
  return (
    <div 
      className={cn(
        "fixed left-0 top-0 bottom-0 bg-gray-900 text-white transition-all duration-300 z-10",
        expanded ? "w-48" : "w-16"
      )}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="flex flex-col h-full">
        <div className="p-3 mb-4 flex items-center justify-center h-16 border-b border-gray-800">
          {expanded ? (
            <span className="font-bold text-sm">Opportune</span>
          ) : (
            <span className="font-bold text-xl">O</span>
          )}
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-3 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors",
                    location.pathname === item.path && "bg-gray-800 text-white"
                  )}
                >
                  <div className="flex items-center justify-center w-10">
                    {item.icon}
                  </div>
                  {expanded && (
                    <span className="ml-2 text-sm font-medium">{item.name}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 text-xs text-center text-gray-500">
          {expanded ? "CTRL + ALT + R" : "⌃⌥R"}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
