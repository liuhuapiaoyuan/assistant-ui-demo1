"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type InputMode = "text" | "voice"

interface InputContextType {
  // STT service
  sttService: (audioBlob: Blob) => Promise<string>
  userMediaOptions?: MediaStreamConstraints 

  // Input state
  inputMode: InputMode
  setInputMode: (mode: InputMode) => void

  // Error handling
  error: string | null
  setError: (error: string | null) => void

  // Processing state
  isProcessing: boolean
  setIsProcessing: (isProcessing: boolean) => void
}

const InputContext = createContext<InputContextType>({
  // Default values
  sttService: async () => {
    throw new Error("语音转文本服务未实现")
  },
  userMediaOptions: { audio: true },

  inputMode: "text",
  setInputMode: () => {},

  error: null,
  setError: () => {},

  isProcessing: false,
  setIsProcessing: () => {},
})

export const useInputContext = () => useContext(InputContext)

interface InputProviderProps {
  children: ReactNode
  sttService: (audioBlob: Blob) => Promise<string>
  userMediaOptions?: MediaStreamConstraints
  initialInputMode?: InputMode
}

export const InputProvider = ({
  children,
  sttService,
  userMediaOptions,
  initialInputMode = "text",
}: InputProviderProps) => {
  // Input state
  const [inputMode, setInputMode] = useState<InputMode>(initialInputMode)

  // Error and processing state
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  return (
    <InputContext.Provider
      value={{
        sttService,
        userMediaOptions,

        inputMode,
        setInputMode,

        error,
        setError,

        isProcessing,
        setIsProcessing,
      }}
    >
      {children}
    </InputContext.Provider>
  )
}

export { InputContext }

