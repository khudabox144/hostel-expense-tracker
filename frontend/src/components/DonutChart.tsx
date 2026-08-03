"use client";

import { formatCurrency } from "@/lib/utils";

interface DonutDatum {
  label: string;
  value: number;
}

interface DonutChartProps {
  data: DonutDatum[];
  emptyMessage?: string;
}

const COLORS = ["#f59e0b", "#10b981", "#fbbf24", "#34d399", "#d97706", "#059669"];

export default function DonutChart({ data, emptyMessage = "No data yet" }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (!data.length || total === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-stone-400">
        {emptyMessage}
      </div>
    );
  }

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offsetAcc = 0;

  const segments = data.map((d, i) => {
    const fraction = d.value / total;
    const dash = fraction * circumference;
    const segment = {
      color: COLORS[i % COLORS.length],
      dashArray: `${dash} ${circumference - dash}`,
      dashOffset: -offsetAcc,
      label: d.label,
      value: d.value,
      pct: Math.round(fraction * 100),
    };
    offsetAcc += dash;
    return segment;
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <svg viewBox="0 0 160 160" className="h-40 w-40 shrink-0 -rotate-90">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#f5f5f4" strokeWidth="20" />
        {segments.map((s) => (
          <circle
            key={s.label}
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={s.color}
            strokeWidth="20"
            strokeDasharray={s.dashArray}
            strokeDashoffset={s.dashOffset}
            strokeLinecap="butt"
            className="transition-all duration-300"
          />
        ))}
      </svg>
      <div className="flex flex-1 flex-col gap-2 w-full">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="truncate text-stone-600">{s.label}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-stone-400 text-xs">{s.pct}%</span>
              <span className="font-medium text-stone-700">{formatCurrency(s.value)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
