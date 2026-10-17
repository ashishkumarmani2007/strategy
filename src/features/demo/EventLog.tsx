import React from 'react';
import { SecurityAlert } from '../../store/useAlertsStore';

export interface EventLogProps {
  alerts: SecurityAlert[];
  className?: string;
}

export const EventLog: React.FC<EventLogProps> = ({ alerts, className = '' }) => {
  return (
    <div className={`w-full bg-vsNavy/60 rounded-xl p-3 border border-white/10 ${className}`}>
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="font-semibold text-white font-mono">Live Telemetry Event Log</span>
        <span className="text-[10px] text-vsMuted font-mono">Real-Time Audit</span>
      </div>

      <div className="max-h-48 overflow-y-auto space-y-1.5 font-mono text-[11px] pr-1">
        {alerts.length === 0 ? (
          <p className="text-vsMuted italic text-center py-4">No events logged yet.</p>
        ) : (
          alerts.map((item) => {
            let color = 'text-vsBlue';
            let tag = '[INFO]';
            if (item.severity === 'danger') {
              color = 'text-vsCoral font-semibold';
              tag = '[ALERT]';
            } else if (item.severity === 'warning') {
              color = 'text-vsAmber';
              tag = '[WARN]';
            } else if (item.severity === 'success') {
              color = 'text-vsGreen';
              tag = '[OK]';
            }

            return (
              <div
                key={item.id}
                className="p-1.5 rounded bg-vsPanel/40 border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 text-[10px] text-vsMuted">
                  <span className={color}>{tag} {item.title}</span>
                  <span className="shrink-0">{item.timestamp}</span>
                </div>
                <p className="text-vsText/80 text-[10px] mt-0.5 leading-snug">
                  {item.description}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
