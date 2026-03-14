// components/NotificationMessage.tsx

import React, { useState } from 'react';
import {
  CheckCheck,
  X,
  Eye,
  ExternalLink,
  Clock,
  AlertCircle,
  Info,
  Briefcase,
  CreditCard,
  FileText,
  Users,
  User,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from 'lucide-react';
import { type Chat, type Message, type NotificationPriority, type QuickReply, type RelatedEntity } from '../../types/communication';
import { formatDateTime, formatCurrency } from '../../utils/communicationHelpers';

// Entity type icons and colors
const entityConfig: Record<string, { icon: React.ElementType; bg: string; iconColor: string }> = {
  job: { icon: Briefcase, bg: 'bg-blue-50', iconColor: 'text-blue-600' },
  estimate: { icon: FileText, bg: 'bg-orange-50', iconColor: 'text-orange-600' },
  invoice: { icon: CreditCard, bg: 'bg-green-50', iconColor: 'text-green-600' },
  work_order: { icon: FileText, bg: 'bg-yellow-50', iconColor: 'text-yellow-600' },
  customer: { icon: User, bg: 'bg-cyan-50', iconColor: 'text-cyan-600' },
  lead: { icon: Users, bg: 'bg-purple-50', iconColor: 'text-purple-600' },
};

const priorityConfig: Record<NotificationPriority, { 
  icon: React.ElementType; 
  bg: string; 
  border: string; 
  text: string;
  label: string;
}> = {
  action_required: { 
    icon: AlertCircle, 
    bg: 'bg-red-50', 
    border: 'border-l-red-500',
    text: 'text-red-700',
    label: 'Action Required'
  },
  informational: { 
    icon: Info, 
    bg: 'bg-blue-50', 
    border: 'border-l-blue-400',
    text: 'text-blue-700',
    label: 'Informational'
  },
  completed: { 
    icon: CheckCheck, 
    bg: 'bg-green-50', 
    border: 'border-l-green-500',
    text: 'text-green-700',
    label: 'Completed'
  },
};

const statusColors: Record<string, { bg: string; text: string }> = {
  green: { bg: 'bg-green-100', text: 'text-green-700' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  red: { bg: 'bg-red-100', text: 'text-red-700' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-700' },
  gray: { bg: 'bg-gray-100', text: 'text-gray-700' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-700' },
};

interface NotificationMessageProps {
  message: Message;
  onAccept?: () => void;
  onReject?: () => void;
  onViewDetails?: () => void;
  onEntityClick?: (entity: RelatedEntity) => void;
}

const NotificationMessage: React.FC<NotificationMessageProps> = ({
  message,
  onAccept,
  onReject,
  onViewDetails,
  onEntityClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const notification = message.notificationContent;

  if (!notification) return null;

  const priority = priorityConfig[notification.priority];
  const PriorityIcon = priority.icon;

  return (
    <div className="mb-4 max-w-2xl">
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden border-l-4 ${priority.border}`}>
        {/* Header */}
        <div className={`px-4 py-3 ${priority.bg}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm flex-shrink-0">
                <PriorityIcon size={18} className={priority.text} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-gray-900 text-sm">{notification.title}</h4>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${priority.bg} ${priority.text}`}>
                    {priority.label}
                  </span>
                </div>
                {notification.sourceLabel && (
                  <span className="text-[10px] text-gray-500 font-medium">
                    #{notification.sourceLabel}
                  </span>
                )}
              </div>
            </div>

            {notification.isExpiring && (
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-[10px] font-semibold flex-shrink-0">
                <AlertTriangle size={10} />
                Expiring Soon
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-3">
          <p className="text-sm text-gray-600 leading-relaxed">{notification.description}</p>

          {/* Related Entities - Collapsible */}
          {notification.relatedEntities && notification.relatedEntities.length > 0 && (
            <div className="mt-3">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-primary transition"
              >
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {notification.relatedEntities.length} Related Record{notification.relatedEntities.length > 1 ? 's' : ''}
              </button>

              {isExpanded && (
                <div className="mt-2 space-y-2">
                  {notification.relatedEntities.map((entity, index) => {
                    const config = entityConfig[entity.type] || entityConfig.job;
                    const EntityIcon = config.icon;
                    const statusColor = entity.statusColor ? statusColors[entity.statusColor] : null;

                    return (
                      <div
                        key={`${entity.type}-${entity.id}-${index}`}
                        onClick={() => onEntityClick?.(entity)}
                        className="flex items-center gap-3 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition group"
                      >
                        <div className={`p-1.5 rounded-lg ${config.bg} flex-shrink-0`}>
                          <EntityIcon size={12} className={config.iconColor} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate group-hover:text-primary">
                            {entity.title}
                          </p>
                          {entity.subtitle && (
                            <p className="text-[10px] text-gray-500 truncate">{entity.subtitle}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {entity.status && statusColor && (
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${statusColor.bg} ${statusColor.text}`}>
                              {entity.status}
                            </span>
                          )}
                          {entity.amount !== undefined && (
                            <span className="text-xs font-bold text-gray-900">
                              {formatCurrency(entity.amount)}
                            </span>
                          )}
                          <ExternalLink size={10} className="text-gray-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {notification.priority === 'action_required' && (
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
              <button
                onClick={onAccept}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition shadow-sm bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCheck size={14} />
                Accept
              </button>
              <button
                onClick={onReject}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition shadow-sm bg-red-600 hover:bg-red-700 text-white"
              >
                <X size={14} />
                Reject
              </button>
              <button
                onClick={onViewDetails}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition shadow-sm bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 ml-auto"
              >
                <Eye size={14} />
                View Details
              </button>
            </div>
          )}

          {notification.priority !== 'action_required' && notification.actionUrl && (
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
              <button
                onClick={onViewDetails}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition shadow-sm bg-primary hover:bg-primary/90 text-white"
              >
                <Eye size={14} />
                {notification.actionLabel || 'View Details'}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
          <Clock size={10} className="text-gray-400" />
          <span className="text-[10px] text-gray-400">{formatDateTime(message.timestamp)}</span>
        </div>
      </div>
    </div>
  );
};

export default NotificationMessage;