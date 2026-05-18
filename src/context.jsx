import { createContext, useContext } from 'react'

export const MindPrintContext = createContext(null)

export const useMindPrint = () => {
  const ctx = useContext(MindPrintContext)
  if (!ctx) throw new Error('useMindPrint must be used within MindPrintContext.Provider')
  return ctx
}
