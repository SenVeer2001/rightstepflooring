// pages/SubcontractorProfile.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Shield,
  ShieldAlert,
  ShieldX,
  ShieldQuestion,
  Lock,
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
  TrendingDown,
  RefreshCw,
  Award,
  Zap,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  Ticket,
  AlertCircle,
  AlertTriangle,
  Pause,
  ExternalLink,
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
  type Subcontractor,
  type SubcontractorStatus,
  type InsuranceStatus,
  type DocumentStatus,
  type TicketStatus,
  type TicketPriority,
  type TicketCategory,
  mockSubcontractors,
} from "../../types/subcontractor";

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
const statusConfig: Record<SubcontractorStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  active: { label: "Active", color: "text-green-700", bg: "bg-green-100", icon: CheckCircle },
  inactive: { label: "Inactive", color: "text-gray-600", bg: "bg-gray-100", icon: XCircle },
  locked: { label: "Locked", color: "text-red-700", bg: "bg-red-100", icon: Lock },
  pending: { label: "Pending", color: "text-yellow-700", bg: "bg-yellow-100", icon: Clock },
};

// Insurance config
const insuranceConfig: Record<InsuranceStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  valid: { label: "Valid", color: "text-green-700", bg: "bg-green-100", icon: Shield },
  expiring_soon: { label: "Expiring Soon", color: "text-yellow-700", bg: "bg-yellow-100", icon: ShieldAlert },
  expired: { label: "Expired", color: "text-red-700", bg: "bg-red-100", icon: ShieldX },
  not_uploaded: { label: "Not Uploaded", color: "text-gray-600", bg: "bg-gray-100", icon: ShieldQuestion },
  pending: { label: "Pending Review", color: "text-blue-700", bg: "bg-blue-100", icon: HelpCircle },
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
  quality: { label: "Quality Issue", color: "text-purple-700", bg: "bg-purple-100" },
  delay: { label: "Delay", color: "text-yellow-700", bg: "bg-yellow-100" },
  no_show: { label: "No Show", color: "text-red-700", bg: "bg-red-100" },
  behavior: { label: "Behavior", color: "text-orange-700", bg: "bg-orange-100" },
  damage: { label: "Damage", color: "text-red-700", bg: "bg-red-100" },
  billing: { label: "Billing", color: "text-green-700", bg: "bg-green-100" },
  other: { label: "Other", color: "text-gray-600", bg: "bg-gray-100" },
};

const documentTypeLabels: Record<string, string> = {
  insurance: "Insurance Certificate",
  w9: "W-9 Form",
  contract: "Subcontractor Agreement",
  license: "Trade License",
  other: "Other Document",
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

const PIE_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

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
const generateChartData = (subcontractor: Subcontractor) => {
  // Monthly Performance Data (last 6 months)
  const monthlyPerformance = [
    { month: "Aug", jobs: 22, earnings: 8500, rating: 4.7, punctuality: 92 },
    { month: "Sep", jobs: 28, earnings: 11200, rating: 4.8, punctuality: 94 },
    { month: "Oct", jobs: 25, earnings: 9800, rating: 4.6, punctuality: 91 },
    { month: "Nov", jobs: 31, earnings: 13500, rating: 4.9, punctuality: 96 },
    { month: "Dec", jobs: 19, earnings: 7200, rating: 4.7, punctuality: 93 },
    { month: "Jan", jobs: 26, earnings: 10400, rating: 4.8, punctuality: 95 },
  ];

  // Job Status Distribution
  const jobStatusData = [
    { name: "Completed", value: subcontractor.completedJobs, color: "#22c55e" },
    { name: "In Progress", value: Math.max(subcontractor.totalJobs - subcontractor.completedJobs, 0), color: "#3b82f6" },
    { name: "Scheduled", value: Math.floor(Math.random() * 5) + 2, color: "#f59e0b" },
    { name: "Cancelled", value: Math.floor(Math.random() * 3), color: "#ef4444" },
  ];

  // Rating Distribution
  const ratingDistribution = [
    { rating: "5 Star", count: Math.floor(subcontractor.completedJobs * 0.6) },
    { rating: "4 Star", count: Math.floor(subcontractor.completedJobs * 0.25) },
    { rating: "3 Star", count: Math.floor(subcontractor.completedJobs * 0.1) },
    { rating: "2 Star", count: Math.floor(subcontractor.completedJobs * 0.03) },
    { rating: "1 Star", count: Math.floor(subcontractor.completedJobs * 0.02) },
  ];

  // Ticket Category Distribution
  const ticketCategories = [
    { name: "Quality", value: subcontractor.tickets.filter(t => t.category === "quality").length, color: "#8b5cf6" },
    { name: "Delay", value: subcontractor.tickets.filter(t => t.category === "delay").length, color: "#f59e0b" },
    { name: "No Show", value: subcontractor.tickets.filter(t => t.category === "no_show").length, color: "#ef4444" },
    { name: "Behavior", value: subcontractor.tickets.filter(t => t.category === "behavior").length, color: "#f97316" },
    { name: "Damage", value: subcontractor.tickets.filter(t => t.category === "damage").length, color: "#dc2626" },
    { name: "Billing", value: subcontractor.tickets.filter(t => t.category === "billing").length, color: "#22c55e" },
    { name: "Other", value: subcontractor.tickets.filter(t => t.category === "other").length, color: "#6b7280" },
  ].filter(item => item.value > 0);

  // Weekly Earnings (last 8 weeks)
  const weeklyEarnings = [
    { week: "W1", earnings: 2100 },
    { week: "W2", earnings: 2800 },
    { week: "W3", earnings: 1900 },
    { week: "W4", earnings: 3200 },
    { week: "W5", earnings: 2600 },
    { week: "W6", earnings: 2900 },
    { week: "W7", earnings: 3100 },
    { week: "W8", earnings: 2400 },
  ];

  // Performance Trend
  const performanceTrend = [
    { month: "Aug", quality: 94, punctuality: 92, callback: 3.2 },
    { month: "Sep", quality: 96, punctuality: 94, callback: 2.8 },
    { month: "Oct", quality: 93, punctuality: 91, callback: 3.5 },
    { month: "Nov", quality: 98, punctuality: 96, callback: 2.2 },
    { month: "Dec", quality: 95, punctuality: 93, callback: 2.9 },
    { month: "Jan", quality: subcontractor.qualityScore, punctuality: subcontractor.punctualityScore, callback: subcontractor.callbackRate },
  ];

  return {
    monthlyPerformance,
    jobStatusData,
    ratingDistribution,
    ticketCategories,
    weeklyEarnings,
    performanceTrend,
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
            {entry.name === "earnings" || entry.name === "Earnings" ? "" : ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function SubcontractorProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");

  const subcontractor = mockSubcontractors.find((s) => s.id === id);

  if (!subcontractor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Subcontractor not found</p>
          <button onClick={() => navigate("/subcontractors")} className="mt-4 text-primary hover:underline">
            Back to list
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[subcontractor.status];
  const insuranceInfo = insuranceConfig[subcontractor.insuranceStatus];

  if (!statusInfo || !insuranceInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Error loading data</p>
          <button onClick={() => navigate("/subcontractors")} className="mt-4 text-primary hover:underline">
            Back to list
          </button>
        </div>
      </div>
    );
  }

  const StatusIcon = statusInfo.icon;
  const InsuranceIcon = insuranceInfo.icon;

  const openTickets = subcontractor.tickets.filter((t) => t.status === "open" || t.status === "in_progress").length;
  const urgentTickets = subcontractor.tickets.filter((t) => t.priority === "urgent" && t.status !== "closed" && t.status !== "resolved").length;

  const chartData = generateChartData(subcontractor);

  const getTabCount = (tabId: ProfileTab): number | undefined => {
    switch (tabId) {
      case "jobs": return subcontractor.jobs.length;
      case "documents": return subcontractor.documents.length;
      case "payouts": return subcontractor.payouts.length;
      case "feedback": return subcontractor.feedback.length;
      case "tickets": return subcontractor.tickets.length;
      default: return undefined;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Back Button */}
        <button
          onClick={() => navigate("/subcontractors")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft size={16} />
          Back to Subcontractors
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              {subcontractor.avatar ? (
                <img src={subcontractor.avatar} alt={subcontractor.name} className="w-24 h-24 rounded-xl object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">
                    {subcontractor.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-bold text-gray-900">{subcontractor.name}</h1>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                      <StatusIcon size={12} />
                      {statusInfo.label}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${insuranceInfo.bg} ${insuranceInfo.color}`}>
                      <InsuranceIcon size={12} />
                      {insuranceInfo.label}
                    </span>
                    {openTickets > 0 && (
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${urgentTickets > 0 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        <Ticket size={12} />
                        {openTickets} Open Ticket{openTickets > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                      {subcontractor.trade}
                    </span>
                    <div className="flex items-center gap-1 text-sm">
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-gray-900">{subcontractor.rating}</span>
                      <span className="text-gray-500">({subcontractor.completedJobs} jobs)</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Mail size={14} className="text-gray-400" />
                      {subcontractor.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone size={14} className="text-gray-400" />
                      {subcontractor.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-gray-400" />
                      {subcontractor.serviceAreas.join(", ")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} className="text-gray-400" />
                      Joined {formatDate(subcontractor.joinedAt)}
                    </span>
                  </div>
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
            {/* Overview Tab with Charts */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Quick Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <Briefcase size={20} className="text-blue-600" />
                      <TrendingUp size={14} className="text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{subcontractor.totalJobs}</p>
                    <p className="text-xs text-gray-600 mt-1">Total Jobs</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <Star size={20} className="text-yellow-500 fill-yellow-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{subcontractor.rating}</p>
                    <p className="text-xs text-gray-600 mt-1">Average Rating</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <Award size={20} className="text-purple-600" />
                      <TrendingUp size={14} className="text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{subcontractor.qualityScore}%</p>
                    <p className="text-xs text-gray-600 mt-1">Quality Score</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <Ticket size={20} className="text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{subcontractor.tickets.length}</p>
                    <p className="text-xs text-gray-600 mt-1">Total Tickets</p>
                  </div>
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Monthly Performance Chart */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-900">Monthly Performance</h3>
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
                        <Area
                          type="monotone"
                          dataKey="jobs"
                          stroke={CHART_COLORS.primary}
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorJobs)"
                          name="Jobs"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

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
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Weekly Earnings */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-900">Weekly Earnings</h3>
                      <span className="text-xs text-gray-500">Last 8 weeks</span>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={chartData.weeklyEarnings}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                        <RechartsTooltip
                          formatter={(value: number) => [`$${value.toLocaleString()}`, "Earnings"]}
                          contentStyle={{ fontSize: "12px" }}
                        />
                        <Bar dataKey="earnings" fill={CHART_COLORS.success} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                 {/*  */}

                 <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-900">Performance Trend</h3>
                      <span className="text-xs text-gray-500">Quality & Punctuality</span>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={chartData.performanceTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} domain={[80, 100]} />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                        <Line
                          type="monotone"
                          dataKey="quality"
                          stroke={CHART_COLORS.success}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          name="Quality"
                        />
                        <Line
                          type="monotone"
                          dataKey="punctuality"
                          stroke={CHART_COLORS.info}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          name="Punctuality"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              
              


                {/* Trades & Service Areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Trades & Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {subcontractor.trades.map((trade) => (
                        <span key={trade} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg">
                          {trade}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Service Areas</h3>
                    <div className="flex flex-wrap gap-2">
                      {subcontractor.serviceAreas.map((area) => (
                        <span key={area} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg flex items-center gap-1">
                          <MapPin size={12} />
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Job History Tab */}
            {activeTab === "jobs" && (
              <div className="space-y-4">
                {subcontractor.jobs.length === 0 ? (
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
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Rating</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {subcontractor.jobs.map((job) => (
                          <tr key={job.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-primary">{job.jobNumber}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{job.title}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{job.clientName}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{formatDate(job.date)}</td>
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
                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                              {formatCurrency(job.amount)}
                            </td>
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
                  <h3 className="text-sm font-semibold text-gray-900">Required Documents</h3>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90 transition">
                    <Upload size={14} />
                    Upload Document
                  </button>
                </div>

                <div className="grid gap-4">
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Shield size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">Liability Insurance</h4>
                          <p className="text-xs text-gray-500 mt-0.5">Required for all jobs</p>
                          {subcontractor.insuranceExpiry && (
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-600">Expires: {formatDate(subcontractor.insuranceExpiry)}</span>
                              {getDaysUntilExpiry(subcontractor.insuranceExpiry) !== null && (
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                  getDaysUntilExpiry(subcontractor.insuranceExpiry)! > 30 ? "bg-green-100 text-green-700" :
                                  getDaysUntilExpiry(subcontractor.insuranceExpiry)! > 0 ? "bg-yellow-100 text-yellow-700" :
                                  "bg-red-100 text-red-700"
                                }`}>
                                  {getDaysUntilExpiry(subcontractor.insuranceExpiry)! > 0
                                    ? `${getDaysUntilExpiry(subcontractor.insuranceExpiry)} days left`
                                    : "Expired"}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${insuranceConfig[subcontractor.insuranceStatus].bg} ${insuranceConfig[subcontractor.insuranceStatus].color}`}>
                          {insuranceConfig[subcontractor.insuranceStatus].label}
                        </span>
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg"><Eye size={14} className="text-gray-500" /></button>
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg"><Download size={14} className="text-gray-500" /></button>
                      </div>
                    </div>
                  </div>

                  {subcontractor.documents.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">All Documents</h3>
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
                            {subcontractor.documents.map((doc) => {
                              const docStatus = documentStatusConfig[doc.status];
                              return (
                                <tr key={doc.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{doc.name}</td>
                                  <td className="px-4 py-3 text-sm text-gray-600">{documentTypeLabels[doc.type]}</td>
                                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(doc.uploadedAt)}</td>
                                  <td className="px-4 py-3 text-sm text-gray-600">{doc.expiresAt ? formatDate(doc.expiresAt) : "N/A"}</td>
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
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payouts Tab */}
            {activeTab === "payouts" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(subcontractor.payouts.reduce((sum, p) => sum + p.amount, 0))}</p>
                    <p className="text-xs text-gray-500">Total Paid</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-gray-900">{subcontractor.payouts.length}</p>
                    <p className="text-xs text-gray-500">Total Payouts</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-green-600">{subcontractor.payouts.filter((p) => p.status === "paid").length}</p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-yellow-600">{subcontractor.payouts.filter((p) => p.status === "pending").length}</p>
                    <p className="text-xs text-gray-500">Pending</p>
                  </div>
                </div>

                {subcontractor.payouts.length === 0 ? (
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
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Job</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Method</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {subcontractor.payouts.map((payout) => (
                          <tr key={payout.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-600">{formatDate(payout.date)}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{payout.reference || "—"}</td>
                            <td className="px-4 py-3 text-sm text-primary">{payout.jobNumber || "—"}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 capitalize">{payout.method.replace("_", " ")}</td>
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
                      <p className="text-2xl font-bold text-gray-900">{subcontractor.rating}</p>
                    </div>
                    <p className="text-xs text-gray-500">Average Rating</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-gray-900">{subcontractor.feedback.length}</p>
                    <p className="text-xs text-gray-500">Total Reviews</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2">
                      <ThumbsUp size={16} className="text-green-500" />
                      <p className="text-2xl font-bold text-green-600">{subcontractor.feedback.filter((f) => f.type === "positive").length}</p>
                    </div>
                    <p className="text-xs text-gray-500">Positive</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2">
                      <ThumbsDown size={16} className="text-red-500" />
                      <p className="text-2xl font-bold text-red-600">{subcontractor.feedback.filter((f) => f.type === "negative").length}</p>
                    </div>
                    <p className="text-xs text-gray-500">Negative</p>
                  </div>
                </div>

                {subcontractor.feedback.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare size={40} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm text-gray-500">No feedback yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {subcontractor.feedback.map((fb) => (
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
                          <span className="text-xs text-gray-500">{formatDate(fb.date)}</span>
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
                    <p className="text-2xl font-bold text-gray-900">{subcontractor.tickets.length}</p>
                    <p className="text-xs text-gray-500">Total Tickets</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-blue-500" />
                      <p className="text-2xl font-bold text-blue-600">{subcontractor.tickets.filter((t) => t.status === "open").length}</p>
                    </div>
                    <p className="text-xs text-gray-500">Open</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-yellow-500" />
                      <p className="text-2xl font-bold text-yellow-600">{subcontractor.tickets.filter((t) => t.status === "in_progress").length}</p>
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
                      <p className="text-2xl font-bold text-green-600">{subcontractor.tickets.filter((t) => t.status === "resolved" || t.status === "closed").length}</p>
                    </div>
                    <p className="text-xs text-gray-500">Resolved</p>
                  </div>
                </div>

                {subcontractor.tickets.length === 0 ? (
                  <div className="text-center py-12">
                    <Ticket size={40} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm text-gray-500 font-medium">No tickets</p>
                    <p className="text-xs text-gray-400 mt-1">This subcontractor has a clean record!</p>
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
                        {subcontractor.tickets.map((ticket) => {
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