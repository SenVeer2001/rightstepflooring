// components/QuickReplyPanel.tsx

import React, { useEffect, useRef } from 'react';
import { 
  X, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Zap,
  Edit3,
  Trash2,
  Copy,
  Star
} from 'lucide-react';
import { type QuickReply } from '../../types/communication';

interface QuickReplyPanelProps {
  isOpen: boolean;
  onClose: () => void;
  quickReplies: QuickReply[];
  onUseReply: (reply: QuickReply) => void;
  onEditReply?: (reply: QuickReply) => void;
  onDeleteReply?: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const QuickReplyPanel: React.FC<QuickReplyPanelProps> = ({
  isOpen,
  onClose,
  quickReplies,
  onUseReply,
  onEditReply,
  onDeleteReply,
  searchQuery,
  onSearchChange,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const filteredReplies = quickReplies.filter((reply) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        reply.title.toLowerCase().includes(query) ||
        reply.content.toLowerCase().includes(query) ||
        reply.category.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Group by category
  const groupedReplies = filteredReplies.reduce((acc, reply) => {
    if (!acc[reply.category]) {
      acc[reply.category] = [];
    }
    acc[reply.category].push(reply);
    return acc;
  }, {} as Record<string, QuickReply[]>);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Zap size={18} className="text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Quick Replies</h2>
                <p className="text-[10px] text-gray-500">{quickReplies.length} templates available</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} /> */}
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          {Object.keys(groupedReplies).length === 0 ? (
            <div className="text-center py-12">
              <Search size={40} className="mx-auto mb-3 text-gray-200" />
              <p className="text-sm text-gray-500 font-medium">No templates found</p>
              <p className="text-xs text-gray-400 mt-1">Try adjusting your search</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedReplies).map(([category, replies]) => (
                <div key={category}>
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary/50" />
                    {category}
                    <span className="text-gray-400 font-normal">({replies.length})</span>
                  </h3>
                  <div className="space-y-2">
                    {replies.map((reply) => (
                      <QuickReplyCard
                        key={reply.id}
                        reply={reply}
                        onUse={() => {
                          onUseReply(reply);
                          onClose();
                        }}
                        onEdit={() => onEditReply?.(reply)}
                        onDelete={() => onDeleteReply?.(reply.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition shadow-sm">
            <Plus size={16} />
            Create New Template
          </button>
        </div>
      </div>
    </>
  );
};

// Quick Reply Card Sub-component
interface QuickReplyCardProps {
  reply: QuickReply;
  onUse: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const QuickReplyCard: React.FC<QuickReplyCardProps> = ({ reply, onUse, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/30 bg-white group ${
        reply.isActive ? 'border-primary/30 ring-2 ring-primary/10' : 'border-gray-200'
      }`}
    >
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-primary transition">
              {reply.title}
            </p>
          </div>
          <div className="relative flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal size={14} />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onEdit?.();
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit3 size={12} />
                    Edit Template
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(reply.content);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Copy size={12} />
                    Copy Content
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onDelete?.();
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 mb-3">
          {reply.content}
        </p>

        <button
          onClick={onUse}
          className="w-full py-2 text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition flex items-center justify-center gap-1"
        >
          <Plus size={12} />
          Use Template
        </button>
      </div>
    </div>
  );
};

export default QuickReplyPanel;