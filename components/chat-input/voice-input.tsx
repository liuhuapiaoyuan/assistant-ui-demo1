import { cn } from "@/lib/utils";
import { useComposerRuntime } from "@assistant-ui/react";
import { Loader2, Mic } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { useInputContext } from "./input-context";
import { Waveform } from "./waveform";

export function VoiceInput() {
  const composerRuntime = useComposerRuntime();
  const {
    isProcessing,
    setIsProcessing,
    setError,
    sttService,
    userMediaOptions,
    setInputMode,
    inputMode,
  } = useInputContext();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const    startTime = useRef(0)

  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchMoveHandler = useRef<((e: TouchEvent) => void) | null>(null);
  const touchEndHandler = useRef<((e: TouchEvent) => void) | null>(null);
  const reason = useRef<"send"|"cancel">("send")
  // Clean up resources
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaStream.current) mediaStream.current.getTracks().forEach(t => t.stop());
      removeDocumentListeners();
    };
  }, []);

  const removeDocumentListeners = useCallback(() => {
    if (touchMoveHandler.current) {
      document.removeEventListener("touchmove", touchMoveHandler.current);
      touchMoveHandler.current = null;
    }
    if (touchEndHandler.current) {
      document.removeEventListener("touchend", touchEndHandler.current);
      touchEndHandler.current = null;
    }
  }, []);

  const initializeMedia = useCallback(async () => {
    try {
      if (mediaStream.current) return;
      mediaStream.current = await navigator.mediaDevices.getUserMedia(
        userMediaOptions || { audio: true }
      );
      setError(null);
    } catch (err) {
      setError("Microphone access denied");
      setInputMode("text");
    }
  }, [setError, setInputMode, userMediaOptions]);

  useEffect(() => {
    if (inputMode === "voice") initializeMedia();
  }, [inputMode, initializeMedia]);

  const stopRecording = useCallback((e: React.MouseEvent | React.TouchEvent | TouchEvent) => {
    e.preventDefault();
    removeDocumentListeners();
    reason.current = 'send';
    if (mediaRecorder.current?.state === "recording") {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    touchStartY.current = null;
  }, [removeDocumentListeners]);

  const cancelRecording = useCallback(() => {
    removeDocumentListeners();
    
    if (mediaRecorder.current?.state === "recording") {
      mediaRecorder.current.stop();
      audioChunks.current = [];
      reason.current = 'cancel';
      setIsRecording(false);
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    touchStartY.current = null;
  }, [removeDocumentListeners]);

  
  const startRecording = useCallback(async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation()
    reason.current="send"
    if (e.type === "touchstart") {
      const touch = (e as React.TouchEvent).touches[0];
      touchStartY.current = touch.clientY;
    }

    await initializeMedia();
    if (!mediaStream.current) return;

    setIsRecording(true);
    setRecordingDuration(0);
    audioChunks.current = [];

    // Setup media recorder
    mediaRecorder.current = new MediaRecorder(mediaStream.current);
    mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);
    mediaRecorder.current.onstop = async () => {
      console.log('reason.current',reason.current)
      if (recordingDuration > 0.5 && reason.current === 'send' &&  audioChunks.current.length > 0) {
        setIsProcessing(true);
        try {
          const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
          const text = await sttService(audioBlob);
          if (text.trim()) {
            composerRuntime.setText(text.trim());
            composerRuntime.send();
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Speech recognition failed");
        } finally {
          setIsProcessing(false);
        }
      }
    };

    mediaRecorder.current.start();
    startTime.current = Date.now();

    // Start timer
    timerRef.current = setInterval(() => setRecordingDuration((Date.now() - startTime.current)/1000), 100);

    // Add document listeners for touch devices
    if (e.type === "touchstart") {
      removeDocumentListeners();
      console.log("touchstart");  
      const handleTouchMove = (e: TouchEvent) => {
        console.log("正在移动了")
        if (!touchStartY.current) return;
        const touch = e.touches[0];
        const deltaY = touch.clientY - touchStartY.current;
        if (deltaY < -50) {
          e.preventDefault();
          cancelRecording();
        }
      };

      const handleTouchEnd = (e: TouchEvent) => {
        e.preventDefault();
        stopRecording(e);
      };

      touchMoveHandler.current = handleTouchMove;
      touchEndHandler.current = handleTouchEnd;

      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    }
  }, [initializeMedia,  setIsProcessing, sttService, composerRuntime, setError, removeDocumentListeners, cancelRecording, stopRecording]);

  return (
    <>
      <div
        className={cn(
          "voice-recorder flex-1  h-full flex items-center w-1 justify-center text-center select-none rounded-md transition-colors",
          isRecording ? "text-destructive" : "text-muted-foreground",
          isProcessing && "opacity-50"
        )}
        onTouchStart={!isProcessing ? startRecording : undefined}
        onMouseDown={!isProcessing ? startRecording : undefined}
        onMouseUp={!isProcessing ? stopRecording : undefined}
        role="button"
        aria-label={isRecording ? "Release to finish recording" : "Press to record"}
        tabIndex={0}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            <span>转换中...</span>
          </div>
        ) : isRecording ? (
          <>
            <div className="text-sm">
              <span className="hidden md:block">听写中... </span>
              {recordingDuration.toFixed(1)}s
            </div>
            <div className="flex-1 w-1">
              <Waveform type="bars" className="mt-2 h-10" />
            </div>
            <div className="text-xs text-muted-foreground">向上滑动取消</div>
          </>
        ) : (
          <div className="flex items-center justify-center select-none gap-2">
            <Mic size={16} />
            <span>按住说话</span>
          </div>
        )}
      </div>
    </>
  );
}