"use client";
import { Thread } from "@/components/assistant-ui/thread";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { AssistantRuntimeProvider, WebSpeechSynthesisAdapter } from "@assistant-ui/react";
import { ThreadList } from "@/components/assistant-ui/thread-list";
import { WeatherToolUI } from "@/components/tool-ui/Weather";
import { InputProvider } from "@/components/chat-input/input-context";
import {
  CompositeAttachmentAdapter,
} from "@assistant-ui/react";
import { Demo } from "@/components/demo";
import { CodeExecutorToolUI } from "@/components/tool-ui/CodeExecutor";
import { SimpleExcelAttachmentAdapter } from "../lib/SimpleExcelAttachmentAdapter";
const sttService = async (audioBlob: Blob) => {
  console.log("处理音频...", audioBlob);
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500));
  // Return mock transcription
  return "这是一个模拟的语音转文字结果";
};
export default function Home() {
  const runtime = useChatRuntime({
    api: "/api/chat/v2",
    adapters: {
      attachments: new CompositeAttachmentAdapter([
        new SimpleExcelAttachmentAdapter(),
      ]),
      speech: new WebSpeechSynthesisAdapter(),
    }, 
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <InputProvider sttService={sttService}>
        <main className="h-dvh flex">
          <ThreadList />
          <Thread />
          <WeatherToolUI />
          <CodeExecutorToolUI/>
          <Demo/>
        </main>
      </InputProvider>
      
    </AssistantRuntimeProvider>
  );
}
