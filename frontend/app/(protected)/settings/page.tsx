"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { User, Bell, Shield, Palette, Globe, Mail, Phone, MapPin } from "lucide-react";

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A]">Settings</h1>
          <p className="mt-1 text-sm text-[#64748B]">Loading...</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#0F172A]">Settings</h1>
        <p className="mt-1 text-sm text-[#64748B]">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Navigation */}
        <div className="lg:col-span-1">
          <Card padding="md">
            <nav className="space-y-2">
              {[
                { icon: User, label: "Profile", active: true },
                { icon: Bell, label: "Notifications", active: false },
                { icon: Shield, label: "Security", active: false },
                { icon: Palette, label: "Appearance", active: false },
                { icon: Globe, label: "Language", active: false },
              ].map((item, idx) => (
                <button
                  key={idx}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    item.active
                      ? "bg-[#EEF5FF] text-[#1565D8]"
                      : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Right Column - Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card padding="md">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <p className="text-sm text-[#64748B]">Update your personal information and contact details</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-2xl font-bold text-white">
                    {user?.fullName?.split(" ").map(n => n[0]).join("") || "JD"}
                  </div>
                  <div>
                    <Button variant="secondary" size="sm">
                      Change Avatar
                    </Button>
                    <p className="text-xs text-[#64748B] mt-1">JPG, PNG or GIF. Max 2MB</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Full Name"
                    defaultValue={user?.fullName || "John Doe"}
                    icon={<User className="h-4 w-4" />}
                  />
                  <Input
                    label="Email"
                    type="email"
                    defaultValue={user?.email || "john@example.com"}
                    icon={<Mail className="h-4 w-4" />}
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    defaultValue="+1 234 567 8900"
                    icon={<Phone className="h-4 w-4" />}
                  />
                  <Input
                    label="Location"
                    defaultValue="New York, USA"
                    icon={<MapPin className="h-4 w-4" />}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="secondary">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card padding="md">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <p className="text-sm text-[#64748B]">Manage how you receive notifications</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Email Notifications", description: "Receive email updates about applications", enabled: true },
                  { title: "Push Notifications", description: "Receive push notifications in browser", enabled: true },
                  { title: "SMS Alerts", description: "Get SMS alerts for urgent updates", enabled: false },
                  { title: "Weekly Reports", description: "Receive weekly summary reports", enabled: true },
                ].map((setting, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-xl border border-[#E5E7EB] p-4">
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">{setting.title}</p>
                      <p className="text-xs text-[#64748B]">{setting.description}</p>
                    </div>
                    <button
                      className={`relative h-6 w-11 rounded-full transition-all ${
                        setting.enabled ? "bg-[#2563EB]" : "bg-[#E2E8F0]"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
                          setting.enabled ? "left-5.5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card padding="md">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <p className="text-sm text-[#64748B]">Manage your password and security settings</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-[#E5E7EB] p-4">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">Password</p>
                    <p className="text-xs text-[#64748B]">Last changed 30 days ago</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Change Password
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[#E5E7EB] p-4">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">Two-Factor Authentication</p>
                    <p className="text-xs text-[#64748B]">Add an extra layer of security</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Enable
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[#E5E7EB] p-4">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">Active Sessions</p>
                    <p className="text-xs text-[#64748B]">Manage your active sessions</p>
                  </div>
                  <Badge variant="success">2 Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card padding="md">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <p className="text-sm text-[#64748B]">Customize the look and feel of your dashboard</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-[#E5E7EB] p-4">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">Theme</p>
                    <p className="text-xs text-[#64748B]">Choose your preferred theme</p>
                  </div>
                  <select className="h-10 rounded-[12px] border border-[#E5E7EB] bg-white px-4 pr-10 text-sm text-[#0F172A] outline-none transition-all hover:border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15">
                    <option>Light</option>
                    <option>Dark</option>
                    <option>System</option>
                  </select>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[#E5E7EB] p-4">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">Language</p>
                    <p className="text-xs text-[#64748B]">Select your preferred language</p>
                  </div>
                  <select className="h-10 rounded-[12px] border border-[#E5E7EB] bg-white px-4 pr-10 text-sm text-[#0F172A] outline-none transition-all hover:border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15">
                    <option>English (US)</option>
                    <option>English (UK)</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}