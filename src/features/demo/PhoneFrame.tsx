import React from 'react';
import {
  Home,
  Phone,
  Users,
  Bell,
  Settings,
  Wifi,
  Battery,
  Shield,
} from 'lucide-react';
import { useDemoStore } from '../../store/useDemoStore';
import { useAlertsStore } from '../../store/useAlertsStore';
import { HomeScreen } from './HomeScreen';
import { CallScreen } from './CallScreen';
import { FamilyTab } from '../family/FamilyTab';
import { AlertsList } from '../alerts/AlertsList';
import { SettingsTab } from '../settings/SettingsTab';

export const PhoneFrame: React.FC = () => {
  const activePhoneTab = useDemoStore((s) => s.activePhoneTab);
  const setActivePhoneTab = useDemoStore((s) => s.setActivePhoneTab);
  const activeScenario = useDemoStore((s) => s.activeScenario);
  const alerts = useAlertsStore((s) => s.alerts);

  const dangerAlertsCount = alerts.filter((a) => a.severity === 'danger').length;

  const tabs: Array<{
    id: 'home' | 'call' | 'family' | 'alerts' | 'settings';
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }> = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    {
      id: 'call',
      label: 'Call',
      icon: <Phone className="w-4 h-4" />,
      badge: activeScenario ? 1 : undefined,
    },
    { id: 'family', label: 'Family', icon: <Users className="w-4 h-4" /> },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: <Bell className="w-4 h-4" />,
      badge: dangerAlertsCount > 0 ? dangerAlertsCount : undefined,
    },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full max-w-[390px] mx-auto bg-[#071226] border-[6px] border-[#182C52] rounded-[44px] shadow-2xl shadow-black/80 overflow-hidden flex flex-col min-h-[640px] max-h-[720px] relative select-none">
      {/* Top Phone Island & Status Bar */}
      <div className="pt-2 px-6 flex justify-between items-center text-[11px] font-semibold text-white/70 bg-[#071226] shrink-0 select-none z-20">
        <span className="font-mono">10:54</span>
        <div className="w-24 h-4 bg-black rounded-full mx-auto" />
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <Wifi className="w-3 h-3" />
          <span>5G</span>
          <Battery className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Phone Screen Inner Viewport (Scrollable) */}
      <div className="flex-1 overflow-y-auto overscroll-contain bg-vsBg relative">
        {activePhoneTab === 'home' && <HomeScreen />}
        {activePhoneTab === 'call' && <CallScreen />}
        {activePhoneTab === 'family' && <FamilyTab />}
        {activePhoneTab === 'alerts' && <AlertsList isEmbedded={true} />}
        {activePhoneTab === 'settings' && <SettingsTab />}
      </div>

      {/* Phone Bottom Tab Navigation Bar */}
      <nav
        aria-label="Phone App Navigation"
        className="bg-vsNavy/95 border-t border-white/10 px-2 py-1 flex justify-around items-center shrink-0 z-20"
      >
        {tabs.map((tab) => {
          const isActive = activePhoneTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActivePhoneTab(tab.id)}
              className={`min-h-[44px] min-w-[48px] flex flex-col items-center justify-center relative transition-colors focus:outline-none focus:text-vsBlue ${
                isActive ? 'text-vsBlue font-bold' : 'text-vsMuted hover:text-white'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full bg-vsCoral text-white text-[9px] font-extrabold font-mono leading-tight">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Home Indicator Bar */}
      <div className="bg-vsNavy pb-1 flex justify-center shrink-0">
        <div className="w-32 h-1 bg-white/20 rounded-full" />
      </div>
    </div>
  );
};
