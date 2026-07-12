"use client";

import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import { Upload, File, X } from "lucide-react";

export interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  maxSize?: number; // in bytes
  multiple?: boolean;
  label?: string;
  className?: string;
}

export function FileDropzone({
  onFilesSelected,
  accept,
  maxSize = 5 * 1024 * 1024, // 5MB default
  multiple = false,
  label = "Drag & drop files here, or click to browse",
  className,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFiles = useCallback(
    (files: FileList | File[]): File[] => {
      const valid: File[] = [];
      setError(null);

      for (const file of Array.from(files)) {
        if (maxSize && file.size > maxSize) {
          setError(`"${file.name}" exceeds the ${(maxSize / 1024 / 1024).toFixed(0)}MB limit`);
          continue;
        }
        if (accept && !file.type.match(accept.replace(/\*/g, ".*"))) {
          setError(`"${file.name}" has an unsupported file type`);
          continue;
        }
        valid.push(file);
      }

      return valid;
    },
    [accept, maxSize],
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = validateFiles(e.dataTransfer.files);
      if (files.length > 0) {
        setSelectedFiles(multiple ? files : [files[0]]);
        onFilesSelected(multiple ? files : [files[0]]);
      }
    },
    [validateFiles, multiple, onFilesSelected],
  );

  const handleFileInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const files = validateFiles(e.target.files);
      if (files.length > 0) {
        setSelectedFiles(multiple ? files : [files[0]]);
        onFilesSelected(multiple ? files : [files[0]]);
      }
    },
    [validateFiles, multiple, onFilesSelected],
  );

  const removeFile = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);
    onFilesSelected(updated);
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-[20px] border-2 border-dashed p-8 transition-all",
          isDragging
            ? "border-[#2563EB] bg-[#EEF5FF]"
            : "border-[#E5E7EB] bg-[#F8FAFC] hover:border-[#CBD5E1] hover:bg-white",
          error && "border-[#EF4444]",
        )}
      >
        <Upload className={cn("mb-3 h-8 w-8", isDragging ? "text-[#2563EB]" : "text-[#94A3B8]")} />
        <p className="text-sm font-medium text-[#64748B]">{label}</p>
        <p className="mt-1 text-xs text-[#94A3B8]">
          {accept ? `Accepted: ${accept}` : "All file types accepted"}
          &nbsp;&middot;&nbsp;Max {(maxSize / 1024 / 1024).toFixed(0)}MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {error && <p className="mt-2 text-sm text-[#EF4444]">{error}</p>}

      {selectedFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          {selectedFiles.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5"
            >
              <File className="h-5 w-5 shrink-0 text-[#2563EB]" />
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-[#0F172A]">{file.name}</p>
                <p className="text-xs text-[#64748B]">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button
                onClick={() => removeFile(idx)}
                className="rounded-lg p-1 text-[#94A3B8] transition-all hover:bg-[#F1F5F9] hover:text-[#EF4444]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}