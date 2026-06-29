"use client";

import { useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
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

  return (
    <div
      className={cn(
        "flex min-w-[280px] flex-col rounded-[20px] border-2 border-dashed bg-[#F8FAFC] p-4 transition-all",
        isOver ? "border-[#2563EB] bg-[#EEF5FF]" : "border-[#E5E7EB]"
      )}
      onDragOver={() => setIsOver(true)}
      onDragLeave={() => setIsOver(false)}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#0F172A]">{stage}</h3>
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

export function StudentPipeline({ students }: { students: Student[] }) {
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
      if (student && PIPELINE_STAGES.includes(newStage as any)) {
        student = { ...student, stage: newStage };
        newData[newStage] = [...(newData[newStage] || []), student];
      }

      return newData;
    });
  };

  const activeStudent = activeId ? students.find(s => s.id === activeId) : null;

  return (
    <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">Student Pipeline</h2>
          <p className="mt-1 text-sm text-[#64748B]">Drag and drop students between stages</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-[12px] border border-[#E5E7EB] px-4 py-2 text-sm font-semibold text-[#64748B] hover:bg-[#F8FAFC]">
            Filter
          </button>
          <button className="rounded-[12px] bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8]">
            Add Student
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToHorizontalAxis]}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
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