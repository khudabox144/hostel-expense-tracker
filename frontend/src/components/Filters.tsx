"use client";

import Select from "@/components/ui/Select";
import type { Category, Member } from "@/types";

interface FiltersProps {
  month: string;
  onMonthChange: (value: string) => void;
  memberId: string;
  onMemberChange: (value: string) => void;
  categoryId: string;
  onCategoryChange: (value: string) => void;
  members: Member[];
  categories: Category[];
}

export default function Filters({
  month,
  onMonthChange,
  memberId,
  onMemberChange,
  categoryId,
  onCategoryChange,
  members,
  categories,
}: FiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="month-filter" className="text-sm font-medium text-stone-700">
          Month
        </label>
        <input
          id="month-filter"
          type="month"
          value={month}
          onChange={(e) => onMonthChange(e.target.value)}
          className="rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400"
        />
      </div>

      <Select
        label="Member"
        value={memberId}
        onChange={(e) => onMemberChange(e.target.value)}
        options={members.map((m) => ({ value: String(m.id), label: m.name }))}
        placeholder="All members"
      />

      <Select
        label="Category"
        value={categoryId}
        onChange={(e) => onCategoryChange(e.target.value)}
        options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
        placeholder="All categories"
      />
    </div>
  );
}
