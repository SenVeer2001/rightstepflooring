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
  Headphones,
  Eye,
  SkipBack,
  SkipForward,
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

const formatFullDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Recording Player Popup Component
interface RecordingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  call: CallRecord | null;
}

const RecordingPopup = ({ isOpen, onClose, call }: RecordingPopupProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  useEffect(() => {
    // @ts-ignore
    let interval: NodeJS.Timeout;
    if (isPlaying && call?.recordingDuration) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= call.recordingDuration!) {
            setIsPlaying(false);
            return 0;
          }
          return prev + playbackSpeed;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, call, playbackSpeed]);

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [isOpen]);

  if (!isOpen || !call || !call.hasRecording) return null;

  const progressPercent = call.recordingDuration ? (currentTime / call.recordingDuration) * 100 : 0;
  const callerConfig = contactTypeConfig[call.callerType];
  const CallerIcon = callerConfig.icon;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!call.recordingDuration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setCurrentTime(Math.floor(percent * call.recordingDuration));
  };

  const skipBackward = () => {
    setCurrentTime((prev) => Math.max(0, prev - 10));
  };

  const skipForward = () => {
    if (call.recordingDuration) {
      setCurrentTime((prev) => Math.min(call.recordingDuration!, prev + 10));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Popup */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-primary to-primary/80 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Headphones size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Call Recording</h3>
                <p className="text-sm text-white/80">{formatDuration(call.recordingDuration || 0)}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Call Info */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {call.callerAvatar ? (
              <img src={call.callerAvatar} alt="" className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className={`w-12 h-12 rounded-full ${callerConfig.bg} flex items-center justify-center`}>
                <CallerIcon size={20} className={callerConfig.color} />
              </div>
            )}
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                {call.direction === "inbound" ? call.callerName : call.receiverName}
              </p>
              <p className="text-sm text-gray-500">
                {call.direction === "inbound" ? call.callerPhone : call.receiverPhone}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{formatTime(call.timestamp)}</p>
              <p className="text-xs text-gray-500">{formatFullDate(call.timestamp)}</p>
            </div>
          </div>
        </div>

        {/* Player */}
        <div className="px-6 py-6">
          {/* Waveform/Progress Bar */}
          <div
            className="h-16 bg-gray-100 rounded-xl cursor-pointer relative overflow-hidden mb-4"
            onClick={handleSeek}
          >
            {/* Waveform visualization (mock) */}
            <div className="absolute inset-0 flex items-center justify-around px-2">
              {Array.from({ length: 50 }).map((_, i) => {
                const height = Math.random() * 60 + 20;
                const isPlayed = (i / 50) * 100 <= progressPercent;
                return (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-colors ${isPlayed ? "bg-primary" : "bg-gray-300"
                      }`}
                    style={{ height: `${height}%` }}
                  />
                );
              })}
            </div>
            {/* Progress overlay */}
            <div
              className="absolute top-0 left-0 h-full bg-primary/10 pointer-events-none"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Time Display */}
          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <span>{formatDuration(Math.floor(currentTime))}</span>
            <span>{formatDuration(call.recordingDuration || 0)}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={skipBackward}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
              data-tooltip-id="recording-tooltip"
              data-tooltip-content="Back 10s"
            >
              <SkipBack size={20} />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-4 bg-primary text-white rounded-full hover:bg-primary/90 transition shadow-lg"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
            </button>
            <button
              onClick={skipForward}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
              data-tooltip-id="recording-tooltip"
              data-tooltip-content="Forward 10s"
            >
              <SkipForward size={20} />
            </button>
          </div>

          {/* Volume & Speed Controls */}
          <div className="flex items-center justify-between gap-4">
            {/* Volume */}
            <div className="flex items-center gap-2 flex-1">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 text-gray-500 hover:text-gray-700 rounded transition"
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseInt(e.target.value));
                  if (parseInt(e.target.value) > 0) setIsMuted(false);
                }}
                className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Speed */}
            <div className="flex items-center gap-1">
              {[0.5, 1, 1.5, 2].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-1 text-xs font-medium rounded transition ${playbackSpeed === speed
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transcription (if available) */}
        {call.transcription && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Transcription</p>
            <p className="text-sm text-gray-700 italic leading-relaxed">"{call.transcription}"</p>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition">
            <Download size={16} />
            Download
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition"
          >
            Close
          </button>
        </div>
      </div>

      <Tooltip id="recording-tooltip" place="top" className="!bg-gray-800 !text-white !text-[10px] !px-2 !py-1 !rounded" />
    </div>
  );
};

// Full Screen Side Panel Component
interface CallDetailSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  call: CallRecord | null;
  onPlayRecording: (call: CallRecord) => void;
}

const CallDetailSidePanel = ({ isOpen, onClose, call, onPlayRecording }: CallDetailSidePanelProps) => {
  const navigate = useNavigate();

  if (!call) return null;

  const outcomeConfig = callOutcomeConfig[call.outcome];
  const callerConfig = contactTypeConfig[call.callerType];
  const OutcomeIcon = outcomeConfig.icon;
  const CallerIcon = callerConfig.icon;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between flex-shrink-0 bg-white">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${call.direction === "inbound" ? "bg-green-50" : "bg-blue-50"}`}>
                {call.direction === "inbound" ? (
                  <PhoneIncoming size={24} className="text-green-600" />
                ) : (
                  <PhoneOutgoing size={24} className="text-blue-600" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Call Details</h2>
                <p className="text-sm text-gray-500">
                  {call.direction === "inbound" ? "Incoming Call" : "Outgoing Call"}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{formatDuration(call.duration)}</p>
                <p className="text-xs text-gray-500 mt-1">Call Duration</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{formatTime(call.timestamp)}</p>
                <p className="text-xs text-gray-500 mt-1">Call Time</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-semibold ${outcomeConfig.bg} ${outcomeConfig.color}`}>
                  <OutcomeIcon size={14} />
                  {outcomeConfig.label}
                </span>
                <p className="text-xs text-gray-500 mt-2">Outcome</p>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User size={16} className="text-gray-500" />
                Contact
              </h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-4">
                  {call.callerAvatar ? (
                    <img src={call.callerAvatar} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                  ) : (
                    <div className={`w-14 h-14 rounded-full ${callerConfig.bg} flex items-center justify-center border-2 border-white shadow-sm`}>
                      <CallerIcon size={24} className={callerConfig.color} />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-gray-900">
                      {call.direction === "inbound" ? call.callerName : call.receiverName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {call.direction === "inbound" ? call.callerPhone : call.receiverPhone}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${callerConfig.bg} ${callerConfig.color}`}>
                        {callerConfig.label}
                      </span>
                      {call.callerId && (
                        <span className="text-xs text-gray-500">ID: {call.callerId}</span>
                      )}
                    </div>
                  </div>
                  {call.callerId && (
                    <button
                      onClick={() => navigate(`/customers/${call.callerId}`)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition"
                      data-tooltip-id="comm-tooltip"
                      data-tooltip-content="View Contact"
                    >
                      <ExternalLink size={18} className="text-gray-500" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Contacted By Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users size={16} className="text-gray-500" />
                Contacted By
              </h3>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-4">
                  {call.contactedBy?.avatar ? (
                    <img src={call.contactedBy.avatar} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow-sm">
                      <User size={20} className="text-blue-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-base font-semibold text-gray-900">
                      {call.contactedBy?.name || "System / Auto Dialer"}
                    </p>
                    {call.contactedBy?.role && (
                      <p className="text-sm text-gray-600">{call.contactedBy.role}</p>
                    )}
                    {call.contactedBy?.department && (
                      <p className="text-xs text-gray-500 mt-1">{call.contactedBy.department}</p>
                    )}
                    {call.contactedBy?.email && (
                      <p className="text-xs text-gray-500">{call.contactedBy.email}</p>
                    )}
                  </div>
                  {call.contactedBy?.id && (
                    <button
                      onClick={() => navigate(`/staff/${call.contactedBy?.id}`)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition"
                      data-tooltip-id="comm-tooltip"
                      data-tooltip-content="View Staff Profile"
                    >
                      <ExternalLink size={18} className="text-blue-600" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Call Details */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Call Details</h3>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                <div className="px-4 py-3 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Direction</span>
                  <div className="flex items-center gap-2">
                    {call.direction === "inbound" ? (
                      <PhoneIncoming size={14} className="text-green-600" />
                    ) : (
                      <PhoneOutgoing size={14} className="text-blue-600" />
                    )}
                    <span className="text-sm font-medium text-gray-900 capitalize">{call.direction}</span>
                  </div>
                </div>
                <div className="px-4 py-3 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Date</span>
                  <span className="text-sm font-medium text-gray-900">{formatFullDate(call.timestamp)}</span>
                </div>
                <div className="px-4 py-3 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Time</span>
                  <span className="text-sm font-medium text-gray-900">{formatTime(call.timestamp)}</span>
                </div>
                <div className="px-4 py-3 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Call Duration</span>
                  <span className="text-sm font-medium text-gray-900">{formatDuration(call.duration)}</span>
                </div>
                <div className="px-4 py-3 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Recording Duration</span>
                  <span className="text-sm font-medium text-gray-900">
                    {call.hasRecording ? formatDuration(call.recordingDuration || 0) : "No Recording"}
                  </span>
                </div>
              </div>
            </div>

            {/* Recording Section */}
            {call.hasRecording && call.recordingDuration && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Headphones size={16} className="text-gray-500" />
                  Call Recording
                </h3>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Volume2 size={20} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Recording Available</p>
                        <p className="text-xs text-gray-500">Duration: {formatDuration(call.recordingDuration)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onPlayRecording(call)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
                    >
                      <Play size={16} />
                      Listen
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Related To */}
            {call.relatedTo && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Related To</h3>
                <div
                  onClick={() => navigate(`/${call.relatedTo!.type}s/${call.relatedTo!.id}`)}
                  className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl border border-primary/20 hover:bg-primary/10 cursor-pointer transition"
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Briefcase size={18} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{call.relatedTo.label}</p>
                    <p className="text-xs text-gray-500 uppercase">{call.relatedTo.type} • {call.relatedTo.id}</p>
                  </div>
                  <ExternalLink size={16} className="text-primary" />
                </div>
              </div>
            )}

            {/* Transcription */}
            {call.transcription && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Transcription</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-700 italic leading-relaxed">"{call.transcription}"</p>
                </div>
              </div>
            )}

            {/* Notes */}
            {call.notes && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Notes</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-700">{call.notes}</p>
                </div>
              </div>
            )}

            {/* Tags */}
            {call.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {call.tags.map((tag) => {
                    const colors = tagColorMap[tag.color] || tagColorMap.gray;
                    return (
                      <span
                        key={tag.id}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium ${colors.bg} ${colors.text}`}
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
          <div className="px-6 py-4 border-t border-gray-200 flex items-center gap-3 flex-shrink-0 bg-white">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition">
              <Phone size={16} />
              Call Back
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
              <MessageSquare size={16} />
              Send SMS
            </button>
            {call.hasRecording && (
              <button
                onClick={() => onPlayRecording(call)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition"
              >
                <Headphones size={16} />
                Listen
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// SMS Detail Side Panel
interface SMSDetailSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  thread: SMSThread | null;
}

const SMSDetailSidePanel = ({ isOpen, onClose, thread }: SMSDetailSidePanelProps) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, thread?.messages]);

  if (!thread) return null;

  const contactConfig = contactTypeConfig[thread.contactType];
  const ContactIcon = contactConfig.icon;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              {thread.contactAvatar ? (
                <img src={thread.contactAvatar} alt="" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className={`w-12 h-12 rounded-full ${contactConfig.bg} flex items-center justify-center`}>
                  <ContactIcon size={20} className={contactConfig.color} />
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-gray-900">{thread.contactName}</h3>
                <p className="text-sm text-gray-500">{thread.contactPhone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {thread.contactId && (
                <button
                  onClick={() => navigate(`/customers/${thread.contactId}`)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <ExternalLink size={18} className="text-gray-500" />
                </button>
              )}
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {thread.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.direction === "outbound" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${message.direction === "outbound"
                      ? "bg-primary text-white rounded-br-md"
                      : "bg-white text-gray-900 rounded-bl-md shadow-sm"
                    }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className={`flex items-center gap-1 mt-1 ${message.direction === "outbound" ? "justify-end" : "justify-start"
                    }`}>
                    <span className={`text-[10px] ${message.direction === "outbound" ? "text-white/70" : "text-gray-500"
                      }`}>
                      {formatTime(message.timestamp)}
                    </span>
                    {message.direction === "outbound" && (
                      <span className="text-white/70">
                        {message.status === "read" ? <CheckCheck size={12} /> : <Check size={12} />}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="px-4 py-4 border-t border-gray-200 flex-shrink-0 bg-white">
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
                className="p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Email Detail Side Panel
interface EmailDetailSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  thread: EmailThread | null;
}

const EmailDetailSidePanel = ({ isOpen, onClose, thread }: EmailDetailSidePanelProps) => {
  const navigate = useNavigate();




  if (!thread) return null;

  const contactConfig = contactTypeConfig[thread.contactType];

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return <FileText size={14} className="text-red-500" />;
    if (type.includes("image")) return <Image size={14} className="text-purple-500" />;
    if (type.includes("video")) return <Video size={14} className="text-blue-500" />;
    return <File size={14} className="text-gray-500" />;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900">{thread.subject}</h3>
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
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Email Messages */}
          <div className="flex-1 overflow-y-auto">
            {thread.messages.map((email, index) => (
              <div key={email.id} className={`px-6 py-5 ${index !== thread.messages.length - 1 ? "border-b border-gray-100" : ""}`}>
                <div className="flex items-start gap-3 mb-4">
                  {email.from.avatar ? (
                    <img src={email.from.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User size={18} className="text-gray-500" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{email.from.name}</p>
                        <p className="text-xs text-gray-500">{email.from.email}</p>
                      </div>
                      <span className="text-xs text-gray-400">{formatRelativeTime(email.timestamp)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-sm text-gray-700 whitespace-pre-line">{email.body}</p>
                </div>

                {email.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {email.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer transition">
                        {getFileIcon(attachment.type)}
                        <span className="text-xs font-medium text-gray-900">{attachment.name}</span>
                        <Download size={12} className="text-gray-500" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center gap-2 flex-shrink-0">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition">
              <Reply size={16} />
              Reply
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
              <Forward size={16} />
              Forward
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Main Communication Hub Component
export default function CommunicationHub() {
  const [activeTab, setActiveTab] = useState<CommunicationTab>("calls");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");

  // Recording popup state
  const [recordingPopupOpen, setRecordingPopupOpen] = useState(false);
  const [selectedCallForRecording, setSelectedCallForRecording] = useState<CallRecord | null>(null);

  // Side panel states
  const [callPanelOpen, setCallPanelOpen] = useState(false);
  const [smsPanelOpen, setSMSPanelOpen] = useState(false);
  const [emailPanelOpen, setEmailPanelOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [selectedSMS, setSelectedSMS] = useState<SMSThread | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<EmailThread | null>(null);

  const navigate = useNavigate();
  const rowsPerPage = 10;

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
        !thread.contactPhone.includes(searchLower)
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
        !thread.subject.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    return true;
  });

  // Pagination
  const totalCallPages = Math.ceil(filteredCalls.length / rowsPerPage);
  const paginatedCalls = filteredCalls.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Stats
  const totalCalls = mockCallRecords.length;
  const missedCalls = mockCallRecords.filter((c) => c.outcome === "missed").length;
  const unreadSMS = mockSMSThreads.reduce((acc, t) => acc + t.unreadCount, 0);
  const unreadEmails = mockEmailThreads.reduce((acc, t) => acc + t.unreadCount, 0);

  const handleOpenRecording = (call: CallRecord) => {
    setSelectedCallForRecording(call);
    setRecordingPopupOpen(true);
  };

  const handleViewCall = (call: CallRecord) => {
    setSelectedCall(call);
    setCallPanelOpen(true);
  };

  const handleViewSMS = (thread: SMSThread) => {
    setSelectedSMS(thread);
    setSMSPanelOpen(true);
  };

  const handleViewEmail = (thread: EmailThread) => {
    setSelectedEmail(thread);
    setEmailPanelOpen(true);
  };

  return (
    <div className="min-h-screen p-4 md:p-4">
      <div className="max-w-8xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">Communication Hub</h1>
            <p className="text-xs text-gray-500 mt-0.5">Manage calls, SMS, and emails in one place</p>
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
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition ${activeTab === tab.id ? "bg-primary text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <Icon size={16} />
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}>
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
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
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

            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </div>

        {/* Calls Table */}
        {activeTab === "calls" && (
         <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Contact
          </th>
          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Phone
          </th>
          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Contacted By
          </th>
          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Direction
          </th>
          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Outcome
          </th>
          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Call Time
          </th>
          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Duration
          </th>
          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Recording
          </th>
          <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {paginatedCalls.length === 0 ? (
          <tr>
            <td colSpan={9} className="px-4 py-12 text-center">
              <Phone size={40} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-500 font-medium">No calls found</p>
            </td>
          </tr>
        ) : (
          paginatedCalls.map((call) => {
            const outcomeConfig = callOutcomeConfig[call.outcome];
            const callerConfig = contactTypeConfig[call.callerType];
            const OutcomeIcon = outcomeConfig.icon;
            const CallerIcon = callerConfig.icon;

            return (
              <tr key={call.id} className="hover:bg-gray-50 transition">
                {/* Contact */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {call.callerAvatar ? (
                      <img src={call.callerAvatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                      <div className={`w-9 h-9 rounded-full ${callerConfig.bg} flex items-center justify-center`}>
                        <CallerIcon size={16} className={callerConfig.color} />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {call.direction === "inbound" ? call.callerName : call.receiverName}
                      </p>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${callerConfig.bg} ${callerConfig.color}`}>
                        {callerConfig.label}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Phone */}
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">
                    {call.direction === "inbound" ? call.callerPhone : call.receiverPhone}
                  </span>
                </td>

                {/* Contacted By */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {call.contactedBy?.avatar ? (
                      <img src={call.contactedBy.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                        <User size={14} className="text-blue-600" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {call.contactedBy?.name || "System"}
                      </p>
                      {call.contactedBy?.role && (
                        <p className="text-[10px] text-gray-500">{call.contactedBy.role}</p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Direction */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {call.direction === "inbound" ? (
                      <PhoneIncoming size={14} className="text-green-600" />
                    ) : (
                      <PhoneOutgoing size={14} className="text-blue-600" />
                    )}
                    <span className="text-sm text-gray-700 capitalize">{call.direction}</span>
                  </div>
                </td>

                {/* Outcome */}
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold ${outcomeConfig.bg} ${outcomeConfig.color}`}>
                    <OutcomeIcon size={10} />
                    {outcomeConfig.label}
                  </span>
                </td>

                {/* Call Time */}
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{formatTime(call.timestamp)}</p>
                    <p className="text-xs text-gray-500">{formatFullDate(call.timestamp)}</p>
                  </div>
                </td>

                {/* Duration */}
                <td className="px-4 py-3">
                  <span className="text-sm font-semibold text-gray-900">
                    {call.duration > 0 ? formatDuration(call.duration) : "—"}
                  </span>
                </td>

                {/* Recording */}
                <td className="px-4 py-3">
                  {call.hasRecording && call.recordingDuration ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenRecording(call);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-medium transition"
                    >
                      <Headphones size={14} />
                      <span>{formatDuration(call.recordingDuration)}</span>
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">No recording</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleViewCall(call)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-medium transition"
                  >
                    <Eye size={14} />
                    View
                  </button>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>

  {/* Pagination */}
  {filteredCalls.length > 0 && (
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t bg-gray-50 gap-2">
      <p className="text-xs text-gray-500">
        Showing {(currentPage - 1) * rowsPerPage + 1} - {Math.min(currentPage * rowsPerPage, filteredCalls.length)} of {filteredCalls.length}
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
        <span className="px-2 py-1 text-xs font-medium">{currentPage} / {totalCallPages || 1}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalCallPages))}
          disabled={currentPage === totalCallPages || totalCallPages === 0}
          className="p-1 rounded border bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          <ChevronRight size={14} />
        </button>
        <button
          onClick={() => setCurrentPage(totalCallPages)}
          disabled={currentPage === totalCallPages || totalCallPages === 0}
          className="px-2 py-1 text-xs rounded border bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          Last
        </button>
      </div>
    </div>
  )}
</div>
        )}

        {/* SMS List */}
        {activeTab === "sms" && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
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

                  return (
                    <div
                      key={thread.id}
                      onClick={() => handleViewSMS(thread)}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition ${thread.unreadCount > 0 ? "bg-blue-50/30" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        {thread.contactAvatar ? (
                          <img src={thread.contactAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className={`w-10 h-10 rounded-full ${contactConfig.bg} flex items-center justify-center`}>
                            <ContactIcon size={16} className={contactConfig.color} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-sm ${thread.unreadCount > 0 ? "font-bold" : "font-medium"} text-gray-900`}>
                              {thread.contactName}
                            </p>
                            <span className="text-xs text-gray-400">{formatRelativeTime(thread.lastMessageTime)}</span>
                          </div>
                          <p className="text-xs text-gray-500 truncate">{thread.lastMessage}</p>
                        </div>
                        {thread.unreadCount > 0 && (
                          <span className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {thread.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Email List */}
        {activeTab === "email" && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
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

                  return (
                    <div
                      key={thread.id}
                      onClick={() => handleViewEmail(thread)}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition ${thread.unreadCount > 0 ? "bg-blue-50/30" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        {thread.contactAvatar ? (
                          <img src={thread.contactAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className={`w-10 h-10 rounded-full ${contactConfig.bg} flex items-center justify-center`}>
                            <ContactIcon size={16} className={contactConfig.color} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-sm ${thread.unreadCount > 0 ? "font-bold" : "font-medium"} text-gray-900`}>
                              {thread.contactName}
                            </p>
                            <div className="flex items-center gap-2">
                              {thread.hasAttachments && <Paperclip size={12} className="text-gray-400" />}
                              <span className="text-xs text-gray-400">{formatRelativeTime(thread.lastMessageTime)}</span>
                            </div>
                          </div>
                          <p className={`text-xs ${thread.unreadCount > 0 ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                            {thread.subject}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{thread.lastMessage}</p>
                        </div>
                        {thread.unreadCount > 0 && (
                          <span className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {thread.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Recording Popup */}
      <RecordingPopup
        isOpen={recordingPopupOpen}
        onClose={() => setRecordingPopupOpen(false)}
        call={selectedCallForRecording}
      />

      {/* Call Detail Side Panel */}
      <CallDetailSidePanel
        isOpen={callPanelOpen}
        onClose={() => setCallPanelOpen(false)}
        call={selectedCall}
        onPlayRecording={handleOpenRecording}
      />

      {/* SMS Detail Side Panel */}
      <SMSDetailSidePanel
        isOpen={smsPanelOpen}
        onClose={() => setSMSPanelOpen(false)}
        thread={selectedSMS}
      />

      {/* Email Detail Side Panel */}
      <EmailDetailSidePanel
        isOpen={emailPanelOpen}
        onClose={() => setEmailPanelOpen(false)}
        thread={selectedEmail}
      />

      {/* Tooltips */}
      <Tooltip
        id="comm-tooltip"
        place="top"
        className="!bg-gray-800 !text-white !text-[10px] !px-2 !py-1 !rounded"
      />
    </div>
  );
}