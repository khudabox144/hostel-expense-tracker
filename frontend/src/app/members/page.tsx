"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import MemberTable from "@/components/MemberTable";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useMembers } from "@/hooks/useExpenses";
import { api, ApiRequestError } from "@/lib/api";
import type { Member } from "@/types";

export default function MembersPage() {
  const [name, setName] = useState("");
  const [joinDate, setJoinDate] = useState(new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { showToast } = useToast();
  const { members, loading, refetch } = useMembers();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await api.post("/members", { name: name.trim(), joinDate });
      showToast("Member added", "success");
      setName("");
      setJoinDate(new Date().toISOString().slice(0, 10));
      refetch();
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Failed to add member", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (member: Member) => {
    try {
      await api.delete(`/members/${member.id}`);
      showToast("Member removed", "success");
      refetch();
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : "Failed to remove member", "error");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-stone-800">Members</h1>
        <p className="text-sm text-stone-400">Everyone sharing the hostel expenses</p>
      </div>

      <form
        onSubmit={handleAdd}
        className="rounded-2xl bg-white p-4 sm:p-5 shadow-soft border border-stone-100 flex flex-col sm:flex-row sm:items-end gap-3"
      >
        <div className="flex-1">
          <Input
            label="Name"
            placeholder="e.g. Ayesha Rahman"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={error ?? undefined}
          />
        </div>
        <div>
          <Input
            label="Join date"
            type="date"
            value={joinDate}
            onChange={(e) => setJoinDate(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={submitting}>
          <UserPlus size={16} />
          {submitting ? "Adding…" : "Add Member"}
        </Button>
      </form>

      <MemberTable members={members} loading={loading} onDelete={handleDelete} />
    </div>
  );
}
