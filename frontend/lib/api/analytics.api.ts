import { apiClient } from "./client";

export interface AnalyticsTotals {
  totalUsers: number;
  totalStudents: number;
  totalCounsellors: number;
  totalAdmins: number;
  totalUniversities: number;
  totalApplications: number;
  totalDocuments: number;
}

export interface RegionalDistribution {
  country: string;
  count: number;
}

export interface TopUniversity {
  universityId: string;
  applicationCount: number;
}

export interface MonthlyGrowth {
  month: string;
  count: number;
}

export interface SuccessRate {
  total: number;
  accepted: number;
  rate: number;
}

export async function getAnalyticsTotals(): Promise<{ success: boolean; data: AnalyticsTotals }> {
  return apiClient("GET", "/api/v1/analytics/totals");
}

export async function getRegionalDistribution(): Promise<{ success: boolean; data: RegionalDistribution[] }> {
  return apiClient("GET", "/api/v1/analytics/regional");
}

export async function getTopUniversities(limit = 10): Promise<{ success: boolean; data: TopUniversity[] }> {
  return apiClient("GET", "/api/v1/analytics/top-universities", { params: { limit: String(limit) } });
}

export async function getMonthlyGrowth(): Promise<{ success: boolean; data: MonthlyGrowth[] }> {
  return apiClient("GET", "/api/v1/analytics/monthly-growth");
}

export async function getSuccessRate(): Promise<{ success: boolean; data: SuccessRate }> {
  return apiClient("GET", "/api/v1/analytics/success-rate");
}