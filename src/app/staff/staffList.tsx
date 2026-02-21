// pages/StaffList.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  
  Filter,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Download,
  ChevronDown,
  X,
  ThumbsUp,
  Lock,
  Briefcase,
  Award,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {
  type Staff,
  type StaffStatus,
  type StaffRole,
  mockStaff,
} from "../../types/staff";

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

// Role options for filter
const roleOptions = ["All Roles", "admin", "manager", "technician", "dispatcher", "sales", "support", "accounting"];

// Department options for filter
const departmentOptions = ["All Departments", "Field Operations", "Operations", "Sales", "Customer Service", "Administration", "Finance"];

// Review interface
interface Review {
  id: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number;
  date: Date;
  comment: string;
  jobType: string;
  helpful: number;
}

// Mock reviews generator
const generateMockReviews = (staffId: string, count: number): Review[] => {
  const reviewers = [
    "John Smith", "Sarah Johnson", "Mike Davis", "Emily Brown", "Chris Wilson",
    "Amanda Taylor", "David Martinez", "Lisa Anderson", "Robert Thomas", "Jennifer Lee"
  ];
  const comments = [
    "Excellent work! Very professional and completed the job on time.",
    "Great communication and quality work. Highly recommended!",
    "Professional and reliable. Always goes above and beyond.",
    "Outstanding service and attention to detail.",
    "Very knowledgeable and helpful. Great team member!",
    "Punctual and efficient. Pleasure to work with.",
    "Exceptional skills and customer service.",
    "Reliable and trustworthy. Always delivers quality.",
    "Great attitude and work ethic.",
    "Highly skilled and professional."
  ];
  const jobTypes = ["Electrical Work", "HVAC Service", "Plumbing Repair", "Installation", "Maintenance"];

  return Array.from({ length: count }, (_, i) => ({
    id: `${staffId}-review-${i}`,
    reviewerName: reviewers[Math.floor(Math.random() * reviewers.length)],
    rating: Math.floor(Math.random() * 2) + 4,
    date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    comment: comments[Math.floor(Math.random() * comments.length)],
    jobType: jobTypes[Math.floor(Math.random() * jobTypes.length)],
    helpful: Math.floor(Math.random() * 15),
  }));
};

// Rating breakdown calculator
const calculateRatingBreakdown = (reviews: Review[]) => {
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((review) => {
    breakdown[review.rating as keyof typeof breakdown]++;
  });
  return breakdown;
};

// Star Rating Component
const StarRating = ({ rating, size = 16 }: { rating: number; size?: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`${
            star <= rating
              ? "text-yellow-400 fill-yellow-400"
              : star - 0.5 <= rating
              ? "text-yellow-400 fill-yellow-400/50"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

// Rating Popup Component
interface RatingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | null;
}

const RatingPopup = ({ isOpen, onClose, staff }: RatingPopupProps) => {
  if (!isOpen || !staff) return null;

  const reviews = generateMockReviews(staff.id, staff.completedJobs);
  const breakdown = calculateRatingBreakdown(reviews);
  const totalReviews = reviews.length;

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 mx-4">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            {staff.avatar ? (
              <img
                src={staff.avatar}
                alt={`${staff.firstName} ${staff.lastName}`}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-semibold text-primary">
                  {staff.firstName[0]}{staff.lastName[0]}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{staff.firstName} {staff.lastName}</h2>
              <p className="text-sm text-gray-500">{roleConfig[staff.role].label}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Rating Summary */}
          <div className="px-6 py-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Overall Rating */}
              <div className="flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-gray-900">{staff.rating}</div>
                <StarRating rating={staff.rating} size={24} />
                <p className="text-sm text-gray-500 mt-2">{totalReviews} reviews</p>
              </div>

              {/* Rating Breakdown */}
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = breakdown[star as keyof typeof breakdown];
                  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 w-4">{star}</span>
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="px-6 py-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Reviews</h3>
            <div className="space-y-4">
              {reviews.slice(0, 10).map((review) => (
                <div
                  key={review.id}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition"
                >
                  {/* Review Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <span className="text-sm font-semibold text-white">
                          {review.reviewerName.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{review.reviewerName}</p>
                        <div className="flex items-center gap-2">
                          <StarRating rating={review.rating} size={12} />
                          <span className="text-xs text-gray-400">{formatDate(review.date)}</span>
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded">
                      {review.jobType}
                    </span>
                  </div>

                  {/* Review Content */}
                  <p className="mt-3 text-sm text-gray-700 leading-relaxed">{review.comment}</p>

                  {/* Review Actions */}
                  <div className="mt-3 flex items-center gap-4">
                    <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition">
                      <ThumbsUp size={14} />
                      Helpful ({review.helpful})
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* View More */}
            {reviews.length > 10 && (
              <button className="w-full mt-4 py-3 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition">
                View all {reviews.length} reviews
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Format relative time
const formatRelativeTime = (date?: Date): string => {
  if (!date) return "Never";
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
};

export default function StaffList() {
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState<StaffStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [statusDropdown, setStatusDropdown] = useState<string | null>(null);
  
  // Rating popup state
  const [ratingPopupOpen, setRatingPopupOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  
  const navigate = useNavigate();
  const rowsPerPage = 10;

  // Filter staff
  const filteredStaff = staff.filter((member) => {
    if (search) {
      const searchLower = search.toLowerCase();
      if (
        !member.firstName.toLowerCase().includes(searchLower) &&
        !member.lastName.toLowerCase().includes(searchLower) &&
        !member.email.toLowerCase().includes(searchLower) &&
        !member.employeeId.toLowerCase().includes(searchLower) &&
        !roleConfig[member.role].label.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    if (roleFilter !== "All Roles" && member.role !== roleFilter) return false;
    if (departmentFilter !== "All Departments" && member.department !== departmentFilter) return false;
    if (statusFilter !== "all" && member.status !== statusFilter) return false;
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStaff.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedStaff = filteredStaff.slice(startIndex, startIndex + rowsPerPage);

  // Stats
  const activeCount = staff.filter((s) => s.status === "active").length;
  const onLeaveCount = staff.filter((s) => s.status === "on_leave").length;
  const technicianCount = staff.filter((s) => s.role === "technician").length;

  const handleViewProfile = (id: string) => {
    navigate(`/staff/${id}`);
  };

  const handleRatingClick = (e: React.MouseEvent, member: Staff) => {
    e.stopPropagation();
    setSelectedStaff(member);
    setRatingPopupOpen(true);
  };

  const handleStatusChange = (id: string, newStatus: StaffStatus) => {
    setStaff((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, status: newStatus } : member
      )
    );
    setStatusDropdown(null);
  };

  const handleCloseDropdown = () => {
    setActiveDropdown(null);
    setStatusDropdown(null);
  };

  return (
    <div className="min-h-screen p-4 md:p-4" onClick={handleCloseDropdown}>
      <div className="max-w-8xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              Staff Members
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage your team and track performance
            </p>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition shadow-sm">
            <UserPlus size={16} />
            Add Staff Member
          </button>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{staff.length}</p>
                <p className="text-xs text-gray-500">Total Staff</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
                <p className="text-xs text-gray-500">Active</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock size={20} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{onLeaveCount}</p>
                <p className="text-xs text-gray-500">On Leave</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Briefcase size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{technicianCount}</p>
                <p className="text-xs text-gray-500">Technicians</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              {/* <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /> */}
              <input
                type="text"
                placeholder="Search by name, email, or employee ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none appearance-none bg-white min-w-[160px]"
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role === "All Roles" ? role : roleConfig[role as StaffRole].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Department Filter */}
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none appearance-none bg-white min-w-[180px]"
              >
                {departmentOptions.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StaffStatus | "all")}
                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none appearance-none bg-white min-w-[130px]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on_leave">On Leave</option>
                <option value="terminated">Terminated</option>
              </select>
            </div>

            {/* Export Button */}
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
              <Download size={14} />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Jobs
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Hire Date
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedStaff.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <Users size={40} className="mx-auto mb-3 text-gray-300" />
                      <p className="text-sm text-gray-500 font-medium">No staff members found</p>
                      <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
                    </td>
                  </tr>
                ) : (
                  paginatedStaff.map((member) => {
                    const statusInfo = statusConfig[member.status];
                    const roleInfo = roleConfig[member.role];
                    const StatusIcon = statusInfo.icon;
                    const RoleIcon = roleInfo.icon;

                    return (
                      <tr
                        key={member.id}
                        className="hover:bg-gray-50 transition"
                      >
                        {/* Employee */}
                        <td className="px-4 py-3" onClick={() => handleViewProfile(member.id)}>
                          <div className="flex items-center gap-3 cursor-pointer">
                            {member.avatar ? (
                              <img
                                src={member.avatar}
                                alt={`${member.firstName} ${member.lastName}`}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-semibold text-primary">
                                  {member.firstName[0]}{member.lastName[0]}
                                </span>
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {member.firstName} {member.lastName}
                              </p>
                              <p className="text-xs text-gray-500">{member.employeeId}</p>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-4 py-3" onClick={() => handleViewProfile(member.id)}>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${roleInfo.bg} ${roleInfo.color} cursor-pointer`}>
                            <RoleIcon size={12} />
                            {roleInfo.label}
                          </span>
                        </td>

                        {/* Department */}
                        <td className="px-4 py-3" onClick={() => handleViewProfile(member.id)}>
                          <span className="text-sm text-gray-600 cursor-pointer">{member.department}</span>
                        </td>

                        {/* Rating */}
                        <td className="px-4 py-3">
                          {member.rating > 0 ? (
                            <button
                              onClick={(e) => handleRatingClick(e, member)}
                              className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-yellow-50 transition group"
                            >
                              <Star size={14} className="text-yellow-500 fill-yellow-500" />
                              <span className="text-sm font-medium text-gray-900 group-hover:text-yellow-700">
                                {member.rating}
                              </span>
                              <span className="text-xs text-gray-400 group-hover:text-yellow-600">
                                ({member.completedJobs})
                              </span>
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">N/A</span>
                          )}
                        </td>

                        {/* Jobs */}
                        <td className="px-4 py-3" onClick={() => handleViewProfile(member.id)}>
                          <div className="flex items-center gap-2 cursor-pointer">
                            <span className="text-sm font-medium text-gray-900">{member.completedJobs}</span>
                            <span className="text-xs text-gray-400">/ {member.totalJobs}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <div className="relative inline-block">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setStatusDropdown(statusDropdown === member.id ? null : member.id);
                              }}
                              className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${statusInfo.bg} ${statusInfo.color} hover:opacity-80 transition`}
                            >
                              <StatusIcon size={12} />
                              {statusInfo.label}
                              <ChevronDown size={12} />
                            </button>

                            {/* Status Change Dropdown */}
                            {statusDropdown === member.id && (
                              <div
                                className="absolute left-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-20"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {(Object.keys(statusConfig) as StaffStatus[]).map((status) => {
                                  const config = statusConfig[status];
                                  const Icon = config.icon;
                                  const isCurrentStatus = member.status === status;

                                  return (
                                    <button
                                      key={status}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleStatusChange(member.id, status);
                                      }}
                                      disabled={isCurrentStatus}
                                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                                        isCurrentStatus ? 'bg-gray-50 cursor-not-allowed opacity-60' : ''
                                      }`}
                                    >
                                      <Icon size={14} className={config.color} />
                                      <span className={config.color}>{config.label}</span>
                                      {isCurrentStatus && (
                                        <CheckCircle size={12} className="ml-auto text-green-600" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Hire Date */}
                        <td className="px-4 py-3" onClick={() => handleViewProfile(member.id)}>
                          <span className="text-xs text-gray-600 cursor-pointer">
                            {member.hireDate.toLocaleDateString()}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <div className="relative inline-block">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdown(activeDropdown === member.id ? null : member.id);
                              }}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                            >
                              <MoreVertical size={16} className="text-gray-500" />
                            </button>

                            {activeDropdown === member.id && (
                              <div 
                                className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewProfile(member.id);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Eye size={14} />
                                  View Profile
                                </button>
                                <button
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Edit size={14} />
                                  Edit
                                </button>
                                <button
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredStaff.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t bg-gray-50 gap-2">
              <p className="text-xs text-gray-500">
                Showing {startIndex + 1} - {Math.min(startIndex + rowsPerPage, filteredStaff.length)} of {filteredStaff.length}
              </p>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 text-xs rounded border bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded border bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="px-2 py-1 text-xs font-medium">
                  {currentPage} / {totalPages || 1}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-1 rounded border bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronRight size={14} />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-2 py-1 text-xs rounded border bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Tooltip
        id="staff-tooltip"
        place="top"
        className="!bg-gray-800 !text-white !text-[10px] !px-2 !py-1 !rounded"
      />

      {/* Rating Popup */}
      <RatingPopup
        isOpen={ratingPopupOpen}
        onClose={() => setRatingPopupOpen(false)}
        staff={selectedStaff}
      />
    </div>
  );
}