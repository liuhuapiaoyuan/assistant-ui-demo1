import { createOpenAI } from "@ai-sdk/openai";
import { jsonSchema, streamText } from "ai";
import { z } from "zod";

export const maxDuration = 30;


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


export async function POST(req: Request) {
  const { messages, tools } = await req.json();
  const uiTools =  Object.fromEntries(
    Object.keys(tools).map((name) => [
      name,
      { ...tools[name], parameters: jsonSchema(tools[name].parameters) },
    ])
  )
  const model = createOpenAI({
    baseURL: process.env.OPENAI_API_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
  })
  const result = streamText({
    model: model(
      process.env.OPENAI_API_MODEL??
      "gpt-4o"),
    messages,
    system:"You are a helpful assistant.你要尝试完成客户的问题，如果tool调用失败，你要尝试使用别的方法来处理",
    // 5步
    maxSteps:5,
    onError(error){
      console.log("调用失败了")
      console.log(error)
    },
    tools: {
      ...uiTools,
      "web_search":{
        description: "Search the web，如果检索失败，请你更换关键词来检索",
        parameters: jsonSchema({
          query: z.string().min(3).describe("搜索关键词"),
        }),
        execute: async (data:{query:string}) => {
          console.log("检索结果：" + data.query)
          await delay(1000 * 3)
          if(Math.random()<0.5){
            return [{id:1 , message:"很抱歉，没有结果"}]
          }
          return  [
            { id: 4, message: "今日气温21-34°，下雨天；请注意出行安全"  },
          ]
        },
      }
    }
    
    
  });

  return result.toDataStreamResponse();
}
