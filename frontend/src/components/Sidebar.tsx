import { useState } from 'react';
import { LayoutDashboard, Calendar, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

const Logo = () => (
  <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-900 shadow-sm border border-stone-200/60 dark:border-stone-700/60 shrink-0 overflow-hidden">
    <img 
      src="https://media.discordapp.net/attachments/1479659689028485314/1479968693634207889/image.png?ex=69adf7c1&is=69aca641&hm=01d409bb9d4b430168ccae8d1e0194e552dd6fbd8da8013a9a854861502a0cbe&=&format=webp&quality=lossless&width=863&height=471" 
      alt="Logo" 
      className="w-full h-full object-cover"
      referrerPolicy="no-referrer"
    />
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
            src="https://cdn.discordapp.com/attachments/1479659689028485314/1479995545836716174/IMG_9593.jpg?ex=69ae10c3&is=69acbf43&hm=f8e988ac6d53e1d07da3a0698603a4085247889960376fcd99d348fc2399757b" 
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
