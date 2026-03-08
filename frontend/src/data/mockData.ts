export const patients = [
  {
    id: '1',
    name: 'Christopher Hernandez',
    age: 20,
    conditions: ['Generalized Anxiety Disorder', 'Mild Insomnia'],
    lastSession: '2026-02-24',
    nextSession: '2026-03-08',
    mood: 'improving',
    riskLevel: 'Low',
    phone: '(555) 123-4567',
    notes: 'Christopher reported feeling less anxious in social situations this week. We discussed continuing the CBT exercises.',
    avatarUrl: 'https://picsum.photos/seed/christopher/150/150',
    aiCalls: 2,
    missedCalls: 0,
    hasUnreadAICall: false,
    upcomingSessions: [
      { id: 'us1', date: '2026-03-08', time: '10:00 AM', type: 'Therapy Session' },
      { id: 'us1_ai', date: '2026-03-15', time: '10:00 AM', type: 'AI Checkup' },
      { id: 'us2', date: '2026-03-22', time: '10:00 AM', type: 'Therapy Session' }
    ],
    actionPlans: [
      { id: 'ap1', date: '2026-02-24', title: 'Practice 4-7-8 breathing technique twice daily', status: 'in-progress', description: 'Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Repeat 4 times per session. Focus on relaxing the jaw and shoulders.' },
      { id: 'ap2', date: '2026-02-10', title: 'Complete thought record worksheet for social events', status: 'completed', description: 'Identify the situation, automatic thoughts, emotions, and rational counter-thoughts before attending the weekend gathering.' },
      { id: 'ap3', date: '2026-01-27', title: 'Establish a consistent 10 PM bedtime routine', status: 'completed', description: 'No screens after 9 PM. Read a physical book or listen to calming music. Keep the room cool and dark.' }
    ]
  },
  {
    id: '2',
    name: 'Erick Gomez',
    age: 22,
    conditions: ['Major Depressive Disorder'],
    lastSession: '2026-02-26',
    nextSession: '2026-03-10',
    mood: 'stable',
    riskLevel: 'Medium',
    phone: '(555) 987-6543',
    notes: 'Erick is maintaining his routine but still struggles with morning motivation. AI checkup recommended mid-week.',
    avatarUrl: 'https://github.com/egomez714.png',
    aiCalls: 5,
    missedCalls: 1,
    hasUnreadAICall: true,
    upcomingSessions: [
      { id: 'us3', date: '2026-03-10', time: '2:00 PM', type: 'Therapy Session' },
      { id: 'us3_ai', date: '2026-03-17', time: '2:00 PM', type: 'AI Checkup' },
      { id: 'us4', date: '2026-03-24', time: '2:00 PM', type: 'Therapy Session' }
    ],
    actionPlans: [
      { id: 'ap4', date: '2026-02-26', title: '15-minute morning walk within an hour of waking up', status: 'in-progress', description: 'Take a 15-minute walk outside within the first hour of waking up to get natural sunlight and light exercise.' },
      { id: 'ap5', date: '2026-02-12', title: 'Log daily mood and energy levels in journal', status: 'in-progress', description: 'Use the provided mood tracking template to log energy levels and mood score (1-10) every evening.' },
      { id: 'ap6', date: '2026-01-29', title: 'Reach out to one friend for a brief chat', status: 'completed', description: 'Send a text or make a short phone call to one friend or family member to maintain social connection.' }
    ]
  },
  {
    id: '3',
    name: 'Serafim Sharkov',
    age: 23,
    conditions: ['PTSD', 'Panic Disorder'],
    lastSession: '2026-02-20',
    nextSession: '2026-03-07',
    mood: 'declining',
    riskLevel: 'High',
    phone: '(555) 456-7890',
    notes: 'Experiencing increased nightmares. Scheduled an emergency AI checkup to monitor sleep patterns.',
    avatarUrl: 'https://github.com/syssefim.png',
    aiCalls: 1,
    missedCalls: 3,
    hasUnreadAICall: true,
    upcomingSessions: [
      { id: 'us5', date: '2026-03-07', time: '11:30 AM', type: 'Therapy Session' },
      { id: 'us5_ai', date: '2026-03-11', time: '11:30 AM', type: 'AI Checkup' },
      { id: 'us6', date: '2026-03-14', time: '11:30 AM', type: 'Therapy Session' }
    ],
    actionPlans: [
      { id: 'ap7', date: '2026-02-20', title: 'Use grounding techniques (5-4-3-2-1) during panic onset', status: 'in-progress', description: 'When feeling panic, identify 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.' },
      { id: 'ap8', date: '2026-02-06', title: 'Keep a nightmare log (time, theme, intensity)', status: 'pending', description: 'Keep a notebook by the bed. If you wake from a nightmare, briefly jot down the time, main theme, and intensity (1-10).' },
      { id: 'ap9', date: '2026-01-23', title: 'Listen to guided progressive muscle relaxation before sleep', status: 'completed', description: 'Listen to the 15-minute progressive muscle relaxation audio track provided in the patient portal before attempting to sleep.' }
    ]
  },
  {
    id: '4',
    name: 'The Primeagen',
    age: 19,
    conditions: ['ADHD'],
    lastSession: '2026-02-25',
    nextSession: '2026-03-15',
    mood: 'good',
    riskLevel: 'Low',
    phone: '(555) 234-5678',
    notes: 'Responding well to new medication dosage. Focus has improved significantly during lectures.',
    avatarUrl: 'https://yt3.googleusercontent.com/Eu_xR4JfLlrruwj1lrmfDiOpe8GARBs8M0hgQ6NsGhQ0qC8S-po9HEHw1W21sPN2BHO6EHXrSwM=s900-c-k-c0x00ffffff-no-rj',
    aiCalls: 0,
    missedCalls: 0,
    hasUnreadAICall: false,
    upcomingSessions: [
      { id: 'us7', date: '2026-03-15', time: '4:00 PM', type: 'Therapy Session' },
      { id: 'us8', date: '2026-03-29', time: '4:00 PM', type: 'Therapy Session' }
    ],
    actionPlans: [
      { id: 'ap10', date: '2026-02-25', title: 'Use Pomodoro technique (25m work/5m break) for studying', status: 'in-progress', description: 'Study for 25 minutes, then take a 5-minute break. After 4 cycles, take a 15-30 minute break. Use a physical timer.' },
      { id: 'ap11', date: '2026-02-11', title: 'Set up phone reminders for medication doses', status: 'completed', description: 'Set recurring daily alarms on your smartphone for 8:00 AM and 1:00 PM to ensure consistent medication timing.' },
      { id: 'ap12', date: '2026-01-28', title: 'Organize study space to minimize visual distractions', status: 'completed', description: 'Clear desk of all non-essential items. Keep only the current textbook, notebook, and pen visible while studying.' }
    ]
  }
];
