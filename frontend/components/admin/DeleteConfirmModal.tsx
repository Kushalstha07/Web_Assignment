"use client";

import type { AdminUser } from "@/lib/api/types";

interface DeleteConfirmModalProps {
  user: AdminUser;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isDeleting: boolean;
}

export function DeleteConfirmModal({ user, onConfirm, onCancel, isDeleting }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/55 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[24px] border border-white/20 bg-white p-6 shadow-2xl">
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <h2 className="mb-2 mt-4 text-lg font-bold text-[#0F172A]">Delete User</h2>
        <p className="text-sm text-[#64748B]">
          Are you sure you want to delete <strong>{user.fullName}</strong> ({user.email})? This action cannot be undone.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-6 text-sm font-semibold text-[#64748B] transition-all hover:bg-[#F8FAFC] disabled:opacity-50 sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-12 w-full rounded-xl bg-red-600 px-6 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {isDeleting ? "Deleting..." : "Delete User"}
          </button>
        </div>
      </div>
    </div>
  );
}
