import React from 'react';
import {
  Activity,
  Cpu,
  ShieldCheck,
  Zap,
  RotateCcw,
  Play,
  Gauge,
  Send,
  Bell,
  Sparkles,
} from 'lucide-react';
import { useDemoStore } from '../../store/useDemoStore';
import { useAlertsStore } from '../../store/useAlertsStore';
import { SCENARIOS } from '../../data/scenarios';
import { useI18n } from '../../i18n';
import { RiskChart } from './RiskChart';
import { EventLog } from './EventLog';
import { Button } from '../../components/Button';

export const UnderTheHood: React.FC = () => {
  const { t } = useI18n();
  const activeScenario = useDemoStore((s) => s.activeScenario);
  const currentDecision = useDemoStore((s) => s.currentDecision);
  const windows = useDemoStore((s) => s.windows);
  const speedMultiplier = useDemoStore((s) => s.speedMultiplier);
  const setSpeedMultiplier = useDemoStore((s) => s.setSpeedMultiplier);
  const startScenario = useDemoStore((s) => s.startScenario);
  const resetDemo = useDemoStore((s) => s.resetDemo);
  const alerts = useAlertsStore((s) => s.alerts);

  const scenarioDef = activeScenario ? SCENARIOS[activeScenario] : null;

  // Step 1: Detect live state
  const step1Score = currentDecision.smoothedScore;
  let step1Desc = 'Idle · Awaiting call stream to sample 3-second windows.';
  let step1Status = 'IDLE';
  let step1Color = 'text-vsMuted';
  if (windows.length > 0) {
    step1Desc = `Processing Window ${windows.length} · Moving Avg: ${step1Score.toFixed(2)}`;
    if (step1Score > 0.7) {
      step1Status = 'HIGH SPOOF RISK (>0.70)';
      step1Color = 'text-vsCoral font-bold';
    } else if (step1Score < 0.3) {
      step1Status = 'AUTHENTIC ACOUSTICS (<0.30)';
      step1Color = 'text-vsGreen font-bold';
    } else {
      step1Status = 'UNCERTAIN BUFFER (0.30 - 0.70)';
      step1Color = 'text-vsAmber font-bold';
    }
  }

  // Step 2: Verify Family live state
  const familyMatchPct = Math.round(currentDecision.familyMatch * 100);
  let step2Desc = 'Matching voiceprint vectors against enrolled family biometrics.';
  let step2Status = 'STANDBY';
  let step2Color = 'text-vsMuted';
  if (scenarioDef) {
    if (scenarioDef.isRegisteredNumber) {
      step2Status = `MATCH: ${familyMatchPct}% (Registered Contact: ${scenarioDef.callerName})`;
      step2Color = 'text-vsGreen font-bold';
      step2Desc = `Acoustic timbre correlates ${familyMatchPct}% with Mom's consent-stored voiceprint.`;
    } else {
      step2Status = `MISMATCH: ${familyMatchPct}% (Unregistered Number: ${scenarioDef.callerNumber})`;
      step2Color = 'text-vsCoral font-bold';
      step2Desc = `Caller claims to be "${scenarioDef.claimedMember}" but number is NOT in circle & match is low.`;
    }
  }

  // Step 3: Act & Protect live state
  let step3Status = 'MONITORING';
  let step3Desc = 'No action required while call is within safe parameters.';
  let step3Color = 'text-vsMuted';
  if (currentDecision.type === 'POSSIBLE_AI') {
    step3Status = 'DEFENSE ENGAGED';
    step3Color = 'text-vsCoral font-bold';
    step3Desc = 'Payment cooling lock turned ON · Safe redirect triggered · Family alert broadcasted.';
  } else if (currentDecision.type === 'UNCERTAIN') {
    step3Status = 'SAFE WORD CHALLENGE';
    step3Color = 'text-vsAmber font-bold';
    step3Desc = 'Awaiting confidential safe word input before releasing audio permissions.';
  } else if (currentDecision.type === 'LIKELY_REAL') {
    step3Status = 'ALLOWED THROUGH';
    step3Color = 'text-vsGreen font-bold';
    step3Desc = 'Zero intervention. Private audio line cleared for conversation.';
  }

  return (
    <div className="w-full bg-vsPanel/90 border border-white/10 rounded-3xl p-5 space-y-5 text-vsText shadow-xl">
      {/* Panel Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-vsBlue" />
            <h2 className="font-extrabold text-base text-white">{t('underTheHood.title')}</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-vsBlue/20 text-vsBlue font-bold">
              {t('underTheHood.badge')}
            </span>
          </div>
          <p className="text-[11px] text-vsMuted mt-0.5">
            Transparent algorithmic telemetry of detection, verification, and automated response.
          </p>
        </div>

        {/* Speed, Replay, Reset Controls */}
        <div className="flex items-center gap-2">
          {/* Speed Toggle */}
          <div className="flex items-center gap-1 bg-vsBg border border-white/10 p-1 rounded-xl text-xs font-mono">
            <span className="text-[10px] text-vsMuted px-1.5">{t('underTheHood.speed')}</span>
            <button
              type="button"
              onClick={() => setSpeedMultiplier(1.0)}
              className={`px-2 py-1 rounded-lg transition-colors ${
                speedMultiplier === 1.0 ? 'bg-vsBlue text-white font-bold' : 'text-vsMuted hover:text-white'
              }`}
            >
              1x
            </button>
            <button
              type="button"
              onClick={() => setSpeedMultiplier(2.0)}
              className={`px-2 py-1 rounded-lg transition-colors ${
                speedMultiplier === 2.0 ? 'bg-vsBlue text-white font-bold' : 'text-vsMuted hover:text-white'
              }`}
            >
              2x Fast
            </button>
          </div>

          {/* Replay Button */}
          {activeScenario && (
            <button
              type="button"
              onClick={() => startScenario(activeScenario)}
              className="p-2 rounded-xl bg-vsPanel border border-white/10 text-vsBlue hover:bg-vsBlue/20 transition-colors"
              title="Replay Active Scenario"
              aria-label="Replay current scenario"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Reset Button */}
          <button
            type="button"
            onClick={resetDemo}
            className="p-2 rounded-xl bg-vsPanel border border-white/10 text-vsMuted hover:text-white hover:bg-white/10 transition-colors"
            title="Reset Everything [R]"
            aria-label="Reset simulation"
          >
            <Zap className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 Step Live Pipeline Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* Step 1: Detect */}
        <div className="p-3.5 rounded-2xl bg-vsNavy/70 border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white uppercase tracking-wider text-[10px]">
              {t('underTheHood.step1')}
            </span>
            <Activity className="w-3.5 h-3.5 text-vsBlue" />
          </div>
          <span className={`text-[11px] font-mono block ${step1Color}`}>{step1Status}</span>
          <p className="text-[11px] text-vsMuted leading-relaxed">{step1Desc}</p>
        </div>

        {/* Step 2: Verify Family */}
        <div className="p-3.5 rounded-2xl bg-vsNavy/70 border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white uppercase tracking-wider text-[10px]">
              {t('underTheHood.step2')}
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-vsBlue" />
          </div>
          <span className={`text-[11px] font-mono block ${step2Color}`}>{step2Status}</span>
          <p className="text-[11px] text-vsMuted leading-relaxed">{step2Desc}</p>
        </div>

        {/* Step 3: Act */}
        <div className="p-3.5 rounded-2xl bg-vsNavy/70 border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white uppercase tracking-wider text-[10px]">
              {t('underTheHood.step3')}
            </span>
            <Zap className="w-3.5 h-3.5 text-vsBlue" />
          </div>
          <span className={`text-[11px] font-mono block ${step3Color}`}>{step3Status}</span>
          <p className="text-[11px] text-vsMuted leading-relaxed">{step3Desc}</p>
        </div>
      </div>

      {/* Real-Time Risk Chart */}
      <RiskChart windows={windows} />

      {/* Family Alert Notification Broadcast Card */}
      <div className="p-3.5 rounded-2xl bg-vsNavy/70 border border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-vsBlue" />
            {t('underTheHood.familyAlertPreview')}
          </span>
          <span className="text-[10px] font-mono text-vsMuted">Escalation Protocol</span>
        </div>

        <div className="p-3 rounded-xl bg-vsPanel border border-white/5 space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-vsCoral animate-ping" />
            <span className="font-bold text-vsCoral">
              [DISPATCHED TO: Mom, Rohan, Priya]
            </span>
          </div>
          <p className="text-[11px] text-vsText font-mono leading-relaxed">
            {currentDecision.type === 'POSSIBLE_AI'
              ? `🚨 URGENT: Voice Secure intercepted an AI-cloned call claiming to be Rohan from unknown number (+91 91234 56789). Payment lock active for 30 mins. Do NOT send money.`
              : currentDecision.type === 'UNCERTAIN'
              ? `⚠️ NOTICE: Screened call with acoustic uncertainty. Family safe-word requested for verification.`
              : `✓ STATUS NORMAL: All calls within verified thresholds. No active alerts.`}
          </p>
        </div>
      </div>

      {/* Live Event Audit Log */}
      <EventLog alerts={alerts} />

      {/* Keyboard Hint */}
      <div className="text-center text-[10px] font-mono text-vsMuted border-t border-white/10 pt-3">
        {t('underTheHood.keyboardShortcuts')}
      </div>
    </div>
  );
};
