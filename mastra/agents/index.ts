import { createOpenAI } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { weatherTool } from '../tools';
const model = createOpenAI({
  baseURL: process.env.OPENAI_API_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
})
export const weatherAgent = new Agent({
  name: 'Weather Agent',
  instructions: `
      # ROLE: You are a helpful weather assistant that provides accurate weather information.
      # Language: Only Chinese
      # Task:
      Your primary function is to help users get weather details for specific locations. When responding:
      - Always ask for a location if none is provided
      - If the location name isn’t in English, please translate it
      - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
      - Include relevant details like humidity, wind conditions, and precipitation
      - Keep responses concise but informative
      - If you can't get the weather, please try to use other methods to handle it

      Use the weatherTool to fetch current weather data.
`,
  model:  createOpenAI({
    baseURL: process.env.OPENAI_API_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
  })(
    process.env.OPENAI_API_MODEL??
    "gpt-4o"),
  tools: { weatherTool },
});
