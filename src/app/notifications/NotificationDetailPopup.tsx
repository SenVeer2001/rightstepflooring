import { useNavigate } from "react-router-dom";
import {
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
  X,
  User,
  ArrowRight,
  Link2,
  Info,
  AlertCircle,
  Users,
  Ticket,
  FileCheck,
} from "lucide-react";
import {
  type Notification,
  type NotificationType,
  type NotificationPriority,
  type SourceType,
  type RelatedEntity,
} from "../../types/notification";

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

interface NotificationDetailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  notification: Notification | null;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  currentIndex?: number;
  totalCount?: number;
}

export const NotificationDetailPopup = ({
  isOpen,
  onClose,
  notification,
  onMarkAsRead,
  onDelete,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
  currentIndex = 0,
  totalCount = 0,
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

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' && hasNext && onNext) {
      e.preventDefault();
      onNext();
    } else if (e.key === 'ArrowLeft' && hasPrevious && onPrevious) {
      e.preventDefault();
      onPrevious();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
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

                {/* Navigation & Close Buttons */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {/* Counter */}
                  {totalCount > 0 && (
                    <span className="text-xs text-gray-500 mr-2 font-medium">
                      {currentIndex + 1} / {totalCount}
                    </span>
                  )}
                  
                  {/* Previous Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPrevious?.();
                    }}
                    disabled={!hasPrevious}
                    className="p-2 hover:bg-white/50 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Previous (←)"
                  >
                    <ChevronLeft size={20} className="text-gray-500" />
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNext?.();
                    }}
                    disabled={!hasNext}
                    className="p-2 hover:bg-white/50 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Next (→)"
                  >
                    <ChevronRight size={20} className="text-gray-500" />
                  </button>

                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/50 rounded-lg transition ml-1"
                    title="Close (Esc)"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>
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
            {/* Next Button (Primary Action) */}
            {hasNext && (
              <button
                onClick={onNext}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition shadow-sm"
              >
                Next
                <ChevronRight size={14} />
              </button>
            )}
            
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

export default NotificationDetailPopup;