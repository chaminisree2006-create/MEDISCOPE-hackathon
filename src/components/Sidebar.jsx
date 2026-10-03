import React from 'react';
import {
  Home,
  Users,
  FileBarChart2,
  Stethoscope,
  Lightbulb,
  MapPin,
  BellRing,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useTranslation } from '../translations';

export default function Sidebar({
  activeTab,
  onSelectTab,
  user,
  onLogout,
  patientCount = 0,
  currentLanguage = 'en'
}) {
  const t = useTranslation(currentLanguage);

  const menuItems = [
    {
      id: 'overview',
      label: t('navOverview'),
      icon: Home,
      badge: null
    },
    {
      id: 'patients',
      label: t('navPatients'),
      icon: Users,
      badge: patientCount > 0 ? `${patientCount}` : null
    },
    {
      id: 'reports',
      label: t('navReports'),
      icon: FileBarChart2,
      badge: 'OCR AI'
    },
    {
      id: 'questions',
      label: t('navQuestions'),
      icon: Stethoscope,
      badge: null
    },
    {
      id: 'second-opinion',
      label: t('navSecondOpinion'),
      icon: Lightbulb,
      badge: currentLanguage === 'hi' ? 'नई' : currentLanguage === 'te' ? 'కొత్తది' : 'NEW'
    },
    {
      id: 'specialists',
      label: t('navSpecialists'),
      icon: MapPin,
      badge: null
    },
    {
      id: 'reminders',
      label: t('navReminders'),
      icon: BellRing,
      badge: null
    }
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#F8FAFC] border-r border-[#CBD5E1] flex flex-col justify-between h-[calc(100vh-4.5rem)] sticky top-18 z-30 transition-all select-none">
      
      {/* Top Header Section */}
      <div className="p-4 space-y-4">
        
        {/* User Profile Badge Snapshot */}
        {user && (
          <div className="bg-white border border-[#CBD5E1] rounded-2xl p-3 flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#1E3A8A] to-[#172554] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-[#1E3A8A] truncate">{user.full_name}</h4>
              <p className="text-[10px] text-[#475569] truncate">{user.email}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-[9px] font-semibold text-emerald-700">{t('verifiedMember')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu Links */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#1E3A8A] text-white shadow-mediscope'
                    : 'text-[#1E3A8A] hover:bg-white hover:text-[#1E3A8A]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#1E3A8A]'}`} />
                  <span className="tracking-tight text-left">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-white text-[#1E3A8A] border border-[#CBD5E1] shadow-2xs'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Bar: Snapshot & Logout */}
      <div className="p-4 border-t border-[#CBD5E1]/70 bg-white/60 space-y-3">
        <div className="text-[10px] text-[#475569] leading-tight">
          <p className="font-semibold text-[#1E3A8A]">{t('engineBadge')}</p>
          <p>{t('encryptionNotice')}</p>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span>{t('signOut')}</span>
        </button>
      </div>

    </aside>
  );
}
