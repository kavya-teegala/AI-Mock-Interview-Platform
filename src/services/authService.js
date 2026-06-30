export const interviewService = {
  // Generate interview questions
  generateQuestions: (payload) =>
    axiosInstance.post(
      '/ai/generate-questions',
      payload
    ),

  // Evaluate answer
  evaluateAnswer: (payload) =>
    axiosInstance.post(
      '/ai/evaluate-answer',
      payload
    ),

  // Save interview session
  saveSession: (payload) =>
    axiosInstance.post(
      '/interview/save-session',
      payload
    ),

  // History (old usage)
  getHistory: () =>
    axiosInstance.get(
      '/interview/history'
    ),

  // History (new usage)
  getInterviewHistory: () =>
    axiosInstance.get(
      '/interview/history'
    ),
}