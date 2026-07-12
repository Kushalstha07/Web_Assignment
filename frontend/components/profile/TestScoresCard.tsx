"use client";

interface TestScoresCardProps {
  scores: Array<{
    test: string;
    score: string;
    validUntil?: string;
  }>;
}

export default function TestScoresCard({ scores }: TestScoresCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" style={{ boxShadow: "0px 8px 30px rgba(0,0,0,.05)" }}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">📝</span>
          <h3 className="text-lg font-bold text-[#172B4D]">Test Scores</h3>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {scores.map((item, index) => (
          <div key={index} className="rounded-xl border border-[#E8EEF7] bg-[#F8FAFD] p-4 text-center transition-all hover:border-[#1565D8] hover:shadow-md">
            <p className="text-sm font-semibold text-[#6B7280]">{item.test}</p>
            <p className="mt-2 text-2xl font-bold text-[#1565D8]">{item.score}</p>
            {item.validUntil && (
              <p className="mt-1 text-xs text-[#6B7280]">Valid Until {item.validUntil}</p>
            )}
          </div>
        ))}
      </div>
      {scores.length === 0 && <p className="py-8 text-center text-sm text-[#6B7280]">No test scores have been recorded.</p>}
    </div>
  );
}
