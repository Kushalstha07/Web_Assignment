"use client";

type PersonalInfoCardProps = {
  user: {
    fullName: string;
    username?: string;
    email: string;
    phoneNumber: string;
    role: string;
    studyLevel?: string;
    destination?: string;
    fieldOfStudy?: string;
    intake?: string;
    budget?: string;
  };
};

function formatValue(key: string, value?: string) {
  if (!value) return "Not set";
  switch (key) {
    case "studyLevel":
      return value.charAt(0).toUpperCase() + value.slice(1).replace("-", " ");
    case "destination":
      return value.charAt(0).toUpperCase() + value.slice(1);
    case "intake":
      return value.charAt(0).toUpperCase() + value.slice(1);
    case "budget":
      return value.replace("-", " - ").replace("k", "K");
    default:
      return value;
  }
}

const fields = [
  { key: "fullName", label: "Full Name" },
  { key: "username", label: "Username" },
  { key: "email", label: "Email" },
  { key: "phoneNumber", label: "Phone" },
  { key: "role", label: "Role" },
];

export default function PersonalInfoCard({ user }: PersonalInfoCardProps) {
  const visibleFields = user.role === "student"
    ? [
        ...fields,
        { key: "studyLevel", label: "Study Level" },
        { key: "destination", label: "Destination" },
        { key: "fieldOfStudy", label: "Field of Study" },
        { key: "intake", label: "Intake" },
        { key: "budget", label: "Budget" },
      ]
    : fields;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" style={{ boxShadow: "0px 8px 30px rgba(0,0,0,.05)" }}>
      <div className="mb-4 flex items-center gap-2">
        <span className="text-lg">👤</span>
        <h3 className="text-lg font-bold text-[#172B4D]">Personal Information</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {visibleFields.map((field) => (
          <div key={field.key}>
            <p className="text-xs font-medium text-[#6B7280]">{field.label}</p>
            <p className="mt-1 text-sm font-semibold text-[#172B4D]">{formatValue(field.key, user[field.key as keyof typeof user] as string | undefined)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
