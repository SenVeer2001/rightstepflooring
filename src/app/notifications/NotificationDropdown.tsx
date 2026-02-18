// components/notifications/NotificationDropdown.tsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  X,
  CheckCheck,
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
} from "lucide-react";
import type { Notification, NotificationType, NotificationPriority } from "../../types/notification";

interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

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
  system: { bg: "bg-gray-50", icon: "text-gray-600" },
  mention: { bg: "bg-pink-50", icon: "text-pink-600" },
  reminder: { bg: "bg-yellow-50", icon: "text-yellow-600" },
};

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

export default function NotificationDropdown({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const displayCount = unreadCount > 9 ? "9+" : unreadCount;
  const recentNotifications = notifications.slice(0, 5);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
    setIsOpen(false);
  };

  const handleViewAll = () => {
    setIsOpen(false);
    navigate("/notifications");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:bg-gray-100 hover:text-primary rounded-lg transition"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {displayCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">New Notifications</h3>
              <p className="text-xs text-gray-500">
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                >
                  <CheckCheck size={12} />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-200 rounded transition"
              >
                <X size={14} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[350px] overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-500">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentNotifications.map((notification) => {
                  const Icon = typeIcons[notification.type];
                  const colors = typeColors[notification.type];

                  return (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition ${
                        !notification.isRead ? "bg-blue-50/40" : ""
                      } ${notification.priority === "action_required" ? "border-l-3 border-l-red-500" : ""}`}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className={`p-2 rounded-lg ${colors.bg} flex-shrink-0`}>
                          <Icon size={16} className={colors.icon} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm text-gray-900 line-clamp-1 ${!notification.isRead ? "font-semibold" : "font-medium"}`}>
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                          
                          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                            {notification.description}
                          </p>

                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs text-gray-400">
                              {formatRelativeTime(notification.timestamp)}
                            </span>
                            {notification.sourceLabel && (
                              <>
                                <span className="text-gray-300">•</span>
                                <span className="text-xs text-primary font-medium">
                                  {notification.sourceLabel}
                                </span>
                              </>
                            )}
                            {notification.isExpiring && (
                              <>
                                <span className="text-gray-300">•</span>
                                <span className="text-xs text-yellow-600 font-medium flex items-center gap-0.5">
                                  <Clock size={10} />
                                  Expiring
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 p-3">
            <button
              onClick={handleViewAll}
              className="w-full flex items-center justify-center gap-2 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition"
            >
              View All Notifications
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}