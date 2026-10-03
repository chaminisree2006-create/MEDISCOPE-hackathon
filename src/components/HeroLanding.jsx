import React from 'react';
import {
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity,
  HeartPulse,
  Brain,
  Microscope,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useTranslation } from '../translations';

export default function HeroLanding({ onOpenRegister, onOpenLogin, currentLanguage = 'en' }) {
  const t = useTranslation(currentLanguage);

  return (
    <div className="w-full min-h-[calc(100vh-4.5rem)] flex flex-col justify-between overflow-x-hidden">
      
      {/* Top Banner / Hero Visual Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-10 pb-16 max-w-7xl mx-auto w-full">
        
        {/* Subtle decorative background gradient orbs */}
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-[#1E3A8A]/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-[#1E3A8A]/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Cumulative Sequential Text Animation & CTAs */}
          <div className="lg:col-span-7 space-y-8">
            
            <div className="inline-flex items-center gap-2 bg-white border border-[#CBD5E1] px-3.5 py-1.5 rounded-full shadow-xs">
              <Sparkles className="w-4 h-4 text-[#1E3A8A]" />
              <span className="text-xs font-bold text-[#1E3A8A] tracking-wide uppercase">
                {t('heroBadge')}
              </span>
            </div>

            {/* CRITICAL ANIMATION RULES: Cumulative Sequential Text Formation */}
            <div className="space-y-4 py-2 min-h-[190px] flex flex-col justify-center">
              
              {/* Line 1 (0.2s delay): Navy Blue #1E3A8A, bold tracking-tight */}
              <div className="seq-line-1">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#1E3A8A] tracking-tight uppercase leading-none">
                  {t('heroSeqLine1')}
                </h1>
              </div>

              {/* Line 2 (1.2s delay): White background / Navy Blue #1E3A8A text */}
              <div className="seq-line-2 ml-4 sm:ml-8 md:ml-12">
                <p className="text-lg sm:text-2xl md:text-3xl font-extrabold text-[#1E3A8A] leading-snug">
                  {t('heroSeqLine2')}
                </p>
              </div>

              {/* Line 3 (2.2s delay): Navy Blue #1E3A8A */}
              <div className="seq-line-3 ml-8 sm:ml-16 md:ml-24">
                <p className="text-sm sm:text-lg md:text-xl font-semibold text-[#1E3A8A] opacity-90 leading-relaxed">
                  {t('heroSeqLine3')}
                </p>
              </div>

            </div>

            {/* Value Proposition Description */}
            <p className="text-sm sm:text-base text-[#475569] max-w-xl leading-relaxed">
              {t('heroDescription')}
            </p>

            {/* Primary Action CTAs - White Background, Navy Blue Text */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onOpenRegister}
                className="flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-[#1E3A8A] border-2 border-[#1E3A8A] font-extrabold text-sm sm:text-base px-8 py-4 rounded-2xl shadow-mediscope hover:shadow-mediscope-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <span>{t('btnGetStarted')}</span>
                <ArrowRight className="w-5 h-5 text-[#1E3A8A]" />
              </button>

              <button
                onClick={onOpenLogin}
                className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#1E3A8A] font-bold text-sm sm:text-base px-7 py-4 rounded-2xl border border-[#CBD5E1] shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer"
              >
                <span>{t('btnSignIn')}</span>
              </button>
            </div>

            {/* Trust and Compliance Highlights */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-[#CBD5E1]/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-bold text-[#1E3A8A]">{t('trustPrivate')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-bold text-[#1E3A8A]">{t('trustOcr')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-bold text-[#1E3A8A]">{t('trustLangs')}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Medical Graphic with Mediscope Mascot */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              
              {/* Decorative Glass Container */}
              <div className="relative bg-white border border-[#CBD5E1] rounded-3xl p-5 shadow-2xl overflow-hidden medical-img-zoom">
                
                {/* Brand Graphic Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-inner border border-[#CBD5E1]/70 bg-linear-to-b from-[#F8FAFC] to-white">
                  <img
                    src="/mediscope_mascot.png"
                    alt="Mediscope AI Doctor Assistant Mascot"
                    className="w-full h-auto object-cover rounded-2xl hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-[#1E3A8A]/90 via-[#1E3A8A]/40 to-transparent p-4 text-white">
                    <span className="text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg">
                      AI Diagnostic Companion
                    </span>
                    <h3 className="text-lg font-black mt-1">Mediscope Sentinel</h3>
                  </div>
                </div>

                {/* Floating Bio-marker Pill Overlay */}
                <div className="absolute top-8 -left-4 bg-white border border-[#CBD5E1] p-3 rounded-2xl shadow-mediscope-lg flex items-center gap-3 backdrop-blur-md hidden sm:flex">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    Hb
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#475569] font-semibold">Glycated Hemoglobin</span>
                    <span className="block text-xs font-extrabold text-[#1E3A8A]">HbA1c: 5.4% (Normal)</span>
                  </div>
                </div>

                {/* Floating Heart & Vitals Pill - White Background, Navy Blue Text */}
                <div className="absolute bottom-8 -right-4 bg-white border border-[#CBD5E1] p-3 rounded-2xl shadow-mediscope-lg flex items-center gap-3 backdrop-blur-md hidden sm:flex">
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#CBD5E1] text-[#1E3A8A] flex items-center justify-center font-bold text-xs shadow-xs">
                    <HeartPulse className="w-4 h-4 text-[#1E3A8A]" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#475569] font-semibold">{t('metabolicSync')}</span>
                    <span className="block text-xs font-extrabold text-[#1E3A8A]">{t('allSystemsVerified')}</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

      </section>

      {/* Feature Preview Section */}
      <section className="bg-white border-t border-[#CBD5E1]/60 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl font-black text-[#1E3A8A] tracking-tight">
              {t('ecosystemTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] mt-1">
              {t('ecosystemSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-3xl border border-[#CBD5E1]">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#CBD5E1] text-[#1E3A8A] shadow-xs flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-[#1E3A8A]" />
              </div>
              <h3 className="text-base font-extrabold text-[#1E3A8A] mb-2">{t('featOcrTitle')}</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                {t('featOcrDesc')}
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-[#CBD5E1]">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#CBD5E1] text-[#1E3A8A] shadow-xs flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-[#1E3A8A]" />
              </div>
              <h3 className="text-base font-extrabold text-[#1E3A8A] mb-2">{t('featBrainTitle')}</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                {t('featBrainDesc')}
              </p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-[#CBD5E1]">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#CBD5E1] text-[#1E3A8A] shadow-xs flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-[#1E3A8A]" />
              </div>
              <h3 className="text-base font-extrabold text-[#1E3A8A] mb-2">{t('featTrendsTitle')}</h3>
              <p className="text-xs text-[#475569] leading-relaxed">
                {t('featTrendsDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
