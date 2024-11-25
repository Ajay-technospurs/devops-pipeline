import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

export function InfoTooltip({content}:{content:React.ReactNode}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
         <InfoIcon size={10} className="foreground" />
        </TooltipTrigger>
        <TooltipContent className="text-sm bg-primary/30">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
