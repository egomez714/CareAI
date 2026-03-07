import { Bot, X, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { format } from 'date-fns';

export function ScheduleModal({ isOpen, onClose, patient }: any) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState('09:00');

  if (!isOpen || !patient) return null;

  const sessionDates = patient.upcomingSessions?.map((s: any) => {
    const [year, month, day] = s.date.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }) || [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white rounded-3xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
        >
          {/* Left Side - Form */}
          <div className="flex-1 p-6 border-r border-stone-100 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Bot className="text-emerald-600" size={20} />
                Schedule AI Checkup
              </h2>
              <button onClick={onClose} className="md:hidden p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <p className="text-sm text-stone-500 mb-1">Patient</p>
                <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <img src={patient.avatarUrl} alt={patient.name} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                  <span className="font-medium">{patient.name}</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Select Date</label>
                  <div className="border border-stone-200 rounded-xl p-2 flex justify-center bg-stone-50/50">
                    <DayPicker
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      modifiers={{ hasSession: sessionDates }}
                      modifiersClassNames={{
                        hasSession: "font-bold text-emerald-700 relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-emerald-500 after:rounded-full"
                      }}
                      className="!m-0"
                      classNames={{
                        day_selected: "bg-emerald-600 text-white hover:bg-emerald-700",
                        day_today: "text-emerald-600 font-bold"
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Time</label>
                  <input 
                    type="time" 
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Checkup Focus</label>
                <select className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white">
                  <option>Action Plan Adherence</option>
                  <option>General Mood Check-in</option>
                  <option>Medication Adherence</option>
                  <option>Sleep Quality Assessment</option>
                  <option>Anxiety/Stress Monitoring</option>
                  <option>Custom Prompt...</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Initial Phone Script</label>
                <p className="text-xs text-stone-500 mb-2">Draft the opening message the AI will use to start the conversation.</p>
                <textarea 
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none" 
                  rows={4}
                  placeholder={`Hi ${patient.name.split(' ')[0]}, this is your AI assistant calling for a quick check-in...`}
                  defaultValue={`Hi ${patient.name.split(' ')[0]}, this is your AI assistant calling for a quick check-in. How have you been doing with your action plan since your last session?`}
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-stone-100 flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900">
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert(`AI Checkup scheduled for ${selectedDate ? format(selectedDate, 'MMM d, yyyy') : ''} at ${selectedTime}!`);
                  onClose();
                }}
                className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 shadow-sm"
              >
                Schedule Call
              </button>
            </div>
          </div>

          {/* Right Side - Upcoming Sessions */}
          <div className="w-full md:w-80 bg-stone-50 p-6 flex flex-col overflow-y-auto">
            <div className="hidden md:flex justify-end mb-6">
              <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <CalendarIcon size={16} className="text-stone-500" />
              Upcoming Sessions
            </h3>
            
            <div className="space-y-3 flex-1 overflow-y-auto">
              {patient.upcomingSessions && patient.upcomingSessions.length > 0 ? (
                patient.upcomingSessions.map((session: any) => (
                  <div key={session.id} className="bg-white p-3 rounded-xl border border-stone-200 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-stone-900">{session.type}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-stone-500">
                      <span className="flex items-center gap-1">
                        <CalendarIcon size={12} />
                        {session.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {session.time}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-stone-500 text-center py-8">
                  No upcoming sessions scheduled.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
