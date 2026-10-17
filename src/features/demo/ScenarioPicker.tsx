import React, { useEffect } from 'react';
import { UserCheck, ShieldAlert, HelpCircle, RotateCcw } from 'lucide-react';
import { useDemoStore } from '../../store/useDemoStore';
import { useI18n } from '../../i18n';
import { ScenarioId } from '../../engine/DetectionEngine';

export const ScenarioPicker: React.FC = () => {
  const { t } = useI18n();
  const activeScenario = useDemoStore((s) => s.activeScenario);
  const startScenario = useDemoStore((s) => s.startScenario);
  const resetDemo = useDemoStore((s) => s.resetDemo);

  // Global Keyboard shortcuts: 1, 2, 3, R
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === '1') {
        startScenario('real');
      } else if (e.key === '2') {
        startScenario('clone');
      } else if (e.key === '3') {
        startScenario('unclear');
      } else if (e.key.toLowerCase() === 'r') {
        resetDemo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [startScenario, resetDemo]);

  const scenarios: Array<{
    id: ScenarioId;
    keyNumber: string;
    title: string;
    badge: string;
    desc: string;
    icon: React.ReactNode;
    colorClasses: string;
    borderActive: string;
  }> = [
    {
      id: 'real',
      keyNumber: '1',
      title: t('scenarios.real.title'),
      badge: t('scenarios.real.badge'),
      desc: t('scenarios.real.desc'),
      icon: <UserCheck className="w-5 h-5 text-vsGreen" />,
      colorClasses: 'hover:border-vsGreen/50 focus:ring-vsGreen',
      borderActive: 'border-vsGreen bg-vsGreen/10 shadow-lg shadow-vsGreen/15',
    },
    {
      id: 'clone',
      keyNumber: '2',
      title: t('scenarios.clone.title'),
      badge: t('scenarios.clone.badge'),
      desc: t('scenarios.clone.desc'),
      icon: <ShieldAlert className="w-5 h-5 text-vsCoral" />,
      colorClasses: 'hover:border-vsCoral/50 focus:ring-vsCoral',
      borderActive: 'border-vsCoral bg-vsCoral/10 shadow-lg shadow-vsCoral/20',
    },
    {
      id: 'unclear',
      keyNumber: '3',
      title: t('scenarios.unclear.title'),
      badge: t('scenarios.unclear.badge'),
      desc: t('scenarios.unclear.desc'),
      icon: <HelpCircle className="w-5 h-5 text-vsAmber" />,
      colorClasses: 'hover:border-vsAmber/50 focus:ring-vsAmber',
      borderActive: 'border-vsAmber bg-vsAmber/10 shadow-lg shadow-vsAmber/15',
    },
  ];

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>{t('scenarios.title')}</span>
          </h2>
          <p className="text-xs text-vsMuted">{t('scenarios.hint')}</p>
        </div>

        <button
          type="button"
          onClick={resetDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-vsPanel border border-white/10 text-vsMuted hover:text-white hover:border-white/30 transition-colors focus:ring-2 focus:ring-vsBlue"
          title="Reset demo state (Hotkey: R)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset [R]</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {scenarios.map((scen) => {
          const isSelected = activeScenario === scen.id;
          return (
            <button
              key={scen.id}
              type="button"
              onClick={() => startScenario(scen.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 focus:outline-none focus:ring-2 relative cursor-pointer ${
                isSelected
                  ? scen.borderActive
                  : `bg-vsPanel border-white/10 ${scen.colorClasses} hover:bg-vsPanelLight`
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-white/10 text-[11px] font-mono font-bold flex items-center justify-center text-white">
                    {scen.keyNumber}
                  </span>
                  <div className="p-1 rounded-lg bg-white/5">{scen.icon}</div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    scen.id === 'real'
                      ? 'bg-vsGreen/20 text-vsGreen'
                      : scen.id === 'clone'
                      ? 'bg-vsCoral/20 text-vsCoral'
                      : 'bg-vsAmber/20 text-vsAmber'
                  }`}
                >
                  {scen.badge}
                </span>
              </div>

              <h3 className="font-bold text-sm text-white leading-tight mb-1">
                {scen.title}
              </h3>
              <p className="text-[11px] text-vsMuted leading-relaxed line-clamp-2">
                {scen.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
