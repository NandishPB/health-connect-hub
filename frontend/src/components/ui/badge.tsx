import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-sm",
        outline: 
          "border-current text-foreground",
        success:
          "border-transparent bg-success text-success-foreground shadow-sm",
        warning:
          "border-transparent bg-warning text-warning-foreground shadow-sm",
        info:
          "border-transparent bg-info text-info-foreground shadow-sm",
        "blood-a-pos": "border-transparent bg-red-500 text-white",
        "blood-a-neg": "border-transparent bg-red-600 text-white",
        "blood-b-pos": "border-transparent bg-blue-500 text-white",
        "blood-b-neg": "border-transparent bg-blue-600 text-white",
        "blood-ab-pos": "border-transparent bg-purple-500 text-white",
        "blood-ab-neg": "border-transparent bg-purple-600 text-white",
        "blood-o-pos": "border-transparent bg-green-500 text-white",
        "blood-o-neg": "border-transparent bg-green-600 text-white",
        available: "border-transparent bg-success/10 text-success",
        unavailable: "border-transparent bg-muted text-muted-foreground",
        pending: "border-transparent bg-warning/10 text-warning",
        active: "border-transparent bg-info/10 text-info",
        fulfilled: "border-transparent bg-success/10 text-success",
        cancelled: "border-transparent bg-destructive/10 text-destructive",
        critical: "border-transparent bg-destructive text-destructive-foreground animate-pulse",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
