import { useState } from 'react';
import { Bot, ChevronLeft, Calendar, Clock, FileText, PhoneMissed, ClipboardList, CheckCircle2, Circle, Clock3, FileDown, ChevronDown, ChevronUp } from 'lucide-react';
import { patients } from '../data/mockData';
import { ScheduleModal } from './ScheduleModal';

interface DashboardProps {
  setCurrentView: (view: string) => void;
}

export function Dashboard({ setCurrentView }: DashboardProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [patientForSchedule, setPatientForSchedule] = useState<any>(null);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

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

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  if (selectedPatient) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-8">
        <button 
          onClick={() => setSelectedPatientId(null)}
          className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors font-medium text-sm w-fit"
        >
          <ChevronLeft size={16} />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm flex items-start justify-between">
          <div className="flex items-center gap-6">
            <img src={selectedPatient.avatarUrl} alt={selectedPatient.name} className="w-24 h-24 rounded-2xl object-cover shadow-sm" referrerPolicy="no-referrer" />
            <div>
              <h1 className="text-3xl font-semibold text-stone-900">{selectedPatient.name}</h1>
              <div className="text-stone-500 mt-1 flex flex-wrap items-center gap-2">
                <span>{selectedPatient.age} years old</span>
                <span>•</span>
                <div className="flex flex-wrap gap-1">
                  {selectedPatient.conditions.map((condition: string, index: number) => (
                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-stone-100 text-stone-700">
                      {condition}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-800">
                  {selectedPatient.aiCalls} AI Checkups completed
                </span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  selectedPatient.mood === 'improving' ? 'bg-green-100 text-green-800' :
                  selectedPatient.mood === 'declining' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  Mood: {selectedPatient.mood}
                </span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  selectedPatient.riskLevel === 'Low' ? 'bg-emerald-100 text-emerald-800' :
                  selectedPatient.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  Risk: {selectedPatient.riskLevel}
                </span>
                {selectedPatient.missedCalls > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
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
            {/* Notes */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <FileText size={20} className="text-stone-400" />
                  Clinical Notes
                </h3>
                <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">Edit</button>
              </div>
              <p className="text-stone-600 leading-relaxed">
                {selectedPatient.notes}
              </p>
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Bot size={20} className="text-indigo-600" />
                <h3 className="text-lg font-medium text-indigo-900">AI Checkup Insights</h3>
              </div>
              {selectedPatient.aiCalls > 0 ? (
                <div className="space-y-4">
                  <div className="bg-white/60 p-4 rounded-xl border border-indigo-100/50">
                    <p className="text-sm font-medium text-indigo-900 mb-1">Latest Call: Oct 22, 2023</p>
                    <p className="text-sm text-indigo-800/80">Patient expressed mild frustration with sleep schedule. Sentiment analysis indicates stable overall mood but elevated stress markers in voice tone.</p>
                  </div>
                  <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View Full Transcript & Analysis →</button>
                </div>
              ) : (
                <p className="text-sm text-indigo-800/70">No AI checkups have been conducted yet. Schedule one to gather automated insights between sessions.</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Schedule Info */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <h3 className="text-lg font-medium mb-4">Schedule</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Next Session</p>
                  <div className="flex items-center gap-2 text-stone-900">
                    <Calendar size={16} className="text-emerald-600" />
                    <span className="font-medium">{selectedPatient.nextSession}</span>
                    <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                      {getDaysUntil(selectedPatient.nextSession)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Last Session</p>
                  <div className="flex items-center gap-2 text-stone-600">
                    <Clock size={16} />
                    <span>{selectedPatient.lastSession}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Plans */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <ClipboardList size={20} className="text-stone-400" />
                  Action Plans
                </h3>
              </div>
              <div className="space-y-3">
                {selectedPatient.actionPlans?.map((plan: any) => (
                  <div key={plan.id} className="border border-stone-200 rounded-xl overflow-hidden bg-stone-50 transition-all">
                    <button 
                      onClick={() => togglePlan(plan.id)}
                      className="w-full flex items-center justify-between p-3 bg-white hover:bg-stone-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                          <FileText size={20} className="text-red-500" />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${plan.status === 'completed' ? 'text-stone-500 line-through' : 'text-stone-900'}`}>
                            {plan.title}.pdf
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-xs text-stone-500">{plan.date}</p>
                            <span className="text-[10px] text-stone-400">•</span>
                            <span className="text-xs text-stone-500 capitalize">{plan.status.replace('-', ' ')}</span>
                          </div>
                        </div>
                      </div>
                      {expandedPlanId === plan.id ? <ChevronUp size={16} className="text-stone-400" /> : <ChevronDown size={16} className="text-stone-400" />}
                    </button>
                    
                    {expandedPlanId === plan.id && (
                      <div className="p-4 border-t border-stone-200 bg-stone-50/50">
                        <p className="text-sm text-stone-600 leading-relaxed mb-4">
                          {plan.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {plan.status === 'completed' && <CheckCircle2 size={14} className="text-emerald-500" />}
                            {plan.status === 'in-progress' && <Clock3 size={14} className="text-amber-500" />}
                            {plan.status === 'pending' && <Circle size={14} className="text-stone-300" />}
                            <span className="text-xs font-medium text-stone-600 capitalize">{plan.status.replace('-', ' ')}</span>
                          </div>
                          <button className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg transition-colors">
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
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">Good morning, Dr. Jenkins</h1>
        <p className="text-stone-500 mt-1">Here's what's happening with your patients today.</p>
      </header>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-stone-200 flex justify-between items-center">
          <h2 className="text-lg font-medium">All Patients</h2>
        </div>
        <div className="divide-y divide-stone-100">
          {patients.map(patient => (
            <div key={patient.id} className="p-6 flex items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer" onClick={() => setSelectedPatientId(patient.id)}>
              <div className="flex items-center gap-4">
                <img src={patient.avatarUrl} alt={patient.name} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
                <div>
                  <h3 className="font-medium text-stone-900 flex items-center gap-2">
                    {patient.name}
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
                      patient.riskLevel === 'Low' ? 'bg-emerald-100 text-emerald-800' :
                      patient.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {patient.riskLevel} Risk
                    </span>
                    {patient.missedCalls > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-rose-100 text-rose-800" title={`${patient.missedCalls} missed AI checkup ${patient.missedCalls === 1 ? 'call' : 'calls'}`}>
                        <PhoneMissed size={10} />
                        {patient.missedCalls} Missed
                      </span>
                    )}
                  </h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {patient.conditions.map((condition: string, index: number) => (
                      <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-stone-100 text-stone-600">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm font-medium text-stone-900">Next Session</p>
                  <div className="flex items-center justify-end gap-2 mt-0.5">
                    <p className="text-sm text-stone-500">{patient.nextSession}</p>
                    <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                      {getDaysUntil(patient.nextSession)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => handleScheduleClick(patient, e)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
                  >
                    <Bot size={16} />
                    Schedule AI Checkup
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPatientId(patient.id);
                    }}
                    className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium hover:bg-stone-50 transition-colors"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
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
