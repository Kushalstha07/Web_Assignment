import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { MONGODB_URL } from "../configs/constant";
import { UserModel } from "../models/user.model";

async function seed() {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("Connected to MongoDB for seeding...");

    // ── Clear existing data ──
    await UserModel.deleteMany({});
    console.log("Cleared existing users");

    // ── Seed Admin User ──
    const adminPassword = await bcryptjs.hash("admin123", 10);
    const admin = await UserModel.create({
      fullName: "Admin User",
      username: "admin",
      email: "admin@eduglobal.com",
      phoneNumber: "9800000000",
      studyLevel: "postgraduate" as const,
      destination: "usa" as const,
      fieldOfStudy: "Administration",
      intake: "fall" as const,
      budget: "35k-plus" as const,
      password: adminPassword,
      role: "admin" as const,
    });
    console.log(`Created admin: ${admin.email} (password: admin123)`);

    // ── Seed Counsellor Users ──
    const counsellorPassword = await bcryptjs.hash("counsellor123", 10);
    const counsellors = [
      { fullName: "Sarah Johnson", username: "sarah.johnson", email: "sarah.johnson@eduglobal.com", phoneNumber: "9800000001" },
      { fullName: "Michael Chen", username: "michael.chen", email: "michael.chen@eduglobal.com", phoneNumber: "9800000002" },
      { fullName: "Emily Davis", username: "emily.davis", email: "emily.davis@eduglobal.com", phoneNumber: "9800000003" },
    ];

    for (const c of counsellors) {
      await UserModel.create({
        ...c,
        studyLevel: "postgraduate" as const,
        destination: "usa" as const,
        fieldOfStudy: "Counselling",
        intake: "fall" as const,
        budget: "35k-plus" as const,
        password: counsellorPassword,
        role: "counsellor" as const,
      });
      console.log(`Created counsellor: ${c.email} (password: counsellor123)`);
    }

    // ── Seed Student Users ──
    const studentPassword = await bcryptjs.hash("student123", 10);
    const students = [
      { fullName: "Alex Mercer", username: "alex.mercer", email: "alex.mercer@example.com", phoneNumber: "9800000010", studyLevel: "undergraduate" as const, destination: "usa" as const, fieldOfStudy: "Computer Science", intake: "fall" as const, budget: "20k-35k" as const },
      { fullName: "Priya Sharma", username: "priya.sharma", email: "priya.sharma@example.com", phoneNumber: "9800000011", studyLevel: "postgraduate" as const, destination: "uk" as const, fieldOfStudy: "Business Administration", intake: "spring" as const, budget: "20k-35k" as const },
      { fullName: "James Wilson", username: "james.wilson", email: "james.wilson@example.com", phoneNumber: "9800000012", studyLevel: "undergraduate" as const, destination: "canada" as const, fieldOfStudy: "Engineering", intake: "fall" as const, budget: "10k-20k" as const },
      { fullName: "Aisha Patel", username: "aisha.patel", email: "aisha.patel@example.com", phoneNumber: "9800000013", studyLevel: "postgraduate" as const, destination: "australia" as const, fieldOfStudy: "Data Science", intake: "summer" as const, budget: "20k-35k" as const },
      { fullName: "Daniel Kim", username: "daniel.kim", email: "daniel.kim@example.com", phoneNumber: "9800000014", studyLevel: "high-school" as const, destination: "usa" as const, fieldOfStudy: "General Studies", intake: "fall" as const, budget: "under-10k" as const },
      { fullName: "Emma Thompson", username: "emma.thompson", email: "emma.thompson@example.com", phoneNumber: "9800000015", studyLevel: "undergraduate" as const, destination: "europe" as const, fieldOfStudy: "Architecture", intake: "winter" as const, budget: "10k-20k" as const },
      { fullName: "Rajesh Kumar", username: "rajesh.kumar", email: "rajesh.kumar@example.com", phoneNumber: "9800000016", studyLevel: "postgraduate" as const, destination: "canada" as const, fieldOfStudy: "Environmental Science", intake: "fall" as const, budget: "20k-35k" as const },
      { fullName: "Sophie Martin", username: "sophie.martin", email: "sophie.martin@example.com", phoneNumber: "9800000017", studyLevel: "undergraduate" as const, destination: "uk" as const, fieldOfStudy: "Medicine", intake: "spring" as const, budget: "35k-plus" as const },
    ];

    for (const s of students) {
      await UserModel.create({
        ...s,
        password: studentPassword,
        role: "student" as const,
      });
      console.log(`Created student: ${s.email} (password: student123)`);
    }

    console.log("\n✅ Seed completed successfully!");
    console.log(`   - 1 admin (admin@eduglobal.com / admin123)`);
    console.log(`   - 3 counsellors (password: counsellor123)`);
    console.log(`   - 8 students (password: student123)`);

    // ── TODO: Seed universities (Sprint 7) ──
    // await UniversityModel.deleteMany({});
    // await UniversityModel.insertMany([...]);
    // console.log("Universities seeded");

    // ── TODO: Seed scholarships (Sprint 11) ──
    // await ScholarshipModel.deleteMany({});
    // await ScholarshipModel.insertMany([...]);
    // console.log("Scholarships seeded");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();