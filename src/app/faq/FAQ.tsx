// pages/FAQ.tsx
import { useState, useRef, useEffect } from "react";
import {
    Plus,

    Download,

    Trash2,
    Edit3,
    ChevronLeft,
    ChevronRight,
    HelpCircle,
    RefreshCcw,
    ToggleLeft,
    ToggleRight,
    X,

} from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import AddFAQModal from "./AddFAQModal";

const stripHtml = (html: string): string => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
};


export type FAQStatus = "Active" | "Inactive";

export interface FAQ {
    id: number;
    category: string;
    subCategory: string;
    question: string;
    answer: string;
    status: FAQStatus;
    createdAt: Date;
    updatedAt: Date;
}

// ==================== SAMPLE DATA ====================
const FAQ_CATEGORIES = [
    {
        id: "1",
        name: "General",
        subCategories: ["About Us", "Contact", "Hours", "Location"]
    },
    {
        id: "2",
        name: "Services",
        subCategories: ["Plumbing", "Electrical", "HVAC", "Renovation"]
    },
    {
        id: "3",
        name: "Billing",
        subCategories: ["Payment Methods", "Invoices", "Refunds", "Pricing"]
    },
    {
        id: "4",
        name: "Support",
        subCategories: ["Technical Issues", "Account", "Complaints", "Feedback"]
    },
    {
        id: "5",
        name: "Scheduling",
        subCategories: ["Appointments", "Cancellation", "Rescheduling", "Availability"]
    },
];

const initialFAQs: FAQ[] = [
    {
        id: 1001,
        category: "General",
        subCategory: "About Us",
        question: "What services does your company provide?",
        answer: "We provide comprehensive home services including plumbing, electrical work, HVAC installation and repair, and general home renovation services. Our team of certified professionals is available 24/7 for emergency services.",
        status: "Active",
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-10"),
    },
    {
        id: 1002,
        category: "Billing",
        subCategory: "Payment Methods",
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, bank transfers, and cash payments. We also offer financing options for larger projects.",
        status: "Active",
        createdAt: new Date("2024-01-11"),
        updatedAt: new Date("2024-01-12"),
    },
    {
        id: 1003,
        category: "Services",
        subCategory: "Plumbing",
        question: "Do you offer emergency plumbing services?",
        answer: "Yes, we offer 24/7 emergency plumbing services. Our emergency response team can typically arrive within 1-2 hours of your call. Emergency service fees may apply outside of regular business hours.",
        status: "Active",
        createdAt: new Date("2024-01-12"),
        updatedAt: new Date("2024-01-12"),
    },
    {
        id: 1004,
        category: "Scheduling",
        subCategory: "Cancellation",
        question: "What is your cancellation policy?",
        answer: "You can cancel or reschedule your appointment up to 24 hours before the scheduled time without any charges. Cancellations made within 24 hours may incur a cancellation fee of $50.",
        status: "Inactive",
        createdAt: new Date("2024-01-13"),
        updatedAt: new Date("2024-01-15"),
    },
    {
        id: 1005,
        category: "Support",
        subCategory: "Account",
        question: "How do I create an account?",
        answer: "You can create an account by clicking the 'Sign Up' button on our homepage. Fill in your details including name, email, and phone number. You'll receive a confirmation email to verify your account.",
        status: "Active",
        createdAt: new Date("2024-01-14"),
        updatedAt: new Date("2024-01-14"),
    },
    {
        id: 1006,
        category: "Billing",
        subCategory: "Refunds",
        question: "What is your refund policy?",
        answer: "If you're not satisfied with our service, please contact us within 7 days. We offer a satisfaction guarantee and will work to resolve any issues. Refunds are processed within 5-7 business days.",
        status: "Active",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
    },
];

// ==================== STATUS STYLES ====================
const statusStyles: Record<FAQStatus, { bg: string; text: string; border: string }> = {
    "Active": { bg: "#DCFCE7", text: "#166534", border: "#22C55E" },
    "Inactive": { bg: "#FEE2E2", text: "#991B1B", border: "#EF4444" },
};

// ==================== FAQ TABLE COMPONENT ====================
export default function FAQPage() {
    const [faqs, setFaqs] = useState<FAQ[]>(initialFAQs);
    const [search, setSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<"all" | FAQStatus>("all");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedFAQs, setSelectedFAQs] = useState<Set<number>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
    const [expandedAnswers, setExpandedAnswers] = useState<Set<number>>(new Set());
    const [activeDropdown, setActiveDropdown] = useState<"status" | null>(null);
    const rowsPerPage = 10;

    const statusDropdownRef = useRef<HTMLDivElement>(null);

    // Check if any FAQs are selected
    const hasSelection = selectedFAQs.size > 0;

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter FAQs
    const filteredFAQs = faqs.filter((faq) => {
        const matchesSearch =
            faq.question.toLowerCase().includes(search.toLowerCase()) ||
            faq.answer.toLowerCase().includes(search.toLowerCase()) ||
            faq.category.toLowerCase().includes(search.toLowerCase()) ||
            faq.id.toString().includes(search);

        const matchesStatus = selectedStatus === "all" || faq.status === selectedStatus;
        const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    // Pagination
    const totalPages = Math.ceil(filteredFAQs.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedFAQs = filteredFAQs.slice(startIndex, startIndex + rowsPerPage);

    // Selection handlers
    const toggleSelect = (id: number) => {
        setSelectedFAQs((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const selectAll = () => {
        if (selectedFAQs.size === paginatedFAQs.length) {
            setSelectedFAQs(new Set());
        } else {
            setSelectedFAQs(new Set(paginatedFAQs.map((f) => f.id)));
        }
    };

    const clearSelection = () => {
        setSelectedFAQs(new Set());
    };

    // Status change handlers
    const handleStatusChange = (faqId: number, newStatus: FAQStatus) => {
        setFaqs((prev) =>
            prev.map((faq) =>
                faq.id === faqId ? { ...faq, status: newStatus, updatedAt: new Date() } : faq
            )
        );
    };

    const handleBulkStatusChange = (newStatus: FAQStatus) => {
        setFaqs((prev) =>
            prev.map((faq) =>
                selectedFAQs.has(faq.id) ? { ...faq, status: newStatus, updatedAt: new Date() } : faq
            )
        );
        setSelectedFAQs(new Set());
        setActiveDropdown(null);
    };

    // Delete handler
    const handleDelete = (faqId: number) => {
        if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
        setFaqs((prev) => prev.filter((faq) => faq.id !== faqId));
    };

    // Edit handler
    const handleEdit = (faq: FAQ) => {
        setEditingFAQ(faq);
        setIsModalOpen(true);
    };

    // Add/Update FAQ handler
    const handleSaveFAQ = (faqData: Omit<FAQ, "id" | "createdAt" | "updatedAt">) => {
        if (editingFAQ) {
            // Update existing FAQ
            setFaqs((prev) =>
                prev.map((faq) =>
                    faq.id === editingFAQ.id
                        ? { ...faq, ...faqData, updatedAt: new Date() }
                        : faq
                )
            );
        } else {
            // Add new FAQ
            const newFAQ: FAQ = {
                ...faqData,
                id: Math.max(...faqs.map((f) => f.id)) + 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            setFaqs((prev) => [newFAQ, ...prev]);
        }
        setIsModalOpen(false);
        setEditingFAQ(null);
    };

    // Toggle answer expansion
    const toggleAnswer = (faqId: number) => {
        setExpandedAnswers((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(faqId)) {
                newSet.delete(faqId);
            } else {
                newSet.add(faqId);
            }
            return newSet;
        });
    };

    // Status tabs
    const statusTabs: { id: "all" | FAQStatus; label: string; color: string }[] = [
        { id: "all", label: "All FAQs", color: "#6B7280" },
        { id: "Active", label: "Active", color: "#22C55E" },
        { id: "Inactive", label: "Inactive", color: "#EF4444" },
    ];

    // Format date
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(date);
    };

    return (
        <div className="p-4 md:p-4 space-y-6 min-h-screen ">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                        {/* <HelpCircle className="text-primary" size={32} /> */}
                        FAQ Management
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage frequently asked questions and answers
                    </p>
                </div>

                <button
                    onClick={() => {
                        setEditingFAQ(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition shadow-sm"
                >
                    <Plus size={20} />
                    Add FAQ
                </button>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {statusTabs.map((tab) => {
                    const count =
                        tab.id === "all"
                            ? faqs.length
                            : faqs.filter((f) => f.status === tab.id).length;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setSelectedStatus(tab.id);
                                setCurrentPage(1);
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${selectedStatus === tab.id
                                    ? "text-white bg-primary"
                                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                }`}

                        >

                            {tab.label}
                            <span
                                className={`px-2 py-0.5 rounded-full text-xs ${selectedStatus === tab.id
                                        ? "bg-white/20 text-white"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                            >
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-1 gap-3 w-full md:w-auto items-center">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[750px]">

                        <input
                            type="text"
                            placeholder="Search by ID, question, category..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>

                    {/* Category Filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2.5 border border-gray-300 max-w-[200px] rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary focus:outline-none "
                    >
                        <option value="all">All Categories</option>
                        {FAQ_CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                    {hasSelection && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg mr-2">
                            <span className="text-sm font-medium text-primary">
                                {selectedFAQs.size} selected
                            </span>
                            <button onClick={clearSelection} className="p-0.5 hover:bg-primary/20 rounded">
                                <X size={14} className="text-primary" />
                            </button>
                        </div>
                    )}

                    {/* Bulk Status Change */}
                    <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg px-2 py-1">
                        <div className="relative" ref={statusDropdownRef}>
                            {hasSelection ? (
                                <button
                                    onClick={() => setActiveDropdown(activeDropdown === "status" ? null : "status")}
                                    data-tooltip-id="faq-tooltip"
                                    data-tooltip-content="Change Status"
                                    className={`p-2 rounded transition-colors ${activeDropdown === "status"
                                            ? "bg-primary text-white"
                                            : "hover:bg-primary hover:text-white text-gray-700"
                                        }`}
                                >
                                    <RefreshCcw size={20} />
                                </button>
                            ) : (
                                <button
                                    data-tooltip-id="faq-tooltip-disabled"
                                    data-tooltip-content="Select FAQs to change status"
                                    className="p-2 rounded text-gray-400 cursor-not-allowed"
                                    disabled
                                >
                                    <RefreshCcw size={20} />
                                </button>
                            )}

                            {/* Status Dropdown */}
                            {activeDropdown === "status" && hasSelection && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-50 py-2">
                                    <div className="px-3 py-2 border-b">
                                        <p className="text-xs font-semibold text-gray-500 uppercase">Change Status</p>
                                    </div>
                                    <button
                                        onClick={() => handleBulkStatusChange("Active")}
                                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <ToggleRight size={16} className="text-green-600" />
                                        <span className="text-green-700 font-medium">Set Active</span>
                                    </button>
                                    <button
                                        onClick={() => handleBulkStatusChange("Inactive")}
                                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <ToggleLeft size={16} className="text-red-600" />
                                        <span className="text-red-700 font-medium">Set Inactive</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <button className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-primary bg-gray-200 font-semibold hover:bg-primary hover:text-white transition">
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left w-12">
                                    <input
                                        type="checkbox"
                                        checked={
                                            selectedFAQs.size === paginatedFAQs.length && paginatedFAQs.length > 0
                                        }
                                        onChange={selectAll}
                                        className="w-4 h-4 rounded border-gray-300 accent-primary cursor-pointer"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                                    QID
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                                    Category
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                                    Subcategory
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700 min-w-[250px]">
                                    Question
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700 min-w-[300px]">
                                    Answer
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-center font-semibold text-gray-700 whitespace-nowrap">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedFAQs.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                                        <HelpCircle size={48} className="mx-auto mb-3 opacity-50" />
                                        <p className="font-medium">No FAQs found</p>
                                        <p className="text-sm mt-1">Try adjusting your search or filters</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedFAQs.map((faq) => {
                                    const isExpanded = expandedAnswers.has(faq.id);
                                    // const truncatedAnswer =
                                        // faq.answer.length > 100 ? faq.answer.substring(0, 100) + "..." : faq.answer;

                                    return (
                                        <tr
                                            key={faq.id}
                                            className={`border-t hover:bg-primary/10 transition ${selectedFAQs.has(faq.id) ? "bg-blue-50" : ""
                                                }`}
                                        >
                                            {/* Checkbox */}
                                            <td className="px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFAQs.has(faq.id)}
                                                    onChange={() => toggleSelect(faq.id)}
                                                    className="w-4 h-4 rounded border-gray-300 accent-primary cursor-pointer"
                                                />
                                            </td>

                                            {/* QID */}
                                            <td className="px-4 py-4 min-w-[150px]">
                                                <span className="font-bold text-primary">QID-{faq.id}</span>
                                                <p className="text-xs text-gray-500 mt-0.5">{formatDate(faq.createdAt)}</p>
                                            </td>

                                            {/* Category */}
                                            <td className="px-4 py-4">
                                                <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                                                    {faq.category}
                                                </span>
                                            </td>

                                            {/* Subcategory */}
                                            <td className="px-4 py-4">
                                                <span className="text-gray-700 font-medium">{faq.subCategory}</span>
                                            </td>

                                            {/* Question */}
                                            <td className="px-4 py-4">
                                                <p className="font-medium text-gray-900 line-clamp-2">{faq.question}</p>
                                            </td>

                                      
                    

                                            {/* Answer */}
                                            <td className="px-4 py-4 max-w-[300px]">
                                                <div>
                                                    {isExpanded ? (
                                                        // Full HTML rendered answer
                                                        <div
                                                            className="prose prose-sm max-w-none text-gray-600 text-sm"
                                                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                                                        />
                                                    ) : (
                                                        // Truncated plain text preview
                                                        <p className="text-gray-600 text-sm line-clamp-2">
                                                            {stripHtml(faq.answer).substring(0, 100)}
                                                            {stripHtml(faq.answer).length > 100 ? "..." : ""}
                                                        </p>
                                                    )}
                                                    {stripHtml(faq.answer).length > 100 && (
                                                        <button
                                                            onClick={() => toggleAnswer(faq.id)}
                                                            className="text-primary text-xs font-semibold mt-1 hover:underline"
                                                        >
                                                            {isExpanded ? "Show less" : "Read more"}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            faq.id,
                                                            faq.status === "Active" ? "Inactive" : "Active"
                                                        )
                                                    }
                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:opacity-80`}
                                                    style={{
                                                        backgroundColor: statusStyles[faq.status].bg,
                                                        color: statusStyles[faq.status].text,
                                                    }}
                                                >
                                                    {faq.status === "Active" ? (
                                                        <ToggleRight size={14} />
                                                    ) : (
                                                        <ToggleLeft size={14} />
                                                    )}
                                                    {faq.status}
                                                </button>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={() => handleEdit(faq)}
                                                        data-tooltip-id="faq-tooltip"
                                                        data-tooltip-content="Edit FAQ"
                                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(faq.id)}
                                                        data-tooltip-id="faq-tooltip"
                                                        data-tooltip-content="Delete FAQ"
                                                        className="p-2 text-red-500  hover:bg-red-100 rounded-lg transition"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredFAQs.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t bg-gray-50 gap-3">
                        <p className="text-sm text-gray-600">
                            Showing <strong>{startIndex + 1}</strong> -{" "}
                            <strong>{Math.min(startIndex + rowsPerPage, filteredFAQs.length)}</strong> of{" "}
                            <strong>{filteredFAQs.length}</strong>
                        </p>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 text-sm rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                            >
                                First
                            </button>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-1.5 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="px-3 py-1.5 text-sm font-semibold">
                                {currentPage} / {totalPages}
                            </span>
                            <button 
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-1.5 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                            >
                                <ChevronRight size={16} />
                            </button>
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 text-sm rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                            >
                                Last
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add/Edit FAQ Modal */}
            <AddFAQModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingFAQ(null);
                }}
                onSubmit={handleSaveFAQ}
                editingFAQ={editingFAQ}
                categories={FAQ_CATEGORIES}
            />

            {/* Tooltips */}
            <Tooltip
                id="faq-tooltip"
                place="top"
                className="!bg-gray-800 !text-white !text-xs !px-2 !py-1 !rounded"
            />
            <Tooltip
                id="faq-tooltip-disabled"
                place="top"
                className="!bg-red-600 !text-white !text-xs !px-2 !py-1 !rounded"
            />
        </div>
    );
}