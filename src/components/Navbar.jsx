import React from 'react';
import { Languages, Users, LogIn, ChevronDown, Sparkles } from 'lucide-react';
import { useTranslation } from '../translations';

export default function Navbar({
  user,
  patients = [],
  activePatient,
  onSelectPatient,
  currentLanguage,
  onSelectLanguage,
  onOpenAuth,
  onNavigateHome,
}) {
  const t = useTranslation(currentLanguage);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#CBD5E1] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo & Mascot */}
        <div 
          onClick={onNavigateHome}
          className="flex items-center gap-3 cursor-pointer group transition-transform active:scale-98"
        >
          <div className="relative">
            <img 
              src="/mediscope_mascot.png" 
              alt="Mediscope Mascot" 
              className="w-11 h-11 rounded-2xl border-2 border-[#1E3A8A] shadow-md object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black text-[#1E3A8A] tracking-tight">{t('brandTitle')}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white text-[#1E3A8A] border border-[#CBD5E1] px-2 py-0.5 rounded-full shadow-2xs">
                {t('aiProBadge')}
              </span>
            </div>
            <p className="text-[11px] font-medium text-[#475569]">{t('brandSubtitle')}</p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Active Patient Context Badge (If logged in and patients exist) */}
          {user && patients.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 bg-white border border-[#CBD5E1] px-3 py-1.5 rounded-xl text-xs font-semibold text-[#1E3A8A] shadow-2xs">
              <Users className="w-4 h-4 text-[#1E3A8A]" />
              <span className="text-[#475569]">{t('activeContext')}:</span>
              <select
                value={activePatient ? activePatient.id : ''}
                onChange={(e) => {
                  const selected = patients.find(p => p.id === e.target.value);
                  if (selected) onSelectPatient(selected);
                }}
                className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2 py-1 text-xs font-bold text-[#1E3A8A] focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] cursor-pointer shadow-2xs"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.full_name} ({p.relationship})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Multilingual Selector: English, Hindi, Telugu */}
          <div className="flex items-center gap-1.5 bg-white border border-[#CBD5E1] p-1 rounded-xl shadow-xs">
            <Languages className="w-4 h-4 text-[#1E3A8A] ml-1.5 hidden md:inline" />
            <button
              onClick={() => onSelectLanguage('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentLanguage === 'en'
                  ? 'bg-[#1E3A8A] text-white shadow-xs'
                  : 'text-[#1E3A8A] hover:bg-slate-100'
              }`}
            >
              English
            </button>
            <button
              onClick={() => onSelectLanguage('hi')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentLanguage === 'hi'
                  ? 'bg-[#1E3A8A] text-white shadow-xs'
                  : 'text-[#1E3A8A] hover:bg-slate-100'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => onSelectLanguage('te')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentLanguage === 'te'
                  ? 'bg-[#1E3A8A] text-white shadow-xs'
                  : 'text-[#1E3A8A] hover:bg-slate-100'
              }`}
            >
              తెలుగు
            </button>
          </div>

          {/* User Profile or Auth Trigger - White Background, Navy Blue Text */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#CBD5E1]">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#1E3A8A] to-[#172554] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden lg:block text-left">
                <span className="block text-xs font-bold text-[#1E3A8A] truncate max-w-[120px]">
                  {user.full_name}
                </span>
                <span className="block text-[10px] text-[#475569] truncate max-w-[120px]">
                  {user.email}
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-[#1E3A8A] border-2 border-[#1E3A8A] font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs hover:shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-[#1E3A8A]" />
              <span>{t('signInRegister')}</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
