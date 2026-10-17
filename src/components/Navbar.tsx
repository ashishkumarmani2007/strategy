import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, Bell } from 'lucide-react';
import { useI18n } from '../i18n';
import { SimulationBadge } from './SimulationBadge';
import { useAlertsStore } from '../store/useAlertsStore';

export const Navbar: React.FC = () => {
  const { t, language, setLanguage } = useI18n();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const alerts = useAlertsStore((s) => s.alerts);
  const unreadAlerts = alerts.filter((a) => a.severity === 'danger').length;

  const navLinks = [
    { to: '/demo', label: t('nav.demo'), isPrimary: true },
    { to: '/how-it-works', label: t('nav.howItWorks') },
    { to: '/alerts', label: t('nav.alerts'), badgeCount: unreadAlerts },
    { to: '/privacy', label: t('nav.privacy') },
    { to: '/about', label: t('nav.about') },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-vsNavy/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-white hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-vsBlue rounded-lg p-1"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-vsBlue to-blue-800 flex items-center justify-center p-1.5 shadow-md shadow-vsBlue/20">
            <img src="/shield-voice.svg" alt="Voice Secure" className="w-full h-full" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight leading-tight flex items-center gap-1.5">
              Voice Secure
            </span>
            <span className="text-[10px] text-vsMuted font-mono hidden sm:inline">Anti-Spoof & Family Shield</span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white bg-white/10 font-semibold'
                    : 'text-vsMuted hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>
                {Boolean(link.badgeCount && link.badgeCount > 0) && (
                  <span className="ml-1.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-vsCoral text-white">
                    {link.badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Language + Simulation Badge */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Language Toggle Button */}
          <button
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-vsPanel border border-white/10 text-vsText hover:border-vsBlue/50 transition-colors focus:ring-2 focus:ring-vsBlue"
            aria-label="Switch Language"
          >
            <span className={language === 'en' ? 'text-vsBlue font-bold' : 'text-vsMuted'}>EN</span>
            <span className="text-white/20">|</span>
            <span className={language === 'hi' ? 'text-vsBlue font-bold' : 'text-vsMuted'}>हिन्दी</span>
          </button>

          <SimulationBadge />
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <SimulationBadge />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-vsMuted hover:text-white hover:bg-white/10 focus:ring-2 focus:ring-vsBlue"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-vsNavy px-4 pt-2 pb-4 space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-vsText hover:bg-white/10"
            >
              <span>{link.label}</span>
              {Boolean(link.badgeCount && link.badgeCount > 0) && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-vsCoral text-white">
                  {link.badgeCount}
                </span>
              )}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/10 flex justify-between items-center px-1">
            <span className="text-xs text-vsMuted">Select UI Language:</span>
            <button
              type="button"
              onClick={() => {
                setLanguage(language === 'en' ? 'hi' : 'en');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-vsPanel border border-white/15 text-vsBlue"
            >
              {language === 'en' ? 'हिन्दी में बदलें' : 'Switch to English'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
