import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-20 w-full rounded-sm bg-surface-subtle px-3 py-2.5 text-sm text-fg shadow-[var(--shadow-border)]",
        "placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-40 resize-none",
        className,
      )}
      {...props}
    />
  );
}
