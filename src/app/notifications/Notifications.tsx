// pages/Notifications.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  CreditCard,
  AlertTriangle,
  MessageSquare,
  FileText,
  Settings,
  AtSign,
  Clock,
  ExternalLink,
  Trash2,
  Zap,
  Mail,
  MailOpen,
  RefreshCw,
  X,
  User,
  ArrowRight,
  Link2,
  Info,
  AlertCircle,
  Building,
  Users,
  Ticket,
  FileCheck,
  ChevronDown,
  Tag,
} from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {
  type Notification,
  type NotificationType,
  type NotificationPriority,
  type SourceType,
  type RelatedEntity,
  mockNotifications,
} from "../../types/notification";

// Main tab types
type MainTab = "all" | "unread";

// Sub tab types
type SubTab = "all" | "updates" | "actions" | "system";

// Icon mapping
const typeIcons: Record<NotificationType, React.ElementType> = {
  assignment: Briefcase,
  payment: CreditCard,
  alert: AlertTriangle,
  message: MessageSquare,
  document: FileText,
  system: Settings,
  mention: AtSign,
  reminder: Clock,
};

// Color mapping
const typeColors: Record<NotificationType, { bg: string; icon: string; border: string }> = {
  assignment: { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-200" },
  payment: { bg: "bg-green-50", icon: "text-green-600", border: "border-green-200" },
  alert: { bg: "bg-red-50", icon: "text-red-600", border: "border-red-200" },
  message: { bg: "bg-purple-50", icon: "text-purple-600", border: "border-purple-200" },
  document: { bg: "bg-orange-50", icon: "text-orange-600", border: "border-orange-200" },
  system: { bg: "bg-gray-100", icon: "text-gray-600", border: "border-gray-200" },
  mention: { bg: "bg-pink-50", icon: "text-pink-600", border: "border-pink-200" },
  reminder: { bg: "bg-yellow-50", icon: "text-yellow-600", border: "border-yellow-200" },
};

// Priority config
const priorityConfig: Record<NotificationPriority, { label: string; color: string; bg: string; icon: React.ElementType; border: string }> = {
  action_required: { label: "Action Required", color: "text-red-700", bg: "bg-red-100", icon: AlertCircle, border: "border-l-red-500" },
  informational: { label: "Informational", color: "text-blue-700", bg: "bg-blue-100", icon: Info, border: "border-l-blue-400" },
  completed: { label: "Completed", color: "text-green-700", bg: "bg-green-100", icon: CheckCheck, border: "border-l-green-500" },
};

// Entity type icons
const entityIcons: Record<SourceType, React.ElementType> = {
  job: Briefcase,
  lead: Users,
  invoice: CreditCard,
  estimate: FileText,
  customer: User,
  staff: Users,
  work_order: FileCheck,
  ticket: Ticket,
};

// Entity type colors
const entityColors: Record<SourceType, { bg: string; icon: string }> = {
  job: { bg: "bg-blue-50", icon: "text-blue-600" },
  lead: { bg: "bg-purple-50", icon: "text-purple-600" },
  invoice: { bg: "bg-green-50", icon: "text-green-600" },
  estimate: { bg: "bg-orange-50", icon: "text-orange-600" },
  customer: { bg: "bg-cyan-50", icon: "text-cyan-600" },
  staff: { bg: "bg-indigo-50", icon: "text-indigo-600" },
  work_order: { bg: "bg-yellow-50", icon: "text-yellow-600" },
  ticket: { bg: "bg-red-50", icon: "text-red-600" },
};

// Status color mapping
const statusColorMap: Record<string, { bg: string; text: string }> = {
  green: { bg: "bg-green-100", text: "text-green-700" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-700" },
  red: { bg: "bg-red-100", text: "text-red-700" },
  blue: { bg: "bg-blue-100", text: "text-blue-700" },
  gray: { bg: "bg-gray-100", text: "text-gray-700" },
  orange: { bg: "bg-orange-100", text: "text-orange-700" },
  purple: { bg: "bg-purple-100", text: "text-purple-700" },
};

// Main tabs config
const mainTabs: { id: MainTab; label: string; icon: React.ElementType }[] = [
  { id: "all", label: "All", icon: Bell },
  { id: "unread", label: "Unread", icon: Mail },
];

// Sub tabs config
const subTabs: { id: SubTab; label: string; icon: React.ElementType }[] = [
  { id: "all", label: "All", icon: Bell },
  { id: "updates", label: "Updates", icon: RefreshCw },
  { id: "actions", label: "Actions", icon: Zap },
  { id: "system", label: "System", icon: Settings },
];

// Format helpers
const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const formatAbsoluteTime = (date: Date): string => {
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateTime = (date: Date): string => {
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (date?: Date): string => {
  if (!date) return "N/A";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
};

// Helper functions
const isUpdateType = (type: NotificationType): boolean => {
  return ["assignment", "payment", "message", "document", "mention", "reminder"].includes(type);
};

const isActionRequired = (priority: NotificationPriority): boolean => {
  return priority === "action_required";
};

const isSystemType = (type: NotificationType): boolean => {
  return type === "system" || type === "alert";
};

// Related Entity Card Component
interface RelatedEntityCardProps {
  entity: RelatedEntity;
  onClick: () => void;
}

const RelatedEntityCard = ({ entity, onClick }: RelatedEntityCardProps) => {
  const Icon = entityIcons[entity.type];
  const colors = entityColors[entity.type];
  const statusColors = entity.statusColor ? statusColorMap[entity.statusColor] : null;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-3 hover:border-primary/50 hover:shadow-sm transition cursor-pointer group"
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${colors.bg} flex-shrink-0`}>
          <Icon size={14} className={colors.icon} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-900 group-hover:text-primary transition truncate">
                {entity.title}
              </p>
              {entity.subtitle && (
                <p className="text-[10px] text-gray-500 mt-0.5 truncate">{entity.subtitle}</p>
              )}
            </div>
            <ExternalLink size={12} className="text-gray-400 group-hover:text-primary transition flex-shrink-0 mt-0.5" />
          </div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {entity.status && statusColors && (
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${statusColors.bg} ${statusColors.text}`}>
                {entity.status}
              </span>
            )}
            {entity.amount !== undefined && (
              <span className="text-[10px] font-semibold text-gray-900">
                {formatCurrency(entity.amount)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Notification Detail Popup Component
interface NotificationDetailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  notification: Notification | null;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationDetailPopup = ({
  isOpen,
  onClose,
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationDetailPopupProps) => {
  const navigate = useNavigate();

  if (!isOpen || !notification) return null;

  const Icon = typeIcons[notification.type];
  const colors = typeColors[notification.type];
  const priorityInfo = priorityConfig[notification.priority];
  const PriorityIcon = priorityInfo.icon;

  const handleEntityClick = (url: string) => {
    onClose();
    navigate(url);
  };

  const handleSourceClick = () => {
    if (notification.actionUrl) {
      onClose();
      navigate(notification.actionUrl);
    }
  };

  const handleDelete = () => {
    onDelete(notification.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className={`px-6 py-4 border-b ${colors.bg} ${colors.border}`}>
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="p-3 bg-white rounded-xl shadow-sm flex-shrink-0">
              <Icon size={24} className={colors.icon} />
            </div>

            {/* Title & Meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 line-clamp-2">
                    {notification.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {/* Priority Badge */}
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold ${priorityInfo.bg} ${priorityInfo.color}`}>
                      <PriorityIcon size={10} />
                      {priorityInfo.label}
                    </span>
                    
                    {/* Source Label */}
                    {notification.sourceLabel && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg text-[10px] font-medium text-gray-600 border border-gray-200">
                        #{notification.sourceLabel}
                      </span>
                    )}

                    {/* Expiring Badge */}
                    {notification.isExpiring && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-[10px] font-semibold">
                        <AlertTriangle size={10} />
                        Expires {formatDate(notification.expiresAt)}
                      </span>
                    )}

                    {/* Read Status */}
                    {notification.isRead && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-green-600">
                        <CheckCheck size={12} />
                        Read
                      </span>
                    )}
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/50 rounded-lg transition flex-shrink-0"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Timestamp */}
          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-200/50">
            <Clock size={14} className="text-gray-400" />
            <span className="text-xs text-gray-600">{formatRelativeTime(notification.timestamp)}</span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-500">{formatDateTime(notification.timestamp)}</span>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Full Message */}
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-xs font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <MessageSquare size={12} className="text-gray-400" />
              Full Message
            </h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {notification.fullMessage || notification.description}
              </p>
            </div>
          </div>

          {/* Activity Context */}
          {notification.activityContext && (
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-xs font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Zap size={12} className="text-gray-400" />
                Activity Context
              </h3>
              <div className="bg-gradient-to-br from-primary/5 to-white rounded-xl p-4 border border-primary/10">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <Info size={14} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                      This was triggered when...
                    </p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {notification.activityContext.trigger}
                    </p>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      {notification.activityContext.description}
                    </p>

                    {/* Actor */}
                    {notification.activityContext.actor && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                        {notification.activityContext.actor.avatar ? (
                          <img
                            src={notification.activityContext.actor.avatar}
                            alt={notification.activityContext.actor.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                            <User size={12} className="text-gray-500" />
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-medium text-gray-900">
                            {notification.activityContext.actor.name}
                          </p>
                          {notification.activityContext.actor.role && (
                            <p className="text-[10px] text-gray-500">
                              {notification.activityContext.actor.role}
                            </p>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400 ml-auto">
                          {formatRelativeTime(notification.activityContext.timestamp)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Related Entities */}
          {notification.relatedEntities && notification.relatedEntities.length > 0 && (
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-xs font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Link2 size={12} className="text-gray-400" />
                Related Records
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {notification.relatedEntities.map((entity, index) => (
                  <RelatedEntityCard
                    key={`${entity.type}-${entity.id}-${index}`}
                    entity={entity}
                    onClick={() => handleEntityClick(entity.url)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Source Link */}
          {notification.actionUrl && (
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-xs font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <ExternalLink size={12} className="text-gray-400" />
                Source Record
              </h3>
              <button
                onClick={handleSourceClick}
                className="w-full flex items-center justify-between p-3 bg-primary/5 hover:bg-primary/10 rounded-xl border border-primary/20 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ExternalLink size={14} className="text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">
                      {notification.actionLabel || `View ${notification.sourceLabel || "Record"}`}
                    </p>
                    <p className="text-[10px] text-gray-500">{notification.actionUrl}</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-primary group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {!notification.isRead && (
              <button
                onClick={() => onMarkAsRead(notification.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
              >
                <Check size={14} />
                Mark as read
              </button>
            )}
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Close
            </button>
            {notification.actionUrl && (
              <button
                onClick={handleSourceClick}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition"
              >
                {notification.actionLabel || "View Details"}
                <ExternalLink size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Notifications Page Component
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [mainTab, setMainTab] = useState<MainTab>("all");
  const [subTab, setSubTab] = useState<SubTab>("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();
  const rowsPerPage = 10;

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    if (mainTab === "unread" && notification.isRead) return false;

    switch (subTab) {
      case "updates":
        if (!isUpdateType(notification.type)) return false;
        break;
      case "actions":
        if (!isActionRequired(notification.priority)) return false;
        break;
      case "system":
        if (!isSystemType(notification.type)) return false;
        break;
    }

    if (search) {
      const searchLower = search.toLowerCase();
      if (
        !notification.title.toLowerCase().includes(searchLower) &&
        !notification.description.toLowerCase().includes(searchLower) &&
        !notification.sourceLabel?.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }

    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredNotifications.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedNotifications = filteredNotifications.slice(startIndex, startIndex + rowsPerPage);

  // Counts
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getSubTabCount = (subTabId: SubTab): number => {
    let baseNotifications = notifications;
    if (mainTab === "unread") {
      baseNotifications = notifications.filter((n) => !n.isRead);
    }

    switch (subTabId) {
      case "all": return baseNotifications.length;
      case "updates": return baseNotifications.filter((n) => isUpdateType(n.type)).length;
      case "actions": return baseNotifications.filter((n) => isActionRequired(n.priority)).length;
      case "system": return baseNotifications.filter((n) => isSystemType(n.type)).length;
      default: return 0;
    }
  };

  // Handlers
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    setSelectedNotification(notification);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedNotification(null);
  };

  const handleMainTabChange = (tab: MainTab) => {
    setMainTab(tab);
    setCurrentPage(1);
  };

  const handleSubTabChange = (tab: SubTab) => {
    setSubTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen p-4 md:p-4">
      <div className="max-w-8xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              Notification Center
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Updates, actions, and system messages
            </p>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                {unreadCount} unread
              </span>
            )}
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Main Tabs */}
        <div className="bg-white border border-gray-200 rounded-xl p-1.5 inline-flex gap-1">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const count = tab.id === "unread" ? unreadCount : notifications.length;

            return (
              <button
                key={tab.id}
                onClick={() => handleMainTabChange(tab.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition ${
                  mainTab === tab.id
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={16} />
                {tab.label}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    mainTab === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sub Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {subTabs.map((tab) => {
            const count = getSubTabCount(tab.id);

            return (
              <button
                key={tab.id}
                onClick={() => handleSubTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${
                  subTab === tab.id
                    ? "bg-primary text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.label}
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] ${
                    subTab === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Indicator */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Showing:</span>
          <span className="font-medium text-gray-700">
            {mainTab === "unread" ? "Unread" : "All"} →{" "}
            {subTab === "all" ? "All Categories" : subTab.charAt(0).toUpperCase() + subTab.slice(1)}
          </span>
          <span className="text-gray-400">({filteredNotifications.length} results)</span>
        </div>

        {/* Notifications List */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {paginatedNotifications.length === 0 ? (
            <div className="py-12 text-center">
              <MailOpen size={40} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-500 font-medium">No notifications found</p>
              <p className="text-xs text-gray-400 mt-1">
                {mainTab === "unread"
                  ? "You've read all your notifications in this category"
                  : "No notifications match your current filters"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {paginatedNotifications.map((notification) => {
                const Icon = typeIcons[notification.type];
                const colors = typeColors[notification.type];
                const priorityInfo = priorityConfig[notification.priority];

                return (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-gray-50 transition border-l-4 cursor-pointer ${
                      priorityInfo.border
                    } ${!notification.isRead ? "bg-blue-50/30" : ""}`}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className={`p-2 rounded-lg ${colors.bg} flex-shrink-0 self-start`}>
                        <Icon size={16} className={colors.icon} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            {/* Title row */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <p
                                className={`text-sm text-gray-900 ${
                                  !notification.isRead ? "font-semibold" : "font-medium"
                                }`}
                              >
                                {notification.title}
                              </p>
                              {notification.priority === "action_required" && (
                                <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-semibold rounded">
                                  Action Required
                                </span>
                              )}
                              {notification.isExpiring && (
                                <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-semibold rounded flex items-center gap-0.5">
                                  <Clock size={10} />
                                  Expiring
                                </span>
                              )}
                              {!notification.isRead && (
                                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                              )}
                            </div>

                            {/* Description */}
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {notification.description}
                            </p>

                            {/* Meta */}
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span
                                className="text-[11px] text-gray-400"
                                data-tooltip-id="notification-tooltip"
                                data-tooltip-content={formatAbsoluteTime(notification.timestamp)}
                              >
                                {formatRelativeTime(notification.timestamp)}
                              </span>
                              {notification.sourceLabel && (
                                <>
                                  <span className="text-gray-300">•</span>
                                  <span className="text-[11px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded font-medium">
                                    {notification.sourceLabel}
                                  </span>
                                </>
                              )}
                              {notification.relatedEntities && notification.relatedEntities.length > 0 && (
                                <>
                                  <span className="text-gray-300">•</span>
                                  <span className="text-[11px] text-gray-400">
                                    {notification.relatedEntities.length} related record{notification.relatedEntities.length > 1 ? 's' : ''}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {!notification.isRead && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification.id);
                                }}
                                data-tooltip-id="notification-tooltip"
                                data-tooltip-content="Mark as read"
                                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                              >
                                <Check size={16} />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(notification.id);
                              }}
                              data-tooltip-id="notification-tooltip"
                              data-tooltip-content="Delete"
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 size={16} />
                            </button>
                            <ChevronRight size={16} className="text-gray-300 ml-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {filteredNotifications.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t bg-gray-50 gap-2">
              <p className="text-xs text-gray-500">
                Showing {startIndex + 1} -{" "}
                {Math.min(startIndex + rowsPerPage, filteredNotifications.length)} of{" "}
                {filteredNotifications.length}
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

      {/* Tooltip */}
      <Tooltip
        id="notification-tooltip"
        place="top"
        className="!bg-gray-800 !text-white !text-[10px] !px-2 !py-1 !rounded"
      />

      {/* Notification Detail Popup */}
      <NotificationDetailPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        notification={selectedNotification}
        onMarkAsRead={handleMarkAsRead}
        onDelete={handleDelete}
      />
    </div>
  );
}