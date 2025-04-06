"use client"

import { Mic, Type } from "lucide-react"
import { useInputContext } from "./input-context"
import { cn } from "@/lib/utils"

export const InputModeToggle = () => {
  const { inputMode, setInputMode } = useInputContext()

  // Handle input mode toggle
  const toggleInputMode = () => {
    setInputMode(inputMode === "text" ? "voice" : "text")
  }

  return (
    <button
      className={cn(
        "mode-toggle absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full",
        "text-muted-foreground hover:bg-muted transition-colors",
      )}
      onClick={toggleInputMode}
      aria-label={`切换到${inputMode === "text" ? "语音" : "文本"}输入`}
      type="button"
    >
      {inputMode === "text" ? <Mic size={18} /> : <Type size={18} />}
    </button>
  )
}

