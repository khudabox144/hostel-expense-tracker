"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { classNames } from "@/lib/utils";
import type { ToastMessage, ToastType } from "@/types";

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const iconMap: Record<ToastType, ReactNode> = {
  success: <CheckCircle2 size={18} className="text-emerald-500" />,
  error: <XCircle size={18} className="text-red-500" />,
  info: <Info size={18} className="text-amber-500" />,
};

const borderMap: Record<ToastType, string> = {
  success: "border-emerald-100",
  error: "border-red-100",
  info: "border-amber-100",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={classNames(
              "flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-card animate-[fadeIn_0.2s_ease-out]",
              borderMap[t.type]
            )}
          >
            {iconMap[t.type]}
            <p className="flex-1 text-sm text-stone-700">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="text-stone-300 hover:text-stone-500"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
