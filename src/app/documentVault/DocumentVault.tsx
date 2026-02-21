// pages/DocumentVault.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  
  Trash2,
  Upload,
  MoreVertical,
  X,
  User,
  Users,
  Building,
  Briefcase,
  Package,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileWarning,
  File,
  RefreshCw,
  Tag,
  Plus,
  ExternalLink,
  History,
  Copy,
  AlertCircle,
  Info,
  ChevronDown,
} from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import {
  type Document,
  type EntityType,
  type DocumentType,
  type DocumentStatus,
  type FileFormat,
  type DocumentTag,
  mockDocuments,
  documentTags,
  formatFileSize,
  getDaysUntilExpiry,
} from "../../types/document";

// Entity type config
const entityTypeConfig: Record<EntityType, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  staff: { label: "Staff", icon: User, color: "text-blue-600", bg: "bg-blue-50" },
  subcontractor: { label: "Subcontractor", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
  client: { label: "Client", icon: Building, color: "text-green-600", bg: "bg-green-50" },
  job: { label: "Job", icon: Briefcase, color: "text-orange-600", bg: "bg-orange-50" },
  vendor: { label: "Vendor", icon: Package, color: "text-cyan-600", bg: "bg-cyan-50" },
};

// Document type config
const documentTypeConfig: Record<DocumentType, { label: string; color: string; bg: string }> = {
  contract: { label: "Contract", color: "text-blue-700", bg: "bg-blue-100" },
  license: { label: "License", color: "text-purple-700", bg: "bg-purple-100" },
  insurance: { label: "Insurance", color: "text-green-700", bg: "bg-green-100" },
  certification: { label: "Certification", color: "text-yellow-700", bg: "bg-yellow-100" },
  id_proof: { label: "ID Proof", color: "text-indigo-700", bg: "bg-indigo-100" },
  agreement: { label: "Agreement", color: "text-pink-700", bg: "bg-pink-100" },
  invoice: { label: "Invoice", color: "text-emerald-700", bg: "bg-emerald-100" },
  proposal: { label: "Proposal", color: "text-orange-700", bg: "bg-orange-100" },
  report: { label: "Report", color: "text-cyan-700", bg: "bg-cyan-100" },
  other: { label: "Other", color: "text-gray-700", bg: "bg-gray-100" },
};

// Status config
const statusConfig: Record<DocumentStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  valid: { label: "Valid", color: "text-green-700", bg: "bg-green-100", icon: CheckCircle },
  expiring_soon: { label: "Expiring Soon", color: "text-yellow-700", bg: "bg-yellow-100", icon: AlertTriangle },
  expired: { label: "Expired", color: "text-red-700", bg: "bg-red-100", icon: XCircle },
  pending_review: { label: "Pending Review", color: "text-blue-700", bg: "bg-blue-100", icon: Clock },
  draft: { label: "Draft", color: "text-gray-700", bg: "bg-gray-100", icon: FileWarning },
};

// File format icons & colors
const fileFormatConfig: Record<FileFormat, { color: string; bg: string }> = {
  pdf: { color: "text-red-600", bg: "bg-red-50" },
  doc: { color: "text-blue-600", bg: "bg-blue-50" },
  docx: { color: "text-blue-600", bg: "bg-blue-50" },
  xls: { color: "text-green-600", bg: "bg-green-50" },
  xlsx: { color: "text-green-600", bg: "bg-green-50" },
  jpg: { color: "text-purple-600", bg: "bg-purple-50" },
  png: { color: "text-purple-600", bg: "bg-purple-50" },
  zip: { color: "text-yellow-600", bg: "bg-yellow-50" },
  other: { color: "text-gray-600", bg: "bg-gray-50" },
};

// Tag color mapping
const tagColorMap: Record<string, { bg: string; text: string; border: string }> = {
  red: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  green: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  yellow: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
  blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  purple: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  gray: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" },
};

// Format date
const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

// Document Detail Popup
interface DocumentDetailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
  onDelete: (id: string) => void;
}

const DocumentDetailPopup = ({ isOpen, onClose, document, onDelete }: DocumentDetailPopupProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"details" | "history">("details");

  if (!isOpen || !document) return null;

  const entityConfig = entityTypeConfig[document.entityType];
  const docTypeConfig = documentTypeConfig[document.documentType];
  const statusInfo = statusConfig[document.status];
  const formatConfig = fileFormatConfig[document.fileFormat];
  const StatusIcon = statusInfo.icon;
  const EntityIcon = entityConfig.icon;
  const daysUntilExpiry = getDaysUntilExpiry(document.expiresAt);

  const handleViewEntity = () => {
    const entityUrls: Record<EntityType, string> = {
      staff: `/staff/${document.entityId}`,
      subcontractor: `/subcontractors/${document.entityId}`,
      client: `/customers/${document.entityId}`,
      job: `/jobs/${document.entityId}`,
      vendor: `/vendors/${document.entityId}`,
    };
    onClose();
    navigate(entityUrls[document.entityType]);
  };

  const handleDelete = () => {
    onDelete(document.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Popup */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-start gap-4">
            {/* File Icon */}
            <div className={`p-3 rounded-xl ${formatConfig.bg} flex-shrink-0`}>
              <FileText size={24} className={formatConfig.color} />
            </div>

            {/* Title & Meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-900">{document.name}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{document.fileName}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {/* Document ID */}
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded">
                      {document.documentId}
                    </span>
                    {/* Status */}
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${statusInfo.bg} ${statusInfo.color}`}>
                      <StatusIcon size={10} />
                      {statusInfo.label}
                    </span>
                    {/* Version */}
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-medium rounded">
                      v{document.version}
                    </span>
                    {/* Required */}
                    {document.isRequired && (
                      <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-semibold rounded">
                        Required
                      </span>
                    )}
                  </div>
                </div>

                {/* Close Button */}
                <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition flex-shrink-0">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === "details" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === "history" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <History size={12} />
              History
              {document.previousVersions && document.previousVersions.length > 0 && (
                <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                  activeTab === "history" ? "bg-white/20" : "bg-gray-200"
                }`}>
                  {document.previousVersions.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-250px)]">
          {activeTab === "details" && (
            <div className="p-6 space-y-5">
              {/* Expiry Warning */}
              {(document.status === "expired" || document.status === "expiring_soon") && (
                <div className={`p-4 rounded-xl border ${
                  document.status === "expired" 
                    ? "bg-red-50 border-red-200" 
                    : "bg-yellow-50 border-yellow-200"
                }`}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={18} className={
                      document.status === "expired" ? "text-red-600" : "text-yellow-600"
                    } />
                    <div>
                      <p className={`text-sm font-semibold ${
                        document.status === "expired" ? "text-red-800" : "text-yellow-800"
                      }`}>
                        {document.status === "expired" 
                          ? "This document has expired" 
                          : `This document expires in ${daysUntilExpiry} days`}
                      </p>
                      <p className={`text-xs mt-1 ${
                        document.status === "expired" ? "text-red-600" : "text-yellow-600"
                      }`}>
                        {document.status === "expired"
                          ? "Please upload a renewed version immediately."
                          : "Consider renewing this document before expiration."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Entity Info */}
              <div>
                <h3 className="text-xs font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <EntityIcon size={12} className="text-gray-400" />
                  Associated {entityConfig.label}
                </h3>
                <div
                  onClick={handleViewEntity}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-primary/50 hover:bg-gray-100 cursor-pointer transition group"
                >
                  <div className={`p-2 rounded-lg ${entityConfig.bg}`}>
                    <EntityIcon size={16} className={entityConfig.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-primary">
                      {document.entityName}
                    </p>
                    <p className="text-[10px] text-gray-500">{document.entityId}</p>
                  </div>
                  <ExternalLink size={14} className="text-gray-400 group-hover:text-primary" />
                </div>
              </div>

              {/* Document Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-[10px] font-medium text-gray-500 uppercase">Document Type</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${docTypeConfig.bg} ${docTypeConfig.color}`}>
                      {docTypeConfig.label}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-[10px] font-medium text-gray-500 uppercase">File Format</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1 uppercase">{document.fileFormat}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-[10px] font-medium text-gray-500 uppercase">File Size</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{formatFileSize(document.fileSize)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-[10px] font-medium text-gray-500 uppercase">Uploaded By</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{document.uploadedBy}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-[10px] font-medium text-gray-500 uppercase">Upload Date</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{formatDate(document.uploadedAt)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-[10px] font-medium text-gray-500 uppercase">Expiry Date</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {document.expiresAt ? formatDate(document.expiresAt) : "N/A"}
                    </p>
                    {daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry > 0 && (
                      <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-[9px] font-semibold rounded">
                        {daysUntilExpiry}d left
                      </span>
                    )}
                    {daysUntilExpiry !== null && daysUntilExpiry <= 0 && (
                      <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[9px] font-semibold rounded">
                        Expired
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {document.notes && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Info size={12} className="text-gray-400" />
                    Notes
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-sm text-gray-700 whitespace-pre-line">{document.notes}</p>
                  </div>
                </div>
              )}

              {/* Tags */}
              {document.tags.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Tag size={12} className="text-gray-400" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {document.tags.map((tag) => {
                      const colors = tagColorMap[tag.color] || tagColorMap.gray;
                      return (
                        <span
                          key={tag.id}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
                        >
                          {tag.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className="p-6">
              {/* Current Version */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-900 mb-2">Current Version</h3>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText size={16} className="text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">Version {document.version}</p>
                      <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[9px] font-semibold rounded">
                        Current
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Uploaded by {document.uploadedBy} on {formatDate(document.uploadedAt)}
                    </p>
                  </div>
                  <button className="p-2 hover:bg-green-100 rounded-lg transition">
                    <Download size={16} className="text-green-600" />
                  </button>
                </div>
              </div>

              {/* Previous Versions */}
              {document.previousVersions && document.previousVersions.length > 0 ? (
                <div>
                  <h3 className="text-xs font-semibold text-gray-900 mb-2">Previous Versions</h3>
                  <div className="space-y-2">
                    {document.previousVersions.map((version, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200"
                      >
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <FileText size={16} className="text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700">Version {version.version}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            Uploaded by {version.uploadedBy} on {formatDate(version.uploadedAt)}
                          </p>
                        </div>
                        <button className="p-2 hover:bg-gray-200 rounded-lg transition">
                          <Download size={16} className="text-gray-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <History size={32} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm text-gray-500">No previous versions</p>
                  <p className="text-xs text-gray-400 mt-1">This is the first version of this document</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
              <Download size={14} />
              Download
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition">
              <Copy size={14} />
              Copy Link
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Close
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition">
              <RefreshCw size={12} />
              Replace Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Upload Document Modal
interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (document: Partial<Document>) => void;
}

const UploadDocumentModal = ({ isOpen, onClose, onUpload }: UploadDocumentModalProps) => {
  const [selectedEntityType, setSelectedEntityType] = useState<EntityType>("staff");
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>("contract");
  const [selectedTags, setSelectedTags] = useState<DocumentTag[]>([]);
  const [notes, setNotes] = useState("");
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle file drop
  };

  const toggleTag = (tag: DocumentTag) => {
    setSelectedTags((prev) =>
      prev.find((t) => t.id === tag.id)
        ? prev.filter((t) => t.id !== tag.id)
        : [...prev, tag]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Upload size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Upload Document</h2>
              <p className="text-xs text-gray-500">Add a new document to the vault</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-160px)]">
          {/* Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-gray-300 bg-gray-50 hover:border-gray-400"
            }`}
          >
            <Upload size={40} className="mx-auto mb-3 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">
              Drag and drop your file here, or{" "}
              <label className="text-primary cursor-pointer hover:underline">
                browse
                <input type="file" className="hidden" />
              </label>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supports PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 10MB)
            </p>
          </div>

          {/* Entity Type */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">
              Entity Type *
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(Object.keys(entityTypeConfig) as EntityType[]).map((type) => {
                const config = entityTypeConfig[type];
                const Icon = config.icon;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedEntityType(type)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition ${
                      selectedEntityType === type
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Icon size={18} className={selectedEntityType === type ? "text-primary" : "text-gray-500"} />
                    <span className={`text-[10px] font-medium ${
                      selectedEntityType === type ? "text-primary" : "text-gray-600"
                    }`}>
                      {config.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Entity Select */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">
              Select {entityTypeConfig[selectedEntityType].label} *
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none">
              <option value="">Choose {entityTypeConfig[selectedEntityType].label.toLowerCase()}...</option>
              <option value="1">John Smith (STF-001)</option>
              <option value="2">Emily Davis (STF-002)</option>
              <option value="3">Sarah Johnson (STF-003)</option>
            </select>
          </div>

          {/* Document Type */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">
              Document Type *
            </label>
            <select
              value={selectedDocType}
              onChange={(e) => setSelectedDocType(e.target.value as DocumentType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            >
              {(Object.keys(documentTypeConfig) as DocumentType[]).map((type) => (
                <option key={type} value={type}>
                  {documentTypeConfig[type].label}
                </option>
              ))}
            </select>
          </div>

          {/* Document Name */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">
              Document Name *
            </label>
            <input
              type="text"
              placeholder="e.g., Driver's License, Insurance Certificate..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">
              Expiry Date (Optional)
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {documentTags.map((tag) => {
                const isSelected = selectedTags.find((t) => t.id === tag.id);
                const colors = tagColorMap[tag.color] || tagColorMap.gray;
                return (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                      isSelected
                        ? `${colors.bg} ${colors.text} ${colors.border}`
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any relevant notes about this document..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition">
            <Upload size={16} />
            Upload Document
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Document Vault Component
export default function DocumentVault() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState<EntityType | "all">("all");
  const [typeFilter, setTypeFilter] = useState<DocumentType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const rowsPerPage = 10;

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    if (search) {
      const searchLower = search.toLowerCase();
      if (
        !doc.name.toLowerCase().includes(searchLower) &&
        !doc.fileName.toLowerCase().includes(searchLower) &&
        !doc.entityName.toLowerCase().includes(searchLower) &&
        !doc.documentId.toLowerCase().includes(searchLower) &&
        !doc.uploadedBy.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    if (entityFilter !== "all" && doc.entityType !== entityFilter) return false;
    if (typeFilter !== "all" && doc.documentType !== typeFilter) return false;
    if (statusFilter !== "all" && doc.status !== statusFilter) return false;
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredDocuments.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedDocuments = filteredDocuments.slice(startIndex, startIndex + rowsPerPage);

  // Stats
  const totalDocs = documents.length;
  const expiringSoon = documents.filter((d) => d.status === "expiring_soon").length;
  const expired = documents.filter((d) => d.status === "expired").length;

  // Handlers
  const handleDocumentClick = (doc: Document) => {
    setSelectedDocument(doc);
    setIsDetailOpen(true);
    setActiveDropdown(null);
  };

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleUpload = (doc: Partial<Document>) => {
    // Handle upload logic
    setIsUploadOpen(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-4" onClick={() => setActiveDropdown(null)}>
      <div className="max-w-8xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText size={28} className="text-primary" />
              Document Vault
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage and organize all your documents
            </p>
          </div>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition shadow-sm"
          >
            <Upload size={16} />
            Upload Document
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalDocs}</p>
                <p className="text-xs text-gray-500">Total Documents</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {documents.filter((d) => d.status === "valid").length}
                </p>
                <p className="text-xs text-gray-500">Valid</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle size={20} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{expiringSoon}</p>
                <p className="text-xs text-gray-500">Expiring Soon</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{expired}</p>
                <p className="text-xs text-gray-500">Expired</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              {/* <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /> */}
              <input
                type="text"
                placeholder="Search by name, file, entity, or uploaded by..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Entity Type Filter */}
            <div className="relative">
              <Building size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={entityFilter}
                onChange={(e) => setEntityFilter(e.target.value as EntityType | "all")}
                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none appearance-none bg-white min-w-[160px]"
              >
                <option value="all">All Entities</option>
                {(Object.keys(entityTypeConfig) as EntityType[]).map((type) => (
                  <option key={type} value={type}>
                    {entityTypeConfig[type].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Document Type Filter */}
            <div className="relative">
              <FileText size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as DocumentType | "all")}
                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none appearance-none bg-white min-w-[150px]"
              >
                <option value="all">All Types</option>
                {(Object.keys(documentTypeConfig) as DocumentType[]).map((type) => (
                  <option key={type} value={type}>
                    {documentTypeConfig[type].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            {/* <div className="relative">
              <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as DocumentStatus | "all")}
                className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none appearance-none bg-white min-w-[150px]"
              >
                <option value="all">All Status</option>
                {(Object.keys(statusConfig) as DocumentStatus[]).map((status) => (
                  <option key={status} value={status}>
                    {statusConfig[status].label}
                  </option>
                ))}
              </select>
            </div> */}

            {/* Export Button */}
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
              <Download size={14} />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    DID
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Entity
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Document Name
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Format
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Size
                  </th>
                  {/* <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th> */}
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Uploaded By
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Expiry
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center">
                      <FileText size={40} className="mx-auto mb-3 text-gray-300" />
                      <p className="text-sm text-gray-500 font-medium">No documents found</p>
                      <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or upload a new document</p>
                    </td>
                  </tr>
                ) : (
                  paginatedDocuments.map((doc) => {
                    const entityConfig = entityTypeConfig[doc.entityType];
                    const docTypeConfig = documentTypeConfig[doc.documentType];
                    const statusInfo = statusConfig[doc.status];
                    const formatConfig = fileFormatConfig[doc.fileFormat];
                    const StatusIcon = statusInfo.icon;
                    const EntityIcon = entityConfig.icon;
                    const daysUntilExpiry = getDaysUntilExpiry(doc.expiresAt);

                    return (
                      <tr
                        key={doc.id}
                        onClick={() => handleDocumentClick(doc)}
                        className="hover:bg-gray-50 transition cursor-pointer"
                      >
                        {/* DID */}
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-primary">{doc.documentId}</span>
                        </td>

                        {/* Type */}
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-[10px] font-semibold ${docTypeConfig.bg} ${docTypeConfig.color}`}>
                            {docTypeConfig.label}
                          </span>
                        </td>

                        {/* Entity */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded ${entityConfig.bg}`}>
                              <EntityIcon size={12} className={entityConfig.color} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                                {doc.entityName}
                              </p>
                             <div className="flex items-center gap-1 ">
                                 {/* <p className="text-[11px] text-gray-500">{doc.entityId}</p> */}
                              <p className="text-[12px] text-gray-700">{doc.entityType}</p>
                             </div>

                            </div>
                          </div>
                        </td>

                        {/* Document Name */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded ${formatConfig.bg}`}>
                              <FileText size={12} className={formatConfig.color} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                                {doc.name}
                              </p>
                              <p className="text-[10px] text-gray-500 truncate max-w-[180px]">
                                {doc.fileName}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Format */}
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-[10px] font-semibold uppercase ${formatConfig.bg} ${formatConfig.color}`}>
                            {doc.fileFormat}
                          </span>
                        </td>

                        {/* Size */}
                        <td className="px-4 py-3">
                          <span className="text-xs text-gray-600">{formatFileSize(doc.fileSize)}</span>
                        </td>

                        {/* Status */}
                        {/* <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold ${statusInfo.bg} ${statusInfo.color}`}>
                            <StatusIcon size={10} />
                            {statusInfo.label}
                          </span>
                        </td> */}

                        {/* Uploaded By */}
                        <td className="px-4 py-3">
                          <span className="text-xs text-gray-600">{doc.uploadedBy}</span>
                        </td>

                        {/* Expiry */}
                        <td className="px-4 py-3">
                          {doc.expiresAt ? (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-600">{formatDate(doc.expiresAt)}</span>
                              {daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry > 0 && (
                                <span className="px-1 py-0.5 bg-yellow-100 text-yellow-700 text-[8px] font-semibold rounded">
                                  {daysUntilExpiry}d
                                </span>
                              )}
                              {daysUntilExpiry !== null && daysUntilExpiry <= 0 && (
                                <span className="px-1 py-0.5 bg-red-100 text-red-700 text-[8px] font-semibold rounded">
                                  Exp
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <div className="relative inline-block">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdown(activeDropdown === doc.id ? null : doc.id);
                              }}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                            >
                              <MoreVertical size={16} className="text-gray-500" />
                            </button>

                            {activeDropdown === doc.id && (
                              <div
                                className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => handleDocumentClick(doc)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Eye size={14} />
                                  View Details
                                </button>
                                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                  <Download size={14} />
                                  Download
                                </button>
                                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                  <RefreshCw size={14} />
                                  Replace
                                </button>
                                <button
                                  onClick={() => {
                                    handleDelete(doc.id);
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              </div>
                            )}
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
          {filteredDocuments.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t bg-gray-50 gap-2">
              <p className="text-xs text-gray-500">
                Showing {startIndex + 1} - {Math.min(startIndex + rowsPerPage, filteredDocuments.length)} of {filteredDocuments.length}
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
                <span className="px-2 py-1 text-xs font-medium">
                  {currentPage} / {totalPages || 1}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-1 rounded border bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronRight size={14} />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-2 py-1 text-xs rounded border bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tooltips */}
      <Tooltip
        id="document-tooltip"
        place="top"
        className="!bg-gray-800 !text-white !text-[10px] !px-2 !py-1 !rounded"
      />

      {/* Document Detail Popup */}
      <DocumentDetailPopup
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        document={selectedDocument}
        onDelete={handleDelete}
      />

      {/* Upload Document Modal */}
      <UploadDocumentModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}