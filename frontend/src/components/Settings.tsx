import { useState, useEffect } from 'react';
import { Moon, Sun, Phone } from 'lucide-react';

export function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return saved === 'true';
    }
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 dark:text-white">Settings</h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">Manage your application preferences.</p>
      </header>

      <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-stone-200 dark:border-stone-700">
          <h2 className="text-lg font-medium text-stone-900 dark:text-white">Appearance</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-stone-900 dark:text-white">Dark Mode</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                Toggle between light and dark themes.
              </p>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                isDarkMode ? 'bg-emerald-600' : 'bg-stone-200 dark:bg-stone-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-stone-200 dark:border-stone-700">
          <h2 className="text-lg font-medium text-stone-900 dark:text-white">Help Center</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <Phone size={20} />
              </div>
              <div>
                <h3 className="font-medium text-stone-900 dark:text-white">Support Phone Number</h3>
                <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                  Call our support team for immediate assistance.
                </p>
              </div>
            </div>
            <div className="text-stone-900 dark:text-white font-medium text-lg">
              1-800-123-4567
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
