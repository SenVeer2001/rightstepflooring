// types/subcontractor.ts
export type SubcontractorStatus = "active" | "inactive" | "locked" | "pending";
export type InsuranceStatus = "valid" | "expiring_soon" | "expired" | "not_uploaded" | "pending";
export type DocumentStatus = "valid" | "expiring_soon" | "expired" | "pending" | "not_uploaded";
export type TicketStatus = "open" | "in_progress" | "pending" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketCategory = "quality" | "delay" | "no_show" | "behavior" | "damage" | "billing" | "other";

export interface SubcontractorDocument {
  id: string;
  type: "insurance" | "w9" | "contract" | "license" | "other";
  name: string;
  status: DocumentStatus;
  uploadedAt?: Date;
  expiresAt?: Date;
  fileUrl?: string;
}

export interface SubcontractorJob {
  id: string;
  jobNumber: string;
  title: string;
  clientName: string;
  date: Date;
  completedAt?: Date;
  status: "completed" | "in_progress" | "scheduled" | "cancelled";
  amount: number;
  rating?: number;
  feedback?: string;
}

export interface SubcontractorPayout {
  id: string;
  date: Date;
  amount: number;
  method: "direct_deposit" | "check" | "cash";
  status: "paid" | "pending" | "processing";
  jobId?: string;
  jobNumber?: string;
  reference?: string;
}

export interface SubcontractorFeedback {
  id: string;
  jobId: string;
  jobNumber: string;
  clientName: string;
  date: Date;
  rating: number;
  comment: string;
  type: "positive" | "neutral" | "negative";
}

// NEW: Subcontractor Ticket
export interface SubcontractorTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  jobId?: string;
  jobNumber?: string;
  customerName: string;
  reportedBy: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface Subcontractor {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  trade: string;
  trades: string[];
  rating: number;
  totalJobs: number;
  completedJobs: number;
  serviceAreas: string[];
  status: SubcontractorStatus;
  insuranceStatus: InsuranceStatus;
  insuranceExpiry?: Date;
  lastJobDate?: Date;
  joinedAt: Date;
  callbackRate: number;
  punctualityScore: number;
  qualityScore: number;
  responseTime: number;
  documents: SubcontractorDocument[];
  jobs: SubcontractorJob[];
  payouts: SubcontractorPayout[];
  feedback: SubcontractorFeedback[];
  tickets: SubcontractorTicket[]; // NEW: Added tickets
}

export const tradeOptions = [
  "All Trades",
  "Electrician",
  "Plumber",
  "HVAC Technician",
  "Painter",
  "Carpenter",
  "Cleaner",
  "Roofer",
  "Drywall",
  "General Labor",
  "Siding",
];

export const serviceAreaOptions = [
  "All Areas",
  "Downtown",
  "Westside",
  "Eastside",
  "Northgate",
  "Southside",
];

// Mock Data
export const mockSubcontractors: Subcontractor[] = [
  {
    id: "SUB-001",
    name: "John Martinez",
    email: "john.martinez@email.com",
    phone: "(555) 123-4567",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    trade: "Electrician",
    trades: ["Electrician", "HVAC"],
    rating: 4.8,
    totalJobs: 156,
    completedJobs: 152,
    serviceAreas: ["Downtown", "Westside", "Northgate"],
    status: "active",
    insuranceStatus: "valid",
    insuranceExpiry: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    lastJobDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    joinedAt: new Date("2021-03-15"),
    callbackRate: 2.5,
    punctualityScore: 95,
    qualityScore: 98,
    responseTime: 1.5,
    documents: [
      { id: "DOC-001", type: "insurance", name: "Liability Insurance", status: "valid", uploadedAt: new Date("2024-01-15"), expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) },
      { id: "DOC-002", type: "w9", name: "W-9 Form", status: "valid", uploadedAt: new Date("2024-01-10") },
      { id: "DOC-003", type: "contract", name: "Subcontractor Agreement", status: "valid", uploadedAt: new Date("2024-01-01"), expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
      { id: "DOC-004", type: "license", name: "Electrical License", status: "valid", uploadedAt: new Date("2024-01-05"), expiresAt: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000) },
    ],
    jobs: [
      { id: "JOB-101", jobNumber: "JOB-2024-101", title: "Panel Upgrade", clientName: "Robert Chen", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: "completed", amount: 1500, rating: 5, feedback: "Excellent work!" },
      { id: "JOB-102", jobNumber: "JOB-2024-098", title: "Outlet Installation", clientName: "Sarah Miller", date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), status: "completed", amount: 450, rating: 5 },
      { id: "JOB-103", jobNumber: "JOB-2024-110", title: "Lighting Repair", clientName: "Mike Johnson", date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: "scheduled", amount: 300 },
    ],
    payouts: [
      { id: "PAY-001", date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), amount: 2500, method: "direct_deposit", status: "paid", jobNumber: "JOB-2024-095", reference: "TXN-78945" },
      { id: "PAY-002", date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), amount: 1800, method: "direct_deposit", status: "paid", jobNumber: "JOB-2024-089", reference: "TXN-78901" },
    ],
    feedback: [
      { id: "FB-001", jobId: "JOB-101", jobNumber: "JOB-2024-101", clientName: "Robert Chen", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), rating: 5, comment: "John was professional and completed the panel upgrade perfectly. Highly recommend!", type: "positive" },
      { id: "FB-002", jobId: "JOB-102", jobNumber: "JOB-2024-098", clientName: "Sarah Miller", date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), rating: 5, comment: "Quick and efficient service.", type: "positive" },
    ],
    tickets: [
      { id: "TKT-001", ticketNumber: "TKT-2024-001", subject: "Delayed arrival at job site", description: "Subcontractor arrived 45 minutes late to the scheduled appointment.", category: "delay", priority: "medium", status: "resolved", jobId: "JOB-095", jobNumber: "JOB-2024-095", customerName: "David Wilson", reportedBy: "Customer", createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), updatedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), resolvedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000) },
      { id: "TKT-002", ticketNumber: "TKT-2024-015", subject: "Quality concern on wiring", description: "Customer noticed exposed wires after installation.", category: "quality", priority: "high", status: "resolved", jobId: "JOB-078", jobNumber: "JOB-2024-078", customerName: "Emily Brown", reportedBy: "Customer", createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), updatedAt: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000), resolvedAt: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000) },
    ],
  },
  {
    id: "SUB-002",
    name: "Sarah Thompson",
    email: "sarah.t@email.com",
    phone: "(555) 234-5678",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    trade: "Plumber",
    trades: ["Plumber"],
    rating: 4.6,
    totalJobs: 89,
    completedJobs: 87,
    serviceAreas: ["Eastside", "Downtown"],
    status: "active",
    insuranceStatus: "expiring_soon",
    insuranceExpiry: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    lastJobDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    joinedAt: new Date("2022-06-20"),
    callbackRate: 3.2,
    punctualityScore: 92,
    qualityScore: 94,
    responseTime: 2.0,
    documents: [
      { id: "DOC-005", type: "insurance", name: "Liability Insurance", status: "expiring_soon", uploadedAt: new Date("2023-01-15"), expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) },
      { id: "DOC-006", type: "w9", name: "W-9 Form", status: "valid", uploadedAt: new Date("2024-01-10") },
      { id: "DOC-007", type: "contract", name: "Subcontractor Agreement", status: "valid", uploadedAt: new Date("2024-01-01"), expiresAt: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000) },
    ],
    jobs: [],
    payouts: [],
    feedback: [],
    tickets: [
      { id: "TKT-003", ticketNumber: "TKT-2024-022", subject: "Customer complaint about cleanliness", description: "Customer reported that work area was not cleaned up after job completion.", category: "quality", priority: "low", status: "closed", jobId: "JOB-156", jobNumber: "JOB-2024-156", customerName: "Michael Adams", reportedBy: "Customer", createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000), resolvedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000) },
    ],
  },
  {
    id: "SUB-003",
    name: "Mike Johnson",
    email: "mike.j@email.com",
    phone: "(555) 345-6789",
    trade: "HVAC Technician",
    trades: ["HVAC Technician", "Electrician"],
    rating: 4.9,
    totalJobs: 234,
    completedJobs: 230,
    serviceAreas: ["Northgate", "Southside", "Downtown", "Westside"],
    status: "active",
    insuranceStatus: "valid",
    insuranceExpiry: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000),
    lastJobDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    joinedAt: new Date("2020-01-10"),
    callbackRate: 1.8,
    punctualityScore: 98,
    qualityScore: 99,
    responseTime: 0.5,
    documents: [],
    jobs: [],
    payouts: [],
    feedback: [],
    tickets: [], // No tickets - excellent record!
  },
  {
    id: "SUB-004",
    name: "Emily Davis",
    email: "emily.d@email.com",
    phone: "(555) 456-7890",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    trade: "Painter",
    trades: ["Painter", "Drywall"],
    rating: 4.5,
    totalJobs: 67,
    completedJobs: 65,
    serviceAreas: ["Westside", "Downtown"],
    status: "locked",
    insuranceStatus: "expired",
    insuranceExpiry: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    lastJobDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    joinedAt: new Date("2022-09-05"),
    callbackRate: 4.0,
    punctualityScore: 88,
    qualityScore: 90,
    responseTime: 3.0,
    documents: [],
    jobs: [],
    payouts: [],
    feedback: [],
    tickets: [
      { id: "TKT-004", ticketNumber: "TKT-2024-045", subject: "No-show for scheduled appointment", description: "Subcontractor did not show up for scheduled job without prior notification.", category: "no_show", priority: "urgent", status: "open", jobId: "JOB-201", jobNumber: "JOB-2024-201", customerName: "Jennifer Wilson", reportedBy: "Dispatch", createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { id: "TKT-005", ticketNumber: "TKT-2024-046", subject: "Unprofessional behavior reported", description: "Customer complained about rude behavior during the job.", category: "behavior", priority: "high", status: "in_progress", jobId: "JOB-198", jobNumber: "JOB-2024-198", customerName: "Thomas Brown", reportedBy: "Customer", createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { id: "TKT-006", ticketNumber: "TKT-2024-050", subject: "Property damage during work", description: "Customer's floor was scratched during painting job.", category: "damage", priority: "urgent", status: "open", jobId: "JOB-195", jobNumber: "JOB-2024-195", customerName: "Lisa Martinez", reportedBy: "Customer", createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    ],
  },
  {
    id: "SUB-005",
    name: "Robert Wilson",
    email: "robert.w@email.com",
    phone: "(555) 567-8901",
    trade: "Carpenter",
    trades: ["Carpenter", "General Labor"],
    rating: 4.7,
    totalJobs: 112,
    completedJobs: 110,
    serviceAreas: ["Southside", "Eastside"],
    status: "active",
    insuranceStatus: "valid",
    insuranceExpiry: new Date(Date.now() + 250 * 24 * 60 * 60 * 1000),
    lastJobDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    joinedAt: new Date("2021-07-22"),
    callbackRate: 2.0,
    punctualityScore: 94,
    qualityScore: 96,
    responseTime: 1.0,
    documents: [],
    jobs: [],
    payouts: [],
    feedback: [],
    tickets: [
      { id: "TKT-007", ticketNumber: "TKT-2024-030", subject: "Billing dispute", description: "Subcontractor claims hours were not recorded correctly.", category: "billing", priority: "medium", status: "pending", jobId: "JOB-180", jobNumber: "JOB-2024-180", customerName: "N/A", reportedBy: "Subcontractor", createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    ],
  },
  {
    id: "SUB-006",
    name: "Lisa Anderson",
    email: "lisa.a@email.com",
    phone: "(555) 678-9012",
    trade: "Cleaner",
    trades: ["Cleaner"],
    rating: 4.4,
    totalJobs: 45,
    completedJobs: 44,
    serviceAreas: ["Downtown"],
    status: "inactive",
    insuranceStatus: "not_uploaded",
    lastJobDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    joinedAt: new Date("2023-02-14"),
    callbackRate: 5.0,
    punctualityScore: 85,
    qualityScore: 88,
    responseTime: 4.0,
    documents: [],
    jobs: [],
    payouts: [],
    feedback: [],
    tickets: [],
  },
  {
    id: "SUB-007",
    name: "David Brown",
    email: "david.b@email.com",
    phone: "(555) 789-0123",
    trade: "Roofer",
    trades: ["Roofer", "Siding"],
    rating: 4.8,
    totalJobs: 78,
    completedJobs: 76,
    serviceAreas: ["Northgate", "Westside", "Eastside"],
    status: "pending",
    insuranceStatus: "pending",
    joinedAt: new Date("2024-01-05"),
    callbackRate: 1.5,
    punctualityScore: 97,
    qualityScore: 97,
    responseTime: 1.0,
    documents: [],
    jobs: [],
    payouts: [],
    feedback: [],
    tickets: [],
  },
];