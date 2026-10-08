import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "highlight";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-sm active:scale-[0.98] select-none";

    const variants = {
      primary:
        "bg-primary text-white hover:bg-primary/90 focus:ring-primary",
      secondary:
        "bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary",
      outline:
        "border border-border bg-white text-primary hover:bg-muted focus:ring-secondary",
      ghost:
        "bg-transparent text-secondary hover:text-primary hover:bg-muted focus:ring-slate-300 shadow-none",
      danger:
        "bg-highlight text-white hover:opacity-90 focus:ring-highlight",
      highlight:
        "bg-highlight text-white hover:bg-highlight/90 focus:ring-highlight",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs font-medium gap-1.5 rounded-lg",
      md: "h-10 px-4 text-sm font-medium gap-2 rounded-xl",
      lg: "h-12 px-6 text-base font-semibold gap-2.5 rounded-xl",
      icon: "h-10 w-10 p-0 rounded-xl",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
