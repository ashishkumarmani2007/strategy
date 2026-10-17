import { create } from 'zustand';
import { ScenarioId, WindowResult, Decision } from '../engine/DetectionEngine';
import { ScriptedEngine } from '../engine/ScriptedEngine';
import { decide } from '../engine/decide';
import { SCENARIOS } from '../data/scenarios';
import { useSettingsStore } from './useSettingsStore';
import { useAlertsStore } from './useAlertsStore';

export type CallState = 'IDLE' | 'CALLING' | 'DECIDED' | 'ENDED';

interface DemoState {
  activeScenario: ScenarioId | null;
  windows: WindowResult[];
  currentDecision: Decision;
  callState: CallState;
  speedMultiplier: number;
  safeWordStatus: 'IDLE' | 'VERIFIED' | 'FAILED';
  isCallBackSimulated: boolean;
  callBackMessage: string | null;
  isUpiModalOpen: boolean;
  isPaymentLockAlertOpen: boolean;
  activePhoneTab: 'home' | 'call' | 'family' | 'alerts' | 'settings';

  setSpeedMultiplier: (speed: number) => void;
  setActivePhoneTab: (tab: 'home' | 'call' | 'family' | 'alerts' | 'settings') => void;
  startScenario: (scenario: ScenarioId, customSpeed?: number) => void;
  stopScenario: () => void;
  resetDemo: () => void;
  verifySafeWord: (inputWord: string) => boolean;
  simulateCallBack: () => void;
  openUpiModal: () => void;
  closeUpiModal: () => void;
  dismissPaymentLockAlert: () => void;
}

const engine = new ScriptedEngine();

const initialDecision: Decision = {
  type: 'ANALYZING',
  smoothedScore: 0,
  rawScore: 0,
  familyMatch: 0,
  reasons: ['Ready to screen incoming call telemetry.'],
  recommendedAction: 'Choose a pitch scenario to initiate real-time screening.',
  windowIndex: -1,
};

export const useDemoStore = create<DemoState>((set, get) => ({
  activeScenario: null,
  windows: [],
  currentDecision: initialDecision,
  callState: 'IDLE',
  speedMultiplier: 1.0,
  safeWordStatus: 'IDLE',
  isCallBackSimulated: false,
  callBackMessage: null,
  isUpiModalOpen: false,
  isPaymentLockAlertOpen: false,
  activePhoneTab: 'call',

  setSpeedMultiplier: (speedMultiplier: number) => {
    set({ speedMultiplier });
  },

  setActivePhoneTab: (activePhoneTab) => {
    set({ activePhoneTab });
  },

  startScenario: (scenario: ScenarioId, customSpeed?: number) => {
    engine.stop();
    const speed = customSpeed ?? get().speedMultiplier;
    const scenarioDef = SCENARIOS[scenario];

    set({
      activeScenario: scenario,
      windows: [],
      currentDecision: initialDecision,
      callState: 'CALLING',
      safeWordStatus: 'IDLE',
      isCallBackSimulated: false,
      callBackMessage: null,
      isUpiModalOpen: false,
      isPaymentLockAlertOpen: false,
      activePhoneTab: 'call',
    });

    engine.start(
      scenario,
      (newWindow) => {
        const prevWindows = get().windows;
        const updatedWindows = [...prevWindows, newWindow];
        const newDecision = decide(updatedWindows);

        const isDecidedWindow = newWindow.index >= scenarioDef.decisionWindowIndex;
        const currentCallState = isDecidedWindow ? 'DECIDED' : 'CALLING';

        set({
          windows: updatedWindows,
          currentDecision: newDecision,
          callState: currentCallState,
        });

        // Trigger actions
        if (newDecision.type === 'POSSIBLE_AI') {
          useSettingsStore.getState().engagePaymentLock(30);
        }

        if (isDecidedWindow) {
          if (newDecision.type === 'POSSIBLE_AI') {
            useAlertsStore.getState().addAlert({
              title: 'AI Clone Scam Blocked',
              description: `Acoustic spoof score reached ${(newDecision.smoothedScore * 100).toFixed(0)}%. Caller claimed to be ${scenarioDef.claimedMember} from unknown number ${scenarioDef.callerNumber}. Payment lock engaged.`,
              severity: 'danger',
              scenarioId: scenario,
              callerNumber: scenarioDef.callerNumber,
            });
          } else if (newDecision.type === 'LIKELY_REAL') {
            useAlertsStore.getState().addAlert({
              title: 'Verified Family Caller',
              description: `Call verified from ${scenarioDef.callerName}. Voiceprint match: ${(newDecision.familyMatch * 100).toFixed(0)}%. Safe to talk.`,
              severity: 'success',
              scenarioId: scenario,
              callerNumber: scenarioDef.callerNumber,
            });
          } else if (newDecision.type === 'UNCERTAIN') {
            useAlertsStore.getState().addAlert({
              title: 'Uncertain Call Screened',
              description: `Ambiguous acoustic score (${(newDecision.smoothedScore * 100).toFixed(0)}%). Safe-word verification requested before granting trust.`,
              severity: 'warning',
              scenarioId: scenario,
              callerNumber: scenarioDef.callerNumber,
            });
          }
        }
      },
      () => {
        // Completion of scripted windows
        if (get().callState === 'CALLING') {
          set({ callState: 'DECIDED' });
        }
      },
      speed
    );
  },

  stopScenario: () => {
    engine.stop();
    set({ callState: 'ENDED' });
  },

  resetDemo: () => {
    engine.stop();
    set({
      activeScenario: null,
      windows: [],
      currentDecision: initialDecision,
      callState: 'IDLE',
      safeWordStatus: 'IDLE',
      isCallBackSimulated: false,
      callBackMessage: null,
      isUpiModalOpen: false,
      isPaymentLockAlertOpen: false,
    });
  },

  verifySafeWord: (inputWord: string) => {
    const configuredWord = useSettingsStore.getState().safeWord.trim().toLowerCase();
    const isCorrect = inputWord.trim().toLowerCase() === configuredWord;

    if (isCorrect) {
      set({
        safeWordStatus: 'VERIFIED',
        currentDecision: {
          ...get().currentDecision,
          type: 'LIKELY_REAL',
          reasons: [
            ...get().currentDecision.reasons,
            'Verified by confidential family safe word challenge.',
          ],
          recommendedAction: 'Safe word confirmed. Caller identity verified by family secret.',
        },
      });
      useAlertsStore.getState().addAlert({
        title: 'Safe Word Verified',
        description: 'Caller correctly answered family confidential safe word. Call cleared as trusted.',
        severity: 'success',
      });
      return true;
    } else {
      // Wrong word -> treated as scam
      useSettingsStore.getState().engagePaymentLock(30);
      set({
        safeWordStatus: 'FAILED',
        currentDecision: {
          ...get().currentDecision,
          type: 'POSSIBLE_AI',
          reasons: [
            ...get().currentDecision.reasons,
            'Failed family safe-word challenge. Flagged as fraudulent impersonation.',
          ],
          recommendedAction: 'Wrong safe word! Hang up immediately and verify with family on trusted registered line.',
        },
      });
      useAlertsStore.getState().addAlert({
        title: 'Safe Word Challenge Failed',
        description: 'Caller gave incorrect safe word response. Call escalated to spoofing attack, payment lock engaged.',
        severity: 'danger',
      });
      return false;
    }
  },

  simulateCallBack: () => {
    const activeScen = get().activeScenario;
    const scen = activeScen ? SCENARIOS[activeScen] : null;
    const contact = scen?.registeredContact || { name: 'Rohan (Son)', number: '+91 94250 88990' };

    set({
      isCallBackSimulated: true,
      callBackMessage: `Connecting to ${contact.name} (${contact.number})...\n\n${contact.name}: "Mummy, I am in college library. I never called you! I am completely safe."\n\n✓ Scam avoided. Contact confirmed safe.`,
    });

    useAlertsStore.getState().addAlert({
      title: 'Scam Avoided via Direct Call-Back',
      description: `User hung up suspect call and contacted registered number ${contact.number}. Loved one confirmed safe and uncompromised.`,
      severity: 'success',
    });
  },

  openUpiModal: () => {
    if (get().activeScenario === 'clone' || get().currentDecision.type === 'POSSIBLE_AI') {
      useSettingsStore.getState().engagePaymentLock(30);
    }
    set({ isUpiModalOpen: true });
  },

  closeUpiModal: () => {
    set({ isUpiModalOpen: false });
  },

  dismissPaymentLockAlert: () => {
    set({ isPaymentLockAlertOpen: false });
  },
}));
