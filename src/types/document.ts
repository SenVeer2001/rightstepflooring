// types/document.ts

export type EntityType = "staff" | "subcontractor" | "client" | "job" | "vendor";

export type DocumentType = 
  | "contract" 
  | "license" 
  | "insurance" 
  | "certification" 
  | "id_proof" 
  | "agreement" 
  | "invoice" 
  | "proposal" 
  | "report" 
  | "other";

export type DocumentStatus = "valid" | "expiring_soon" | "expired" | "pending_review" | "draft";

export type FileFormat = "pdf" | "doc" | "docx" | "xls" | "xlsx" | "jpg" | "png" | "zip" | "other";

export interface DocumentTag {
  id: string;
  name: string;
  color: string;
}

export interface Document {
  id: string;
  documentId: string; // DID - Display ID
  entityType: EntityType;
  entityId: string;
  entityName: string;
  documentType: DocumentType;
  name: string;
  fileName: string;
  fileFormat: FileFormat;
  fileSize: number; // in bytes
  fileUrl?: string;
  status: DocumentStatus;
  uploadedBy: string;
  uploadedById: string;
  uploadedAt: Date;
  expiresAt?: Date;
  lastModifiedAt?: Date;
  lastModifiedBy?: string;
  version: number;
  notes?: string;
  tags: DocumentTag[];
  isRequired?: boolean;
  previousVersions?: {
    version: number;
    fileUrl: string;
    uploadedAt: Date;
    uploadedBy: string;
  }[];
}

// Mock Tags
export const documentTags: DocumentTag[] = [
  { id: "tag-1", name: "Important", color: "red" },
  { id: "tag-2", name: "Verified", color: "green" },
  { id: "tag-3", name: "Pending Review", color: "yellow" },
  { id: "tag-4", name: "Confidential", color: "purple" },
  { id: "tag-5", name: "Archive", color: "gray" },
  { id: "tag-6", name: "Legal", color: "blue" },
  { id: "tag-7", name: "Financial", color: "orange" },
];

// Mock Documents
export const mockDocuments: Document[] = [
  {
    id: "doc-001",
    documentId: "D001",
    entityType: "staff",
    entityId: "STF-001",
    entityName: "John Smith",
    documentType: "id_proof",
    name: "Driver's License",
    fileName: "john_smith_drivers_license.pdf",
    fileFormat: "pdf",
    fileSize: 125000,
    status: "valid",
    uploadedBy: "Gajen Kumar",
    uploadedById: "USR-001",
    uploadedAt: new Date("2024-01-10"),
    expiresAt: new Date("2026-03-15"),
    version: 1,
    notes: "Verified government issued ID",
    tags: [
      { id: "tag-2", name: "Verified", color: "green" },
      { id: "tag-1", name: "Important", color: "red" },
    ],
    isRequired: true,
  },
  {
    id: "doc-002",
    documentId: "D002",
    entityType: "staff",
    entityId: "STF-001",
    entityName: "John Smith",
    documentType: "certification",
    name: "Electrical License",
    fileName: "john_smith_electrical_license.pdf",
    fileFormat: "pdf",
    fileSize: 256000,
    status: "expiring_soon",
    uploadedBy: "Sarah Johnson",
    uploadedById: "USR-002",
    uploadedAt: new Date("2023-06-15"),
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
    version: 2,
    notes: "State electrical contractor license - Level 3",
    tags: [
      { id: "tag-6", name: "Legal", color: "blue" },
      { id: "tag-1", name: "Important", color: "red" },
    ],
    isRequired: true,
    previousVersions: [
      {
        version: 1,
        fileUrl: "/docs/old/electrical_license_v1.pdf",
        uploadedAt: new Date("2022-06-15"),
        uploadedBy: "Admin",
      },
    ],
  },
  {
    id: "doc-003",
    documentId: "D003",
    entityType: "subcontractor",
    entityId: "SUB-001",
    entityName: "ABC Plumbing Co.",
    documentType: "insurance",
    name: "Liability Insurance",
    fileName: "abc_plumbing_liability_insurance.pdf",
    fileFormat: "pdf",
    fileSize: 512000,
    status: "valid",
    uploadedBy: "Emily Davis",
    uploadedById: "USR-003",
    uploadedAt: new Date("2024-01-05"),
    expiresAt: new Date("2025-01-05"),
    version: 1,
    notes: "$2M liability coverage",
    tags: [
      { id: "tag-2", name: "Verified", color: "green" },
      { id: "tag-4", name: "Confidential", color: "purple" },
    ],
    isRequired: true,
  },
  {
    id: "doc-004",
    documentId: "D004",
    entityType: "subcontractor",
    entityId: "SUB-001",
    entityName: "ABC Plumbing Co.",
    documentType: "contract",
    name: "Service Agreement",
    fileName: "abc_plumbing_service_agreement.pdf",
    fileFormat: "pdf",
    fileSize: 324000,
    status: "valid",
    uploadedBy: "Michael Brown",
    uploadedById: "USR-004",
    uploadedAt: new Date("2023-12-20"),
    version: 1,
    notes: "Annual service agreement for 2024",
    tags: [
      { id: "tag-6", name: "Legal", color: "blue" },
    ],
  },
  {
    id: "doc-005",
    documentId: "D005",
    entityType: "client",
    entityId: "CLT-001",
    entityName: "Metro Office Building",
    documentType: "agreement",
    name: "Maintenance Contract",
    fileName: "metro_office_maintenance_contract.pdf",
    fileFormat: "pdf",
    fileSize: 890000,
    status: "valid",
    uploadedBy: "Sarah Johnson",
    uploadedById: "USR-002",
    uploadedAt: new Date("2024-01-15"),
    expiresAt: new Date("2025-01-15"),
    version: 3,
    notes: "Monthly HVAC maintenance - 12 properties",
    tags: [
      { id: "tag-7", name: "Financial", color: "orange" },
      { id: "tag-6", name: "Legal", color: "blue" },
    ],
    isRequired: true,
    previousVersions: [
      {
        version: 2,
        fileUrl: "/docs/old/metro_contract_v2.pdf",
        uploadedAt: new Date("2023-01-15"),
        uploadedBy: "Sarah Johnson",
      },
      {
        version: 1,
        fileUrl: "/docs/old/metro_contract_v1.pdf",
        uploadedAt: new Date("2022-01-15"),
        uploadedBy: "Admin",
      },
    ],
  },
  {
    id: "doc-006",
    documentId: "D006",
    entityType: "job",
    entityId: "JOB-2024-001",
    entityName: "Kitchen Renovation - John Smith",
    documentType: "proposal",
    name: "Project Proposal",
    fileName: "kitchen_renovation_proposal.pdf",
    fileFormat: "pdf",
    fileSize: 1250000,
    status: "pending_review",
    uploadedBy: "Alex Thompson",
    uploadedById: "USR-005",
    uploadedAt: new Date("2024-01-18"),
    version: 1,
    notes: "Awaiting customer approval",
    tags: [
      { id: "tag-3", name: "Pending Review", color: "yellow" },
    ],
  },
  {
    id: "doc-007",
    documentId: "D007",
    entityType: "job",
    entityId: "JOB-2024-002",
    entityName: "Bathroom Remodel - Emily Brown",
    documentType: "invoice",
    name: "Final Invoice",
    fileName: "bathroom_remodel_invoice.pdf",
    fileFormat: "pdf",
    fileSize: 145000,
    status: "valid",
    uploadedBy: "Jennifer Garcia",
    uploadedById: "USR-006",
    uploadedAt: new Date("2024-01-20"),
    version: 1,
    notes: "Final invoice - Payment received",
    tags: [
      { id: "tag-7", name: "Financial", color: "orange" },
      { id: "tag-2", name: "Verified", color: "green" },
    ],
  },
  {
    id: "doc-008",
    documentId: "D008",
    entityType: "vendor",
    entityId: "VND-001",
    entityName: "Home Depot Supply",
    documentType: "agreement",
    name: "Vendor Agreement",
    fileName: "home_depot_vendor_agreement.pdf",
    fileFormat: "pdf",
    fileSize: 678000,
    status: "valid",
    uploadedBy: "Robert Lee",
    uploadedById: "USR-007",
    uploadedAt: new Date("2023-11-01"),
    expiresAt: new Date("2024-11-01"),
    version: 1,
    notes: "Preferred pricing agreement - 15% discount",
    tags: [
      { id: "tag-6", name: "Legal", color: "blue" },
      { id: "tag-7", name: "Financial", color: "orange" },
    ],
  },
  {
    id: "doc-009",
    documentId: "D009",
    entityType: "staff",
    entityId: "STF-002",
    entityName: "Emily Davis",
    documentType: "contract",
    name: "Employment Contract",
    fileName: "emily_davis_employment_contract.pdf",
    fileFormat: "pdf",
    fileSize: 234000,
    status: "valid",
    uploadedBy: "HR Admin",
    uploadedById: "USR-008",
    uploadedAt: new Date("2022-06-01"),
    version: 1,
    notes: "Full-time dispatcher position",
    tags: [
      { id: "tag-4", name: "Confidential", color: "purple" },
      { id: "tag-6", name: "Legal", color: "blue" },
    ],
    isRequired: true,
  },
  {
    id: "doc-010",
    documentId: "D010",
    entityType: "subcontractor",
    entityId: "SUB-002",
    entityName: "Elite Electric LLC",
    documentType: "license",
    name: "Electrical Contractor License",
    fileName: "elite_electric_license.pdf",
    fileFormat: "pdf",
    fileSize: 189000,
    status: "expired",
    uploadedBy: "Sarah Johnson",
    uploadedById: "USR-002",
    uploadedAt: new Date("2022-03-15"),
    expiresAt: new Date("2024-01-01"),
    version: 1,
    notes: "NEEDS RENEWAL - Contact subcontractor",
    tags: [
      { id: "tag-1", name: "Important", color: "red" },
    ],
    isRequired: true,
  },
  {
    id: "doc-011",
    documentId: "D011",
    entityType: "client",
    entityId: "CLT-002",
    entityName: "Riverside Apartments",
    documentType: "report",
    name: "Annual Inspection Report",
    fileName: "riverside_inspection_2023.pdf",
    fileFormat: "pdf",
    fileSize: 2340000,
    status: "valid",
    uploadedBy: "Michael Brown",
    uploadedById: "USR-004",
    uploadedAt: new Date("2024-01-08"),
    version: 1,
    notes: "2023 annual safety inspection - All units passed",
    tags: [
      { id: "tag-2", name: "Verified", color: "green" },
    ],
  },
  {
    id: "doc-012",
    documentId: "D012",
    entityType: "staff",
    entityId: "STF-003",
    entityName: "Sarah Johnson",
    documentType: "certification",
    name: "PMP Certificate",
    fileName: "sarah_johnson_pmp.pdf",
    fileFormat: "pdf",
    fileSize: 156000,
    status: "valid",
    uploadedBy: "Sarah Johnson",
    uploadedById: "USR-002",
    uploadedAt: new Date("2020-02-01"),
    expiresAt: new Date("2026-02-01"),
    version: 1,
    notes: "Project Management Professional certification",
    tags: [
      { id: "tag-2", name: "Verified", color: "green" },
    ],
  },
  {
    id: "doc-013",
    documentId: "D013",
    entityType: "job",
    entityId: "JOB-2024-003",
    entityName: "HVAC Install - Corporate Plaza",
    documentType: "report",
    name: "Completion Report",
    fileName: "hvac_completion_report.xlsx",
    fileFormat: "xlsx",
    fileSize: 456000,
    status: "draft",
    uploadedBy: "Alex Thompson",
    uploadedById: "USR-005",
    uploadedAt: new Date("2024-01-22"),
    version: 1,
    notes: "Draft - awaiting final review",
    tags: [
      { id: "tag-3", name: "Pending Review", color: "yellow" },
    ],
  },
  {
    id: "doc-014",
    documentId: "D014",
    entityType: "vendor",
    entityId: "VND-002",
    entityName: "Electrical Wholesale Inc",
    documentType: "invoice",
    name: "January Supplies Invoice",
    fileName: "electrical_wholesale_jan_invoice.pdf",
    fileFormat: "pdf",
    fileSize: 98000,
    status: "valid",
    uploadedBy: "Jennifer Garcia",
    uploadedById: "USR-006",
    uploadedAt: new Date("2024-01-25"),
    version: 1,
    notes: "Monthly supplies invoice - Due Feb 15",
    tags: [
      { id: "tag-7", name: "Financial", color: "orange" },
    ],
  },
  {
    id: "doc-015",
    documentId: "D015",
    entityType: "staff",
    entityId: "STF-004",
    entityName: "Michael Brown",
    documentType: "license",
    name: "Plumbing License",
    fileName: "michael_brown_plumbing_license.jpg",
    fileFormat: "jpg",
    fileSize: 890000,
    status: "expiring_soon",
    uploadedBy: "Michael Brown",
    uploadedById: "USR-004",
    uploadedAt: new Date("2023-02-15"),
    expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days
    version: 1,
    notes: "State plumbing contractor license",
    tags: [
      { id: "tag-1", name: "Important", color: "red" },
      { id: "tag-6", name: "Legal", color: "blue" },
    ],
    isRequired: true,
  },
];

// Helper functions
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

export const getDaysUntilExpiry = (date?: Date): number | null => {
  if (!date) return null;
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  return Math.ceil(diffMs / (24 * 60 * 60 * 1000));
};