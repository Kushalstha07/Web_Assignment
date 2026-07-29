import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { MONGODB_URL } from "../configs/constant";
import { UserModel } from "../models/user.model";
import { University } from "../models/university.model";
import { CounsellorModel } from "../models/counsellor.model";
import { ScholarshipModel } from "../models/scholarship.model";
import type { CounsellorSpecialty } from "../types/counsellor.type";

async function seed() {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("Connected to MongoDB for seeding...");

    // ── Clear existing data ──
    await UserModel.deleteMany({});
    await CounsellorModel.deleteMany({});
    await ScholarshipModel.deleteMany({});
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

    const counsellorProfiles: Array<{ specialties: CounsellorSpecialty[]; yearsOfExperience: number; rating: number; reviewCount: number; hourlyRate: number; bio: string }> = [
      { specialties: ["university-admissions", "scholarship-advising"], yearsOfExperience: 8, rating: 4.9, reviewCount: 126, hourlyRate: 45, bio: "University admissions specialist helping international students build strong applications." },
      { specialties: ["visa-guidance", "career-counseling"], yearsOfExperience: 6, rating: 4.8, reviewCount: 94, hourlyRate: 40, bio: "Visa and career counsellor focused on practical planning and successful study transitions." },
      { specialties: ["test-preparation", "general-advising"], yearsOfExperience: 5, rating: 4.7, reviewCount: 78, hourlyRate: 35, bio: "Test preparation mentor and general adviser for students at every stage of their journey." },
    ];

    for (const [index, c] of counsellors.entries()) {
      const counsellorUser = await UserModel.create({
        ...c,
        studyLevel: "postgraduate" as const,
        destination: "usa" as const,
        fieldOfStudy: "Counselling",
        intake: "fall" as const,
        budget: "35k-plus" as const,
        password: counsellorPassword,
        role: "counsellor" as const,
      });
      await CounsellorModel.create({
        userId: counsellorUser._id.toString(),
        fullName: c.fullName,
        email: c.email,
        phoneNumber: c.phoneNumber,
        ...counsellorProfiles[index],
        available: true,
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
    console.log(`   - 3 counsellors with profiles (password: counsellor123)`);
    console.log(`   - 8 students (password: student123)`);

    // ── Seed Universities ──
    await University.deleteMany({});
    const universities = [
      { name: "Harvard University", country: "usa" as const, city: "Cambridge", ranking: "top-10" as const, worldRanking: 1, courseType: "undergraduate" as const, tuitionFee: 52000, budgetRange: "35k-plus" as const, applicationFee: 85, description: "Prestigious Ivy League institution with world-class programs across all disciplines.", programs: ["Computer Science", "Business", "Law", "Medicine", "Engineering"], rating: 4.9, isActive: true },
      { name: "Stanford University", country: "usa" as const, city: "Stanford", ranking: "top-10" as const, worldRanking: 2, courseType: "postgraduate" as const, tuitionFee: 55000, budgetRange: "35k-plus" as const, applicationFee: 125, description: "Leading research university in Silicon Valley with strong tech and entrepreneurship focus.", programs: ["Computer Science", "Engineering", "Business", "Design"], rating: 4.8, isActive: true },
      { name: "University of Oxford", country: "uk" as const, city: "Oxford", ranking: "top-10" as const, worldRanking: 3, courseType: "undergraduate" as const, tuitionFee: 38000, budgetRange: "35k-plus" as const, applicationFee: 75, description: "World-renowned collegiate university with centuries of academic excellence.", programs: ["Philosophy", "Law", "Medicine", "Economics", "History"], rating: 4.9, isActive: true },
      { name: "University of Cambridge", country: "uk" as const, city: "Cambridge", ranking: "top-10" as const, worldRanking: 4, courseType: "postgraduate" as const, tuitionFee: 36000, budgetRange: "35k-plus" as const, applicationFee: 70, description: "Historic university known for its rigorous academics and beautiful campus.", programs: ["Engineering", "Mathematics", "Physics", "Computer Science"], rating: 4.8, isActive: true },
      { name: "University of Toronto", country: "canada" as const, city: "Toronto", ranking: "top-50" as const, worldRanking: 16, courseType: "undergraduate" as const, tuitionFee: 25000, budgetRange: "20k-35k" as const, applicationFee: 120, description: "Canada's top university with diverse programs and vibrant campus life.", programs: ["Computer Science", "Engineering", "Business", "Life Sciences"], rating: 4.6, isActive: true },
      { name: "University of British Columbia", country: "canada" as const, city: "Vancouver", ranking: "top-50" as const, worldRanking: 34, courseType: "undergraduate" as const, tuitionFee: 22000, budgetRange: "20k-35k" as const, applicationFee: 100, description: "Beautiful coastal campus with strong research programs and international community.", programs: ["Engineering", "Environmental Science", "Business"], rating: 4.5, isActive: true },
      { name: "University of Melbourne", country: "australia" as const, city: "Melbourne", ranking: "top-50" as const, worldRanking: 37, courseType: "postgraduate" as const, tuitionFee: 28000, budgetRange: "20k-35k" as const, applicationFee: 110, description: "Australia's leading research university with strong global connections.", programs: ["Business", "Engineering", "Medicine", "Arts"], rating: 4.5, isActive: true },
      { name: "ETH Zurich", country: "europe" as const, city: "Zurich", ranking: "top-10" as const, worldRanking: 7, courseType: "postgraduate" as const, tuitionFee: 1500, budgetRange: "under-10k" as const, applicationFee: 50, description: "World-class technical university known for engineering and technology programs.", programs: ["Engineering", "Computer Science", "Physics", "Architecture"], rating: 4.7, isActive: true },
      { name: "University of Sydney", country: "australia" as const, city: "Sydney", ranking: "top-50" as const, worldRanking: 41, courseType: "undergraduate" as const, tuitionFee: 26000, budgetRange: "20k-35k" as const, applicationFee: 100, description: "Australia's oldest university with excellent humanities and sciences programs.", programs: ["Arts", "Engineering", "Law", "Medicine"], rating: 4.4, isActive: true },
      { name: "University of Manchester", country: "uk" as const, city: "Manchester", ranking: "top-100" as const, worldRanking: 85, courseType: "undergraduate" as const, tuitionFee: 22000, budgetRange: "20k-35k" as const, applicationFee: 60, description: "Red brick university with strong engineering and business programs.", programs: ["Engineering", "Business", "Computer Science"], rating: 4.2, isActive: true },
      { name: "University of California, Berkeley", country: "usa" as const, city: "Berkeley", ranking: "top-10" as const, worldRanking: 8, courseType: "postgraduate" as const, tuitionFee: 44000, budgetRange: "35k-plus" as const, applicationFee: 95, description: "Top public university known for computer science and innovation.", programs: ["Computer Science", "Engineering", "Social Sciences"], rating: 4.7, isActive: true },
      { name: "University of Amsterdam", country: "europe" as const, city: "Amsterdam", ranking: "top-100" as const, worldRanking: 55, courseType: "postgraduate" as const, tuitionFee: 16000, budgetRange: "10k-20k" as const, applicationFee: 45, description: "Diverse European university with strong international focus.", programs: ["Social Sciences", "Economics", "Computer Science"], rating: 4.1, isActive: true },
      { name: "University of Waterloo", country: "canada" as const, city: "Waterloo", ranking: "top-200" as const, worldRanking: 112, courseType: "undergraduate" as const, tuitionFee: 18000, budgetRange: "10k-20k" as const, applicationFee: 90, description: "Famous for co-op programs and engineering excellence.", programs: ["Engineering", "Computer Science", "Mathematics"], rating: 4.3, isActive: true },
      { name: "RMIT University", country: "australia" as const, city: "Melbourne", ranking: "regional" as const, worldRanking: 190, courseType: "undergraduate" as const, tuitionFee: 19000, budgetRange: "10k-20k" as const, applicationFee: 75, description: "Practical-focused university with strong design and technology programs.", programs: ["Design", "Engineering", "Computer Science"], rating: 3.9, isActive: true },
      { name: "University of Bristol", country: "uk" as const, city: "Bristol", ranking: "top-100" as const, worldRanking: 90, courseType: "undergraduate" as const, tuitionFee: 20000, budgetRange: "10k-20k" as const, applicationFee: 55, description: "Russell Group university with strong engineering and sciences.", programs: ["Engineering", "Economics", "Sociology"], rating: 4.0, isActive: true },
    ];
    await University.insertMany(universities);
    console.log(`Seeded ${universities.length} universities`);

    // ── Seed Scholarships ──
    const scholarships = [
      { name: "Global Excellence Scholarship", provider: "Edu Global Foundation", type: "merit-based", amount: 25000, countries: ["usa", "canada"], universities: ["Harvard University", "University of Toronto"], eligibility: "Minimum GPA 3.7 with demonstrated leadership.", requirements: ["Academic transcripts", "Personal statement", "Two references"], deadline: "2026-12-15", status: "active", description: "A competitive award for high-achieving international students." },
      { name: "International Student Support Grant", provider: "World Education Fund", type: "need-based", amount: 12000, countries: ["uk", "canada"], universities: [], eligibility: "International applicants who demonstrate financial need.", requirements: ["Financial statement", "Admission offer"], deadline: "2026-11-30", status: "active", description: "Need-based support that makes international study more accessible." },
      { name: "Canada Future Leaders Award", provider: "Canadian Learning Council", type: "country-specific", amount: 18000, countries: ["canada"], universities: ["University of Toronto", "University of British Columbia", "University of Waterloo"], eligibility: "Leadership experience and admission to a Canadian university.", requirements: ["Leadership essay", "CV", "Admission offer"], deadline: "2027-01-20", status: "upcoming", description: "Supporting emerging leaders choosing Canada for higher education." },
      { name: "Oxford International Opportunity", provider: "University of Oxford", type: "university-specific", amount: 30000, countries: ["uk"], universities: ["University of Oxford"], eligibility: "Offer holder with outstanding academic achievement.", requirements: ["Oxford offer letter", "Academic transcripts"], deadline: "2026-10-31", status: "active", description: "Tuition support for exceptional international Oxford applicants." },
      { name: "Australia Awards Scholarship", provider: "Australian Government", type: "government", amount: 40000, countries: ["australia"], universities: ["University of Melbourne", "University of Sydney", "RMIT University"], eligibility: "Eligible developing-country citizens with a strong academic record.", requirements: ["Citizenship proof", "Study plan", "References"], deadline: "2027-02-28", status: "upcoming", description: "Government-funded study and development opportunity in Australia." },
      { name: "Tech Innovators Fellowship", provider: "FutureTech Partners", type: "private", amount: 20000, countries: ["usa", "europe"], universities: ["Stanford University", "ETH Zurich"], eligibility: "Computer science or engineering applicants with an innovation portfolio.", requirements: ["Project portfolio", "Personal statement"], deadline: "2026-09-15", status: "active", description: "Private fellowship for students building meaningful technology." },
      { name: "Women in STEM Scholarship", provider: "Global STEM Alliance", type: "merit-based", amount: 22000, countries: ["usa", "uk", "canada", "australia", "europe"], universities: [], eligibility: "Women applying to an accredited STEM program.", requirements: ["Academic transcripts", "STEM motivation essay"], deadline: "2026-12-01", status: "active", description: "Advancing women pursuing science, technology, engineering, and mathematics." },
      { name: "European Research Mobility Grant", provider: "European Academic Network", type: "country-specific", amount: 15000, countries: ["europe"], universities: ["ETH Zurich", "University of Amsterdam"], eligibility: "Postgraduate research applicant at a participating European university.", requirements: ["Research proposal", "Supervisor reference"], deadline: "2026-08-30", status: "active", description: "Mobility funding for promising postgraduate researchers." },
      { name: "Community Impact Award", provider: "International Service Trust", type: "private", amount: 10000, countries: ["usa", "uk", "canada"], universities: [], eligibility: "At least one year of documented community service.", requirements: ["Impact statement", "Community reference"], deadline: "2026-07-31", status: "active", description: "Recognising students who have created measurable community impact." },
      { name: "Postgraduate Business Leaders Grant", provider: "Global Business Institute", type: "merit-based", amount: 28000, countries: ["uk", "australia"], universities: ["University of Cambridge", "University of Melbourne"], eligibility: "Postgraduate business applicant with professional leadership experience.", requirements: ["CV", "Leadership essay", "Academic transcripts"], deadline: "2027-01-10", status: "upcoming", description: "Funding for the next generation of responsible business leaders." },
      { name: "First Generation University Grant", provider: "Access Education Fund", type: "need-based", amount: 14000, countries: ["usa", "canada", "uk"], universities: [], eligibility: "First-generation university applicant with demonstrated financial need.", requirements: ["Financial statement", "First-generation declaration"], deadline: "2026-11-15", status: "active", description: "Removing financial barriers for first-generation university students." },
      { name: "Architecture and Design Excellence Award", provider: "Creative Futures Foundation", type: "university-specific", amount: 16000, countries: ["europe", "australia"], universities: ["ETH Zurich", "RMIT University"], eligibility: "Architecture or design applicant with a strong creative portfolio.", requirements: ["Portfolio", "Academic transcripts"], deadline: "2026-06-30", status: "expired", description: "Portfolio-based award for emerging architecture and design talent." },
    ] as const;

    await ScholarshipModel.insertMany(
      scholarships.map((scholarship) => ({
        ...scholarship,
        currency: "USD",
        applicationUrl: "https://example.com/scholarships/apply",
      })),
    );
    console.log(`Seeded ${scholarships.length} scholarships`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
