import React, { useState, useEffect, useCallback } from 'react';
import { Bot, ChevronLeft, Calendar, Clock, FileText, PhoneMissed, ClipboardList, CheckCircle2, Circle, Clock3, FileDown, ChevronDown, ChevronUp, X, AlertTriangle, MessageSquare } from 'lucide-react';

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
  const [expandedCallId, setExpandedCallId] = useState<number | null>(null);
  
  // 🚨 NEW STATE: Controls the Chat History dropdown
  const [showTranscriptFor, setShowTranscriptFor] = useState<number | null>(null);

  const [patientsList, setPatientsList] = useState<any[]>([]);

  // --- STRICT MONGODB SYNC LOGIC ---
  const syncWithBackend = useCallback(async () => {
    try {
      console.log("🔄 Fetching patients strictly from MongoDB...");
      const response = await fetch('http://localhost:8000/api/patients');
      
      if (response.ok) {
        const dbPatients = await response.json();
        
        const formattedPatients = dbPatients.map((dbPatient: any) => ({
          id: dbPatient.patient_mrn, 
          name: dbPatient.patient_name || "Unknown Patient",
          mrn: dbPatient.patient_mrn || "Unknown MRN",
          age: dbPatient.age || 42,
          phone: dbPatient.patient_phone || dbPatient.phone || "+1 (555) 000-0000",
          riskLevel: dbPatient.risk_level || "Low",
          mood: dbPatient.mood || "Stable",
          missedCalls: dbPatient.missedCalls || 0,
          nextSession: dbPatient.nextSession || "Pending",
          lastSession: dbPatient.lastSession || "Unknown",
          avatarUrl: dbPatient.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(dbPatient.patient_name || "User")}&background=random`,
          conditions: dbPatient.conditions || ["General Monitoring"],
          actionPlans: dbPatient.actionPlans || [],
          latest_analysis: dbPatient.latest_analysis || null,
          analysis_history: dbPatient.analysis_history || (dbPatient.latest_analysis ? [dbPatient.latest_analysis] : []),
          
          // 🚨 FIX: Extracting the Chat History (Transcript) from MongoDB
          rawTranscript: dbPatient.raw_transcript || null
        }));

        setPatientsList(formattedPatients);
        console.log("✅ Loaded from DB:", formattedPatients);
      }
    } catch (err) {
      console.error("❌ Fetch failed:", err);
    }
  }, []);

  useEffect(() => {
    syncWithBackend(); 
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

  const refreshPatientData = async (mrn: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/patients/${mrn}`);
      if (!response.ok) throw new Error("Failed to fetch updated patient");
      
      const updatedPatient = await response.json();

      setPatientsList(prev => {
        return prev.map(p => {
          if (p.mrn === mrn || p.id === mrn) {
            return { 
              ...p, 
              ...updatedPatient, 
              age: updatedPatient.age || p.age, 
              phone: updatedPatient.patient_phone || p.phone,
              analysis_history: updatedPatient.analysis_history || (updatedPatient.latest_analysis ? [updatedPatient.latest_analysis] : []),
              rawTranscript: updatedPatient.raw_transcript || p.rawTranscript
            };
          }
          return p;
        });
      });
    } catch (err) {
      console.error("Failed to refresh patient state:", err);
    }
  };

  const getDaysUntil = (dateString: string) => {
    if (!dateString || dateString === 'Pending') return 'Pending';
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

  const formatSessionDate = (dateString: string) => {
    if (!dateString || dateString === 'Never' || dateString === 'Pending') return dateString;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  const handleScheduleClick = (patient: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPatientForSchedule(patient);
    setIsScheduleModalOpen(true);
  };

  const togglePlan = (id: string) => {
    setExpandedPlanId(prev => prev === id ? null : id);
  };

  const toggleCall = (id: number) => {
    setExpandedCallId(prev => prev === id ? null : id);
    setShowTranscriptFor(null); // Close chat history when closing the log
  };

  const handleAddPatient = (newPatient: any) => {
    setPatientsList([...patientsList, newPatient]);
    setNewlyAddedPatientId(newPatient.id);
    setTimeout(() => setNewlyAddedPatientId(null), 10000);
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
              
              <div className="text-stone-500 dark:text-stone-400 mt-1 flex flex-wrap items-center gap-2 text-sm font-medium">
                <span>{selectedPatient.age || "Unknown"} years old</span>
                <span>•</span>
                <span>MRN: {selectedPatient.mrn || "Unknown"}</span>
                <span>•</span>
                <span>{selectedPatient.phone || "Unknown Phone"}</span>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedPatient.conditions.map((condition: string, index: number) => (
                  <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                    {condition}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-2 mt-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  selectedPatient.mood === 'Improving' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                  selectedPatient.mood === 'Declining' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' :
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
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200 dark:shadow-none hover:shadow-lg hover:-translate-y-0.5"
          >
            <Bot size={20} />
            Schedule AI Checkup
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* 🧠 History Call Logs Data Integration */}
            <div className="bg-white dark:bg-stone-800 p-6 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Bot size={20} className="text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg font-medium text-stone-900 dark:text-white">AI Checkup History</h3>
              </div>
              
              {selectedPatient.analysis_history && selectedPatient.analysis_history.length > 0 ? (
                <div className="space-y-3">
                  {selectedPatient.analysis_history.map((analysis: any, index: number) => (
                    <div key={index} className={`border rounded-xl overflow-hidden transition-all ${index === 0 ? 'border-emerald-100 dark:border-emerald-800/40 bg-stone-50 dark:bg-stone-800/50' : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800'}`}>
                      <button 
                        onClick={() => toggleCall(index)}
                        className="w-full flex items-center justify-between p-3 hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 text-left">
                          <div className={`relative w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${index === 0 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400'}`}>
                            <Bot size={14} />
                            {index === 0 && (
                              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white dark:border-stone-800"></span>
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-stone-900 dark:text-white">
                              {index === 0 ? "Latest AI Checkup" : "Previous AI Checkup"}
                            </p>
                            <p className="text-xs text-stone-500 dark:text-stone-400">{analysis.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${index === 0 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' : 'text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-700/50'}`}>
                            View Insight
                          </span>
                          {expandedCallId === index ? <ChevronUp size={16} className="text-stone-400 dark:text-stone-500" /> : <ChevronDown size={16} className="text-stone-400 dark:text-stone-500" />}
                        </div>
                      </button>
                      
                      {expandedCallId === index && (
                        <div className={`p-4 border-t ${index === 0 ? 'border-emerald-100 dark:border-emerald-800/40 bg-emerald-50/30 dark:bg-emerald-900/10' : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/30'}`}>
                          <div>
                            <p className={`flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold mb-2 ${index === 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-500 dark:text-stone-400'}`}>
                              <Bot size={14} /> Gemini Clinical Summary
                            </p>
                            <p className="text-sm text-stone-700 dark:text-stone-200 leading-relaxed font-medium">
                              {analysis.clinical_summary}
                            </p>
                          </div>
                          <div className="mt-4 flex flex-col gap-3 border-t border-stone-200/60 dark:border-stone-700 pt-3">
                            <div className="flex gap-4 items-center">
                              {analysis.mood && (
                                 <div className="text-xs text-stone-500 dark:text-stone-400">
                                   <span className="font-semibold text-stone-700 dark:text-stone-300">Detected Mood:</span> {analysis.mood}
                                 </div>
                              )}
                              {analysis.risk_level && (
                                 <div className="text-xs text-stone-500 dark:text-stone-400">
                                   <span className="font-semibold text-stone-700 dark:text-stone-300">Assessed Risk:</span> {analysis.risk_level}
                                 </div>
                              )}
                            </div>
                            
                            {/* 🚨 CHAT HISTORY BUTTON & DROPDOWN */}
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowTranscriptFor(prev => prev === index ? null : index);
                              }}
                              className={`flex items-center gap-1.5 text-xs font-semibold w-fit transition-colors ${index === 0 ? 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300' : 'text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-300'}`}
                            >
                              <MessageSquare size={14} />
                              {showTranscriptFor === index ? "Hide Chat History" : "View Chat History"}
                            </button>

                            {showTranscriptFor === index && (
                              <div className="mt-2 p-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 max-h-48 overflow-y-auto shadow-inner">
                                <p className="text-xs text-stone-600 dark:text-stone-300 whitespace-pre-wrap font-mono leading-relaxed">
                                  {index === 0 && selectedPatient.rawTranscript 
                                    ? selectedPatient.rawTranscript 
                                    : "Chat history not currently available for older calls."}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-500 dark:text-stone-400 italic">No AI checkups have been conducted yet. Schedule one to gather automated insights between sessions.</p>
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
                    <span className="font-medium">{formatSessionDate(selectedPatient.nextSession)}</span>
                    {selectedPatient.nextSession !== 'Pending' && (
                      <span className="text-xs text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-700 px-2 py-0.5 rounded-full">
                        {getDaysUntil(selectedPatient.nextSession)}
                      </span>
                    )}
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
          patient={patientForSchedule}
        />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 dark:text-white">Good morning, Dr. Li 👋</h1>
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
                <div className="relative">
                  <img src={patient.avatarUrl} alt={patient.name} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
                  {patient.latest_analysis && (
                    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-stone-800"></span>
                    </span>
                  )}
                </div>
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
                    <p className="text-sm text-stone-500 dark:text-stone-400">{formatSessionDate(patient.nextSession)}</p>
                    {patient.nextSession !== 'Pending' && (
                      <span className="text-xs text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-700 px-2 py-0.5 rounded-full">
                        {getDaysUntil(patient.nextSession)}
                      </span>
                    )}
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      newlyAddedPatientId === patient.id 
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-200 dark:shadow-none animate-bounce-subtle' 
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-200 dark:shadow-none hover:shadow-md hover:-translate-y-0.5'
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
        patient={patientForSchedule}
      />
      <AddPatientModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAddPatient={handleAddPatient} 
      />
    </div>
  );
}