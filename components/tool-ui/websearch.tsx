import { makeAssistantToolUI } from "@assistant-ui/react";
import { ToolCard } from "./ToolCard";

type WebSearchArgs = {
  query: string;
};

type WebSearchResult = Array<{
  id: string;
  message: string;
}>;

export const WebSearchToolUI = makeAssistantToolUI<
  WebSearchArgs,
  WebSearchResult
>({
  toolName: "web_search",
  render: ({ args, result, status }) => {
    return (
      <ToolCard
        toolName="网络搜索工具"
        status={status.type}
        simpleQuery={`搜索: ${args.query}`}
      >
        <div className="flex flex-col gap-2 divide-y-1 divide-input">
          {result?.map((item) => {
            return (
              <div key={item.id}>
                <div>{item.message}</div>
              </div>
            );
          })}
        </div>
      </ToolCard>
    );
     
  },
});
