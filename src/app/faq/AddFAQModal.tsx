// components/faq/AddFAQModal.tsx
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  X,
  Plus,
  AlertCircle,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  Save,
} from "lucide-react";
import type { FAQ, FAQStatus } from "./FAQ";


interface AddFAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<FAQ, "id" | "createdAt" | "updatedAt">) => void;
  editingFAQ: FAQ | null;
  categories: { id: string; name: string; subCategories: string[] }[];
}

// Quill editor modules configuration
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "align",
  "link",
];

const AddFAQModal: React.FC<AddFAQModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingFAQ,
  categories,
}) => {
  const [formData, setFormData] = useState({
    category: "",
    subCategory: "",
    question: "",
    answer: "",
    status: "Active" as FAQStatus,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get subcategories based on selected category
  const selectedCategory = categories.find((c) => c.name === formData.category);
  const subCategories = selectedCategory?.subCategories || [];

  // Populate form when editing
  useEffect(() => {
    if (editingFAQ) {
      setFormData({
        category: editingFAQ.category,
        subCategory: editingFAQ.subCategory,
        question: editingFAQ.question,
        answer: editingFAQ.answer,
        status: editingFAQ.status,
      });
    } else {
      setFormData({
        category: "",
        subCategory: "",
        question: "",
        answer: "",
        status: "Active",
      });
    }
    setErrors({});
  }, [editingFAQ, isOpen]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Reset subcategory when category changes
    if (name === "category") {
      setFormData((prev) => ({ ...prev, subCategory: "" }));
    }
  };

  // Handle Quill editor change
  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({ ...prev, answer: content }));
    
    if (errors.answer) {
      setErrors((prev) => ({ ...prev, answer: "" }));
    }
  };

  // Get plain text from HTML for validation and character count
  const getPlainText = (html: string): string => {
    return html.replace(/<[^>]*>/g, "").trim();
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.subCategory) newErrors.subCategory = "Subcategory is required";
    if (!formData.question.trim()) newErrors.question = "Question is required";
    
    const answerText = getPlainText(formData.answer);
    if (!answerText) {
      newErrors.answer = "Answer is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error("Error saving FAQ:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle close
  const handleClose = () => {
    setFormData({
      category: "",
      subCategory: "",
      question: "",
      answer: "",
      status: "Active",
    });
    setErrors({});
    onClose();
  };

  // Close on escape
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

  const answerCharCount = getPlainText(formData.answer).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[95vh] mx-4 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-primary to-primary/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <HelpCircle size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {editingFAQ ? "Edit FAQ" : "Add New FAQ"}
              </h2>
              <p className="text-sm text-white/80">
                {editingFAQ ? "Update the FAQ details" : "Create a new frequently asked question"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Category & Subcategory - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  FAQ Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.category}
                  </p>
                )}
              </div>

              {/* Subcategory */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Subcategory <span className="text-red-500">*</span>
                </label>
                <select
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  disabled={!formData.category}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.subCategory ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Subcategory</option>
                  {subCategories.map((sub, idx) => (
                    <option key={idx} value={sub}>
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
            </div>

            {/* Question */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Question <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="question"
                value={formData.question}
                onChange={handleChange}
                placeholder="Enter the frequently asked question"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition ${
                  errors.question ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.question && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.question}
                </p>
              )}
            </div>

            {/* Answer - Quill Editor */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Answer <span className="text-red-500">*</span>
              </label>
              <div
                className={`border rounded-lg overflow-hidden ${
                  errors.answer ? "border-red-500" : "border-gray-300"
                }`}
              >
                <ReactQuill
                  theme="snow"
                  value={formData.answer}
                  onChange={handleEditorChange}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Enter the detailed answer..."
                  className="faq-editor"
                />
              </div>
              {errors.answer && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.answer}
                </p>
              )}
              <p className="text-xs text-gray-400">
                {answerCharCount} characters
              </p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <div className="flex gap-4">
                <label
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.status === "Active"
                      ? "bg-green-50 border-green-500 text-green-700"
                      : "bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value="Active"
                    checked={formData.status === "Active"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <ToggleRight size={18} />
                  <span className="text-sm font-medium">Active</span>
                </label>
                <label
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.status === "Inactive"
                      ? "bg-red-50 border-red-500 text-red-700"
                      : "bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value="Inactive"
                    checked={formData.status === "Inactive"}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <ToggleLeft size={18} />
                  <span className="text-sm font-medium">Inactive</span>
                </label>
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
                {editingFAQ ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                {editingFAQ ? <Save size={18} /> : <Plus size={18} />}
                {editingFAQ ? "Update FAQ" : "Create FAQ"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFAQModal;