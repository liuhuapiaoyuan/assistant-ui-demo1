import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

 

const WeatherResponseZod = z.object({
  temperature: z.number(),
  feelsLike: z.number(),
  humidity: z.number(),
  windSpeed: z.number(),
  windGust: z.number(),
  conditions: z.string(),
  location: z.string(),
});

export type WeatherResponse = z.infer<typeof WeatherResponseZod>;
export type WeatherArgs = {
  location:string
}
export const weatherTool = createTool({
  id: 'get-weather',
  description: 'Get current weather for a location',
  inputSchema: z.object({
    location: z.string().describe('City name'),
  }),
  outputSchema: WeatherResponseZod,
  execute: async ({ context }) => {
    return await getWeather(context.location);
  },
});

const getWeather = async (location: string) => {
  await delay(1000 * 3)
  return {
    temperature: 25,
    feelsLike: 28,
    humidity: 50,
    windSpeed: 5,
    windGust: 10,
    conditions: 'Sunny',
    location: location,
  };
};

function delay(arg0: number) {
  return new Promise((resolve) => setTimeout(resolve, arg0));
}

