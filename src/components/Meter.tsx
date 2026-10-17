import React from 'react';

export interface MeterProps {
  score: number; // 0 to 1
  label?: string;
  showLabels?: boolean;
  className?: string;
}

export const Meter: React.FC<MeterProps> = ({
  score,
  label,
  showLabels = true,
  className = '',
}) => {
  const clamped = Math.max(0, Math.min(1, score));
  const percentage = Math.round(clamped * 100);

  // Semantic color based on threshold
  let barColor = 'bg-vsGreen';
  let zoneLabel = 'Safe Zone';
  let zoneTextColor = 'text-vsGreen';

  if (clamped > 0.7) {
    barColor = 'bg-vsCoral';
    zoneLabel = 'AI Threat Zone';
    zoneTextColor = 'text-vsCoral';
  } else if (clamped >= 0.3) {
    barColor = 'bg-vsAmber';
    zoneLabel = 'Uncertain Zone';
    zoneTextColor = 'text-vsAmber';
  }

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          <span className="text-vsMuted">{label}</span>
          <span className={`font-mono font-bold ${zoneTextColor}`}>
            {clamped.toFixed(2)} ({zoneLabel})
          </span>
        </div>
      )}

      {/* Meter Bar Track */}
      <div className="relative h-4 w-full bg-vsNavy rounded-full overflow-hidden border border-white/10 p-0.5">
        {/* Background Zone Indicators */}
        <div className="absolute inset-0 flex opacity-20 pointer-events-none">
          <div className="w-[30%] bg-vsGreen/30 border-r border-white/20" title="Safe (< 0.30)" />
          <div className="w-[40%] bg-vsAmber/30 border-r border-white/20" title="Uncertain (0.30 - 0.70)" />
          <div className="w-[30%] bg-vsCoral/30" title="Threat (> 0.70)" />
        </div>

        {/* Dynamic Progress Fill */}
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${barColor}`}
          style={{ width: `${percentage}%` }}
        />

        {/* Threshold Markers */}
        <div className="absolute top-0 bottom-0 left-[30%] w-0.5 bg-white/40 z-10" />
        <div className="absolute top-0 bottom-0 left-[70%] w-0.5 bg-white/40 z-10" />
      </div>

      {showLabels && (
        <div className="flex justify-between text-[10px] text-vsMuted mt-1 font-mono">
          <span>0.00 Safe</span>
          <span className="text-white/40">| 0.30</span>
          <span className="text-vsAmber">Uncertain</span>
          <span className="text-white/40">0.70 |</span>
          <span className="text-vsCoral">1.00 AI Clone</span>
        </div>
      )}
    </div>
  );
};
