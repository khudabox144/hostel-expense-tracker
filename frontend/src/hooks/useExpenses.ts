"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiRequestError } from "@/lib/api";
import type {
  Category,
  Expense,
  ExpenseSummary,
  Member,
} from "@/types";

interface ExpenseFilters {
  month?: string;
  memberId?: string;
  categoryId?: string;
}

function buildQuery(filters: ExpenseFilters): string {
  const params = new URLSearchParams();
  if (filters.month) params.set("month", filters.month);
  if (filters.memberId) params.set("memberId", filters.memberId);
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function useExpenses(filters: ExpenseFilters) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Expense[]>(`/expenses${buildQuery(filters)}`);
      setExpenses(data);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Failed to load expenses");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.month, filters.memberId, filters.categoryId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { expenses, loading, error, refetch };
}

export function useExpenseSummary(month?: string) {
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = month ? `?month=${month}` : "";
      const data = await api.get<ExpenseSummary>(`/expenses/summary${qs}`);
      setSummary(data);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Failed to load summary");
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { summary, loading, error, refetch };
}

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Member[]>("/members");
      setMembers(data);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Failed to load members");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { members, loading, error, refetch };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Category[]>("/categories")
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}
