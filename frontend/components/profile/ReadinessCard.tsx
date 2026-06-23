"use client";

interface ReadinessCardProps {
  completion: number;
  missingItems: string[];
}

export default function ReadinessCard({ completion, missingItems }: ReadinessCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" style={{ boxShadow: "0px 8px 30px rgba(0,0,0,.05)" }}>
      <div className="mb-4 flex items-center gap-2">
        <span className="text-lg">📊</span>
        <h3 className="text-lg font-bold text-[#172B4D]">Application Readiness</h3>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold text-[#1565D8]">{completion}%</p>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-[#E8EEF7]">
          <div
            className="h-2 rounded-full bg-[#1565D8] transition-all"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="text-sm text-[#172B4D]">Personal Information</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="text-sm text-[#172B4D]">Academic History</span>
        </div>
        {missingItems.length > 0 && (
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className="text-sm text-[#172B4D]">Documents Missing ({missingItems.length})</span>
          </div>
        )}
      </div>
    </div>
  );
}