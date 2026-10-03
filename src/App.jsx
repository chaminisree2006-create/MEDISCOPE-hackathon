import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import HeroLanding from './components/HeroLanding';
import OverviewPortal from './components/OverviewPortal';
import PatientManagement from './components/PatientManagement';
import ReportAnalysis from './components/ReportAnalysis';
import SpecialistDirectory from './components/SpecialistDirectory';
import EmailReminders from './components/EmailReminders';
import AuthModal from './components/AuthModal';
import { api, getStoredUser, setStoredUser, removeAuthToken, getAuthToken } from './api';

export default function App() {
  const [user, setUser] = useState(getStoredUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  
  // Dashboard Navigation State
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'patients' | 'reports' | 'questions' | 'second-opinion' | 'specialists' | 'reminders'
  const [currentLanguage, setCurrentLanguage] = useState('en'); // 'en' | 'hi' | 'te'

  // Patients Data & Active Patient Context
  const [patients, setPatients] = useState([]);
  const [activePatient, setActivePatient] = useState(null);
  const [loadingPatients, setLoadingPatients] = useState(false);

  // Initial user session verification
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      api.getMe()
        .then((userData) => {
          setUser(userData);
          setStoredUser(userData);
          loadPatients();
        })
        .catch(() => {
          removeAuthToken();
          setUser(null);
          setPatients([]);
          setActivePatient(null);
        });
    }
  }, []);

  // Fetch family patients
  const loadPatients = async () => {
    setLoadingPatients(true);
    try {
      const data = await api.getPatients();
      setPatients(data);
      if (data.length > 0) {
        setActivePatient((prev) => {
          if (!prev) return data[0];
          const exists = data.find((p) => p.id === prev.id);
          return exists || data[0];
        });
      } else {
        setActivePatient(null);
      }
    } catch (err) {
      console.error('Failed to load patient records', err);
    } finally {
      setLoadingPatients(false);
    }
  };

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    setActiveTab('overview');
    loadPatients();
  };

  const handleLogout = () => {
    removeAuthToken();
    setUser(null);
    setPatients([]);
    setActivePatient(null);
    setActiveTab('overview');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#1E3A8A] font-sans antialiased selection:bg-[#1E3A8A] selection:text-white">
      
      {/* Global Navigation Header with mascot and language options */}
      <Navbar
        user={user}
        patients={patients}
        activePatient={activePatient}
        onSelectPatient={setActivePatient}
        currentLanguage={currentLanguage}
        onSelectLanguage={setCurrentLanguage}
        onOpenAuth={() => {
          setAuthModalMode('login');
          setAuthModalOpen(true);
        }}
        onNavigateHome={() => setActiveTab('overview')}
      />

      {/* Main Viewport Controller */}
      <div className="flex-1 flex w-full">
        
        {/* If user is NOT logged in: Show Hero Landing View with Cumulative Sequential Text */}
        {!user ? (
          <HeroLanding
            currentLanguage={currentLanguage}
            onOpenRegister={() => {
              setAuthModalMode('register');
              setAuthModalOpen(true);
            }}
            onOpenLogin={() => {
              setAuthModalMode('login');
              setAuthModalOpen(true);
            }}
          />
        ) : (
          /* If user IS logged in: Render Fixed Left Sidebar + Main Application View */
          <div className="flex w-full">
            <Sidebar
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              user={user}
              onLogout={handleLogout}
              patientCount={patients.length}
              currentLanguage={currentLanguage}
            />

            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
              
              {/* Portion 3: Home / Main Overview */}
              {activeTab === 'overview' && (
                <OverviewPortal
                  user={user}
                  patients={patients}
                  activePatient={activePatient}
                  onNavigate={(tabKey) => setActiveTab(tabKey)}
                  onOpenAddPatient={() => setActiveTab('patients')}
                  currentLanguage={currentLanguage}
                />
              )}

              {/* Portions 5, 6, 7: Patient Management & Family Database (MANDATORY EMPTY STATE) */}
              {activeTab === 'patients' && (
                <PatientManagement
                  patients={patients}
                  activePatient={activePatient}
                  onSelectPatient={setActivePatient}
                  onRefreshPatients={loadPatients}
                  onNavigateToReports={() => setActiveTab('reports')}
                  currentLanguage={currentLanguage}
                />
              )}

              {/* Portions 8 & 9: Patient Report Analysis, OCR, Trends, and Consultation Briefing */}
              {(activeTab === 'reports' || activeTab === 'questions' || activeTab === 'second-opinion') && (
                <ReportAnalysis
                  activePatient={activePatient}
                  patients={patients}
                  onSelectPatient={setActivePatient}
                  currentLanguage={currentLanguage}
                />
              )}

              {/* Portion 8.6: Local Specialist Doctor Finder */}
              {activeTab === 'specialists' && (
                <SpecialistDirectory
                  activePatient={activePatient}
                  currentLanguage={currentLanguage}
                />
              )}

              {/* Portion 10: Automated Email Health Reminders */}
              {activeTab === 'reminders' && (
                <EmailReminders
                  user={user}
                  patients={patients}
                  activePatient={activePatient}
                  currentLanguage={currentLanguage}
                  onUserPreferencesUpdated={(newFreq) => {
                    setUser((prev) => (prev ? { ...prev, communication_frequency: newFreq } : prev));
                  }}
                />
              )}

            </main>
          </div>
        )}

      </div>

      {/* Tabbed Authentication Gateway Modal (Log In / Register) */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        currentLanguage={currentLanguage}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* MANDATORY PERSISTENT GLOBAL FOOTER (Rendered across ALL views) */}
      <Footer currentLanguage={currentLanguage} />

    </div>
  );
}
