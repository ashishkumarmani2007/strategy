import React, { useState } from 'react';
import {
  KeyRound,
  Eye,
  EyeOff,
  Sliders,
  Clock,
  Globe,
  Activity,
  Trash2,
  Check,
  Shield,
} from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useI18n } from '../../i18n';
import { Button } from '../../components/Button';
import { MicCheck } from '../mic/MicCheck';

export const SettingsTab: React.FC = () => {
  const { t, language, setLanguage } = useI18n();
  const safeWord = useSettingsStore((s) => s.safeWord);
  const setSafeWord = useSettingsStore((s) => s.setSafeWord);
  const paymentLockDurationMinutes = useSettingsStore((s) => s.paymentLockDurationMinutes);
  const setPaymentLockDuration = useSettingsStore((s) => s.setPaymentLockDuration);
  const reducedMotion = useSettingsStore((s) => s.reducedMotion);
  const setReducedMotion = useSettingsStore((s) => s.setReducedMotion);
  const clearAllData = useSettingsStore((s) => s.clearAllData);

  const [inputSafeWord, setInputSafeWord] = useState(safeWord);
  const [showPassword, setShowPassword] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [clearedFeedback, setClearedFeedback] = useState(false);

  const handleSaveSafeWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSafeWord.trim()) return;
    setSafeWord(inputSafeWord.trim());
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleClearData = () => {
    clearAllData();
    setInputSafeWord('nimbu');
    setClearedFeedback(true);
    setTimeout(() => setClearedFeedback(false), 2500);
  };

  return (
    <div className="space-y-4 p-4 text-vsText">
      <div className="pb-2 border-b border-white/10">
        <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-vsBlue" />
          {t('settings.title')}
        </h3>
        <p className="text-[11px] text-vsMuted">Configurable pitch parameters & security thresholds.</p>
      </div>

      {/* 1. Safe Word Configuration */}
      <div className="p-3.5 rounded-2xl bg-vsPanel border border-white/10 space-y-3">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-vsAmber" />
          <div>
            <h4 className="text-xs font-bold text-white">{t('settings.safeWordLabel')}</h4>
            <p className="text-[10px] text-vsMuted">{t('settings.safeWordHint')}</p>
          </div>
        </div>

        <form onSubmit={handleSaveSafeWord} className="space-y-2">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={inputSafeWord}
              onChange={(e) => setInputSafeWord(e.target.value)}
              className="w-full pl-3 pr-10 py-2 rounded-xl bg-vsBg border border-white/15 text-white font-mono text-xs focus:ring-1 focus:ring-vsBlue focus:outline-none"
              placeholder="e.g. nimbu"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-2.5 text-vsMuted hover:text-white"
              aria-label="Toggle safe word visibility"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-vsMuted">
              Current Active: <strong className="text-vsAmber font-mono font-bold">"{safeWord}"</strong>
            </span>
            <Button type="submit" variant="primary" size="sm" className="text-xs">
              {savedFeedback ? 'Saved!' : t('common.save')}
            </Button>
          </div>
        </form>
      </div>

      {/* 2. Risk Thresholds (Read-Only) */}
      <div className="p-3.5 rounded-2xl bg-vsPanel border border-white/10 space-y-2">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-vsGreen" />
          <h4 className="text-xs font-bold text-white">{t('settings.thresholdsLabel')}</h4>
        </div>
        <p className="text-[11px] text-vsMuted leading-relaxed">
          {t('settings.thresholdsDesc')}
        </p>
        <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[10px] text-center">
          <div className="p-2 rounded-lg bg-vsGreen/10 border border-vsGreen/20 text-vsGreen font-bold">
            &lt; 0.30 Safe
          </div>
          <div className="p-2 rounded-lg bg-vsAmber/10 border border-vsAmber/20 text-vsAmber font-bold">
            0.30 - 0.70 Safe Word
          </div>
          <div className="p-2 rounded-lg bg-vsCoral/10 border border-vsCoral/20 text-vsCoral font-bold">
            &gt; 0.70 AI Alert
          </div>
        </div>
      </div>

      {/* 3. Payment Cooling-Off Duration */}
      <div className="p-3.5 rounded-2xl bg-vsPanel border border-white/10 space-y-2.5">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-vsBlue" />
          <h4 className="text-xs font-bold text-white">{t('settings.lockDurationLabel')}</h4>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[15, 30, 60].map((mins) => {
            const isSelected = paymentLockDurationMinutes === mins;
            return (
              <button
                key={mins}
                type="button"
                onClick={() => setPaymentLockDuration(mins)}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-vsBlue text-white shadow-md shadow-vsBlue/20 border border-vsBlue'
                    : 'bg-vsBg text-vsMuted border border-white/10 hover:text-white'
                }`}
              >
                {mins} Mins
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Language Selector */}
      <div className="p-3.5 rounded-2xl bg-vsPanel border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-vsBlue" />
          <span className="text-xs font-bold text-white">{t('settings.languageLabel')}</span>
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              language === 'en'
                ? 'bg-vsBlue text-white'
                : 'bg-vsBg text-vsMuted hover:text-white'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLanguage('hi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              language === 'hi'
                ? 'bg-vsBlue text-white'
                : 'bg-vsBg text-vsMuted hover:text-white'
            }`}
          >
            हिन्दी
          </button>
        </div>
      </div>

      {/* 5. Live Microphone Signal Check (Section 6.4) */}
      <MicCheck />

      {/* 6. Clear Local Data */}
      <div className="pt-2 text-center space-y-2">
        <button
          type="button"
          onClick={handleClearData}
          className="text-xs text-vsCoral hover:underline font-semibold flex items-center justify-center gap-1.5 mx-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t('settings.clearDataButton')}</span>
        </button>
        {clearedFeedback && (
          <p className="text-[11px] text-vsGreen font-mono font-bold">
            ✓ {t('settings.dataCleared')}
          </p>
        )}
      </div>
    </div>
  );
};
