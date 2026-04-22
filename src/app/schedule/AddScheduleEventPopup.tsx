

import { useEffect, useMemo, useState } from "react";
import {
  X,
  Plus,
  Save,
  CalendarDays,
  Clock,
  MapPin,
  User,
  CheckCircle,
} from "lucide-react";

export type ScheduleEventStatus = "scheduled" | "in-progress" | "completed";

export interface ScheduleEventFormData {
  title: string;
  date: string;
  time: string; // input type="time" value e.g. 14:30
  technician: string;
  location: string;
  status: ScheduleEventStatus;
  notes?: string;
}

interface FormErrors {
  [key: string]: string;
}

interface AddScheduleEventPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ScheduleEventFormData, "time"> & { time: string }) => void;
  defaultDate?: string;
}

const statusOptions: {
  value: ScheduleEventStatus;
  label: string;
  bg: string;
  text: string;
  border: string;
}[] = [
  {
    value: "scheduled",
    label: "Scheduled",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  {
    value: "in-progress",
    label: "In Progress",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
  {
    value: "completed",
    label: "Completed",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
];

const statusBadgeStyles: Record<ScheduleEventStatus, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  "in-progress": "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-700",
};

const getInitialFormData = (defaultDate?: string): ScheduleEventFormData => ({
  title: "",
  date: defaultDate || new Date().toISOString().split("T")[0],
  time: "",
  technician: "",
  location: "",
  status: "scheduled",
  notes: "",
});

const formatTimeTo12Hour = (time24: string) => {
  if (!time24) return "";
  const [hourStr, minute] = time24.split(":");
  const hour = Number(hourStr);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${String(formattedHour).padStart(2, "0")}:${minute} ${ampm}`;
};

const FormField = ({
  label,
  required,
  error,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={className}>
    <label className="block text-xs font-medium text-gray-700 mb-1.5">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && (
      <p className="mt-1 text-xs text-red-500">
        {error}
      </p>
    )}
  </div>
);

const inputClass = (error?: string) =>
  `w-full h-10 px-3 border rounded-lg text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/30 ${
    error
      ? "border-red-400 bg-red-50 focus:border-red-400"
      : "border-gray-300 bg-white focus:border-primary"
  }`;

export default function AddScheduleEventPopup({
  isOpen,
  onClose,
  onSubmit,
  defaultDate,
}: AddScheduleEventPopupProps) {
  const [formData, setFormData] = useState<ScheduleEventFormData>(
    getInitialFormData(defaultDate)
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData(defaultDate));
      setErrors({});
    }
  }, [isOpen, defaultDate]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const updateField = (field: keyof ScheduleEventFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) newErrors.title = "Event title is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    if (!formData.technician.trim())
      newErrors.technician = "Technician name is required";
    if (!formData.location.trim())
      newErrors.location = "Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formattedTime = useMemo(
    () => formatTimeTo12Hour(formData.time),
    [formData.time]
  );

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    onSubmit({
      ...formData,
      time: formatTimeTo12Hour(formData.time),
    });

    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden mx-4 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Plus size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Add Event
              </h2>
              <p className="text-xs text-gray-500">
                Schedule a new job or appointment
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Event Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CalendarDays size={16} className="text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Event Details
                </h3>
                <p className="text-xs text-gray-500">
                  Fill in the schedule information
                </p>
              </div>
            </div>

            <FormField label="Event Title" required error={errors.title}>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Flooring Installation"
                className={inputClass(errors.title)}
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Date" required error={errors.date}>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateField("date", e.target.value)}
                  className={inputClass(errors.date)}
                />
              </FormField>

              <FormField label="Time" required error={errors.time}>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => updateField("time", e.target.value)}
                  className={inputClass(errors.time)}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Technician" required error={errors.technician}>
                <input
                  type="text"
                  value={formData.technician}
                  onChange={(e) => updateField("technician", e.target.value)}
                  placeholder="Mike Johnson"
                  className={inputClass(errors.technician)}
                />
              </FormField>

              <FormField label="Status">
                <select
                  value={formData.status}
                  onChange={(e) =>
                    updateField("status", e.target.value as ScheduleEventStatus)
                  }
                  className={inputClass()}
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <FormField label="Location" required error={errors.location}>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="123 Main St, Springfield"
                className={inputClass(errors.location)}
              />
            </FormField>

            <FormField label="Notes (Optional)">
              <textarea
                value={formData.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Add any extra instructions or notes..."
                rows={4}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none bg-white"
              />
            </FormField>
          </div>

          {/* Status Selector */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Quick Status Selection
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {statusOptions.map((status) => {
                const isActive = formData.status === status.value;

                return (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => updateField("status", status.value)}
                    className={`text-left rounded-xl border p-3 transition-all ${
                      isActive
                        ? `${status.bg} ${status.border} ring-2 ring-primary/20`
                        : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-medium ${
                          isActive ? status.text : "text-gray-700"
                        }`}
                      >
                        {status.label}
                      </span>
                      {isActive && (
                        <CheckCircle size={14} className="text-primary" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Event Preview
            </p>

            <div className="flex items-start justify-between gap-4 border rounded-lg p-4 bg-white">
              <div className="min-w-0">
                <p className="font-semibold text-gray-900">
                  {formData.title || "Event title"}
                </p>

                <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {formattedTime || "Select time"}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {formData.location || "Add location"}
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    {formData.technician || "Assign technician"}
                  </span>
                </div>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full font-semibold capitalize flex-shrink-0 ${statusBadgeStyles[formData.status]}`}
              >
                {formData.status.replace("-", " ")}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-white transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition shadow-sm disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={14} />
                Add Event
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}