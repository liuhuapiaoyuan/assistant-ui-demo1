import { makeAssistantTool,  tool } from "@assistant-ui/react";
import { z } from "zod";
import { ToolCard } from "./ToolCard";



// Define the tool using the tool() helper
const submitForm = tool({
 description:"emailSend",
  parameters: z.object({
    email: z.string().email(),
    content: z.string(),
  }),
  execute: async ({ email, name }) => {
    // Implementation
    return { 
        success: true };
  },
});
 
// Create a tool component
export const SubmitFormTool = makeAssistantTool({
    ...submitForm,
    toolName:"emailSend",
    render({args,status,result}){
        return (
            <ToolCard
              toolName="发送邮件"
              status={status.type}
              simpleQuery={`发送到: ${args.email}`}
            >
              <div className="flex flex-col gap-2 divide-y-1 divide-input">
                <div>
                    发送内容:{args.content}
                </div>
                {result?.success ? "发送成功" : "发送失败"}
              </div>
            </ToolCard>
          );
    }
});
 
 