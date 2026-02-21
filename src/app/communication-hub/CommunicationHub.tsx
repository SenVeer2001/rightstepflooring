// pages/CommunicationHub.tsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  MessageSquare,
  Mail,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  Users,
  Building,
  Briefcase,
  Package,
  Clock,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Voicemail,
  PhoneOff,
  PhoneCall,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  ExternalLink,
  Tag,
  Calendar,
  Send,
  Paperclip,
  MoreVertical,
  Check,
  CheckCheck,
  AlertCircle,
  FileText,
  Image,
  Video,
  File,
  ChevronDown,
  Reply,
  Forward,
  Trash2,
  Archive,
  Star,
  RefreshCw,
} from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {
  type CallRecord,
  type SMSThread,
  type EmailThread,
  type CallOutcome,
  type CommunicationTag,
  type Attachment,
  mockCallRecords,
  mockSMSThreads,
  mockEmailThreads,
  formatDuration,
  formatFileSize,
  communicationTags,
} from "../../types/communication";

// Tab types
type CommunicationTab = "calls" | "sms" | "email";

// Tabs config
const tabs: { id: CommunicationTab; label: string; icon: React.ElementType }[] = [
  { id: "calls", label: "Call Recordings", icon: Phone },
  { id: "sms", label: "SMS", icon: MessageSquare },
  { id: "email", label: "Email", icon: Mail },
];

// Call outcome config
const callOutcomeConfig: Record<CallOutcome, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  answered: { label: "Answered", color: "text-green-700", bg: "bg-green-100", icon: PhoneCall },
  missed: { label: "Missed", color: "text-red-700", bg: "bg-red-100", icon: PhoneMissed },
  voicemail: { label: "Voicemail", color: "text-purple-700", bg: "bg-purple-100", icon: Voicemail },
  busy: { label: "Busy", color: "text-orange-700", bg: "bg-orange-100", icon: PhoneOff },
  no_answer: { label: "No Answer", color: "text-yellow-700", bg: "bg-yellow-100", icon: PhoneOff },
  callback_requested: { label: "Callback", color: "text-blue-700", bg: "bg-blue-100", icon: PhoneIncoming },
};

// Contact type config
const contactTypeConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  customer: { label: "Customer", color: "text-blue-600", bg: "bg-blue-50", icon: User },
  lead: { label: "Lead", color: "text-purple-600", bg: "bg-purple-50", icon: Users },
  staff: { label: "Staff", color: "text-green-600", bg: "bg-green-50", icon: User },
  subcontractor: { label: "Subcontractor", color: "text-orange-600", bg: "bg-orange-50", icon: Building },
  vendor: { label: "Vendor", color: "text-cyan-600", bg: "bg-cyan-50", icon: Package },
  unknown: { label: "Unknown", color: "text-gray-600", bg: "bg-gray-50", icon: User },
};

// Tag color mapping
const tagColorMap: Record<string, { bg: string; text: string }> = {
  red: { bg: "bg-red-100", text: "text-red-700" },
  green: { bg: "bg-green-100", text: "text-green-700" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-700" },
  blue: { bg: "bg-blue-100", text: "text-blue-700" },
  purple: { bg: "bg-purple-100", text: "text-purple-700" },
  orange: { bg: "bg-orange-100", text: "text-orange-700" },
  cyan: { bg: "bg-cyan-100", text: "text-cyan-700" },
  gray: { bg: "bg-gray-100", text: "text-gray-700" },
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

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Audio Player Component
interface AudioPlayerProps {
  duration: number;
  isPlaying: boolean;
  currentTime: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
}

const AudioPlayer = ({ duration, isPlaying, currentTime, onPlayPause, onSeek }: AudioPlayerProps) => {
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
      <button
        onClick={onPlayPause}
        className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition"
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <div className="flex-1">
        <div
          className="h-2 bg-gray-200 rounded-full cursor-pointer relative overflow-hidden"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            onSeek(percent * duration);
          }}
        >
          <div
            className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-md"
            style={{ left: `calc(${progressPercent}% - 6px)` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-gray-500">{formatDuration(Math.floor(currentTime))}</span>
          <span className="text-[10px] text-gray-500">{formatDuration(duration)}</span>
        </div>
      </div>
      <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition">
        <Volume2 size={16} />
      </button>
      <button className="p-2 text-gray-500 hover:text-primary rounded-lg hover:bg-primary/10 transition">
        <Download size={16} />
      </button>
    </div>
  );
};

// Call Detail Panel
interface CallDetailPanelProps {
  call: CallRecord | null;
  onClose: () => void;
}

const CallDetailPanel = ({ call, onClose }: CallDetailPanelProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const navigate = useNavigate();

  if (!call) return null;

  const outcomeConfig = callOutcomeConfig[call.outcome];
  const callerConfig = contactTypeConfig[call.callerType];
  const OutcomeIcon = outcomeConfig.icon;
  const CallerIcon = callerConfig.icon;

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Simulate playback progress
    if (!isPlaying && call.recordingDuration) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= call.recordingDuration!) {
            setIsPlaying(false);
            clearInterval(interval);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${call.direction === "inbound" ? "bg-green-50" : "bg-blue-50"}`}>
            {call.direction === "inbound" ? (
              <PhoneIncoming size={20} className="text-green-600" />
            ) : (
              <PhoneOutgoing size={20} className="text-blue-600" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {call.direction === "inbound" ? call.callerName : call.receiverName}
            </h3>
            <p className="text-sm text-gray-500">
              {call.direction === "inbound" ? call.callerPhone : call.receiverPhone}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Call Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase">Direction</p>
            <div className="flex items-center gap-2 mt-1">
              {call.direction === "inbound" ? (
                <PhoneIncoming size={14} className="text-green-600" />
              ) : (
                <PhoneOutgoing size={14} className="text-blue-600" />
              )}
              <span className="text-sm font-semibold text-gray-900 capitalize">{call.direction}</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase">Outcome</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${outcomeConfig.bg} ${outcomeConfig.color}`}>
                <OutcomeIcon size={10} />
                {outcomeConfig.label}
              </span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase">Duration</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">{formatDuration(call.duration)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase">Time</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">{formatTime(call.timestamp)}</p>
          </div>
        </div>

        {/* Contact Type */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-[10px] font-medium text-gray-500 uppercase mb-2">
            {call.direction === "inbound" ? "Caller" : "Receiver"}
          </p>
          <div className="flex items-center gap-3">
            {call.callerAvatar ? (
              <img src={call.callerAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className={`w-10 h-10 rounded-full ${callerConfig.bg} flex items-center justify-center`}>
                <CallerIcon size={18} className={callerConfig.color} />
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {call.direction === "inbound" ? call.callerName : call.receiverName}
              </p>
              <div className="flex items-center gap-2">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${callerConfig.bg} ${callerConfig.color}`}>
                  {callerConfig.label}
                </span>
                {call.callerId && (
                  <span className="text-[10px] text-gray-500">{call.callerId}</span>
                )}
              </div>
            </div>
            <button
              onClick={() => call.callerId && navigate(`/customers/${call.callerId}`)}
              className="ml-auto p-2 hover:bg-gray-200 rounded-lg transition"
            >
              <ExternalLink size={14} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Related To */}
        {call.relatedTo && (
          <div>
            <p className="text-xs font-semibold text-gray-900 mb-2">Related To</p>
            <div
              onClick={() => navigate(`/${call.relatedTo!.type}s/${call.relatedTo!.id}`)}
              className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/20 hover:bg-primary/10 cursor-pointer transition"
            >
              <div className="p-2 bg-primary/10 rounded-lg">
                <Briefcase size={14} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{call.relatedTo.label}</p>
                <p className="text-[10px] text-gray-500 uppercase">{call.relatedTo.type} • {call.relatedTo.id}</p>
              </div>
              <ExternalLink size={14} className="text-primary" />
            </div>
          </div>
        )}

        {/* Recording */}
        {call.hasRecording && call.recordingDuration && (
          <div>
            <p className="text-xs font-semibold text-gray-900 mb-2">Call Recording</p>
            <AudioPlayer
              duration={call.recordingDuration}
              isPlaying={isPlaying}
              currentTime={currentTime}
              onPlayPause={handlePlayPause}
              onSeek={setCurrentTime}
            />
          </div>
        )}

        {/* Transcription */}
        {call.transcription && (
          <div>
            <p className="text-xs font-semibold text-gray-900 mb-2">Transcription</p>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-700 italic">"{call.transcription}"</p>
            </div>
          </div>
        )}

        {/* Notes */}
        {call.notes && (
          <div>
            <p className="text-xs font-semibold text-gray-900 mb-2">Notes</p>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-700">{call.notes}</p>
            </div>
          </div>
        )}

        {/* Tags */}
        {call.tags.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-900 mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {call.tags.map((tag) => {
                const colors = tagColorMap[tag.color] || tagColorMap.gray;
                return (
                  <span
                    key={tag.id}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium ${colors.bg} ${colors.text}`}
                  >
                    {tag.name}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center gap-2">
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition">
          <Phone size={14} />
          Call Back
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
          <MessageSquare size={14} />
          SMS
        </button>
      </div>
    </div>
  );
};

// SMS Detail Panel
interface SMSDetailPanelProps {
  thread: SMSThread | null;
  onClose: () => void;
}

const SMSDetailPanel = ({ thread, onClose }: SMSDetailPanelProps) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.messages]);

  if (!thread) return null;

  const contactConfig = contactTypeConfig[thread.contactType];
  const ContactIcon = contactConfig.icon;

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between">
        <div className="flex items-center gap-3">
          {thread.contactAvatar ? (
            <img src={thread.contactAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className={`w-10 h-10 rounded-full ${contactConfig.bg} flex items-center justify-center`}>
              <ContactIcon size={18} className={contactConfig.color} />
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-gray-900">{thread.contactName}</h3>
            <p className="text-sm text-gray-500">{thread.contactPhone}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => thread.contactId && navigate(`/customers/${thread.contactId}`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ExternalLink size={16} className="text-gray-500" />
          </button>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Contact Info Bar */}
      <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-4 flex-wrap">
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${contactConfig.bg} ${contactConfig.color}`}>
          {contactConfig.label}
        </span>
        {thread.relatedTo && (
          <button
            onClick={() => navigate(`/${thread.relatedTo!.type}s/${thread.relatedTo!.id}`)}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <Briefcase size={12} />
            {thread.relatedTo.label}
          </button>
        )}
        {thread.assignedTo && (
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <User size={12} />
            {thread.assignedTo.name}
          </span>
        )}
        {thread.tags.map((tag) => {
          const colors = tagColorMap[tag.color] || tagColorMap.gray;
          return (
            <span key={tag.id} className={`px-2 py-0.5 rounded text-[10px] font-medium ${colors.bg} ${colors.text}`}>
              {tag.name}
            </span>
          );
        })}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {thread.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.direction === "outbound" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                message.direction === "outbound"
                  ? "bg-primary text-white rounded-br-md"
                  : "bg-gray-100 text-gray-900 rounded-bl-md"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <div className={`flex items-center gap-1 mt-1 ${
                message.direction === "outbound" ? "justify-end" : "justify-start"
              }`}>
                <span className={`text-[10px] ${
                  message.direction === "outbound" ? "text-white/70" : "text-gray-500"
                }`}>
                  {formatTime(message.timestamp)}
                </span>
                {message.direction === "outbound" && (
                  <span className="text-white/70">
                    {message.status === "read" ? (
                      <CheckCheck size={12} />
                    ) : message.status === "delivered" ? (
                      <CheckCheck size={12} />
                    ) : (
                      <Check size={12} />
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-gray-100 rounded-2xl p-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              rows={1}
              className="w-full bg-transparent text-sm resize-none focus:outline-none px-2 py-1"
            />
          </div>
          <button
            disabled={!newMessage.trim()}
            className="p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Email Detail Panel
interface EmailDetailPanelProps {
  thread: EmailThread | null;
  onClose: () => void;
}

const EmailDetailPanel = ({ thread, onClose }: EmailDetailPanelProps) => {
  const navigate = useNavigate();

  if (!thread) return null;

  const contactConfig = contactTypeConfig[thread.contactType];
  const ContactIcon = contactConfig.icon;

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return <FileText size={14} className="text-red-500" />;
    if (type.includes("image") || type.includes("jpg") || type.includes("png")) return <Image size={14} className="text-purple-500" />;
    if (type.includes("video")) return <Video size={14} className="text-blue-500" />;
    return <File size={14} className="text-gray-500" />;
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{thread.subject}</h3>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${contactConfig.bg} ${contactConfig.color}`}>
                {contactConfig.label}
              </span>
              {thread.hasAttachments && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600">
                  <Paperclip size={10} />
                  Attachments
                </span>
              )}
              {thread.tags.map((tag) => {
                const colors = tagColorMap[tag.color] || tagColorMap.gray;
                return (
                  <span key={tag.id} className={`px-2 py-0.5 rounded text-[10px] font-medium ${colors.bg} ${colors.text}`}>
                    {tag.name}
                  </span>
                );
              })}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Related To */}
        {thread.relatedTo && (
          <button
            onClick={() => navigate(`/${thread.relatedTo!.type}s/${thread.relatedTo!.id}`)}
            className="flex items-center gap-2 mt-3 px-3 py-2 bg-primary/5 rounded-lg border border-primary/20 hover:bg-primary/10 transition w-full"
          >
            <Briefcase size={14} className="text-primary" />
            <span className="text-sm font-medium text-gray-900">{thread.relatedTo.label}</span>
            <ExternalLink size={12} className="text-primary ml-auto" />
          </button>
        )}
      </div>

      {/* Email Messages */}
      <div className="flex-1 overflow-y-auto">
        {thread.messages.map((email, index) => (
          <div key={email.id} className={`px-6 py-5 ${index !== thread.messages.length - 1 ? "border-b border-gray-100" : ""}`}>
            {/* Email Header */}
            <div className="flex items-start gap-3 mb-4">
              {email.from.avatar ? (
                <img src={email.from.avatar} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <User size={18} className="text-gray-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{email.from.name}</p>
                    <p className="text-xs text-gray-500">{email.from.email}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{formatRelativeTime(email.timestamp)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  To: {email.to.map((t) => t.name || t.email).join(", ")}
                  {email.cc && email.cc.length > 0 && (
                    <span> • CC: {email.cc.map((c) => c.name || c.email).join(", ")}</span>
                  )}
                </p>
              </div>
            </div>

            {/* Email Body */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-700 whitespace-pre-line">{email.body}</p>
            </div>

            {/* Attachments */}
            {email.attachments.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  Attachments ({email.attachments.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {email.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer transition"
                    >
                      {getFileIcon(attachment.type)}
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate max-w-[150px]">
                          {attachment.name}
                        </p>
                        <p className="text-[10px] text-gray-500">{formatFileSize(attachment.size)}</p>
                      </div>
                      <Download size={14} className="text-gray-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center gap-2">
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition">
          <Reply size={14} />
          Reply
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
          <Forward size={14} />
          Forward
        </button>
        <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition">
          <Archive size={16} />
        </button>
        <button className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

// Main Communication Hub Component
export default function CommunicationHub() {
  const [activeTab, setActiveTab] = useState<CommunicationTab>("calls");
  const [search, setSearch] = useState("");
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [selectedSMS, setSelectedSMS] = useState<SMSThread | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<EmailThread | null>(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const navigate = useNavigate();

  // Filter data
  const filteredCalls = mockCallRecords.filter((call) => {
    if (search) {
      const searchLower = search.toLowerCase();
      if (
        !call.callerName.toLowerCase().includes(searchLower) &&
        !call.callerPhone.includes(searchLower) &&
        !call.receiverName.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    return true;
  });

  const filteredSMS = mockSMSThreads.filter((thread) => {
    if (search) {
      const searchLower = search.toLowerCase();
      if (
        !thread.contactName.toLowerCase().includes(searchLower) &&
        !thread.contactPhone.includes(searchLower) &&
        !thread.lastMessage.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    return true;
  });

  const filteredEmails = mockEmailThreads.filter((thread) => {
    if (search) {
      const searchLower = search.toLowerCase();
      if (
        !thread.contactName.toLowerCase().includes(searchLower) &&
        !thread.contactEmail.toLowerCase().includes(searchLower) &&
        !thread.subject.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    return true;
  });

  // Stats
  const totalCalls = mockCallRecords.length;
  const missedCalls = mockCallRecords.filter((c) => c.outcome === "missed").length;
  const unreadSMS = mockSMSThreads.reduce((acc, t) => acc + t.unreadCount, 0);
  const unreadEmails = mockEmailThreads.reduce((acc, t) => acc + t.unreadCount, 0);

  const handleClosePanel = () => {
    setSelectedCall(null);
    setSelectedSMS(null);
    setSelectedEmail(null);
  };

  const hasSelection = selectedCall || selectedSMS || selectedEmail;

  return (
    <div className="min-h-screen p-4 md:p-4">
      <div className="max-w-8xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              {/* <Phone size={28} className="text-primary" /> */}
              Communication Hub
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage calls, SMS, and emails in one place
            </p>
          </div>

          <div className="flex items-center gap-2">
            {missedCalls > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                <PhoneMissed size={12} />
                {missedCalls} missed
              </span>
            )}
            {unreadSMS > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                <MessageSquare size={12} />
                {unreadSMS} unread
              </span>
            )}
            {unreadEmails > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                <Mail size={12} />
                {unreadEmails} unread
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-gray-200 rounded-xl p-1.5 inline-flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            let count = 0;
            if (tab.id === "calls") count = totalCalls;
            if (tab.id === "sms") count = mockSMSThreads.length;
            if (tab.id === "email") count = mockEmailThreads.length;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  handleClosePanel();
                }}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={16} />
                {tab.label}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id
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

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              {/* <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /> */}
              <input
                type="text"
                placeholder={
                  activeTab === "calls"
                    ? "Search calls by name or phone..."
                    : activeTab === "sms"
                    ? "Search SMS by contact or message..."
                    : "Search emails by contact or subject..."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none appearance-none bg-white min-w-[140px]"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            <div className="relative">
              <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none appearance-none bg-white min-w-[140px]"
              >
                <option value="all">All Tags</option>
                {communicationTags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex gap-0 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm" style={{ height: "calc(100vh - 320px)", minHeight: "500px" }}>
          {/* List Panel */}
          <div className={`${hasSelection ? "w-1/2 lg:w-2/5" : "w-full"} border-r border-gray-200 overflow-hidden flex flex-col transition-all`}>
            <div className="flex-1 overflow-y-auto">
              {/* Calls Tab */}
              {activeTab === "calls" && (
                <div className="divide-y divide-gray-100">
                  {filteredCalls.length === 0 ? (
                    <div className="py-12 text-center">
                      <Phone size={40} className="mx-auto mb-3 text-gray-300" />
                      <p className="text-sm text-gray-500 font-medium">No calls found</p>
                    </div>
                  ) : (
                    filteredCalls.map((call) => {
                      const outcomeConfig = callOutcomeConfig[call.outcome];
                      const OutcomeIcon = outcomeConfig.icon;
                      const isSelected = selectedCall?.id === call.id;

                      return (
                        <div
                          key={call.id}
                          onClick={() => {
                            setSelectedCall(call);
                            setSelectedSMS(null);
                            setSelectedEmail(null);
                          }}
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition ${
                            isSelected ? "bg-primary/5 border-l-2 border-l-primary" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg flex-shrink-0 ${
                              call.direction === "inbound" ? "bg-green-50" : "bg-blue-50"
                            }`}>
                              {call.direction === "inbound" ? (
                                <PhoneIncoming size={16} className="text-green-600" />
                              ) : (
                                <PhoneOutgoing size={16} className="text-blue-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {call.direction === "inbound" ? call.callerName : call.receiverName}
                                </p>
                                <span className="text-xs text-gray-400 flex-shrink-0">
                                  {formatRelativeTime(call.timestamp)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {call.direction === "inbound" ? call.callerPhone : call.receiverPhone}
                              </p>
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${outcomeConfig.bg} ${outcomeConfig.color}`}>
                                  <OutcomeIcon size={10} />
                                  {outcomeConfig.label}
                                </span>
                                {call.duration > 0 && (
                                  <span className="text-[10px] text-gray-500">
                                    {formatDuration(call.duration)}
                                  </span>
                                )}
                                {call.hasRecording && (
                                  <span className="flex items-center gap-0.5 text-[10px] text-gray-500">
                                    <Volume2 size={10} />
                                    Recording
                                  </span>
                                )}
                              </div>
                              {call.tags.length > 0 && (
                                <div className="flex gap-1 mt-2">
                                  {call.tags.slice(0, 2).map((tag) => {
                                    const colors = tagColorMap[tag.color] || tagColorMap.gray;
                                    return (
                                      <span key={tag.id} className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${colors.bg} ${colors.text}`}>
                                        {tag.name}
                                      </span>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* SMS Tab */}
              {activeTab === "sms" && (
                <div className="divide-y divide-gray-100">
                  {filteredSMS.length === 0 ? (
                    <div className="py-12 text-center">
                      <MessageSquare size={40} className="mx-auto mb-3 text-gray-300" />
                      <p className="text-sm text-gray-500 font-medium">No messages found</p>
                    </div>
                  ) : (
                    filteredSMS.map((thread) => {
                      const contactConfig = contactTypeConfig[thread.contactType];
                      const ContactIcon = contactConfig.icon;
                      const isSelected = selectedSMS?.id === thread.id;

                      return (
                        <div
                          key={thread.id}
                          onClick={() => {
                            setSelectedSMS(thread);
                            setSelectedCall(null);
                            setSelectedEmail(null);
                          }}
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition ${
                            isSelected ? "bg-primary/5 border-l-2 border-l-primary" : ""
                          } ${thread.unreadCount > 0 ? "bg-blue-50/30" : ""}`}
                        >
                          <div className="flex items-start gap-3">
                            {thread.contactAvatar ? (
                              <img src={thread.contactAvatar} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                            ) : (
                              <div className={`w-10 h-10 rounded-full ${contactConfig.bg} flex items-center justify-center flex-shrink-0`}>
                                <ContactIcon size={16} className={contactConfig.color} />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className={`text-sm text-gray-900 truncate ${thread.unreadCount > 0 ? "font-bold" : "font-medium"}`}>
                                  {thread.contactName}
                                </p>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {thread.unreadCount > 0 && (
                                    <span className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                      {thread.unreadCount}
                                    </span>
                                  )}
                                  <span className="text-xs text-gray-400">
                                    {formatRelativeTime(thread.lastMessageTime)}
                                  </span>
                                </div>
                              </div>
                              <p className={`text-xs mt-1 truncate ${thread.unreadCount > 0 ? "text-gray-700 font-medium" : "text-gray-500"}`}>
                                {thread.lastMessage}
                              </p>
                              {thread.tags.length > 0 && (
                                <div className="flex gap-1 mt-2">
                                  {thread.tags.slice(0, 2).map((tag) => {
                                    const colors = tagColorMap[tag.color] || tagColorMap.gray;
                                    return (
                                      <span key={tag.id} className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${colors.bg} ${colors.text}`}>
                                        {tag.name}
                                      </span>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* Email Tab */}
              {activeTab === "email" && (
                <div className="divide-y divide-gray-100">
                  {filteredEmails.length === 0 ? (
                    <div className="py-12 text-center">
                      <Mail size={40} className="mx-auto mb-3 text-gray-300" />
                      <p className="text-sm text-gray-500 font-medium">No emails found</p>
                    </div>
                  ) : (
                    filteredEmails.map((thread) => {
                      const contactConfig = contactTypeConfig[thread.contactType];
                      const ContactIcon = contactConfig.icon;
                      const isSelected = selectedEmail?.id === thread.id;

                      return (
                        <div
                          key={thread.id}
                          onClick={() => {
                            setSelectedEmail(thread);
                            setSelectedCall(null);
                            setSelectedSMS(null);
                          }}
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition ${
                            isSelected ? "bg-primary/5 border-l-2 border-l-primary" : ""
                          } ${thread.unreadCount > 0 ? "bg-blue-50/30" : ""}`}
                        >
                          <div className="flex items-start gap-3">
                            {thread.contactAvatar ? (
                              <img src={thread.contactAvatar} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                            ) : (
                              <div className={`w-10 h-10 rounded-full ${contactConfig.bg} flex items-center justify-center flex-shrink-0`}>
                                <ContactIcon size={16} className={contactConfig.color} />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className={`text-sm text-gray-900 truncate ${thread.unreadCount > 0 ? "font-bold" : "font-medium"}`}>
                                  {thread.contactName}
                                </p>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {thread.hasAttachments && (
                                    <Paperclip size={12} className="text-gray-400" />
                                  )}
                                  {thread.unreadCount > 0 && (
                                    <span className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                      {thread.unreadCount}
                                    </span>
                                  )}
                                  <span className="text-xs text-gray-400">
                                    {formatRelativeTime(thread.lastMessageTime)}
                                  </span>
                                </div>
                              </div>
                              <p className={`text-xs mt-1 truncate ${thread.unreadCount > 0 ? "text-gray-900 font-semibold" : "text-gray-700"}`}>
                                {thread.subject}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 truncate">
                                {thread.lastMessage}
                              </p>
                              {thread.tags.length > 0 && (
                                <div className="flex gap-1 mt-2">
                                  {thread.tags.slice(0, 2).map((tag) => {
                                    const colors = tagColorMap[tag.color] || tagColorMap.gray;
                                    return (
                                      <span key={tag.id} className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${colors.bg} ${colors.text}`}>
                                        {tag.name}
                                      </span>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Detail Panel */}
          {hasSelection && (
            <div className="w-1/2 lg:w-3/5 overflow-hidden">
              {selectedCall && <CallDetailPanel call={selectedCall} onClose={handleClosePanel} />}
              {selectedSMS && <SMSDetailPanel thread={selectedSMS} onClose={handleClosePanel} />}
              {selectedEmail && <EmailDetailPanel thread={selectedEmail} onClose={handleClosePanel} />}
            </div>
          )}

          {/* Empty State when no selection */}
          {!hasSelection && (
            <div className="hidden" />
          )}
        </div>
      </div>

      {/* Tooltips */}
      <Tooltip
        id="comm-tooltip"
        place="top"
        className="!bg-gray-800 !text-white !text-[10px] !px-2 !py-1 !rounded"
      />
    </div>
  );
}