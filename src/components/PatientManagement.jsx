import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Calendar,
  Phone,
  Heart,
  UserCheck,
  Activity,
  AlertCircle,
  X,
  Check,
  FileText
} from 'lucide-react';
import { api } from '../api';
import { useTranslation } from '../translations';

export default function PatientManagement({
  patients = [],
  activePatient,
  onSelectPatient,
  onRefreshPatients,
  onNavigateToReports,
  currentLanguage = 'en'
}) {
  const t = useTranslation(currentLanguage);

  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [relationship, setRelationship] = useState('Self');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Female');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [conditions, setConditions] = useState('');
  const [primaryPhysician, setPrimaryPhysician] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Delete confirmation modal
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openAddModal = () => {
    setEditingPatient(null);
    setFullName('');
    setRelationship('Self');
    setDob('');
    setGender('Female');
    setBloodGroup('O+');
    setEmergencyPhone('');
    setConditions('');
    setPrimaryPhysician('');
    setErrorMsg('');
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setEditingPatient(p);
    setFullName(p.full_name || '');
    setRelationship(p.relationship || 'Self');
    setDob(p.date_of_birth || '');
    setGender(p.gender || 'Female');
    setBloodGroup(p.blood_group || 'O+');
    setEmergencyPhone(p.emergency_contact || '');
    setConditions(p.pre_existing_conditions || '');
    setPrimaryPhysician(p.primary_physician || '');
    setErrorMsg('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !dob) {
      setErrorMsg('Full Name and Date of Birth are mandatory.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const payload = {
        full_name: fullName.trim(),
        relationship,
        date_of_birth: dob,
        gender,
        blood_group: bloodGroup,
        emergency_contact: emergencyPhone.trim(),
        pre_existing_conditions: conditions.trim(),
        primary_physician: primaryPhysician.trim()
      };

      if (editingPatient) {
        await api.updatePatient(editingPatient.id, payload);
      } else {
        await api.createPatient(payload);
      }
      await onRefreshPatients();
      setShowModal(false);
    } catch (err) {
      setErrorMsg(err.message || 'Operation failed. Please verify the inputs.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!patientToDelete) return;
    setIsDeleting(true);
    try {
      await api.deletePatient(patientToDelete.id);
      await onRefreshPatients();
      setPatientToDelete(null);
    } catch (err) {
      alert(err.message || 'Failed to delete patient profile');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1E3A8A] tracking-tight">
            {t('patientManagementTitle')}
          </h2>
          <p className="text-xs text-[#475569]">
            {t('patientManagementSubtitle')}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-[#1E3A8A] border-2 border-[#1E3A8A] font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all duration-200 cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4 text-[#1E3A8A]" />
          <span>{t('btnAddMember')}</span>
        </button>
      </div>

      {/* MANDATORY INITIAL EMPTY STATE FOR NEWLY REGISTERED USERS */}
      {patients.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-[#CBD5E1] p-12 text-center max-w-2xl mx-auto space-y-6 shadow-sm">
          
          {/* Vector Empty Graphic - White Container, Navy Blue Icon */}
          <div className="w-24 h-24 bg-white border border-[#CBD5E1] rounded-3xl flex items-center justify-center mx-auto text-[#1E3A8A] shadow-xs">
            <Users className="w-12 h-12 text-[#1E3A8A]" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-black text-[#1E3A8A]">
              {t('emptyPatientTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed max-w-md mx-auto">
              {t('emptyPatientDesc')}
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-[#1E3A8A] border-2 border-[#1E3A8A] font-extrabold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-xs transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-[#1E3A8A]" />
            <span>{t('btnAddFirstPatient')}</span>
          </button>
        </div>
      ) : (
        /* Patient Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((p) => {
            const isSelected = activePatient?.id === p.id;
            return (
              <div
                key={p.id}
                className={`relative bg-white rounded-3xl p-6 border transition-all duration-300 shadow-xs flex flex-col justify-between ${
                  isSelected
                    ? 'border-2 border-[#1E3A8A] ring-4 ring-[#1E3A8A]/15 shadow-mediscope'
                    : 'border-[#CBD5E1] hover:border-[#1E3A8A]/50'
                }`}
              >
                {/* Header row: Relationship & Actions */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-white text-[#1E3A8A] border border-[#CBD5E1] shadow-2xs">
                      {p.relationship}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 text-[#475569] hover:text-[#1E3A8A] hover:bg-[#F1F5F9] rounded-lg transition-colors cursor-pointer"
                        title="Edit Profile"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setPatientToDelete(p)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Name and Blood Group */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#1E3A8A] to-[#172554] text-white flex items-center justify-center font-black text-base shrink-0 shadow-xs">
                      {p.full_name ? p.full_name.charAt(0).toUpperCase() : 'P'}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-[#1E3A8A] leading-snug">{p.full_name}</h4>
                      <p className="text-[11px] text-[#475569]">
                        {t('labelBloodGroup')}: <strong className="text-[#1E3A8A]">{p.blood_group || 'Unknown'}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Vitals & Meta Info */}
                  <div className="space-y-1.5 bg-[#F8FAFC] p-3 rounded-2xl border border-[#CBD5E1]/60 text-[11px] text-[#1E3A8A] mb-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[#475569]">{t('labelDob')}:</span>
                      <span className="font-semibold">{p.date_of_birth}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#475569]">{t('labelGender')}:</span>
                      <span className="font-semibold">{p.gender}</span>
                    </div>
                    {p.emergency_contact && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#475569]">{t('labelEmergency')}:</span>
                        <span className="font-semibold">{p.emergency_contact}</span>
                      </div>
                    )}
                    {p.primary_physician && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#475569]">{t('labelPrimaryDoc')}:</span>
                        <span className="font-semibold truncate max-w-[140px]">{p.primary_physician}</span>
                      </div>
                    )}
                    {p.pre_existing_conditions && (
                      <div className="pt-1.5 border-t border-[#CBD5E1]/40">
                        <span className="text-[#475569] block">{t('labelChronic')}:</span>
                        <span className="font-medium text-[10px] text-gray-700 block line-clamp-2">
                          {p.pre_existing_conditions}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="space-y-2 pt-2 border-t border-[#CBD5E1]/50">
                  <div className="flex items-center justify-between text-xs text-[#475569] font-semibold">
                    <span>{t('labelReportsCount')}:</span>
                    <span className="bg-white text-[#1E3A8A] font-black px-2 py-0.5 rounded-md border border-[#CBD5E1] shadow-2xs">
                      {p.report_count || 0}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectPatient(p)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#1E3A8A] text-white shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-[#1E3A8A] border border-[#CBD5E1]'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5 text-[#1E3A8A]" />
                      <span>{isSelected ? t('btnActiveContext') : t('btnSelect')}</span>
                    </button>

                    <button
                      onClick={() => {
                        onSelectPatient(p);
                        onNavigateToReports();
                      }}
                      className="w-full bg-white hover:bg-slate-50 text-[#1E3A8A] border border-[#CBD5E1] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#1E3A8A]" />
                      <span>{t('btnViewReports')}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Patient Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E3A8A]/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#CBD5E1] shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-linear-to-r from-[#1E3A8A] to-[#172554] p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black">
                  {editingPatient ? t('modalEditPatientTitle') : t('modalAddPatientTitle')}
                </h3>
                <p className="text-xs text-blue-100">
                  {t('modalPatientDesc')}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Full Name & Relationship */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E3A8A] mb-1">
                    {t('labelFullName')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Akhila Meesa"
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#1E3A8A] font-medium focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E3A8A] mb-1">
                    {t('labelRelationship')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#1E3A8A] font-medium focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white cursor-pointer"
                  >
                    <option value="Self">Self</option>
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* DOB, Gender & Blood Group */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E3A8A] mb-1">
                    {t('labelDob')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#1E3A8A] font-medium focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E3A8A] mb-1">{t('labelGender')}</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#1E3A8A] font-medium focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white cursor-pointer"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E3A8A] mb-1">{t('labelBloodGroup')}</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#1E3A8A] font-medium focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white cursor-pointer"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              {/* Emergency Contact & Primary Physician */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E3A8A] mb-1">
                    {t('labelEmergency')}
                  </label>
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#1E3A8A] font-medium focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E3A8A] mb-1">
                    {t('labelPrimaryDoc')}
                  </label>
                  <input
                    type="text"
                    value={primaryPhysician}
                    onChange={(e) => setPrimaryPhysician(e.target.value)}
                    placeholder="e.g. Dr. K. Sharma"
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#1E3A8A] font-medium focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white"
                  />
                </div>
              </div>

              {/* Pre-existing Medical Conditions */}
              <div>
                <label className="block text-xs font-bold text-[#1E3A8A] mb-1">
                  {t('labelChronic')}
                </label>
                <textarea
                  rows="2"
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  placeholder="e.g. Mild Hypertension, Hypothyroidism..."
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl p-3 text-xs text-[#1E3A8A] font-medium focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white"
                ></textarea>
              </div>

              {/* Action buttons - White Background, Navy Blue Text */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#CBD5E1]/60">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  {t('btnCancel')}
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-white hover:bg-slate-50 text-[#1E3A8A] border-2 border-[#1E3A8A] px-6 py-2.5 rounded-xl text-xs font-extrabold shadow-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-[#1E3A8A] border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-[#1E3A8A]" />
                      <span>{editingPatient ? t('btnSaveProfile') : t('btnCreateProfile')}</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Delete Patient Confirmation Prompt */}
      {patientToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in zoom-in-95 duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-red-300 shadow-2xl text-center space-y-5">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#1E3A8A]">{t('deleteModalTitle')}</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {t('deleteModalDesc')} (<strong>{patientToDelete.full_name}</strong>)
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPatientToDelete(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                {t('btnCancel')}
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isDeleting ? 'Deleting...' : t('btnConfirmDelete')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
