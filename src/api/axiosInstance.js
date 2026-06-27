import axios from 'axios'

let onSessionExpired = null

export const registerSessionExpiredHandler = (handler) => {
  onSessionExpired = handler
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('aimock_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      if (onSessionExpired) {
        onSessionExpired()
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance