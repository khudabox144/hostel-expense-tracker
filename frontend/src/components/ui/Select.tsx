"use client";

import { SelectHTMLAttributes, forwardRef } from "react";
import { classNames } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-stone-700">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={classNames(
            "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-stone-800",
            "transition-colors appearance-none",
            "focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400",
            error ? "border-red-300" : "border-stone-200",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled={props.required}>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

export default Select;
