import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
      document.documentElement.classList.add('dark');
    } else if (saved === 'false') {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className="flex h-screen bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-sans transition-colors">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 overflow-y-auto">
        {currentView === 'dashboard' && <Dashboard setCurrentView={setCurrentView} />}
        {currentView === 'settings' && <Settings />}
        {currentView !== 'dashboard' && currentView !== 'settings' && (
          <div className="flex items-center justify-center h-full text-stone-400 dark:text-stone-500">
            This section is under construction.
          </div>
        )}
      </main>
    </div>
  );
}
