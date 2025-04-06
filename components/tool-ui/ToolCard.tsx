import { CheckCheckIcon, Loader2 } from "lucide-react";
import { PropsWithChildren } from "react";

export interface ToolCardProps {
  toolName: string;
  status:"running" | "complete" | "incomplete" | "requires-action";
  simpleQuery: string;
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const ToolCard = ({
  toolName,
  status,
  simpleQuery,
  children,
}: PropsWithChildren<ToolCardProps>) => {
  return (
    <div className="flex mb-2 flex-col shadow overflow-hidden rounded-md border border-input">
      <div className="flex bg-gray-50 hover:bg-gray-100 cursor-pointer items-center gap-2 p-2 border-input border-b-[1px]">
        {status === "running" && <Loader2 className="size-4 animate-spin" />}
        {status === "complete" && (
          <CheckCheckIcon className="size-4 text-green-500" />
        )}
        <div>
          {toolName}
        </div>
        <div>
        {simpleQuery}
        </div>
      </div>
      {status === "complete" && <div className="p-2">{children}</div>}
    </div>
  );
};
