// components/MessageBubble.tsx

import React from 'react';
import {
  Check,
  CheckCheck,
  Copy,
  Star,
  Plus,
  Download,
  FileText,
} from 'lucide-react';
import { type Message } from '../../types/communication';
import { formatDateTime } from '../../utils/communicationHelpers';

interface MessageBubbleProps {
  message: Message;
  onStar?: () => void;
  onCopy?: () => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onStar, onCopy }) => {
  const isOutgoing = message.direction === 'outgoing';

  return (
    <div className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className="max-w-xl">
        <div
          className={`relative px-4 py-3 rounded-2xl shadow-sm ${
            isOutgoing
              ? 'bg-primary text-white rounded-br-md'
              : 'bg-white border border-gray-100 rounded-bl-md'
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center gap-2">
              {!isOutgoing && (
                <>
                  <span className="font-semibold text-sm text-gray-900">{message.senderPhone || message.senderName}</span>
                </>
              )}
              {isOutgoing && <span className="font-semibold text-sm">You</span>}
            </div>
            <div className={`flex gap-2 ${isOutgoing ? 'text-white/60' : 'text-gray-300'}`}>
              <button
                onClick={onCopy}
                className="hover:opacity-100 opacity-60 transition"
                title="Copy"
              >
                <Copy size={12} />
              </button>
              <button
                onClick={onStar}
                className={`hover:opacity-100 opacity-60 transition ${message.isStarred ? 'opacity-100 text-yellow-400' : ''}`}
                title={message.isStarred ? 'Unstar' : 'Star'}
              >
                <Star size={12} className={message.isStarred ? 'fill-yellow-400' : ''} />
              </button>
            </div>
          </div>

          {/* Content */}
          <p className={`text-sm leading-relaxed ${isOutgoing ? 'text-white' : 'text-gray-700'}`}>
            {message.content}
          </p>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {message.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs ${
                    isOutgoing ? 'bg-white/10' : 'bg-gray-50'
                  }`}
                >
                  <FileText size={12} />
                  <span className="truncate max-w-[120px]">{attachment.name}</span>
                  <Download size={10} className="cursor-pointer hover:text-primary flex-shrink-0" />
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions for incoming messages */}
          {!isOutgoing && message.type === 'text' && (
            <div className="flex gap-2 mt-3">
              <button className="bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-lg hover:bg-primary/90 transition flex items-center gap-1">
                <Plus size={10} /> Add Job
              </button>
              <button className="bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-lg hover:bg-primary/90 transition flex items-center gap-1">
                <Plus size={10} /> Add Lead
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`flex items-center gap-2 mt-1 text-[10px] text-gray-400 ${
            isOutgoing ? 'justify-end' : 'justify-start'
          }`}
        >
          <span>{formatDateTime(message.timestamp)}</span>
          {isOutgoing && (
            <span className="flex items-center gap-0.5">
              {message.status === 'read' ? (
                <CheckCheck size={12} className="text-blue-500" />
              ) : message.status === 'delivered' ? (
                <CheckCheck size={12} />
              ) : (
                <Check size={12} />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;