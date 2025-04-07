import { createOpenAI } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { weatherTool } from '../tools';
import { codeExecutorTool } from '../tools/code-executor';
  
export const weatherAgent = new Agent({
  name: 'Common Agent',
  instructions: `
      # ROLE: 你是一名人类助手.
      # Language: Only Chinese
      # Task:
      - 如果用户给你的问题是关于天气的, 请使用 weatherTool 工具获取天气信息.
      - 如果用户给你时excel表格，你要尝试撰写python代码给用户
      - 如果用户给你的问题不是关于天气的, 请直接回答.

`,
  model:  createOpenAI({
    baseURL: process.env.OPENAI_API_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
  })(
    process.env.OPENAI_API_MODEL??
    "gpt-4o"),
  tools: { codeExecutorTool,weatherTool },
});
