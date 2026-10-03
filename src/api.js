// Mediscope API Client Configuration
const API_BASE_URL = typeof window !== 'undefined' && window.location.origin.startsWith('http')
  ? '/api/v1'
  : 'http://127.0.0.1:8000/api/v1';

export const getAuthToken = () => localStorage.getItem('mediscope_token');
export const setAuthToken = (token) => localStorage.setItem('mediscope_token', token);
export const removeAuthToken = () => {
  localStorage.removeItem('mediscope_token');
  localStorage.removeItem('mediscope_user');
};

export const getStoredUser = () => {
  const user = localStorage.getItem('mediscope_user');
  return user ? JSON.parse(user) : null;
};
export const setStoredUser = (user) => localStorage.setItem('mediscope_user', JSON.stringify(user));

async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    ...(options.headers || {}),
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Do not set Content-Type for FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Propagate custom error payload (e.g. ACCOUNT_NOT_FOUND)
      const error = new Error(data.detail?.message || data.detail || data.title || 'API Request Failed');
      error.status = response.status;
      error.code = data.code;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    throw err;
  }
}

export const api = {
  // Auth
  checkUser: (email) => apiRequest('/auth/check-user', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),
  register: (payload) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  login: (payload) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getMe: () => apiRequest('/auth/me'),
  updatePreferences: (frequency) => apiRequest('/users/preferences', {
    method: 'PUT',
    body: JSON.stringify({ communication_frequency: frequency })
  }),

  // Patients
  getPatients: () => apiRequest('/patients'),
  createPatient: (payload) => apiRequest('/patients', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  updatePatient: (id, payload) => apiRequest(`/patients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  }),
  deletePatient: (id) => apiRequest(`/patients/${id}`, {
    method: 'DELETE'
  }),

  // Reports
  getPatientReports: (patientId) => apiRequest(`/reports/patient/${patientId}`),
  getReportDetail: (reportId) => apiRequest(`/reports/${reportId}`),
  uploadReport: (formData) => apiRequest('/reports/upload', {
    method: 'POST',
    body: formData
  }),
  getTrends: (patientId) => apiRequest(`/reports/${patientId}/trends`),
  getDoctorQuestions: (patientId) => apiRequest(`/reports/${patientId}/doctor-questions`),
  getSpecialists: (patientId) => apiRequest(`/doctors/specialists?patient_id=${patientId || ''}`),

  // Outbreaks
  getOutbreaks: () => apiRequest('/health/outbreaks'),

  // Email Reminders
  getReminders: () => apiRequest('/reminders'),
  scheduleReminder: (payload) => apiRequest('/reminders/schedule', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  sendTestEmail: (payload) => apiRequest('/reminders/send-test-email', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
};
