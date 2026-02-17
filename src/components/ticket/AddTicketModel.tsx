// components/ticket/AddTicketModal.tsx
import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
    X,
    Upload,
    Image as ImageIcon,
    Video,
    Trash2,
    Plus,
    AlertCircle,
    User,
    Layers,
    FileText,
    Flag,
    Eye,
    EyeOff,
    Users,
    ChevronDown,
    Check,
    Tag,
} from "lucide-react";
import type { TicketStatus, TicketPriority } from "../../data/ticketData";

interface AddTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: TicketFormData) => void;
}

export interface TicketFormData {
    customer: string;
    jobProject: string;
    category: string;
    subCategory: string;
    title: string;
    tags: string[];
    status: TicketStatus;
    assignTo: string;
    coAssign: string;
    priority: TicketPriority;
    visibility: "public" | "private";
    details: string;
    images: File[];
    video: File | null;
}

// Sample data
const CUSTOMERS = [
    { id: "1", name: "John Smith" },
    { id: "2", name: "Sarah Johnson" },
    { id: "3", name: "Mike Davis" },
    { id: "4", name: "Emily Brown" },
];

const PROJECTS = [
    { id: "1", name: "Kitchen Renovation - Downtown" },
    { id: "2", name: "Bathroom Remodel - Oak Street" },
    { id: "3", name: "Full House Renovation" },
    { id: "4", name: "Office Building Project" },
];

const CATEGORIES = [
    { id: "1", name: "Plumbing", subCategories: ["Leak Repair", "Installation", "Maintenance"] },
    { id: "2", name: "Electrical", subCategories: ["Wiring", "Fixtures", "Panel Upgrade"] },
    { id: "3", name: "HVAC", subCategories: ["AC Repair", "Heating", "Ventilation"] },
    { id: "4", name: "General", subCategories: ["Inquiry", "Complaint", "Feedback"] },
];

const STAFF = [
    { id: "1", name: "Alex Thompson", role: "Technician" },
    { id: "2", name: "Jordan Lee", role: "Supervisor" },
    { id: "3", name: "Casey Wilson", role: "Manager" },
    { id: "4", name: "Taylor Brown", role: "Support" },
];

// Available Tags
const AVAILABLE_TAGS = [
    { id: "urgent", label: "Urgent", color: "bg-red-100 text-red-700" },
    { id: "high-priority", label: "High Priority", color: "bg-orange-100 text-orange-700" },
    { id: "water-damage", label: "Water Damage", color: "bg-blue-100 text-blue-700" },
    { id: "electrical", label: "Electrical Issue", color: "bg-yellow-100 text-yellow-700" },
    { id: "safety", label: "Safety Concern", color: "bg-rose-100 text-rose-700" },
    { id: "follow-up", label: "Follow Up", color: "bg-purple-100 text-purple-700" },
    { id: "warranty", label: "Warranty", color: "bg-green-100 text-green-700" },
    { id: "callback", label: "Callback Required", color: "bg-indigo-100 text-indigo-700" },
    { id: "inspection", label: "Inspection", color: "bg-cyan-100 text-cyan-700" },
    { id: "maintenance", label: "Maintenance", color: "bg-teal-100 text-teal-700" },
];

const STATUS_OPTIONS: { value: TicketStatus; label: string; color: string }[] = [
    { value: "Open", label: "Open", color: "bg-purple-100 text-purple-700 border-purple-300" },
    { value: "In Progress", label: "In Progress", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
    { value: "Resolved", label: "Resolved", color: "bg-green-100 text-green-700 border-green-300" },
    { value: "On Hold", label: "On Hold", color: "bg-orange-100 text-orange-700 border-orange-300" },
    { value: "Closed", label: "Closed", color: "bg-gray-100 text-gray-700 border-gray-300" },
];

const PRIORITY_OPTIONS: { value: TicketPriority; label: string; color: string }[] = [
    { value: "Low", label: "Low", color: "bg-green-100 text-green-700 border-green-300" },
    { value: "Normal", label: "Normal", color: "bg-blue-100 text-blue-700 border-blue-300" },
    { value: "High", label: "High", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
    { value: "Urgent", label: "Urgent", color: "bg-red-100 text-red-700 border-red-300" },
];

// Quill editor modules
const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
    ],
};

const quillFormats = ["header", "bold", "italic", "underline", "strike", "list", "bullet", "link"];

// ==================== TAG DROPDOWN COMPONENT ====================
interface TagDropdownProps {
    selectedTags: string[];
    onTagToggle: (tagLabel: string) => void;
    maxTags?: number;
}

const TagDropdown: React.FC<TagDropdownProps> = ({ selectedTags, onTagToggle, maxTags = 5 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getTagColor = (tagLabel: string) => {
        const tag = AVAILABLE_TAGS.find((t) => t.label === tagLabel);
        return tag?.color || "bg-gray-100 text-gray-700";
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-2 border rounded-lg text-sm bg-white text-left flex items-center justify-between transition ${isOpen ? "border-primary ring-2 ring-primary/20" : "border-gray-300 hover:border-gray-400"
                    }`}
            >
                <div className="flex-1 flex flex-wrap gap-1.5 min-h-[24px]">
                    {selectedTags.length === 0 ? (
                        <span className="text-gray-400">Select tags...</span>
                    ) : (
                        selectedTags.map((tag) => (
                            <span
                                key={tag}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onTagToggle(tag);
                                    }}
                                    className="hover:opacity-70"
                                >
                                    <X size={12} />
                                </button>
                            </span>
                        ))
                    )}
                </div>
                <ChevronDown size={18} className={`text-gray-400 transition ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                    <div className="p-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase px-2 py-1.5">
                            Select Tags ({selectedTags.length}/{maxTags})
                        </p>
                        {AVAILABLE_TAGS.map((tag) => {
                            const isSelected = selectedTags.includes(tag.label);
                            const isDisabled = !isSelected && selectedTags.length >= maxTags;

                            return (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => !isDisabled && onTagToggle(tag.label)}
                                    disabled={isDisabled}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${isDisabled
                                            ? "opacity-50 cursor-not-allowed"
                                            : isSelected
                                                ? "bg-primary/10"
                                                : "hover:bg-gray-50"
                                        }`}
                                >
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tag.color}`}>
                                        {tag.label}
                                    </span>
                                    {isSelected && <Check size={16} className="text-primary" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

// ==================== MAIN MODAL COMPONENT ====================
const AddTicketModal: React.FC<AddTicketModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<TicketFormData>({
        customer: "",
        jobProject: "",
        category: "",
        subCategory: "",
        title: "",
        tags: [],
        status: "Open",
        assignTo: "",
        coAssign: "",
        priority: "Normal",
        visibility: "public",
        details: "",
        images: [],
        video: null,
    });

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<Partial<Record<keyof TicketFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const selectedCategory = CATEGORIES.find((c) => c.id === formData.category);
    const subCategories = selectedCategory?.subCategories || [];

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name as keyof TicketFormData]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }

        if (name === "category") {
            setFormData((prev) => ({ ...prev, subCategory: "" }));
        }
    };

    // Handle editor change
    const handleEditorChange = (content: string) => {
        setFormData((prev) => ({ ...prev, details: content }));
        if (errors.details) {
            setErrors((prev) => ({ ...prev, details: undefined }));
        }
    };

    // Handle tag toggle
    const handleTagToggle = (tagLabel: string) => {
        setFormData((prev) => {
            const isSelected = prev.tags.includes(tagLabel);
            if (isSelected) {
                return { ...prev, tags: prev.tags.filter((t) => t !== tagLabel) };
            } else if (prev.tags.length < 5) {
                return { ...prev, tags: [...prev.tags, tagLabel] };
            }
            return prev;
        });
    };

    // Handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const remainingSlots = 10 - formData.images.length;
        const filesToAdd = files.slice(0, remainingSlots);

        const validFiles = filesToAdd.filter((file) => {
            const isValidType = ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type);
            const isValidSize = file.size <= 5 * 1024 * 1024;
            return isValidType && isValidSize;
        });

        if (validFiles.length > 0) {
            setFormData((prev) => ({ ...prev, images: [...prev.images, ...validFiles] }));

            validFiles.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreviews((prev) => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }

        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    };

    const handleRemoveImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    // Handle video upload
    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const isValidType = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"].includes(file.type);
            const isValidSize = file.size <= 50 * 1024 * 1024;

            if (!isValidType) {
                setErrors((prev) => ({ ...prev, video: "Invalid video format. Use MP4, WebM, or OGG." }));
                return;
            }

            if (!isValidSize) {
                setErrors((prev) => ({ ...prev, video: "Video must be less than 50MB." }));
                return;
            }

            setFormData((prev) => ({ ...prev, video: file }));
            setVideoPreview(URL.createObjectURL(file));
            setErrors((prev) => ({ ...prev, video: undefined }));
        }
    };

    const handleRemoveVideo = () => {
        setFormData((prev) => ({ ...prev, video: null }));
        if (videoPreview) {
            URL.revokeObjectURL(videoPreview);
            setVideoPreview(null);
        }
        if (videoInputRef.current) {
            videoInputRef.current.value = "";
        }
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof TicketFormData, string>> = {};

        if (!formData.customer) newErrors.customer = "Customer is required";
        if (!formData.category) newErrors.category = "Category is required";
        if (!formData.subCategory) newErrors.subCategory = "Sub-category is required";
        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.assignTo) newErrors.assignTo = "Assignee is required";

        const textContent = formData.details.replace(/<[^>]*>/g, "").trim();
        if (!textContent) {
            newErrors.details = "Ticket details are required";
        } else if (textContent.split(/\s+/).length > 300) {
            newErrors.details = "Details must not exceed 300 words";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            await onSubmit(formData);
            handleClose();
        } catch (error) {
            console.error("Error submitting ticket:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle modal close
    const handleClose = () => {
        setFormData({
            customer: "",
            jobProject: "",
            category: "",
            subCategory: "",
            title: "",
            tags: [],
            status: "Open",
            assignTo: "",
            coAssign: "",
            priority: "Normal",
            visibility: "public",
            details: "",
            images: [],
            video: null,
        });
        setImagePreviews([]);
        if (videoPreview) {
            URL.revokeObjectURL(videoPreview);
            setVideoPreview(null);
        }
        setErrors({});
        onClose();
    };

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

            {/* Modal Container */}
            <div className="relative w-full max-w-5xl max-h-[95vh] mx-4 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-primary to-primary/80">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <FileText size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Create New Ticket</h2>
                            <p className="text-sm text-white/80">Fill in the details below</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Section: Basic Info - 3 Columns */}
                        <div className="space-y-4">


                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Customer */}
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Customer <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="customer"
                                        value={formData.customer}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition ${errors.customer ? "border-red-500" : "border-gray-300"
                                            }`}
                                    >
                                        <option value="">Select Customer</option>
                                        {CUSTOMERS.map((customer) => (
                                            <option key={customer.id} value={customer.id}>
                                                {customer.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.customer && (
                                        <p className="text-xs text-red-500 flex items-center gap-1">
                                            <AlertCircle size={12} /> {errors.customer}
                                        </p>
                                    )}
                                </div>

                                {/* Job/Project */}
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-gray-700">Job/Project</label>
                                    <select
                                        name="jobProject"
                                        value={formData.jobProject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                                    >
                                        <option value="">Select Project (Optional)</option>
                                        {PROJECTS.map((project) => (
                                            <option key={project.id} value={project.id}>
                                                {project.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Category */}
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition ${errors.category ? "border-red-500" : "border-gray-300"
                                            }`}
                                    >
                                        <option value="">Select Category</option>
                                        {CATEGORIES.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <p className="text-xs text-red-500 flex items-center gap-1">
                                            <AlertCircle size={12} /> {errors.category}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Section: Category & Title - 3 Columns */}
                        <div className="space-y-4">

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Sub Category */}
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Sub Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="subCategory"
                                        value={formData.subCategory}
                                        onChange={handleChange}
                                        disabled={!formData.category}
                                        className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed ${errors.subCategory ? "border-red-500" : "border-gray-300"
                                            }`}
                                    >
                                        <option value="">Select Sub Category</option>
                                        {subCategories.map((sub, index) => (
                                            <option key={index} value={sub}>
                                                {sub}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.subCategory && (
                                        <p className="text-xs text-red-500 flex items-center gap-1">
                                            <AlertCircle size={12} /> {errors.subCategory}
                                        </p>
                                    )}
                                </div>

                                {/* Title */}
                                <div className="space-y-1.5 ">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Ticket Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Enter a descriptive title"
                                        className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition ${errors.title ? "border-red-500" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.title && (
                                        <p className="text-xs text-red-500 flex items-center gap-1">
                                            <AlertCircle size={12} /> {errors.title}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5 ">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Tag size={14} />
                                        Tags <span className="text-gray-400 text-xs">(Select up to 5)</span>
                                    </label>
                                    <TagDropdown selectedTags={formData.tags} onTagToggle={handleTagToggle} maxTags={5} />
                                </div>
                            </div>

                            {/* Tags Dropdown - Full Width */}

                        </div>

                        {/* Section: Assignment - 3 Columns */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <Users size={16} />
                                Assignment
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Assign To */}
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Assign To <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="assignTo"
                                        value={formData.assignTo}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition ${errors.assignTo ? "border-red-500" : "border-gray-300"
                                            }`}
                                    >
                                        <option value="">Select Assignee</option>
                                        {STAFF.map((staff) => (
                                            <option key={staff.id} value={staff.id}>
                                                {staff.name} ({staff.role})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.assignTo && (
                                        <p className="text-xs text-red-500 flex items-center gap-1">
                                            <AlertCircle size={12} /> {errors.assignTo}
                                        </p>
                                    )}
                                </div>

                                {/* Co-Assign */}
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-gray-700">Co-Assign (Optional)</label>
                                    <select
                                        name="coAssign"
                                        value={formData.coAssign}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                                    >
                                        <option value="">Select Co-Assignee</option>
                                        {STAFF.filter((s) => s.id !== formData.assignTo).map((staff) => (
                                            <option key={staff.id} value={staff.id}>
                                                {staff.name} ({staff.role})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Visibility */}
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-gray-700">Visibility</label>
                                    <div className="flex gap-2">
                                        <label
                                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${formData.visibility === "public"
                                                    ? "bg-primary/10 border-primary text-primary"
                                                    : "bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-600"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="visibility"
                                                value="public"
                                                checked={formData.visibility === "public"}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <Eye size={16} />
                                            <span className="text-sm font-medium">Public</span>
                                        </label>
                                        <label
                                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${formData.visibility === "private"
                                                    ? "bg-primary/10 border-primary text-primary"
                                                    : "bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-600"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="visibility"
                                                value="private"
                                                checked={formData.visibility === "private"}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <EyeOff size={16} />
                                            <span className="text-sm font-medium">Private</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Status - Radio Buttons */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <Layers size={16} />
                                Status & Priority
                            </h3>

                            {/* Status Radio Buttons */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {STATUS_OPTIONS.map((option) => (
                                        <label
                                            key={option.value}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${formData.status === option.value
                                                    ? `${option.color} border-current`
                                                    : "bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-600"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="status"
                                                value={option.value}
                                                checked={formData.status === option.value}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <div
                                                className={`w-3 h-3 rounded-full border-2 ${formData.status === option.value
                                                        ? "bg-current border-current"
                                                        : "border-gray-400"
                                                    }`}
                                            />
                                            <span className="text-sm font-medium">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Priority Radio Buttons */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Priority <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {PRIORITY_OPTIONS.map((option) => (
                                        <label
                                            key={option.value}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${formData.priority === option.value
                                                    ? `${option.color} border-current`
                                                    : "bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-600"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="priority"
                                                value={option.value}
                                                checked={formData.priority === option.value}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <Flag
                                                size={16}
                                                className={formData.priority === option.value ? "" : "text-gray-400"}
                                            />
                                            <span className="text-sm font-medium">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Section: Description */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <FileText size={16} />
                                Ticket Details
                            </h3>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-gray-700">
                                    Description <span className="text-red-500">*</span>
                                    <span className="text-gray-400 text-xs ml-2">(Max 300 words)</span>
                                </label>
                                <div
                                    className={`border rounded-lg overflow-hidden ${errors.details ? "border-red-500" : "border-gray-300"
                                        }`}
                                >
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.details}
                                        onChange={handleEditorChange}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Describe the issue in detail..."
                                        className="bg-white ticket-editor"
                                    />
                                </div>
                                {errors.details && (
                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle size={12} /> {errors.details}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Section: Attachments */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <Upload size={16} />
                                Attachments
                            </h3>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Image Upload */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Photos
                                        <span className="text-gray-400 text-xs ml-2">
                                            ({formData.images.length}/10 - Max 5MB each)
                                        </span>
                                    </label>

                                    <div
                                        onClick={() => formData.images.length < 10 && imageInputRef.current?.click()}
                                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${formData.images.length >= 10
                                                ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                                                : "border-gray-300 hover:border-primary hover:bg-primary/5 cursor-pointer"
                                            }`}
                                    >
                                        <input
                                            ref={imageInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/gif,image/webp"
                                            multiple
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            disabled={formData.images.length >= 10}
                                        />
                                        <ImageIcon
                                            size={36}
                                            className={`mx-auto mb-2 ${formData.images.length >= 10 ? "text-gray-300" : "text-gray-400"
                                                }`}
                                        />
                                        <p className="text-sm text-gray-600">
                                            {formData.images.length >= 10 ? (
                                                "Maximum photos reached"
                                            ) : (
                                                <>
                                                    <span className="text-primary font-semibold">Click to upload</span> or drag
                                                </>
                                            )}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF, WebP up to 5MB</p>
                                    </div>

                                    {imagePreviews.length > 0 && (
                                        <div className="grid grid-cols-5 gap-2">
                                            {imagePreviews.map((preview, index) => (
                                                <div key={index} className="relative group aspect-square">
                                                    <img
                                                        src={preview}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-full object-cover rounded-lg border"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(index)}
                                                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Video Upload */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Video
                                        <span className="text-gray-400 text-xs ml-2">(Max 50MB)</span>
                                    </label>

                                    {!videoPreview ? (
                                        <div
                                            onClick={() => videoInputRef.current?.click()}
                                            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary hover:bg-primary/5 cursor-pointer transition-all"
                                        >
                                            <input
                                                ref={videoInputRef}
                                                type="file"
                                                accept="video/mp4,video/webm,video/ogg,video/quicktime"
                                                onChange={handleVideoUpload}
                                                className="hidden"
                                            />
                                            <Video size={36} className="mx-auto mb-2 text-gray-400" />
                                            <p className="text-sm text-gray-600">
                                                <span className="text-primary font-semibold">Click to upload</span> video
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">MP4, WebM, OGG up to 50MB</p>
                                        </div>
                                    ) : (
                                        <div className="relative rounded-xl overflow-hidden border bg-black">
                                            <video src={videoPreview} controls className="w-full max-h-[180px] object-contain" />
                                            <button
                                                type="button"
                                                onClick={handleRemoveVideo}
                                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}

                                    {errors.video && (
                                        <p className="text-xs text-red-500 flex items-center gap-1">
                                            <AlertCircle size={12} /> {errors.video}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Plus size={18} />
                                Create Ticket
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddTicketModal;