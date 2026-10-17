import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Users, Sparkles, ExternalLink } from 'lucide-react';
import { useI18n } from '../i18n';

export const Footer: React.FC = () => {
  const { t } = useI18n();

  return (
    <footer className="w-full bg-vsNavy border-t border-white/10 mt-20 text-vsMuted text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Slogan */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-vsBlue flex items-center justify-center p-1">
                <img src="/shield-voice.svg" alt="Voice Secure" className="w-full h-full" />
              </div>
              <span className="font-extrabold text-white text-base">Voice Secure</span>
            </div>
            <p className="text-vsText font-medium text-sm italic">
              "{t('brand.slogan')}"
            </p>
            <p className="text-xs text-vsMuted leading-relaxed max-w-md">
              {t('brand.pilotTarget')}
            </p>
            <div className="p-3 rounded-xl bg-vsPanel border border-white/10 text-[11px] leading-relaxed text-vsMuted">
              <span className="text-vsAmber font-semibold">Honesty Principle: </span>
              {t('brand.simulationNote')}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-sm">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/demo" className="hover:text-white transition-colors">
                  Live Ideathon Demo
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  How it Works (Architecture)
                </Link>
              </li>
              <li>
                <Link to="/alerts" className="hover:text-white transition-colors">
                  System Audit Alerts
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy by Design & DPDP
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Vision & Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Team & Pitch Context */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-sm">Strategy Blitz 2026</h4>
            <p className="text-xs leading-relaxed">
              Engineered for the IIIT Bhopal E-Cell ideathon showcase.
            </p>
            <div className="text-[11px] space-y-1 text-white/80">
              <p>• Ashish Kumar Mani · Product</p>
              <p>• Raj Sharma · AI & Engineering</p>
              <p>• Akshat Tiwari · Growth</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 Voice Secure Prototype. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Consent & Privacy
            </Link>
            <span>·</span>
            <Link to="/about" className="hover:text-white transition-colors">
              Roadmap (Bhopal Pilot 2027)
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
