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
  ChevronDown, // NEW
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
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>(mockSubcontractors); // CHANGED: Added setter
  const [search, setSearch] = useState("");
  const [tradeFilter, setTradeFilter] = useState("All Trades");
  const [areaFilter, setAreaFilter] = useState("All Areas");
  const [statusFilter, setStatusFilter] = useState<SubcontractorStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [statusDropdown, setStatusDropdown] = useState<string | null>(null); // NEW: For status change dropdown
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

  // NEW: Handle status change
  const handleStatusChange = (id: string, newStatus: SubcontractorStatus) => {
    setSubcontractors((prev) =>
      prev.map((sub) =>
        sub.id === id ? { ...sub, status: newStatus } : sub
      )
    );
    setStatusDropdown(null);
    
    // Optional: Show success toast
    console.log(`Status changed to ${newStatus} for subcontractor ${id}`);
    // You can add toast notification here
  };

  // Close dropdown when clicking outside
  const handleCloseDropdown = () => {
    setActiveDropdown(null);
    setStatusDropdown(null); // NEW
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

          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition shadow-sm">
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

                        {/* Rating */}
                        <td className="px-4 py-3" onClick={() => handleViewProfile(sub.id)}>
                          <div className="flex items-center gap-1 cursor-pointer">
                            <Star size={14} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium text-gray-900">{sub.rating}</span>
                            <span className="text-xs text-gray-400">({sub.completedJobs})</span>
                          </div>
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

                        {/* Status - CHANGED: Now with dropdown */}
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
    </div>
  );
}