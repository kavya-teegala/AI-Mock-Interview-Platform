import axiosInstance from '@/api/axiosInstance'

// ==============================
// AUTH SERVICES
// ==============================

export const authService = {
  login: (payload) =>
    axiosInstance.post('/auth/login', payload),

  register: (payload) =>
    axiosInstance.post('/auth/register', payload),

  forgotPassword: (payload) =>
    axiosInstance.post(
      '/auth/forgot-password',
      payload
    ),
}

// ==============================
// INTERVIEW SERVICES
// ==============================

export const interviewService = {
  // GENERATE QUESTIONS
  generateQuestions: (payload) =>
    axiosInstance.post(
      '/ai/generate-questions',
      payload
    ),

  // EVALUATE ANSWER
  evaluateAnswer: (payload) =>
    axiosInstance.post(
      '/ai/evaluate',
      payload
    ),

  // SAVE SESSION
  saveSession: (payload) =>
    axiosInstance.post(
      '/ai/save-session',
      payload
    ),

  // HISTORY
  getHistory: () =>
    axiosInstance.get(
      '/ai/history'
    ),

  getInterviewHistory: () =>
    axiosInstance.get(
      '/ai/history'
    ),
}

// ==============================
// RESUME SERVICES
// ==============================

export const resumeService = {
  upload: (formData) =>
    axiosInstance.post(
      '/resume/upload',
      formData,
      {
        headers: {
          'Content-Type':
            'multipart/form-data',
        },
      }
    ),

  getHistory: () =>
    axiosInstance.get('/resume/history'),
}

// ==============================
// PROFILE SERVICES
// ==============================

export const profileService = {
  getMe: () =>
    axiosInstance.get('/profile/me'),

  updateMe: (payload) =>
    axiosInstance.put(
      '/profile/me',
      payload
    ),
}