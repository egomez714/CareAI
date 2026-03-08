import React, { useState } from 'react';
import { 
  format, 
  isSameDay, 
  parseISO, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  addMonths, 
  subMonths, 
  isSameMonth,
  isToday
} from 'date-fns';
import { patients } from '../data/mockData';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Video, Bot, User } from 'lucide-react';

export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAICheckups, setShowAICheckups] = useState(true);
  const [showTherapySessions, setShowTherapySessions] = useState(true);

  // Extract all sessions from patients
  const allSessions = patients.flatMap(patient => 
    patient.upcomingSessions?.map(session => ({
      ...session,
      patientName: patient.name,
      patientId: patient.id,
      avatarUrl: patient.avatarUrl,
      parsedDate: parseISO(session.date)
    })) || []
  ).filter(session => {
    if (session.type === 'AI Checkup' && !showAICheckups) return false;
    if (session.type === 'Therapy Session' && !showTherapySessions) return false;
    return true;
  }).sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full flex flex-col">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900 dark:text-white">Calendar</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">Manage your upcoming therapy sessions and AI checkups.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-white dark:bg-stone-800 p-1.5 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm">
            <button
              onClick={() => setShowTherapySessions(!showTherapySessions)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                showTherapySessions 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' 
                  : 'text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-700'
              }`}
            >
              <User size={16} />
              Therapy
            </button>
            <button
              onClick={() => setShowAICheckups(!showAICheckups)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                showAICheckups 
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300' 
                  : 'text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-700'
              }`}
            >
              <Bot size={16} />
              AI Checkups
            </button>
          </div>
          <div className="flex items-center gap-4 bg-white dark:bg-stone-800 p-2 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm">
            <button 
              onClick={prevMonth}
              className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors text-stone-600 dark:text-stone-300"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold min-w-[140px] text-center text-stone-900 dark:text-white">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <button 
              onClick={nextMonth}
              className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors text-stone-600 dark:text-stone-300"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden flex flex-col">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50">
          {weekDays.map(day => (
            <div key={day} className="py-3 text-center text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="flex-1 grid grid-cols-7 auto-rows-fr">
          {calendarDays.map((day, dayIdx) => {
            const daySessions = allSessions.filter(session => isSameDay(session.parsedDate, day));
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isCurrentDay = isToday(day);

            return (
              <div 
                key={day.toString()} 
                className={`min-h-[120px] p-2 border-b border-r border-stone-100 dark:border-stone-700/50 transition-colors
                  ${!isCurrentMonth ? 'bg-stone-50/50 dark:bg-stone-900/20 text-stone-400 dark:text-stone-600' : 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100'}
                  ${dayIdx % 7 === 6 ? 'border-r-0' : ''}
                  hover:bg-stone-50 dark:hover:bg-stone-700/30
                `}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium
                    ${isCurrentDay ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200 dark:shadow-none' : ''}
                  `}>
                    {format(day, 'd')}
                  </span>
                  {daySessions.length > 0 && (
                    <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded-md">
                      {daySessions.length}
                    </span>
                  )}
                </div>
                
                <div className="space-y-1.5 overflow-y-auto max-h-[80px] scrollbar-hide">
                  {daySessions.map((session, idx) => {
                    const isAI = session.type === 'AI Checkup';
                    return (
                      <div 
                        key={idx}
                        className={`px-2 py-1.5 text-xs rounded-lg border cursor-pointer transition-colors truncate ${
                          isAI 
                            ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/50 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40' 
                            : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                        }`}
                        title={`${session.time} - ${session.patientName} (${session.type})`}
                      >
                        <div className="font-medium truncate flex items-center gap-1">
                          {isAI ? <Bot size={10} /> : <User size={10} />}
                          {session.time}
                        </div>
                        <div className="truncate opacity-90">{session.patientName}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
