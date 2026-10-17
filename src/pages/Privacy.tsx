import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, ShieldCheck, Cpu, Trash2, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { useI18n } from '../i18n';
import { Button } from '../components/Button';

export const Privacy: React.FC = () => {
  const { t } = useI18n();

  const principles = [
    {
      icon: <Cpu className="w-5 h-5 text-vsBlue" />,
      title: 'Zero Cloud Audio Processing',
      desc: 'All detection models and voice verification algorithms are architected to execute strictly locally on the mobile device. Spoken telephone audio is never streamed to or stored on remote servers.',
    },
    {
      icon: <Lock className="w-5 h-5 text-vsGreen" />,
      title: 'Encrypted Numeric Voiceprints (No Raw Audio)',
      desc: 'Enrolled family members do not have their raw voice recordings saved. Instead, one-way acoustic embeddings (mathematical vectors) are encrypted using AES-GCM and stored only on this device.',
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-vsBlue" />,
      title: 'Consent-First Biometric Enrollment',
      desc: 'In accordance with DPDP Act 2023 design principles, enrollment is strictly voluntary and requires affirmative informed consent from the person whose voiceprint is being registered.',
    },
    {
      icon: <Trash2 className="w-5 h-5 text-vsCoral" />,
      title: 'Complete Right to Erasure',
      desc: 'You maintain absolute control. Any family member profile or all enrolled voiceprints can be permanently wiped with a single click, instantly deleting all cryptographic keys and vectors.',
    },
    {
      icon: <KeyRound className="w-5 h-5 text-vsAmber" />,
      title: 'Confidential Family Safe Word',
      desc: 'Your secret safe word is stored locally in device sandbox storage and is never transmitted across the network, ensuring zero exposure to third-party data breaches.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-vsText">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vsGreen/20 text-vsGreen font-bold text-xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Privacy by Design & DPDP Principles</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Your Voice and Family Data Never Leave This Device
        </h1>
        <p className="text-sm text-vsMuted max-w-2xl mx-auto leading-relaxed">
          Biometric security must earn trust before it demands it. We engineered Voice Secure with a zero-knowledge, consent-first architecture from day zero.
        </p>
      </div>

      {/* Honest Prototype Notice */}
      <div className="p-4 rounded-2xl bg-vsPanel border border-vsAmber/40 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-vsAmber shrink-0 mt-0.5" />
        <div className="text-xs space-y-1 leading-relaxed">
          <span className="font-bold text-white block">Honest Prototype Architecture Disclosure</span>
          <p className="text-vsMuted">
            In this demonstration prototype, absolutely nothing leaves your browser. All settings, family circle profiles, and audit event logs are persisted exclusively in your browser's private <code className="text-vsBlue font-mono">localStorage</code>.
          </p>
        </div>
      </div>

      {/* 5 Core Privacy Pillars */}
      <div className="space-y-4">
        {principles.map((p, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-vsPanel border border-white/10 flex items-start gap-4 hover:border-white/20 transition-colors"
          >
            <div className="p-2.5 rounded-xl bg-vsNavy border border-white/10 shrink-0">
              {p.icon}
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-white">{p.title}</h3>
              <p className="text-xs text-vsMuted leading-relaxed">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* DPDP Act 2023 Principles Card */}
      <div className="p-6 rounded-3xl bg-vsNavy border border-white/10 space-y-3">
        <h3 className="font-extrabold text-sm text-white">
          Digital Personal Data Protection (DPDP) Act 2023 Alignment
        </h3>
        <p className="text-xs text-vsMuted leading-relaxed">
          Voice Secure is built with purpose limitation, data minimization, and storage limitation principles embedded directly into code. Voice biometric templates are treated as sensitive biometric personal data that cannot be repurposed or monetized.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center pt-2">
        <Link to="/demo">
          <Button variant="outline" size="md">
            Return to Live Demo →
          </Button>
        </Link>
      </div>
    </div>
  );
};
