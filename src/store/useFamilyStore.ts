import { create } from 'zustand';

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  number: string;
  enrolled: boolean;
  enrolledAt?: string;
  consentConfirmed: boolean;
}

interface FamilyState {
  members: FamilyMember[];
  addMember: (member: Omit<FamilyMember, 'id'>) => void;
  deleteMember: (id: string) => void;
  deleteAllMembers: () => void;
  resetDefaults: () => void;
}

const STORAGE_KEY = 'vs_family_circle_v1';

const DEFAULT_MEMBERS: FamilyMember[] = [
  {
    id: 'fam-mom',
    name: 'Mom',
    relation: 'Mother',
    number: '+91 98260 12345',
    enrolled: true,
    enrolledAt: '2026-09-15',
    consentConfirmed: true,
  },
  {
    id: 'fam-rohan',
    name: 'Rohan',
    relation: 'Son',
    number: '+91 94250 88990',
    enrolled: true,
    enrolledAt: '2026-09-18',
    consentConfirmed: true,
  },
  {
    id: 'fam-priya',
    name: 'Priya',
    relation: 'Daughter',
    number: '+91 97130 55443',
    enrolled: false,
    consentConfirmed: false,
  },
];

function loadInitialMembers(): FamilyMember[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return DEFAULT_MEMBERS;
}

export const useFamilyStore = create<FamilyState>((set, get) => ({
  members: loadInitialMembers(),

  addMember: (memberData) => {
    const newMember: FamilyMember = {
      ...memberData,
      id: `fam-${Date.now()}`,
    };
    const updated = [...get().members, newMember];
    set({ members: updated });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // fallback
    }
  },

  deleteMember: (id: string) => {
    const updated = get().members.filter((m) => m.id !== id);
    set({ members: updated });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // fallback
    }
  },

  deleteAllMembers: () => {
    set({ members: [] });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch {
      // fallback
    }
  },

  resetDefaults: () => {
    set({ members: DEFAULT_MEMBERS });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MEMBERS));
    } catch {
      // fallback
    }
  },
}));
