import React from 'react';
import {
  Phone,
  PhoneOff,
  PhoneForwarded,
  ShieldCheck,
  AlertOctagon,
  AlertTriangle,
  Lock,
  ArrowRight,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { useDemoStore } from '../../store/useDemoStore';
import { SCENARIOS } from '../../data/scenarios';
import { useI18n } from '../../i18n';
import { Meter } from '../../components/Meter';
import { Chip } from '../../components/Chip';
import { Button } from '../../components/Button';
import { SafeWordPrompt } from './SafeWordPrompt';

export const CallScreen: React.FC = () => {
  const { t } = useI18n();
  const activeScenario = useDemoStore((s) => s.activeScenario);
  const currentDecision = useDemoStore((s) => s.currentDecision);
  const callState = useDemoStore((s) => s.callState);
  const windows = useDemoStore((s) => s.windows);
  const isCallBackSimulated = useDemoStore((s) => s.isCallBackSimulated);
  const callBackMessage = useDemoStore((s) => s.callBackMessage);
  const simulateCallBack = useDemoStore((s) => s.simulateCallBack);
  const openUpiModal = useDemoStore((s) => s.openUpiModal);
  const stopScenario = useDemoStore((s) => s.stopScenario);
  const startScenario = useDemoStore((s) => s.startScenario);

  const scenarioDef = activeScenario ? SCENARIOS[activeScenario] : null;

  // Empty state when no scenario selected
  if (!activeScenario || !scenarioDef) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[460px] space-y-4">
        <div className="w-16 h-16 rounded-full bg-vsPanel border border-white/10 flex items-center justify-center text-vsBlue shadow-inner shadow-vsBlue/20">
          <Phone className="w-8 h-8 text-vsBlue/80" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white">Call Shield Active</h3>
          <p className="text-xs text-vsMuted max-w-[240px]">
            Ready to screen live calls. Choose a scenario above to start real-time telemetry.
          </p>
        </div>
        <div className="pt-2 flex flex-col gap-2 w-full max-w-xs">
          <Button
            variant="outline"
            size="sm"
            onClick={() => startScenario('clone')}
            className="text-xs"
          >
            Launch Cloned Voice Scam (Demo)
          </Button>
        </div>
      </div>
    );
  }

  const latestWindow = windows[windows.length - 1];
  const decisionType = currentDecision.type;
  const isDecided = callState === 'DECIDED';

  // Dynamic styling based on decision state
  let stateBorder = 'border-white/10';
  let stateGlow = '';
  if (decisionType === 'LIKELY_REAL') {
    stateBorder = 'border-vsGreen/40';
    stateGlow = 'shadow-lg shadow-vsGreen/10';
  } else if (decisionType === 'POSSIBLE_AI') {
    stateBorder = 'border-vsCoral/50';
    stateGlow = 'shadow-xl shadow-vsCoral/20';
  } else if (decisionType === 'UNCERTAIN') {
    stateBorder = 'border-vsAmber/40';
    stateGlow = 'shadow-lg shadow-vsAmber/10';
  }

  return (
    <div
      className={`flex flex-col justify-between p-4 sm:p-5 rounded-3xl bg-vsNavy/95 border ${stateBorder} ${stateGlow} transition-all duration-300 min-h-[490px] relative overflow-hidden`}
      aria-live="polite"
    >
      {/* Top Header: Screening Status & Speed */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                decisionType === 'POSSIBLE_AI'
                  ? 'bg-vsCoral'
                  : decisionType === 'UNCERTAIN'
                  ? 'bg-vsAmber'
                  : 'bg-vsGreen'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                decisionType === 'POSSIBLE_AI'
                  ? 'bg-vsCoral'
                  : decisionType === 'UNCERTAIN'
                  ? 'bg-vsAmber'
                  : 'bg-vsGreen'
              }`}
            />
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-vsMuted">
            {isDecided ? t('callScreen.active') : t('callScreen.incoming')}
          </span>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-vsPanel text-vsMuted border border-white/5">
          {t('callScreen.demoSpeed')}
        </span>
      </div>

      {/* Simulated Call Back View if triggered */}
      {isCallBackSimulated ? (
        <div className="my-auto py-6 px-4 bg-vsPanel rounded-2xl border border-vsGreen/40 text-center space-y-4 animate-in zoom-in-95">
          <div className="w-14 h-14 mx-auto rounded-full bg-vsGreen/20 border border-vsGreen flex items-center justify-center text-vsGreen">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-extrabold text-white">
              {t('callScreen.scamAvoided')}
            </h4>
            <p className="text-xs text-vsMuted">
              Contact confirmed via secure registered cellular channel.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-vsBg/80 border border-white/10 text-xs font-mono text-vsText text-left whitespace-pre-line leading-relaxed">
            {callBackMessage}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => startScenario(activeScenario)}
            className="w-full text-xs font-bold"
          >
            Replay Scenario
          </Button>
        </div>
      ) : (
        <>
          {/* Caller Details & Claim */}
          <div className="pt-2 text-center space-y-1">
            <h3 className="text-lg font-extrabold text-white tracking-tight">
              {scenarioDef.callerName}
            </h3>
            <p className="text-xs font-mono text-vsMuted">{scenarioDef.callerNumber}</p>
            <div className="mt-2 p-2.5 rounded-xl bg-vsPanel/80 border border-white/5 text-xs text-vsText italic leading-snug max-w-sm mx-auto">
              "{latestWindow?.transcriptSnippet || scenarioDef.claimSnippet}"
            </div>
          </div>

          {/* Animated Waveform Visualization */}
          <div className="my-3 flex items-center justify-center gap-1 h-9">
            {Array.from({ length: 24 }).map((_, i) => {
              const heights = [12, 24, 18, 32, 16, 28, 20, 36, 14, 22, 30, 18];
              const h = heights[i % heights.length];
              const barColor =
                decisionType === 'POSSIBLE_AI'
                  ? 'bg-vsCoral'
                  : decisionType === 'UNCERTAIN'
                  ? 'bg-vsAmber'
                  : 'bg-vsGreen';

              return (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-200 ${barColor}`}
                  style={{
                    height: `${callState === 'ENDED' ? 4 : h}px`,
                    opacity: 0.6 + (i % 4) * 0.1,
                  }}
                />
              );
            })}
          </div>

          {/* Real-time Telemetry Scores */}
          <div className="bg-vsPanel p-4 rounded-2xl border border-white/10 space-y-3">
            {/* Spoof Risk Score & Meter */}
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium text-vsMuted">
                  {t('callScreen.riskScore')}
                </span>
                <div className="flex items-baseline gap-1.5 font-mono">
                  <span
                    className={`text-2xl font-black ${
                      currentDecision.smoothedScore > 0.7
                        ? 'text-vsCoral'
                        : currentDecision.smoothedScore < 0.3
                        ? 'text-vsGreen'
                        : 'text-vsAmber'
                    }`}
                  >
                    {currentDecision.smoothedScore.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-vsMuted">/ 1.00</span>
                </div>
              </div>
              <Meter score={currentDecision.smoothedScore} showLabels={true} />
            </div>

            {/* Family Voiceprint Match Line */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-vsMuted flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-vsBlue" />
                {t('callScreen.familyMatch')}
              </span>
              <span className="font-mono font-bold text-white">
                {Math.round(currentDecision.familyMatch * 100)}%
              </span>
            </div>
          </div>

          {/* Outcome & Action Area */}
          <div className="mt-3 space-y-2.5">
            {/* LIKELY_REAL Outcome */}
            {decisionType === 'LIKELY_REAL' && (
              <div className="p-3 rounded-xl bg-vsGreen/10 border border-vsGreen/30 text-vsGreen flex items-center gap-2 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{t('callScreen.safeState')}</span>
              </div>
            )}

            {/* POSSIBLE_AI Outcome */}
            {decisionType === 'POSSIBLE_AI' && (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-vsCoral/15 border border-vsCoral/40 text-vsCoral flex items-center gap-2 text-xs font-semibold">
                  <AlertOctagon className="w-4 h-4 shrink-0" />
                  <span>{t('callScreen.dangerState')}</span>
                </div>

                <div className="grid grid-cols-1 gap-2 pt-1">
                  <Button
                    variant="danger"
                    size="md"
                    className="w-full text-xs font-bold"
                    onClick={simulateCallBack}
                    icon={<PhoneForwarded className="w-4 h-4" />}
                  >
                    {t('callScreen.hangUpAndCall')}
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full text-xs font-bold border-vsCoral/40 text-vsCoral hover:bg-vsCoral/10"
                    onClick={openUpiModal}
                    icon={<Lock className="w-4 h-4" />}
                  >
                    {t('callScreen.trySendMoney')}
                  </Button>
                </div>
              </div>
            )}

            {/* UNCERTAIN Outcome */}
            {decisionType === 'UNCERTAIN' && (
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-vsAmber/15 border border-vsAmber/40 text-vsAmber flex items-center gap-2 text-xs font-semibold">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{t('callScreen.uncertainState')}</span>
                </div>
                <SafeWordPrompt />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-semibold"
                  onClick={simulateCallBack}
                  icon={<PhoneForwarded className="w-3.5 h-3.5" />}
                >
                  {t('callScreen.callBackDirect')}
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Bottom End Simulation Button */}
      <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs">
        <span className="font-mono text-[10px] text-vsMuted">
          Windows: {windows.length} / {scenarioDef.windows.length}
        </span>
        <button
          type="button"
          onClick={stopScenario}
          className="text-vsMuted hover:text-white transition-colors flex items-center gap-1 text-[11px]"
        >
          <PhoneOff className="w-3.5 h-3.5" />
          <span>{t('callScreen.endCall')}</span>
        </button>
      </div>
    </div>
  );
};
