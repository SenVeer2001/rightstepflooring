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
} from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {
  type Notification,
  type NotificationType,
  type NotificationPriority,
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
const typeColors: Record<NotificationType, { bg: string; icon: string }> = {
  assignment: { bg: "bg-blue-50", icon: "text-blue-600" },
  payment: { bg: "bg-green-50", icon: "text-green-600" },
  alert: { bg: "bg-red-50", icon: "text-red-600" },
  message: { bg: "bg-purple-50", icon: "text-purple-600" },
  document: { bg: "bg-orange-50", icon: "text-orange-600" },
  system: { bg: "bg-gray-100", icon: "text-gray-600" },
  mention: { bg: "bg-pink-50", icon: "text-pink-600" },
  reminder: { bg: "bg-yellow-50", icon: "text-yellow-600" },
};

// Priority border colors
const priorityBorder: Record<NotificationPriority, string> = {
  action_required: "border-l-red-500",
  informational: "border-l-blue-400",
  completed: "border-l-green-500",
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

// Format relative time
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

// Helper to check if notification belongs to "updates" category
const isUpdateType = (type: NotificationType): boolean => {
  return ["assignment", "payment", "message", "document", "mention", "reminder"].includes(type);
};

// Helper to check if notification belongs to "actions" category
const isActionRequired = (priority: NotificationPriority): boolean => {
  return priority === "action_required";
};

// Helper to check if notification belongs to "system" category
const isSystemType = (type: NotificationType): boolean => {
  return type === "system" || type === "alert";
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [mainTab, setMainTab] = useState<MainTab>("all");
  const [subTab, setSubTab] = useState<SubTab>("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const rowsPerPage = 10;

  // Filter notifications based on main tab and sub tab
  const filteredNotifications = notifications.filter((notification) => {
    // Main tab filter (All or Unread)
    if (mainTab === "unread" && notification.isRead) {
      return false;
    }

    // Sub tab filter
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
      case "all":
      default:
        break;
    }

    // Search filter
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
  const paginatedNotifications = filteredNotifications.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  // Counts for main tabs
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Get count for sub tabs (respects main tab selection)
  const getSubTabCount = (subTabId: SubTab): number => {
    let baseNotifications = notifications;

    // If main tab is "unread", only count unread notifications
    if (mainTab === "unread") {
      baseNotifications = notifications.filter((n) => !n.isRead);
    }

    switch (subTabId) {
      case "all":
        return baseNotifications.length;
      case "updates":
        return baseNotifications.filter((n) => isUpdateType(n.type)).length;
      case "actions":
        return baseNotifications.filter((n) => isActionRequired(n.priority)).length;
      case "system":
        return baseNotifications.filter((n) => isSystemType(n.type)).length;
      default:
        return 0;
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
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
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

        {/* Main Tabs - All / Unread */}
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
                  className={`px-2 py-2 rounded-full text-xs ${
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

        {/* Sub Tabs - Updates / Actions / System */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const count = getSubTabCount(tab.id);

            return (
              <button
                key={tab.id}
                onClick={() => handleSubTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${
                  subTab === tab.id
                    ? "bg-primary text-white "
                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {/* <Icon size={14} /> */}
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

        {/* Current Filter Indicator */}
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

                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition border-l-4 ${
                      priorityBorder[notification.priority]
                    } ${!notification.isRead ? "bg-blue-50/30" : ""}`}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div
                        className={`p-2 rounded-lg ${colors.bg} flex-shrink-0 self-start`}
                      >
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
                                data-tooltip-content={formatAbsoluteTime(
                                  notification.timestamp
                                )}
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
                            </div>

                            {/* Action Button */}
                            {notification.actionLabel && notification.actionUrl && (
                              <button
                                onClick={() => handleNotificationClick(notification)}
                                className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition"
                              >
                                {notification.actionLabel}
                                <ExternalLink size={12} />
                              </button>
                            )}
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
                  className="px-2 py-1 text-xs rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="px-2 py-1 text-xs font-medium">
                  {currentPage} / {totalPages || 1}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronRight size={14} />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-2 py-1 text-xs rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
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
    </div>
  );
}