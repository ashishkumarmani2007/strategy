import { create } from 'zustand';

export type AlertSeverity = 'info' | 'warning' | 'danger' | 'success';

export interface SecurityAlert {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  scenarioId?: string;
  callerNumber?: string;
}

interface AlertsState {
  alerts: SecurityAlert[];
  addAlert: (alert: Omit<SecurityAlert, 'id' | 'timestamp'>) => void;
  clearAlerts: () => void;
}

const STORAGE_KEY = 'vs_security_alerts_v1';

const INITIAL_ALERTS: SecurityAlert[] = [
  {
    id: 'alt-init-1',
    timestamp: '10:14 AM Today',
    title: 'Routine Call Verified',
    description: 'Incoming call from Mom (+91 98260 12345) verified against enrolled voiceprint with 95% acoustic match.',
    severity: 'success',
  },
  {
    id: 'alt-init-2',
    timestamp: 'Yesterday 4:30 PM',
    title: 'Unknown Caller Screened',
    description: 'Call from unknown number screened with low spoof probability. No family impersonation detected.',
    severity: 'info',
  },
];

function loadAlerts(): SecurityAlert[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return INITIAL_ALERTS;
}

export const useAlertsStore = create<AlertsState>((set, get) => ({
  alerts: loadAlerts(),

  addAlert: (alertData) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newAlert: SecurityAlert = {
      ...alertData,
      id: `alt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: `${time} Today`,
    };
    const updated = [newAlert, ...get().alerts];
    set({ alerts: updated });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // fallback
    }
  },

  clearAlerts: () => {
    set({ alerts: [] });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch {
      // fallback
    }
  },
}));
