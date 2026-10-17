import { create } from 'zustand';

interface SettingsState {
  safeWord: string;
  paymentLockDurationMinutes: number;
  isPaymentLocked: boolean;
  paymentLockExpiresAt: number | null;
  reducedMotion: boolean;
  micCheckEnabled: boolean;
  setSafeWord: (word: string) => void;
  setPaymentLockDuration: (mins: number) => void;
  setReducedMotion: (val: boolean) => void;
  setMicCheckEnabled: (val: boolean) => void;
  engagePaymentLock: (durationMinutes?: number) => void;
  unlockPayment: () => void;
  clearAllData: () => void;
}

const STORAGE_KEY = 'vs_settings_v1';

function loadInitialSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return {
    safeWord: 'nimbu',
    paymentLockDurationMinutes: 30,
    reducedMotion: false,
    micCheckEnabled: true,
    isPaymentLocked: false,
    paymentLockExpiresAt: null,
  };
}

export const useSettingsStore = create<SettingsState>((set, get) => {
  const initial = loadInitialSettings();

  const persist = (data: Partial<SettingsState>) => {
    try {
      const current = get();
      const payload = {
        safeWord: data.safeWord ?? current.safeWord,
        paymentLockDurationMinutes: data.paymentLockDurationMinutes ?? current.paymentLockDurationMinutes,
        reducedMotion: data.reducedMotion ?? current.reducedMotion,
        micCheckEnabled: data.micCheckEnabled ?? current.micCheckEnabled,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }
  };

  return {
    safeWord: initial.safeWord || 'nimbu',
    paymentLockDurationMinutes: initial.paymentLockDurationMinutes || 30,
    isPaymentLocked: false,
    paymentLockExpiresAt: null,
    reducedMotion: initial.reducedMotion || false,
    micCheckEnabled: initial.micCheckEnabled ?? true,

    setSafeWord: (safeWord: string) => {
      set({ safeWord });
      persist({ safeWord });
    },

    setPaymentLockDuration: (paymentLockDurationMinutes: number) => {
      set({ paymentLockDurationMinutes });
      persist({ paymentLockDurationMinutes });
    },

    setReducedMotion: (reducedMotion: boolean) => {
      set({ reducedMotion });
      persist({ reducedMotion });
    },

    setMicCheckEnabled: (micCheckEnabled: boolean) => {
      set({ micCheckEnabled });
      persist({ micCheckEnabled });
    },

    engagePaymentLock: (durationMinutes?: number) => {
      const mins = durationMinutes ?? get().paymentLockDurationMinutes;
      const expiresAt = Date.now() + mins * 60 * 1000;
      set({ isPaymentLocked: true, paymentLockExpiresAt: expiresAt });
    },

    unlockPayment: () => {
      set({ isPaymentLocked: false, paymentLockExpiresAt: null });
    },

    clearAllData: () => {
      try {
        localStorage.clear();
      } catch {
        // ignore
      }
      set({
        safeWord: 'nimbu',
        paymentLockDurationMinutes: 30,
        isPaymentLocked: false,
        paymentLockExpiresAt: null,
        reducedMotion: false,
        micCheckEnabled: true,
      });
    },
  };
});
