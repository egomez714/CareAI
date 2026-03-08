import { useState } from 'react';
import { LayoutDashboard, Calendar, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

const Logo = () => (
  <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 shadow-sm border border-stone-200/60 dark:border-stone-700/60 shrink-0">
    <svg viewBox="0 0 100 100" className="w-7 h-7 drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logo-grad-new" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e5474" />
          <stop offset="45%" stopColor="#4ea1a4" />
          <stop offset="85%" stopColor="#f4b27f" />
          <stop offset="100%" stopColor="#f8c89b" />
        </linearGradient>
      </defs>
      
      {/* Left side - Phone receiver */}
      <path 
        d="M 50 18 
           C 20 0, 0 30, 15 60 
           C 22 75, 40 85, 55 90 
           C 50 85, 45 75, 48 65 
           C 52 55, 35 55, 35 40 
           C 35 28, 45 22, 50 18 Z" 
        fill="url(#logo-grad-new)" 
      />
      
      {/* Right side - Outer arc */}
      <path 
        d="M 50 18 C 80 0, 100 30, 85 60 C 78 75, 60 85, 55 90" 
        stroke="url(#logo-grad-new)" 
        strokeWidth="8" 
        strokeLinecap="round" 
        fill="none" 
      />
      
      {/* Right side - Inner arc */}
      <path 
        d="M 50 32 C 70 20, 80 40, 70 55 C 65 65, 55 70, 50 75" 
        stroke="url(#logo-grad-new)" 
        strokeWidth="8" 
        strokeLinecap="round" 
        fill="none" 
      />
      
      {/* Dot */}
      <circle cx="62" cy="68" r="5" fill="url(#logo-grad-new)" />
    </svg>
  </div>
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
            alt="Dr. Emily" 
            className="w-10 h-10 rounded-full object-cover border border-stone-200 dark:border-stone-700 shrink-0"
            referrerPolicy="no-referrer"
          />
          {!isCollapsed && (
            <div className="flex flex-col text-left whitespace-nowrap overflow-hidden">
              <span className="text-sm font-medium text-stone-900 dark:text-white">Dr. Emily Li</span>
              <span className="text-xs text-stone-500 dark:text-stone-400">Psychotherapist</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
