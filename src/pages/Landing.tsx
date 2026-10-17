import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  Sparkles,
  Check,
  X,
  ExternalLink,
  Users,
  Activity,
  AlertTriangle,
  Volume2,
} from 'lucide-react';
import { useI18n } from '../i18n';
import { HONEST_FACTS } from '../data/facts';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Chip } from '../components/Chip';

export const Landing: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-vsBlue selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-vsBlue/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          {/* Slogan Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vsNavy border border-vsBlue/30 shadow-lg shadow-vsBlue/10 animate-in fade-in">
            <span className="w-2 h-2 rounded-full bg-vsGreen animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
              "{t('brand.slogan')}"
            </span>
          </div>

          {/* Hero Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            {t('hero.title')}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-vsMuted max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link to="/demo">
              <Button
                variant="primary"
                size="lg"
                icon={<Zap className="w-4 h-4" />}
                className="w-full sm:w-auto text-base font-extrabold shadow-xl shadow-vsBlue/25"
              >
                {t('hero.ctaDemo')}
              </Button>
            </Link>

            <Link to="/how-it-works">
              <Button
                variant="outline"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto text-base"
              >
                {t('hero.ctaHowItWorks')}
              </Button>
            </Link>
          </div>

          {/* Pilot Target Note */}
          <div className="pt-2 text-xs font-mono text-vsMuted">
            <span>🎯 {t('brand.pilotTarget')}</span>
          </div>
        </div>
      </section>

      {/* 3-Step Real-Time Architecture Explainer */}
      <section className="py-16 bg-vsNavy/50 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t('threeSteps.title')}
            </h2>
            <p className="text-sm text-vsMuted max-w-xl mx-auto">
              Real-time defense executed in 3-second sliding windows before an imposter can demand a bank transfer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-vsPanel border border-white/10 hover:border-vsBlue/40 transition-colors space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-vsBlue/20 border border-vsBlue/40 flex items-center justify-center text-vsBlue font-black text-lg">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{t('threeSteps.step1Title')}</h3>
              <p className="text-xs sm:text-sm text-vsMuted leading-relaxed">
                {t('threeSteps.step1Desc')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-vsPanel border border-white/10 hover:border-vsGreen/40 transition-colors space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-vsGreen/20 border border-vsGreen/40 flex items-center justify-center text-vsGreen font-black text-lg">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{t('threeSteps.step2Title')}</h3>
              <p className="text-xs sm:text-sm text-vsMuted leading-relaxed">
                {t('threeSteps.step2Desc')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-vsPanel border border-white/10 hover:border-vsCoral/40 transition-colors space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-vsCoral/20 border border-vsCoral/40 flex items-center justify-center text-vsCoral font-black text-lg">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{t('threeSteps.step3Title')}</h3>
              <p className="text-xs sm:text-sm text-vsMuted leading-relaxed">
                {t('threeSteps.step3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sourced Reality Stats Strip (Section 8) */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              {t('facts.stripTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-vsMuted">
              {t('facts.stripSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HONEST_FACTS.map((fact) => (
              <div
                key={fact.id}
                className="p-5 rounded-2xl bg-vsPanel border border-white/10 flex flex-col justify-between space-y-3 hover:border-white/20 transition-colors"
              >
                <div>
                  <span className="text-3xl font-black text-white font-mono tracking-tight block mb-1">
                    {fact.metric}
                  </span>
                  <h3 className="font-bold text-sm text-vsText mb-1">{t(fact.labelKey)}</h3>
                  <p className="text-xs text-vsMuted leading-relaxed">{t(fact.descriptionKey)}</p>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-vsMuted truncate pr-2">{fact.sourceName}</span>
                  <a
                    href={fact.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-vsBlue hover:underline flex items-center gap-1 font-semibold shrink-0"
                  >
                    <span>{t('facts.sourceLink')}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-center text-vsMuted italic">
            Note: Figures are cited directly from public research reports and government disclosures. Market estimates represent demographic upper bounds, not revenue forecasts.
          </p>
        </div>
      </section>

      {/* Competitor Differentiation Matrix (Section 6.1) */}
      <section className="py-16 bg-vsNavy/40 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t('comparison.title')}
            </h2>
            <p className="text-xs sm:text-sm text-vsMuted max-w-xl mx-auto">
              {t('comparison.subtitle')}
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-vsPanel">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-vsNavy/80 border-b border-white/10 text-white font-bold">
                <tr>
                  <th className="p-4 sm:p-5">{t('comparison.feature')}</th>
                  <th className="p-4 sm:p-5 text-center bg-vsBlue/15 border-x border-vsBlue/30 text-white font-extrabold">
                    <div className="flex items-center justify-center gap-1.5 text-vsBlue">
                      <Sparkles className="w-4 h-4 text-vsAmber" />
                      <span>{t('comparison.vs')}</span>
                    </div>
                  </th>
                  <th className="p-4 sm:p-5 text-center text-vsMuted">{t('comparison.hiya')}</th>
                  <th className="p-4 sm:p-5 text-center text-vsMuted">{t('comparison.omni')}</th>
                  <th className="p-4 sm:p-5 text-center text-vsMuted">{t('comparison.resemble')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {/* Row 1 */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 sm:p-5 text-white font-semibold">{t('comparison.featRealtime')}</td>
                  <td className="p-4 sm:p-5 text-center bg-vsBlue/10 border-x border-vsBlue/30">
                    <Check className="w-5 h-5 text-vsGreen mx-auto stroke-[3]" />
                  </td>
                  <td className="p-4 sm:p-5 text-center">
                    <Check className="w-5 h-5 text-vsGreen mx-auto stroke-[3]" />
                  </td>
                  <td className="p-4 sm:p-5 text-center">
                    <Check className="w-5 h-5 text-vsGreen mx-auto stroke-[3]" />
                  </td>
                  <td className="p-4 sm:p-5 text-center">
                    <Check className="w-5 h-5 text-vsGreen mx-auto stroke-[3]" />
                  </td>
                </tr>

                {/* Row 2: Family Voiceprints */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 sm:p-5 text-white font-semibold">{t('comparison.featVoiceprint')}</td>
                  <td className="p-4 sm:p-5 text-center bg-vsBlue/10 border-x border-vsBlue/30">
                    <Check className="w-5 h-5 text-vsGreen mx-auto stroke-[3]" />
                  </td>
                  <td className="p-4 sm:p-5 text-center">
                    <X className="w-5 h-5 text-vsCoral/60 mx-auto" />
                  </td>
                  <td className="p-4 sm:p-5 text-center">
                    <X className="w-5 h-5 text-vsCoral/60 mx-auto" />
                  </td>
                  <td className="p-4 sm:p-5 text-center">
                    <X className="w-5 h-5 text-vsCoral/60 mx-auto" />
                  </td>
                </tr>

                {/* Row 3: Safe Word */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 sm:p-5 text-white font-semibold">{t('comparison.featSafeWord')}</td>
                  <td className="p-4 sm:p-5 text-center bg-vsBlue/10 border-x border-vsBlue/30">
                    <Check className="w-5 h-5 text-vsGreen mx-auto stroke-[3]" />
                  </td>
                  <td className="p-4 sm:p-5 text-center">
                    <X className="w-5 h-5 text-vsCoral/60 mx-auto" />
                  </td>
                  <td className="p-4 sm:p-5 text-center">
                    <X className="w-5 h-5 text-vsCoral/60 mx-auto" />
                  </td>
                  <td className="p-4 sm:p-5 text-center">
                    <X className="w-5 h-5 text-vsCoral/60 mx-auto" />
                  </td>
                </tr>

                {/* Row 4: Family Alert */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 sm:p-5 text-white font-semibold">{t('comparison.featFamilyAlert')}</td>
                  <td className="p-4 sm:p-5 text-center bg-vsBlue/10 border-x border-vsBlue/30">
                    <Check className="w-5 h-5 text-vsGreen mx-auto stroke-[3]" />
                  </td>
                  <td className="p-4 sm:p-5 text-center">
                    <X className="w-5 h-5 text-vsCoral/60 mx-auto" />
                  </td>
                  <td className="p-4 sm:p-5 text-center">
                    <X className="w-5 h-5 text-vsCoral/60 mx-auto" />
                  </td>
                  <td className="p-4 sm:p-5 text-center">
                    <X className="w-5 h-5 text-vsCoral/60 mx-auto" />
                  </td>
                </tr>

                {/* Row 5: Payment Lock */}
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 sm:p-5 text-white font-semibold">{t('comparison.featPaymentLock')}</td>
                  <td className="p-4 sm:p-5 text-center bg-vsBlue/10 border-x border-vsBlue/30">
                    <Check className="w-5 h-5 text-vsGreen mx-auto stroke-[3]" />
                  </td>
                  <td className="p-4 sm:p-5 text-center">
                    <X className="w-5 h-5 text-vsCoral/60 mx-auto" />
                  </td>
                  <td className="p-4 sm:p-5 text-center">
                    <X className="w-5 h-5 text-vsCoral/60 mx-auto" />
                  </td>
                  <td className="p-4 sm:p-5 text-center">
                    <X className="w-5 h-5 text-vsCoral/60 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-vsMuted text-center font-mono">
            {t('comparison.footnote')}
          </p>

          <div className="pt-4 text-center">
            <Link to="/demo">
              <Button variant="primary" size="lg" className="font-bold">
                Experience the Family Layer Live in Demo →
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
