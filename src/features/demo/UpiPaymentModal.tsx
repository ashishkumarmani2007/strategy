import React, { useState, useEffect } from 'react';
import { ShieldAlert, Lock, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useDemoStore } from '../../store/useDemoStore';
import { Button } from '../../components/Button';

export const UpiPaymentModal: React.FC = () => {
  const isUpiModalOpen = useDemoStore((s) => s.isUpiModalOpen);
  const closeUpiModal = useDemoStore((s) => s.closeUpiModal);
  const isPaymentLocked = useSettingsStore((s) => s.isPaymentLocked);
  const paymentLockExpiresAt = useSettingsStore((s) => s.paymentLockExpiresAt);
  const unlockPayment = useSettingsStore((s) => s.unlockPayment);

  const [remainingSeconds, setRemainingSeconds] = useState(1800); // 30 min default

  useEffect(() => {
    if (!paymentLockExpiresAt) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.round((paymentLockExpiresAt - Date.now()) / 1000));
      setRemainingSeconds(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [paymentLockExpiresAt]);

  if (!isUpiModalOpen) return null;

  const formatCountdown = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
    >
      <div className="w-full max-w-sm bg-vsNavy border-2 border-vsCoral rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 text-vsText">
        {/* UPI Header */}
        <div className="bg-[#122244] p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center text-white font-extrabold text-xs">
              UPI
            </div>
            <span className="font-bold text-sm tracking-tight">Mock BharatPay / UPI</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-vsMuted">SIMULATION</span>
        </div>

        <div className="p-5 space-y-4">
          {/* Transfer Details */}
          <div className="bg-vsPanel p-3.5 rounded-xl border border-white/10">
            <div className="flex justify-between items-center text-xs text-vsMuted mb-1">
              <span>Payee</span>
              <span className="font-mono text-vsCoral font-semibold">Unverified Account</span>
            </div>
            <p className="font-semibold text-sm text-white">friend-hospital-urgency@okhdfcbank</p>
            <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-baseline">
              <span className="text-xs text-vsMuted">Transfer Amount</span>
              <span className="text-2xl font-extrabold text-white font-mono">₹50,000</span>
            </div>
          </div>

          {/* Payment Lock Alert Box */}
          {isPaymentLocked ? (
            <div className="bg-vsCoral/15 border border-vsCoral/50 rounded-2xl p-4 text-center space-y-2.5">
              <div className="w-12 h-12 mx-auto rounded-full bg-vsCoral/20 border border-vsCoral flex items-center justify-center">
                <Lock className="w-6 h-6 text-vsCoral animate-pulse" />
              </div>
              <h4 className="font-extrabold text-sm text-vsCoral tracking-tight">
                TRANSACTION BLOCKED BY VOICE SECURE
              </h4>
              <p className="text-xs text-vsText/90 leading-relaxed">
                Emergency cooling-off lock is engaged due to a suspected AI voice-clone scam call. Outgoing payments to unverified payees are temporarily paused.
              </p>
              <div className="inline-block px-3 py-1.5 rounded-xl bg-vsBg border border-vsCoral/40 text-vsCoral font-mono font-bold text-sm">
                Lock Countdown: {formatCountdown(remainingSeconds)}
              </div>
            </div>
          ) : (
            <div className="bg-vsGreen/10 border border-vsGreen/30 rounded-2xl p-4 text-center">
              <CheckCircle2 className="w-8 h-8 text-vsGreen mx-auto mb-1" />
              <p className="text-xs text-vsGreen font-bold">Lock released. Ready for transactions.</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-2 pt-1">
            <Button
              variant="outline"
              size="md"
              className="w-full font-bold"
              onClick={closeUpiModal}
            >
              Close & Keep Funds Safe
            </Button>
            {isPaymentLocked && (
              <button
                type="button"
                onClick={() => {
                  unlockPayment();
                }}
                className="w-full text-center text-[11px] text-vsMuted hover:text-white underline pt-1"
              >
                (Demo only: manually release payment lock)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
