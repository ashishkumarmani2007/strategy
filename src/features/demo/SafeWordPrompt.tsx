import React, { useState } from 'react';
import { KeyRound, Check, X, ShieldAlert, ArrowRight } from 'lucide-react';
import { useDemoStore } from '../../store/useDemoStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useI18n } from '../../i18n';
import { Button } from '../../components/Button';

export const SafeWordPrompt: React.FC = () => {
  const { t } = useI18n();
  const verifySafeWord = useDemoStore((s) => s.verifySafeWord);
  const safeWordStatus = useDemoStore((s) => s.safeWordStatus);
  const safeWordConfig = useSettingsStore((s) => s.safeWord);
  const simulateCallBack = useDemoStore((s) => s.simulateCallBack);

  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;
    verifySafeWord(inputVal);
  };

  return (
    <div className="bg-vsPanelLight border border-vsAmber/40 rounded-2xl p-4 space-y-3 animate-in fade-in">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-vsAmber/20 text-vsAmber">
          <KeyRound className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            {t('callScreen.safeWordPrompt')}
          </h4>
          <p className="text-[11px] text-vsMuted">
            Demo secret hint: <span className="font-mono text-vsAmber font-bold">"{safeWordConfig}"</span>
          </p>
        </div>
      </div>

      {safeWordStatus === 'IDLE' && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={t('callScreen.safeWordPlaceholder')}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-vsBg border border-white/15 text-white placeholder-vsMuted/60 focus:outline-none focus:border-vsAmber focus:ring-1 focus:ring-vsAmber font-medium"
              autoFocus
              aria-label="Family safe word input"
            />
            <Button
              type="submit"
              variant="amber"
              size="sm"
              disabled={!inputVal.trim()}
              className="shrink-0"
            >
              Verify
            </Button>
          </div>
        </form>
      )}

      {safeWordStatus === 'VERIFIED' && (
        <div className="p-2.5 rounded-xl bg-vsGreen/15 border border-vsGreen/40 flex items-center gap-2 text-vsGreen text-xs font-semibold">
          <Check className="w-4 h-4 shrink-0" />
          <span>{t('callScreen.safeWordCorrect')}</span>
        </div>
      )}

      {safeWordStatus === 'FAILED' && (
        <div className="space-y-2">
          <div className="p-2.5 rounded-xl bg-vsCoral/15 border border-vsCoral/40 flex items-center gap-2 text-vsCoral text-xs font-semibold">
            <X className="w-4 h-4 shrink-0" />
            <span>{t('callScreen.safeWordIncorrect')}</span>
          </div>
          <Button
            variant="danger"
            size="sm"
            className="w-full text-xs font-bold"
            onClick={simulateCallBack}
            icon={<ShieldAlert className="w-3.5 h-3.5" />}
          >
            Hang up & Call Registered Number
          </Button>
        </div>
      )}
    </div>
  );
};
