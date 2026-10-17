import React from 'react';
import { ShieldCheck, Users, KeyRound, Clock, ArrowRight, Bell, Sparkles } from 'lucide-react';
import { useDemoStore } from '../../store/useDemoStore';
import { useFamilyStore } from '../../store/useFamilyStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useAlertsStore } from '../../store/useAlertsStore';
import { useI18n } from '../../i18n';
import { Button } from '../../components/Button';

export const HomeScreen: React.FC = () => {
  const { t } = useI18n();
  const setActivePhoneTab = useDemoStore((s) => s.setActivePhoneTab);
  const startScenario = useDemoStore((s) => s.startScenario);
  const members = useFamilyStore((s) => s.members);
  const safeWord = useSettingsStore((s) => s.safeWord);
  const alerts = useAlertsStore((s) => s.alerts);

  const enrolledCount = members.filter((m) => m.enrolled).length;
  const last3Events = alerts.slice(0, 3);

  return (
    <div className="space-y-4 p-4 text-vsText">
      {/* Protection Status Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-vsNavy to-[#132850] border border-vsBlue/30 shadow-lg shadow-vsBlue/10 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-vsGreen/20 border border-vsGreen/50 flex items-center justify-center text-vsGreen shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white">Protection Active</h3>
            <p className="text-[11px] text-vsGreen font-medium">
              AI model runs on this phone · Zero cloud audio
            </p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center text-[11px] text-vsMuted font-mono">
          <span>Active Filter: 3s Sliding Windows</span>
          <span className="text-vsGreen font-bold">Encrypted</span>
        </div>
      </div>

      {/* Quick Launch Demo Pitch Scenarios */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Quick Screening Demo
          </span>
          <span className="text-[10px] text-vsAmber font-mono">Pitch Ready</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setActivePhoneTab('call');
              startScenario('clone');
            }}
            className="p-3 rounded-xl bg-vsCoral/10 border border-vsCoral/30 text-left hover:bg-vsCoral/20 transition-colors"
          >
            <span className="text-[10px] font-bold text-vsCoral block mb-0.5">⚠️ Threat Test</span>
            <span className="text-xs font-bold text-white block">Rohan Clone Scam</span>
            <span className="text-[10px] text-vsMuted">Demands ₹50k transfer</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActivePhoneTab('call');
              startScenario('real');
            }}
            className="p-3 rounded-xl bg-vsGreen/10 border border-vsGreen/30 text-left hover:bg-vsGreen/20 transition-colors"
          >
            <span className="text-[10px] font-bold text-vsGreen block mb-0.5">✓ Safe Test</span>
            <span className="text-xs font-bold text-white block">Mom Calling</span>
            <span className="text-[10px] text-vsMuted">Saved contact & match</span>
          </button>
        </div>
      </div>

      {/* Family Circle Summary Card */}
      <div
        onClick={() => setActivePhoneTab('family')}
        className="p-3.5 rounded-xl bg-vsPanel border border-white/10 hover:border-vsBlue/40 cursor-pointer transition-colors space-y-2"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-vsBlue" />
            <h4 className="text-xs font-bold text-white">Family Circle</h4>
          </div>
          <span className="text-[10px] font-mono text-vsBlue flex items-center gap-1 font-semibold">
            {enrolledCount} Enrolled <ArrowRight className="w-3 h-3" />
          </span>
        </div>
        <p className="text-[11px] text-vsMuted leading-snug">
          {enrolledCount} of {members.length} members have consent-enrolled encrypted voiceprints.
        </p>
      </div>

      {/* Safe Word Status Card */}
      <div
        onClick={() => setActivePhoneTab('settings')}
        className="p-3.5 rounded-xl bg-vsPanel border border-white/10 hover:border-vsAmber/40 cursor-pointer transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-vsAmber/10 text-vsAmber">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Family Safe Word</h4>
            <p className="text-[10px] text-vsMuted">Configured secret challenge</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-vsAmber px-2.5 py-1 rounded-lg bg-vsAmber/10 border border-vsAmber/20">
          "{safeWord}"
        </span>
      </div>

      {/* Last 3 Events */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-vsMuted" /> Recent Screening Logs
          </span>
          <button
            type="button"
            onClick={() => setActivePhoneTab('alerts')}
            className="text-[11px] text-vsBlue hover:underline"
          >
            View all
          </button>
        </div>

        <div className="space-y-1.5">
          {last3Events.map((evt) => (
            <div
              key={evt.id}
              className="p-2.5 rounded-xl bg-vsPanel/70 border border-white/5 flex items-center justify-between text-[11px]"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    evt.severity === 'danger'
                      ? 'bg-vsCoral'
                      : evt.severity === 'warning'
                      ? 'bg-vsAmber'
                      : 'bg-vsGreen'
                  }`}
                />
                <span className="font-semibold text-white">{evt.title}</span>
              </div>
              <span className="text-[10px] text-vsMuted font-mono shrink-0">{evt.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
