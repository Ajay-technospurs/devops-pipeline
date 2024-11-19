import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, ...props }, ref) => {
    return (
      <div
        className={cn(
          "relative flex items-center w-full rounded border border-primary-foreground bg-transparent shadow-sm focus-within:ring-1 focus-within:ring-ring focus-within:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
      >
        {startIcon && (
          <span className="absolute left-3 flex items-center text-muted-foreground">
            {startIcon}
          </span>
        )}
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded bg-transparent px-3 py-1 text-base placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed md:text-sm",
            startIcon && "pl-10", // Adjust padding for the start icon
            endIcon && "pr-10" // Adjust padding for the end icon
          )}
          ref={ref}
          {...props}
        />
        {endIcon && (
          <span className="absolute right-3 flex items-center text-muted-foreground">
            {endIcon}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };

