"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { classNames } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-stone-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={classNames(
            "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-stone-800",
            "placeholder:text-stone-400 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400",
            error ? "border-red-300" : "border-stone-200",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export default Input;
