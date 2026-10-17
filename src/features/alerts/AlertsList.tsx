import React, { useState } from 'react';
import { Bell, ShieldAlert, CheckCircle2, AlertTriangle, Info, Trash2, Filter } from 'lucide-react';
import { useAlertsStore, SecurityAlert, AlertSeverity } from '../../store/useAlertsStore';
import { useI18n } from '../../i18n';
import { Chip } from '../../components/Chip';
import { Button } from '../../components/Button';

export const AlertsList: React.FC<{ isEmbedded?: boolean }> = ({ isEmbedded = false }) => {
  const { t } = useI18n();
  const alerts = useAlertsStore((s) => s.alerts);
  const clearAlerts = useAlertsStore((s) => s.clearAlerts);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredAlerts = alerts.filter((a) => {
    if (filterSeverity === 'all') return true;
    return a.severity === filterSeverity;
  });

  return (
    <div className={`space-y-4 ${isEmbedded ? 'p-4' : 'max-w-4xl mx-auto py-8 px-4'} text-vsText`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h2 className="font-extrabold text-lg text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-vsBlue" />
            <span>Security Alerts & Audit Log</span>
          </h2>
          <p className="text-xs text-vsMuted">
            Chronological audit log of call screenings, voiceprint matches, and emergency lockdowns.
          </p>
        </div>

        {alerts.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAlerts}
            icon={<Trash2 className="w-3.5 h-3.5 text-vsCoral" />}
            className="text-xs self-start sm:self-auto text-vsMuted hover:text-vsCoral"
          >
            Clear Log
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-medium">
        <span className="text-vsMuted flex items-center gap-1 text-[11px] mr-1">
          <Filter className="w-3 h-3" /> Filter:
        </span>
        {['all', 'danger', 'warning', 'success', 'info'].map((sev) => {
          const isActive = filterSeverity === sev;
          return (
            <button
              key={sev}
              type="button"
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                isActive
                  ? 'bg-vsBlue text-white font-bold'
                  : 'bg-vsPanel text-vsMuted hover:text-white'
              }`}
            >
              {sev}
            </button>
          );
        })}
      </div>

      {/* Alerts Stream */}
      <div className="space-y-2.5">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center bg-vsPanel rounded-2xl border border-white/10 space-y-2">
            <Bell className="w-8 h-8 text-vsMuted mx-auto opacity-40" />
            <p className="text-xs text-vsMuted">
              {alerts.length === 0
                ? 'No alerts logged yet. Calls screened by Voice Secure will appear here automatically.'
                : 'No alerts match the selected severity filter.'}
            </p>
          </div>
        ) : (
          filteredAlerts.map((item) => {
            let border = 'border-white/10';
            let icon = <Info className="w-4 h-4 text-vsBlue" />;
            let badgeVariant: 'danger' | 'uncertain' | 'safe' | 'info' = 'info';

            if (item.severity === 'danger') {
              border = 'border-vsCoral/40 bg-vsCoral/5';
              icon = <ShieldAlert className="w-4 h-4 text-vsCoral shrink-0" />;
              badgeVariant = 'danger';
            } else if (item.severity === 'warning') {
              border = 'border-vsAmber/30 bg-vsAmber/5';
              icon = <AlertTriangle className="w-4 h-4 text-vsAmber shrink-0" />;
              badgeVariant = 'uncertain';
            } else if (item.severity === 'success') {
              border = 'border-vsGreen/30 bg-vsGreen/5';
              icon = <CheckCircle2 className="w-4 h-4 text-vsGreen shrink-0" />;
              badgeVariant = 'safe';
            }

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl bg-vsPanel border ${border} transition-colors space-y-1.5`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {icon}
                    <h4 className="font-bold text-sm text-white">{item.title}</h4>
                  </div>
                  <span className="text-[10px] font-mono text-vsMuted shrink-0">
                    {item.timestamp}
                  </span>
                </div>

                <p className="text-xs text-vsMuted leading-relaxed pl-6">
                  {item.description}
                </p>

                {item.callerNumber && (
                  <div className="pl-6 pt-1 flex items-center gap-2">
                    <span className="text-[10px] font-mono text-vsMuted">
                      Number: <strong className="text-white">{item.callerNumber}</strong>
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
