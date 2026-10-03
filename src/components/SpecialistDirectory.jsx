import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Stethoscope,
  Phone,
  Mail,
  Star,
  Clock,
  Sparkles,
  Info,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { api } from '../api';
import { useTranslation } from '../translations';

export default function SpecialistDirectory({ activePatient, currentLanguage = 'en' }) {
  const t = useTranslation(currentLanguage);

  const [specialistsData, setSpecialistsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');

  useEffect(() => {
    fetchSpecialists();
  }, [activePatient]);

  const fetchSpecialists = async () => {
    setLoading(true);
    try {
      const data = await api.getSpecialists(activePatient?.id);
      setSpecialistsData(data.specialists || []);
    } catch (err) {
      console.error('Failed to load specialists', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSpecialists = selectedSpecialty === 'ALL'
    ? specialistsData
    : specialistsData.filter((s) => s.specialty_key === selectedSpecialty);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-[#CBD5E1] p-6 sm:p-8 shadow-mediscope space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-white border border-[#CBD5E1] text-[#1E3A8A] flex items-center justify-center shadow-xs">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1E3A8A] tracking-tight">
                {t('specialistTitle')}
              </h2>
            </div>
            <p className="text-xs text-[#475569] mt-1">
              {t('specialistSub')}
            </p>
          </div>

          {activePatient && (
            <div className="bg-[#F8FAFC] px-3.5 py-1.5 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#1E3A8A] self-start sm:self-auto">
              Matched to {activePatient.full_name}'s panel
            </div>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#CBD5E1]/50">
          <button
            onClick={() => setSelectedSpecialty('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedSpecialty === 'ALL'
                ? 'bg-[#1E3A8A] text-white shadow-xs'
                : 'bg-[#F8FAFC] text-[#1E3A8A] hover:bg-[#E2E8F0]'
            }`}
          >
            {t('allSpecialties')} ({specialistsData.length})
          </button>

          {specialistsData.map((s) => (
            <button
              key={s.specialty_key}
              onClick={() => setSelectedSpecialty(s.specialty_key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedSpecialty === s.specialty_key
                  ? 'bg-[#1E3A8A] text-white shadow-xs'
                  : 'bg-[#F8FAFC] text-[#1E3A8A] hover:bg-[#E2E8F0]'
              }`}
            >
              {s.specialty_title}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#475569]">
          Matching top local medical specialists...
        </div>
      ) : filteredSpecialists.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#CBD5E1] p-10 text-center text-xs text-[#475569]">
          No specialist recommendations found for this category.
        </div>
      ) : (
        <div className="space-y-8">
          {filteredSpecialists.map((group) => (
            <div key={group.specialty_key} className="space-y-4">
              
              {/* Specialty Category Heading */}
              <div className="flex items-baseline justify-between border-b border-[#CBD5E1]/70 pb-2">
                <div>
                  <h3 className="text-lg font-black text-[#1E3A8A]">{group.specialty_title}</h3>
                  <p className="text-xs text-[#475569]">{group.description}</p>
                </div>
                <span className="text-[10px] font-bold text-[#1E3A8A] bg-white px-2 py-0.5 rounded-full border border-[#CBD5E1]">
                  {group.doctors.length} {t('verifiedDoctors')}
                </span>
              </div>

              {/* Doctors in this specialty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {group.doctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="glass-card rounded-3xl p-6 border border-[#CBD5E1] flex flex-col justify-between"
                  >
                    <div>
                      {/* Name & Rating */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h4 className="text-base font-black text-[#1E3A8A]">{doc.name}</h4>
                          <p className="text-xs font-bold text-[#1E3A8A]">{doc.hospital}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-white text-[#1E3A8A] border border-[#CBD5E1] px-2 py-0.5 rounded-lg text-xs font-bold shrink-0 shadow-2xs">
                          <Star className="w-3.5 h-3.5 fill-[#1E3A8A] text-[#1E3A8A]" />
                          <span>{doc.rating}</span>
                        </div>
                      </div>

                      {/* Location & Experience */}
                      <div className="space-y-1.5 text-xs text-[#475569] my-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0" />
                          <span>{doc.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#475569] shrink-0" />
                          <span>{doc.experience}</span>
                        </div>
                      </div>

                      {/* Appointment Prep Tips */}
                      <div className="bg-[#F8FAFC] border border-[#CBD5E1]/70 rounded-2xl p-3 text-[11px] text-[#1E3A8A] space-y-1 mb-4">
                        <div className="font-bold flex items-center gap-1 text-[10px] text-[#1E3A8A] uppercase tracking-wider">
                          <Info className="w-3 h-3" />
                          <span>{t('appointmentTip')}:</span>
                        </div>
                        <p>{doc.prep_tips}</p>
                      </div>
                    </div>

                    {/* Contacts & Fee Footer */}
                    <div className="pt-3 border-t border-[#CBD5E1]/50 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-[#475569] block font-semibold">{t('consultationFee')}</span>
                        <span className="font-black text-[#1E3A8A]">{doc.consultation_fee}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${doc.phone}`}
                          className="bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#1E3A8A] p-2 rounded-xl border border-[#CBD5E1] transition-colors"
                          title="Call Clinic"
                        >
                          <Phone className="w-4 h-4 text-[#1E3A8A]" />
                        </a>
                        <a
                          href={`mailto:${doc.email}`}
                          className="bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#1E3A8A] p-2 rounded-xl border border-[#CBD5E1] transition-colors"
                          title="Email Clinic"
                        >
                          <Mail className="w-4 h-4 text-[#1E3A8A]" />
                        </a>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
