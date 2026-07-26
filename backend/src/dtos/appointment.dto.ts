import { z } from "zod";
import { appointmentStatuses } from "../types/appointment.type";

export const CreateAppointmentDTO = z.object({
  counsellorId: z.string().min(1, "Counsellor ID is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  notes: z.string().max(500).optional(),
});

export const UpdateAppointmentDTO = z.object({
  date: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  status: z.enum(appointmentStatuses).optional(),
  notes: z.string().max(500).optional(),
  meetingLink: z.string().max(1000).optional(),
});

export const CancelAppointmentDTO = z.object({
  cancellationReason: z.string().max(500).optional(),
});

export type CreateAppointmentDTOType = z.infer<typeof CreateAppointmentDTO>;
export type UpdateAppointmentDTOType = z.infer<typeof UpdateAppointmentDTO>;
export type CancelAppointmentDTOType = z.infer<typeof CancelAppointmentDTO>;
