import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  TrendingUp,
  Stethoscope,
  Lightbulb,
  Clock,
  ShieldAlert,
  ChevronRight,
  Languages,
  Calendar,
  Layers,
  HelpCircle,
  Check
} from 'lucide-react';
import { api } from '../api';
import { useTranslation } from '../translations';

export default function ReportAnalysis({
  activePatient,
  patients = [],
  onSelectPatient,
  currentLanguage = 'en'
}) {
  const t = useTranslation(currentLanguage);

  const [reports, setReports] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [reportDetail, setReportDetail] = useState(null);
  const [trendsData, setTrendsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('biomarkers');
  
  // Upload Stepper State
  const [uploadFile, setUploadFile] = useState(null);
  const [reportName, setReportName] = useState('Comprehensive Diagnostic Panel');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStage, setUploadStage] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  // Local language toggle for briefing answers
  const [briefingLang, setBriefingLang] = useState(currentLanguage);

  useEffect(() => {
    setBriefingLang(currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    if (activePatient) {
      loadPatientReports(activePatient.id);
      loadTrends(activePatient.id);
    } else {
      setReports([]);
      setReportDetail(null);
      setTrendsData(null);
    }
  }, [activePatient]);

  const loadPatientReports = async (patientId) => {
    setLoading(true);
    try {
      const data = await api.getPatientReports(patientId);
      setReports(data);
      if (data.length > 0) {
        setSelectedReportId(data[0].id);
        loadReportDetail(data[0].id);
      } else {
        setSelectedReportId(null);
        setReportDetail(null);
      }
    } catch (err) {
      console.error('Failed to load patient reports', err);
    } finally {
      setLoading(false);
    }
  };

  const loadReportDetail = async (reportId) => {
    try {
      const data = await api.getReportDetail(reportId);
      setReportDetail(data);
    } catch (err) {
      console.error('Failed to load report detail', err);
    }
  };

  const loadTrends = async (patientId) => {
    try {
      const data = await api.getTrends(patientId);
      setTrendsData(data);
    } catch (err) {
      console.error('Failed to load trends', err);
    }
  };

  // Upload handler with Stage Stepper
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError('Please select a PDF or image medical report to upload.');
      return;
    }
    if (!activePatient) {
      setUploadError('Please select an active patient profile before uploading.');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    setUploadStage(1);

    try {
      setTimeout(() => setUploadStage(2), 500);
      setTimeout(() => setUploadStage(3), 1200);
      setTimeout(() => setUploadStage(4), 1800);

      const formData = new FormData();
      formData.append('patient_id', activePatient.id);
      formData.append('report_name', reportName);
      formData.append('report_date', reportDate);
      formData.append('file', uploadFile);

      const result = await api.uploadReport(formData);

      setUploadStage(5);
      setTimeout(() => {
        setIsUploading(false);
        setUploadStage(0);
        setUploadFile(null);
        loadPatientReports(activePatient.id);
        loadTrends(activePatient.id);
      }, 1000);
    } catch (err) {
      setUploadError(err.message || 'Report processing failed. Please verify file format.');
      setIsUploading(false);
      setUploadStage(0);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploadFile(e.dataTransfer.files[0]);
    }
  };

  if (!activePatient) {
    return (
      <div className="bg-white rounded-3xl border border-[#CBD5E1] p-12 text-center max-w-xl mx-auto space-y-4">
        <div className="w-16 h-16 bg-white border border-[#CBD5E1] rounded-2xl flex items-center justify-center mx-auto text-[#1E3A8A] shadow-xs">
          <Layers className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-[#1E3A8A]">
          {currentLanguage === 'hi' ? 'कोई सक्रिय रोगी नहीं चुना गया' : currentLanguage === 'te' ? 'యాక్టివ్ రోగి ఎంపిక కాలేదు' : 'No Active Patient Selected'}
        </h3>
        <p className="text-xs text-[#475569] leading-relaxed">
          {currentLanguage === 'hi'
            ? 'प्रयोगशाला रिपोर्ट, रुझान और प्रश्नों का निरीक्षण करने के लिए कृपया एक परिवार प्रोफ़ाइल चुनें।'
            : currentLanguage === 'te'
            ? 'ల్యాబ్ నివేదికలు, చారిత్రక మార్పులు మరియు ప్రశ్నలను పరిశీలించడానికి దయచేసి ఒక కుటుంబ సభ్యుడిని ఎంచుకోండి.'
            : 'Please select a family member profile to inspect their laboratory panels, historical trends, and consultation questions.'}
        </p>
        {patients.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center pt-2">
            {patients.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelectPatient(p)}
                className="bg-[#F8FAFC] hover:bg-[#1E3A8A] hover:text-white text-[#1E3A8A] px-4 py-2 rounded-xl text-xs font-bold border border-[#CBD5E1] transition-all cursor-pointer"
              >
                {p.full_name} ({p.relationship})
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Top Banner: Active Patient Banner & Language Selector */}
      <div className="bg-white rounded-3xl border border-[#CBD5E1] p-6 shadow-mediscope flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#1E3A8A] to-[#172554] text-white flex items-center justify-center font-black text-xl shadow-xs">
            {activePatient.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#1E3A8A]">{activePatient.full_name}</h2>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-white text-[#1E3A8A] border border-[#CBD5E1]">
                {activePatient.relationship}
              </span>
            </div>
            <p className="text-xs text-[#475569] mt-0.5">
              {t('labelDob')}: {activePatient.date_of_birth} • {t('labelBloodGroup')}: {activePatient.blood_group} • {t('labelReportsCount')}: {reports.length}
            </p>
          </div>
        </div>

        {/* Multilingual Briefing Answer Selector */}
        <div className="flex items-center gap-2 bg-[#F8FAFC] p-1.5 rounded-2xl border border-[#CBD5E1]">
          <Languages className="w-4 h-4 text-[#1E3A8A] ml-1.5" />
          <span className="text-[11px] font-bold text-[#1E3A8A] hidden sm:inline">{t('answersLanguage')}:</span>
          {['en', 'hi', 'te'].map((langKey) => (
            <button
              key={langKey}
              onClick={() => setBriefingLang(langKey)}
              className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                briefingLang === langKey
                  ? 'bg-[#1E3A8A] text-white shadow-xs'
                  : 'text-[#1E3A8A] hover:bg-white'
              }`}
            >
              {langKey === 'en' ? 'English' : langKey === 'hi' ? 'हिंदी' : 'తెలుగు'}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Document Upload & OCR Processing Zone */}
      <section className="bg-white rounded-3xl border border-[#CBD5E1] p-6 sm:p-8 shadow-mediscope space-y-6">
        <div>
          <h3 className="text-lg font-black text-[#1E3A8A] tracking-tight flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-[#1E3A8A]" />
            <span>{t('reportAnalysisTitle')}</span>
          </h3>
          <p className="text-xs text-[#475569]">
            {t('reportAnalysisSub')}
          </p>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleUpload} className="space-y-4">
          
          {uploadError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1E3A8A] mb-1">{t('labelReportTitle')}</label>
              <input
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="e.g. Comprehensive Annual Health Checkup"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#1E3A8A] font-medium focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1E3A8A] mb-1">{t('labelReportDate')}</label>
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#1E3A8A] font-medium focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white"
              />
            </div>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
              isDragOver
                ? 'border-[#1E3A8A] bg-blue-50/50 scale-99'
                : uploadFile
                ? 'border-emerald-500 bg-emerald-50/40'
                : 'border-[#CBD5E1] hover:border-[#1E3A8A] bg-[#F8FAFC]'
            }`}
            onClick={() => document.getElementById('file-upload-input').click()}
          >
            <input
              id="file-upload-input"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setUploadFile(e.target.files[0]);
                }
              }}
            />

            <div className="w-12 h-12 rounded-2xl bg-white border border-[#CBD5E1] text-[#1E3A8A] flex items-center justify-center mx-auto mb-3 shadow-xs">
              <UploadCloud className="w-6 h-6" />
            </div>

            {uploadFile ? (
              <div className="space-y-1">
                <p className="text-xs font-extrabold text-[#1E3A8A] flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Selected: {uploadFile.name} ({(uploadFile.size / 1024).toFixed(1)} KB)</span>
                </p>
                <p className="text-[11px] text-[#475569]">Click to replace file</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-xs font-bold text-[#1E3A8A]">
                  {t('dropzoneTitle')}
                </p>
                <p className="text-[11px] text-[#475569]">{t('dropzoneSub')}</p>
              </div>
            )}
          </div>

          {/* Stage Processing Stepper */}
          {isUploading && (
            <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-black text-[#1E3A8A]">
                <span>{t('stepperTitle')}</span>
                <span className="text-[#1E3A8A]">
                  {uploadStage === 1 && 'Stage 1/4: Storage...'}
                  {uploadStage === 2 && 'Stage 2/4: PyMuPDF OCR...'}
                  {uploadStage === 3 && 'Stage 3/4: Range Validation...'}
                  {uploadStage === 4 && 'Stage 4/4: RAG Synthesis...'}
                  {uploadStage === 5 && 'Completed Successfully!'}
                </span>
              </div>

              {/* Progress Stepper Pills */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { step: 1, label: t('step1') },
                  { step: 2, label: t('step2') },
                  { step: 3, label: t('step3') },
                  { step: 4, label: t('step4') }
                ].map((s) => (
                  <div
                    key={s.step}
                    className={`py-2 px-1 text-center rounded-xl text-[10px] font-extrabold border transition-all ${
                      uploadStage >= s.step
                        ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs'
                        : 'bg-white text-[#475569] border-[#CBD5E1]'
                    }`}
                  >
                    {s.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUploading || !uploadFile}
              className="bg-white hover:bg-slate-50 text-[#1E3A8A] border-2 border-[#1E3A8A] font-extrabold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-mediscope hover:shadow-mediscope-lg transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isUploading ? t('btnExecutingAnalysis') : t('btnRunAnalysis')}</span>
            </button>
          </div>

        </form>
      </section>

      {/* Reports History Selector Bar */}
      {reports.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-xs font-bold text-[#475569] whitespace-nowrap pl-1">{t('historicalReports')}:</span>
          {reports.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setSelectedReportId(r.id);
                loadReportDetail(r.id);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                selectedReportId === r.id
                  ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-sm'
                  : 'bg-white hover:bg-[#F8FAFC] text-[#1E3A8A] border-[#CBD5E1]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{r.report_name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                selectedReportId === r.id ? 'bg-white/20 text-white' : 'bg-white text-[#1E3A8A] border border-[#CBD5E1]'
              }`}>
                {r.report_date}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Detailed Report Inspection Section */}
      {reportDetail ? (
        <div className="space-y-6">
          
          {/* Sub-Navigation Tabs */}
          <div className="flex bg-white p-1.5 rounded-2xl border border-[#CBD5E1] shadow-xs overflow-x-auto">
            {[
              { id: 'biomarkers', label: t('tabBiomarkers'), icon: Layers, badge: `${reportDetail.biomarkers?.length || 0}` },
              { id: 'trends', label: t('tabTrends'), icon: TrendingUp, badge: trendsData?.has_comparison ? 'Active' : null },
              { id: 'questions', label: t('tabQuestions'), icon: Stethoscope, badge: null },
              { id: 'second-opinion', label: t('tabSecondOpinion'), icon: Lightbulb, badge: 'Recommended' },
              { id: 'guidance', label: t('tabGuidance'), icon: HelpCircle, badge: null },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#1E3A8A] text-white shadow-xs'
                      : 'text-[#1E3A8A] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white text-[#1E3A8A] border border-[#CBD5E1]'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* TAB 1: EXTRACTED BIOMARKERS */}
          {activeTab === 'biomarkers' && (
            <div className="space-y-6">
              
              {/* Multilingual AI Executive Summary */}
              <div className="bg-white rounded-3xl border border-[#CBD5E1] p-6 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#1E3A8A]" />
                    <h4 className="text-sm font-black text-[#1E3A8A]">
                      {t('aiSummaryTitle')}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-white text-[#1E3A8A] border border-[#CBD5E1] px-2.5 py-0.5 rounded-full">
                    {briefingLang === 'hi' ? 'हिंदी उत्तर' : briefingLang === 'te' ? 'తెలుగు సమాధానం' : 'English Synthesis'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  {reportDetail.report?.summary?.[briefingLang] || reportDetail.report?.summary?.en}
                </p>
              </div>

              {/* Biomarkers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {reportDetail.biomarkers?.map((b) => (
                  <div
                    key={b.id}
                    className={`bg-white rounded-3xl p-5 border transition-all shadow-xs flex flex-col justify-between ${
                      b.status === 'HIGH'
                        ? 'border-red-300 ring-2 ring-red-100'
                        : b.status === 'LOW'
                        ? 'border-[#1E3A8A]/50 ring-2 ring-blue-50'
                        : 'border-[#CBD5E1] hover:border-[#1E3A8A]/50'
                    }`}
                  >
                    <div>
                      {/* Status Badge & Category */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] text-[#475569] font-semibold truncate max-w-[150px]">
                          {b.test_name}
                        </span>

                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                            b.status === 'HIGH'
                              ? 'bg-red-100 text-red-700 border-red-300'
                              : b.status === 'LOW'
                              ? 'bg-white text-[#1E3A8A] border-[#CBD5E1]'
                              : 'bg-emerald-100 text-emerald-700 border-emerald-300'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>

                      {/* Value & Units */}
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-2xl font-black text-[#1E3A8A]">{b.value}</span>
                        <span className="text-xs font-semibold text-[#475569]">{b.unit}</span>
                      </div>

                      {/* Reference Interval Bar */}
                      <div className="bg-[#F8FAFC] rounded-xl p-2.5 text-[11px] space-y-1 mb-3 border border-[#CBD5E1]/60">
                        <div className="flex items-center justify-between text-[#475569]">
                          <span>{t('refInterval')}:</span>
                          <span className="font-bold text-[#1E3A8A]">
                            {b.reference_low} - {b.reference_high} {b.unit}
                          </span>
                        </div>
                      </div>

                      {/* Educational Context */}
                      <p className="text-[11px] text-[#475569] leading-relaxed">
                        {b.clinical_context?.[briefingLang] || b.clinical_context?.en}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-[#CBD5E1]/50 flex items-center justify-between text-[10px] text-[#475569]">
                      <span>Calibration: Standard Bio-chemistry</span>
                      <span className="text-[#1E3A8A] font-bold">Mediscope Verified</span>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 2: LONGITUDINAL DELTAS */}
          {activeTab === 'trends' && (
            <div className="bg-white rounded-3xl border border-[#CBD5E1] p-6 sm:p-8 shadow-mediscope space-y-6">
              <div>
                <h4 className="text-lg font-black text-[#1E3A8A] tracking-tight flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#1E3A8A]" />
                  <span>{t('tabTrends')}</span>
                </h4>
                <p className="text-xs text-[#475569]">
                  {currentLanguage === 'hi'
                    ? 'अध्ययनों में परिवर्तन को इंगित करने के लिए पुरानी और वर्तमान रिपोर्ट के बीच गणना।'
                    : currentLanguage === 'te'
                    ? 'పురోగతిని పరిశీలించడానికి మునుపటి మరియు ప్రస్తుత నివేదికల మధ్య ఖచ్చితమైన తేడాలు.'
                    : 'Exact numerical deltas and percentage shifts computed across sequential lab encounters.'}
                </p>
              </div>

              {!trendsData?.has_comparison ? (
                <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl p-8 text-center space-y-2">
                  <Clock className="w-8 h-8 text-[#475569] mx-auto" />
                  <h5 className="text-sm font-bold text-[#1E3A8A]">
                    {currentLanguage === 'hi' ? 'रुझान मॉडलिंग के लिए अतिरिक्त डेटा आवश्यक है' : currentLanguage === 'te' ? 'ధోరణి కోసం అదనపు డేటా అవసరం' : 'Additional Data Needed for Trend Modeling'}
                  </h5>
                  <p className="text-xs text-[#475569] max-w-md mx-auto">
                    {currentLanguage === 'hi'
                      ? 'तुलनात्मक विश्लेषण उत्पन्न करने के लिए कम से कम दो रिपोर्ट अपलोड करें।'
                      : currentLanguage === 'te'
                      ? 'పోలిక విశ్లేషణ కోసం కనీసం రెండు నివేదికలను అప్‌లోడ్ చేయండి.'
                      : 'Upload at least two chronological reports to generate comparative delta analytics.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-[#1E3A8A] bg-[#F8FAFC] p-3 rounded-xl border border-[#CBD5E1]">
                    <span>Prior: {trendsData.prior_report?.name} ({trendsData.prior_report?.date})</span>
                    <span>Current: {trendsData.current_report?.name} ({trendsData.current_report?.date})</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#CBD5E1] text-[#475569] font-bold text-[11px]">
                          <th className="py-3 px-3">Biomarker</th>
                          <th className="py-3 px-3">Prior</th>
                          <th className="py-3 px-3">Current</th>
                          <th className="py-3 px-3">Delta Shift</th>
                          <th className="py-3 px-3">% Change</th>
                          <th className="py-3 px-3">Trajectory</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#CBD5E1]/50">
                        {trendsData.deltas?.map((d, idx) => (
                          <tr key={idx} className="hover:bg-[#F8FAFC]">
                            <td className="py-3.5 px-3 font-extrabold text-[#1E3A8A]">
                              {d.test_name}
                            </td>
                            <td className="py-3.5 px-3 text-[#1E3A8A]">
                              {d.prior_value} {d.unit}
                            </td>
                            <td className="py-3.5 px-3 font-bold text-[#1E3A8A]">
                              {d.current_value} {d.unit}
                            </td>
                            <td className="py-3.5 px-3 font-black">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${
                                  d.delta < 0
                                    ? 'bg-blue-50 text-blue-700'
                                    : d.delta > 0
                                    ? 'bg-white text-[#1E3A8A] border border-[#CBD5E1]'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {d.delta > 0 ? `+${d.delta}` : d.delta} {d.unit}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 font-bold text-[#475569]">
                              {d.percentage_change > 0 ? `+${d.percentage_change}%` : `${d.percentage_change}%`}
                            </td>
                            <td className="py-3.5 px-3">
                              <span
                                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  d.trend_direction === 'IMPROVED'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : d.trend_direction === 'WORSENED'
                                    ? 'bg-red-100 text-red-800 border border-red-300'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {d.trend_direction}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: DOCTOR CONSULTATION QUESTIONS */}
          {activeTab === 'questions' && (
            <div className="bg-white rounded-3xl border border-[#CBD5E1] p-6 sm:p-8 shadow-mediscope space-y-6">
              <div>
                <h4 className="text-lg font-black text-[#1E3A8A] tracking-tight flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-[#1E3A8A]" />
                  <span>{t('tabQuestions')}</span>
                </h4>
                <p className="text-xs text-[#475569]">
                  {currentLanguage === 'hi'
                    ? 'असामान्य मानों के आधार पर डॉक्टर से पूछने योग्य विशिष्ट प्रश्न।'
                    : currentLanguage === 'te'
                    ? 'అసాధారణ ఫలితాల ఆధారంగా డాక్టర్‌తో చర్చించడానికి సిద్ధం చేసిన ప్రశ్నలు.'
                    : 'Patient-centric questions tailored to out-of-range results to maximize your appointment efficiency.'}
                </p>
              </div>

              <div className="space-y-3">
                {(reportDetail.doctor_questions?.[briefingLang] || reportDetail.doctor_questions?.en || []).map((q, idx) => (
                  <div
                    key={idx}
                    className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl p-4 flex items-start gap-3 hover:border-[#1E3A8A] transition-colors"
                  >
                    <div className="w-7 h-7 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5 shadow-xs">
                      {idx + 1}
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-[#1E3A8A] leading-relaxed">
                      {q}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SECOND TREATMENT OPINIONS */}
          {activeTab === 'second-opinion' && (
            <div className="bg-white rounded-3xl border border-[#CBD5E1] p-6 sm:p-8 shadow-mediscope space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-[#1E3A8A]" />
                  <h4 className="text-lg font-black text-[#1E3A8A] tracking-tight">
                    {t('secondOpinionTitle')}
                  </h4>
                </div>
                <p className="text-xs text-[#475569]">
                  {t('secondOpinionSub')}
                </p>
              </div>

              <div className="bg-white border border-[#CBD5E1] rounded-2xl p-5 text-[#1E3A8A] text-xs leading-relaxed space-y-3 shadow-xs">
                <div className="font-extrabold flex items-center gap-2 text-sm text-[#1E3A8A]">
                  <Sparkles className="w-4 h-4 text-[#1E3A8A]" />
                  <span>
                    {briefingLang === 'hi'
                      ? 'द्वितीय चिकित्सा राय और वैकल्पिक दृष्टिकोण'
                      : briefingLang === 'te'
                      ? 'రెండవ వైద్య అభిప్రాయం మరియు చికిత్స మార్గాలు'
                      : 'Multidisciplinary Clinical Second Perspective'}
                  </span>
                </div>
                
                <div className="whitespace-pre-line text-xs sm:text-sm text-gray-800 font-medium">
                  {reportDetail.report?.second_opinion?.[briefingLang] || reportDetail.report?.second_opinion?.en || 'Standard Wellness Protocols Recommended.'}
                </div>
              </div>

              {/* Second Opinion Validation Checklist */}
              <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl p-5 space-y-3">
                <span className="text-xs font-black text-[#1E3A8A] block">
                  {t('secondValidationTitle')}:
                </span>
                <ul className="text-xs text-[#475569] space-y-2 list-disc pl-5">
                  {briefingLang === 'hi' ? (
                    <>
                      <li>क्या हाइड्रेशन या हाल ही के वायरल संक्रमण ने इन बायोमार्कर मानों को प्रभावित किया हो सकता है?</li>
                      <li>क्या दवा शुरू करने से पहले 90 दिनों का जीवनशैली परीक्षण सुरक्षित होगा?</li>
                      <li>क्या पुष्टि के लिए अतिरिक्त विशिष्ट परीक्षण (जैसे ApoB या Anti-TPO) किए जाने चाहिए?</li>
                    </>
                  ) : briefingLang === 'te' ? (
                    <>
                      <li>నీరు తక్కువగా తాగడం లేదా ఇటీవలి అనారోగ్యం ఈ ఫలితాలను ప్రభావితం చేసిందా?</li>
                      <li>మందులు మొదలుపెట్టే ముందు 90 రోజుల పాటు జీవనశైలి మార్పులు చేయడం సురక్షితమేనా?</li>
                      <li>నిర్ధారణ కోసం అదనపు నిర్దిష్ట పరీక్షలు (ApoB లేదా Anti-TPO వంటివి) చేయించాలా?</li>
                    </>
                  ) : (
                    <>
                      <li>Could transient acute illness or hydration state have influenced these out-of-range biomarkers?</li>
                      <li>Would a 90-day trial of non-pharmacologic lifestyle changes be safe before initiating long-term prescription therapies?</li>
                      <li>Are complementary biomarker assays (e.g. ApoB, Anti-TPO) recommended to confirm the diagnostic picture?</li>
                    </>
                  )}
                </ul>
              </div>

            </div>
          )}

          {/* TAB 5: NEXT-STEP CLINICAL GUIDANCE */}
          {activeTab === 'guidance' && (
            <div className="bg-white rounded-3xl border border-[#CBD5E1] p-6 sm:p-8 shadow-mediscope space-y-6">
              <div>
                <h4 className="text-lg font-black text-[#1E3A8A] tracking-tight flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#1E3A8A]" />
                  <span>{t('tabGuidance')}</span>
                </h4>
                <p className="text-xs text-[#475569]">
                  {currentLanguage === 'hi'
                    ? 'अपॉइंटमेंट तैयारी, आहार और परीक्षण समय-सीमा के संबंध में नैदानिक मार्गदर्शन।'
                    : currentLanguage === 'te'
                    ? 'వైద్యుని సంప్రదింపు సన్నద్ధత, ఆహార జాగ్రత్తలు మరియు తదుపరి పరీక్షల సమయాలు.'
                    : 'Clinical education regarding appointment preparation, dietary considerations, and lab re-test intervals.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl p-5 space-y-2">
                  <h5 className="text-xs font-black text-[#1E3A8A] uppercase tracking-wider">
                    {currentLanguage === 'hi' ? '1. परामर्श तैयारी' : currentLanguage === 'te' ? '1. అపాయింట్‌మెంట్ సన్నద్ధత' : '1. Appointment Preparation'}
                  </h5>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {currentLanguage === 'hi'
                      ? 'इस सारांश को प्रिंट करें और तैयार प्रश्नों को अपने डॉक्टर के सामने प्रस्तुत करें। होम ब्लड शुगर या बीपी लॉग साथ रखें।'
                      : currentLanguage === 'te'
                      ? 'ఈ సారాంశాన్ని ప్రింట్ చేసి వైద్యుడికి చూపించండి. హోమ్ షుగర్ లేదా బీపీ రీడింగ్స్ రికార్డ్ సిద్ధంగా ఉంచుకోండి.'
                      : 'Print this Mediscope summary and present the prioritized Doctor Consultation Questions to your physician.'}
                  </p>
                </div>

                <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl p-5 space-y-2">
                  <h5 className="text-xs font-black text-[#1E3A8A] uppercase tracking-wider">
                    {currentLanguage === 'hi' ? '2. जीवनशैली में बदलाव' : currentLanguage === 'te' ? '2. జీవనశైలి మార్పులు' : '2. Lifestyle Interventions'}
                  </h5>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {currentLanguage === 'hi'
                      ? 'संतुलित आहार अपनाएं, प्रति सप्ताह 150 मिनट मध्यम व्यायाम करें और पर्याप्त नींद सुनिश्चित करें।'
                      : currentLanguage === 'te'
                      ? 'సమతుల్య ఆహారాన్ని అలవర్చుకోండి, వారానికి 150 నిమిషాల వ్యాయామం మరియు తగినంత నిద్ర ఉండేలా చూసుకోండి.'
                      : 'Prioritize balanced nutrition, achieve 150 minutes of weekly aerobic conditioning, and ensure 7-8 hours of sleep.'}
                  </p>
                </div>

                <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl p-5 space-y-2">
                  <h5 className="text-xs font-black text-[#1E3A8A] uppercase tracking-wider">
                    {currentLanguage === 'hi' ? '3. पुनः परीक्षण समय' : currentLanguage === 'te' ? '3. తిరిగి పరీక్షించే సమయం' : '3. Re-test Timeframe'}
                  </h5>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {currentLanguage === 'hi'
                      ? 'सीमांत मेटाबॉलिक मार्करों के लिए 90 दिनों में पुनः परीक्षण की सलाह दी जाती है। थायरॉइड के लिए 8-12 सप्ताह में दोबारा जांचें।'
                      : currentLanguage === 'te'
                      ? 'మెటబాలిక్ మార్కర్ల కోసం 90 రోజులలో మళ్లీ పరీక్షించండి. థైరాయిడ్ లేదా విటమిన్ల కోసం 8-12 వారాలలో చేయించండి.'
                      : 'For borderline metabolic markers, re-test in 90 days. For thyroid or vitamin replenishments, repeat lab draws at 8-12 weeks.'}
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#CBD5E1] p-8 text-center text-xs text-[#475569]">
          No reports uploaded yet for this family member. Use the upload zone above to analyze your first laboratory document.
        </div>
      )}

    </div>
  );
}
