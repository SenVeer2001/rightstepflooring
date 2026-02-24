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
  Info,
  AlertCircle,
  Users,
  Ticket,
  FileCheck,
  Upload,
  DollarSign,
  Eye,
  FileText as FileIcon,
  MoreHorizontal,
  Inbox,
  Building2,
  UserCircle,
  Archive,
} from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {
  type Notification,
  type NotificationType,
  type NotificationPriority,
  mockNotifications,
} from "../../types/notification";
import { NotificationDetailPopup } from "./NotificationDetailPopup";

// Main tab types
type MainTab = "all" | "unread";

// Sub tab types
type SubTab = "all" | "updates" | "actions" | "system" | "requests" | "clients" | "team" | "archived";

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

const priorityConfig: Record<NotificationPriority, { label: string; color: string; bg: string; icon: React.ElementType; border: string }> = {
  action_required: { label: "Action Required", color: "text-red-700", bg: "bg-red-100", icon: AlertCircle, border: "border-l-red-500" },
  informational: { label: "Informational", color: "text-blue-700", bg: "bg-blue-100", icon: Info, border: "border-l-blue-400" },
  completed: { label: "Completed", color: "text-green-700", bg: "bg-green-100", icon: CheckCheck, border: "border-l-green-500" },
};

const mainTabs: { id: MainTab; label: string; icon: React.ElementType }[] = [
  { id: "all", label: "All", icon: Bell },
  { id: "unread", label: "Unread", icon: Mail },
];

const subTabs: { id: SubTab; label: string; icon: React.ElementType; color?: string }[] = [
  { id: "all", label: "All", icon: Bell },
  { id: "updates", label: "Updates", icon: RefreshCw },
  { id: "actions", label: "Actions", icon: Zap, color: "text-red-600" },
  { id: "requests", label: "Requests", icon: Inbox, color: "text-orange-600" },
  { id: "clients", label: "Clients", icon: Building2, color: "text-blue-600" },
  { id: "team", label: "Team", icon: Users, color: "text-purple-600" },
  { id: "system", label: "System", icon: Settings },
  { id: "archived", label: "Archived", icon: Archive, color: "text-gray-500" },
];

const ctaButtonConfig: Record<string, { icon: React.ElementType; variant: 'primary' | 'secondary' | 'success' | 'warning' }> = {
  'View Job': { icon: Eye, variant: 'primary' },
  'Review Estimate': { icon: FileIcon, variant: 'primary' },
  'Accept Work Order': { icon: CheckCheck, variant: 'success' },
  'View Invoice': { icon: CreditCard, variant: 'primary' },
  'Upload Document': { icon: Upload, variant: 'secondary' },
  'Approve Payment': { icon: DollarSign, variant: 'success' },
  'Review Changes': { icon: Eye, variant: 'primary' },
  'Respond': { icon: MessageSquare, variant: 'secondary' },
};

const buttonVariants = {
  primary: 'bg-primary hover:bg-primary/90 text-white',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300',
  success: 'bg-green-600 hover:bg-green-700 text-white',
  warning: 'bg-orange-500 hover:bg-orange-600 text-white',
};

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

// Helper functions for filtering
const isUpdateType = (type: NotificationType): boolean => {
  return ["assignment", "payment", "message", "document", "mention", "reminder"].includes(type);
};

const isActionRequired = (priority: NotificationPriority): boolean => {
  return priority === "action_required";
};

const isSystemType = (type: NotificationType): boolean => {
  return type === "system" || type === "alert";
};

const isRequestType = (notification: Notification): boolean => {
  const requestTypes = ['estimate', 'work_order', 'job'];
  if (notification.relatedEntities) {
    return notification.relatedEntities.some(entity => requestTypes.includes(entity.type));
  }
  if (notification.sourceLabel) {
    const label = notification.sourceLabel.toLowerCase();
    return label.includes('est-') || label.includes('wo-') || label.includes('request');
  }
  return notification.type === 'assignment' && notification.priority === 'action_required';
};

const isClientType = (notification: Notification): boolean => {
  const clientTypes = ['customer', 'invoice', 'lead'];
  if (notification.relatedEntities) {
    return notification.relatedEntities.some(entity => clientTypes.includes(entity.type));
  }
  if (notification.sourceLabel) {
    const label = notification.sourceLabel.toLowerCase();
    return label.includes('cust-') || label.includes('inv-') || label.includes('lead-');
  }
  return notification.type === 'payment' || notification.type === 'message';
};

const isTeamType = (notification: Notification): boolean => {
  if (notification.relatedEntities) {
    return notification.relatedEntities.some(entity => entity.type === 'staff');
  }
  return notification.type === 'mention' || notification.type === 'assignment';
};

const isArchivedType = (notification: Notification): boolean => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return notification.priority === 'completed' || notification.timestamp < thirtyDaysAgo;
};

interface NotificationCTAProps {
  notification: Notification;
  onAction: (e: React.MouseEvent) => void;
  onAccept?: (e: React.MouseEvent) => void;
  onReject?: (e: React.MouseEvent) => void;
  showMoreMenu?: boolean;
}

const NotificationCTA = ({ 
  notification, 
  onAction, 
  onAccept,
  onReject,
  showMoreMenu = false 
}: NotificationCTAProps) => {
  const [showMenu, setShowMenu] = useState(false);

  if (notification.priority !== 'action_required' || !notification.actionLabel) {
    return null;
  }

  const getSourceType = (): string => {
    if (notification.relatedEntities && notification.relatedEntities.length > 0) {
      return notification.relatedEntities[0].type;
    }
    if (notification.sourceLabel) {
      const lowerLabel = notification.sourceLabel.toLowerCase();
      if (lowerLabel.includes('invoice') || lowerLabel.includes('inv-')) return 'invoice';
      if (lowerLabel.includes('estimate') || lowerLabel.includes('est-')) return 'estimate';
      if (lowerLabel.includes('work') || lowerLabel.includes('wo-')) return 'work_order';
      if (lowerLabel.includes('job')) return 'job';
    }
    return '';
  };

  const sourceType = getSourceType();
  
  const shouldShowAcceptReject = sourceType !== 'invoice' && 
    (sourceType === 'estimate' || 
     sourceType === 'work_order' || 
     sourceType === 'job' ||
     notification.actionLabel.includes('Approve') ||
     notification.actionLabel.includes('Accept') ||
     notification.actionLabel.includes('Review'));

  if (sourceType === 'estimate') {
    return (
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAccept?.(e);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm bg-green-600 hover:bg-green-700 text-white"
        >
          <CheckCheck size={14} />
          Approve Estimate
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReject?.(e);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm bg-red-600 hover:bg-red-700 text-white"
        >
          <X size={14} />
          Reject
        </button>
        <button
          onClick={onAction}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
        >
          <Eye size={14} />
          View Details
        </button>
      </div>
    );
  }

  if (shouldShowAcceptReject) {
    return (
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAccept?.(e);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm bg-green-600 hover:bg-green-700 text-white"
        >
          <CheckCheck size={14} />
          Accept
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReject?.(e);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm bg-red-600 hover:bg-red-700 text-white"
        >
          <X size={14} />
          Reject
        </button>
        
        {showMoreMenu && (
          <div className="relative ml-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <MoreHorizontal size={16} />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onAction(e);
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Eye size={12} />
                    View Details
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  const config = ctaButtonConfig[notification.actionLabel] || { icon: ArrowRight, variant: 'primary' as const };
  const Icon = config.icon;
  const buttonStyle = buttonVariants[config.variant];

  return (
    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
      <button
        onClick={onAction}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm ${buttonStyle}`}
      >
        <Icon size={14} />
        {notification.actionLabel}
      </button>
    </div>
  );
};

// Main Notifications Page Component
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [archivedNotifications, setArchivedNotifications] = useState<Notification[]>([]);
  const [mainTab, setMainTab] = useState<MainTab>("all");
  const [subTab, setSubTab] = useState<SubTab>("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [selectedNotificationIndex, setSelectedNotificationIndex] = useState<number>(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();
  const rowsPerPage = 10;

  // Filter notifications based on tabs
  const filteredNotifications = (subTab === 'archived' ? archivedNotifications : notifications).filter((notification) => {
    // Main tab filter
    if (mainTab === "unread" && notification.isRead) return false;

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
      case "requests":
        if (!isRequestType(notification)) return false;
        break;
      case "clients":
        if (!isClientType(notification)) return false;
        break;
      case "team":
        if (!isTeamType(notification)) return false;
        break;
      case "archived":
        // Already using archivedNotifications
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
  const paginatedNotifications = filteredNotifications.slice(startIndex, startIndex + rowsPerPage);

  // Counts
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getSubTabCount = (subTabId: SubTab): number => {
    let baseNotifications = subTabId === 'archived' ? archivedNotifications : notifications;
    if (mainTab === "unread") {
      baseNotifications = baseNotifications.filter((n) => !n.isRead);
    }

    switch (subTabId) {
      case "all": return notifications.length;
      case "updates": return baseNotifications.filter((n) => isUpdateType(n.type)).length;
      case "actions": return baseNotifications.filter((n) => isActionRequired(n.priority)).length;
      case "system": return baseNotifications.filter((n) => isSystemType(n.type)).length;
      case "requests": return baseNotifications.filter((n) => isRequestType(n)).length;
      case "clients": return baseNotifications.filter((n) => isClientType(n)).length;
      case "team": return baseNotifications.filter((n) => isTeamType(n)).length;
      case "archived": return archivedNotifications.length;
      default: return 0;
    }
  };

  // Handlers
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setArchivedNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setArchivedNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleArchive = (id: string) => {
    const notificationToArchive = notifications.find(n => n.id === id);
    if (notificationToArchive) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setArchivedNotifications((prev) => [...prev, { ...notificationToArchive, isRead: true }]);
    }
  };

  const handleRestore = (id: string) => {
    const notificationToRestore = archivedNotifications.find(n => n.id === id);
    if (notificationToRestore) {
      setArchivedNotifications((prev) => prev.filter((n) => n.id !== id));
      setNotifications((prev) => [...prev, notificationToRestore]);
    }
  };

  const handleNotificationClick = (notification: Notification, index: number) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    setSelectedNotification(notification);
    setSelectedNotificationIndex(index);
    setIsPopupOpen(true);
  };

  const handleNextNotification = () => {
    const nextIndex = selectedNotificationIndex + 1;
    if (nextIndex < filteredNotifications.length) {
      const nextNotification = filteredNotifications[nextIndex];
      if (!nextNotification.isRead) {
        handleMarkAsRead(nextNotification.id);
      }
      setSelectedNotification(nextNotification);
      setSelectedNotificationIndex(nextIndex);
    }
  };

  const handlePreviousNotification = () => {
    const prevIndex = selectedNotificationIndex - 1;
    if (prevIndex >= 0) {
      const prevNotification = filteredNotifications[prevIndex];
      setSelectedNotification(prevNotification);
      setSelectedNotificationIndex(prevIndex);
    }
  };

  const handleCTAClick = (notification: Notification, e: React.MouseEvent) => {
    e.stopPropagation();
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const handleAccept = (notification: Notification, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => 
        n.id === notification.id 
          ? { ...n, isRead: true, priority: 'completed' as NotificationPriority } 
          : n
      )
    );
    console.log(`Accepted: ${notification.title}`);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const handleReject = (notification: Notification, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => n.id === notification.id ? { ...n, isRead: true } : n)
    );
    const confirmed = window.confirm(`Are you sure you want to reject: ${notification.title}?`);
    if (confirmed) {
      handleDelete(notification.id);
      console.log(`Rejected: ${notification.title}`);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedNotification(null);
    setSelectedNotificationIndex(0);
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
            const TabIcon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => handleSubTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap ${
                  subTab === tab.id
                    ? "bg-primary text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <TabIcon 
                  size={14} 
                  className={subTab === tab.id ? "text-white" : tab.color || "text-gray-500"} 
                />
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
            {subTab === "all" ? "All Categories" : subTabs.find(t => t.id === subTab)?.label}
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
                {subTab === "archived"
                  ? "No archived notifications"
                  : mainTab === "unread"
                  ? "You've read all your notifications in this category"
                  : "No notifications match your current filters"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {paginatedNotifications.map((notification, index) => {
                const actualIndex = startIndex + index;
                const Icon = typeIcons[notification.type];
                const colors = typeColors[notification.type];
                const priorityInfo = priorityConfig[notification.priority];

                return (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification, actualIndex)}
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

                            {/* CTA Buttons */}
                            <NotificationCTA
                              notification={notification}
                              onAction={(e) => handleCTAClick(notification, e)}
                              onAccept={(e) => handleAccept(notification, e)}
                              onReject={(e) => handleReject(notification, e)}
                              showMoreMenu={false}
                            />
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
                            {subTab !== 'archived' ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleArchive(notification.id);
                                }}
                                data-tooltip-id="notification-tooltip"
                                data-tooltip-content="Archive"
                                className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                              >
                                <Archive size={16} />
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRestore(notification.id);
                                }}
                                data-tooltip-id="notification-tooltip"
                                data-tooltip-content="Restore"
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              >
                                <RefreshCw size={16} />
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
        onNext={handleNextNotification}
        onPrevious={handlePreviousNotification}
        hasNext={selectedNotificationIndex < filteredNotifications.length - 1}
        hasPrevious={selectedNotificationIndex > 0}
        currentIndex={selectedNotificationIndex}
        totalCount={filteredNotifications.length}
      />
    </div>
  );
}