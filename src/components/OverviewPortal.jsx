import React, { useState, useEffect } from 'react';
import {
  Users,
  FileBarChart2,
  TrendingUp,
  Stethoscope,
  Lightbulb,
  MapPin,
  BellRing,
  Activity,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Plus
} from 'lucide-react';
import { api } from '../api';
import { useTranslation } from '../translations';

export default function OverviewPortal({
  user,
  patients = [],
  activePatient,
  onNavigate,
  onOpenAddPatient,
  currentLanguage = 'en'
}) {
  const t = useTranslation(currentLanguage);
  const [outbreakData, setOutbreakData] = useState(null);
  const [loadingOutbreaks, setLoadingOutbreaks] = useState(true);

  useEffect(() => {
    fetchOutbreaks();
  }, []);

  const fetchOutbreaks = async () => {
    setLoadingOutbreaks(true);
    try {
      const data = await api.getOutbreaks();
      setOutbreakData(data);
    } catch (err) {
      console.error('Failed to load outbreak stats', err);
    } finally {
      setLoadingOutbreaks(false);
    }
  };

  const featureCards = [
    {
      id: 'patients',
      title: t('cardFamilyTitle'),
      description: t('cardFamilyDesc'),
      icon: Users,
      actionText: patients.length === 0 ? t('cardFamilyBtnEmpty') : `${t('cardFamilyBtn')} (${patients.length})`,
      action: () => onNavigate('patients')
    },
    {
      id: 'reports',
      title: t('cardOcrTitle'),
      description: t('cardOcrDesc'),
      icon: FileBarChart2,
      actionText: t('cardOcrBtn'),
      action: () => onNavigate('reports')
    },
    {
      id: 'trends',
      title: t('cardTrendsTitle'),
      description: t('cardTrendsDesc'),
      icon: TrendingUp,
      actionText: t('cardTrendsBtn'),
      action: () => onNavigate('reports')
    },
    {
      id: 'questions',
      title: t('cardQuestionsTitle'),
      description: t('cardQuestionsDesc'),
      icon: Stethoscope,
      actionText: t('cardQuestionsBtn'),
      action: () => onNavigate('questions')
    },
    {
      id: 'second-opinion',
      title: t('cardSecondTitle'),
      description: t('cardSecondDesc'),
      icon: Lightbulb,
      actionText: t('cardSecondBtn'),
      action: () => onNavigate('second-opinion')
    },
    {
      id: 'specialists',
      title: t('cardSpecialistTitle'),
      description: t('cardSpecialistDesc'),
      icon: MapPin,
      actionText: t('cardSpecialistBtn'),
      action: () => onNavigate('specialists')
    },
    {
      id: 'reminders',
      title: t('cardReminderTitle'),
      description: t('cardReminderDesc'),
      icon: BellRing,
      actionText: t('cardReminderBtn'),
      action: () => onNavigate('reminders')
    }
  ];

  return (
    <div className="space-y-10 pb-12 animate-in fade-in duration-300">
      
      {/* 1. Hero Visual Banner with Clean Surface & Navy Blue Typography */}
      <section className="relative overflow-hidden rounded-3xl bg-white text-[#1E3A8A] p-6 sm:p-10 shadow-mediscope border border-[#CBD5E1]">
        
        {/* Glow backdrop circles */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#1E3A8A]/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#1E3A8A]/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#F8FAFC] px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide border border-[#CBD5E1] text-[#1E3A8A] shadow-xs">
              <Sparkles className="w-4 h-4 text-[#1E3A8A]" />
              <span className="text-[#1E3A8A]">{t('welcomeBack')}, {user?.full_name || 'Member'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-[#1E3A8A]">
              {t('overviewHeroTitle')}
            </h1>

            <p className="text-xs sm:text-sm text-[#1E3A8A]/80 max-w-2xl leading-relaxed font-medium">
              {t('overviewHeroDesc')}
            </p>

            {/* Quick Context Strip - Navy Blue Text */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {activePatient ? (
                <div className="bg-[#F8FAFC] border border-[#CBD5E1] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 text-[#1E3A8A] shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-[#1E3A8A]">{t('activeContext')}: {activePatient.full_name} ({activePatient.relationship})</span>
                </div>
              ) : (
                <button
                  onClick={onOpenAddPatient}
                  className="bg-white hover:bg-slate-50 text-[#1E3A8A] border-2 border-[#1E3A8A] px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#1E3A8A]" />
                  <span>{t('btnAddFirstMember')}</span>
                </button>
              )}

              <button
                onClick={() => onNavigate('reports')}
                className="bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#1E3A8A] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <FileBarChart2 className="w-4 h-4 text-[#1E3A8A]" />
                <span className="text-[#1E3A8A]">{t('btnUploadNewReport')}</span>
              </button>
            </div>
          </div>

          {/* Right Mascot Artwork Showcase */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative group">
              <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden border-2 border-[#CBD5E1] shadow-xl bg-[#F8FAFC] p-2 transition-transform duration-500 group-hover:scale-105">
                <img
                  src="/mediscope_mascot.png"
                  alt="Mediscope AI Mascot"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <div className="absolute -bottom-3 inset-x-4 bg-white text-[#1E3A8A] py-1 px-3 rounded-full text-center text-[10px] font-black uppercase tracking-wider shadow-md border border-[#CBD5E1]">
                Mediscope Sentinel 2.0
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Comprehensive Feature Showcase */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1E3A8A] tracking-tight">
              {t('platformCapabilities')}
            </h2>
            <p className="text-xs text-[#475569]">
              {t('platformCapabilitiesSub')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="glass-card p-6 rounded-3xl border border-[#CBD5E1] flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#CBD5E1] text-[#1E3A8A] shadow-xs flex items-center justify-center mb-4 group-hover:bg-[#1E3A8A] group-hover:text-white transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-[#1E3A8A] mb-2 tracking-tight">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[#475569] leading-relaxed mb-6">
                    {feat.description}
                  </p>
                </div>

                <button
                  onClick={feat.action}
                  className="w-full mt-auto flex items-center justify-between bg-white hover:bg-[#1E3A8A] text-[#1E3A8A] hover:text-white font-bold text-xs py-2.5 px-4 rounded-xl border border-[#CBD5E1] transition-all duration-200 cursor-pointer shadow-2xs"
                >
                  <span>{feat.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Live Health & Infection Statistics Tracker Widget */}
      <section className="bg-white rounded-3xl border border-[#CBD5E1] p-6 sm:p-8 shadow-mediscope space-y-6">
        
        {/* Header of Outbreak Tracker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#CBD5E1]/60 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#CBD5E1] text-[#1E3A8A] shadow-xs flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#1E3A8A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-[#1E3A8A] tracking-tight">
                  {t('outbreakTitle')}
                </h3>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  {t('liveFeed')}
                </span>
              </div>
              <p className="text-xs text-[#475569]">
                {t('outbreakSubtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={fetchOutbreaks}
            disabled={loadingOutbreaks}
            className="self-start sm:self-center flex items-center gap-1.5 bg-white hover:bg-slate-100 text-[#1E3A8A] font-bold text-xs px-3.5 py-1.5 rounded-xl border border-[#CBD5E1] transition-colors cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingOutbreaks ? 'animate-spin' : ''}`} />
            <span>{t('refreshSurveillance')}</span>
          </button>
        </div>

        {/* Outbreak Cards Grid */}
        {loadingOutbreaks ? (
          <div className="py-12 text-center text-xs text-[#475569]">
            Fetching latest epidemiology data...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {outbreakData?.outbreaks?.map((outbreak) => (
              <div
                key={outbreak.id}
                className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl p-5 space-y-4 hover:border-[#1E3A8A] transition-all"
              >
                {/* Header row: Pathogen & Risk Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#475569]">
                      {outbreak.type}
                    </span>
                    <h4 className="text-sm font-black text-[#1E3A8A]">{outbreak.pathogen}</h4>
                  </div>
                  
                  {/* Risk Level Indicator */}
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border shrink-0 ${
                      outbreak.risk_level === 'High'
                        ? 'bg-red-100 text-red-700 border-red-300'
                        : outbreak.risk_level === 'Moderate'
                        ? 'bg-white text-[#1E3A8A] border-[#CBD5E1]'
                        : 'bg-emerald-100 text-emerald-700 border-emerald-300'
                    }`}
                  >
                    {outbreak.risk_level} Risk
                  </span>
                </div>

                {/* Trend & Transmission Vector */}
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-3 rounded-xl border border-[#CBD5E1]/60">
                  <div>
                    <span className="text-[#475569] block font-semibold">{t('outbreakActiveTrend')}:</span>
                    <span className="font-bold text-[#1E3A8A]">{outbreak.trend}</span>
                  </div>
                  <div>
                    <span className="text-[#475569] block font-semibold">{t('outbreakHospRate')}:</span>
                    <span className="font-bold text-[#1E3A8A]">{outbreak.hospitalization_rate}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-[#CBD5E1]/40">
                    <span className="text-[#475569] block font-semibold">{t('outbreakVector')}:</span>
                    <span className="text-[#1E3A8A] font-medium">{outbreak.vector}</span>
                  </div>
                </div>

                {/* Symptoms Watch */}
                <div>
                  <span className="text-[11px] font-bold text-[#1E3A8A] block mb-1.5">
                    {t('outbreakSymptoms')}:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {outbreak.symptoms.map((sym, idx) => (
                      <span
                        key={idx}
                        className="bg-white border border-[#CBD5E1] text-[#1E3A8A] text-[10px] font-semibold px-2 py-0.5 rounded-lg"
                      >
                        • {sym}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Precautionary Guidelines - White Surface with Navy Blue Text */}
                <div className="bg-white border border-[#CBD5E1] rounded-xl p-3 text-[11px] text-[#1E3A8A] leading-relaxed shadow-xs">
                  <strong className="text-[#1E3A8A]">{t('outbreakGuideline')}:</strong> {outbreak.precautionary_guidelines}
                </div>

              </div>
            ))}
          </div>
        )}

      </section>

    </div>
  );
}
