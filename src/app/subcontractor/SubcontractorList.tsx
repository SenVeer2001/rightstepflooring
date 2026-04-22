// pages/SubcontractorList.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
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
  Wrench,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Download,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  X,
  ThumbsUp,
} from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {
  type Subcontractor,
  type SubcontractorStatus,
  type InsuranceStatus,
  mockSubcontractors,
  tradeOptions,
  serviceAreaOptions,
} from "../../types/subcontractor";
import AddSubcontractorForm from "./AddSubcontractorForm";

// Status config
const statusConfig: Record<SubcontractorStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  active: { label: "Active", color: "text-green-700", bg: "bg-green-100", icon: CheckCircle },
  inactive: { label: "Inactive", color: "text-gray-600", bg: "bg-gray-100", icon: XCircle },
  locked: { label: "Locked", color: "text-red-700", bg: "bg-red-100", icon: Lock },
  pending: { label: "Pending", color: "text-yellow-700", bg: "bg-yellow-100", icon: Clock },
};

// Insurance status config
const insuranceConfig: Record<InsuranceStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  valid: { label: "Insured", color: "text-green-700", bg: "bg-green-100", icon: Shield },
  expiring_soon: { label: "Expiring Soon", color: "text-yellow-700", bg: "bg-yellow-100", icon: ShieldAlert },
  expired: { label: "Expired", color: "text-red-700", bg: "bg-red-100", icon: ShieldX },
  not_uploaded: { label: "Not Uploaded", color: "text-gray-600", bg: "bg-gray-100", icon: ShieldQuestion },
  pending: { label: "Pending Review", color: "text-blue-700", bg: "bg-blue-100", icon: HelpCircle },
};

// Review type
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

// Mock reviews data generator
const generateMockReviews = (subId: string, count: number): Review[] => {
  const reviewers = [
    "John Smith", "Sarah Johnson", "Mike Davis", "Emily Brown", "Chris Wilson",
    "Amanda Taylor", "David Martinez", "Lisa Anderson", "Robert Thomas", "Jennifer Lee"
  ];
  const comments = [
    "Excellent work! Very professional and completed the job on time. Would highly recommend.",
    "Great communication throughout the project. Quality work and fair pricing.",
    "Showed up on time and did exactly what was promised. Very satisfied with the results.",
    "Professional team, clean work area after completion. Will definitely hire again.",
    "Good work overall. Minor delays but the end result was worth it.",
    "Exceptional attention to detail. Went above and beyond my expectations.",
    "Responsive and reliable. Fixed the issue quickly and efficiently.",
    "Fair pricing and honest assessment of the work needed. Very trustworthy.",
    "The work was completed ahead of schedule. Very impressed with the quality.",
    "Friendly and professional. Answered all my questions patiently."
  ];
  const jobTypes = ["Plumbing Repair", "Electrical Work", "HVAC Service", "General Maintenance", "Emergency Call"];

  return Array.from({ length: count }, (_, i) => ({
    id: `${subId}-review-${i}`,
    reviewerName: reviewers[Math.floor(Math.random() * reviewers.length)],
    rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars mostly
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
  subcontractor: Subcontractor | null;
}

const RatingPopup = ({ isOpen, onClose, subcontractor }: RatingPopupProps) => {
  if (!isOpen || !subcontractor) return null;

  const reviews = generateMockReviews(subcontractor.id, subcontractor.completedJobs);
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
            {subcontractor.avatar ? (
              <img
                src={subcontractor.avatar}
                alt={subcontractor.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-semibold text-primary">
                  {subcontractor.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{subcontractor.name}</h2>
              <p className="text-sm text-gray-500">{subcontractor.trade}</p>
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
                <div className="text-5xl font-bold text-gray-900">{subcontractor.rating}</div>
                <StarRating rating={subcontractor.rating} size={24} />
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

export default function SubcontractorList() {
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>(mockSubcontractors);
  const [search, setSearch] = useState("");
  const [tradeFilter, setTradeFilter] = useState("All Trades");
  const [areaFilter, setAreaFilter] = useState("All Areas");
  const [statusFilter, setStatusFilter] = useState<SubcontractorStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [statusDropdown, setStatusDropdown] = useState<string | null>(null);
  const [addFormOpen, setAddFormOpen] = useState(false);

  // NEW: Rating popup state
  const [ratingPopupOpen, setRatingPopupOpen] = useState(false);
  const [selectedSubcontractor, setSelectedSubcontractor] = useState<Subcontractor | null>(null);

  const navigate = useNavigate();
  const rowsPerPage = 10;

  // Filter subcontractors
  const filteredSubcontractors = subcontractors.filter((sub) => {
    if (search) {
      const searchLower = search.toLowerCase();
      if (
        !sub.name.toLowerCase().includes(searchLower) &&
        !sub.email.toLowerCase().includes(searchLower) &&
        !sub.trade.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    if (tradeFilter !== "All Trades" && !sub.trades.includes(tradeFilter)) return false;
    if (areaFilter !== "All Areas" && !sub.serviceAreas.includes(areaFilter)) return false;
    if (statusFilter !== "all" && sub.status !== statusFilter) return false;
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredSubcontractors.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedSubcontractors = filteredSubcontractors.slice(startIndex, startIndex + rowsPerPage);

  // Stats
  const activeCount = subcontractors.filter((s) => s.status === "active").length;
  const expiringCount = subcontractors.filter((s) => s.insuranceStatus === "expiring_soon").length;
  const lockedCount = subcontractors.filter((s) => s.status === "locked").length;

  const handleViewProfile = (id: string) => {
    navigate(`/subcontractors/${id}`);
  };

  // NEW: Handle rating click
  const handleRatingClick = (e: React.MouseEvent, sub: Subcontractor) => {
    e.stopPropagation();
    setSelectedSubcontractor(sub);
    setRatingPopupOpen(true);
  };

  const handleStatusChange = (id: string, newStatus: SubcontractorStatus) => {
    setSubcontractors((prev) =>
      prev.map((sub) =>
        sub.id === id ? { ...sub, status: newStatus } : sub
      )
    );
    setStatusDropdown(null);
  };

  const handleAddSubcontractor = (data: any) => {
    const newSub: Subcontractor = {
      id: `sub-${Date.now()}`,
      name: data.companyName,
      email: data.email,
      phone: `+${data.phone}`,
      trade: data.primaryTrade,
      trades: [data.primaryTrade, ...data.additionalTrades],
      serviceAreas: data.serviceAreas,
      status: data.status,
      insuranceStatus: data.insuranceStatus,
      rating: 0,
      completedJobs: 0,
      totalJobs: 0,
      avatar: data.avatar,
      lastJobDate: undefined,
    };
    setSubcontractors((prev) => [newSub, ...prev]);
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
              Subcontractors
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage your subcontractor network
            </p>
          </div>

          <button
            onClick={() => setAddFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition shadow-sm"
          >
            <UserPlus size={16} />
            Add Subcontractor
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
                <p className="text-2xl font-bold text-gray-900">{subcontractors.length}</p>
                <p className="text-xs text-gray-500">Total</p>
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
                <AlertTriangle size={20} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{expiringCount}</p>
                <p className="text-xs text-gray-500">Expiring Soon</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Lock size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{lockedCount}</p>
                <p className="text-xs text-gray-500">Locked</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or trade..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Trade Filter */}
            <div className="relative">
              <Wrench size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={tradeFilter}
                onChange={(e) => setTradeFilter(e.target.value)}
                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none appearance-none bg-white min-w-[160px]"
              >
                {tradeOptions.map((trade) => (
                  <option key={trade} value={trade}>{trade}</option>
                ))}
              </select>
            </div>

            {/* Area Filter */}
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none appearance-none bg-white min-w-[140px]"
              >
                {serviceAreaOptions.map((area) => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as SubcontractorStatus | "all")}
                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none appearance-none bg-white min-w-[130px]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="locked">Locked</option>
                <option value="pending">Pending</option>
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
                    Subcontractor
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Trade
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Service Area
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Last Job
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Insurance
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedSubcontractors.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <Users size={40} className="mx-auto mb-3 text-gray-300" />
                      <p className="text-sm text-gray-500 font-medium">No subcontractors found</p>
                      <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
                    </td>
                  </tr>
                ) : (
                  paginatedSubcontractors.map((sub) => {
                    const statusInfo = statusConfig[sub.status];
                    const insuranceInfo = insuranceConfig[sub.insuranceStatus];

                    if (!statusInfo || !insuranceInfo) {
                      console.error("Missing config for:", sub.status, sub.insuranceStatus);
                      return null;
                    }

                    const StatusIcon = statusInfo.icon;
                    const InsuranceIcon = insuranceInfo.icon;

                    return (
                      <tr
                        key={sub.id}
                        className="hover:bg-gray-50 transition"
                      >
                        {/* Subcontractor */}
                        <td className="px-4 py-3" onClick={() => handleViewProfile(sub.id)}>
                          <div className="flex items-center gap-3 cursor-pointer">
                            {sub.avatar ? (
                              <img
                                src={sub.avatar}
                                alt={sub.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-semibold text-primary">
                                  {sub.name.split(" ").map((n) => n[0]).join("")}
                                </span>
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{sub.name}</p>
                              <p className="text-xs text-gray-500">{sub.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Trade */}
                        <td className="px-4 py-3" onClick={() => handleViewProfile(sub.id)}>
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded cursor-pointer">
                            {sub.trade}
                          </span>
                          {sub.trades.length > 1 && (
                            <span className="ml-1 text-xs text-gray-400">
                              +{sub.trades.length - 1}
                            </span>
                          )}
                        </td>

                        {/* Rating - UPDATED: Now clickable with popup */}
                        <td className="px-4 py-3">
                          <button
                            onClick={(e) => handleRatingClick(e, sub)}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-yellow-50 transition group"
                          >
                            <Star size={14} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium text-gray-900 group-hover:text-yellow-700">
                              {sub.rating}
                            </span>
                            <span className="text-xs text-gray-400 group-hover:text-yellow-600">
                              ({sub.completedJobs})
                            </span>
                          </button>
                        </td>

                        {/* Service Area */}
                        <td className="px-4 py-3" onClick={() => handleViewProfile(sub.id)}>
                          <div className="flex items-center gap-1 flex-wrap cursor-pointer">
                            <span className="text-xs text-gray-600">{sub.serviceAreas[0]}</span>
                            {sub.serviceAreas.length > 1 && (
                              <span
                                className="text-xs text-gray-400 cursor-help"
                                data-tooltip-id="sub-tooltip"
                                data-tooltip-content={sub.serviceAreas.join(", ")}
                              >
                                +{sub.serviceAreas.length - 1} more
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <div className="relative inline-block">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setStatusDropdown(statusDropdown === sub.id ? null : sub.id);
                              }}
                              className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${statusInfo.bg} ${statusInfo.color} hover:opacity-80 transition`}
                            >
                              <StatusIcon size={12} />
                              {statusInfo.label}
                              <ChevronDown size={12} />
                            </button>

                            {/* Status Change Dropdown */}
                            {statusDropdown === sub.id && (
                              <div
                                className="absolute left-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-20"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {(Object.keys(statusConfig) as SubcontractorStatus[]).map((status) => {
                                  const config = statusConfig[status];
                                  const Icon = config.icon;
                                  const isCurrentStatus = sub.status === status;

                                  return (
                                    <button
                                      key={status}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleStatusChange(sub.id, status);
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
                        </td>

                        {/* Last Job */}
                        <td className="px-4 py-3" onClick={() => handleViewProfile(sub.id)}>
                          <span className="text-xs text-gray-600 cursor-pointer">
                            {formatRelativeTime(sub.lastJobDate)}
                          </span>
                        </td>

                        {/* Insurance */}
                        <td className="px-4 py-3" onClick={() => handleViewProfile(sub.id)}>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${insuranceInfo.bg} ${insuranceInfo.color} cursor-pointer`}>
                            <InsuranceIcon size={12} />
                            {insuranceInfo.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <div className="relative inline-block">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdown(activeDropdown === sub.id ? null : sub.id);
                              }}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                            >
                              <MoreVertical size={16} className="text-gray-500" />
                            </button>

                            {activeDropdown === sub.id && (
                              <div
                                className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewProfile(sub.id);
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
          {filteredSubcontractors.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t bg-gray-50 gap-2">
              <p className="text-xs text-gray-500">
                Showing {startIndex + 1} - {Math.min(startIndex + rowsPerPage, filteredSubcontractors.length)} of {filteredSubcontractors.length}
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
        id="sub-tooltip"
        place="top"
        className="!bg-gray-800 !text-white !text-[10px] !px-2 !py-1 !rounded"
      />
      <AddSubcontractorForm
        isOpen={addFormOpen}
        onClose={() => setAddFormOpen(false)}
        onSubmit={handleAddSubcontractor}
      />

      {/* Rating Popup */}
      <RatingPopup
        isOpen={ratingPopupOpen}
        onClose={() => setRatingPopupOpen(false)}
        subcontractor={selectedSubcontractor}
      />
    </div>
  );
}