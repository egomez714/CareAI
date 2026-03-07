import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="flex h-screen bg-stone-50 text-stone-900 font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 overflow-y-auto">
        {currentView === 'dashboard' && <Dashboard setCurrentView={setCurrentView} />}
        {currentView !== 'dashboard' && (
          <div className="flex items-center justify-center h-full text-stone-400">
            This section is under construction.
          </div>
        )}
      </main>
    </div>
  );
}
