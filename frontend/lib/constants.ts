export const DESIGN_TOKENS = {
  colors: {
    primary: "#2563EB",
    primaryDark: "#1D4ED8",
    background: "#F8FAFC",
    surface: "#FFFFFF",
    border: "#E5E7EB",
    text: "#0F172A",
    secondaryText: "#64748B",
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
    aiAccent: "#7C3AED",
    sidebarBg: "#FFFFFF",
    sidebarActive: "#EEF5FF",
    sidebarText: "#6B7280",
    sidebarTextActive: "#1565D8",
  },
  borderRadius: {
    card: "20px",
    button: "12px",
    input: "12px",
  },
  shadows: {
    soft: "0 10px 35px rgba(15,23,42,.06)",
    card: "0 1px 3px rgba(0,0,0,0.1)",
    elevated: "0 10px 25px rgba(0,0,0,0.1)",
  },
  spacing: {
    sidebarWidth: "280px",
    topNavHeight: "64px",
  },
};

export const PIPELINE_STAGES = [
  "Lead",
  "Consultation",
  "Application",
  "Offer Letter",
  "Visa",
  "Enrolled",
] as const;

export const USER_ROLES = {
  ADMIN: "admin",
  COUNSELLOR: "counsellor",
  STUDENT: "student",
} as const;

export const APPLICATION_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  APPROVED: "approved",
  REJECTED: "rejected",
  COMPLETED: "completed",
} as const;

export const DOCUMENT_STATUS = {
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
  UNDER_REVIEW: "under_review",
} as const;