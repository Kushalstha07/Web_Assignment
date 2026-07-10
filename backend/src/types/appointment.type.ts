import { z } from "zod";

export const appointmentStatuses = ["scheduled", "confirmed", "cancelled", "completed", "no-show"] as const;

export const AppointmentSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  counsellorId: z.string().min(1, "Counsellor ID is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  status: z.enum(appointmentStatuses).default("scheduled"),
  notes: z.string().max(500).optional(),
  meetingLink: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export type AppointmentType = z.infer<typeof AppointmentSchema>;
export type AppointmentStatus = (typeof appointmentStatuses)[number];