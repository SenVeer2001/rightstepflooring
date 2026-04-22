// components/subcontractor/AddSubcontractorForm.tsx
import { useState, useRef, useCallback } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  X,
  User,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  Hash,
  Building2,
  ChevronDown,
  Save,
  UserPlus,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
  Camera,
  Upload,
  Trash2,
  ImageIcon,
  Wrench,
  Shield,
  FileText,
  Plus,
  DollarSign,
  Globe,
} from "lucide-react";
import type {
  SubcontractorStatus,
  InsuranceStatus,
} from "../../types/subcontractor";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubcontractorFormData {
  // Personal / Company
  companyName: string;
  contactFirstName: string;
  contactLastName: string;
  email: string;
  phone: string;
  website: string;
  avatar?: string;

  // Trade & Service
  primaryTrade: string;
  additionalTrades: string[];
  serviceAreas: string[];
  hourlyRate: string;
  licenseNumber: string;

  // Address
  address: string;
  city: string;
  state: string;
  zipCode: string;

  // Insurance & Compliance
  status: SubcontractorStatus;
  insuranceStatus: InsuranceStatus;
  insuranceExpiry: string;
  insuranceProvider: string;
  policyNumber: string;
  w9Uploaded: boolean;
  notes: string;

  // Security
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  [key: string]: string;
}

interface AddSubcontractorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SubcontractorFormData) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const tradeOptions = [
  "Plumbing",
  "Electrical",
  "HVAC",
  "General Contractor",
  "Roofing",
  "Painting",
  "Carpentry",
  "Landscaping",
  "Flooring",
  "Masonry",
  "Welding",
  "Concrete",
  "Demolition",
  "Insulation",
  "Drywall",
];

const serviceAreaOptions = [
  "Downtown",
  "North Side",
  "South Side",
  "East Side",
  "West Side",
  "Suburbs",
  "Industrial District",
  "Waterfront",
  "Midtown",
  "Uptown",
];

const statusConfig: Record<
  SubcontractorStatus,
  { label: string; color: string; dot: string }
> = {
  active: { label: "Active", color: "text-green-700", dot: "bg-green-500" },
  inactive: { label: "Inactive", color: "text-gray-600", dot: "bg-gray-400" },
  locked: { label: "Locked", color: "text-red-700", dot: "bg-red-500" },
  pending: { label: "Pending", color: "text-yellow-700", dot: "bg-yellow-500" },
};

const insuranceOptions: { value: InsuranceStatus; label: string }[] = [
  { value: "valid", label: "Valid / Insured" },
  { value: "expiring_soon", label: "Expiring Soon" },
  { value: "expired", label: "Expired" },
  { value: "not_uploaded", label: "Not Uploaded" },
  { value: "pending", label: "Pending Review" },
];

const initialFormData: SubcontractorFormData = {
  companyName: "",
  contactFirstName: "",
  contactLastName: "",
  email: "",
  phone: "",
  website: "",
  avatar: undefined,
  primaryTrade: "",
  additionalTrades: [],
  serviceAreas: [],
  hourlyRate: "",
  licenseNumber: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  status: "pending",
  insuranceStatus: "not_uploaded",
  insuranceExpiry: "",
  insuranceProvider: "",
  policyNumber: "",
  w9Uploaded: false,
  notes: "",
  password: "",
  confirmPassword: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="p-2 bg-primary/10 rounded-lg">
      <Icon size={16} className="text-primary" />
    </div>
    <div>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  </div>
);

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
      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
        <AlertCircle size={10} />
        {error}
      </p>
    )}
  </div>
);

const PlainInput = ({
  error,
  className = "",
  ...props
}: {
  error?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full h-10 px-3 border rounded-lg text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/30 ${
      error
        ? "border-red-400 bg-red-50 focus:border-red-400"
        : "border-gray-300 bg-white focus:border-primary"
    } ${className}`}
  />
);

const PlainTextarea = ({
  error,
  className = "",
  ...props
}: {
  error?: string;
  className?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={`w-full px-3 py-2.5 border rounded-lg text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none ${
      error
        ? "border-red-400 bg-red-50 focus:border-red-400"
        : "border-gray-300 bg-white focus:border-primary"
    } ${className}`}
  />
);

// ─── Multi-Select Chip Component ──────────────────────────────────────────────

const MultiSelectChips = ({
  options,
  selected,
  onChange,
  placeholder,
  error,
}: {
  options: string[];
  selected: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
  error?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = options.filter(
    (o) =>
      !selected.includes(o) &&
      o.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = (item: string) => {
    onChange([...selected, item]);
    setSearchTerm("");
  };

  const handleRemove = (item: string) => {
    onChange(selected.filter((s) => s !== item));
  };

  return (
    <div className="relative" ref={ref}>
      {/* Selected Chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selected.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-lg"
            >
              {item}
              <button
                type="button"
                onClick={() => handleRemove(item)}
                className="hover:text-red-500 transition"
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        className={`flex items-center border rounded-lg transition cursor-pointer ${
          isOpen ? "ring-2 ring-primary/30 border-primary" : ""
        } ${
          error
            ? "border-red-400 bg-red-50"
            : "border-gray-300 bg-white hover:border-gray-400"
        }`}
        onClick={() => setIsOpen(true)}
      >
        {/* <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none">
          <Plus size={14} className="text-gray-400" />
        </div> */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder={selected.length === 0 ? placeholder : "Add more..."}
          className="w-full h-10 pl-10 pr-3 text-sm bg-transparent focus:outline-none"
        />
      </div>

      {/* Dropdown */}
      {isOpen && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-40 overflow-y-auto py-1">
          {filtered.map((item) => (
            <button
              key={item}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleAdd(item)}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Photo Upload ─────────────────────────────────────────────────────────────

const PhotoUpload = ({
  avatar,
  name,
  onAvatarChange,
}: {
  avatar: string | undefined;
  name: string;
  onAvatarChange: (base64: string | undefined) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const MAX_SIZE_MB = 5;

  const processFile = useCallback(
    (file: File) => {
      setUploadError("");
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setUploadError("Only JPG, PNG, WEBP, or GIF allowed.");
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setUploadError(`Max ${MAX_SIZE_MB}MB.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => onAvatarChange(e.target?.result as string);
      reader.readAsDataURL(file);
    },
    [onAvatarChange]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const initials =
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div
          className={`w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 transition-all ${
            isDragging ? "ring-4 ring-primary ring-offset-2 scale-105" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl font-bold text-white select-none">
              {initials}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md border-2 border-white hover:bg-primary/90 transition hover:scale-110"
        >
          <Camera size={14} className="text-white" />
        </button>
        {avatar && (
          <button
            type="button"
            onClick={() => {
              onAvatarChange(undefined);
              setUploadError("");
            }}
            className="absolute top-0 right-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-md border-2 border-white hover:bg-red-600 transition hover:scale-110"
          >
            <X size={10} className="text-white" />
          </button>
        )}
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <div
            className={`p-2 rounded-lg ${
              isDragging ? "bg-primary/10" : "bg-gray-100"
            }`}
          >
            {isDragging ? (
              <ImageIcon size={18} className="text-primary" />
            ) : (
              <Upload size={18} className="text-gray-400" />
            )}
          </div>
          <p className="text-xs font-medium text-gray-700">
            {isDragging ? (
              <span className="text-primary">Drop here</span>
            ) : (
              <>
                <span className="text-primary">Click to upload</span> or drag
              </>
            )}
          </p>
          <p className="text-[10px] text-gray-400">
            JPG, PNG, WEBP, GIF · Max {MAX_SIZE_MB}MB
          </p>
        </div>
      </div>

      {avatar && (
        <div className="flex items-center gap-2 w-full">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition"
          >
            <Camera size={12} /> Change
          </button>
          <button
            type="button"
            onClick={() => {
              onAvatarChange(undefined);
              setUploadError("");
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
          >
            <Trash2 size={12} /> Remove
          </button>
        </div>
      )}

      {uploadError && (
        <p className="text-xs text-red-500 flex items-center gap-1 self-start">
          <AlertCircle size={10} />
          {uploadError}
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) processFile(file);
          e.target.value = "";
        }}
        className="hidden"
      />
    </div>
  );
};

// ─── Steps ────────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Company", icon: Building2 },
  { id: 2, label: "Trade", icon: Wrench },
  { id: 3, label: "Address", icon: MapPin },
  { id: 4, label: "Insurance", icon: Shield },
  { id: 5, label: "Security", icon: Lock },
];

// ─── Phone Input Styles ───────────────────────────────────────────────────────

const phoneInputStyle: React.CSSProperties = {
  width: "100%",
  height: "40px",
  fontSize: "14px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  paddingLeft: "48px",
};
const phoneInputErrorStyle: React.CSSProperties = {
  ...phoneInputStyle,
  border: "1px solid #f87171",
  backgroundColor: "#fef2f2",
};
const phoneButtonStyle: React.CSSProperties = {
  borderRadius: "8px 0 0 8px",
  border: "1px solid #d1d5db",
  borderRight: "none",
  backgroundColor: "#f9fafb",
};
const phoneButtonErrorStyle: React.CSSProperties = {
  ...phoneButtonStyle,
  border: "1px solid #f87171",
  borderRight: "none",
};
const phoneDropdownStyle: React.CSSProperties = {
  borderRadius: "12px",
  boxShadow:
    "0 20px 25px -5px rgba(0,0,0,.1), 0 8px 10px -6px rgba(0,0,0,.1)",
  border: "1px solid #e5e7eb",
  marginTop: "4px",
};
const phoneSearchStyle: React.CSSProperties = {
  margin: "8px",
  width: "calc(100% - 16px)",
  height: "32px",
  fontSize: "13px",
  borderRadius: "6px",
  border: "1px solid #e5e7eb",
  padding: "0 8px",
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AddSubcontractorForm({
  isOpen,
  onClose,
  onSubmit,
}: AddSubcontractorFormProps) {
  const [formData, setFormData] =
    useState<SubcontractorFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // ── Handlers ────────────────────────────────────────────────────────────

  const updateField = (field: keyof SubcontractorFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep = (step: number): boolean => {
    const e: FormErrors = {};

    if (step === 1) {
      if (!formData.companyName.trim())
        e.companyName = "Company name is required";
      if (!formData.contactFirstName.trim())
        e.contactFirstName = "First name is required";
      if (!formData.contactLastName.trim())
        e.contactLastName = "Last name is required";
      if (!formData.email.trim()) {
        e.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        e.email = "Enter a valid email";
      }
      if (!formData.phone || formData.phone.length < 7) {
        e.phone = "Enter a valid phone number";
      }
    }

    if (step === 2) {
      if (!formData.primaryTrade) e.primaryTrade = "Select a primary trade";
      if (formData.serviceAreas.length === 0)
        e.serviceAreas = "Select at least one service area";
    }

    if (step === 4) {
      if (
        formData.insuranceStatus === "valid" ||
        formData.insuranceStatus === "expiring_soon"
      ) {
        if (!formData.insuranceExpiry)
          e.insuranceExpiry = "Expiry date is required";
        if (!formData.insuranceProvider.trim())
          e.insuranceProvider = "Provider is required";
        if (!formData.policyNumber.trim())
          e.policyNumber = "Policy number is required";
      }
    }

    if (step === 5) {
      if (!formData.password) {
        e.password = "Password is required";
      } else if (formData.password.length < 8) {
        e.password = "Min 8 characters";
      }
      if (!formData.confirmPassword) {
        e.confirmPassword = "Confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        e.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    setCurrentStep((s) => s - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    onSubmit(formData);
    setFormData(initialFormData);
    setCurrentStep(1);
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setErrors({});
    onClose();
  };

  // ── Password Strength ──────────────────────────────────────────────────

  const getPasswordStrength = (pw: string) => {
    if (!pw) return { score: 0, label: "", color: "" };
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    const l = [
      { score: 1, label: "Weak", color: "bg-red-500" },
      { score: 2, label: "Fair", color: "bg-yellow-500" },
      { score: 3, label: "Good", color: "bg-blue-500" },
      { score: 4, label: "Strong", color: "bg-green-500" },
    ];
    return l[s - 1] || { score: 0, label: "", color: "" };
  };
  const pwStrength = getPasswordStrength(formData.password);

  const displayName = formData.companyName || `${formData.contactFirstName} ${formData.contactLastName}`.trim() || "?";

  const showInsuranceFields =
    formData.insuranceStatus === "valid" ||
    formData.insuranceStatus === "expiring_soon";

  // ────────────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden mx-4 flex flex-col">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <UserPlus size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Add Subcontractor
              </h2>
              <p className="text-xs text-gray-500">
                Register a new subcontractor to your network
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* ── Steps ── */}
        <div className="px-6 py-4 border-b border-gray-100 flex-shrink-0 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[460px]">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const done = currentStep > step.id;
              const active = currentStep === step.id;
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        done
                          ? "bg-primary border-primary"
                          : active
                          ? "bg-white border-primary"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      {done ? (
                        <CheckCircle size={16} className="text-white" />
                      ) : (
                        <Icon
                          size={16}
                          className={
                            active ? "text-primary" : "text-gray-400"
                          }
                        />
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-medium mt-1 ${
                        active ? "text-primary" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 mb-4 transition-all duration-300 ${
                        currentStep > step.id ? "bg-primary" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* ═══ Step 1 – Company / Contact ═══ */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <SectionHeader
                icon={Building2}
                title="Company & Contact"
                subtitle="Basic information about the subcontractor"
              />

              {/* Photo */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                  Company Logo / Photo
                </p>
                <PhotoUpload
                  avatar={formData.avatar}
                  name={displayName}
                  onAvatarChange={(v) => updateField("avatar", v)}
                />
              </div>

              {/* Company Name */}
              <FormField
                label="Company Name"
                required
                error={errors.companyName}
              >
                <div className="relative flex items-center">
                  {/* <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none">
                    <Building2 size={14} className="text-gray-400" />
                  </div> */}
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) =>
                      updateField("companyName", e.target.value)
                    }
                    placeholder="Acme Plumbing LLC"
                    className={`w-full h-10 pl-10 pr-3 border rounded-lg text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                      errors.companyName
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300 bg-white focus:border-primary"
                    }`}
                  />
                </div>
              </FormField>

              {/* Contact Name */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Contact First Name"
                  required
                  error={errors.contactFirstName}
                >
                  <PlainInput
                    type="text"
                    value={formData.contactFirstName}
                    onChange={(e) =>
                      updateField("contactFirstName", e.target.value)
                    }
                    placeholder="John"
                    error={errors.contactFirstName}
                  />
                </FormField>
                <FormField
                  label="Contact Last Name"
                  required
                  error={errors.contactLastName}
                >
                  <PlainInput
                    type="text"
                    value={formData.contactLastName}
                    onChange={(e) =>
                      updateField("contactLastName", e.target.value)
                    }
                    placeholder="Doe"
                    error={errors.contactLastName}
                  />
                </FormField>
              </div>

              
              <FormField label="Email Address" required error={errors.email}>
                <div className="relative flex items-center">
                  {/* <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none z-10">
                    <Mail size={14} className="text-gray-400" />
                  </div> */}
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="contact@acmeplumbing.com"
                    className={`w-full h-10 pl-10 pr-3 border rounded-lg text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                      errors.email
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300 bg-white focus:border-primary"
                    }`}
                  />
                </div>
              </FormField>

             
              <FormField label="Phone Number" required error={errors.phone}>
                <PhoneInput
                  country={"us"}
                  value={formData.phone}
                  onChange={(v) => updateField("phone", v)}
                  enableSearch
                  searchPlaceholder="Search country..."
                  inputStyle={
                    errors.phone ? phoneInputErrorStyle : phoneInputStyle
                  }
                  buttonStyle={
                    errors.phone ? phoneButtonErrorStyle : phoneButtonStyle
                  }
                  dropdownStyle={phoneDropdownStyle}
                  searchStyle={phoneSearchStyle}
                  containerClass="phone-input-container"
                />
              </FormField>

              {/* Website */}
              <FormField label="Website (Optional)">
                <div className="relative flex items-center">
                  <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none">
                    <Globe size={14} className="text-gray-400" />
                  </div>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => updateField("website", e.target.value)}
                    placeholder="https://acmeplumbing.com"
                    className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  />
                </div>
              </FormField>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5">
              <SectionHeader
                icon={Wrench}
                title="Trade & Service Areas"
                subtitle="What services does this subcontractor provide?"
              />

              {/* Primary Trade */}
              <FormField
                label="Primary Trade"
                required
                error={errors.primaryTrade}
              >
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {tradeOptions.map((trade) => {
                    const isSelected = formData.primaryTrade === trade;
                    return (
                      <button
                        key={trade}
                        type="button"
                        onClick={() => updateField("primaryTrade", trade)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-left transition-all duration-200 ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <Wrench
                          size={12}
                          className={
                            isSelected ? "text-primary" : "text-gray-400"
                          }
                        />
                        <span
                          className={`text-xs font-medium truncate ${
                            isSelected ? "text-primary" : "text-gray-700"
                          }`}
                        >
                          {trade}
                        </span>
                        {isSelected && (
                          <CheckCircle
                            size={12}
                            className="text-primary ml-auto flex-shrink-0"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </FormField>

              {/* Additional Trades */}
              <FormField label="Additional Trades (Optional)">
                <MultiSelectChips
                  options={tradeOptions.filter(
                    (t) => t !== formData.primaryTrade
                  )}
                  selected={formData.additionalTrades}
                  onChange={(v) => updateField("additionalTrades", v)}
                  placeholder="Search and add trades..."
                />
              </FormField>

              {/* Service Areas */}
              <FormField
                label="Service Areas"
                required
                error={errors.serviceAreas}
              >
                <MultiSelectChips
                  options={serviceAreaOptions}
                  selected={formData.serviceAreas}
                  onChange={(v) => updateField("serviceAreas", v)}
                  placeholder="Search and add service areas..."
                  error={errors.serviceAreas}
                />
              </FormField>

              
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Hourly Rate (Optional)">
                  <div className="relative flex items-center">
                    {/* <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none">
                      <DollarSign size={14} className="text-gray-400" />
                    </div> */}
                    <input
                      type="number"
                      value={formData.hourlyRate}
                      onChange={(e) =>
                        updateField("hourlyRate", e.target.value)
                      }
                      placeholder="$75.00"
                      className="w-full h-10 pl-12 pr-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  </div>
                </FormField>

                <FormField label="License Number (Optional)">
                  <div className="relative flex items-center">
                    {/* <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none">
                      <Hash size={14} className="text-gray-400" />
                    </div> */}
                    <input
                      type="text"
                      value={formData.licenseNumber}
                      onChange={(e) =>
                        updateField("licenseNumber", e.target.value)
                      }
                      placeholder="#LIC-123456"
                      className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  </div>
                </FormField>
              </div>
            </div>
          )}

          {/* ═══ Step 3 – Address ═══ */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <SectionHeader
                icon={MapPin}
                title="Business Address"
                subtitle="Where is the subcontractor located?"
              />

              <FormField label="Street Address">
                <div className="relative flex items-center">
                  <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none">
                    <MapPin size={14} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    placeholder="456 Industrial Blvd"
                    className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  />
                </div>
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="City">
                  <PlainInput
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="New York"
                  />
                </FormField>
                <FormField label="State / Province">
                  <PlainInput
                    type="text"
                    value={formData.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    placeholder="NY"
                  />
                </FormField>
              </div>

              <FormField label="ZIP / Postal Code">
                <PlainInput
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => updateField("zipCode", e.target.value)}
                  placeholder="10001"
                  className="max-w-[200px]"
                />
              </FormField>

              {/* Preview Card */}
              {(formData.companyName ||
                formData.primaryTrade ||
                formData.serviceAreas.length > 0) && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                    Profile Preview
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600">
                      {formData.avatar ? (
                        <img
                          src={formData.avatar}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-base font-bold text-white">
                          {displayName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {formData.companyName || "Company Name"}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {formData.primaryTrade && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">
                            {formData.primaryTrade}
                          </span>
                        )}
                        {formData.serviceAreas.length > 0 && (
                          <span className="text-xs text-gray-500">
                            {formData.serviceAreas[0]}
                            {formData.serviceAreas.length > 1 &&
                              ` +${formData.serviceAreas.length - 1}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ Step 4 – Insurance & Compliance ═══ */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <SectionHeader
                icon={Shield}
                title="Insurance & Compliance"
                subtitle="Insurance and documentation details"
              />

              {/* Status */}
              <FormField label="Account Status">
                <div className="relative flex items-center">
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      updateField(
                        "status",
                        e.target.value as SubcontractorStatus
                      )
                    }
                    className="w-full h-10 pl-3 pr-10 border border-gray-300 rounded-lg text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  >
                    {(
                      Object.keys(statusConfig) as SubcontractorStatus[]
                    ).map((s) => (
                      <option key={s} value={s}>
                        {statusConfig[s].label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none">
                    <ChevronDown size={14} className="text-gray-400" />
                  </div>
                </div>
              </FormField>

              {/* Insurance Status */}
              <FormField label="Insurance Status">
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {insuranceOptions.map((opt) => {
                    const isSelected =
                      formData.insuranceStatus === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          updateField("insuranceStatus", opt.value)
                        }
                        className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-left transition-all duration-200 ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <Shield
                          size={12}
                          className={
                            isSelected ? "text-primary" : "text-gray-400"
                          }
                        />
                        <span
                          className={`text-xs font-medium ${
                            isSelected ? "text-primary" : "text-gray-700"
                          }`}
                        >
                          {opt.label}
                        </span>
                        {isSelected && (
                          <CheckCircle
                            size={12}
                            className="text-primary ml-auto"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </FormField>

              {/* Insurance Details (conditional) */}
              {showInsuranceFields && (
                <div className="p-4 bg-green-50 rounded-xl border border-green-100 space-y-4">
                  <p className="text-xs font-medium text-green-700 uppercase tracking-wide">
                    Insurance Details
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="Insurance Provider"
                      required
                      error={errors.insuranceProvider}
                    >
                      <PlainInput
                        type="text"
                        value={formData.insuranceProvider}
                        onChange={(e) =>
                          updateField("insuranceProvider", e.target.value)
                        }
                        placeholder="State Farm"
                        error={errors.insuranceProvider}
                      />
                    </FormField>
                    <FormField
                      label="Policy Number"
                      required
                      error={errors.policyNumber}
                    >
                      <PlainInput
                        type="text"
                        value={formData.policyNumber}
                        onChange={(e) =>
                          updateField("policyNumber", e.target.value)
                        }
                        placeholder="POL-123456"
                        error={errors.policyNumber}
                      />
                    </FormField>
                  </div>

                  <FormField
                    label="Expiry Date"
                    required
                    error={errors.insuranceExpiry}
                  >
                    <div className="relative flex items-center">
                      <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none">
                        <Calendar size={14} className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={formData.insuranceExpiry}
                        onChange={(e) =>
                          updateField("insuranceExpiry", e.target.value)
                        }
                        className={`w-full h-10 pl-10 pr-3 border rounded-lg text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                          errors.insuranceExpiry
                            ? "border-red-400 bg-red-50"
                            : "border-gray-300 bg-white focus:border-primary"
                        }`}
                      />
                    </div>
                  </FormField>
                </div>
              )}

              {/* W-9 Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-200 rounded-lg">
                    <FileText size={14} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      W-9 Form
                    </p>
                    <p className="text-xs text-gray-500">
                      Has the subcontractor submitted a W-9?
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateField("w9Uploaded", !formData.w9Uploaded)
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    formData.w9Uploaded ? "bg-primary" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      formData.w9Uploaded
                        ? "translate-x-[22px]"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Notes */}
              <FormField label="Notes (Optional)">
                <PlainTextarea
                  value={formData.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder="Any additional notes about this subcontractor..."
                  rows={3}
                />
              </FormField>
            </div>
          )}

          {/* ═══ Step 5 – Security ═══ */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <SectionHeader
                icon={Lock}
                title="Account Security"
                subtitle="Set up portal login credentials"
              />

              {/* Password */}
              <FormField label="Password" required error={errors.password}>
                <div className="relative flex items-center">
                  <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none">
                    <Lock size={14} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    placeholder="Minimum 8 characters"
                    className={`w-full h-10 pl-10 pr-10 border rounded-lg text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                      errors.password
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300 bg-white focus:border-primary"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? (
                      <EyeOff size={14} />
                    ) : (
                      <Eye size={14} />
                    )}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((l) => (
                        <div
                          key={l}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            l <= pwStrength.score
                              ? pwStrength.color
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Strength:{" "}
                      <span className="font-medium">{pwStrength.label}</span>
                    </p>
                  </div>
                )}
              </FormField>

              {/* Confirm */}
              <FormField
                label="Confirm Password"
                required
                error={errors.confirmPassword}
              >
                <div className="relative flex items-center">
                  <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none">
                    <Lock size={14} className="text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      updateField("confirmPassword", e.target.value)
                    }
                    placeholder="Re-enter password"
                    className={`w-full h-10 pl-10 pr-10 border rounded-lg text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                      errors.confirmPassword
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300 bg-white focus:border-primary"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center text-gray-400 hover:text-gray-600 transition"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={14} />
                    ) : (
                      <Eye size={14} />
                    )}
                  </button>
                </div>
              </FormField>

              {/* Requirements */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs font-medium text-blue-700 mb-2">
                  Password Requirements
                </p>
                <ul className="space-y-1">
                  {[
                    {
                      test: formData.password.length >= 8,
                      label: "At least 8 characters",
                    },
                    {
                      test: /[A-Z]/.test(formData.password),
                      label: "One uppercase letter",
                    },
                    {
                      test: /[0-9]/.test(formData.password),
                      label: "One number",
                    },
                    {
                      test: /[^A-Za-z0-9]/.test(formData.password),
                      label: "One special character",
                    },
                  ].map((r) => (
                    <li key={r.label} className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                          r.test ? "bg-green-500" : "bg-gray-200"
                        }`}
                      >
                        <CheckCircle size={10} className="text-white" />
                      </div>
                      <span
                        className={`text-xs ${
                          r.test ? "text-green-700" : "text-gray-500"
                        }`}
                      >
                        {r.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Summary */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                  Summary
                </p>
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600">
                    {formData.avatar ? (
                      <img
                        src={formData.avatar}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-white">
                        {displayName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {formData.companyName || "—"}
                    </p>
                    {formData.avatar && (
                      <p className="text-[10px] text-green-600 flex items-center gap-1">
                        <CheckCircle size={10} /> Photo uploaded
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5">
                  {[
                    {
                      label: "Contact",
                      value: `${formData.contactFirstName} ${formData.contactLastName}`,
                    },
                    { label: "Email", value: formData.email },
                    {
                      label: "Phone",
                      value: formData.phone ? `+${formData.phone}` : "—",
                    },
                    {
                      label: "Primary Trade",
                      value: formData.primaryTrade || "—",
                    },
                    {
                      label: "Service Areas",
                      value:
                        formData.serviceAreas.length > 0
                          ? formData.serviceAreas.join(", ")
                          : "—",
                    },
                    {
                      label: "Insurance",
                      value:
                        insuranceOptions.find(
                          (o) => o.value === formData.insuranceStatus
                        )?.label || "—",
                    },
                    {
                      label: "W-9",
                      value: formData.w9Uploaded
                        ? "✓ Submitted"
                        : "✗ Not submitted",
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-xs text-gray-500">
                        {item.label}
                      </span>
                      <span className="text-xs font-medium text-gray-900 text-right max-w-[60%] truncate">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <span className="text-xs text-gray-400">
            Step {currentStep} of {STEPS.length}
          </span>
          {currentStep < STEPS.length ? (
            <button
              onClick={handleNext}
              className="px-5 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition shadow-sm"
            >
              Continue
            </button>
          ) : (
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
                  <Save size={14} /> Add Subcontractor
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Phone input theme overrides */}
      <style>{`
        .phone-input-container { width: 100% !important; }
        .phone-input-container .form-control { font-family: inherit !important; }
        .phone-input-container .form-control:focus {
          border-color: var(--color-primary, #6366f1) !important;
          box-shadow: 0 0 0 2px rgba(99,102,241,.15) !important;
        }
        .phone-input-container .selected-flag { padding: 0 8px !important; }
        .phone-input-container .selected-flag:hover,
        .phone-input-container .selected-flag:focus,
        .phone-input-container .selected-flag.open { background-color: #f3f4f6 !important; }
        .phone-input-container .country-list {
          max-height: 220px !important; border-radius: 12px !important;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,.1), 0 8px 10px -6px rgba(0,0,0,.1) !important;
          border: 1px solid #e5e7eb !important; margin-top: 4px !important;
        }
        .phone-input-container .country-list .country {
          padding: 8px 12px !important; font-size: 13px !important;
        }
        .phone-input-container .country-list .country:hover { background-color: #f9fafb !important; }
        .phone-input-container .country-list .country.highlight {
          background-color: rgba(99,102,241,.06) !important;
        }
        .phone-input-container .country-list .search { padding: 8px !important; position: sticky !important; top: 0 !important; background: white !important; z-index: 1 !important; }
        .phone-input-container .country-list .search-box {
          width: 100% !important; height: 32px !important; font-size: 13px !important;
          border-radius: 6px !important; border: 1px solid #e5e7eb !important;
          padding: 0 8px !important; margin: 0 !important; box-sizing: border-box !important;
        }
        .phone-input-container .country-list .search-box:focus {
          border-color: var(--color-primary, #6366f1) !important; outline: none !important;
          box-shadow: 0 0 0 2px rgba(99,102,241,.15) !important;
        }
        .phone-input-container .flag-dropdown { border-radius: 8px 0 0 8px !important; }
      `}</style>
    </div>
  );
}