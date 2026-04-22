// components/staff/AddStaffForm.tsx
import { useState, useRef, useCallback } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  Calendar,
  TrendingUp,
  Users,
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
} from "lucide-react";
import type { StaffRole, StaffStatus } from "../../types/staff";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StaffFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: StaffRole | "";
  department: string;
  status: StaffStatus;
  employeeId: string;
  hireDate: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  notes: string;
  password: string;
  confirmPassword: string;
  avatar?: string;
}

interface FormErrors {
  [key: string]: string;
}

interface AddStaffFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StaffFormData) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const roleConfig: Record<
  StaffRole,
  {
    label: string;
    color: string;
    bg: string;
    icon: React.ElementType;
    gradient: string;
  }
> = {
  admin: {
    label: "Admin",
    color: "text-purple-700",
    bg: "bg-purple-100",
    icon: Award,
    gradient: "from-purple-500 to-purple-600",
  },
  manager: {
    label: "Manager",
    color: "text-blue-700",
    bg: "bg-blue-100",
    icon: Briefcase,
    gradient: "from-blue-500 to-blue-600",
  },
  technician: {
    label: "Technician",
    color: "text-green-700",
    bg: "bg-green-100",
    icon: Users,
    gradient: "from-green-500 to-green-600",
  },
  dispatcher: {
    label: "Dispatcher",
    color: "text-orange-700",
    bg: "bg-orange-100",
    icon: MapPin,
    gradient: "from-orange-500 to-orange-600",
  },
  sales: {
    label: "Sales",
    color: "text-pink-700",
    bg: "bg-pink-100",
    icon: TrendingUp,
    gradient: "from-pink-500 to-pink-600",
  },
  support: {
    label: "Support",
    color: "text-cyan-700",
    bg: "bg-cyan-100",
    icon: Users,
    gradient: "from-cyan-500 to-cyan-600",
  },
  accounting: {
    label: "Accounting",
    color: "text-emerald-700",
    bg: "bg-emerald-100",
    icon: Calendar,
    gradient: "from-emerald-500 to-emerald-600",
  },
};

const statusConfig: Record<
  StaffStatus,
  { label: string; color: string; dot: string }
> = {
  active: { label: "Active", color: "text-green-700", dot: "bg-green-500" },
  inactive: { label: "Inactive", color: "text-gray-600", dot: "bg-gray-400" },
  on_leave: {
    label: "On Leave",
    color: "text-yellow-700",
    dot: "bg-yellow-500",
  },
  terminated: {
    label: "Terminated",
    color: "text-red-700",
    dot: "bg-red-500",
  },
};

const departmentOptions = [
  "Field Operations",
  "Operations",
  "Sales",
  "Customer Service",
  "Administration",
  "Finance",
];

const initialFormData: StaffFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "",
  department: "",
  status: "active",
  employeeId: "",
  hireDate: new Date().toISOString().split("T")[0],
  address: "",
  city: "",
  state: "",
  zipCode: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  notes: "",
  password: "",
  confirmPassword: "",
  avatar: undefined,
};

// ─── Helper Components ────────────────────────────────────────────────────────

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

// ─── Photo Upload Component ───────────────────────────────────────────────────

interface PhotoUploadProps {
  avatar: string | undefined;
  firstName: string;
  lastName: string;
  roleGradient?: string;
  onAvatarChange: (base64: string | undefined) => void;
  error?: string;
}

const PhotoUpload = ({
  avatar,
  firstName,
  lastName,
  roleGradient,
  onAvatarChange,
  error,
}: PhotoUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");

  const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const MAX_SIZE_MB = 5;

  const processFile = useCallback(
    (file: File) => {
      setUploadError("");
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setUploadError("Only JPG, PNG, WEBP, or GIF files are allowed.");
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setUploadError(`File must be smaller than ${MAX_SIZE_MB}MB.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onAvatarChange(result);
      };
      reader.readAsDataURL(file);
    },
    [onAvatarChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

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

  const handleRemove = () => {
    onAvatarChange(undefined);
    setUploadError("");
  };

  const initials =
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "?";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <div
          className={`w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden flex items-center justify-center transition-all duration-200 ${
            isDragging ? "ring-4 ring-primary ring-offset-2 scale-105" : ""
          } ${
            roleGradient
              ? `bg-gradient-to-br ${roleGradient}`
              : "bg-gradient-to-br from-gray-300 to-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {avatar ? (
            <img src={avatar} alt="Staff avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-white select-none">{initials}</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md border-2 border-white hover:bg-primary/90 transition-all duration-200 hover:scale-110"
        >
          <Camera size={14} className="text-white" />
        </button>
        {avatar && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-0 right-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-md border-2 border-white hover:bg-red-600 transition-all duration-200 hover:scale-110"
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
        className={`w-full border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <div className={`p-2 rounded-lg transition-colors ${isDragging ? "bg-primary/10" : "bg-gray-100"}`}>
            {isDragging ? <ImageIcon size={18} className="text-primary" /> : <Upload size={18} className="text-gray-400" />}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-700">
              {isDragging ? (
                <span className="text-primary">Drop photo here</span>
              ) : (
                <>
                  <span className="text-primary">Click to upload</span> or drag & drop
                </>
              )}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG, WEBP, GIF · Max {MAX_SIZE_MB}MB</p>
          </div>
        </div>
      </div>

      {avatar && (
        <div className="flex items-center gap-2 w-full">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition"
          >
            <Camera size={12} /> Change Photo
          </button>
          <button
            type="button"
            onClick={handleRemove}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
          >
            <Trash2 size={12} /> Remove
          </button>
        </div>
      )}

      {(uploadError || error) && (
        <p className="text-xs text-red-500 flex items-center gap-1 self-start">
          <AlertCircle size={10} />
          {uploadError || error}
        </p>
      )}

      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFileChange} className="hidden" />
    </div>
  );
};

// ─── Steps Config ─────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Personal", icon: User },
  { id: 2, label: "Role", icon: Briefcase },
  { id: 3, label: "Address", icon: MapPin },
  { id: 4, label: "Security", icon: Lock },
];

// ─── Phone Input Custom Styles ────────────────────────────────────────────────

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
  boxShadow: "0 20px 25px -5px rgba(0,0,0,.1), 0 8px 10px -6px rgba(0,0,0,.1)",
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

export default function AddStaffForm({ isOpen, onClose, onSubmit }: AddStaffFormProps) {
  const [formData, setFormData] = useState<StaffFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const updateField = (field: keyof StaffFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleAvatarChange = (base64: string | undefined) => {
    setFormData((prev) => ({ ...prev, avatar: base64 }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Enter a valid email address";
      }
      if (!formData.phone || formData.phone.length < 7) {
        newErrors.phone = "Enter a valid phone number";
      }
    }

    if (step === 2) {
      if (!formData.role) newErrors.role = "Please select a role";
      if (!formData.department) newErrors.department = "Department is required";
      if (!formData.employeeId.trim()) newErrors.employeeId = "Employee ID is required";
      if (!formData.hireDate) newErrors.hireDate = "Hire date is required";
    }

    if (step === 4) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const levels = [
      { score: 1, label: "Weak", color: "bg-red-500" },
      { score: 2, label: "Fair", color: "bg-yellow-500" },
      { score: 3, label: "Good", color: "bg-blue-500" },
      { score: 4, label: "Strong", color: "bg-green-500" },
    ];
    return levels[score - 1] || { score: 0, label: "", color: "" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const selectedRoleConfig =
    formData.role && formData.role in roleConfig ? roleConfig[formData.role as StaffRole] : null;

  // Format phone for display in summary
  const formatPhoneDisplay = (phone: string) => {
    if (!phone) return "—";
    return `+${phone}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden mx-4 flex flex-col">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <UserPlus size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Add Staff Member</h2>
              <p className="text-xs text-gray-500">Fill in the details to create a new staff profile</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* ── Step Indicator ── */}
        <div className="px-10 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isActive = currentStep === step.id;
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isCompleted
                          ? "bg-primary border-primary"
                          : isActive
                          ? "bg-white border-primary"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle size={16} className="text-white" />
                      ) : (
                        <Icon size={16} className={isActive ? "text-primary" : "text-gray-400"} />
                      )}
                    </div>
                    <span className={`text-[10px] font-medium mt-1 ${isActive ? "text-primary" : "text-gray-400"}`}>
                      {step.label}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
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

        {/* ── Form Content ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* ═══ Step 1 ═══ */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <SectionHeader icon={User} title="Personal Information" subtitle="Basic details about the staff member" />

              {/* Photo */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Profile Photo</p>
                <PhotoUpload
                  avatar={formData.avatar}
                  firstName={formData.firstName}
                  lastName={formData.lastName}
                  roleGradient={selectedRoleConfig?.gradient}
                  onAvatarChange={handleAvatarChange}
                />
              </div>

              {/* Names */}
              <div className="grid grid-cols-2 gap-4">
                <FormField label="First Name" required error={errors.firstName}>
                  <PlainInput
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    placeholder="John"
                    error={errors.firstName}
                  />
                </FormField>
                <FormField label="Last Name" required error={errors.lastName}>
                  <PlainInput
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    placeholder="Smith"
                    error={errors.lastName}
                  />
                </FormField>
              </div>

              {/* Email */}
              <FormField label="Email Address" required error={errors.email}>
                <div className="relative flex items-center ">
                  {/* <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none z-10">
                    <Mail size={14} className="text-gray-400" />
                  </div> */}
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="john.smith@company.com"
                    className={`w-full h-10 pl-10 pr-3 border rounded-lg text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                      errors.email
                        ? "border-red-400 bg-red-50 focus:border-red-400"
                        : "border-gray-300 bg-white focus:border-primary"
                    }`}
                  />
                </div>
              </FormField>

              {/* Phone – react-phone-input-2 */}
              <FormField label="Phone Number" required error={errors.phone}>
                <PhoneInput
                  country={"us"}
                  value={formData.phone}
                  onChange={(value) => updateField("phone", value)}
                  enableSearch
                  searchPlaceholder="Search country..."
                  inputStyle={errors.phone ? phoneInputErrorStyle : phoneInputStyle}
                  buttonStyle={errors.phone ? phoneButtonErrorStyle : phoneButtonStyle}
                  dropdownStyle={phoneDropdownStyle}
                  searchStyle={phoneSearchStyle}
                  containerClass="phone-input-container"
                  inputClass="phone-input-field"
                  buttonClass="phone-input-button"
                />
              </FormField>

              {/* Emergency Contact */}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                  Emergency Contact (Optional)
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Contact Name">
                    <PlainInput
                      type="text"
                      value={formData.emergencyContactName}
                      onChange={(e) => updateField("emergencyContactName", e.target.value)}
                      placeholder="Jane Smith"
                    />
                  </FormField>
                  <FormField label="Contact Phone">
                    <PlainInput
                      type="tel"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => updateField("emergencyContactPhone", e.target.value)}
                      placeholder="+1 (555) 000-0000"
                    />
                  </FormField>
                </div>
              </div>
            </div>
          )}

          {/* ═══ Step 2 ═══ */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <SectionHeader icon={Briefcase} title="Role & Department" subtitle="Define the staff member's position" />

              <FormField label="Role" required error={errors.role}>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {(Object.keys(roleConfig) as StaffRole[]).map((role) => {
                    const config = roleConfig[role];
                    const Icon = config.icon;
                    const isSelected = formData.role === role;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => updateField("role", role)}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${isSelected ? config.bg : "bg-gray-100"}`}>
                          <Icon size={14} className={isSelected ? config.color : "text-gray-500"} />
                        </div>
                        <span className={`text-sm font-medium ${isSelected ? "text-primary" : "text-gray-700"}`}>
                          {config.label}
                        </span>
                        {isSelected && <CheckCircle size={14} className="text-primary ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Department" required error={errors.department}>
                  <div className="relative flex items-center">
                    <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none">
                      <Building2 size={14} className="text-gray-400" />
                    </div>
                    <select
                      value={formData.department}
                      onChange={(e) => updateField("department", e.target.value)}
                      className={`w-full h-10 pl-10 pr-10 border rounded-lg text-sm transition appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                        errors.department
                          ? "border-red-400 bg-red-50 focus:border-red-400"
                          : "border-gray-300 bg-white focus:border-primary"
                      }`}
                    >
                      <option value="">Select department</option>
                      {departmentOptions.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    <div className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none">
                      <ChevronDown size={14} className="text-gray-400" />
                    </div>
                  </div>
                </FormField>

                <FormField label="Employee ID" required error={errors.employeeId}>
                  <div className="relative flex items-center">
                    <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none">
                      <Hash size={14} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.employeeId}
                      onChange={(e) => updateField("employeeId", e.target.value)}
                      placeholder="EMP-001"
                      className={`w-full h-10 pl-10 pr-3 border rounded-lg text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                        errors.employeeId
                          ? "border-red-400 bg-red-50 focus:border-red-400"
                          : "border-gray-300 bg-white focus:border-primary"
                      }`}
                    />
                  </div>
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Hire Date" required error={errors.hireDate}>
                  <div className="relative flex items-center">
                    <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none">
                      <Calendar size={14} className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      value={formData.hireDate}
                      onChange={(e) => updateField("hireDate", e.target.value)}
                      className={`w-full h-10 pl-10 pr-3 border rounded-lg text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                        errors.hireDate
                          ? "border-red-400 bg-red-50 focus:border-red-400"
                          : "border-gray-300 bg-white focus:border-primary"
                      }`}
                    />
                  </div>
                </FormField>

                <FormField label="Status">
                  <div className="relative flex items-center">
                    <select
                      value={formData.status}
                      onChange={(e) => updateField("status", e.target.value as StaffStatus)}
                      className="w-full h-10 pl-3 pr-10 border border-gray-300 rounded-lg text-sm transition appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    >
                      {(Object.keys(statusConfig) as StaffStatus[]).map((status) => (
                        <option key={status} value={status}>{statusConfig[status].label}</option>
                      ))}
                    </select>
                    <div className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none">
                      <ChevronDown size={14} className="text-gray-400" />
                    </div>
                  </div>
                </FormField>
              </div>

              <FormField label="Notes (Optional)">
                <PlainTextarea
                  value={formData.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder="Any additional information about this staff member..."
                  rows={3}
                />
              </FormField>
            </div>
          )}

          {/* ═══ Step 3 ═══ */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <SectionHeader icon={MapPin} title="Address Information" subtitle="Where is the staff member located? (Optional)" />

              <FormField label="Street Address">
                <div className="relative flex items-center">
                  <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none">
                    <MapPin size={14} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    placeholder="123 Main Street"
                    className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-lg text-sm transition bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="City">
                  <PlainInput type="text" value={formData.city} onChange={(e) => updateField("city", e.target.value)} placeholder="New York" />
                </FormField>
                <FormField label="State / Province">
                  <PlainInput type="text" value={formData.state} onChange={(e) => updateField("state", e.target.value)} placeholder="NY" />
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

              {(formData.firstName || formData.role || formData.department) && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Profile Preview</p>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 ${
                        selectedRoleConfig
                          ? `bg-gradient-to-br ${selectedRoleConfig.gradient}`
                          : "bg-gradient-to-br from-gray-300 to-gray-400"
                      }`}
                    >
                      {formData.avatar ? (
                        <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-base font-bold text-white">
                          {formData.firstName?.[0]?.toUpperCase() || "?"}{formData.lastName?.[0]?.toUpperCase() || ""}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {formData.firstName || "First"} {formData.lastName || "Last"}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {formData.role && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${selectedRoleConfig?.bg} ${selectedRoleConfig?.color}`}>
                            {selectedRoleConfig?.label}
                          </span>
                        )}
                        {formData.department && <span className="text-xs text-gray-500">{formData.department}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ Step 4 ═══ */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <SectionHeader icon={Lock} title="Account Security" subtitle="Set up login credentials for this staff member" />

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
                      errors.password ? "border-red-400 bg-red-50 focus:border-red-400" : "border-gray-300 bg-white focus:border-primary"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            level <= passwordStrength.score ? passwordStrength.color : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Strength: <span className="font-medium">{passwordStrength.label}</span>
                    </p>
                  </div>
                )}
              </FormField>

              <FormField label="Confirm Password" required error={errors.confirmPassword}>
                <div className="relative flex items-center">
                  <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none">
                    <Lock size={14} className="text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                    placeholder="Re-enter password"
                    className={`w-full h-10 pl-10 pr-10 border rounded-lg text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                      errors.confirmPassword ? "border-red-400 bg-red-50 focus:border-red-400" : "border-gray-300 bg-white focus:border-primary"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center text-gray-400 hover:text-gray-600 transition"
                  >
                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </FormField>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs font-medium text-blue-700 mb-2">Password Requirements</p>
                <ul className="space-y-1">
                  {[
                    { test: formData.password.length >= 8, label: "At least 8 characters" },
                    { test: /[A-Z]/.test(formData.password), label: "One uppercase letter" },
                    { test: /[0-9]/.test(formData.password), label: "One number" },
                    { test: /[^A-Za-z0-9]/.test(formData.password), label: "One special character" },
                  ].map((req) => (
                    <li key={req.label} className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                          req.test ? "bg-green-500" : "bg-gray-200"
                        }`}
                      >
                        <CheckCircle size={10} className="text-white" />
                      </div>
                      <span className={`text-xs ${req.test ? "text-green-700" : "text-gray-500"}`}>{req.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Summary */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Summary</p>
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200">
                  <div
                    className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 ${
                      selectedRoleConfig
                        ? `bg-gradient-to-br ${selectedRoleConfig.gradient}`
                        : "bg-gradient-to-br from-gray-300 to-gray-400"
                    }`}
                  >
                    {formData.avatar ? (
                      <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-white">
                        {formData.firstName?.[0]?.toUpperCase() || "?"}{formData.lastName?.[0]?.toUpperCase() || ""}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {formData.firstName} {formData.lastName}
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
                    { label: "Email", value: formData.email },
                    { label: "Phone", value: formatPhoneDisplay(formData.phone) },
                    { label: "Role", value: selectedRoleConfig?.label || "—" },
                    { label: "Department", value: formData.department || "—" },
                    { label: "Employee ID", value: formData.employeeId || "—" },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-xs text-gray-500">{item.label}</span>
                      <span className="text-xs font-medium text-gray-900">{item.value}</span>
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
          <span className="text-xs text-gray-400">Step {currentStep} of {STEPS.length}</span>
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
                  <Save size={14} /> Add Staff Member
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ── Custom CSS for react-phone-input-2 to match theme ── */}
      <style>{`
        .phone-input-container {
          width: 100% !important;
        }
        .phone-input-container .form-control {
          font-family: inherit !important;
        }
        .phone-input-container .form-control:focus {
          border-color: var(--color-primary, #6366f1) !important;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15) !important;
        }
        .phone-input-container .selected-flag {
          padding: 0 8px !important;
        }
        .phone-input-container .selected-flag:hover,
        .phone-input-container .selected-flag:focus,
        .phone-input-container .selected-flag.open {
          background-color: #f3f4f6 !important;
        }
        .phone-input-container .country-list {
          max-height: 220px !important;
          border-radius: 12px !important;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,.1), 0 8px 10px -6px rgba(0,0,0,.1) !important;
          border: 1px solid #e5e7eb !important;
          margin-top: 4px !important;
          overflow-x: hidden !important;
        }
        .phone-input-container .country-list .country {
          padding: 8px 12px !important;
          font-size: 13px !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }
        .phone-input-container .country-list .country:hover {
          background-color: #f9fafb !important;
        }
        .phone-input-container .country-list .country.highlight {
          background-color: rgba(99, 102, 241, 0.06) !important;
          color: var(--color-primary, #6366f1) !important;
        }
        .phone-input-container .country-list .country .dial-code {
          color: #9ca3af !important;
          font-size: 12px !important;
        }
        .phone-input-container .country-list .country.highlight .dial-code {
          color: var(--color-primary, #6366f1) !important;
        }
        .phone-input-container .country-list .search {
          padding: 8px !important;
          position: sticky !important;
          top: 0 !important;
          background: white !important;
          z-index: 1 !important;
        }
        .phone-input-container .country-list .search-box {
          width: 100% !important;
          height: 32px !important;
          font-size: 13px !important;
          border-radius: 6px !important;
          border: 1px solid #e5e7eb !important;
          padding: 0 8px !important;
          margin: 0 !important;
          box-sizing: border-box !important;
        }
        .phone-input-container .country-list .search-box:focus {
          border-color: var(--color-primary, #6366f1) !important;
          outline: none !important;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15) !important;
        }
        .phone-input-container .flag-dropdown {
          border-radius: 8px 0 0 8px !important;
        }
        .phone-input-container .country-list .flag {
          margin-right: 4px !important;
        }
        .phone-input-container .selected-flag .arrow {
          border-top-color: #9ca3af !important;
          margin-left: 6px !important;
        }
        .phone-input-container .selected-flag .arrow.up {
          border-bottom-color: #9ca3af !important;
        }
      `}</style>
    </div>
  );
}