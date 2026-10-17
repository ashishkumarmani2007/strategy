import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { MicEngine, MicSignalStats } from '../../engine/MicEngine';
import { useI18n } from '../../i18n';
import { Button } from '../../components/Button';
import { Meter } from '../../components/Meter';

export const MicCheck: React.FC = () => {
  const { t } = useI18n();
  const [isActive, setIsActive] = useState(false);
  const [stats, setStats] = useState<MicSignalStats | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const micEngineRef = useRef<MicEngine | null>(null);

  useEffect(() => {
    micEngineRef.current = new MicEngine();
    return () => {
      if (micEngineRef.current) {
        micEngineRef.current.stop();
      }
    };
  }, []);

  const handleToggle = async () => {
    setErrorMsg(null);
    if (!micEngineRef.current) return;

    if (isActive) {
      micEngineRef.current.stop();
      setIsActive(false);
      setStats(null);
    } else {
      const res = await micEngineRef.current.start((newStats) => {
        setStats(newStats);
      });

      if (res.success) {
        setIsActive(true);
      } else {
        setErrorMsg(res.error || 'Failed to access microphone.');
        setIsActive(false);
      }
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-vsPanel border border-white/10 space-y-3 text-vsText">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
            <Mic className="w-4 h-4 text-vsBlue" />
            {t('mic.title')}
          </h4>
          <p className="text-xs text-vsMuted leading-relaxed">{t('mic.subtitle')}</p>
        </div>

        <Button
          variant={isActive ? 'danger' : 'primary'}
          size="sm"
          onClick={handleToggle}
          icon={isActive ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          className="shrink-0 text-xs font-bold"
        >
          {isActive ? t('mic.stopButton') : t('mic.startButton')}
        </Button>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-vsCoral/15 border border-vsCoral/40 text-vsCoral text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {isActive && stats && (
        <div className="p-3.5 rounded-xl bg-vsBg border border-white/10 space-y-3 animate-in fade-in">
          {/* Live Waveform SVG Canvas */}
          <div className="h-14 w-full bg-vsNavy rounded-lg border border-white/5 flex items-center justify-center px-2">
            <svg viewBox="0 0 200 40" className="w-full h-full">
              <path
                d={
                  stats.rawWaveform && stats.rawWaveform.length > 0
                    ? `M 0 20 ` +
                      stats.rawWaveform
                        .map((val, idx) => {
                          const x = (idx / (stats.rawWaveform.length - 1)) * 200;
                          const y = 20 + val * 18;
                          return `L ${x.toFixed(1)} ${y.toFixed(1)}`;
                        })
                        .join(' ')
                    : 'M 0 20 L 200 20'
                }
                fill="none"
                stroke="#2D8CFF"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Signal Level & Status */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-vsPanel border border-white/5 space-y-1">
              <span className="text-[10px] text-vsMuted block">{t('mic.volume')}</span>
              <div className="flex items-center gap-2">
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-vsBlue h-full transition-all duration-75"
                    style={{ width: `${stats.volume}%` }}
                  />
                </div>
                <span className="font-mono font-bold text-white text-[11px] shrink-0">
                  {stats.volume}%
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-vsPanel border border-white/5 space-y-1">
              <span className="text-[10px] text-vsMuted block">{t('mic.speaking')}</span>
              <span
                className={`text-xs font-bold font-mono inline-block px-2 py-0.5 rounded ${
                  stats.isSpeaking ? 'bg-vsGreen/20 text-vsGreen' : 'bg-white/10 text-vsMuted'
                }`}
              >
                {stats.isSpeaking ? 'ACTIVE VOICE' : 'SILENCE'}
              </span>
            </div>
          </div>

          {/* Demo Score Meter */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between items-baseline text-xs">
              <span className="text-vsMuted flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-vsAmber" />
                {t('mic.demoScore')}
              </span>
              <span className="font-mono font-bold text-vsAmber">
                {stats.demoScore.toFixed(2)}
              </span>
            </div>
            <Meter score={stats.demoScore} showLabels={false} />
          </div>
        </div>
      )}

      {/* Honest disclaimer */}
      <div className="text-[11px] text-vsMuted leading-relaxed border-t border-white/10 pt-2 flex items-start gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-vsGreen shrink-0 mt-0.5" />
        <span>{t('mic.disclaimer')}</span>
      </div>
    </div>
  );
};
