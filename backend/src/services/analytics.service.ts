import { UserModel } from "../models/user.model";
import { ApplicationModel } from "../models/application.model";
import { University } from "../models/university.model";
import { DocumentModel } from "../models/document.model";

export class AnalyticsService {
  async getTotals() {
    const [totalUsers, totalStudents, totalCounsellors, totalAdmins, totalUniversities, totalApplications, totalDocuments] = await Promise.all([
      UserModel.countDocuments(),
      UserModel.countDocuments({ role: "student" }),
      UserModel.countDocuments({ role: "counsellor" }),
      UserModel.countDocuments({ role: "admin" }),
      University.countDocuments(),
      ApplicationModel.countDocuments(),
      DocumentModel.countDocuments(),
    ]);

    return {
      totalUsers,
      totalStudents,
      totalCounsellors,
      totalAdmins,
      totalUniversities,
      totalApplications,
      totalDocuments,
    };
  }

  async getRegionalDistribution() {
    const result = await UserModel.aggregate([
      { $match: { role: "student" } },
      { $group: { _id: "$destination", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { country: "$_id", count: 1, _id: 0 } },
    ]);
    return result;
  }

  async getTopUniversities(limit = 10) {
    const result = await ApplicationModel.aggregate([
      { $group: { _id: "$universityId", applicationCount: { $sum: 1 } } },
      { $sort: { applicationCount: -1 } },
      { $limit: limit },
      { $project: { universityId: "$_id", applicationCount: 1, _id: 0 } },
    ]);
    return result;
  }

  async getMonthlyGrowth() {
    const result = await UserModel.aggregate([
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $project: { month: "$_id", count: 1, _id: 0 } },
    ]);
    return result;
  }

  async getSuccessRate() {
    const [total, accepted] = await Promise.all([
      ApplicationModel.countDocuments(),
      ApplicationModel.countDocuments({ status: "accepted" }),
    ]);
    return {
      total,
      accepted,
      rate: total > 0 ? Math.round((accepted / total) * 100) : 0,
    };
  }
}

export const analyticsService = new AnalyticsService();