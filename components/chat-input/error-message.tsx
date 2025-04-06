"use client"

import { X } from "lucide-react"
import { useInputContext } from "./input-context"

interface ErrorMessageProps {
  message: string
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  const { setError } = useInputContext()

  return (
    <div className="error-message absolute -top-10 left-0 right-0 bg-destructive/90 text-destructive-foreground text-sm py-2 px-4 rounded-md text-center">
      {message}
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2"
        onClick={() => setError(null)}
        aria-label="关闭错误提示"
      >
        <X size={14} />
      </button>
    </div>
  )
}

