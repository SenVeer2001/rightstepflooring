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
  Mail,
  Phone,
  Hash,
  CalendarDays,
} from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {
  type Staff,
  type StaffStatus,
  type StaffRole,
  mockStaff,
} from "../../types/staff";
import AddStaffForm from "./AddStaffForm";

// Status config
const statusConfig: Record<StaffStatus, { label: string; color: string; bg: string; icon: React.ElementType; dot: string }> = {
  active: { label: "Active", color: "text-green-700", bg: "bg-green-100", icon: CheckCircle, dot: "bg-green-500" },
  inactive: { label: "Inactive", color: "text-gray-600", bg: "bg-gray-100", icon: XCircle, dot: "bg-gray-400" },
  on_leave: { label: "On Leave", color: "text-yellow-700", bg: "bg-yellow-100", icon: Clock, dot: "bg-yellow-500" },
  terminated: { label: "Terminated", color: "text-red-700", bg: "bg-red-100", icon: Lock, dot: "bg-red-500" },
};

// Role config
const roleConfig: Record<StaffRole, { label: string; color: string; bg: string; icon: React.ElementType; gradient: string }> = {
  admin: { label: "Admin", color: "text-purple-700", bg: "bg-purple-100", icon: Award, gradient: "from-purple-500 to-purple-600" },
  manager: { label: "Manager", color: "text-blue-700", bg: "bg-blue-100", icon: Briefcase, gradient: "from-blue-500 to-blue-600" },
  technician: { label: "Technician", color: "text-green-700", bg: "bg-green-100", icon: Users, gradient: "from-green-500 to-green-600" },
  dispatcher: { label: "Dispatcher", color: "text-orange-700", bg: "bg-orange-100", icon: MapPin, gradient: "from-orange-500 to-orange-600" },
  sales: { label: "Sales", color: "text-pink-700", bg: "bg-pink-100", icon: TrendingUp, gradient: "from-pink-500 to-pink-600" },
  support: { label: "Support", color: "text-cyan-700", bg: "bg-cyan-100", icon: Users, gradient: "from-cyan-500 to-cyan-600" },
  accounting: { label: "Accounting", color: "text-emerald-700", bg: "bg-emerald-100", icon: Calendar, gradient: "from-emerald-500 to-emerald-600" },
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
          className={`${star <= rating
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
                  </div>

                  {/* Review Content */}
                  <p className="mt-3 text-sm text-gray-700 leading-relaxed">{review.comment}</p>
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

// Staff Card Component
interface StaffCardProps {
  member: Staff;
  onViewProfile: (id: string) => void;
  onRatingClick: (e: React.MouseEvent, member: Staff) => void;
  onStatusChange: (id: string, status: StaffStatus) => void;
  onDelete: (id: string) => void;
  activeDropdown: string | null;
  setActiveDropdown: (id: string | null) => void;
  statusDropdown: string | null;
  setStatusDropdown: (id: string | null) => void;
}

const StaffCard = ({
  member,
  onViewProfile,
  onRatingClick,
  onStatusChange,
  onDelete,
  activeDropdown,
  setActiveDropdown,
  statusDropdown,
  setStatusDropdown,
}: StaffCardProps) => {
  const statusInfo = statusConfig[member.status];
  const roleInfo = roleConfig[member.role];
  const StatusIcon = statusInfo.icon;
  const RoleIcon = roleInfo.icon;

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Card Header with Gradient */}
      <div className={`h-20 bg-gradient-to-r ${roleInfo.gradient} relative`}>
        {/* Status Indicator */}
        <div className="absolute top-3 right-3">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setStatusDropdown(statusDropdown === member.id ? null : member.id);
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition ${statusInfo.color}`}
            >
              <span className={`w-2 h-2 rounded-full ${statusInfo.dot}`} />
              {statusInfo.label}
              <ChevronDown size={12} />
            </button>

            {/* Status Dropdown */}
            {statusDropdown === member.id && (
              <div
                className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-20"
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
                        onStatusChange(member.id, status);
                      }}
                      disabled={isCurrentStatus}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${isCurrentStatus ? 'bg-gray-50 cursor-not-allowed opacity-60' : ''
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
        </div>

        {/* Actions Menu */}
        <div className="absolute top-3 left-3">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveDropdown(activeDropdown === member.id ? null : member.id);
              }}
              className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition backdrop-blur-sm"
            >
              <MoreVertical size={16} className="text-white" />
            </button>

            {activeDropdown === member.id && (
              <div
                className="absolute left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewProfile(member.id);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(member.id);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Avatar */}
      <div className="flex justify-center -mt-10 relative z-10">
        {member.avatar ? (
          <img
            src={member.avatar}
            alt={`${member.firstName} ${member.lastName}`}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center border-4 border-white shadow-md">
            <span className="text-2xl font-bold text-white">
              {member.firstName[0]}{member.lastName[0]}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 pt-3">
        {/* Name & Role */}
        <div className="text-center mb-4">
          <h3
            onClick={() => onViewProfile(member.id)}
            className="text-lg font-semibold text-gray-900 hover:text-primary cursor-pointer transition"
          >
            {member.firstName} {member.lastName}
          </h3>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${roleInfo.bg} ${roleInfo.color}`}>
              <RoleIcon size={10} />
              {roleInfo.label}
            </span>
          </div>
        </div>

        {/* Employee ID */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 mb-4">
          <Hash size={12} />
          {member.employeeId}
        </div>

        {/* Rating */}
        <div className="flex justify-center mb-4">
          {member.rating > 0 ? (
            <button
              onClick={(e) => onRatingClick(e, member)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition group"
            >
              <StarRating rating={member.rating} size={14} />
              <span className="text-sm font-semibold text-gray-900">
                {member.rating}
              </span>
              <span className="text-xs text-gray-500">
                ({member.completedJobs} reviews)
              </span>
            </button>
          ) : (
            <span className="text-xs text-gray-400 py-1.5">No ratings yet</span>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-3" />

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Department */}
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <MapPin size={14} className="text-gray-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Dept</p>
              <p className="text-xs font-medium text-gray-700 truncate">{member.department}</p>
            </div>
          </div>

          {/* Jobs */}
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <Briefcase size={14} className="text-gray-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Jobs</p>
              <p className="text-xs font-medium text-gray-700">
                {member.completedJobs} / {member.totalJobs}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg col-span-2">
            <Mail size={14} className="text-gray-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Email</p>
              <p className="text-xs font-medium text-gray-700 truncate">{member.email}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <Phone size={14} className="text-gray-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Phone</p>
              <p className="text-xs font-medium text-gray-700 truncate">{member.phone}</p>
            </div>
          </div>

          {/* Hire Date */}
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <CalendarDays size={14} className="text-gray-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Hired</p>
              <p className="text-xs font-medium text-gray-700">
                {member.hireDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
              </p>
            </div>
          </div>
        </div>

        {/* View Profile Button */}
        <button
          onClick={() => onViewProfile(member.id)}
          className="w-full mt-4 py-2.5 text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition flex items-center justify-center gap-2"
        >
          <Eye size={14} />
          View Full Profile
        </button>
      </div>
    </div>
  );
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
  const [addFormOpen, setAddFormOpen] = useState(false);

  // Rating popup state
  const [ratingPopupOpen, setRatingPopupOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const navigate = useNavigate();
  const rowsPerPage = 12; // Changed to 12 for better grid layout (3x4 or 4x3)

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

  const handleDelete = (id: string) => {
    setStaff((prev) => prev.filter((member) => member.id !== id));
    setActiveDropdown(null);
  };


  const handleAddStaff = (data: StaffFormData) => {
    const newMember: Staff = {
      id: `staff-${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      role: data.role as StaffRole,
      department: data.department,
      status: data.status,
      employeeId: data.employeeId,
      hireDate: new Date(data.hireDate),
      rating: 0,
      completedJobs: 0,
      totalJobs: 0,
      avatar: undefined,
    };
    setStaff((prev) => [newMember, ...prev]);
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

          <button
            onClick={() => setAddFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition shadow-sm"
          >
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


            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
              <Download size={14} />
              Export
            </button>
          </div>
        </div>


        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-900">{filteredStaff.length}</span> staff members
          </p>
        </div>

        {paginatedStaff.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl py-16 text-center">
            <Users size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-500">No staff members found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {paginatedStaff.map((member) => (
              <StaffCard
                key={member.id}
                member={member}
                onViewProfile={handleViewProfile}
                onRatingClick={handleRatingClick}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
                statusDropdown={statusDropdown}
                setStatusDropdown={setStatusDropdown}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredStaff.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
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
              <span className="px-3 py-1 text-xs font-medium">
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
      <AddStaffForm
        isOpen={addFormOpen}
        onClose={() => setAddFormOpen(false)}
        onSubmit={handleAddStaff}
      />
    </div>
  );
}