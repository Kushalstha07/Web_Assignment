"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar, momentNgLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { SkeletonCard } from "@/components/ui/Skeleton";
import {
  Plus,
  Search,
  Filter,
  Video,
  Phone,
  MapPin,
  Clock,
  ChevronRight,
  Calendar as CalendarIcon,
  CheckCircle,
  Clock3,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { KPICard } from "@/components/admin/KPICard";
import { SparklineData } from "@/components/charts";

const localizer = momentNgLocalizer(moment);

interface AppointmentEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: string;
  counsellor: string;
  status: string;
}

interface TodayMeeting {
  id: string;
  time: string;
  student: string;
  counsellor: string;
  type: string;
  status: string;
  avatar?: string;
}

export default function AppointmentsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [view, setView] = useState<"calendar" | "list">("calendar");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading || !mounted) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const mockEvents: AppointmentEvent[] = [
    {
      id: "1",
      title: "John Doe - University Consultation",
      start: new Date(2025, 6, 29, 10, 0),
      end: new Date(2025, 6, 29, 11, 0),
      type: "Consultation",
      counsellor: "Sarah Williams",
      status: "confirmed",
    },
    {
      id: "2",
      title: "Emily Davis - Visa Interview Prep",
      start: new Date(2025, 6, 29, 14, 0),
      end: new Date(2025, 6, 29, 15, 0),
      type: "Interview",
      counsellor: "Michael Brown",
      status: "confirmed",
    },
    {
      id: "3",
      title: "Alex Johnson - Document Review",
      start: new Date(2025, 6, 30, 9, 0),
      end: new Date(2025, 6, 30, 10, 0),
      type: "Review",
      counsellor: "Jennifer Taylor",
      status: "pending",
    },
    {
      id: "4",
      title: "Sarah Lee - Scholarship Discussion",
      start: new Date(2025, 6, 30, 11, 0),
      end: new Date(2025, 6, 30, 12, 0),
      type: "Consultation",
      counsellor: "Sarah Williams",
      status: "confirmed",
    },
    {
      id: "5",
      title: "Michael Chen - Application Planning",
      start: new Date(2025, 7, 1, 15, 0),
      end: new Date(2025, 7, 1, 16, 0),
      type: "Planning",
      counsellor: "Michael Brown",
      status: "pending",
    },
  ];

  const todayMeetings: TodayMeeting[] = [
    {
      id: "1",
      time: "10:00 AM - 11:00 AM",
      student: "John Doe",
      counsellor: "Sarah Williams",
      type: "Consultation",
      status: "confirmed",
    },
    {
      id: "2",
      time: "11:30 AM - 12:00 PM",
      student: "Emily Davis",
      counsellor: "Michael Brown",
      type: "Follow-up",
      status: "confirmed",
    },
    {
      id: "3",
      time: "2:00 PM - 3:00 PM",
      student: "Alex Johnson",
      counsellor: "Jennifer Taylor",
      type: "Interview",
      status: "pending",
    },
    {
      id: "4",
      time: "3:30 PM - 4:30 PM",
      student: "Sarah Lee",
      counsellor: "Sarah Williams",
      type: "Review",
      status: "confirmed",
    },
    {
      id: "5",
      time: "5:00 PM - 5:30 PM",
      student: "Michael Chen",
      counsellor: "Michael Brown",
      type: "Consultation",
      status: "pending",
    },
  ];

  const appointmentsList = [
    { id: "1", student: "John Doe", email: "john@example.com", counsellor: "Sarah Williams", date: "2025-07-29", time: "10:00 AM - 11:00 AM", type: "Consultation", status: "confirmed" },
    { id: "2", student: "Emily Davis", email: "emily@example.com", counsellor: "Michael Brown", date: "2025-07-29", time: "2:00 PM - 3:00 PM", type: "Interview", status: "confirmed" },
    { id: "3", student: "Alex Johnson", email: "alex@example.com", counsellor: "Jennifer Taylor", date: "2025-07-30", time: "9:00 AM - 10:00 AM", type: "Document Review", status: "pending" },
    { id: "4", student: "Sarah Lee", email: "sarah@example.com", counsellor: "Sarah Williams", date: "2025-07-30", time: "11:00 AM - 12:00 PM", type: "Consultation", status: "confirmed" },
    { id: "5", student: "Michael Chen", email: "michael@example.com", counsellor: "Michael Brown", date: "2025-08-01", time: "3:00 PM - 4:00 PM", type: "Follow-up", status: "pending" },
    { id: "6", student: "Lisa Wang", email: "lisa@example.com", counsellor: "Jennifer Taylor", date: "2025-08-02", time: "10:30 AM - 11:30 AM", type: "Interview", status: "confirmed" },
    { id: "7", student: "David Park", email: "david@example.com", counsellor: "Sarah Williams", date: "2025-08-03", time: "2:00 PM - 3:00 PM", type: "Consultation", status: "pending" },
    { id: "8", student: "Anna Smith", email: "anna@example.com", counsellor: "Michael Brown", date: "2025-08-04", time: "9:00 AM - 10:00 AM", type: "Review", status: "confirmed" },
  ];

  const upcomingMeetings = [
    {
      id: "6",
      date: "Tomorrow",
      time: "9:00 AM",
      student: "Lisa Wang",
      counsellor: "Sarah Williams",
      type: "Consultation",
    },
    {
      id: "7",
      date: "Aug 1, 2025",
      time: "2:00 PM",
      student: "David Park",
      counsellor: "Michael Brown",
      type: "Interview",
    },
    {
      id: "8",
      date: "Aug 2, 2025",
      time: "10:30 AM",
      student: "Anna Smith",
      counsellor: "Jennifer Taylor",
      type: "Document Review",
    },
  ];

  const sparklineDataToday: SparklineData[] = [
    { value: 3 }, { value: 5 }, { value: 4 }, { value: 6 }, { value: 5 },
  ];
  const sparklineDataWeek: SparklineData[] = [
    { value: 15 }, { value: 18 }, { value: 20 }, { value: 23 },
  ];
  const sparklineDataSlots: SparklineData[] = [
    { value: 12 }, { value: 15 }, { value: 16 }, { value: 18 },
  ];
  const sparklineDataPending: SparklineData[] = [
    { value: 5 }, { value: 3 }, { value: 2 },
  ];

  const eventStyleGetter = (event: AppointmentEvent) => {
    let backgroundColor = "#2563EB";
    if (event.status === "confirmed") {
      backgroundColor = "#2563EB";
    } else if (event.status === "pending") {
      backgroundColor = "#F59E0B";
    } else if (event.status === "cancelled") {
      backgroundColor = "#EF4444";
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "8px",
        border: "none",
        color: "white",
        fontSize: "12px",
        fontWeight: "500",
      },
    };
  };

  const CustomToolbar = ({ label, onNavigate }: any) => (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold text-[#0F172A]">{label}</h3>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => onNavigate("PREV")}>
          Previous
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onNavigate("TODAY")}>
          Today
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onNavigate("NEXT")}>
          Next
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">Appointments</h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Schedule and manage student consultations
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === "calendar" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setView("calendar")}
          >
            Calendar
          </Button>
          <Button
            variant={view === "list" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setView("list")}
          >
            List View
          </Button>
          <Button variant="primary" size="md">
            New Appointment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Today's Meetings"
          value="5"
          trend={{ value: 12, isPositive: true }}
          sparklineData={sparklineDataToday}
          icon={CalendarIcon}
          iconColor="#2563EB"
          iconBg="bg-[#EEF5FF]"
          comparison="vs yesterday"
        />
        <KPICard
          title="This Week"
          value="23"
          trend={{ value: 8, isPositive: true }}
          sparklineData={sparklineDataWeek}
          icon={CheckCircle}
          iconColor="#22C55E"
          iconBg="bg-[#F0FDF4]"
          comparison="vs last week"
        />
        <KPICard
          title="Available Slots"
          value="18"
          trend={{ value: 5, isPositive: true }}
          sparklineData={sparklineDataSlots}
          icon={Clock3}
          iconColor="#7C3AED"
          iconBg="bg-[#F6F0FF]"
          comparison="this week"
        />
        <KPICard
          title="Pending Confirmations"
          value="2"
          trend={{ value: 50, isPositive: false }}
          sparklineData={sparklineDataPending}
          icon={AlertCircle}
          iconColor="#F59E0B"
          iconBg="bg-[#FFF9EE]"
          comparison="needs action"
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <Card padding="md" className="lg:col-span-2">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
              <Input
                placeholder="Search appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="rounded-xl border border-[#E5E7EB] px-4 py-2 text-sm text-[#0F172A] focus:border-[#2563EB] focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="consultation">Consultation</option>
                <option value="interview">Interview</option>
                <option value="review">Review</option>
                <option value="follow-up">Follow-up</option>
              </select>
              <Button variant="secondary" size="sm">
                Filter
              </Button>
            </div>
          </div>

          {/* Calendar Component */}
          <div className="h-[500px]">
            <Calendar
              localizer={localizer}
              events={mockEvents}
              startAccessor="start"
              endAccessor="end"
              eventPropGetter={eventStyleGetter}
              components={{
                toolbar: () => (
                  <CustomToolbar
                    label={moment().format("MMMM YYYY")}
                    onNavigate={(action: string) => {
                      const today = moment();
                      if (action === "PREV") today.subtract(1, "month");
                      if (action === "NEXT") today.add(1, "month");
                      if (action === "TODAY") today.startOf("month");
                    }}
                  />
                ),
              }}
              views={["month", "week", "day"]}
              defaultView="month"
              className="rounded-xl"
              style={{ height: "420px" }}
            />
          </div>
        </Card>

        {/* Right Sidebar - Today's Meetings */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#0F172A]">Today's Schedule</h3>
              <span className="text-sm font-medium text-[#64748B]">
                {todayMeetings.length} meetings
              </span>
            </div>

            <div className="space-y-3">
              {todayMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-start gap-3 p-3 rounded-xl border border-[#E5E7EB] hover:border-[#2563EB] hover:shadow-sm transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-3.5 w-3.5 text-[#64748B]" />
                      <span className="text-xs font-medium text-[#64748B]">
                        {meeting.time}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[#0F172A] truncate">
                      {meeting.student}
                    </p>
                    <p className="text-xs text-[#64748B] truncate">with {meeting.counsellor}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={meeting.status === "confirmed" ? "success" : "warning"}
                        size="sm"
                      >
                        {meeting.status}
                      </Badge>
                      <span className="text-xs text-[#94A3B8]">{meeting.type}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="rounded-lg p-1.5 text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#2563EB] transition-all">
                      <Video className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg p-1.5 text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#2563EB] transition-all">
                      <Phone className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="ghost" size="sm" className="w-full mt-4">
              View All Appointments
            </Button>
          </Card>

          {/* Upcoming Meetings */}
          <Card padding="md">
            <h3 className="text-lg font-bold text-[#0F172A] mb-4">Upcoming</h3>
            <div className="space-y-3">
              {upcomingMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-start gap-3 p-3 rounded-xl border border-[#E5E7EB] hover:border-[#2563EB] transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0F172A] truncate">
                      {meeting.student}
                    </p>
                    <p className="text-xs text-[#64748B] truncate">with {meeting.counsellor}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-[#94A3B8]">{meeting.date}</span>
                      <span className="text-xs text-[#94A3B8]">•</span>
                      <span className="text-xs text-[#94A3B8]">{meeting.time}</span>
                    </div>
                  </div>
                  <Badge variant="info" size="sm">
                    {meeting.type}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      {view === "list" && (
        <Card padding="md">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <h3 className="text-lg font-bold text-[#0F172A]">All Appointments</h3>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">Export CSV</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#64748B]">Student</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#64748B]">Counsellor</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#64748B]">Date & Time</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#64748B]">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#64748B]">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-[#64748B]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointmentsList.map((apt) => (
                  <tr key={apt.id} className="border-b border-[#E5E7EB] hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm font-semibold text-[#0F172A]">{apt.student}</p>
                        <p className="text-xs text-[#64748B]">{apt.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-[#64748B]">{apt.counsellor}</td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm text-[#0F172A]">{apt.date}</p>
                        <p className="text-xs text-[#64748B]">{apt.time}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-[#64748B]">{apt.type}</span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={apt.status === "confirmed" ? "success" : "warning"} size="sm">{apt.status}</Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-[#EF4444]">Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
