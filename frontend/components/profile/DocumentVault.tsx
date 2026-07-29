"use client";

interface DocumentVaultProps {
  documents: Array<{
    name: string;
    size: string;
    status: string;
    url?: string;
  }>;
}

export default function DocumentVault({ documents }: DocumentVaultProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" style={{ boxShadow: "0px 8px 30px rgba(0,0,0,.05)" }}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">📁</span>
          <h3 className="text-lg font-bold text-[#172B4D]">Document Vault</h3>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {documents.map((doc, index) => (
          <div
            key={index}
            className="group relative rounded-xl border border-[#E8EEF7] bg-[#F8FAFD] p-4 transition-all hover:border-[#1565D8] hover:shadow-md"
          >
            {/* PDF Icon */}
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-red-50">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#EF4444" />
                <polyline points="14 2 14 8 20 8" stroke="white" strokeWidth="1.5" />
                <path d="M9 13h6M9 17h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            <p className="text-sm font-semibold text-[#172B4D]">{doc.name}</p>
            <p className="mt-1 text-xs text-[#6B7280]">{doc.size}</p>
            <p className="mt-1 text-xs font-medium text-[#22C55E]">{doc.status}</p>

            {/* Hover Actions */}
            {doc.url && <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"><a href={doc.url} target="_blank" rel="noreferrer" className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#172B4D] hover:bg-[#1565D8] hover:text-white">Preview</a></div>}
          </div>
        ))}
      </div>
      {documents.length === 0 && <p className="py-8 text-center text-sm text-[#6B7280]">No uploaded documents are available.</p>}
    </div>
  );
}
