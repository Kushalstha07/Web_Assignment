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
        <button className="text-sm font-semibold text-[#1565D8] hover:underline">+ Add Score</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
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
    </div>
  );
}