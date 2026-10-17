import React, { useState } from 'react';
import { Phone, Cpu, HelpCircle, Sparkles, Activity } from 'lucide-react';
import { ScenarioPicker } from '../features/demo/ScenarioPicker';
import { PhoneFrame } from '../features/demo/PhoneFrame';
import { UnderTheHood } from '../features/demo/UnderTheHood';
import { UpiPaymentModal } from '../features/demo/UpiPaymentModal';
import { useI18n } from '../i18n';

export const Demo: React.FC = () => {
  const { t } = useI18n();
  const [mobileActiveView, setMobileActiveView] = useState<'phone' | 'telemetry'>('phone');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Ideathon Pitch Banner */}
      <div className="bg-vsPanel border border-vsBlue/30 rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-vsBlue/5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-vsGreen animate-pulse" />
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
              IIIT Bhopal E-Cell Strategy Blitz · Live Interactive Pitch
            </h1>
          </div>
          <p className="text-xs text-vsMuted leading-relaxed max-w-2xl">
            Simulate real-time voice verification across 3 scenarios. Watch how on-device acoustic analysis coordinates with consent-enrolled family voiceprints to halt scam ransoms in 2 clicks.
          </p>
        </div>

        {/* Mobile View Toggle (hidden on desktop) */}
        <div className="flex lg:hidden items-center bg-vsBg p-1 rounded-2xl border border-white/10 shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setMobileActiveView('phone')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              mobileActiveView === 'phone'
                ? 'bg-vsBlue text-white shadow'
                : 'text-vsMuted hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Phone App</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileActiveView('telemetry')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              mobileActiveView === 'telemetry'
                ? 'bg-vsBlue text-white shadow'
                : 'text-vsMuted hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Under The Hood</span>
          </button>
        </div>
      </div>

      {/* Scenario Picker (3 Large Buttons) */}
      <ScenarioPicker />

      {/* Dual Layout: Phone Mock (Left/Center) + Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Phone Mockup Column */}
        <div
          className={`lg:col-span-5 flex justify-center ${
            mobileActiveView === 'telemetry' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <PhoneFrame />
        </div>

        {/* Under The Hood Telemetry Column */}
        <div
          className={`lg:col-span-7 ${
            mobileActiveView === 'phone' ? 'hidden lg:block' : 'block'
          }`}
        >
          <UnderTheHood />
        </div>
      </div>

      {/* Mock UPI Payment Sheet Triggered on "Try to send ₹50,000" */}
      <UpiPaymentModal />
    </div>
  );
};
