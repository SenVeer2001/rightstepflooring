// pages/StaffProfile.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  FileText,
  DollarSign,
  MessageSquare,
  Upload,
  Download,
  Eye,
  Edit,
  TrendingUp,

  Award,
  ThumbsUp,
  ThumbsDown,
  Ticket,
  AlertCircle,
  AlertTriangle,
  Pause,
  ExternalLink,
  Lock,
  User,
  Building,
  Hash,
  Target,
  Percent,
  Users,
 
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {
  type Staff,
  type StaffStatus,
  type StaffRole,
  type DocumentStatus,
  type TicketStatus,
  type TicketPriority,
  type TicketCategory,
  mockStaff,
} from "../../types/staff";

// Tabs
type ProfileTab = "overview" | "jobs" | "documents" | "payouts" | "feedback" | "tickets";

const tabs: { id: ProfileTab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: Briefcase },
  { id: "jobs", label: "Job History", icon: Clock },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "payouts", label: "Payouts", icon: DollarSign },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
  { id: "tickets", label: "Tickets", icon: Ticket },
];

// Status config
const statusConfig: Record<StaffStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  active: { label: "Active", color: "text-green-700", bg: "bg-green-100", icon: CheckCircle },
  inactive: { label: "Inactive", color: "text-gray-600", bg: "bg-gray-100", icon: XCircle },
  on_leave: { label: "On Leave", color: "text-yellow-700", bg: "bg-yellow-100", icon: Clock },
  terminated: { label: "Terminated", color: "text-red-700", bg: "bg-red-100", icon: Lock },
};

// Role config
const roleConfig: Record<StaffRole, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  admin: { label: "Admin", color: "text-purple-700", bg: "bg-purple-100", icon: Award },
  manager: { label: "Manager", color: "text-blue-700", bg: "bg-blue-100", icon: Briefcase },
  technician: { label: "Technician", color: "text-green-700", bg: "bg-green-100", icon: Users },
  dispatcher: { label: "Dispatcher", color: "text-orange-700", bg: "bg-orange-100", icon: MapPin },
  sales: { label: "Sales", color: "text-pink-700", bg: "bg-pink-100", icon: TrendingUp },
  support: { label: "Support", color: "text-cyan-700", bg: "bg-cyan-100", icon: Users },
  accounting: { label: "Accounting", color: "text-emerald-700", bg: "bg-emerald-100", icon: Calendar },
};

// Document status config
const documentStatusConfig: Record<DocumentStatus, { label: string; color: string; bg: string }> = {
  valid: { label: "Valid", color: "text-green-700", bg: "bg-green-100" },
  expiring_soon: { label: "Expiring Soon", color: "text-yellow-700", bg: "bg-yellow-100" },
  expired: { label: "Expired", color: "text-red-700", bg: "bg-red-100" },
  pending: { label: "Pending Review", color: "text-blue-700", bg: "bg-blue-100" },
  not_uploaded: { label: "Not Uploaded", color: "text-gray-600", bg: "bg-gray-100" },
};

// Ticket configs
const ticketStatusConfig: Record<TicketStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  open: { label: "Open", color: "text-blue-700", bg: "bg-blue-100", icon: AlertCircle },
  in_progress: { label: "In Progress", color: "text-yellow-700", bg: "bg-yellow-100", icon: Clock },
  pending: { label: "Pending", color: "text-orange-700", bg: "bg-orange-100", icon: Pause },
  resolved: { label: "Resolved", color: "text-green-700", bg: "bg-green-100", icon: CheckCircle },
  closed: { label: "Closed", color: "text-gray-600", bg: "bg-gray-100", icon: XCircle },
};

const ticketPriorityConfig: Record<TicketPriority, { label: string; color: string; bg: string; dot: string }> = {
  urgent: { label: "Urgent", color: "text-red-700", bg: "bg-red-100", dot: "bg-red-500" },
  high: { label: "High", color: "text-orange-700", bg: "bg-orange-100", dot: "bg-orange-500" },
  medium: { label: "Medium", color: "text-yellow-700", bg: "bg-yellow-100", dot: "bg-yellow-500" },
  low: { label: "Low", color: "text-green-700", bg: "bg-green-100", dot: "bg-green-500" },
};

const ticketCategoryConfig: Record<TicketCategory, { label: string; color: string; bg: string }> = {
  performance: { label: "Performance", color: "text-purple-700", bg: "bg-purple-100" },
  attendance: { label: "Attendance", color: "text-yellow-700", bg: "bg-yellow-100" },
  behavior: { label: "Behavior", color: "text-orange-700", bg: "bg-orange-100" },
  customer_complaint: { label: "Customer Complaint", color: "text-red-700", bg: "bg-red-100" },
  policy_violation: { label: "Policy Violation", color: "text-red-700", bg: "bg-red-100" },
  other: { label: "Other", color: "text-gray-600", bg: "bg-gray-100" },
};

const documentTypeLabels: Record<string, string> = {
  id_proof: "ID Proof",
  contract: "Employment Contract",
  certification: "Certification",
  license: "License",
  background_check: "Background Check",
  other: "Other Document",
};

const employmentTypeLabels: Record<string, string> = {
  full_time: "Full Time",
  part_time: "Part Time",
  contract: "Contract",
};

// Chart Colors
const CHART_COLORS = {
  primary: "#6366f1",
  secondary: "#8b5cf6",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  gray: "#6b7280",
};

// Format helpers
const formatDate = (date?: Date): string => {
  if (!date) return "N/A";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
};

const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(date);
};

const getDaysUntilExpiry = (date?: Date): number | null => {
  if (!date) return null;
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  return Math.ceil(diffMs / 86400000);
};

// Mock Chart Data Generator
const generateChartData = (staff: Staff) => {
  // Monthly Performance Data (last 6 months)
  const monthlyPerformance = [
    { month: "Aug", jobs: Math.floor(staff.totalJobs / 12), earnings: Math.floor(Math.random() * 3000) + 2000, rating: 4.7, punctuality: 92 },
    { month: "Sep", jobs: Math.floor(staff.totalJobs / 10), earnings: Math.floor(Math.random() * 3000) + 2000, rating: 4.8, punctuality: 94 },
    { month: "Oct", jobs: Math.floor(staff.totalJobs / 11), earnings: Math.floor(Math.random() * 3000) + 2000, rating: 4.6, punctuality: 91 },
    { month: "Nov", jobs: Math.floor(staff.totalJobs / 9), earnings: Math.floor(Math.random() * 3000) + 2000, rating: 4.9, punctuality: 96 },
    { month: "Dec", jobs: Math.floor(staff.totalJobs / 13), earnings: Math.floor(Math.random() * 3000) + 2000, rating: 4.7, punctuality: 93 },
    { month: "Jan", jobs: Math.floor(staff.totalJobs / 10), earnings: Math.floor(Math.random() * 3000) + 2000, rating: staff.rating, punctuality: staff.punctualityScore },
  ];

  // Job Status Distribution
  const jobStatusData = [
    { name: "Completed", value: staff.completedJobs, color: "#22c55e" },
    { name: "In Progress", value: Math.max(staff.totalJobs - staff.completedJobs, 0), color: "#3b82f6" },
    { name: "Scheduled", value: staff.jobs.filter(j => j.status === "scheduled").length, color: "#f59e0b" },
    { name: "Cancelled", value: staff.jobs.filter(j => j.status === "cancelled").length, color: "#ef4444" },
  ].filter(item => item.value > 0);

  // Rating Distribution
  const ratingDistribution = [
    { rating: "5 Star", count: Math.floor(staff.completedJobs * 0.6) },
    { rating: "4 Star", count: Math.floor(staff.completedJobs * 0.25) },
    { rating: "3 Star", count: Math.floor(staff.completedJobs * 0.1) },
    { rating: "2 Star", count: Math.floor(staff.completedJobs * 0.03) },
    { rating: "1 Star", count: Math.floor(staff.completedJobs * 0.02) },
  ];

  // Performance Trend
  const performanceTrend = [
    { month: "Aug", quality: 94, punctuality: 92, attendance: 95 },
    { month: "Sep", quality: 96, punctuality: 94, attendance: 97 },
    { month: "Oct", quality: 93, punctuality: 91, attendance: 94 },
    { month: "Nov", quality: 98, punctuality: 96, attendance: 98 },
    { month: "Dec", quality: 95, punctuality: 93, attendance: 96 },
    { month: "Jan", quality: staff.qualityScore, punctuality: staff.punctualityScore, attendance: staff.attendanceRate },
  ];

  // Weekly Hours
  const weeklyHours = [
    { week: "W1", hours: 40 },
    { week: "W2", hours: 42 },
    { week: "W3", hours: 38 },
    { week: "W4", hours: 44 },
    { week: "W5", hours: 40 },
    { week: "W6", hours: 41 },
    { week: "W7", hours: 39 },
    { week: "W8", hours: 40 },
  ];

  return {
    monthlyPerformance,
    jobStatusData,
    ratingDistribution,
    performanceTrend,
    weeklyHours,
  };
};

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 shadow-lg rounded-lg border border-gray-200">
        <p className="text-xs font-semibold text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function StaffProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");

  const staffMember = mockStaff.find((s) => s.id === id);

  if (!staffMember) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Staff member not found</p>
          <button onClick={() => navigate("/staff")} className="mt-4 text-primary hover:underline">
            Back to list
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[staffMember.status];
  const roleInfo = roleConfig[staffMember.role];
  const StatusIcon = statusInfo.icon;
  const RoleIcon = roleInfo.icon;

  const openTickets = staffMember.tickets.filter((t) => t.status === "open" || t.status === "in_progress").length;
  const urgentTickets = staffMember.tickets.filter((t) => t.priority === "urgent" && t.status !== "closed" && t.status !== "resolved").length;

  const chartData = generateChartData(staffMember);

  const getTabCount = (tabId: ProfileTab): number | undefined => {
    switch (tabId) {
      case "jobs": return staffMember.jobs.length;
      case "documents": return staffMember.documents.length;
      case "payouts": return staffMember.payouts.length;
      case "feedback": return staffMember.feedback.length;
      case "tickets": return staffMember.tickets.length;
      default: return undefined;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-4">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Back Button */}
        <button
          onClick={() => navigate("/staff")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft size={16} />
          Back to Staff
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              {staffMember.avatar ? (
                <img src={staffMember.avatar} alt={`${staffMember.firstName} ${staffMember.lastName}`} className="w-24 h-24 rounded-xl object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">
                    {staffMember.firstName[0]}{staffMember.lastName[0]}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-bold text-gray-900">{staffMember.firstName} {staffMember.lastName}</h1>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                      <StatusIcon size={12} />
                      {statusInfo.label}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${roleInfo.bg} ${roleInfo.color}`}>
                      <RoleIcon size={12} />
                      {roleInfo.label}
                    </span>
                    {openTickets > 0 && (
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${urgentTickets > 0 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        <Ticket size={12} />
                        {openTickets} Open Ticket{openTickets > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full flex items-center gap-1">
                      <Hash size={12} />
                      {staffMember.employeeId}
                    </span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full flex items-center gap-1">
                      <Building size={12} />
                      {staffMember.department}
                    </span>
                    {staffMember.rating > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-gray-900">{staffMember.rating}</span>
                        <span className="text-gray-500">({staffMember.completedJobs} jobs)</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Mail size={14} className="text-gray-400" />
                      {staffMember.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone size={14} className="text-gray-400" />
                      {staffMember.phone}
                    </span>
                    {staffMember.city && (
                      <span className="flex items-center gap-1">
                        <MapPin size={14} className="text-gray-400" />
                        {staffMember.city}, {staffMember.state}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar size={14} className="text-gray-400" />
                      Joined {formatDate(staffMember.hireDate)}
                    </span>
                  </div>

                  {staffMember.managerName && (
                    <div className="mt-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <User size={14} className="text-gray-400" />
                        Reports to: <span className="font-medium text-gray-900">{staffMember.managerName}</span>
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                    <Edit size={14} />
                    Edit
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition">
                    <Briefcase size={14} />
                    Assign Job
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex gap-1 p-1.5 border-b overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const count = getTabCount(tab.id);
              const isTicketTab = tab.id === "tickets";
              const hasUrgent = isTicketTab && urgentTickets > 0;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                    activeTab === tab.id ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  {count !== undefined && count > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      activeTab === tab.id ? "bg-white/20 text-white" : hasUrgent ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Quick Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <Briefcase size={20} className="text-blue-600" />
                      <TrendingUp size={14} className="text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{staffMember.totalJobs}</p>
                    <p className="text-xs text-gray-600 mt-1">Total Jobs</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <Star size={20} className="text-yellow-500 fill-yellow-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{staffMember.rating || "N/A"}</p>
                    <p className="text-xs text-gray-600 mt-1">Average Rating</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <Award size={20} className="text-purple-600" />
                      <TrendingUp size={14} className="text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{staffMember.qualityScore}%</p>
                    <p className="text-xs text-gray-600 mt-1">Quality Score</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <Target size={20} className="text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{staffMember.attendanceRate}%</p>
                    <p className="text-xs text-gray-600 mt-1">Attendance Rate</p>
                  </div>
                </div>

                {/* Performance Metrics Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Percent size={16} className="text-green-600" />
                      <span className="text-xs font-medium text-gray-500">Punctuality</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-xl font-bold text-gray-900">{staffMember.punctualityScore}%</span>
                      <TrendingUp size={14} className="text-green-500 mb-1" />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ThumbsUp size={16} className="text-blue-600" />
                      <span className="text-xs font-medium text-gray-500">Customer Satisfaction</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-xl font-bold text-gray-900">{staffMember.customerSatisfaction}%</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase size={16} className="text-purple-600" />
                      <span className="text-xs font-medium text-gray-500">Employment Type</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{employmentTypeLabels[staffMember.employmentType]}</span>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign size={16} className="text-green-600" />
                      <span className="text-xs font-medium text-gray-500">Compensation</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {staffMember.hourlyRate ? `$${staffMember.hourlyRate}/hr` : staffMember.salary ? formatCurrency(staffMember.salary) + "/yr" : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Charts Row 1 */}
                {staffMember.totalJobs > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Job Status Distribution */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-900">Job Status Distribution</h3>
                      </div>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={chartData.jobStatusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {chartData.jobStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                          <Legend
                            layout="vertical"
                            align="right"
                            verticalAlign="middle"
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ fontSize: "11px" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Performance Trend */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-900">Performance Trend</h3>
                        <span className="text-xs text-gray-500">Last 6 months</span>
                      </div>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={chartData.performanceTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} domain={[80, 100]} />
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                          <Line type="monotone" dataKey="quality" stroke={CHART_COLORS.success} strokeWidth={2} dot={{ r: 4 }} name="Quality" />
                          <Line type="monotone" dataKey="punctuality" stroke={CHART_COLORS.info} strokeWidth={2} dot={{ r: 4 }} name="Punctuality" />
                          <Line type="monotone" dataKey="attendance" stroke={CHART_COLORS.warning} strokeWidth={2} dot={{ r: 4 }} name="Attendance" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Charts Row 2 */}
                {staffMember.totalJobs > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly Jobs */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-900">Monthly Jobs</h3>
                        <span className="text-xs text-gray-500">Last 6 months</span>
                      </div>
                      <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={chartData.monthlyPerformance}>
                          <defs>
                            <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                              <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Area type="monotone" dataKey="jobs" stroke={CHART_COLORS.primary} strokeWidth={2} fillOpacity={1} fill="url(#colorJobs)" name="Jobs" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Weekly Hours */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-900">Weekly Hours</h3>
                        <span className="text-xs text-gray-500">Last 8 weeks</span>
                      </div>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={chartData.weeklyHours}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                          <RechartsTooltip formatter={(value: number) => [`${value} hrs`, "Hours"]} contentStyle={{ fontSize: "12px" }} />
                          <Bar dataKey="hours" fill={CHART_COLORS.info} radius={[4, 4, 0, 0]} name="Hours" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Skills & Certifications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {staffMember.skills.length > 0 ? (
                        staffMember.skills.map((skill) => (
                          <span key={skill} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400">No skills listed</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {staffMember.certifications.length > 0 ? (
                        staffMember.certifications.map((cert) => (
                          <span key={cert} className="px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg flex items-center gap-1">
                            <Award size={12} />
                            {cert}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400">No certifications</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Job History Tab */}
            {activeTab === "jobs" && (
              <div className="space-y-4">
                {staffMember.jobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase size={40} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm text-gray-500">No job history yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Job #</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Title</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Client</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Date</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Role</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Hours</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Rating</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {staffMember.jobs.map((job) => (
                          <tr key={job.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-primary">{job.jobNumber}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{job.title}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{job.clientName}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{formatDate(job.date)}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{job.role}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                job.status === "completed" ? "bg-green-100 text-green-700" :
                                job.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                                job.status === "scheduled" ? "bg-yellow-100 text-yellow-700" :
                                "bg-gray-100 text-gray-600"
                              }`}>
                                {job.status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{job.hoursWorked || "—"}</td>
                            <td className="px-4 py-3">
                              {job.rating ? (
                                <div className="flex items-center gap-1">
                                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                  <span className="text-sm font-medium">{job.rating}</span>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === "documents" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-900">Employee Documents</h3>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90 transition">
                    <Upload size={14} />
                    Upload Document
                  </button>
                </div>

                {staffMember.documents.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText size={40} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm text-gray-500">No documents uploaded</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Document</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Type</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Uploaded</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Expires</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {staffMember.documents.map((doc) => {
                          const docStatus = documentStatusConfig[doc.status];
                          const daysLeft = getDaysUntilExpiry(doc.expiresAt);
                          return (
                            <tr key={doc.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{doc.name}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{documentTypeLabels[doc.type]}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{formatDate(doc.uploadedAt)}</td>
                              <td className="px-4 py-3">
                                {doc.expiresAt ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">{formatDate(doc.expiresAt)}</span>
                                    {daysLeft !== null && (
                                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                        daysLeft > 30 ? "bg-green-100 text-green-700" :
                                        daysLeft > 0 ? "bg-yellow-100 text-yellow-700" :
                                        "bg-red-100 text-red-700"
                                      }`}>
                                        {daysLeft > 0 ? `${daysLeft}d left` : "Expired"}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-sm text-gray-400">N/A</span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${docStatus.bg} ${docStatus.color}`}>
                                  {docStatus.label}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button className="p-1.5 hover:bg-gray-100 rounded-lg"><Eye size={14} className="text-gray-500" /></button>
                                  <button className="p-1.5 hover:bg-gray-100 rounded-lg"><Download size={14} className="text-gray-500" /></button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Payouts Tab */}
            {activeTab === "payouts" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(staffMember.payouts.reduce((sum, p) => sum + p.amount, 0))}</p>
                    <p className="text-xs text-gray-500">Total Paid</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-gray-900">{staffMember.payouts.length}</p>
                    <p className="text-xs text-gray-500">Total Payouts</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-green-600">{staffMember.payouts.filter((p) => p.status === "paid").length}</p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-yellow-600">{staffMember.payouts.filter((p) => p.status === "pending").length}</p>
                    <p className="text-xs text-gray-500">Pending</p>
                  </div>
                </div>

                {staffMember.payouts.length === 0 ? (
                  <div className="text-center py-12">
                    <DollarSign size={40} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm text-gray-500">No payout history yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Date</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Reference</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Type</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Period</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {staffMember.payouts.map((payout) => (
                          <tr key={payout.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-600">{formatDate(payout.date)}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{payout.reference || "—"}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                payout.type === "salary" ? "bg-blue-100 text-blue-700" :
                                payout.type === "bonus" ? "bg-green-100 text-green-700" :
                                payout.type === "commission" ? "bg-purple-100 text-purple-700" :
                                payout.type === "overtime" ? "bg-orange-100 text-orange-700" :
                                "bg-gray-100 text-gray-700"
                              }`}>
                                {payout.type.charAt(0).toUpperCase() + payout.type.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{payout.period || "—"}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                payout.status === "paid" ? "bg-green-100 text-green-700" :
                                payout.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"
                              }`}>
                                {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-semibold">{formatCurrency(payout.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Feedback Tab */}
            {activeTab === "feedback" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Star size={20} className="text-yellow-500 fill-yellow-500" />
                      <p className="text-2xl font-bold text-gray-900">{staffMember.rating || "N/A"}</p>
                    </div>
                    <p className="text-xs text-gray-500">Average Rating</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-gray-900">{staffMember.feedback.length}</p>
                    <p className="text-xs text-gray-500">Total Reviews</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2">
                      <ThumbsUp size={16} className="text-green-500" />
                      <p className="text-2xl font-bold text-green-600">{staffMember.feedback.filter((f) => f.type === "positive").length}</p>
                    </div>
                    <p className="text-xs text-gray-500">Positive</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2">
                      <ThumbsDown size={16} className="text-red-500" />
                      <p className="text-2xl font-bold text-red-600">{staffMember.feedback.filter((f) => f.type === "negative").length}</p>
                    </div>
                    <p className="text-xs text-gray-500">Negative</p>
                  </div>
                </div>

                {staffMember.feedback.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare size={40} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm text-gray-500">No feedback yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {staffMember.feedback.map((fb) => (
                      <div key={fb.id} className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">{fb.clientName}</span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">{fb.jobNumber}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} className={i < fb.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              fb.type === "positive" ? "bg-green-100 text-green-700" :
                              fb.type === "negative" ? "bg-red-100 text-red-700" :
                              "bg-gray-100 text-gray-600"
                            }`}>
                              {fb.type.charAt(0).toUpperCase() + fb.type.slice(1)}
                            </span>
                            <span className="text-xs text-gray-500">{formatDate(fb.date)}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-3">{fb.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tickets Tab */}
            {activeTab === "tickets" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-gray-900">{staffMember.tickets.length}</p>
                    <p className="text-xs text-gray-500">Total Tickets</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-blue-500" />
                      <p className="text-2xl font-bold text-blue-600">{staffMember.tickets.filter((t) => t.status === "open").length}</p>
                    </div>
                    <p className="text-xs text-gray-500">Open</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-yellow-500" />
                      <p className="text-2xl font-bold text-yellow-600">{staffMember.tickets.filter((t) => t.status === "in_progress").length}</p>
                    </div>
                    <p className="text-xs text-gray-500">In Progress</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} className="text-red-500" />
                      <p className="text-2xl font-bold text-red-600">{urgentTickets}</p>
                    </div>
                    <p className="text-xs text-gray-500">Urgent</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500" />
                      <p className="text-2xl font-bold text-green-600">{staffMember.tickets.filter((t) => t.status === "resolved" || t.status === "closed").length}</p>
                    </div>
                    <p className="text-xs text-gray-500">Resolved</p>
                  </div>
                </div>

                {staffMember.tickets.length === 0 ? (
                  <div className="text-center py-12">
                    <Ticket size={40} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm text-gray-500 font-medium">No tickets</p>
                    <p className="text-xs text-gray-400 mt-1">This staff member has a clean record!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Ticket #</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Subject</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Category</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Priority</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Job</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Created</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {staffMember.tickets.map((ticket) => {
                          const ticketStatus = ticketStatusConfig[ticket.status];
                          const ticketPriority = ticketPriorityConfig[ticket.priority];
                          const ticketCategory = ticketCategoryConfig[ticket.category];
                          const TicketStatusIcon = ticketStatus.icon;

                          return (
                            <tr key={ticket.id} className="hover:bg-gray-50 transition">
                              <td className="px-4 py-3">
                                <span className="text-sm font-medium text-primary">{ticket.ticketNumber}</span>
                              </td>
                              <td className="px-4 py-3">
                                <p className="text-sm text-gray-900 line-clamp-1 max-w-[200px]">{ticket.subject}</p>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${ticketCategory.bg} ${ticketCategory.color}`}>
                                  {ticketCategory.label}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1.5">
                                  <span className={`w-2 h-2 rounded-full ${ticketPriority.dot}`} />
                                  <span className={`text-xs font-medium ${ticketPriority.color}`}>{ticketPriority.label}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${ticketStatus.bg} ${ticketStatus.color}`}>
                                  <TicketStatusIcon size={12} />
                                  {ticketStatus.label}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                {ticket.jobNumber ? (
                                  <span className="text-xs text-primary font-medium">{ticket.jobNumber}</span>
                                ) : (
                                  <span className="text-xs text-gray-400">—</span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-xs text-gray-600">{formatRelativeTime(ticket.createdAt)}</span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                                  className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                                >
                                  <ExternalLink size={14} className="text-gray-500" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Tooltip id="profile-tooltip" place="top" className="!bg-gray-800 !text-white !text-[10px] !px-2 !py-1 !rounded" />
    </div>
  );
}