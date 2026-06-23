"use client";

interface EducationCardProps {
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    scholarship?: string;
  }>;
}

export default function EducationCard({ education }: EducationCardProps) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm overflow-x-hidden" style={{ boxShadow: "0px 8px 30px rgba(0,0,0,.05)" }}>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎓</span>
          <h3 className="text-lg font-bold text-[#172B4D]">Education History</h3>
        </div>
        <button className="text-sm font-semibold text-[#1565D8] hover:underline">See All</button>
      </div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Horizontal Timeline Line */}
        <div className="absolute left-[36px] right-[36px] top-[36px] h-1 rounded-full bg-[#DCE8FF]" />

        {/* Milestones Grid */}
        <div className="grid grid-cols-3 gap-6 w-full">
          {education.map((edu, index) => {
            const isCurrent = edu.year.toLowerCase().includes("current");
            const yearShort = edu.year.split(" ")[0];
            const yearLong = edu.year.split(" ").slice(1).join(" ") || "";

            return (
              <div key={index} className="flex flex-col items-center">
                {/* Year Circle */}
                <div
                  className={`flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full border-5 bg-white transition-all ${
                    isCurrent
                      ? "border-[#1565D8] shadow-lg"
                      : "border-[#1565D8]"
                  }`}
                  style={{ borderWidth: "5px" }}
                >
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#1565D8]">{yearShort}</p>
                    {yearLong && <p className="text-[10px] font-semibold text-[#6B7280]">{yearLong}</p>}
                  </div>
                </div>

                {/* Connector Line */}
                <div className="my-3 h-8 w-0.5 bg-[#DCE8FF]" />

                {/* Education Card */}
                <div
                  className={`w-full min-w-0 rounded-[24px] border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    isCurrent
                      ? "border-[#1565D8] bg-[#F8FBFF]"
                      : "border-[#E5EDF8] bg-white"
                  }`}
                  style={{
                    boxShadow: isCurrent
                      ? "0px 4px 20px rgba(21, 101, 216, 0.15)"
                      : "0px 4px 20px rgba(0,0,0,0.04)",
                  }}
                >
                  <h4 className="text-base font-bold text-[#172B4D]">{edu.degree}</h4>
                  <p className="mt-2 text-sm text-[#6B7280]">{edu.institution}</p>
                  {edu.scholarship && (
                    <span className="mt-3 inline-block rounded-full bg-[#EEF5FF] px-3 py-1.5 text-xs font-semibold text-[#1565D8]">
                      {edu.scholarship}
                    </span>
                  )}
                  <p className="mt-3 text-xs font-medium text-[#1565D8]">{edu.year}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}