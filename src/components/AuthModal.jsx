import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { api, setAuthToken, setStoredUser } from '../api';
import { useTranslation } from '../translations';

export default function AuthModal({
  isOpen,
  initialMode = 'login',
  onClose,
  onAuthSuccess,
  currentLanguage = 'en'
}) {
  const t = useTranslation(currentLanguage);

  const [mode, setMode] = useState(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [consentGranted, setConsentGranted] = useState(false);
  
  // Feedback & State
  const [errorMsg, setErrorMsg] = useState('');
  const [duplicateEmailMsg, setDuplicateEmailMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Popup Alert for Account Not Found
  const [showAccountNotFoundModal, setShowAccountNotFoundModal] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setErrorMsg('');
    setDuplicateEmailMsg('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  // Live Password Complexity Checklist rules
  const passwordChecklist = [
    { label: t('pwdRule1'), met: password.length >= 8 },
    { label: t('pwdRule2'), met: /[A-Z]/.test(password) },
    { label: t('pwdRule3'), met: /[a-z]/.test(password) },
    { label: t('pwdRule4'), met: /[0-9]/.test(password) },
    { label: t('pwdRule5'), met: /[@#$%!&*^()_+\-=\[\]{}|;:,.<>?/~`]/.test(password) },
  ];
  const isPasswordValid = passwordChecklist.every((c) => c.met);

  const isEmailFormatValid = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setDuplicateEmailMsg('');

    if (!isEmailFormatValid) {
      setErrorMsg('Please enter a valid email address (e.g., yourname@domain.com).');
      return;
    }

    if (mode === 'register') {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (!isPasswordValid) {
        setErrorMsg('Please satisfy all password complexity requirements before registering.');
        return;
      }
      if (!consentGranted) {
        setErrorMsg('You must grant mandatory data processing consent to register.');
        return;
      }

      setLoading(true);
      try {
        const response = await api.register({
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
          consent_granted: true,
          communication_frequency: 'ANNUAL'
        });

        setAuthToken(response.access_token);
        setStoredUser(response.user);
        onAuthSuccess(response.user);
        onClose();
      } catch (err) {
        if (err.status === 409 || err.message?.includes('already exists')) {
          setDuplicateEmailMsg('An account with this email already exists. Please log in.');
        } else {
          setErrorMsg(err.message || 'Registration failed. Please check your details.');
        }
      } finally {
        setLoading(false);
      }
    } else {
      if (!password) {
        setErrorMsg('Please enter your password.');
        return;
      }

      setLoading(true);
      try {
        const response = await api.login({
          email: email.trim().toLowerCase(),
          password
        });

        setAuthToken(response.access_token);
        setStoredUser(response.user);
        onAuthSuccess(response.user);
        onClose();
      } catch (err) {
        if (err.status === 404 || err.code === 'ACCOUNT_NOT_FOUND') {
          setShowAccountNotFoundModal(true);
        } else {
          setErrorMsg(err.message || 'Login failed. Please verify your credentials.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E3A8A]/50 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Account Not Found Popup Modal Alert */}
      {showAccountNotFoundModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in zoom-in-95 duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-[#1E3A8A] shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 bg-white border border-[#CBD5E1] rounded-2xl flex items-center justify-center mx-auto text-[#1E3A8A] shadow-xs">
              <ShieldAlert className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-[#1E3A8A]">{t('accountNotFoundTitle')}</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {t('accountNotFoundDesc')} (<strong>{email}</strong>).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowAccountNotFoundModal(false);
                  setMode('register');
                  setErrorMsg('');
                  setDuplicateEmailMsg('');
                }}
                className="flex-1 bg-white hover:bg-slate-50 text-[#1E3A8A] border-2 border-[#1E3A8A] font-extrabold py-3 px-4 rounded-xl text-sm transition-all shadow-mediscope cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{t('btnSwitchRegister')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                type="button"
                onClick={() => setShowAccountNotFoundModal(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl text-sm transition-all cursor-pointer"
              >
                {t('btnCancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Authentication Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#CBD5E1] shadow-2xl overflow-hidden transition-all">
        
        {/* Modal Header */}
        <div className="bg-linear-to-r from-[#1E3A8A] to-[#172554] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <img 
              src="/mediscope_mascot.png" 
              alt="Mediscope Mascot" 
              className="w-12 h-12 rounded-2xl border-2 border-white shadow-md object-cover" 
            />
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">{t('authGatewayTitle')}</h2>
              <p className="text-xs text-blue-100">{t('authGatewaySubtitle')}</p>
            </div>
          </div>

          {/* Tabbed Gateway Navigation */}
          <div className="flex bg-black/20 p-1 rounded-2xl mt-5">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
                setDuplicateEmailMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#1E3A8A] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {t('tabLogIn')}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg('');
                setDuplicateEmailMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-[#1E3A8A] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {t('tabRegister')}
            </button>
          </div>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Duplicate Email Inline Notice */}
          {duplicateEmailMsg && (
            <div className="bg-white border border-[#CBD5E1] text-[#1E3A8A] p-3 rounded-xl text-xs flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#1E3A8A] shrink-0" />
                <span>{duplicateEmailMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setDuplicateEmailMsg('');
                }}
                className="font-bold underline text-[#1E3A8A] shrink-0 hover:text-[#172554] cursor-pointer"
              >
                Log In
              </button>
            </div>
          )}

          {/* Generic Error Message */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Registration: Full Name */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-[#1E3A8A] mb-1">
                {t('labelFullName')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-[#475569]" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Akhila Meesa"
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1E3A8A] font-medium placeholder-[#475569]/60 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-[#1E3A8A] mb-1">
              {t('labelEmail')} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#475569]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. user@domain.com"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1E3A8A] font-medium placeholder-[#475569]/60 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-[#1E3A8A] mb-1">
              {t('labelPassword')} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#475569]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter secure password"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#1E3A8A] font-medium placeholder-[#475569]/60 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#475569] hover:text-[#1E3A8A] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Live Interactive Password Complexity Checklist */}
          {mode === 'register' && (
            <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl p-3.5 space-y-2">
              <span className="text-[11px] font-bold text-[#1E3A8A] block">
                {t('pwdChecklistTitle')}
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {passwordChecklist.map((c, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px]">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 shrink-0 ${
                        c.met ? 'text-emerald-600' : 'text-[#CBD5E1]'
                      }`}
                    />
                    <span className={c.met ? 'text-emerald-800 font-semibold' : 'text-gray-500'}>
                      {c.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ONE-TIME MANDATORY PERMISSION CONSENT */}
          {mode === 'register' && (
            <div className="bg-white border border-[#CBD5E1] p-3.5 rounded-2xl shadow-xs">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={consentGranted}
                  onChange={(e) => setConsentGranted(e.target.checked)}
                  className="mt-1 w-4 h-4 text-[#1E3A8A] border-[#CBD5E1] rounded focus:ring-[#1E3A8A]"
                />
                <span className="text-[10px] leading-relaxed text-[#1E3A8A]">
                  {t('consentText')}
                </span>
              </label>
            </div>
          )}

          {/* Submit Action Button with White Background & Navy Blue Text */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-slate-50 text-[#1E3A8A] border-2 border-[#1E3A8A] font-extrabold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-mediscope hover:shadow-mediscope-lg transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-block animate-spin w-4 h-4 border-2 border-[#1E3A8A] border-t-transparent rounded-full"></span>
            ) : mode === 'register' ? (
              <>
                <span>{t('btnCompleteRegister')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>{t('btnSignInAction')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Switch tab helper */}
          <div className="text-center pt-2">
            {mode === 'login' ? (
              <p className="text-xs text-[#475569]">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg('');
                    setDuplicateEmailMsg('');
                  }}
                  className="font-bold text-[#1E3A8A] hover:text-[#172554] underline cursor-pointer"
                >
                  Register here
                </button>
              </p>
            ) : (
              <p className="text-xs text-[#475569]">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg('');
                    setDuplicateEmailMsg('');
                  }}
                  className="font-bold text-[#1E3A8A] hover:text-[#172554] underline cursor-pointer"
                >
                  Log in to your account
                </button>
              </p>
            )}
          </div>

        </form>

      </div>
    </div>
  );
}
