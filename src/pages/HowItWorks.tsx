import React from 'react';
import { Link } from 'react-router-dom';
import {
  PhoneCall,
  Clock,
  Cpu,
  Layers,
  ShieldAlert,
  ShieldCheck,
  HelpCircle,
  Lock,
  ArrowDown,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { useI18n } from '../i18n';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';

export const HowItWorks: React.FC = () => {
  const { t } = useI18n();

  const productionChips = [
    { title: 'Acoustic Anti-Spoofing', desc: 'AASIST / RawNet2 deep residual graph convolutional models analyzing raw waveforms for synthetic artifacts.' },
    { title: 'Speaker Verification (SV)', desc: 'ECAPA-TDNN x-vector embeddings verifying acoustic timbre against stored family profiles.' },
    { title: 'Voice Activity Detection (VAD)', desc: 'Silero VAD / WebRTC VAD extracting voiced frames to eliminate silence from inference windows.' },
    { title: 'Codec-Robust 8 kHz Filtering', desc: 'Pre-trained augmentation against AMR-NB, AMR-WB, and cellular compression jitter.' },
    { title: 'Physical Replay Detection', desc: 'Detects loudspeaker impulse response and room acoustics indicating pre-recorded audio.' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 text-vsText">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vsBlue/20 text-vsBlue font-bold text-xs">
          <Cpu className="w-3.5 h-3.5" />
          <span>Architecture & Deepfake Defense Pipeline</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          How Voice Secure Operates in Real Time
        </h1>
        <p className="text-sm sm:text-base text-vsMuted max-w-2xl mx-auto leading-relaxed">
          Traditional spam blockers only inspect caller ID databases. Voice Secure listens to acoustic features on-device in 3-second sliding windows, cross-references family voiceprints, and acts before money can be lost.
        </p>
      </div>

      {/* Vertical Interactive Flow Diagram */}
      <div className="space-y-4 max-w-2xl mx-auto">
        {/* Node 1: Incoming Call */}
        <div className="p-4 rounded-2xl bg-vsPanel border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-vsBlue/20 border border-vsBlue/40 flex items-center justify-center text-vsBlue shrink-0">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">1. Cellular Call Connection</h3>
            <p className="text-xs text-vsMuted leading-snug">
              User receives an incoming phone call. Call audio streams into the on-device sandbox. No audio ever touches the cloud.
            </p>
          </div>
        </div>

        <div className="flex justify-center text-vsBlue">
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </div>

        {/* Node 2: 3-Second Sliding Windows */}
        <div className="p-4 rounded-2xl bg-vsPanel border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#182C52] border border-white/15 flex items-center justify-center text-white shrink-0 font-mono font-bold">
            <Clock className="w-6 h-6 text-vsBlue" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">2. 3-Second Sliding Window Segmentation</h3>
            <p className="text-xs text-vsMuted leading-snug">
              Audio is buffered into consecutive 3-second windows with Voice Activity Detection (VAD) stripping background pauses.
            </p>
          </div>
        </div>

        <div className="flex justify-center text-vsBlue">
          <ArrowDown className="w-5 h-5" />
        </div>

        {/* Node 3: On-Device AI Detection */}
        <div className="p-4 rounded-2xl bg-vsPanel border border-vsBlue/40 flex items-center gap-4 shadow-lg shadow-vsBlue/5">
          <div className="w-12 h-12 rounded-xl bg-vsBlue flex items-center justify-center text-white shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">3. On-Device Acoustic Anti-Spoofing & Speaker Match</h3>
            <p className="text-xs text-vsMuted leading-snug">
              Dual inference pipeline: calculates AI spoof likelihood (0 to 1) and cosine similarity against consent-enrolled family voiceprint vectors.
            </p>
          </div>
        </div>

        <div className="flex justify-center text-vsBlue">
          <ArrowDown className="w-5 h-5" />
        </div>

        {/* Node 4: Decision Tree (Green / Amber / Red) */}
        <div className="p-5 rounded-3xl bg-vsNavy border border-white/15 space-y-4">
          <div className="text-center space-y-1">
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
              4. Algorithmic Moving-Average Decision Logic
            </h3>
            <p className="text-xs text-vsMuted">
              Smoothed across a 3-window sliding average with strict safety buffers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Green */}
            <div className="p-3.5 rounded-2xl bg-vsGreen/10 border border-vsGreen/30 space-y-2">
              <div className="flex items-center gap-2 text-vsGreen font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Score &lt; 0.30</span>
              </div>
              <h4 className="font-extrabold text-xs text-white">LIKELY REAL</h4>
              <p className="text-[11px] text-vsMuted leading-relaxed">
                Acoustics match genuine human vocal tract. Call connects undisturbed without alerts.
              </p>
            </div>

            {/* Amber */}
            <div className="p-3.5 rounded-2xl bg-vsAmber/10 border border-vsAmber/30 space-y-2">
              <div className="flex items-center gap-2 text-vsAmber font-bold text-xs">
                <HelpCircle className="w-4 h-4" />
                <span>0.30 to 0.70</span>
              </div>
              <h4 className="font-extrabold text-xs text-white">UNCERTAIN</h4>
              <p className="text-[11px] text-vsMuted leading-relaxed">
                Acoustic ambiguity. System issues interactive family safe-word challenge. Never guesses.
              </p>
            </div>

            {/* Red */}
            <div className="p-3.5 rounded-2xl bg-vsCoral/10 border border-vsCoral/30 space-y-2">
              <div className="flex items-center gap-2 text-vsCoral font-bold text-xs">
                <ShieldAlert className="w-4 h-4" />
                <span>Score &gt; 0.70</span>
              </div>
              <h4 className="font-extrabold text-xs text-white">POSSIBLE AI CLONE</h4>
              <p className="text-[11px] text-vsMuted leading-relaxed">
                Emergency threat. Locks outgoing UPI payments, alerts family members, and commands immediate hangup.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Planned Production Approach Section */}
      <div className="pt-8 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-vsAmber" />
          <h2 className="text-xl font-extrabold text-white">
            Planned Production Approach & ML Architecture
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-vsMuted">
            Production Roadmap
          </span>
        </div>
        <p className="text-xs text-vsMuted leading-relaxed max-w-3xl">
          In this prototype, detection scores are scripted or simulated for reliable pitch demonstration. In our upcoming Bhopal pilot (April 2027), the engine will execute quantized ONNX WebAssembly models locally inside the device runtime.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {productionChips.map((chip, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-vsPanel border border-white/10 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-vsBlue shrink-0" />
                <h3 className="font-bold text-xs text-white">{chip.title}</h3>
              </div>
              <p className="text-[11px] text-vsMuted leading-relaxed">{chip.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Back to Demo */}
      <div className="pt-6 text-center">
        <Link to="/demo">
          <Button variant="primary" size="lg" className="font-bold">
            Test the Detection Engine in Live Demo →
          </Button>
        </Link>
      </div>
    </div>
  );
};
