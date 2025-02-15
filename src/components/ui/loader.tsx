import React from "react";

export function Loader({ size = "md" ,color}: { size?: "sm" | "md" | "lg",color?:string }) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-4",
    lg: "h-8 w-8 border-4",
  };

  return (
    <div
      className={`animate-spin rounded-full border-t-transparent ${color?color:'border-primary'} ${sizes[size]}`}
    />
  );
}
