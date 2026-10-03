import React from 'react';
import { ShieldCheck, Award } from 'lucide-react';
import { useTranslation } from '../translations';

export default function Footer({ currentLanguage = 'en' }) {
  const t = useTranslation(currentLanguage);

  return (
    <footer className="w-full bg-[#F8FAFC] border-t border-[#CBD5E1] mt-auto py-8 px-4 sm:px-8 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand identity & Mascot thumbnail */}
        <div className="flex items-center gap-3">
          <img 
            src="/mediscope_mascot.png" 
            alt="Mediscope Mascot" 
            className="w-10 h-10 rounded-full border-2 border-[#1E3A8A] shadow-sm object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#1E3A8A] tracking-tight text-lg">Mediscope</span>
              <span className="text-[10px] bg-white text-[#1E3A8A] font-semibold px-2 py-0.5 rounded-full border border-[#CBD5E1]">
                AI Companion 2.0
              </span>
            </div>
            <p className="text-xs text-[#475569]">{t('brandSubtitle')}</p>
          </div>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="max-w-2xl text-center md:text-left bg-white border border-[#CBD5E1] p-3.5 rounded-2xl shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E3A8A] mb-1 justify-center md:justify-start">
            <ShieldCheck className="w-4 h-4 text-[#1E3A8A]" />
            <span>{t('safetyNoticeTitle')}</span>
          </div>
          <p className="text-[11px] leading-relaxed text-[#475569]">
            {t('safetyNoticeBody')}
          </p>
        </div>

        {/* Legal Ownership & Year */}
        <div className="text-center md:text-right shrink-0">
          <div className="flex items-center justify-center md:justify-end gap-1.5 text-xs font-semibold text-[#1E3A8A]">
            <Award className="w-3.5 h-3.5 text-[#1E3A8A]" />
            <span>{t('legalOwnership')}</span>
          </div>
          <p className="text-[12px] font-bold text-[#1E3A8A] mt-0.5">
            Akhila Meesa
          </p>
          <span className="text-[10px] text-[#475569] block">
            {t('legalEngineer')}
          </span>
        </div>

      </div>

      {/* Mandatory Explicit Copyright Statement */}
      <div className="max-w-7xl mx-auto border-t border-[#CBD5E1]/60 mt-6 pt-4 text-center">
        <p className="text-xs font-semibold text-[#1E3A8A] tracking-wide">
          {t('copyrightStatement')}
        </p>
      </div>
    </footer>
  );
}
