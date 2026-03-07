import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function AddPatientModal({ isOpen, onClose, onAddPatient }: any) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [mrn, setMrn] = useState('');
  const [phone, setPhone] = useState('');
  const [secondPhone, setSecondPhone] = useState('');
  const [condition, setCondition] = useState('');
  
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate some sample future dates
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const nextMonth = new Date(today);
    nextMonth.setDate(today.getDate() + 30);
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const newPatient = {
      id: Date.now().toString(),
      name,
      age: parseInt(age) || 0,
      mrn,
      phone,
      secondPhone,
      conditions: condition ? [condition] : [],
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f5f5f4&color=57534e&size=150`,
      riskLevel: 'Low',
      mood: 'stable',
      aiCalls: 0,
      missedCalls: 0,
      nextSession: formatDate(nextWeek),
      lastSession: 'Never',
      notes: 'New patient added. Initial consultation pending.',
      actionPlans: [
        {
          id: 'ap-1',
          title: 'Initial Assessment Plan',
          date: formatDate(today),
          status: 'pending',
          description: 'Complete initial intake forms, establish baseline metrics, and review medical history prior to the first consultation.'
        }
      ],
      upcomingSessions: [
        { id: '1', date: formatDate(nextWeek), type: 'Initial Consultation', status: 'scheduled' },
        { id: '2', date: formatDate(nextMonth), type: 'Follow-up', status: 'scheduled' }
      ]
    };
    onAddPatient(newPatient);
    onClose();
    setName('');
    setAge('');
    setMrn('');
    setPhone('');
    setSecondPhone('');
    setCondition('');
  };

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
          className="relative bg-white dark:bg-stone-800 rounded-3xl shadow-xl w-full max-w-md overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold dark:text-white">Add New Patient</h2>
            <button type="button" onClick={onClose} className="p-2 text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 dark:border-stone-600 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white dark:bg-stone-700 dark:text-white" 
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Age</label>
                <input 
                  required
                  type="number" 
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 dark:border-stone-600 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white dark:bg-stone-700 dark:text-white" 
                  placeholder="35"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">MRN</label>
              <input 
                required
                type="text" 
                value={mrn}
                onChange={e => setMrn(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 dark:border-stone-600 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white dark:bg-stone-700 dark:text-white" 
                placeholder="MRN-123456"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Phone Number</label>
                <input 
                  required
                  type="tel" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 dark:border-stone-600 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white dark:bg-stone-700 dark:text-white" 
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Second Phone (Optional)</label>
                <input 
                  type="tel" 
                  value={secondPhone}
                  onChange={e => setSecondPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 dark:border-stone-600 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white dark:bg-stone-700 dark:text-white" 
                  placeholder="(555) 987-6543"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Primary Diagnosis</label>
              <select 
                required
                value={condition}
                onChange={e => setCondition(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 dark:border-stone-600 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white dark:bg-stone-700 dark:text-white"
              >
                <option value="" disabled>Select a diagnosis</option>
                <option value="Anxiety">Anxiety</option>
                <option value="Depression">Depression</option>
                <option value="PTSD">PTSD</option>
                <option value="Bipolar Disorder">Bipolar Disorder</option>
                <option value="ADHD">ADHD</option>
                <option value="Insomnia">Insomnia</option>
                <option value="OCD">OCD</option>
                <option value="Eating Disorder">Eating Disorder</option>
                <option value="Schizophrenia">Schizophrenia</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200">
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 shadow-sm"
              >
                Add Patient
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
