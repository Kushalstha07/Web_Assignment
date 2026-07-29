"use client";

import { useEffect, useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { PIPELINE_STAGES } from "@/lib/constants";
import { GripVertical, Mail, Phone, Building2 } from "lucide-react";

export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  university: string;
  program: string;
  avatar?: string;
  stage: string;
}

interface SortableStudentCardProps {
  student: Student;
}

function SortableStudentCard({ student }: SortableStudentCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: student.id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm transition-all hover:border-[#2563EB]/30 hover:shadow-md"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar src={student.avatar} fallback={student.name} size="sm" />
          <div>
            <p className="text-sm font-semibold text-[#0F172A]">{student.name}</p>
            <p className="text-xs text-[#64748B]">{student.program}</p>
          </div>
        </div>
        <button
          className="cursor-grab text-[#94A3B8] hover:text-[#64748B]"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#64748B]">
          <Building2 className="h-3 w-3" />
          <span className="truncate">{student.university}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#64748B]">
          <Mail className="h-3 w-3" />
          <span className="truncate">{student.email}</span>
        </div>
        {student.phone && (
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <Phone className="h-3 w-3" />
            <span>{student.phone}</span>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <Badge variant="info" size="sm">
          {student.stage}
        </Badge>
        <button className="text-xs font-semibold text-[#2563EB] hover:underline">
          View Details
        </button>
      </div>
    </div>
  );
}

interface PipelineColumnProps {
  stage: string;
  students: Student[];
}

function PipelineColumn({ stage, students }: PipelineColumnProps) {
  const [isOver, setIsOver] = useState(false);
  const { setNodeRef } = useDroppable({ id: stage });

  return (
    <div ref={setNodeRef}
      className={cn(
        "flex min-w-[260px] flex-col rounded-[18px] border border-[#E5E7EB] bg-[#F8FAFC] p-3.5 transition-all sm:min-w-[280px] sm:p-4",
        isOver ? "border-[#2563EB] bg-[#EEF5FF]" : "border-[#E5E7EB]"
      )}
      onDragOver={() => setIsOver(true)}
      onDragLeave={() => setIsOver(false)}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#0F172A]">{stage.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ")}</h3>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2563EB] text-xs font-bold text-white">
          {students.length}
        </span>
      </div>

      <SortableContext items={students.map(s => s.id)} strategy={horizontalListSortingStrategy}>
        <div className="space-y-3">
          {students.map((student) => (
            <SortableStudentCard key={student.id} student={student} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export function StudentPipeline({ students, onStageChange }: { students: Student[]; onStageChange?: (applicationId: string, stage: string) => Promise<void> }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pipelineData, setPipelineData] = useState<Record<string, Student[]>>(() => {
    const data: Record<string, Student[]> = {};
    PIPELINE_STAGES.forEach(stage => {
      data[stage] = students.filter(s => s.stage === stage);
    });
    return data;
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    const next: Record<string, Student[]> = {};
    PIPELINE_STAGES.forEach((stage) => { next[stage] = students.filter((student) => student.stage === stage); });
    const timer = window.setTimeout(() => setPipelineData(next), 0);
    return () => window.clearTimeout(timer);
  }, [students]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const studentId = active.id as string;
    const newStage = over.id as string;

    // Find the student and update their stage
    setPipelineData(prev => {
      const newData = { ...prev };
      let student: Student | undefined;

      // Find and remove from current stage
      for (const stage of PIPELINE_STAGES) {
        const found = newData[stage].find(s => s.id === studentId);
        if (found) {
          student = found;
          newData[stage] = newData[stage].filter(s => s.id !== studentId);
          break;
        }
      }

      // Add to new stage
      if (student && (PIPELINE_STAGES as readonly string[]).includes(newStage)) {
        student = { ...student, stage: newStage };
        newData[newStage] = [...(newData[newStage] || []), student];
      }

      return newData;
    });
    if ((PIPELINE_STAGES as readonly string[]).includes(newStage)) void onStageChange?.(studentId, newStage);
  };

  const activeStudent = activeId ? students.find(s => s.id === activeId) : null;

  return (
    <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">Student Pipeline</h2>
          <p className="mt-1 text-sm text-[#64748B]">Drag and drop students between stages</p>
        </div>
        <p className="text-xs font-medium text-[#94A3B8]">Stages are saved to the application API</p>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToHorizontalAxis]}
      >
        <div className="admin-scrollbar -mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-4">
          {PIPELINE_STAGES.map((stage) => (
            <PipelineColumn
              key={stage}
              stage={stage}
              students={pipelineData[stage] || []}
            />
          ))}
        </div>

        <DragOverlay>
          {activeStudent && (
            <div className="rotate-3 rounded-xl border-2 border-[#2563EB] bg-white p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <Avatar src={activeStudent.avatar} fallback={activeStudent.name} size="sm" />
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">{activeStudent.name}</p>
                  <p className="text-xs text-[#64748B]">{activeStudent.program}</p>
                </div>
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
