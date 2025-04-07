"use client";

import type React from "react";

import {
  Mic,
  X,
  Type,
  CircleStopIcon,
  SendHorizontalIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ComposerPrimitive,
  ThreadPrimitive,
} from "@assistant-ui/react";
import { useInputContext } from "../chat-input/input-context";
import { TooltipIconButton } from "./tooltip-icon-button";
import { VoiceInput } from "../chat-input/voice-input";

import "../chat-input/index.css";
import { useEffect, useRef } from "react";


export const ThreadInput = () => {
  const { error, setError, inputMode, setInputMode } = useInputContext();
    const inputRef = useRef<HTMLTextAreaElement>(null)
  const toggleInputMode = () => {
    setInputMode(inputMode === "text" ? "voice" : "text");
  };
  useEffect(()=>{
    if (inputRef.current && inputMode === "text") {
      inputRef.current.focus();
    }
  },[inputMode])

  return (
    <>
      <button
        className={cn(
          "my-2.5 size-8 p-2 transition-all duration-200 ease-in-out",
          "text-muted-foreground hover:bg-muted hover:text-primary hover:scale-105 active:scale-95",
          "rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30"
        )}
        onClick={toggleInputMode}
        aria-label={`Switch to ${
          inputMode === "text" ? "voice" : "text"
        } input`}
        type="button"
      >
        {inputMode === "text" ? 
          <Mic size={18} className="transition-transform duration-200" /> : 
          <Type size={18} className="transition-transform duration-200" />}
      </button>

      {inputMode === "text" ? (
        <ComposerPrimitive.Input ref={inputRef}
          rows={1}
          placeholder="输入你的疑问"
          className="placeholder:text-muted-foreground flex-1 w-1 max-h-40 flex-grow resize-none border-none bg-transparent px-3 py-4 text-sm outline-none focus:ring-0 disabled:cursor-not-allowed transition-all duration-200 ease-in-out focus:placeholder:text-primary/50"
        />
      ) : (
        <VoiceInput />
      )}

      {error && (
        <div className="error-message absolute -top-10 left-0 right-0 bg-destructive/90 text-destructive-foreground text-sm py-2 px-4 rounded-md text-center">
          {error}
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {inputMode === "text" && (
        <ThreadPrimitive.If running={false}>
          <ComposerPrimitive.Send asChild>
            <TooltipIconButton
              tooltip="Send"
              variant="default"
              className="my-2.5 size-8 p-2 transition-opacity ease-in"
            >
              <SendHorizontalIcon />
            </TooltipIconButton>
          </ComposerPrimitive.Send>
        </ThreadPrimitive.If>
      )}
      <ThreadPrimitive.If running>
        <ComposerPrimitive.Cancel asChild>
          <TooltipIconButton
            tooltip="Cancel"
            variant="default"
            className="my-2.5 size-8 p-2 transition-opacity ease-in"
          >
            <CircleStopIcon />
          </TooltipIconButton>
        </ComposerPrimitive.Cancel>
      </ThreadPrimitive.If>
    </>
  );
};
