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
      studyLevel: "postgraduate",
      destination: "usa",
      fieldOfStudy: "Administration",
      intake: "fall",
      budget: "35k-plus",
      password: adminPassword,
      role: "admin",
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
        studyLevel: "postgraduate",
        destination: "usa",
        fieldOfStudy: "Counselling",
        intake: "fall",
        budget: "35k-plus",
        password: counsellorPassword,
        role: "counsellor",
      });
      console.log(`Created counsellor: ${c.email} (password: counsellor123)`);
    }

    // ── Seed Student Users ──
    const studentPassword = await bcryptjs.hash("student123", 10);
    const students = [
      { fullName: "Alex Mercer", username: "alex.mercer", email: "alex.mercer@example.com", phoneNumber: "9800000010", studyLevel: "undergraduate", destination: "usa", fieldOfStudy: "Computer Science", intake: "fall", budget: "20k-35k" },
      { fullName: "Priya Sharma", username: "priya.sharma", email: "priya.sharma@example.com", phoneNumber: "9800000011", studyLevel: "postgraduate", destination: "uk", fieldOfStudy: "Business Administration", intake: "spring", budget: "20k-35k" },
      { fullName: "James Wilson", username: "james.wilson", email: "james.wilson@example.com", phoneNumber: "9800000012", studyLevel: "undergraduate", destination: "canada", fieldOfStudy: "Engineering", intake: "fall", budget: "10k-20k" },
      { fullName: "Aisha Patel", username: "aisha.patel", email: "aisha.patel@example.com", phoneNumber: "9800000013", studyLevel: "postgraduate", destination: "australia", fieldOfStudy: "Data Science", intake: "summer", budget: "20k-35k" },
      { fullName: "Daniel Kim", username: "daniel.kim", email: "daniel.kim@example.com", phoneNumber: "9800000014", studyLevel: "high-school", destination: "usa", fieldOfStudy: "General Studies", intake: "fall", budget: "under-10k" },
      { fullName: "Emma Thompson", username: "emma.thompson", email: "emma.thompson@example.com", phoneNumber: "9800000015", studyLevel: "undergraduate", destination: "europe", fieldOfStudy: "Architecture", intake: "winter", budget: "10k-20k" },
      { fullName: "Rajesh Kumar", username: "rajesh.kumar", email: "rajesh.kumar@example.com", phoneNumber: "9800000016", studyLevel: "postgraduate", destination: "canada", fieldOfStudy: "Environmental Science", intake: "fall", budget: "20k-35k" },
      { fullName: "Sophie Martin", username: "sophie.martin", email: "sophie.martin@example.com", phoneNumber: "9800000017", studyLevel: "undergraduate", destination: "uk", fieldOfStudy: "Medicine", intake: "spring", budget: "35k-plus" },
    ];

    for (const s of students) {
      await UserModel.create({
        ...s,
        password: studentPassword,
        role: "student",
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