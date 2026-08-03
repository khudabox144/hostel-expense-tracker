"use client";

import { useState } from "react";
import { Pencil, Trash2, Receipt } from "lucide-react";
import { formatCurrency, formatDate, classNames } from "@/lib/utils";
import type { Expense } from "@/types";

interface ExpenseTableProps {
  expenses: Expense[];
  loading: boolean;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

const categoryColors: Record<string, string> = {
  Food: "bg-amber-50 text-amber-700",
  Utilities: "bg-emerald-50 text-emerald-700",
  Cleaning: "bg-sky-50 text-sky-700",
  Maintenance: "bg-rose-50 text-rose-700",
  Others: "bg-stone-100 text-stone-600",
};

function CategoryBadge({ name }: { name: string }) {
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        categoryColors[name] || "bg-stone-100 text-stone-600"
      )}
    >
      {name}
    </span>
  );
}

function RowSkeleton() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-3.5 w-full max-w-24 rounded bg-stone-100" />
        </td>
      ))}
    </tr>
  );
}

export default function ExpenseTable({ expenses, loading, onEdit, onDelete }: ExpenseTableProps) {
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const confirmingExpense = expenses.find((e) => e.id === confirmId);

  return (
    <div className="rounded-2xl bg-white border border-stone-100 shadow-soft overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone-100 text-xs uppercase tracking-wide text-stone-400">
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Member</th>
              <th className="px-4 py-3 font-medium">Item</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {loading &&
              Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)}

            {!loading && expenses.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-16">
                  <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
                      <Receipt size={22} className="text-amber-500" />
                    </div>
                    <p className="text-sm font-medium text-stone-600">No expenses yet</p>
                    <p className="text-xs text-stone-400 max-w-xs">
                      Add your first expense to start tracking the hostel&apos;s monthly spending.
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {!loading &&
              expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="px-4 py-3.5 text-stone-500 whitespace-nowrap">
                    {formatDate(expense.purchaseDate)}
                  </td>
                  <td className="px-4 py-3.5 font-medium text-stone-700 whitespace-nowrap">
                    {expense.memberName}
                  </td>
                  <td className="px-4 py-3.5 text-stone-600">
                    <div>{expense.itemName}</div>
                    {expense.notes && (
                      <div className="text-xs text-stone-400 truncate max-w-xs">{expense.notes}</div>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <CategoryBadge name={expense.categoryName} />
                  </td>
                  <td className="px-4 py-3.5 text-right font-semibold text-stone-800 whitespace-nowrap">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => onEdit(expense)}
                        className="rounded-lg p-1.5 text-stone-400 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                        aria-label="Edit expense"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setConfirmId(expense.id)}
                        className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        aria-label="Delete expense"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {confirmingExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
            onClick={() => setConfirmId(null)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-card">
            <h4 className="text-base font-semibold text-stone-800">Delete this expense?</h4>
            <p className="mt-1.5 text-sm text-stone-500">
              &ldquo;{confirmingExpense.itemName}&rdquo; ({formatCurrency(confirmingExpense.amount)}) will be
              permanently removed. This can&apos;t be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setConfirmId(null)}
                className="rounded-xl px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(confirmingExpense);
                  setConfirmId(null);
                }}
                className="rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
