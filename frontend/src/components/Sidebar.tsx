import { useState } from 'react';
import { LayoutDashboard, Calendar, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

const Logo = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logo-grad-main" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1a4b6b" />
        <stop offset="50%" stopColor="#2b7a94" />
        <stop offset="100%" stopColor="#67c2b8" />
      </linearGradient>
      <linearGradient id="logo-grad-accent" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#67c2b8" />
        <stop offset="100%" stopColor="#f0a77b" />
      </linearGradient>
      <linearGradient id="logo-grad-heart" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2b7a94" />
        <stop offset="100%" stopColor="#f0a77b" />
      </linearGradient>
    </defs>
    
    {/* Person Head */}
    <circle cx="38" cy="28" r="8" fill="url(#logo-grad-main)" />
    
    {/* Person Body / Bottom Curve */}
    <path 
      d="M 45 35 C 25 40, 20 65, 35 80 C 50 95, 75 85, 75 70" 
      stroke="url(#logo-grad-main)" 
      strokeWidth="14" 
      strokeLinecap="round" 
      fill="none" 
    />
    
    {/* Heart Speech Bubble */}
    <path 
      d="M 50 62 C 40 62, 35 50, 45 45 C 48 43, 50 46, 50 46 C 50 46, 52 43, 55 45 C 65 50, 60 62, 50 62 Z" 
      fill="url(#logo-grad-heart)" 
    />
    <path d="M 45 60 L 40 68 L 48 62 Z" fill="url(#logo-grad-heart)" />
    
    {/* Right Waves */}
    <path d="M 50 20 A 30 30 0 0 1 75 45" stroke="url(#logo-grad-main)" strokeWidth="7" strokeLinecap="round" fill="none" />
    <path d="M 60 15 A 40 40 0 0 1 85 45" stroke="url(#logo-grad-accent)" strokeWidth="7" strokeLinecap="round" fill="none" />
    <path d="M 75 65 A 15 15 0 0 0 85 55" stroke="url(#logo-grad-main)" strokeWidth="7" strokeLinecap="round" fill="none" />
    <circle cx="85" cy="50" r="4" fill="url(#logo-grad-main)" />
  </svg>
);

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex flex-col transition-all duration-300 relative`}>
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-full p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 shadow-sm z-10"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3'}`}>
        <Logo />
        {!isCollapsed && (
          <span className="font-semibold text-lg tracking-tight whitespace-nowrap overflow-hidden text-stone-900 dark:text-white">
            TheraC<span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent font-bold">AI</span>l
          </span>
        )}
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon size={18} className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-400 dark:text-stone-500'} />
              {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">{item.label}</span>}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-stone-200 dark:border-stone-800">
        <div className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2`}>
          <img 
            src="https://picsum.photos/seed/dr/100/100" 
            alt="Dr. Sarah" 
            className="w-10 h-10 rounded-full object-cover border border-stone-200 dark:border-stone-700 shrink-0"
            referrerPolicy="no-referrer"
          />
          {!isCollapsed && (
            <div className="flex flex-col text-left whitespace-nowrap overflow-hidden">
              <span className="text-sm font-medium text-stone-900 dark:text-white">Dr. Sarah Jenkins</span>
              <span className="text-xs text-stone-500 dark:text-stone-400">Clinical Psychologist</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
