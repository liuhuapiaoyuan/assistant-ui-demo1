import { makeAssistantToolUI } from "@assistant-ui/react";
import { ToolCard } from "./ToolCard";
import type { WeatherArgs, WeatherResponse } from "@/mastra/tools";

 

export const WeatherToolUI = makeAssistantToolUI<
WeatherArgs,
WeatherResponse
>({
  toolName: "weatherTool",
  render: ({ args, result, status }) => {
    return (
      <ToolCard
        toolName="天气工具"
        status={status.type}
        simpleQuery={`搜索: ${args.location}`}
      >
        <div className="flex flex-col gap-2 divide-y-1 divide-input">
          <div className="flex flex-col items-start gap-2">
            <div className="flex flex-col">
              <div className="text-lg font-bold">{result?.temperature} </div>
              <div className="text-sm opacity-50">Feels like {result?.feelsLike} </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                <span className="material-symbols-outlined text-lg">humidity</span>
                <span className="text-sm">{result?.humidity}%</span>
              </div>
              <div className="flex items-center">
                <span className="material-symbols-outlined text-lg">air</span>
                <span className="text-sm">{result?.windSpeed} m/s</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-lg">location_on</span>
              <span className="text-sm">{result?.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-lg">wb_sunny</span>
              <span className="text-sm">{result?.conditions}</span>
            </div>
          </div>
           
        </div>
      </ToolCard>
    );
     
  },
});
