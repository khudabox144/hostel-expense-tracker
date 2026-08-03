"use client";

import { Wallet, Users, Trophy, Tag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { ExpenseSummary } from "@/types";

interface SummaryCardsProps {
  summary: ExpenseSummary | null;
  loading: boolean;
}

function Card({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft border border-stone-100">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium text-stone-400">{label}</p>
          <p className="text-lg font-semibold text-stone-800">{value}</p>
        </div>
      </div>
      {sub && <p className="mt-2 text-xs text-stone-400">{sub}</p>}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft border border-stone-100 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-stone-100" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-20 rounded bg-stone-100" />
          <div className="h-4 w-16 rounded bg-stone-100" />
        </div>
      </div>
    </div>
  );
}

export default function SummaryCards({ summary, loading }: SummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const topSpender = summary?.perMember?.[0];
  const topCategory = summary?.perCategory?.[0];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        icon={<Wallet size={18} className="text-amber-600" />}
        accent="bg-amber-50"
        label="Total Spent This Month"
        value={formatCurrency(summary?.totalAmount ?? 0)}
      />
      <Card
        icon={<Users size={18} className="text-emerald-600" />}
        accent="bg-emerald-50"
        label="Average Per Person"
        value={formatCurrency(summary?.averagePerMember ?? 0)}
      />
      <Card
        icon={<Trophy size={18} className="text-amber-600" />}
        accent="bg-amber-50"
        label="Top Spender"
        value={topSpender ? topSpender.memberName : "—"}
        sub={topSpender ? formatCurrency(topSpender.total) : undefined}
      />
      <Card
        icon={<Tag size={18} className="text-emerald-600" />}
        accent="bg-emerald-50"
        label="Most Bought Category"
        value={topCategory ? topCategory.categoryName : "—"}
        sub={topCategory ? `${topCategory.count} purchase${topCategory.count === 1 ? "" : "s"}` : undefined}
      />
    </div>
  );
}
