import React, { useState, useEffect } from 'react';
import {
  BellRing,
  Mail,
  Send,
  Calendar,
  CheckCircle2,
  Clock,
  Settings,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  X,
  AlertCircle
} from 'lucide-react';
import { api } from '../api';
import { useTranslation } from '../translations';

export default function EmailReminders({
  user,
  patients = [],
  activePatient,
  onUserPreferencesUpdated,
  currentLanguage = 'en'
}) {
  const t = useTranslation(currentLanguage);

  const [frequency, setFrequency] = useState(user?.communication_frequency || 'ANNUAL');
  const [remindersList, setRemindersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingPref, setUpdatingPref] = useState(false);
  const [prefNotice, setPrefNotice] = useState('');

  // Schedule modal state
  const [selectedPatientId, setSelectedPatientId] = useState(activePatient?.id || (patients[0]?.id || ''));
  const [reminderType, setReminderType] = useState('Annual Comprehensive Health Screening');
  const [scheduledDate, setScheduledDate] = useState('2026-11-15');
  const [customNotes, setCustomNotes] = useState('Annual fasting glucose, lipid panel, and liver profile checkup.');
  const [scheduling, setScheduling] = useState(false);

  // Dispatch Test Email state & Preview Modal
  const [dispatching, setDispatching] = useState(false);
  const [dispatchedResult, setDispatchedResult] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    fetchReminders();
    if (user?.communication_frequency) {
      setFrequency(user.communication_frequency);
    }
  }, [user]);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const data = await api.getReminders();
      setRemindersList(data);
    } catch (err) {
      console.error('Failed to load reminders', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePreferences = async (newFreq) => {
    setFrequency(newFreq);
    setUpdatingPref(true);
    setPrefNotice('');
    try {
      await api.updatePreferences(newFreq);
      setPrefNotice(`Notification frequency updated to ${newFreq.replace('_', ' ')}`);
      if (onUserPreferencesUpdated) {
        onUserPreferencesUpdated(newFreq);
      }
      setTimeout(() => setPrefNotice(''), 3000);
    } catch (err) {
      console.error('Failed to update preferences', err);
    } finally {
      setUpdatingPref(false);
    }
  };

  const handleScheduleReminder = async (e) => {
    e.preventDefault();
    if (!selectedPatientId || !scheduledDate) return;
    setScheduling(true);
    try {
      await api.scheduleReminder({
        patient_id: selectedPatientId,
        reminder_type: reminderType,
        scheduled_date: scheduledDate,
        notes: customNotes
      });
      await fetchReminders();
      alert('Health checkup reminder successfully scheduled!');
    } catch (err) {
      alert(err.message || 'Failed to schedule reminder');
    } finally {
      setScheduling(false);
    }
  };

  const handleTriggerTestEmail = async () => {
    const targetPatientId = selectedPatientId || activePatient?.id || patients[0]?.id;
    if (!targetPatientId) {
      alert('Please add or select a patient profile first.');
      return;
    }

    setDispatching(true);
    try {
      const result = await api.sendTestEmail({
        patient_id: targetPatientId,
        reminder_type: reminderType,
        scheduled_date: scheduledDate,
        notes: customNotes
      });
      setDispatchedResult(result);
      setShowPreviewModal(true);
      await fetchReminders();
    } catch (err) {
      alert(err.message || 'Failed to dispatch test email');
    } finally {
      setDispatching(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-[#CBD5E1] p-6 sm:p-8 shadow-mediscope space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-[#CBD5E1] text-[#1E3A8A] flex items-center justify-center shadow-xs">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1E3A8A] tracking-tight">
              {t('reminderTitle')}
            </h2>
            <p className="text-xs text-[#475569]">
              {t('reminderSub')} ({user?.email})
            </p>
          </div>
        </div>

        {/* Email Controls: Frequency Settings */}
        <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#1E3A8A]" />
              <span className="text-xs font-black text-[#1E3A8A]">{t('frequencyControls')}</span>
            </div>
            {prefNotice && (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                {prefNotice}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'ANNUAL', label: t('freqAnnual'), desc: t('freqAnnualSub') },
              { id: 'SEMI_ANNUAL', label: t('freqSemi'), desc: t('freqSemiSub') },
              { id: 'QUARTERLY', label: t('freqQuarterly'), desc: t('freqQuarterlySub') },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleUpdatePreferences(opt.id)}
                disabled={updatingPref}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  frequency === opt.id
                    ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-sm'
                    : 'bg-white text-[#1E3A8A] border-[#CBD5E1] hover:border-[#1E3A8A]'
                }`}
              >
                <span className="block text-xs font-black">{opt.label}</span>
                <span className={`block text-[10px] mt-0.5 ${frequency === opt.id ? 'text-blue-100' : 'text-[#475569]'}`}>
                  {opt.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule a New Reminder & Immediate Dispatch Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Schedule Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#CBD5E1] p-6 sm:p-8 shadow-mediscope space-y-5">
          <div className="flex items-center justify-between border-b border-[#CBD5E1]/60 pb-3">
            <h3 className="text-base font-black text-[#1E3A8A] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#1E3A8A]" />
              <span>{t('scheduleMilestone')}</span>
            </h3>
            <span className="text-[10px] font-extrabold uppercase bg-white text-[#1E3A8A] px-2 py-0.5 rounded-full border border-[#CBD5E1]">
              Direct Dispatch
            </span>
          </div>

          <form onSubmit={handleScheduleReminder} className="space-y-4">
            
            {/* Target Patient */}
            <div>
              <label className="block text-xs font-bold text-[#1E3A8A] mb-1">
                {t('selectFamilyMember')}
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#1E3A8A] font-medium focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] cursor-pointer"
              >
                {patients.length === 0 ? (
                  <option value="">No patients available - Add one in Patients tab</option>
                ) : (
                  patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.full_name} ({p.relationship})
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Reminder Type & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1E3A8A] mb-1">{t('reminderCategory')}</label>
                <select
                  value={reminderType}
                  onChange={(e) => setReminderType(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#1E3A8A] font-medium focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] cursor-pointer"
                >
                  <option value="Annual Comprehensive Health Screening">Annual Comprehensive Health Screening</option>
                  <option value="Fasting Glucose & HbA1c Follow-Up">Fasting Glucose & HbA1c Follow-Up</option>
                  <option value="Lipid Profile & Cardio-Metabolic Panel">Lipid Profile & Cardio-Metabolic Panel</option>
                  <option value="Thyroid (TSH / Free T4) Evaluation">Thyroid (TSH / Free T4) Evaluation</option>
                  <option value="Renal Function & Electrolytes Check">Renal Function & Electrolytes Check</option>
                  <option value="Vitamin D3 & B12 Replenishment Review">Vitamin D3 & B12 Replenishment Review</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E3A8A] mb-1">{t('scheduledDate')}</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#1E3A8A] font-medium focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                />
              </div>
            </div>

            {/* Custom Clinical Note */}
            <div>
              <label className="block text-xs font-bold text-[#1E3A8A] mb-1">{t('customNotes')}</label>
              <textarea
                rows="2"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Notes for appointment preparation or fasting instructions..."
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl p-3 text-xs text-[#1E3A8A] font-medium focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-3 border-t border-[#CBD5E1]/60">
              
              {/* Actual Email Dispatch Engine Trigger with White Background & Navy Blue Text */}
              <button
                type="button"
                onClick={handleTriggerTestEmail}
                disabled={dispatching || patients.length === 0}
                className="bg-white hover:bg-slate-50 text-[#1E3A8A] border-2 border-[#1E3A8A] font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-mediscope transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{dispatching ? 'Dispatching...' : t('btnDispatchActual')}</span>
              </button>

              <button
                type="submit"
                disabled={scheduling || patients.length === 0}
                className="bg-[#1E3A8A] hover:bg-[#172554] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-mediscope transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{scheduling ? 'Scheduling...' : t('btnSaveSchedule')}</span>
              </button>

            </div>

          </form>
        </div>

        {/* Live Dispatch Engine Info Card */}
        <div className="lg:col-span-5 bg-linear-to-br from-white via-[#F8FAFC] to-white rounded-3xl border border-[#CBD5E1] p-6 sm:p-8 shadow-mediscope flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-black text-[#1E3A8A] uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#1E3A8A]" />
              <span>Email Dispatch Engine</span>
            </div>

            <h4 className="text-lg font-black text-[#1E3A8A] leading-snug">
              Direct In-Inbox Health Notification Engine
            </h4>

            <p className="text-xs text-[#475569] leading-relaxed">
              When dispatched, Mediscope creates a personalized, formatted HTML email customized for your selected family member with recommended baseline panels, fasting instructions, and direct links back to their Mediscope profile.
            </p>

            <div className="bg-white border border-[#CBD5E1] rounded-2xl p-4 space-y-2 text-xs shadow-xs">
              <div className="flex items-center justify-between text-[#475569]">
                <span>Registered Dispatch Address:</span>
                <strong className="text-[#1E3A8A] font-black">{user?.email}</strong>
              </div>
              <div className="flex items-center justify-between text-[#475569]">
                <span>Pipeline Integration:</span>
                <span className="text-emerald-700 font-bold">SMTP / Edge Service Active</span>
              </div>
              <div className="flex items-center justify-between text-[#475569]">
                <span>Mandatory Ownership:</span>
                <span className="text-[#1E3A8A] font-semibold text-[10px]">Akhila Meesa © 2026</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={handleTriggerTestEmail}
              disabled={dispatching || patients.length === 0}
              className="w-full bg-[#1E3A8A] hover:bg-[#172554] text-white py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-mediscope transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4 text-white" />
              <span>{t('btnTestSend')} ({user?.email || 'Inbox'})</span>
            </button>
          </div>
        </div>

      </div>

      {/* Scheduled Reminders History */}
      <div className="bg-white rounded-3xl border border-[#CBD5E1] p-6 sm:p-8 shadow-mediscope space-y-4">
        <div className="flex items-center justify-between border-b border-[#CBD5E1]/60 pb-3">
          <h3 className="text-base font-black text-[#1E3A8A]">{t('reminderQueue')}</h3>
          <span className="text-xs text-[#475569]">Total: {remindersList.length}</span>
        </div>

        {remindersList.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#475569]">
            No reminders scheduled yet. Use the form above to schedule your first checkup milestone.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#CBD5E1] text-[#475569] font-bold text-[11px]">
                  <th className="py-3 px-3">Family Member</th>
                  <th className="py-3 px-3">Reminder Category</th>
                  <th className="py-3 px-3">Scheduled Date</th>
                  <th className="py-3 px-3">Recipient Address</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CBD5E1]/50">
                {remindersList.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F8FAFC]">
                    <td className="py-3 px-3 font-extrabold text-[#1E3A8A]">
                      {r.patient_name} <span className="text-[10px] text-[#475569]">({r.relationship})</span>
                    </td>
                    <td className="py-3 px-3 text-[#1E3A8A]">{r.reminder_type}</td>
                    <td className="py-3 px-3 font-bold text-[#1E3A8A]">{r.scheduled_date}</td>
                    <td className="py-3 px-3 text-[#475569] font-medium">{r.email_recipient}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                          r.status === 'SENT'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-white text-[#1E3A8A] border-[#CBD5E1]'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Actual Formatted HTML Email Dispatch Preview Modal */}
      {showPreviewModal && dispatchedResult && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in zoom-in-95 duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-[#CBD5E1] shadow-2xl space-y-5 max-h-[85vh] flex flex-col">
            
            <div className="flex items-center justify-between border-b border-[#CBD5E1] pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-black text-[#1E3A8A]">
                  Actual HTML Email Dispatched Successfully
                </h3>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3 rounded-2xl text-xs space-y-1">
              <p><strong>Dispatched To:</strong> {dispatchedResult.dispatch_details?.recipient}</p>
              <p><strong>Delivery Mode:</strong> {dispatchedResult.dispatch_details?.delivery_mode}</p>
              <p><strong>Subject:</strong> {dispatchedResult.dispatch_details?.subject}</p>
            </div>

            <div className="border border-[#CBD5E1] rounded-2xl overflow-hidden flex-1 min-h-[300px]">
              <iframe
                title="Email Preview"
                srcDoc={dispatchedResult.dispatch_details?.html_preview}
                className="w-full h-full min-h-[350px] border-0"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-mediscope cursor-pointer"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
