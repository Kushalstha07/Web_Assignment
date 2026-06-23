"use client";

import Image from "next/image";
import Link from "next/link";

interface ProfileHeaderProps {
  user: {
    fullName: string;
    profileImage: string | null;
    studyLevel: string;
    destination: string;
  };
  completion: number;
  onEdit: () => void;
}

export default function ProfileHeader({ user, completion, onEdit }: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-6 rounded-2xl bg-white p-8 shadow-sm" style={{ boxShadow: "0px 8px 30px rgba(0,0,0,.05)" }}>
      {/* Profile Picture */}
      <div className="relative h-[120px] w-[120px] shrink-0">
        <div className="h-full w-full overflow-hidden rounded-full border-4 border-[#1565D8] bg-slate-100">
          {user.profileImage ? (
            <Image
              src={user.profileImage}
              alt={user.fullName}
              width={120}
              height={120}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-slate-400">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <button
          type="button"
          className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#1565D8] text-white shadow-md transition hover:bg-[#0F4DB2]"
          title="Upload photo"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </button>
      </div>

      {/* Name + Details */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-[#172B4D]">{user.fullName}</h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          {user.studyLevel.charAt(0).toUpperCase() + user.studyLevel.slice(1).replace("-", " ")} Applicant
        </p>
        <p className="text-sm text-[#6B7280]">
          {user.destination.charAt(0).toUpperCase() + user.destination.slice(1)}
        </p>
      </div>

      {/* Completion + Actions */}
      <div className="w-[320px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#6B7280]">Profile Completion</p>
            <p className="text-2xl font-bold text-[#1565D8]">{completion}%</p>
          </div>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-[#E8EEF7]">
          <div
            className="h-2 rounded-full bg-[#1565D8] transition-all"
            style={{ width: `${completion}%` }}
          />
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={onEdit}
            className="rounded-xl bg-[#1565D8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0F4DB2]"
          >
            Edit Profile
          </button>
          <button className="rounded-xl border border-[#E8EEF7] px-4 py-2 text-sm font-semibold text-[#172B4D] transition hover:border-[#1565D8] hover:text-[#1565D8]">
            Share Profile
          </button>
        </div>
      </div>
    </div>
  );
}