import { createContext, useCallback, useMemo, useState } from 'react'

export const ToastContext = createContext(null)

// App-wide toast queue. Any component calls useToast().push(...) —
// the actual rendering lives once in <ToastViewport />, avoiding
// duplicated portal/animation logic per page.
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    ({ title, description, variant = 'default', duration = 4000 }) => {
      const id = crypto.randomUUID()
      setToasts((prev) => [...prev, { id, title, description, variant }])
      if (duration) setTimeout(() => dismiss(id), duration)
      return id
    },
    [dismiss]
  )

  const value = useMemo(() => ({ toasts, push, dismiss }), [toasts, push, dismiss])

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}
