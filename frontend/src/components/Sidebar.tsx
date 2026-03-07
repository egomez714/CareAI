import { useState } from 'react';
import { LayoutDashboard, Users, Calendar, Settings, Activity, ChevronLeft, ChevronRight } from 'lucide-react';

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
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-stone-200 flex flex-col transition-all duration-300 relative`}>
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-white border border-stone-200 rounded-full p-1 text-stone-400 hover:text-stone-600 shadow-sm z-10"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3'}`}>
        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0">
          <Activity size={20} />
        </div>
        {!isCollapsed && <span className="font-semibold text-lg tracking-tight whitespace-nowrap overflow-hidden">TheraSync AI</span>}
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
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon size={18} className={isActive ? 'text-emerald-600' : 'text-stone-400'} />
              {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">{item.label}</span>}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-stone-200">
        <div className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2`}>
          <img 
            src="https://picsum.photos/seed/dr/100/100" 
            alt="Dr. Sarah" 
            className="w-10 h-10 rounded-full object-cover border border-stone-200 shrink-0"
            referrerPolicy="no-referrer"
          />
          {!isCollapsed && (
            <div className="flex flex-col text-left whitespace-nowrap overflow-hidden">
              <span className="text-sm font-medium">Dr. Sarah Jenkins</span>
              <span className="text-xs text-stone-500">Clinical Psychologist</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
