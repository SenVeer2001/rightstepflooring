// components/CommunicationHub.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Users,
  Inbox,
  Archive,
  Search,
  Phone,
  Settings,
  MoreHorizontal,
  Plus,
  Send,
  Paperclip,
  Image,
  Smile,
  Video,
  Filter,
  X,
  Pin,
  Mail,
  MailOpen,
  ChevronLeft,
  ChevronRight,
  Building2,
  Zap,
} from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

import { type Chat, type Message, type NavTab, type QuickReply } from '../../types/communication';
import { mockChats, mockMessages, mockQuickReplies } from '../../data/mockCommunicationData';
import { formatTime, formatDateHeader, getInitials, getStatusColor } from '../../utils/communicationHelpers';
import QuickReplyPanel from './QuickReplyPanel';
import NotificationMessage from './NotificationMessage';
import MessageBubble from './MessageBubble';

// ============================================
// SUB-COMPONENTS
// ============================================

// Navigation Item
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, count, active, collapsed, onClick }) => (
  <div
    onClick={onClick}
    data-tooltip-id="nav-tooltip"
    data-tooltip-content={collapsed ? label : undefined}
    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
      active
        ? 'bg-primary/10 text-primary font-semibold border border-primary/20'
        : 'hover:bg-gray-100 text-gray-700'
    }`}
  >
    <div className="flex items-center gap-3">
      <span className={`flex-shrink-0 ${active ? 'text-primary' : 'text-gray-500'}`}>{icon}</span>
      {!collapsed && <span className="text-sm">{label}</span>}
    </div>
    {!collapsed && count !== undefined && (
      <span
        className={`text-xs px-2 py-0.5 rounded-full ${
          active ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
        }`}
      >
        {count}
      </span>
    )}
  </div>
);

// Chat List Item
interface ChatListItemProps {
  chat: Chat;
  active?: boolean;
  onClick?: () => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ chat, active, onClick }) => (
  <div
    onClick={onClick}
    className={`p-3 cursor-pointer transition-all duration-200 border-b border-gray-50 ${
      active ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-gray-50'
    }`}
  >
    <div className="flex justify-between items-start gap-2">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative flex-shrink-0">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase ${
              chat.type === 'team'
                ? 'bg-purple-600'
                : chat.type === 'request'
                ? 'bg-orange-500'
                : 'bg-primary'
            }`}
          >
            {getInitials(chat.name)}
          </div>
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
              chat.status
            )}`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`text-sm truncate ${active || chat.unreadCount > 0 ? 'font-semibold' : 'font-medium'}`}>
              {chat.name}
            </span>
            {chat.isPinned && <Pin size={10} className="text-primary fill-primary flex-shrink-0" />}
          </div>
          <div className="flex items-center gap-1 mt-0.5 flex-wrap">
            {chat.tags?.slice(0, 1).map((tag) => (
              <span key={tag} className="text-[9px] px-1 py-0.5 bg-gray-100 text-gray-600 rounded">
                {tag}
              </span>
            ))}
            {chat.type !== 'client' && (
              <span
                className={`text-[9px] px-1 py-0.5 rounded font-medium ${
                  chat.type === 'team' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                }`}
              >
                {chat.type === 'team' ? 'Team' : 'Request'}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="text-[10px] text-gray-400">{formatTime(chat.lastMessageTime)}</span>
        {chat.unreadCount > 0 && (
          <span className="w-5 h-5 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold">
            {chat.unreadCount}
          </span>
        )}
      </div>
    </div>
    <p className="text-xs text-gray-500 truncate mt-1.5 ml-13">{chat.lastMessage}</p>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

const CommunicationHub: React.FC = () => {
  // State
  const [activeNav, setActiveNav] = useState<NavTab>('all');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(mockChats[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [quickReplies] = useState<QuickReply[]>(mockQuickReplies);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickReplySearch, setQuickReplySearch] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isQuickReplyOpen, setIsQuickReplyOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Filter chats
  const filteredChats = chats.filter((chat) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!chat.name.toLowerCase().includes(query) && !chat.phone.includes(query)) {
        return false;
      }
    }

    switch (activeNav) {
      case 'requests':
        return chat.type === 'request';
      case 'clients':
        return chat.type === 'client' && !chat.isArchived;
      case 'team':
        return chat.type === 'team';
      case 'archived':
        return chat.isArchived;
      default:
        return !chat.isArchived;
    }
  });

  // Handlers
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'user',
      senderName: 'You',
      content: messageInput.trim(),
      timestamp: new Date(),
      type: 'text',
      direction: 'outgoing',
      status: 'sent',
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageInput('');

    // Update chat's last message
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChat.id
          ? { ...chat, lastMessage: messageInput.trim(), lastMessageTime: new Date() }
          : chat
      )
    );

    // Simulate status updates
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg))
      );
    }, 1000);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: 'read' } : msg))
      );
    }, 2000);
  };

  const handleUseQuickReply = (reply: QuickReply) => {
    setMessageInput(reply.content);
    inputRef.current?.focus();
  };

  const handleStarMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg))
    );
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAcceptNotification = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId && msg.notificationContent
          ? {
              ...msg,
              notificationContent: {
                ...msg.notificationContent,
                priority: 'completed',
              },
            }
          : msg
      )
    );
    // Add success message
    const successMessage: Message = {
      id: Date.now().toString(),
      senderId: 'system',
      senderName: 'System',
      content: '✓ You have accepted this assignment.',
      timestamp: new Date(),
      type: 'text',
      direction: 'incoming',
    };
    setMessages((prev) => [...prev, successMessage]);
  };

  const handleRejectNotification = (messageId: string) => {
    if (window.confirm('Are you sure you want to reject this?')) {
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    }
  };

  // Nav counts
  const getNavCount = (tab: NavTab): number => {
    switch (tab) {
      case 'all':
        return chats.filter((c) => !c.isArchived).length;
      case 'requests':
        return chats.filter((c) => c.type === 'request').length;
      case 'clients':
        return chats.filter((c) => c.type === 'client' && !c.isArchived).length;
      case 'team':
        return chats.filter((c) => c.type === 'team').length;
      case 'archived':
        return chats.filter((c) => c.isArchived).length;
      default:
        return 0;
    }
  };

  const unreadTotal = chats.reduce((acc, chat) => acc + chat.unreadCount, 0);

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach((msg) => {
      const dateKey = msg.timestamp.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });
    return groups;
  };

  return (
    <div className="flex h-screen overflow-hidden  font-sans text-sm text-gray-700">
      {/* 1. LEFT NAVIGATION SIDEBAR */}
      <div
        className={`flex-shrink-0 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'w-16' : 'w-56'
        }`}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg text-gray-900">Messages</h1>
                {unreadTotal > 0 && (
                  <span className="px-2 py-0.5 bg-primary text-white text-[10px] rounded-full font-bold">
                    {unreadTotal}
                  </span>
                )}
              </div>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition"
            >
              {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <NavItem
            icon={<Inbox size={18} />}
            label="All"
            count={getNavCount('all')}
            active={activeNav === 'all'}
            collapsed={isSidebarCollapsed}
            onClick={() => setActiveNav('all')}
          />
          <NavItem
            icon={<MessageSquare size={18} />}
            label="Requests"
            count={getNavCount('requests')}
            active={activeNav === 'requests'}
            collapsed={isSidebarCollapsed}
            onClick={() => setActiveNav('requests')}
          />
          <NavItem
            icon={<Building2 size={18} />}
            label="Clients"
            count={getNavCount('clients')}
            active={activeNav === 'clients'}
            collapsed={isSidebarCollapsed}
            onClick={() => setActiveNav('clients')}
          />
          <NavItem
            icon={<Users size={18} />}
            label="Team"
            count={getNavCount('team')}
            active={activeNav === 'team'}
            collapsed={isSidebarCollapsed}
            onClick={() => setActiveNav('team')}
          />
          <NavItem
            icon={<Archive size={18} />}
            label="Archived"
            count={getNavCount('archived')}
            active={activeNav === 'archived'}
            collapsed={isSidebarCollapsed}
            onClick={() => setActiveNav('archived')}
          />
        </nav>

        {/* New Message Button */}
        {!isSidebarCollapsed && (
          <div className="flex-shrink-0 p-3 border-t border-gray-100">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition shadow-sm">
              <Plus size={16} />
              New Message
            </button>
          </div>
        )}
      </div>

      {/* 2. CHAT LIST SIDEBAR */}
      <div className="flex-shrink-0 w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-4">
              <button className="flex items-center gap-1 text-primary border-b-2 border-primary pb-1">
                <MessageSquare size={18} />
              </button>
              <button className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition">
                <Users size={18} />
              </button>
            </div>
            <div className="flex gap-2">
              <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <Filter size={16} />
              </button>
              <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <Settings size={16} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} /> */}
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Chat List - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="py-12 text-center">
              <MailOpen size={40} className="mx-auto mb-3 text-gray-200" />
              <p className="text-sm text-gray-500 font-medium">No conversations found</p>
              <p className="text-xs text-gray-400 mt-1">Try adjusting your search</p>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                active={selectedChat?.id === chat.id}
                onClick={() => setSelectedChat(chat)}
              />
            ))
          )}
        </div>
      </div>

      {/* 3. MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
        {selectedChat ? (
          <>
            {/* Chat Header - Fixed */}
            <div className="flex-shrink-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold uppercase ${
                      selectedChat.type === 'team'
                        ? 'bg-purple-600'
                        : selectedChat.type === 'request'
                        ? 'bg-orange-500'
                        : 'bg-primary'
                    }`}
                  >
                    {getInitials(selectedChat.name)}
                  </div>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                      selectedChat.status
                    )}`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{selectedChat.name}</span>
                    {selectedChat.type !== 'client' && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          selectedChat.type === 'team'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {selectedChat.type === 'team' ? 'Team' : 'Request'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{selectedChat.phone}</span>
                    <span className="text-gray-300">•</span>
                    <span className={selectedChat.status === 'online' ? 'text-green-600' : ''}>
                      {selectedChat.status === 'online'
                        ? 'Online'
                        : selectedChat.status === 'away'
                        ? 'Away'
                        : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition">
                  <Phone size={18} />
                </button>
                <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition">
                  <Video size={18} />
                </button>
                <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition">
                  <Users size={18} />
                </button>
                <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              {Object.entries(groupMessagesByDate()).map(([dateKey, dateMessages]) => (
                <div key={dateKey}>
                  {/* Date Header */}
                  <div className="flex items-center justify-center my-6">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                      {formatDateHeader(new Date(dateKey))}
                    </div>
                  </div>

                  {/* Messages */}
                  {dateMessages.map((message) =>
                    message.type === 'notification' ? (
                      <NotificationMessage
                        key={message.id}
                        message={message}
                        onAccept={() => handleAcceptNotification(message.id)}
                        onReject={() => handleRejectNotification(message.id)}
                        onViewDetails={() => {
                          if (message.notificationContent?.actionUrl) {
                            window.location.href = message.notificationContent.actionUrl;
                          }
                        }}
                        onEntityClick={(entity) => {
                          window.location.href = entity.url;
                        }}
                      />
                    ) : (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        onStar={() => handleStarMessage(message.id)}
                        onCopy={() => handleCopyMessage(message.content)}
                      />
                    )
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input - Fixed */}
            <div className="flex-shrink-0 bg-white p-4 border-t border-gray-200">
              {/* Quick Reply Tags */}
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
                {quickReplies.slice(0, 4).map((reply) => (
                  <button
                    key={reply.id}
                    onClick={() => handleUseQuickReply(reply)}
                    className="whitespace-nowrap px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition"
                  >
                    {reply.title}
                  </button>
                ))}
                <button
                  onClick={() => setIsQuickReplyOpen(true)}
                  className="whitespace-nowrap px-3 py-1.5 bg-primary/5 text-primary border border-primary/20 rounded-lg text-xs font-semibold hover:bg-primary/10 transition flex items-center gap-1"
                >
                  <Zap size={12} />
                  All Templates
                </button>
              </div>

              {/* Input Area */}
              <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition bg-white">
                <textarea
                  ref={inputRef}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="w-full p-4 resize-none text-sm outline-none h-20"
                  rows={3}
                />
                <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-t border-gray-100">
                  <div className="flex gap-1">
                    <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition">
                      <Plus size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition">
                      <Paperclip size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition">
                      <Image size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition">
                      <Smile size={18} />
                    </button>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="flex items-center gap-2 px-5 py-2 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    <Send size={16} />
                    Send
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          // No chat selected
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare size={64} className="mx-auto mb-4 text-gray-200" />
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Select a conversation</h3>
              <p className="text-sm text-gray-500">Choose a chat from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Reply Slide Panel */}
      <QuickReplyPanel
        isOpen={isQuickReplyOpen}
        onClose={() => setIsQuickReplyOpen(false)}
        quickReplies={quickReplies}
        onUseReply={handleUseQuickReply}
        searchQuery={quickReplySearch}
        onSearchChange={setQuickReplySearch}
      />

      {/* Tooltips */}
      <Tooltip
        id="nav-tooltip"
        place="right"
        className="!bg-gray-800 !text-white !text-[10px] !px-2 !py-1 !rounded z-50"
      />
    </div>
  );
};

export default CommunicationHub;