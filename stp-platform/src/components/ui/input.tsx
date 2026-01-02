import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, label, id, ...props }, ref) => {
        return (
            <div className="w-full space-y-1">
                {label && (
                    <label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {label}
                    </label>
                )}
                <input
                    id={id}
                    ref={ref}
                    className={`flex h-10 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50 ${error ? "border-[var(--error)] focus-visible:ring-[var(--error)]" : ""
                        } ${className || ""}`}
                    {...props}
                />
                {error && <p className="text-xs text-[var(--error)]">{error}</p>}
            </div>
        );
    }
);

Input.displayName = "Input";
