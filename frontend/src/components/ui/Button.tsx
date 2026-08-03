"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { classNames } from "@/lib/utils";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-300 shadow-soft",
  secondary:
    "bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 focus-visible:ring-stone-200",
  danger:
    "bg-red-50 text-red-600 hover:bg-red-100 focus-visible:ring-red-200",
  ghost:
    "bg-transparent text-stone-600 hover:bg-stone-100 focus-visible:ring-stone-200",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2.5 text-sm rounded-xl",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={classNames(
          "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export default Button;
