import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none";

        const variants = {
            primary: "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]",
            secondary: "bg-[var(--secondary)] text-white hover:opacity-90",
            outline: "border border-[var(--border)] bg-transparent hover:bg-[var(--background)]",
            ghost: "hover:bg-[var(--background)] text-[var(--text-main)]",
        };

        const sizes = {
            sm: "h-8 px-3 text-xs",
            md: "h-10 px-4 py-2 text-sm",
            lg: "h-12 px-8 text-base",
        };

        const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ""}`;

        return (
            <button ref={ref} className={combinedClasses} {...props} />
        );
    }
);

Button.displayName = "Button";
