// types/staff.ts
export type StaffStatus = "active" | "inactive" | "on_leave" | "terminated";
export type StaffRole = "admin" | "manager" | "technician" | "dispatcher" | "sales" | "support" | "accounting";
export type EmploymentType = "full_time" | "part_time" | "contract";
export type TicketStatus = "open" | "in_progress" | "pending" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketCategory = "performance" | "attendance" | "behavior" | "customer_complaint" | "policy_violation" | "other";
export type DocumentStatus = "valid" | "expiring_soon" | "expired" | "pending" | "not_uploaded";
export type DocumentType = "id_proof" | "contract" | "certification" | "license" | "background_check" | "other";

export interface StaffDocument {
  id: string;
  type: DocumentType;
  name: string;
  status: DocumentStatus;
  uploadedAt?: Date;
  expiresAt?: Date;
  fileUrl?: string;
}

export interface StaffJob {
  id: string;
  jobNumber: string;
  title: string;
  clientName: string;
  date: Date;
  completedAt?: Date;
  status: "completed" | "in_progress" | "scheduled" | "cancelled";
  role: string;
  hoursWorked?: number;
  rating?: number;
  amount?: number;
}

export interface StaffPayout {
  id: string;
  date: Date;
  amount: number;
  type: "salary" | "bonus" | "commission" | "overtime" | "reimbursement";
  status: "paid" | "pending" | "processing";
  period?: string;
  reference?: string;
}

export interface StaffFeedback {
  id: string;
  jobId: string;
  jobNumber: string;
  clientName: string;
  date: Date;
  rating: number;
  comment: string;
  type: "positive" | "neutral" | "negative";
}

export interface StaffTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  jobId?: string;
  jobNumber?: string;
  reportedBy: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface StaffSchedule {
  id: string;
  date: Date;
  shiftStart: string;
  shiftEnd: string;
  hoursScheduled: number;
  hoursWorked?: number;
  status: "scheduled" | "completed" | "absent" | "late" | "leave";
}

export interface Staff {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  role: StaffRole;
  department: string;
  status: StaffStatus;
  employmentType: EmploymentType;
  hireDate: Date;
  terminationDate?: Date;
  manager?: string;
  managerName?: string;

  // Location
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;

  // Skills & Certifications
  skills: string[];
  certifications: string[];

  // Performance metrics
  rating: number;
  totalJobs: number;
  completedJobs: number;
  punctualityScore: number;
  qualityScore: number;
  customerSatisfaction: number;
  attendanceRate: number;

  // Compensation
  hourlyRate?: number;
  salary?: number;

  // Related data
  documents: StaffDocument[];
  jobs: StaffJob[];
  payouts: StaffPayout[];
  feedback: StaffFeedback[];
  tickets: StaffTicket[];
  schedule: StaffSchedule[];
}

// Mock Data
export const mockStaff: Staff[] = [
  {
    id: "STF-001",
    employeeId: "EMP-2021-001",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@company.com",
    phone: "(555) 123-4567",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    role: "technician",
    department: "Field Operations",
    status: "active",
    employmentType: "full_time",
    hireDate: new Date("2021-03-15"),
    manager: "STF-003",
    managerName: "Sarah Johnson",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    skills: ["Electrical", "HVAC", "Plumbing"],
    certifications: ["Licensed Electrician", "HVAC Certified", "OSHA 30"],
    rating: 4.8,
    totalJobs: 245,
    completedJobs: 240,
    punctualityScore: 96,
    qualityScore: 98,
    customerSatisfaction: 97,
    attendanceRate: 98,
    hourlyRate: 35,
    documents: [
      { id: "DOC-001", type: "id_proof", name: "Driver's License", status: "valid", uploadedAt: new Date("2021-03-15"), expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
      { id: "DOC-002", type: "contract", name: "Employment Contract", status: "valid", uploadedAt: new Date("2021-03-15") },
      { id: "DOC-003", type: "certification", name: "Electrical License", status: "valid", uploadedAt: new Date("2021-03-20"), expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) },
      { id: "DOC-004", type: "background_check", name: "Background Check", status: "valid", uploadedAt: new Date("2021-03-10") },
      { id: "DOC-005", type: "certification", name: "HVAC Certification", status: "expiring_soon", uploadedAt: new Date("2022-01-15"), expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000) },
    ],
    jobs: [
      { id: "JOB-101", jobNumber: "JOB-2024-101", title: "Panel Upgrade", clientName: "Robert Chen", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: "completed", role: "Lead Technician", hoursWorked: 6, rating: 5, amount: 450 },
      { id: "JOB-102", jobNumber: "JOB-2024-098", title: "AC Installation", clientName: "Sarah Miller", date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), status: "completed", role: "Technician", hoursWorked: 8, rating: 5, amount: 680 },
      { id: "JOB-103", jobNumber: "JOB-2024-110", title: "Lighting Repair", clientName: "Mike Johnson", date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: "scheduled", role: "Lead Technician", amount: 320 },
      { id: "JOB-104", jobNumber: "JOB-2024-095", title: "Electrical Inspection", clientName: "Lisa Wong", date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), status: "completed", role: "Lead Technician", hoursWorked: 3, rating: 5, amount: 200 },
      { id: "JOB-105", jobNumber: "JOB-2024-088", title: "HVAC Maintenance", clientName: "David Park", date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), status: "completed", role: "Technician", hoursWorked: 4, rating: 4, amount: 350 },
    ],
    payouts: [
      { id: "PAY-001", date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), amount: 2800, type: "salary", status: "paid", period: "Jan 1-15, 2024", reference: "PAY-2024-001" },
      { id: "PAY-002", date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), amount: 2800, type: "salary", status: "paid", period: "Dec 16-31, 2023", reference: "PAY-2023-024" },
      { id: "PAY-003", date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), amount: 500, type: "bonus", status: "paid", reference: "BON-2024-001" },
      { id: "PAY-004", date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), amount: 2800, type: "salary", status: "paid", period: "Dec 1-15, 2023", reference: "PAY-2023-023" },
      { id: "PAY-005", date: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000), amount: 420, type: "overtime", status: "paid", reference: "OT-2023-012" },
    ],
    feedback: [
      { id: "FB-001", jobId: "JOB-101", jobNumber: "JOB-2024-101", clientName: "Robert Chen", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), rating: 5, comment: "John was incredibly professional and knowledgeable. Excellent work!", type: "positive" },
      { id: "FB-002", jobId: "JOB-102", jobNumber: "JOB-2024-098", clientName: "Sarah Miller", date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), rating: 5, comment: "Great service, very punctual and clean work.", type: "positive" },
      { id: "FB-003", jobId: "JOB-104", jobNumber: "JOB-2024-095", clientName: "Lisa Wong", date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), rating: 5, comment: "Thorough inspection and great explanation of findings.", type: "positive" },
      { id: "FB-004", jobId: "JOB-105", jobNumber: "JOB-2024-088", clientName: "David Park", date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), rating: 4, comment: "Good work overall, took a bit longer than expected.", type: "neutral" },
    ],
    tickets: [
      { id: "TKT-001", ticketNumber: "TKT-2024-001", subject: "Late arrival to job site", description: "Arrived 15 minutes late due to traffic.", category: "attendance", priority: "low", status: "closed", jobNumber: "JOB-2024-050", reportedBy: "System", createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), updatedAt: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000), resolvedAt: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000) },
    ],
    schedule: [
      { id: "SCH-001", date: new Date(Date.now()), shiftStart: "08:00", shiftEnd: "17:00", hoursScheduled: 8, hoursWorked: 8, status: "completed" },
      { id: "SCH-002", date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), shiftStart: "08:00", shiftEnd: "17:00", hoursScheduled: 8, status: "scheduled" },
      { id: "SCH-003", date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), shiftStart: "08:00", shiftEnd: "17:00", hoursScheduled: 8, status: "scheduled" },
    ],
  },
  {
    id: "STF-002",
    employeeId: "EMP-2022-005",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@company.com",
    phone: "(555) 234-5678",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    role: "dispatcher",
    department: "Operations",
    status: "active",
    employmentType: "full_time",
    hireDate: new Date("2022-06-01"),
    manager: "STF-003",
    managerName: "Sarah Johnson",
    address: "456 Oak Avenue",
    city: "New York",
    state: "NY",
    zipCode: "10002",
    skills: ["Scheduling", "Customer Service", "Route Optimization", "Communication"],
    certifications: [],
    rating: 4.6,
    totalJobs: 0,
    completedJobs: 0,
    punctualityScore: 99,
    qualityScore: 95,
    customerSatisfaction: 94,
    attendanceRate: 97,
    salary: 52000,
    documents: [
      { id: "DOC-005", type: "id_proof", name: "Passport", status: "valid", uploadedAt: new Date("2022-06-01"), expiresAt: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000) },
      { id: "DOC-006", type: "contract", name: "Employment Contract", status: "valid", uploadedAt: new Date("2022-06-01") },
    ],
    jobs: [],
    payouts: [
      { id: "PAY-004", date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), amount: 2000, type: "salary", status: "paid", period: "Jan 1-15, 2024", reference: "PAY-2024-002" },
      { id: "PAY-010", date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), amount: 2000, type: "salary", status: "paid", period: "Dec 16-31, 2023", reference: "PAY-2023-025" },
    ],
    feedback: [],
    tickets: [],
    schedule: [],
  },
  {
    id: "STF-003",
    employeeId: "EMP-2020-001",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@company.com",
    phone: "(555) 345-6789",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    role: "manager",
    department: "Operations",
    status: "active",
    employmentType: "full_time",
    hireDate: new Date("2020-01-15"),
    address: "789 Pine Street",
    city: "New York",
    state: "NY",
    zipCode: "10003",
    skills: ["Team Management", "Operations", "Strategic Planning", "Customer Relations", "Budgeting"],
    certifications: ["PMP", "Six Sigma Green Belt"],
    rating: 4.9,
    totalJobs: 50,
    completedJobs: 50,
    punctualityScore: 100,
    qualityScore: 99,
    customerSatisfaction: 98,
    attendanceRate: 99,
    salary: 85000,
    documents: [
      { id: "DOC-007", type: "id_proof", name: "Driver's License", status: "valid", uploadedAt: new Date("2020-01-15"), expiresAt: new Date(Date.now() + 500 * 24 * 60 * 60 * 1000) },
      { id: "DOC-008", type: "contract", name: "Employment Contract", status: "valid", uploadedAt: new Date("2020-01-15") },
      { id: "DOC-009", type: "certification", name: "PMP Certificate", status: "valid", uploadedAt: new Date("2020-02-01"), expiresAt: new Date(Date.now() + 400 * 24 * 60 * 60 * 1000) },
      { id: "DOC-010", type: "certification", name: "Six Sigma Green Belt", status: "valid", uploadedAt: new Date("2019-08-15") },
    ],
    jobs: [
      { id: "JOB-301", jobNumber: "JOB-2024-050", title: "Site Inspection", clientName: "Corporate Client", date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), completedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), status: "completed", role: "Manager", hoursWorked: 4, rating: 5, amount: 500 },
    ],
    payouts: [
      { id: "PAY-020", date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), amount: 3269, type: "salary", status: "paid", period: "Jan 1-15, 2024", reference: "PAY-2024-020" },
      { id: "PAY-021", date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), amount: 3269, type: "salary", status: "paid", period: "Dec 16-31, 2023", reference: "PAY-2023-040" },
      { id: "PAY-022", date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), amount: 2000, type: "bonus", status: "paid", reference: "BON-2024-002" },
    ],
    feedback: [
      { id: "FB-010", jobId: "JOB-301", jobNumber: "JOB-2024-050", clientName: "Corporate Client", date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), rating: 5, comment: "Sarah is an exceptional manager. Very professional and thorough.", type: "positive" },
    ],
    tickets: [],
    schedule: [],
  },
  {
    id: "STF-004",
    employeeId: "EMP-2023-010",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.brown@company.com",
    phone: "(555) 456-7890",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    role: "technician",
    department: "Field Operations",
    status: "active",
    employmentType: "full_time",
    hireDate: new Date("2023-02-01"),
    manager: "STF-003",
    managerName: "Sarah Johnson",
    address: "321 Elm Drive",
    city: "Brooklyn",
    state: "NY",
    zipCode: "11201",
    skills: ["Plumbing", "General Maintenance", "Water Heater Installation"],
    certifications: ["Licensed Plumber"],
    rating: 4.3,
    totalJobs: 89,
    completedJobs: 85,
    punctualityScore: 88,
    qualityScore: 90,
    customerSatisfaction: 87,
    attendanceRate: 92,
    hourlyRate: 28,
    documents: [
      { id: "DOC-011", type: "id_proof", name: "Driver's License", status: "valid", uploadedAt: new Date("2023-02-01"), expiresAt: new Date(Date.now() + 600 * 24 * 60 * 60 * 1000) },
      { id: "DOC-012", type: "contract", name: "Employment Contract", status: "valid", uploadedAt: new Date("2023-02-01") },
      { id: "DOC-013", type: "license", name: "Plumbing License", status: "valid", uploadedAt: new Date("2023-02-05"), expiresAt: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000) },
    ],
    jobs: [
      { id: "JOB-201", jobNumber: "JOB-2024-201", title: "Pipe Repair", clientName: "Lisa Anderson", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: "completed", role: "Technician", hoursWorked: 4, rating: 4, amount: 280 },
      { id: "JOB-202", jobNumber: "JOB-2024-195", title: "Water Heater Install", clientName: "James Wilson", date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), status: "completed", role: "Technician", hoursWorked: 6, rating: 4, amount: 520 },
      { id: "JOB-203", jobNumber: "JOB-2024-210", title: "Bathroom Plumbing", clientName: "Karen Lee", date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), status: "scheduled", role: "Technician", amount: 400 },
    ],
    payouts: [
      { id: "PAY-030", date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), amount: 2240, type: "salary", status: "paid", period: "Jan 1-15, 2024", reference: "PAY-2024-030" },
      { id: "PAY-031", date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), amount: 2240, type: "salary", status: "paid", period: "Dec 16-31, 2023", reference: "PAY-2023-050" },
    ],
    feedback: [
      { id: "FB-003", jobId: "JOB-201", jobNumber: "JOB-2024-201", clientName: "Lisa Anderson", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), rating: 4, comment: "Good work, but arrived a bit late.", type: "neutral" },
      { id: "FB-004", jobId: "JOB-202", jobNumber: "JOB-2024-195", clientName: "James Wilson", date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), rating: 4, comment: "Installation went well. Professional work.", type: "positive" },
    ],
    tickets: [
      { id: "TKT-002", ticketNumber: "TKT-2024-015", subject: "Repeated tardiness", description: "Employee has been late 3 times this month.", category: "attendance", priority: "medium", status: "in_progress", reportedBy: "Manager", createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { id: "TKT-003", ticketNumber: "TKT-2024-018", subject: "Customer complaint about communication", description: "Customer reported lack of updates during job.", category: "customer_complaint", priority: "medium", status: "open", jobNumber: "JOB-2024-195", reportedBy: "Customer", createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    ],
    schedule: [],
  },
  {
    id: "STF-005",
    employeeId: "EMP-2021-008",
    firstName: "Jessica",
    lastName: "Wilson",
    email: "jessica.wilson@company.com",
    phone: "(555) 567-8901",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    role: "sales",
    department: "Sales",
    status: "active",
    employmentType: "full_time",
    hireDate: new Date("2021-09-01"),
    manager: "STF-003",
    managerName: "Sarah Johnson",
    address: "567 Market Street",
    city: "Manhattan",
    state: "NY",
    zipCode: "10004",
    skills: ["Sales", "Negotiation", "CRM", "Customer Relations", "Lead Generation"],
    certifications: ["Sales Certification"],
    rating: 4.7,
    totalJobs: 0,
    completedJobs: 0,
    punctualityScore: 95,
    qualityScore: 96,
    customerSatisfaction: 95,
    attendanceRate: 96,
    salary: 60000,
    documents: [
      { id: "DOC-014", type: "id_proof", name: "Driver's License", status: "valid", uploadedAt: new Date("2021-09-01"), expiresAt: new Date(Date.now() + 400 * 24 * 60 * 60 * 1000) },
      { id: "DOC-015", type: "contract", name: "Employment Contract", status: "valid", uploadedAt: new Date("2021-09-01") },
    ],
    jobs: [],
    payouts: [
      { id: "PAY-005", date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), amount: 2308, type: "salary", status: "paid", period: "Jan 1-15, 2024", reference: "PAY-2024-005" },
      { id: "PAY-006", date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), amount: 1500, type: "commission", status: "paid", reference: "COM-2024-001" },
      { id: "PAY-007", date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), amount: 2308, type: "salary", status: "paid", period: "Dec 16-31, 2023", reference: "PAY-2023-026" },
      { id: "PAY-008", date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), amount: 2200, type: "commission", status: "paid", reference: "COM-2023-012" },
    ],
    feedback: [],
    tickets: [],
    schedule: [],
  },
  {
    id: "STF-006",
    employeeId: "EMP-2022-012",
    firstName: "David",
    lastName: "Martinez",
    email: "david.martinez@company.com",
    phone: "(555) 678-9012",
    role: "technician",
    department: "Field Operations",
    status: "on_leave",
    employmentType: "full_time",
    hireDate: new Date("2022-04-15"),
    manager: "STF-003",
    managerName: "Sarah Johnson",
    address: "890 Industrial Blvd",
    city: "Queens",
    state: "NY",
    zipCode: "11101",
    skills: ["HVAC", "Refrigeration", "Air Conditioning"],
    certifications: ["HVAC Certified", "EPA 608"],
    rating: 4.5,
    totalJobs: 120,
    completedJobs: 118,
    punctualityScore: 94,
    qualityScore: 93,
    customerSatisfaction: 92,
    attendanceRate: 90,
    hourlyRate: 32,
    documents: [
      { id: "DOC-016", type: "id_proof", name: "Driver's License", status: "valid", uploadedAt: new Date("2022-04-15"), expiresAt: new Date(Date.now() + 550 * 24 * 60 * 60 * 1000) },
      { id: "DOC-017", type: "contract", name: "Employment Contract", status: "valid", uploadedAt: new Date("2022-04-15") },
      { id: "DOC-018", type: "certification", name: "HVAC Certification", status: "valid", uploadedAt: new Date("2022-04-20"), expiresAt: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000) },
      { id: "DOC-019", type: "certification", name: "EPA 608 Certification", status: "valid", uploadedAt: new Date("2022-04-20") },
    ],
    jobs: [
      { id: "JOB-401", jobNumber: "JOB-2024-080", title: "AC Repair", clientName: "Tom Harris", date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), completedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), status: "completed", role: "Technician", hoursWorked: 5, rating: 5, amount: 380 },
      { id: "JOB-402", jobNumber: "JOB-2024-075", title: "HVAC Maintenance", clientName: "Office Building Inc", date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), completedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), status: "completed", role: "Lead Technician", hoursWorked: 8, rating: 4, amount: 650 },
    ],
    payouts: [
      { id: "PAY-040", date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), amount: 2560, type: "salary", status: "paid", period: "Jan 1-15, 2024", reference: "PAY-2024-040" },
    ],
    feedback: [
      { id: "FB-020", jobId: "JOB-401", jobNumber: "JOB-2024-080", clientName: "Tom Harris", date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), rating: 5, comment: "Excellent service! Fixed our AC quickly.", type: "positive" },
    ],
    tickets: [],
    schedule: [],
  },
  {
    id: "STF-007",
    employeeId: "EMP-2023-020",
    firstName: "Amanda",
    lastName: "Taylor",
    email: "amanda.taylor@company.com",
    phone: "(555) 789-0123",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    role: "support",
    department: "Customer Service",
    status: "active",
    employmentType: "part_time",
    hireDate: new Date("2023-08-01"),
    address: "234 Service Road",
    city: "Bronx",
    state: "NY",
    zipCode: "10451",
    skills: ["Customer Support", "Communication", "Problem Solving", "CRM Software"],
    certifications: [],
    rating: 4.4,
    totalJobs: 0,
    completedJobs: 0,
    punctualityScore: 97,
    qualityScore: 94,
    customerSatisfaction: 93,
    attendanceRate: 95,
    hourlyRate: 18,
    documents: [
      { id: "DOC-020", type: "id_proof", name: "State ID", status: "valid", uploadedAt: new Date("2023-08-01"), expiresAt: new Date(Date.now() + 800 * 24 * 60 * 60 * 1000) },
      { id: "DOC-021", type: "contract", name: "Employment Contract", status: "valid", uploadedAt: new Date("2023-08-01") },
    ],
    jobs: [],
    payouts: [
      { id: "PAY-050", date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), amount: 720, type: "salary", status: "paid", period: "Jan 1-15, 2024", reference: "PAY-2024-050" },
    ],
    feedback: [],
    tickets: [],
    schedule: [],
  },
  {
    id: "STF-008",
    employeeId: "EMP-2019-003",
    firstName: "Robert",
    lastName: "Lee",
    email: "robert.lee@company.com",
    phone: "(555) 890-1234",
    role: "admin",
    department: "Administration",
    status: "active",
    employmentType: "full_time",
    hireDate: new Date("2019-06-01"),
    address: "456 Admin Plaza",
    city: "Manhattan",
    state: "NY",
    zipCode: "10005",
    skills: ["Administration", "HR", "Compliance", "Reporting", "Policy Development"],
    certifications: ["HR Certification", "Compliance Certification"],
    rating: 4.8,
    totalJobs: 0,
    completedJobs: 0,
    punctualityScore: 100,
    qualityScore: 98,
    customerSatisfaction: 96,
    attendanceRate: 99,
    salary: 70000,
    documents: [
      { id: "DOC-022", type: "id_proof", name: "Passport", status: "valid", uploadedAt: new Date("2019-06-01"), expiresAt: new Date(Date.now() + 1000 * 24 * 60 * 60 * 1000) },
      { id: "DOC-023", type: "contract", name: "Employment Contract", status: "valid", uploadedAt: new Date("2019-06-01") },
      { id: "DOC-024", type: "certification", name: "HR Certification", status: "valid", uploadedAt: new Date("2019-07-01") },
      { id: "DOC-025", type: "certification", name: "Compliance Certification", status: "valid", uploadedAt: new Date("2020-03-01") },
    ],
    jobs: [],
    payouts: [
      { id: "PAY-060", date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), amount: 2692, type: "salary", status: "paid", period: "Jan 1-15, 2024", reference: "PAY-2024-060" },
    ],
    feedback: [],
    tickets: [],
    schedule: [],
  },
  {
    id: "STF-009",
    employeeId: "EMP-2020-015",
    firstName: "Jennifer",
    lastName: "Garcia",
    email: "jennifer.garcia@company.com",
    phone: "(555) 901-2345",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
    role: "accounting",
    department: "Finance",
    status: "active",
    employmentType: "full_time",
    hireDate: new Date("2020-11-01"),
    address: "789 Finance Center",
    city: "Manhattan",
    state: "NY",
    zipCode: "10006",
    skills: ["Accounting", "Bookkeeping", "Payroll", "QuickBooks", "Financial Reporting"],
    certifications: ["CPA"],
    rating: 4.9,
    totalJobs: 0,
    completedJobs: 0,
    punctualityScore: 99,
    qualityScore: 99,
    customerSatisfaction: 97,
    attendanceRate: 98,
    salary: 65000,
    documents: [
      { id: "DOC-026", type: "id_proof", name: "Driver's License", status: "valid", uploadedAt: new Date("2020-11-01"), expiresAt: new Date(Date.now() + 450 * 24 * 60 * 60 * 1000) },
      { id: "DOC-027", type: "contract", name: "Employment Contract", status: "valid", uploadedAt: new Date("2020-11-01") },
      { id: "DOC-028", type: "certification", name: "CPA License", status: "valid", uploadedAt: new Date("2020-11-05"), expiresAt: new Date(Date.now() + 700 * 24 * 60 * 60 * 1000) },
    ],
    jobs: [],
    payouts: [
      { id: "PAY-070", date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), amount: 2500, type: "salary", status: "paid", period: "Jan 1-15, 2024", reference: "PAY-2024-070" },
    ],
    feedback: [],
    tickets: [],
    schedule: [],
  },
  {
    id: "STF-010",
    employeeId: "EMP-2022-025",
    firstName: "Chris",
    lastName: "Anderson",
    email: "chris.anderson@company.com",
    phone: "(555) 012-3456",
    role: "technician",
    department: "Field Operations",
    status: "terminated",
    employmentType: "full_time",
    hireDate: new Date("2022-08-15"),
    terminationDate: new Date("2024-01-10"),
    manager: "STF-003",
    managerName: "Sarah Johnson",
    address: "123 Former Street",
    city: "Brooklyn",
    state: "NY",
    zipCode: "11202",
    skills: ["Electrical", "General Maintenance"],
    certifications: [],
    rating: 3.2,
    totalJobs: 45,
    completedJobs: 38,
    punctualityScore: 72,
    qualityScore: 70,
    customerSatisfaction: 65,
    attendanceRate: 75,
    hourlyRate: 25,
    documents: [
      { id: "DOC-029", type: "id_proof", name: "Driver's License", status: "expired", uploadedAt: new Date("2022-08-15"), expiresAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { id: "DOC-030", type: "contract", name: "Employment Contract", status: "expired", uploadedAt: new Date("2022-08-15") },
    ],
    jobs: [
      { id: "JOB-501", jobNumber: "JOB-2023-450", title: "Light Installation", clientName: "Mark Thompson", date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), completedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), status: "completed", role: "Technician", hoursWorked: 3, rating: 3, amount: 200 },
    ],
    payouts: [
      { id: "PAY-080", date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), amount: 2000, type: "salary", status: "paid", period: "Dec 16-31, 2023", reference: "PAY-2023-080" },
    ],
    feedback: [
      { id: "FB-030", jobId: "JOB-501", jobNumber: "JOB-2023-450", clientName: "Mark Thompson", date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), rating: 3, comment: "Work was okay but took longer than expected.", type: "neutral" },
    ],
    tickets: [
      { id: "TKT-010", ticketNumber: "TKT-2023-100", subject: "Multiple no-shows", description: "Employee failed to show up for 3 scheduled jobs.", category: "attendance", priority: "high", status: "closed", reportedBy: "Manager", createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), resolvedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { id: "TKT-011", ticketNumber: "TKT-2023-105", subject: "Poor quality work complaint", description: "Customer reported substandard work quality.", category: "performance", priority: "high", status: "closed", jobNumber: "JOB-2023-440", reportedBy: "Customer", createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), resolvedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { id: "TKT-012", ticketNumber: "TKT-2024-002", subject: "Policy violation", description: "Violated company safety protocols on job site.", category: "policy_violation", priority: "urgent", status: "closed", jobNumber: "JOB-2024-005", reportedBy: "Safety Officer", createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), resolvedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
    ],
    schedule: [],
  },
  {
    id: "STF-011",
    employeeId: "EMP-2023-030",
    firstName: "Nicole",
    lastName: "White",
    email: "nicole.white@company.com",
    phone: "(555) 111-2222",
    avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop",
    role: "technician",
    department: "Field Operations",
    status: "active",
    employmentType: "full_time",
    hireDate: new Date("2023-05-15"),
    manager: "STF-003",
    managerName: "Sarah Johnson",
    address: "555 Tech Lane",
    city: "Staten Island",
    state: "NY",
    zipCode: "10301",
    skills: ["Electrical", "Smart Home Installation", "Security Systems"],
    certifications: ["Licensed Electrician", "Smart Home Certified"],
    rating: 4.7,
    totalJobs: 65,
    completedJobs: 63,
    punctualityScore: 96,
    qualityScore: 97,
    customerSatisfaction: 96,
    attendanceRate: 97,
    hourlyRate: 30,
    documents: [
      { id: "DOC-031", type: "id_proof", name: "Driver's License", status: "valid", uploadedAt: new Date("2023-05-15"), expiresAt: new Date(Date.now() + 900 * 24 * 60 * 60 * 1000) },
      { id: "DOC-032", type: "contract", name: "Employment Contract", status: "valid", uploadedAt: new Date("2023-05-15") },
      { id: "DOC-033", type: "certification", name: "Electrical License", status: "valid", uploadedAt: new Date("2023-05-20"), expiresAt: new Date(Date.now() + 500 * 24 * 60 * 60 * 1000) },
      { id: "DOC-034", type: "background_check", name: "Background Check", status: "valid", uploadedAt: new Date("2023-05-10") },
    ],
    jobs: [
      { id: "JOB-601", jobNumber: "JOB-2024-115", title: "Smart Thermostat Install", clientName: "Patricia Moore", date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), status: "completed", role: "Technician", hoursWorked: 2, rating: 5, amount: 180 },
      { id: "JOB-602", jobNumber: "JOB-2024-112", title: "Security System Setup", clientName: "Richard Brown", date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), status: "completed", role: "Lead Technician", hoursWorked: 5, rating: 5, amount: 450 },
    ],
    payouts: [
      { id: "PAY-090", date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), amount: 2400, type: "salary", status: "paid", period: "Jan 1-15, 2024", reference: "PAY-2024-090" },
    ],
    feedback: [
      { id: "FB-040", jobId: "JOB-601", jobNumber: "JOB-2024-115", clientName: "Patricia Moore", date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), rating: 5, comment: "Nicole was fantastic! Very knowledgeable about smart home tech.", type: "positive" },
      { id: "FB-041", jobId: "JOB-602", jobNumber: "JOB-2024-112", clientName: "Richard Brown", date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), rating: 5, comment: "Excellent security system installation. Very thorough!", type: "positive" },
    ],
    tickets: [],
    schedule: [],
  },
  {
    id: "STF-012",
    employeeId: "EMP-2021-015",
    firstName: "Daniel",
    lastName: "Kim",
    email: "daniel.kim@company.com",
    phone: "(555) 333-4444",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    role: "dispatcher",
    department: "Operations",
    status: "inactive",
    employmentType: "full_time",
    hireDate: new Date("2021-11-01"),
    manager: "STF-003",
    managerName: "Sarah Johnson",
    address: "777 Dispatch Ave",
    city: "Manhattan",
    state: "NY",
    zipCode: "10007",
    skills: ["Dispatching", "Logistics", "GPS Systems", "Customer Communication"],
    certifications: ["Dispatcher Certification"],
    rating: 4.2,
    totalJobs: 0,
    completedJobs: 0,
    punctualityScore: 90,
    qualityScore: 88,
    customerSatisfaction: 85,
    attendanceRate: 88,
    salary: 48000,
    documents: [
      { id: "DOC-035", type: "id_proof", name: "State ID", status: "valid", uploadedAt: new Date("2021-11-01"), expiresAt: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000) },
      { id: "DOC-036", type: "contract", name: "Employment Contract", status: "valid", uploadedAt: new Date("2021-11-01") },
    ],
    jobs: [],
    payouts: [
      { id: "PAY-100", date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), amount: 1846, type: "salary", status: "paid", period: "Nov 16-30, 2023", reference: "PAY-2023-100" },
    ],
    feedback: [],
    tickets: [
      { id: "TKT-020", ticketNumber: "TKT-2023-120", subject: "Extended unauthorized absence", description: "Employee has not reported to work for 2 weeks without notice.", category: "attendance", priority: "high", status: "pending", reportedBy: "HR", createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
    ],
    schedule: [],
  },
];

// Helper types for filters
export const roleOptions = ["All Roles", "admin", "manager", "technician", "dispatcher", "sales", "support", "accounting"] as const;
export const departmentOptions = ["All Departments", "Field Operations", "Operations", "Sales", "Customer Service", "Administration", "Finance"] as const;
export const employmentTypeOptions = ["All Types", "full_time", "part_time", "contract"] as const;