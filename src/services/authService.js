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
  // Generate interview questions
  generateQuestions: (payload) =>
    axiosInstance.post(
      '/ai/generate-questions',
      payload
    ),

  // Evaluate user answer
  evaluateAnswer: (payload) =>
    axiosInstance.post(
      '/ai/evaluate',
      payload
    ),

  // Generate follow-up question
  generateFollowUp: (payload) =>
    axiosInstance.post(
      '/ai/follow-up',
      payload
    ),

  // Get interview history
  getHistory: () =>
    axiosInstance.get('/ai/history'),

  getInterviewHistory: () =>
  axiosInstance.get("/interview/history"),

  saveSession: (data) =>
  axiosInstance.post('/interview/save-session', data),

  // Update interview score
  updateScore: (
    interviewId,
    score
  ) =>
    axiosInstance.patch(
      `/ai/interview/${interviewId}/score`,
      { score }
    ),

  // Save full interview session
  saveSession: (payload) =>
    axiosInstance.post(
      '/ai/save-session',
      payload
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

