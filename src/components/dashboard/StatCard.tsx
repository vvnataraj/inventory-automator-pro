
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  name: string;
  value: string;
  change: string;
  icon: LucideIcon;
  link: string | null;
  subValue?: string | null;
  tooltipContent?: string;
  onClick: (link: string | null) => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  name,
  value,
  change,
  icon: Icon,
  link,
  subValue,
  tooltipContent,
  onClick,
}) => {
  const card = (
    <Card 
      className={`animate-fade-in ${link ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={() => onClick(link)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {name}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            <span
              className={
                change.startsWith("+")
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {change}
            </span>{" "}
            from last month
          </p>
          {subValue && (
            <div className="text-xs font-medium">
              <span className="text-muted-foreground">RRP: </span>
              <span className="text-green-600">{subValue}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (tooltipContent) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {card}
          </TooltipTrigger>
          <TooltipContent className="bg-slate-950 text-white dark:bg-slate-50 dark:text-slate-950">
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return card;
};
