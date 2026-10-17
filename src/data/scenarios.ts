import { ScenarioId, WindowResult } from '../engine/DetectionEngine';

export interface ScenarioDefinition {
  id: ScenarioId;
  titleKey: string;
  callerName: string;
  callerNumber: string;
  isRegisteredNumber: boolean;
  claimedMember?: string;
  claimSnippet: string;
  registeredContact?: {
    name: string;
    number: string;
  };
  windows: Array<{
    spoofScore: number;
    familyMatch: number;
    transcriptSnippet: string;
  }>;
  decisionWindowIndex: number; // 0-indexed window after which decision locks
  expectedOutcome: 'LIKELY_REAL' | 'POSSIBLE_AI' | 'UNCERTAIN';
}

export const SCENARIOS: Record<ScenarioId, ScenarioDefinition> = {
  real: {
    id: 'real',
    titleKey: 'scenarios.real.title',
    callerName: 'Mom (Saved Contact)',
    callerNumber: '+91 98260 12345',
    isRegisteredNumber: true,
    claimedMember: 'Mom',
    claimSnippet: 'Beta, lunch kar liya? Just checking on you before leaving the market.',
    registeredContact: {
      name: 'Mom',
      number: '+91 98260 12345',
    },
    windows: [
      { spoofScore: 0.10, familyMatch: 0.93, transcriptSnippet: 'Beta, lunch kar liya?' },
      { spoofScore: 0.08, familyMatch: 0.95, transcriptSnippet: 'Just checking on you before leaving...' },
      { spoofScore: 0.12, familyMatch: 0.94, transcriptSnippet: 'Going to the market now.' },
      { spoofScore: 0.09, familyMatch: 0.96, transcriptSnippet: 'Call me back when free.' },
      { spoofScore: 0.11, familyMatch: 0.95, transcriptSnippet: 'Take care, beta.' },
      { spoofScore: 0.10, familyMatch: 0.94, transcriptSnippet: 'Love you, bye.' },
    ],
    decisionWindowIndex: 3, // Decides after window 4 (0-indexed 3)
    expectedOutcome: 'LIKELY_REAL',
  },
  clone: {
    id: 'clone',
    titleKey: 'scenarios.clone.title',
    callerName: 'Unknown Caller (Claims: Rohan)',
    callerNumber: '+91 91234 56789',
    isRegisteredNumber: false,
    claimedMember: 'Rohan',
    claimSnippet: 'Says: Mummy, it\'s Rohan. I\'m in big trouble. Police station case, send ₹50,000 immediately to this UPI number!',
    registeredContact: {
      name: 'Rohan (Son)',
      number: '+91 94250 88990',
    },
    windows: [
      { spoofScore: 0.35, familyMatch: 0.44, transcriptSnippet: 'Mummy, it\'s Rohan. Can you hear me?' },
      { spoofScore: 0.52, familyMatch: 0.38, transcriptSnippet: 'I had an accident near MP Nagar...' },
      { spoofScore: 0.71, familyMatch: 0.33, transcriptSnippet: 'Police took my phone, calling from friend\'s.' },
      { spoofScore: 0.84, familyMatch: 0.31, transcriptSnippet: 'Need ₹50,000 urgently right now.' },
      { spoofScore: 0.88, familyMatch: 0.29, transcriptSnippet: 'Send to this UPI id immediately please!' },
      { spoofScore: 0.91, familyMatch: 0.28, transcriptSnippet: 'Don\'t disconnect the call, Mummy!' },
    ],
    decisionWindowIndex: 4, // Decides after window 5 (0-indexed 4)
    expectedOutcome: 'POSSIBLE_AI',
  },
  unclear: {
    id: 'unclear',
    titleKey: 'scenarios.unclear.title',
    callerName: 'Unknown Number (Claims: Rohan)',
    callerNumber: '+91 98765 43210',
    isRegisteredNumber: false,
    claimedMember: 'Rohan',
    claimSnippet: 'Says: Namaste aunty, main Rohan bol raha hoon. Line kharab hai, can you hear me clearly?',
    registeredContact: {
      name: 'Rohan (Son)',
      number: '+91 94250 88990',
    },
    windows: [
      { spoofScore: 0.42, familyMatch: 0.74, transcriptSnippet: 'Namaste aunty, Rohan here...' },
      { spoofScore: 0.51, familyMatch: 0.69, transcriptSnippet: 'There is a heavy storm, bad line...' },
      { spoofScore: 0.55, familyMatch: 0.72, transcriptSnippet: 'Are you getting my voice clearly?' },
      { spoofScore: 0.49, familyMatch: 0.70, transcriptSnippet: 'Uncle asked me to call you from this SIM.' },
      { spoofScore: 0.53, familyMatch: 0.68, transcriptSnippet: 'Please confirm what time you\'ll reach.' },
      { spoofScore: 0.50, familyMatch: 0.71, transcriptSnippet: 'I will wait for your reply.' },
    ],
    decisionWindowIndex: 4, // Decides after window 5 (0-indexed 4)
    expectedOutcome: 'UNCERTAIN',
  },
};
