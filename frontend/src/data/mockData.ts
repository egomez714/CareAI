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
    notes: 'Patient is focusing on breathing exercises. Monitoring sleep quality.',
    avatarUrl: 'https://ui-avatars.com/api/?name=Erick+Gomez&background=f5f5f4&color=57534e&size=150',
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
    notes: 'Sarah is struggling with morning energy levels. AI checkup needed mid-week.',
    avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Kim&background=f5f5f4&color=57534e&size=150',
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
    id: 'MRN-9910',
    mrn: 'MRN-9910',
    name: 'Christopher Hernandez',
    age: 20,
    conditions: ['ADHD', 'Focus Issues'],
    lastSession: '2026-02-28',
    nextSession: '2026-03-12',
    mood: 'good',
    riskLevel: 'Low',
    notes: 'Using Pomodoro technique successfully. Focus is improving.',
    avatarUrl: 'https://ui-avatars.com/api/?name=David+Wilson&background=f5f5f4&color=57534e&size=150',
    aiCalls: 1,
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
