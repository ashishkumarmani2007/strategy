import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Target, Rocket, Calendar, ArrowRight, Award } from 'lucide-react';
import { useI18n } from '../i18n';
import { Button } from '../components/Button';

export const About: React.FC = () => {
  const { t } = useI18n();

  const team = [
    {
      name: 'Ashish Kumar Mani',
      role: 'Founder · Product & Strategy',
      bio: 'Leads product design, scenario architecture, and defense user experience for senior-friendly mobile interfaces.',
    },
    {
      name: 'Raj Sharma',
      role: 'Co-founder · AI & Engineering',
      bio: 'Specializes in on-device audio signal processing, acoustic anti-spoofing neural nets, and ECAPA-TDNN speaker verification.',
    },
    {
      name: 'Akshat Tiwari',
      role: 'Co-founder · Growth & Partnerships',
      bio: 'Drives telecom ecosystem partnerships, consumer trust campaigns, and field pilot deployments across Madhya Pradesh.',
    },
  ];

  const milestones = [
    {
      date: 'Oct 2026',
      title: 'Strategy Blitz Ideathon Showcase',
      desc: 'Interactive simulation prototype demonstrated at IIIT Bhopal E-Cell.',
      status: 'Current',
    },
    {
      date: 'Jan 2027',
      title: 'Alpha Prototype with Local WebAssembly ONNX',
      desc: 'First runnable integration with lightweight quantized acoustic models.',
      status: 'Upcoming',
    },
    {
      date: 'Apr 2027',
      title: '20-Family Field Pilot in Bhopal',
      desc: 'Real-world deployment with elderly participants in Bhopal to measure voice-scam risk exposure reduction.',
      status: 'Targeted Pilot',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 text-vsText">
      {/* Vision & Brand Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vsBlue/20 text-vsBlue font-bold text-xs">
          <Shield className="w-3.5 h-3.5" />
          <span>Vision & Mission</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Protecting Every Family Circle from Deepfake Extortion
        </h1>
        <p className="text-base sm:text-lg text-vsAmber font-bold italic">
          "{t('brand.slogan')}"
        </p>
        <p className="text-sm text-vsMuted max-w-2xl mx-auto leading-relaxed">
          Voice Secure exists to create a secure digital world by detecting and preventing deepfake voice attacks through AI-powered authentication and a voice verification system.
        </p>
      </div>

      {/* The Problem We Solve */}
      <div className="p-6 sm:p-8 rounded-3xl bg-vsPanel border border-white/10 space-y-3">
        <div className="flex items-center gap-2 text-vsCoral">
          <Target className="w-5 h-5" />
          <h2 className="text-lg font-bold text-white">The "Emergency Relative" Crisis</h2>
        </div>
        <p className="text-xs sm:text-sm text-vsMuted leading-relaxed">
          Scammers now take just 3 seconds of audio from a family member's social media reel, clone their vocal cadence and timbre, and call an elderly parent or grandparent claiming an arrest, accident, or kidnapping. Under extreme emotional distress, victims transfer money before they can think. Voice Secure solves this by inserting an autonomous on-device family layer between the receiver and the scammer.
        </p>
      </div>

      {/* Strategic Roadmap */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-vsBlue" />
          <h2 className="text-xl font-extrabold text-white">Grounded Execution Roadmap</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-vsPanel border border-white/10 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-vsBlue">{m.date}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white font-mono font-semibold">
                    {m.status}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white mb-1">{m.title}</h3>
                <p className="text-xs text-vsMuted leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-vsGreen" />
          <h2 className="text-xl font-extrabold text-white">Founding Team</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {team.map((member, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-vsPanel border border-white/10 space-y-2 hover:border-vsBlue/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vsBlue/30 to-blue-900 border border-vsBlue/40 flex items-center justify-center font-bold text-white text-sm">
                {member.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">{member.name}</h3>
                <p className="text-xs font-mono text-vsBlue font-medium">{member.role}</p>
              </div>
              <p className="text-[11px] text-vsMuted leading-relaxed pt-1">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA back to demo */}
      <div className="text-center pt-4">
        <Link to="/demo">
          <Button variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
            Experience the Pitch Demo
          </Button>
        </Link>
      </div>
    </div>
  );
};
