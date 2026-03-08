export const patients = [
  {
    id: 'MRN-8821',
    mrn: 'MRN-8821',
    name: 'Erick Gomez',
    age: 22,
    conditions: ['Anxiety', 'Insomnia'],
    lastSession: '2026-03-01',
    nextSession: '2026-03-15',
    mood: 'stable',
    riskLevel: 'Low',
    phone: '(555) 123-4567',
    notes: 'Emma reported feeling less anxious in social situations this week. We discussed continuing the CBT exercises.',
    avatarUrl: 'https://picsum.photos/seed/emma/150/150',
    aiCalls: 2,
    missedCalls: 0,
    phone: '+18056703413',
    upcomingSessions: [
      { id: 'us1', date: '2026-03-15', time: '10:00 AM', type: 'Therapy Session' }
    ],
    actionPlans: [
      { id: 'ap1', date: '2026-03-01', title: '5-4-7 Breathing Technique', status: 'in-progress', description: 'Inhale for 5, hold for 4, exhale for 7. Repeat twice daily.' }
    ]
  },
  {
    id: 'MRN-4432',
    mrn: 'MRN-4432',
    name: 'Wenqing Li',
    age: 23,
    conditions: ['Depression'],
    lastSession: '2026-03-02',
    nextSession: '2026-03-10',
    mood: 'declining',
    riskLevel: 'Medium',
    phone: '(555) 987-6543',
    notes: 'Michael is maintaining his routine but still struggles with morning motivation. AI checkup recommended mid-week.',
    avatarUrl: 'https://picsum.photos/seed/michael/150/150',
    aiCalls: 5,
    missedCalls: 1,
    phone: '+18056703413',
    upcomingSessions: [
      { id: 'us3', date: '2026-03-10', time: '2:00 PM', type: 'Therapy Session' }
    ],
    actionPlans: [
      { id: 'ap4', date: '2026-03-02', title: '15-minute Morning Walk', status: 'in-progress', description: 'Walk outside within 1 hour of waking up.' }
    ]
  },
  {
    id: '3',
    name: 'Sophia Martinez',
    age: 42,
    conditions: ['PTSD', 'Panic Disorder'],
    lastSession: '2026-02-20',
    nextSession: '2026-03-07',
    mood: 'declining',
    riskLevel: 'High',
    phone: '(555) 456-7890',
    notes: 'Experiencing increased nightmares. Scheduled an emergency AI checkup to monitor sleep patterns.',
    avatarUrl: 'https://picsum.photos/seed/sophia/150/150',
    aiCalls: 1,
    missedCalls: 3,
    upcomingSessions: [
      { id: 'us5', date: '2026-03-07', time: '11:30 AM', type: 'Therapy Session' },
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
    name: 'James Wilson',
    age: 19,
    conditions: ['ADHD'],
    lastSession: '2026-02-25',
    nextSession: '2026-03-15',
    mood: 'good',
    riskLevel: 'Low',
    phone: '(555) 234-5678',
    notes: 'Responding well to new medication dosage. Focus has improved significantly during lectures.',
    avatarUrl: 'https://picsum.photos/seed/james/150/150',
    aiCalls: 0,
    missedCalls: 0,
    phone: '+18056703413',
    upcomingSessions: [
      { id: 'us5', date: '2026-03-12', time: '11:30 AM', type: 'Therapy Session' }
    ],
    actionPlans: [
      { id: 'ap10', date: '2026-02-28', title: 'Pomodoro Study Sessions', status: 'in-progress', description: '25m work / 5m break cycles during study hours.' }
    ]
  },
  {
    id: 'MRN-1205',
    mrn: 'MRN-1205',
    name: 'Serafim Sharkov',
    age: 23,
    conditions: ['PTSD'],
    lastSession: '2026-03-05',
    nextSession: '2026-03-07',
    mood: 'anxious',
    riskLevel: 'High',
    notes: ' Maya reported high anxiety yesterday. Scheduled immediate AI follow-up.',
    avatarUrl: 'https://ui-avatars.com/api/?name=Maya+Patel&background=f5f5f4&color=57534e&size=150',
    aiCalls: 0,
    missedCalls: 3,
    phone: '+18056703413',
    upcomingSessions: [
      { id: 'us7', date: '2026-03-07', time: '4:00 PM', type: 'Therapy Session' }
    ],
    actionPlans: [
      { id: 'ap7', date: '2026-03-05', title: 'Grounding Exercises', status: 'pending', description: 'Identify 5 things you see, 4 you can touch...' }
    ]
  }
];
