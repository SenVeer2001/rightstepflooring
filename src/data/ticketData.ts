// data/ticketData.ts

export type TicketPriority = "Normal" | "Urgent" | "Low" | "High";
export type TicketStatus = "Open" | "In Progress" | "Resolved" | "Closed" | "On Hold";

export interface Ticket {
  id: number;
    woId: string;  
  date: string;
  customer: string;
   address?: string;
  jobProject: string;
  category: string;
  subCategory: string;
  details: string;
  createdBy: string;
  subContractor: string;  // Changed from assignedTo
  coAssign: string;       // New field - Staff
  priority: TicketPriority;
  status: TicketStatus;
  files: string[];
}

// Priority Chart Data
export const priorityData = [
  { name: "Normal", value: 45, color: "#3B82F6" },    // Blue
  { name: "Low", value: 20, color: "#10B981" },       // Green
  { name: "High", value: 25, color: "#F59E0B" },      // Yellow
  { name: "Urgent", value: 10, color: "#EF4444" },    // Red
];

// Status Chart Data
export const statusData = [
  { name: "Open", value: 20, color: "#3B82F6" },           // Blue
  { name: "In Progress", value: 35, color: "#F59E0B" },    // Yellow
  { name: "Resolved", value: 25, color: "#10B981" },       // Green
  { name: "Closed", value: 15, color: "#6B7280" },         // Gray
  { name: "On Hold", value: 5, color: "#EF4444" },         // Red
];

// Category Options
export const ticketCategories = [
  "Installation Issue",
  "Material Defect",
  "Scheduling",
  "Billing & Payment",
  "Warranty Claim",
  "Quality Complaint",
  "Damage Report",
  "Service Request",
  "General Inquiry",
];

// Sub Category Options
export const ticketSubCategories: Record<string, string[]> = {
  "Installation Issue": ["Uneven Flooring", "Gaps Between Planks", "Squeaky Floor", "Poor Finishing", "Wrong Pattern"],
  "Material Defect": ["Cracked Tiles", "Discoloration", "Warped Wood", "Damaged in Transit", "Wrong Material"],
  "Scheduling": ["Delayed Installation", "Reschedule Request", "No Show", "Time Conflict"],
  "Billing & Payment": ["Invoice Error", "Overcharge", "Payment Not Received", "Refund Request"],
  "Warranty Claim": ["Floor Damage", "Fading Color", "Peeling", "Manufacturer Defect"],
  "Quality Complaint": ["Poor Workmanship", "Substandard Material", "Not as Expected"],
  "Damage Report": ["Water Damage", "Scratch Marks", "Stains", "Cracks"],
  "Service Request": ["Repair", "Replacement", "Maintenance", "Inspection"],
  "General Inquiry": ["Product Info", "Price Quote", "Availability", "Other"],
};

// Sub Contractors
export const subContractors = [
  { id: "sc-1", name: "Mike's Flooring Co.", specialty: "Hardwood" },
  { id: "sc-2", name: "Premium Tile Works", specialty: "Tiles" },
  { id: "sc-3", name: "Carpet Masters", specialty: "Carpet" },
  { id: "sc-4", name: "Vinyl Pro Installers", specialty: "Vinyl" },
  { id: "sc-5", name: "Floor Tech Solutions", specialty: "All Types" },
];

// Staff Members (Co-Assign)
export const staffMembers = [
  { id: "st-1", name: "John Smith", role: "Project Manager" },
  { id: "st-2", name: "Sarah Johnson", role: "Customer Service" },
  { id: "st-3", name: "Mike Wilson", role: "Quality Inspector" },
  { id: "st-4", name: "Emily Davis", role: "Coordinator" },
  { id: "st-5", name: "Robert Brown", role: "Supervisor" },
];

// Flooring-related Tickets
export const tickets: Ticket[] = [
  {
    id: 1001,
    woId: "001",
    date: "25 Jul 2025 | 04:46 PM",
    customer: "Johnson Residence",
    address: '123 Oak Street',
    jobProject: "Hardwood Floor Installation",
    category: "Installation Issue",
    subCategory: "Uneven Flooring",
    details: "Customer reported uneven surface near the kitchen entrance after hardwood installation",
    createdBy: "Sarah Johnson",
    subContractor: "Mike's Flooring Co.",
    coAssign: "John Smith",
    priority: "High",
    status: "In Progress",
    files: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
      "https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg",
    ],
  },
  {
    id: 1002,
    woId: "002",
    date: "26 Jul 2025 | 10:30 AM",
    customer: "Oak Valley Apartments",
     address: '456 Elm Avenue',
    jobProject: "Vinyl Flooring - Unit 4B",
    category: "Material Defect",
    subCategory: "Discoloration",
    details: "Vinyl planks showing discoloration within 2 weeks of installation.",
    createdBy: "Emily Davis",
    subContractor: "Vinyl Pro Installers",
    coAssign: "Mike Wilson",
    priority: "Urgent",
    status: "Open",
    files: [
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
    ],
  },
  {
    id: 1003,
    woId: "003",
    date: "27 Jul 2025 | 02:15 PM",
    customer: "Martinez Family Home",
      address: '789 Pine Road',
    jobProject: "Ceramic Tile Bathroom",
    category: "Quality Complaint",
    subCategory: "Poor Workmanship",
    details: "Grout lines are uneven and some tiles have visible chips.",
    createdBy: "Admin",
    subContractor: "Premium Tile Works",
    coAssign: "Robert Brown",
    priority: "High",
    status: "In Progress",
    files: [],
  },
  {
    id: 1004,
    woId: "004",
    date: "28 Jul 2025 | 09:00 AM",
    customer: "Riverside Office Complex",
      address: '321 Maple Drive',
    jobProject: "Commercial Carpet Installation",
    category: "Scheduling",
    subCategory: "Delayed Installation",
    details: "Installation delayed by 3 days due to material shortage.",
    createdBy: "John Smith",
    subContractor: "Carpet Masters",
    coAssign: "Sarah Johnson",
    priority: "Normal",
    status: "On Hold",
    files: [],
  },
  {
    id: 1005,
    woId: "005",
    date: "29 Jul 2025 | 11:45 AM",
    customer: "Thompson House",
    address: '654 Cedar Lane',
    jobProject: "Laminate Flooring - Living Room",
    category: "Warranty Claim",
    subCategory: "Peeling",
    details: "Laminate edges peeling after 6 months.",
    createdBy: "Mike Wilson",
    subContractor: "Floor Tech Solutions",
    coAssign: "Emily Davis",
    priority: "Normal",
    status: "Open",
    files: [],
  },
  {
    id: 1006,
    woId: "006",
    date: "30 Jul 2025 | 03:30 PM",
    customer: "Greenwood Residence",
    address: '987 Birch Court',
    jobProject: "Engineered Wood Flooring",
    category: "Damage Report",
    subCategory: "Water Damage",
    details: "Water leak caused damage to newly installed flooring.",
    createdBy: "Sarah Johnson",
    subContractor: "Mike's Flooring Co.",
    coAssign: "John Smith",
    priority: "Urgent",
    status: "In Progress",
    files: [],
  },
  {
    id: 1007,
    woId: "007",
    date: "31 Jul 2025 | 10:00 AM",
    customer: "Sunset Villa HOA",
    jobProject: "Common Area Tile Replacement",
    category: "Billing & Payment",
    subCategory: "Invoice Error",
    details: "Client disputes invoice amount.",
    createdBy: "Admin",
    subContractor: "Premium Tile Works",
    coAssign: "Sarah Johnson",
    priority: "Low",
    status: "Resolved",
    files: [],
  },
  {
    id: 1008,
    woId: "008",
    date: "01 Aug 2025 | 01:20 PM",
    customer: "Chen Family Home",
    jobProject: "Luxury Vinyl Plank - Whole House",
    category: "Service Request",
    subCategory: "Maintenance",
    details: "Annual maintenance request.",
    createdBy: "Emily Davis",
    subContractor: "Vinyl Pro Installers",
    coAssign: "Mike Wilson",
    priority: "Low",
    status: "Closed",
    files: [],
  },
];
