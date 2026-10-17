import React, { useState } from 'react';
import { Info, Sparkles } from 'lucide-react';
import { useI18n } from '../i18n';

export const SimulationBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t } = useI18n();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-vsPanelLight border border-vsBlue/40 text-vsBlue hover:bg-vsBlue/10 transition-colors focus:outline-none focus:ring-2 focus:ring-vsBlue"
        aria-label="Simulation prototype information"
      >
        <Sparkles className="w-3.5 h-3.5 text-vsAmber animate-pulse" />
        <span>{t('brand.simulationBadge')}</span>
        <Info className="w-3 h-3 text-vsMuted" />
      </button>

      {showTooltip && (
        <div className="absolute right-0 top-full mt-2 z-50 w-72 p-3 text-xs rounded-xl bg-vsNavy border border-white/10 shadow-2xl text-vsText animate-in fade-in zoom-in-95">
          <p className="font-semibold text-vsAmber mb-1 flex items-center gap-1">
            <span>⚠️</span> Prototype Disclaimer
          </p>
          <p className="text-vsMuted leading-relaxed">{t('brand.simulationNote')}</p>
        </div>
      )}
    </div>
  );
};
