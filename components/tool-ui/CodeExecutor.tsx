import { makeAssistantToolUI } from "@assistant-ui/react";
import { ToolCard } from "./ToolCard";
import type {
  CodeExecutorArgs,
  CodeExecutorResponse,
} from "@/mastra/tools/code-executor";

export const CodeExecutorToolUI = makeAssistantToolUI<
  CodeExecutorArgs,
  CodeExecutorResponse
>({
  toolName: "codeExecutorTool",
  render: ({ args, result, status, toolCallId }) => {
    if (status.type === "complete") {
      console.log("result", toolCallId, "执行成功");
    }
    return (
      <ToolCard toolName="正在执行python脚本" status={status.type} simpleQuery={``}>
        <div className="flex flex-col gap-2 divide-y-1 divide-input">
          <div className="flex flex-col items-start gap-2">
            <div className="flex flex-col">
              <div>本次处理的列</div>
              <code className="text-lg font-bold">{args.columns?.join(",")} </code>
            </div>
            <div className="flex flex-col">
              <code className="text-lg font-bold">{result?.script} </code>
            </div>
          </div>
        </div>
      </ToolCard>
    );
  },
});
