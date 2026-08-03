"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import type { Category, Expense, ExpenseFormValues, Member } from "@/types";

interface ExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ExpenseFormValues) => Promise<void>;
  members: Member[];
  categories: Category[];
  initialExpense?: Expense | null;
}

const emptyValues: ExpenseFormValues = {
  memberId: "",
  categoryId: "",
  itemName: "",
  amount: "",
  purchaseDate: new Date().toISOString().slice(0, 10),
  notes: "",
};

export default function ExpenseModal({
  open,
  onClose,
  onSubmit,
  members,
  categories,
  initialExpense,
}: ExpenseModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormValues>({ defaultValues: emptyValues });

  useEffect(() => {
    if (open) {
      reset(
        initialExpense
          ? {
              memberId: String(initialExpense.memberId),
              categoryId: String(initialExpense.categoryId),
              itemName: initialExpense.itemName,
              amount: String(initialExpense.amount),
              purchaseDate: initialExpense.purchaseDate,
              notes: initialExpense.notes ?? "",
            }
          : emptyValues
      );
    }
  }, [open, initialExpense, reset]);

  const submit = async (values: ExpenseFormValues) => {
    await onSubmit(values);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialExpense ? "Edit Expense" : "Add Expense"}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="expense-form" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : initialExpense ? "Save changes" : "Add expense"}
          </Button>
        </>
      }
    >
      <form id="expense-form" onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
        <Select
          label="Member"
          placeholder="Select a member"
          required
          options={members.map((m) => ({ value: String(m.id), label: m.name }))}
          error={errors.memberId?.message}
          {...register("memberId", { required: "Please select a member" })}
        />

        <Select
          label="Category"
          placeholder="Select a category"
          required
          options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
          error={errors.categoryId?.message}
          {...register("categoryId", { required: "Please select a category" })}
        />

        <Input
          label="Item name"
          placeholder="e.g. Rice, 5kg"
          error={errors.itemName?.message}
          {...register("itemName", { required: "Item name is required" })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            error={errors.amount?.message}
            {...register("amount", {
              required: "Amount is required",
              min: { value: 0.01, message: "Must be greater than 0" },
            })}
          />
          <Input
            label="Purchase date"
            type="date"
            error={errors.purchaseDate?.message}
            {...register("purchaseDate", { required: "Date is required" })}
          />
        </div>

        <Input
          label="Notes (optional)"
          placeholder="Any additional details"
          {...register("notes")}
        />
      </form>
    </Modal>
  );
}
