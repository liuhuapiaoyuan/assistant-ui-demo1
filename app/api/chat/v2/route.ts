import { mastra } from "@/mastra";

export const maxDuration = 30;


export async function POST(req: Request) {
  const { messages } = await req.json();
  const weatherAgent = mastra.getAgent("weatherAgent");
  const result = await weatherAgent.stream(messages,{
    onError(error){
      console.log("调用失败了")
      console.log(error)
    }
  })
  return result.toDataStreamResponse();
}
