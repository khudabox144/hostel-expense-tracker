"use client";

import { useState } from "react";
import { Trash2, UserRound } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Member } from "@/types";

interface MemberTableProps {
  members: Member[];
  loading: boolean;
  onDelete: (member: Member) => void;
}

function RowSkeleton() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-3.5 w-24 rounded bg-stone-100" />
        </td>
      ))}
    </tr>
  );
}

export default function MemberTable({ members, loading, onDelete }: MemberTableProps) {
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const confirmingMember = members.find((m) => m.id === confirmId);

  return (
    <div className="rounded-2xl bg-white border border-stone-100 shadow-soft overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone-100 text-xs uppercase tracking-wide text-stone-400">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {loading && Array.from({ length: 4 }).map((_, i) => <RowSkeleton key={i} />)}

            {!loading && members.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-16">
                  <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                      <UserRound size={22} className="text-emerald-500" />
                    </div>
                    <p className="text-sm font-medium text-stone-600">No members yet</p>
                    <p className="text-xs text-stone-400 max-w-xs">
                      Add hostel members so you can start tracking who spent what.
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {!loading &&
              members.map((member) => (
                <tr key={member.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-xs font-semibold text-amber-700">
                        {member.name.slice(0, 1).toUpperCase()}
                      </div>
                      <span className="font-medium text-stone-700">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-stone-500">{formatDate(member.joinDate)}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex justify-end">
                      <button
                        onClick={() => setConfirmId(member.id)}
                        className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        aria-label="Delete member"
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

      {confirmingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
            onClick={() => setConfirmId(null)}
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-card">
            <h4 className="text-base font-semibold text-stone-800">Remove {confirmingMember.name}?</h4>
            <p className="mt-1.5 text-sm text-stone-500">
              This will also delete all of their recorded expenses. This can&apos;t be undone.
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
                  onDelete(confirmingMember);
                  setConfirmId(null);
                }}
                className="rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
