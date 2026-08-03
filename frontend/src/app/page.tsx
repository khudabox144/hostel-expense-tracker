"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SummaryCards from "@/components/SummaryCards";
import BarChart from "@/components/BarChart";
import DonutChart from "@/components/DonutChart";
import { useExpenseSummary, useExpenses } from "@/hooks/useExpenses";
import { currentMonth, formatCurrency, formatDate, formatMonthLabel } from "@/lib/utils";

export default function DashboardPage() {
  const [month, setMonth] = useState(currentMonth());

  const { summary, loading: summaryLoading } = useExpenseSummary(month);
  const { expenses, loading: expensesLoading } = useExpenses({ month });

  const recentExpenses = useMemo(() => expenses.slice(0, 5), [expenses]);

  const memberChartData = useMemo(
    () =>
      (summary?.perMember ?? []).map((m) => ({
        label: m.memberName,
        value: m.total,
      })),
    [summary]
  );

  const categoryChartData = useMemo(
    () =>
      (summary?.perCategory ?? []).map((c) => ({
        label: c.categoryName,
        value: c.total,
      })),
    [summary]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-stone-800">Dashboard</h1>
          <p className="text-sm text-stone-400">{formatMonthLabel(month)} overview</p>
        </div>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400"
        />
      </div>

      <SummaryCards summary={summary} loading={summaryLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-soft border border-stone-100">
          <h2 className="text-sm font-semibold text-stone-700 mb-4">Spending by Member</h2>
          <BarChart data={memberChartData} emptyMessage="No expenses recorded this month" />
        </div>
        <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-soft border border-stone-100">
          <h2 className="text-sm font-semibold text-stone-700 mb-4">Category Breakdown</h2>
          <DonutChart data={categoryChartData} emptyMessage="No expenses recorded this month" />
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-soft border border-stone-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-stone-100">
          <h2 className="text-sm font-semibold text-stone-700">Recent Expenses</h2>
          <Link href="/expenses" className="text-xs font-medium text-amber-600 hover:text-amber-700">
            View all →
          </Link>
        </div>

        {expensesLoading && (
          <div className="p-6 space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-4 w-full animate-pulse rounded bg-stone-100" />
            ))}
          </div>
        )}

        {!expensesLoading && recentExpenses.length === 0 && (
          <div className="px-6 py-12 text-center text-sm text-stone-400">
            No expenses recorded yet for {formatMonthLabel(month)}.
          </div>
        )}

        {!expensesLoading && recentExpenses.length > 0 && (
          <ul className="divide-y divide-stone-50">
            {recentExpenses.map((e) => (
              <li key={e.id} className="flex items-center justify-between px-5 sm:px-6 py-3.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-stone-700 truncate">{e.itemName}</p>
                  <p className="text-xs text-stone-400">
                    {e.memberName} · {formatDate(e.purchaseDate)}
                  </p>
                </div>
                <span className="text-sm font-semibold text-stone-800 shrink-0 ml-4">
                  {formatCurrency(e.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
