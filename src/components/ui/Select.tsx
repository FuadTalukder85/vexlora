import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
  leftIcon?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      leftIcon,
      id,
      children,
      ...props
    },
    ref
  ) => {
    const selectId =
      id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-primary tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-secondary">
              {leftIcon}
            </div>
          )}
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "w-full h-10 rounded-xl border border-border bg-white px-3.5 pr-9 text-sm text-primary appearance-none transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-75 cursor-pointer",
              leftIcon && "pl-10",
              error && "border-highlight focus:border-highlight focus:ring-rose-500/10",
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="absolute right-3.5 flex items-center pointer-events-none text-secondary">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error ? (
          <p className="text-xs text-highlight font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-secondary font-medium">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
