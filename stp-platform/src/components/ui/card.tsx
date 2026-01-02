import { HTMLAttributes, forwardRef } from "react";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={`rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-sm ${className || ""}`}
            {...props}
        />
    )
);
Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={`flex flex-col space-y-1.5 p-6 ${className || ""}`}
            {...props}
        />
    )
);
CardHeader.displayName = "CardHeader";

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={`p-6 pt-0 ${className || ""}`} {...props} />
    )
);
CardContent.displayName = "CardContent";
