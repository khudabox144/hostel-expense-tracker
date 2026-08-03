"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Filters from "@/components/Filters";
import ExpenseTable from "@/components/ExpenseTable";
import ExpenseModal from "@/components/ExpenseModal";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useCategories, useExpenses, useMembers } from "@/hooks/useExpenses";
import { api, ApiRequestError } from "@/lib/api";
import { currentMonth } from "@/lib/utils";
import type { Expense, ExpenseFormValues } from "@/types";

export default function ExpensesPage() {
  const [month, setMonth] = useState(currentMonth());
  const [memberId, setMemberId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const { showToast } = useToast();
  const { members } = useMembers();
  const { categories } = useCategories();
  const { expenses, loading, refetch } = useExpenses({ month, memberId, categoryId });

  const openAddModal = () => {
    setEditingExpense(null);
    setModalOpen(true);
  };

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setModalOpen(true);
  };

  const handleSubmit = async (values: ExpenseFormValues) => {
    const payload = {
      memberId: Number(values.memberId),
      categoryId: Number(values.categoryId),
      itemName: values.itemName,
      amount: Number(values.amount),
      purchaseDate: values.purchaseDate,
      notes: values.notes || undefined,
    };

    try {
      if (editingExpense) {
        await api.put(`/expenses/${editingExpense.id}`, payload);
        showToast("Expense updated", "success");
      } else {
        await api.post("/expenses", payload);
        showToast("Expense added", "success");
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Failed to save expense", "error");
    }
  };

  const handleDelete = async (expense: Expense) => {
    try {
      await api.delete(`/expenses/${expense.id}`);
      showToast("Expense deleted", "success");
      refetch();
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Failed to delete expense", "error");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-stone-800">Expenses</h1>
          <p className="text-sm text-stone-400">Every purchase logged by the hostel</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus size={16} />
          Add Expense
        </Button>
      </div>

      <div className="rounded-2xl bg-white p-4 sm:p-5 shadow-soft border border-stone-100">
        <Filters
          month={month}
          onMonthChange={setMonth}
          memberId={memberId}
          onMemberChange={setMemberId}
          categoryId={categoryId}
          onCategoryChange={setCategoryId}
          members={members}
          categories={categories}
        />
      </div>

      <ExpenseTable
        expenses={expenses}
        loading={loading}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      <ExpenseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        members={members}
        categories={categories}
        initialExpense={editingExpense}
      />
    </div>
  );
}
