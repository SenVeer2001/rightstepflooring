// pages/TicketView.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
    ArrowLeft,
    Clock,
    Calendar,
    User,
    Users,
    Building,
    Briefcase,
    Eye,
    EyeOff,
    Send,
    Image as ImageIcon,
    Video,
    X,
    Play,
    Trash2,
    Edit3,
    MoreVertical,
    Paperclip,
    CheckCircle,
    MessageSquare,
    FileText,
    Layers,
    MapPin,
    Hash,
    Phone,
    Mail,
} from "lucide-react";
import PhotoViewerModal from "../../components/work-order-details/PhotoViewerModal";
import type { PhotoData } from "../../components/work-order-details/tabs/PhotosTab";
import type { TicketStatus, TicketPriority } from "../../data/ticketData";

// ==================== TYPES ====================
interface Comment {
    id: string;
    author: {
        id: string;
        name: string;
        avatar?: string;
        role: string;
    };
    content: string;
    attachments: {
        type: "image" | "video";
        url: string;
        name: string;
    }[];
    createdAt: Date;
    isEdited?: boolean;
}

interface TicketDetails {
    id: number;
    workId: string; // Added work ID
    title: string;
    customer: {
        id: string;
        name: string;
        email: string;
        phone: string;
        address: string; // Added address
        city: string;
        state: string;
        zipCode: string;
    };
    jobProject: string;
    category: string;
    subCategory: string;
    subContractor: string;
    coAssign: string;
    priority: TicketPriority;
    status: TicketStatus;
    visibility: "public" | "private";
    details: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    closedAt?: Date;
    totalTimeSpent: number;
    images: PhotoData[]; // Changed to use PhotoData type
    videos: { url: string; name: string }[];
    comments: Comment[];
}

// ==================== CONSTANTS ====================
const STATUS_OPTIONS: TicketStatus[] = ["Open", "In Progress", "Resolved", "Closed", "On Hold"];
const PRIORITY_OPTIONS: TicketPriority[] = ["Low", "Normal", "High", "Urgent"];

const STATUS_COLORS: Record<TicketStatus, { bg: string; text: string; border: string }> = {
    "Open": { bg: "#EDE9FE", text: "#4D2FB2", border: "#4D2FB2" },
    "In Progress": { bg: "#FEF9E7", text: "#92400E", border: "#FDE68A" },
    "Resolved": { bg: "#DCFCE7", text: "#48A111", border: "#48A111" },
    "Closed": { bg: "#F1F5F9", text: "#64748B", border: "#E2E8F0" },
    "On Hold": { bg: "#FFF4E6", text: "#C2410C", border: "#f5a962" },
};

const PRIORITY_COLORS: Record<TicketPriority, { bg: string; text: string; border: string }> = {
    "Low": { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0" },
    "Normal": { bg: "#E6F7F7", text: "#0C7779", border: "#0C7779" },
    "High": { bg: "#FDF2F2", text: "#7F1D1D", border: "#C8AAAA" },
    "Urgent": { bg: "#FFFBEB", text: "#92400E", border: "#F5E7C6" },
};

// Quill modules configuration
const quillModules = {
    toolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
    ],
};

const quillFormats = ["bold", "italic", "underline", "list", "bullet", "link"];

// Mock ticket data
const mockTicket: TicketDetails = {
    id: 1001,
    workId: "WRK-2024-00156",
    title: "Water Leak in Kitchen Ceiling - Urgent Repair Needed",
    customer: {
        id: "1",
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+1 (555) 123-4567",
        address: "1234 Oak Street, Suite 100",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90001",
    },
    jobProject: "Kitchen Renovation - Downtown",
    category: "Plumbing",
    subCategory: "Leak Repair",
    subContractor: "Alex Thompson",
    coAssign: "Jordan Lee",
    priority: "High",
    status: "In Progress",
    visibility: "public",
    details: `<p>There is a significant water leak coming from the kitchen ceiling. The leak appears to be originating from the bathroom above.</p>
    <p><strong>Observations:</strong></p>
    <ul>
      <li>Water stains visible on ceiling</li>
      <li>Dripping occurs when upstairs bathroom is in use</li>
      <li>Possible pipe connection issue</li>
    </ul>
    <p>Customer requests urgent attention as water damage is spreading.</p>`,
    tags: ["Urgent", "Water Damage", "Kitchen"],
    createdAt: new Date("2024-01-15T09:30:00"),
    updatedAt: new Date("2024-01-15T14:45:00"),
    totalTimeSpent: 7200,
    images: [
        {
            id: "1",
            url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
            name: "ceiling_damage.jpg",
            date: "2024-01-15",
            time: "09:30 AM",
            uploadedBy: "Alex Thompson"
        },
        {
            id: "2",
            url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
            name: "water_stain.jpg",
            date: "2024-01-15",
            time: "09:35 AM",
            uploadedBy: "Alex Thompson"
        },
        {
            id: "3",
            url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800",
            name: "kitchen_overview.jpg",
            date: "2024-01-15",
            time: "09:40 AM",
            uploadedBy: "Alex Thompson"
        },
        {
            id: "4",
            url: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800",
            name: "pipe_damage.jpg",
            date: "2024-01-15",
            time: "10:30 AM",
            uploadedBy: "Jordan Lee"
        },
    ],
    videos: [
        { url: "https://www.w3schools.com/html/mov_bbb.mp4", name: "leak_video.mp4" },
    ],
    comments: [
        {
            id: "1",
            author: { id: "1", name: "Alex Thompson", role: "Technician", avatar: "" },
            content: "<p>Arrived on site and assessed the damage. The leak is coming from a <strong>corroded pipe joint</strong> in the upstairs bathroom. Will need to replace the section.</p>",
            attachments: [
                { type: "image", url: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800", name: "pipe_damage.jpg" },
            ],
            createdAt: new Date("2024-01-15T10:30:00"),
        },
        {
            id: "2",
            author: { id: "2", name: "Jordan Lee", role: "Supervisor" },
            content: "<p>Parts have been ordered. Expected delivery tomorrow morning. Please schedule follow-up visit.</p>",
            attachments: [],
            createdAt: new Date("2024-01-15T11:45:00"),
        },
    ],
};

// ==================== HELPER FUNCTIONS ====================
const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
};

// ==================== TIMER COMPONENT ====================
interface TimerProps {
    initialTime: number;
    isRunning: boolean;
    onTimeUpdate: (time: number) => void;
}

const Timer: React.FC<TimerProps> = ({ initialTime, isRunning, onTimeUpdate }) => {
    const [time, setTime] = useState(initialTime);
    //   @ts-ignore
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTime((prev) => {
                    const newTime = prev + 1;
                    onTimeUpdate(newTime);
                    return newTime;
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, onTimeUpdate]);

    useEffect(() => {
        setTime(initialTime);
    }, [initialTime]);

    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isRunning
                ? "bg-green-50 border-2 border-green-200"
                : "bg-gray-50 border-2 border-gray-200"
            }`}>
            <div className={`p-2.5 rounded-lg ${isRunning ? "bg-green-100" : "bg-gray-200"}`}>
                <Clock size={22} className={isRunning ? "text-green-600" : "text-gray-500"} />
            </div>
            <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Time Tracked</p>
                <p className={`text-2xl font-bold font-mono ${isRunning ? "text-green-600" : "text-gray-700"}`}>
                    {formatTime(time)}
                </p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${isRunning
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}>
                {isRunning ? (
                    <>
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Running
                    </>
                ) : (
                    <>
                        <span className="w-2 h-2 bg-gray-400 rounded-full" />
                        Stopped
                    </>
                )}
            </div>
        </div>
    );
};

// ==================== VIDEO MODAL COMPONENT ====================
interface VideoModalProps {
    video: { url: string; name: string } | null;
    onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
    useEffect(() => {
        if (video) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [video]);

    if (!video) return null;

    return (
        <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition z-20"
            >
                <X size={28} />
            </button>

            <div className="max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
                <video
                    src={video.url}
                    controls
                    autoPlay
                    className="w-full max-h-[80vh] object-contain rounded-lg"
                />
                <p className="text-center text-white/80 mt-4 text-sm">{video.name}</p>
            </div>
        </div>
    );
};

// ==================== MEDIA GALLERY COMPONENT ====================
interface MediaGalleryProps {
    images: PhotoData[];
    videos: { url: string; name: string }[];
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ images, videos }) => {
    const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
    const [photoStartIndex, setPhotoStartIndex] = useState(0);
    const [selectedVideo, setSelectedVideo] = useState<{ url: string; name: string } | null>(null);

    const openPhotoViewer = (index: number) => {
        setPhotoStartIndex(index);
        setPhotoViewerOpen(true);
    };

    return (
        <>
            <div className="space-y-6">
                {/* Images Grid */}
                {images.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                            <ImageIcon size={16} className="text-gray-500" />
                            Photos ({images.length})
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {images.map((image, idx) => (
                                <div
                                    key={image.id}
                                    onClick={() => openPhotoViewer(idx)}
                                    className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group border-2 border-gray-100 hover:border-primary transition-all hover:shadow-lg"
                                >
                                    <img
                                        src={image.url}
                                        alt={image.name}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition bg-white rounded-full p-2">
                                            <Eye size={20} className="text-gray-800" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                        <span className="text-xs text-white truncate block">{image.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Videos Grid */}
                {videos.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                            <Video size={16} className="text-gray-500" />
                            Videos ({videos.length})
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {videos.map((video, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedVideo(video)}
                                    className="relative rounded-xl overflow-hidden border-2 border-gray-100 bg-gray-900 cursor-pointer group hover:border-primary transition-all"
                                >
                                    <video
                                        src={video.url}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition flex items-center justify-center">
                                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition">
                                            <Play size={24} className="text-gray-800 ml-1" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                        <div className="flex items-center gap-2 text-white">
                                            <Video size={14} />
                                            <span className="text-sm truncate">{video.name}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Photo Viewer Modal - Reusing your component */}
            {photoViewerOpen && (
                <PhotoViewerModal
                    photos={images}
                    startIndex={photoStartIndex}
                    onClose={() => setPhotoViewerOpen(false)}
                />
            )}

            {/* Video Modal */}
            <VideoModal
                video={selectedVideo}
                onClose={() => setSelectedVideo(null)}
            />
        </>
    );
};

// ==================== COMMENT EDITOR COMPONENT ====================
interface CommentEditorProps {
    onSubmit: (content: string, attachments: File[]) => void;
}

const CommentEditor: React.FC<CommentEditorProps> = ({ onSubmit }) => {
    const [content, setContent] = useState("");
    const [attachments, setAttachments] = useState<File[]>([]);
    const [previews, setPreviews] = useState<{ type: string; url: string; name: string }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validFiles = files.filter((file) => {
            const isImage = file.type.startsWith("image/");
            const isVideo = file.type.startsWith("video/");
            const isValidSize = file.size <= (isVideo ? 50 : 5) * 1024 * 1024;
            return (isImage || isVideo) && isValidSize;
        });

        validFiles.forEach((file) => {
            const url = URL.createObjectURL(file);
            setPreviews((prev) => [
                ...prev,
                {
                    type: file.type.startsWith("video/") ? "video" : "image",
                    url,
                    name: file.name,
                },
            ]);
        });

        setAttachments((prev) => [...prev, ...validFiles]);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const removeAttachment = (index: number) => {
        URL.revokeObjectURL(previews[index].url);
        setPreviews((prev) => prev.filter((_, i) => i !== index));
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        const textContent = content.replace(/<[^>]*>/g, "").trim();

        if (!textContent && attachments.length === 0) return;

        setIsSubmitting(true);

        try {
            await onSubmit(content, attachments);

            // Reset
            setContent("");
            previews.forEach((p) => URL.revokeObjectURL(p.url));
            setPreviews([]);
            setAttachments([]);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white focus-within:border-primary transition">
            {/* Quill Editor */}
            <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Write a comment..."
                className="comment-editor"
            />

            {/* Attachment Previews */}
            {previews.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 border-t bg-gray-50">
                    {previews.map((preview, idx) => (
                        <div key={idx} className="relative group">
                            {preview.type === "image" ? (
                                <img
                                    src={preview.url}
                                    alt={preview.name}
                                    className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                                />
                            ) : (
                                <div className="w-20 h-20 bg-gray-200 rounded-lg border-2 border-gray-200 flex flex-col items-center justify-center">
                                    <Video size={24} className="text-gray-500" />
                                    <span className="text-xs text-gray-500 mt-1 truncate max-w-[70px]">
                                        {preview.name}
                                    </span>
                                </div>
                            )}
                            <button
                                onClick={() => removeAttachment(idx)}
                                className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-red-600"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between p-3 border-t bg-gray-50">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition text-sm font-medium"
                        title="Attach files"
                    >
                        <Paperclip size={18} />
                        <span className="hidden sm:inline">Attach</span>
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                    <span className="text-xs text-gray-400 hidden md:inline">
                        Images (5MB) & Videos (50MB)
                    </span>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || (!content.replace(/<[^>]*>/g, "").trim() && attachments.length === 0)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send size={16} />
                            Send
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

// ==================== COMMENT ITEM COMPONENT ====================
interface CommentItemProps {
    comment: Comment;
    onDelete?: (id: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onDelete }) => {
    const [showFullImage, setShowFullImage] = useState<string | null>(null);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    {comment.author.avatar ? (
                        <img
                            src={comment.author.avatar}
                            alt={comment.author.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                                {comment.author.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                        <span className="font-semibold text-gray-900">{comment.author.name}</span>
                        <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                            {comment.author.role}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400" title={formatDate(comment.createdAt)}>
                            {getRelativeTime(comment.createdAt)}
                        </span>
                        {comment.isEdited && (
                            <span className="text-xs text-gray-400 italic">(edited)</span>
                        )}
                    </div>

                    {/* Comment Content */}
                    <div
                        className="prose prose-sm max-w-none text-gray-700"
                        dangerouslySetInnerHTML={{ __html: comment.content }}
                    />

                    {/* Attachments */}
                    {comment.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {comment.attachments.map((attachment, idx) => (
                                <div key={idx} className="relative group">
                                    {attachment.type === "image" ? (
                                        <img
                                            src={attachment.url}
                                            alt={attachment.name}
                                            onClick={() => setShowFullImage(attachment.url)}
                                            className="w-28 h-28 object-cover rounded-lg border-2 border-gray-100 cursor-pointer hover:border-primary transition"
                                        />
                                    ) : (
                                        <video
                                            src={attachment.url}
                                            controls
                                            className="w-48 h-32 object-cover rounded-lg border-2 border-gray-100"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions Menu */}
                <div className="flex-shrink-0 relative" ref={menuRef}>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    >
                        <MoreVertical size={16} />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white border rounded-xl shadow-lg z-10 py-1 overflow-hidden">
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <Edit3 size={14} />
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete?.(comment.id)}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <Trash2 size={14} />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Full Image Modal */}
            {showFullImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setShowFullImage(null)}
                >
                    <img
                        src={showFullImage}
                        alt=""
                        className="max-w-full max-h-full object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        onClick={() => setShowFullImage(null)}
                        className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition"
                    >
                        <X size={28} />
                    </button>
                </div>
            )}
        </>
    );
};

// ==================== MAIN TICKET VIEW COMPONENT ====================
export default function TicketView() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState<TicketDetails>(mockTicket);
    const [isTimerRunning, setIsTimerRunning] = useState(true);
    const [totalTime, setTotalTime] = useState(ticket.totalTimeSpent);

    // Check if timer should run based on status
    useEffect(() => {
        const shouldRun = ticket.status !== "Closed" && ticket.status !== "Resolved";
        setIsTimerRunning(shouldRun);
    }, [ticket.status]);

    // Handle status change
    const handleStatusChange = (newStatus: TicketStatus) => {
        setTicket((prev) => ({
            ...prev,
            status: newStatus,
            updatedAt: new Date(),
            closedAt: newStatus === "Closed" ? new Date() : undefined,
        }));
    };

    // Handle priority change
    const handlePriorityChange = (newPriority: TicketPriority) => {
        setTicket((prev) => ({
            ...prev,
            priority: newPriority,
            updatedAt: new Date(),
        }));
    };

    // Handle add comment
    const handleAddComment = (content: string, attachments: File[]) => {
        const newComment: Comment = {
            id: Date.now().toString(),
            author: {
                id: "current-user",
                name: "Current User",
                role: "Staff",
            },
            content,
            attachments: attachments.map((file) => ({
                type: file.type.startsWith("video/") ? "video" : "image",
                url: URL.createObjectURL(file),
                name: file.name,
            })),
            createdAt: new Date(),
        };

        setTicket((prev) => ({
            ...prev,
            comments: [...prev.comments, newComment],
            updatedAt: new Date(),
        }));
    };

    // Handle delete comment
    const handleDeleteComment = (commentId: string) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;

        setTicket((prev) => ({
            ...prev,
            comments: prev.comments.filter((c) => c.id !== commentId),
            updatedAt: new Date(),
        }));
    };

    // Get full address
    const getFullAddress = () => {
        const { address, city, state, zipCode } = ticket.customer;
        return `${address}, ${city}, ${state} ${zipCode}`;
    };

    return (
        <div className="">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-40 shadow-sm mb-4">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition mt-1 sm:mt-0"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                                        TID-{ticket.id}
                                    </h1>
                                    <span className="text-sm text-gray-500 font-medium">
                                        ({ticket.workId})
                                    </span>
                                    <span
                                        className="px-3 py-1 rounded-full text-xs font-semibold"
                                        style={{
                                            backgroundColor: STATUS_COLORS[ticket.status].bg,
                                            color: STATUS_COLORS[ticket.status].text,
                                        }}
                                    >
                                        {ticket.status}
                                    </span>
                                    <span
                                        className="px-3 py-1 rounded-full text-xs font-semibold"
                                        style={{
                                            backgroundColor: PRIORITY_COLORS[ticket.priority].bg,
                                            color: PRIORITY_COLORS[ticket.priority].text,
                                        }}
                                    >
                                        {ticket.priority} Priority
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 truncate max-w-md">{ticket.title}</p>
                            </div>
                        </div>

                        {/* Timer - Desktop */}
                        <div className="hidden lg:block flex-shrink-0">
                            <Timer
                                initialTime={totalTime}
                                isRunning={isTimerRunning}
                                onTimeUpdate={setTotalTime}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-8xl mx-auto px-4 ">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2  ">
                        {/* Mobile/Tablet Timer */}
                        <div className="lg:hidden">
                            <Timer
                                initialTime={totalTime}
                                isRunning={isTimerRunning}
                                onTimeUpdate={setTotalTime}
                            />
                        </div>

                        {/* Ticket Details */}
                        <div className="bg-white rounded-xl border shadow-sm p-5 space-y-6 ">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <FileText size={20} className="text-primary" />
                                    Ticket Details
                                </h2>
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500 hover:text-gray-700">
                                    <Edit3 size={18} />
                                </button>
                            </div>

                            {/* Work ID & Title */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-1 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-1">
                                        <Hash size={14} />
                                        Job ID
                                    </div>
                                    <p className="font-semibold text-gray-900">JOB-242</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-1">
                                        <FileText size={14} />
                                        Work Order ID
                                    </div>
                                    <p className="font-semibold text-gray-900">WO-{ticket.workId}</p>
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Title</h3>
                                <p className="text-gray-900 font-medium">{ticket.title}</p>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                                <div
                                    className="prose prose-sm max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg"
                                    dangerouslySetInnerHTML={{ __html: ticket.details }}
                                />
                            </div>

                            {/* Tags */}
                            {ticket.tags.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {ticket.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>


                        {(ticket.images.length > 0 || ticket.videos.length > 0) && (
                            <div className="bg-white rounded-xl border shadow-sm p-6 mt-4">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                    <Paperclip size={20} className="text-primary" />
                                   Ticket Attachments ({ticket.images.length + ticket.videos.length})
                                </h2>
                                <MediaGallery images={ticket.images} videos={ticket.videos} />
                            </div>
                        )}

                        {/* Comments Section */}
                        <div className="bg-white rounded-xl border shadow-sm p-6 mt-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                                <MessageSquare size={20} className="text-primary" />
                                Comments ({ticket.comments.length})
                            </h2>

                            {/* Comments List */}
                            <div className="space-y-4 mb-6">
                                {ticket.comments.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                                        <MessageSquare size={48} className="mx-auto mb-3 text-gray-300" />
                                        <p className="text-gray-500 font-medium">No comments yet</p>
                                        <p className="text-sm text-gray-400 mt-1">Be the first to comment</p>
                                    </div>
                                ) : (
                                    ticket.comments.map((comment) => (
                                        <CommentItem
                                            key={comment.id}
                                            comment={comment}
                                            onDelete={handleDeleteComment}
                                        />
                                    ))
                                )}
                            </div>

                            {/* Add Comment */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <Edit3 size={16} />
                                    Add Comment
                                </h3>
                                <CommentEditor onSubmit={handleAddComment} />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-4">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl border shadow-sm p-5 space-y-4 ">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Layers size={18} className="text-primary" />
                                Quick Actions
                            </h3>

                            <div className="flex items-center justify-between gap-3 ">
                                {/* Status Change */}
                                <div className="w-full">
                                    <label className="text-sm font-medium text-gray-500 block mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={ticket.status}
                                        onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                                        style={{
                                            backgroundColor: STATUS_COLORS[ticket.status].bg,
                                            color: STATUS_COLORS[ticket.status].text,
                                            borderColor: STATUS_COLORS[ticket.status].border,
                                        }}
                                        className="w-full px-4 py-2.5 rounded-lg border-2 font-semibold text-sm cursor-pointer outline-none transition hover:shadow-md"
                                    >
                                        {STATUS_OPTIONS.map((status) => (
                                            <option key={status} value={status} style={{ backgroundColor: "white", color: "#374151" }}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Priority Change */}
                                <div className="w-full">
                                    <label className="text-sm font-medium text-gray-500 block mb-2">
                                        Priority
                                    </label>
                                    <select
                                        value={ticket.priority}
                                        onChange={(e) => handlePriorityChange(e.target.value as TicketPriority)}
                                        style={{
                                            backgroundColor: PRIORITY_COLORS[ticket.priority].bg,
                                            color: PRIORITY_COLORS[ticket.priority].text,
                                            borderColor: PRIORITY_COLORS[ticket.priority].border,
                                        }}
                                        className="w-full px-4 py-2.5 rounded-lg border-2 font-semibold text-sm cursor-pointer outline-none transition hover:shadow-md"
                                    >
                                        {PRIORITY_OPTIONS.map((priority) => (
                                            <option key={priority} value={priority} style={{ backgroundColor: "white", color: "#374151" }}>
                                                {priority}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Timer Status */}
                            <div className={`p-3 rounded-lg text-sm ${isTimerRunning ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-600"}`}>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <span className="font-medium">
                                        {isTimerRunning ? "Timer is running" : "Timer stopped"}
                                    </span>
                                </div>
                                <p className="text-xs mt-1 opacity-75">
                                    {isTimerRunning
                                        ? "Timer will stop when status is Closed or Resolved"
                                        : "Reopen ticket to resume timer"
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Customer Info with Address */}
                        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Building size={18} className="text-primary" />
                                Customer Information
                            </h3>

                            {/* Customer Name */}
                            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <User size={18} className="text-blue-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-gray-500 font-medium">Name</p>
                                    <p className="font-semibold text-gray-900">{ticket.customer.name}</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="p-2 bg-gray-200 rounded-lg">
                                    <Mail size={18} className="text-gray-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-gray-500 font-medium">Email</p>
                                    <a
                                        href={`mailto:${ticket.customer.email}`}
                                        className="font-medium text-primary hover:underline text-sm break-all"
                                    >
                                        {ticket.customer.email}
                                    </a>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="p-2 bg-gray-200 rounded-lg">
                                    <Phone size={18} className="text-gray-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-gray-500 font-medium">Phone</p>
                                    <a
                                        href={`tel:${ticket.customer.phone}`}
                                        className="font-medium text-primary hover:underline"
                                    >
                                        {ticket.customer.phone}
                                    </a>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <MapPin size={18} className="text-orange-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-gray-500 font-medium">Address</p>
                                    <p className="font-medium text-gray-900 text-sm">{ticket.customer.address}</p>
                                    <p className="text-sm text-gray-600">
                                        {ticket.customer.city}, {ticket.customer.state} {ticket.customer.zipCode}
                                    </p>
                                    <a
                                        href={`https://maps.google.com/?q=${encodeURIComponent(getFullAddress())}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                                    >
                                        <MapPin size={12} />
                                        View on Map
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Ticket Info */}
                        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
                            <h3 className="font-semibold text-gray-900">Ticket Information</h3>

                            {/* Work ID */}
                            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Hash size={18} className="text-purple-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-gray-500 font-medium">Work ID</p>
                                    <p className="font-bold text-gray-900">{ticket.workId}</p>
                                </div>
                            </div>

                            {/* Project */}
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="p-2 bg-gray-200 rounded-lg">
                                    <Briefcase size={18} className="text-gray-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-gray-500 font-medium">Job/Project</p>
                                    <p className="font-semibold text-gray-900">{ticket.jobProject}</p>
                                </div>
                            </div>

                            {/* Category */}
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Layers size={18} className="text-green-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-gray-500 font-medium">Category</p>
                                    <p className="font-semibold text-gray-900">{ticket.category}</p>
                                    <p className="text-xs text-gray-500">{ticket.subCategory}</p>
                                </div>
                            </div>

                            {/* Assigned To */}
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <User size={18} className="text-orange-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-gray-500 font-medium">Assigned To</p>
                                    <p className="font-semibold text-gray-900">{ticket.subContractor}</p>
                                </div>
                            </div>

                            {/* Co-Assign */}
                            {ticket.coAssign && (
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="p-2 bg-teal-100 rounded-lg">
                                        <Users size={18} className="text-teal-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-gray-500 font-medium">Co-Assigned</p>
                                        <p className="font-semibold text-gray-900">{ticket.coAssign}</p>
                                    </div>
                                </div>
                            )}

                            {/* Visibility */}
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="p-2 bg-gray-200 rounded-lg">
                                    {ticket.visibility === "public" ? (
                                        <Eye size={18} className="text-gray-600" />
                                    ) : (
                                        <EyeOff size={18} className="text-gray-600" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-gray-500 font-medium">Visibility</p>
                                    <p className="font-semibold text-gray-900 capitalize">{ticket.visibility}</p>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
                            <h3 className="font-semibold text-gray-900">Timeline</h3>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Calendar size={16} className="text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Created</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {formatDate(ticket.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Clock size={16} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Last Updated</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {formatDate(ticket.updatedAt)}
                                        </p>
                                    </div>
                                </div>

                                {ticket.closedAt && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                                        <div className="p-2 bg-gray-200 rounded-lg">
                                            <CheckCircle size={16} className="text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Closed</p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {formatDate(ticket.closedAt)}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className={`flex items-center gap-3 p-3 rounded-lg ${isTimerRunning ? "bg-green-50" : "bg-gray-100"}`}>
                                    <div className={`p-2 rounded-lg ${isTimerRunning ? "bg-green-100" : "bg-gray-200"}`}>
                                        <Clock size={16} className={isTimerRunning ? "text-green-600" : "text-gray-600"} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Total Time Spent</p>
                                        <p className={`text-lg font-bold font-mono ${isTimerRunning ? "text-green-600" : "text-gray-900"}`}>
                                            {formatTime(totalTime)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}