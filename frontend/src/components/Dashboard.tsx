import React, { useState, useEffect, useCallback } from 'react';
import { Bot, ChevronLeft, Calendar, Clock, FileText, PhoneMissed, ClipboardList, CheckCircle2, Circle, Clock3, FileDown, ChevronDown, ChevronUp, X, AlertTriangle } from 'lucide-react';

import { ScheduleModal } from './ScheduleModal';
import { AddPatientModal } from './AddPatientModal';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardProps {
  setCurrentView: (view: string) => void;
}

export function Dashboard({ setCurrentView }: DashboardProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [patientForSchedule, setPatientForSchedule] = useState<any>(null);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
  const [newlyAddedPatientId, setNewlyAddedPatientId] = useState<string | null>(null);

  const [patientsList, setPatientsList] = useState([]);

  // --- STRICT MONGODB SYNC LOGIC ---
  const syncWithBackend = useCallback(async () => {
    try {
      console.log("🔄 Fetching patients strictly from MongoDB...");
      const response = await fetch('http://localhost:8000/api/patients');
      
      if (response.ok) {
        const dbPatients = await response.json();
        
        // 2. Map the DB data to match exactly what your React UI expects
        const formattedPatients = dbPatients.map(dbPatient => ({
          id: dbPatient.mrn, // FIX: Map DB 'mrn' to UI 'id'
          name: dbPatient.name,
          mrn: dbPatient.mrn,
          phone: dbPatient.patient_phone || "No phone listed",
          riskLevel: dbPatient.riskLevel || "Low",
          mood: dbPatient.mood || "Stable",
          missedCalls: dbPatient.missedCalls || 0,
          nextSession: dbPatient.nextSession || "Pending",
          lastSession: dbPatient.lastSession || "Unknown",
          // Fallbacks for UI graphics
          avatarUrl: dbPatient.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(dbPatient.name)}&background=random`,
          conditions: dbPatient.conditions || ["General Monitoring"],
          actionPlans: dbPatient.actionPlans || [],
          latest_analysis: dbPatient.latest_analysis || null
        }));

        setPatientsList(formattedPatients);
        console.log("✅ Loaded from DB:", formattedPatients);
      }
    } catch (err) {
      console.error("❌ Fetch failed:", err);
    }
  }, []);

  useEffect(() => {
    syncWithBackend(); // Sync on mount
  }, [syncWithBackend]);

  // --- LIVE UPDATES LOGIC ---
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/ws/updates');

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("🚀 Live Update Received:", data);

        if (data.type === 'NEW_ANALYSIS' || data.type === 'CALL_MISSED') {
          console.log(`Refreshing data for MRN: ${data.mrn}`);
          refreshPatientData(data.mrn);
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    socket.onopen = () => {
      console.log("✅ Connected to CareAI Live Updates");
      syncWithBackend(); 
    };
    
    socket.onclose = () => console.log("❌ Disconnected from Live Updates");

    return () => socket.close();
  }, [syncWithBackend]);

  const refreshPatientData = async (mrn) => {
    try {
      const response = await fetch(`http://localhost:8000/api/patients/${mrn}`);
      if (!response.ok) throw new Error("Failed to fetch updated patient");
      
      const updatedPatient = await response.json();
      console.log("📥 New Patient Data from DB:", updatedPatient);

      setPatientsList(prev => {
        return prev.map(p => {
          // Match by MRN (or ID as fallback)
          if (p.mrn === mrn || p.id === mrn) {
            console.log(`Matching patient found: ${p.name}. Updating UI state...`);
            return { ...p, ...updatedPatient };
          }
          return p;
        });
      });
    } catch (err) {
      console.error("Failed to refresh patient state:", err);
    }
  };

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextDate = new Date(dateString);
    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `In ${diffDays} days`;
  };

  const handleScheduleClick = (patient: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPatientForSchedule(patient);
    setIsScheduleModalOpen(true);
  };

  const togglePlan = (id: string) => {
    setExpandedPlanId(prev => prev === id ? null : id);
  };

  const handleAddPatient = (newPatient: any) => {
    setPatientsList([...patientsList, newPatient]);
    setNewlyAddedPatientId(newPatient.id);
    
    // Remove the highlight after 10 seconds
    setTimeout(() => {
      setNewlyAddedPatientId(null);
    }, 10000);
  };

  const selectedPatient = patientsList.find(p => p.id === selectedPatientId);

  if (selectedPatient) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-8">
        <button 
          onClick={() => setSelectedPatientId(null)}
          className="flex items-center gap-2 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors font-medium text-sm w-fit"
        >
          <ChevronLeft size={16} />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="bg-white dark:bg-stone-800 p-8 rounded-3xl border border-stone-200 dark:border-stone-700 shadow-sm flex items-start justify-between">
          <div className="flex items-center gap-6">
            <img src={selectedPatient.avatarUrl} alt={selectedPatient.name} className="w-24 h-24 rounded-2xl object-cover shadow-sm" referrerPolicy="no-referrer" />
            <div>
              <h1 className="text-3xl font-semibold text-stone-900 dark:text-white">{selectedPatient.name}</h1>
              <div className="text-stone-500 dark:text-stone-400 mt-1 flex flex-wrap items-center gap-2">
                <span className="font-mono bg-stone-100 dark:bg-stone-700 px-2 py-0.5 rounded text-xs">{selectedPatient.mrn}</span>
                <span>•</span>
                <span>{selectedPatient.age} years old</span>
                <span>•</span>
                <span>{selectedPatient.phone}</span>
                <span>•</span>
                <div className="flex flex-wrap gap-1">
                  {selectedPatient.conditions.map((condition: string, index: number) => (
                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                      {condition}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-200">
                  {selectedPatient.aiCalls} AI Checkups completed
                </span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  selectedPatient.mood === 'improving' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                  selectedPatient.mood === 'declining' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' :
                  'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                }`}>
                  Mood: {selectedPatient.mood}
                </span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  selectedPatient.riskLevel === 'Low' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400' :
                  selectedPatient.riskLevel === 'Medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400' :
                  'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                }`}>
                  Risk: {selectedPatient.riskLevel}
                </span>
                {selectedPatient.missedCalls > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-400">
                    <PhoneMissed size={12} />
                    {selectedPatient.missedCalls} Missed {selectedPatient.missedCalls === 1 ? 'Call' : 'Calls'}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button 
            onClick={() => handleScheduleClick(selectedPatient)}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200"
          >
            <Bot size={18} />
            Schedule AI Checkup
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* AI Insights Table */}
            <div className="bg-white dark:bg-stone-800 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Bot size={20} className="text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-medium text-indigo-900 dark:text-indigo-100">AI Checkup Analysis</h3>
              </div>
              
              {selectedPatient.latest_analysis ? (
                <div className="overflow-hidden border border-stone-100 dark:border-stone-700 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-stone-50 dark:bg-stone-900/50">
                        <th className="px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-100 dark:border-stone-700">Date</th>
                        <th className="px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-100 dark:border-stone-700">Depression (1-10)</th>
                        <th className="px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-100 dark:border-stone-700">Anxiety (1-10)</th>
                        <th className="px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-100 dark:border-stone-700">SI Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-700">
                      <tr className="hover:bg-stone-50/50 dark:hover:bg-stone-700/30 transition-colors">
                        <td className="px-4 py-4 text-sm text-stone-900 dark:text-stone-200 font-medium">
                          {selectedPatient.latest_analysis.date || "Today"}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-lg font-bold ${
                            Number(selectedPatient.latest_analysis.depression_level) > 7 ? 'text-red-600 bg-red-50' : 
                            Number(selectedPatient.latest_analysis.depression_level) > 4 ? 'text-amber-600 bg-amber-50' : 'text-emerald-600 bg-emerald-50'
                          }`}>
                            {selectedPatient.latest_analysis.depression_level}/10
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-lg font-bold ${
                            Number(selectedPatient.latest_analysis.anxiety_level) > 7 ? 'text-red-600 bg-red-50' : 
                            Number(selectedPatient.latest_analysis.anxiety_level) > 4 ? 'text-amber-600 bg-amber-50' : 'text-emerald-600 bg-emerald-50'
                          }`}>
                            {selectedPatient.latest_analysis.anxiety_level}/10
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                            selectedPatient.latest_analysis.si_status === 'Flagged' ? 'bg-red-600 text-white animate-pulse' : 
                            selectedPatient.latest_analysis.si_status === 'Stable' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                          }`}>
                            {selectedPatient.latest_analysis.si_status === 'Flagged' && <AlertTriangle size={12} />}
                            {selectedPatient.latest_analysis.si_status}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="p-4 bg-stone-50/50 dark:bg-stone-900/30 border-t border-stone-100 dark:border-stone-700">
                    <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">AI Clinical Summary</p>
                    <p className="text-sm text-stone-700 dark:text-stone-300 italic">
                      "{selectedPatient.latest_analysis.clinical_summary}"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-stone-100 dark:border-stone-700 rounded-2xl">
                  <p className="text-sm text-stone-500 dark:text-stone-400">No AI analysis data available yet. Schedule a checkup to generate clinical metrics.</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Schedule Info */}
            <div className="bg-white dark:bg-stone-800 p-6 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm">
              <h3 className="text-lg font-medium mb-4 dark:text-white">Schedule</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider font-semibold mb-1">Next Session</p>
                  <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
                    <Calendar size={16} className="text-emerald-600 dark:text-emerald-500" />
                    <span className="font-medium">{selectedPatient.nextSession}</span>
                    <span className="text-xs text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-700 px-2 py-0.5 rounded-full">
                      {getDaysUntil(selectedPatient.nextSession)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider font-semibold mb-1">Last Session</p>
                  <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                    <Clock size={16} />
                    <span>{selectedPatient.lastSession}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Plans */}
            <div className="bg-white dark:bg-stone-800 p-6 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium flex items-center gap-2 dark:text-white">
                  <ClipboardList size={20} className="text-stone-400 dark:text-stone-500" />
                  Action Plans
                </h3>
              </div>
              <div className="space-y-3">
                {selectedPatient.actionPlans?.map((plan: any) => (
                  <div key={plan.id} className="border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden bg-stone-50 dark:bg-stone-800/50 transition-all">
                    <button 
                      onClick={() => togglePlan(plan.id)}
                      className="w-full flex items-center justify-between p-3 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                          <FileText size={20} className="text-red-500 dark:text-red-400" />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${plan.status === 'completed' ? 'text-stone-500 dark:text-stone-400 line-through' : 'text-stone-900 dark:text-stone-100'}`}>
                            {plan.title}.pdf
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-xs text-stone-500 dark:text-stone-400">{plan.date}</p>
                            <span className="text-[10px] text-stone-400 dark:text-stone-500">•</span>
                            <span className="text-xs text-stone-500 dark:text-stone-400 capitalize">{plan.status.replace('-', ' ')}</span>
                          </div>
                        </div>
                      </div>
                      {expandedPlanId === plan.id ? <ChevronUp size={16} className="text-stone-400 dark:text-stone-500" /> : <ChevronDown size={16} className="text-stone-400 dark:text-stone-500" />}
                    </button>
                    
                    {expandedPlanId === plan.id && (
                      <div className="p-4 border-t border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/30">
                        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
                          {plan.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {plan.status === 'completed' && <CheckCircle2 size={14} className="text-emerald-500" />}
                            {plan.status === 'in-progress' && <Clock3 size={14} className="text-amber-500" />}
                            {plan.status === 'pending' && <Circle size={14} className="text-stone-300 dark:text-stone-600" />}
                            <span className="text-xs font-medium text-stone-600 dark:text-stone-400 capitalize">{plan.status.replace('-', ' ')}</span>
                          </div>
                          <button className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1.5 rounded-lg transition-colors">
                            <FileDown size={14} />
                            Download PDF
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <ScheduleModal 
          isOpen={isScheduleModalOpen} 
          onClose={() => setIsScheduleModalOpen(false)} 
          patient={patientsList.find(p => p.id === patientForSchedule?.id)}
        />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 dark:text-white">Good morning, Dr. Li</h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">Here's what's happening with your patients today.</p>
      </header>

      <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-stone-200 dark:border-stone-700 flex justify-between items-center">
          <h2 className="text-lg font-medium dark:text-white">All Patients</h2>
        </div>
        <div className="divide-y divide-stone-100 dark:divide-stone-700">
          {patientsList.map(patient => (
            <div 
              key={patient.id} 
              className={`p-6 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors cursor-pointer ${
                newlyAddedPatientId === patient.id ? 'bg-emerald-50/50 dark:bg-emerald-900/20 animate-pulse-subtle border-l-4 border-l-emerald-500' : ''
              }`} 
              onClick={() => setSelectedPatientId(patient.id)}
            >
              <div className="flex items-center gap-4">
                <img src={patient.avatarUrl} alt={patient.name} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
                <div>
                  <h3 className="font-medium text-stone-900 dark:text-white flex items-center gap-2">
                    {patient.name}
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
                      patient.riskLevel === 'Low' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400' :
                      patient.riskLevel === 'Medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400' :
                      'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                    }`}>
                      {patient.riskLevel} Risk
                    </span>
                    {patient.missedCalls > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-400" title={`${patient.missedCalls} missed AI checkup ${patient.missedCalls === 1 ? 'call' : 'calls'}`}>
                        <PhoneMissed size={10} />
                        {patient.missedCalls} Missed
                      </span>
                    )}
                    {patient.riskLevel === 'High' && patient.missedCalls > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-600 dark:bg-red-500 text-white animate-pulse">
                        <AlertTriangle size={10} />
                        Urgent Action Required
                      </span>
                    )}
                  </h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {patient.conditions.map((condition: string, index: number) => (
                      <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm font-medium text-stone-900 dark:text-stone-100">Next Session</p>
                  <div className="flex items-center justify-end gap-2 mt-0.5">
                    <p className="text-sm text-stone-500 dark:text-stone-400">{patient.nextSession}</p>
                    <span className="text-xs text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-700 px-2 py-0.5 rounded-full">
                      {getDaysUntil(patient.nextSession)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => {
                      if (newlyAddedPatientId === patient.id) {
                        setNewlyAddedPatientId(null);
                      }
                      handleScheduleClick(patient, e);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      newlyAddedPatientId === patient.id 
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-200 dark:shadow-none animate-bounce-subtle' 
                        : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                    }`}
                  >
                    <Bot size={16} />
                    Schedule AI Checkup
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPatientId(patient.id);
                    }}
                    className="px-4 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-sm font-medium hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors dark:text-white"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 flex justify-center">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 hover:text-stone-900 dark:hover:text-white transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Add New Patient
          </button>
        </div>
      </div>

      <ScheduleModal 
        isOpen={isScheduleModalOpen} 
        onClose={() => setIsScheduleModalOpen(false)} 
        patient={patientsList.find(p => p.id === patientForSchedule?.id)}
      />
      <AddPatientModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAddPatient={handleAddPatient} 
      />
    </div>
  );
}
