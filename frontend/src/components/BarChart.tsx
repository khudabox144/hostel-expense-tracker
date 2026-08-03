"use client";

import { formatCurrency } from "@/lib/utils";

interface BarChartDatum {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarChartDatum[];
  emptyMessage?: string;
}

const COLORS = ["#f59e0b", "#10b981", "#fbbf24", "#34d399", "#d97706", "#059669"];

export default function BarChart({ data, emptyMessage = "No data yet" }: BarChartProps) {
  if (!data.length) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-stone-400">
        {emptyMessage}
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex h-56 items-end gap-3 px-1">
      {data.map((d, i) => {
        const heightPct = Math.max((d.value / max) * 100, 3);
        return (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-2 group">
            <div className="relative flex w-full flex-1 items-end justify-center">
              <span className="absolute -top-6 text-xs font-medium text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {formatCurrency(d.value)}
              </span>
              <div
                className="w-full max-w-10 rounded-t-lg transition-all duration-300"
                style={{
                  height: `${heightPct}%`,
                  backgroundColor: COLORS[i % COLORS.length],
                }}
              />
            </div>
            <span className="text-xs text-stone-500 truncate max-w-[4rem] text-center">
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
