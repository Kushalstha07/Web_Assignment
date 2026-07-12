import mongoose, { Schema, Document } from "mongoose";
import { AppointmentType, appointmentStatuses } from "../types/appointment.type";

export interface IAppointment extends AppointmentType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentMongoSchema: Schema<IAppointment> = new Schema(
  {
    studentId: { type: String, required: true, ref: "User" },
    counsellorId: { type: String, required: true, ref: "Counsellor" },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: { type: String, enum: appointmentStatuses, default: "scheduled" },
    notes: { type: String, maxlength: 500, default: "" },
    meetingLink: { type: String, default: null },
    cancellationReason: { type: String, default: null },
  },
  { timestamps: true },
);

AppointmentMongoSchema.index({ studentId: 1 });
AppointmentMongoSchema.index({ counsellorId: 1 });
AppointmentMongoSchema.index({ date: 1 });

export const AppointmentModel = mongoose.model<IAppointment>("Appointment", AppointmentMongoSchema);