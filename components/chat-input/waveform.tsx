"use client"

import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface WaveformProps {
  type?: "bars" | "wave" | "pulse"
  className?: string
}

export const Waveform = ({ type = "wave", className }: WaveformProps) => {
  const waveformRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    if (!waveformRef.current || type !== "bars") return

    const waveform = waveformRef.current
    waveform.innerHTML = ""

    // 创建波形条
    for (let i = 0; i < 20; i++) {
      const bar = document.createElement("div")
      bar.className = "waveform-bar"
      bar.style.animationDelay = `${i * 0.05}s`
      waveform.appendChild(bar)
    }

    // 清理函数
    return () => {
      if (waveformRef.current) {
        waveformRef.current.innerHTML = ""
      }
    }
  }, [type])

  if (type === "bars") {
    return <div ref={waveformRef} className={cn("waveform-container", className)} aria-hidden="true" />
  }

  if (type === "pulse") {
    return (
      <div className={cn("pulse-container", className)} aria-hidden="true">
        <div className="pulse-circle">
          <div className="pulse-inner" />
        </div>
      </div>
    )
  }

  // 默认波浪线类型
  return (
    <div className={cn("wave", className)} aria-hidden="true">
      <svg className="wave-svg" viewBox="0 0 200 30" preserveAspectRatio="none">
        <path
          className="wave-path"
          stroke="currentColor"
          strokeDasharray="100"
          d="M0,15 C20,5 40,25 60,15 C80,5 100,25 120,15 C140,5 160,25 180,15 C200,5 220,25 240,15"
        />
        <path
          className="wave-path"
          stroke="currentColor"
          strokeDasharray="100"
          strokeDashoffset="50"
          d="M0,15 C20,25 40,5 60,15 C80,25 100,5 120,15 C140,25 160,5 180,15 C200,25 220,5 240,15"
          style={{ animationDelay: "0.5s" }}
        />
      </svg>
    </div>
  )
}

