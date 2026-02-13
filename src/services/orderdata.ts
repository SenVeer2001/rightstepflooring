import type { Vendor } from "../types/vendor"



export type WorkOrderStatus =
  | "pending"
  | "in-progress"
  | "completed"
  | "on-hold"

export interface WorkOrder {
  id: string
  jobId: string
  client: string
  technician: string
  createdDate: string
  updatedDate: string
  status: WorkOrderStatus
}
export interface TeamMember {
  id: string
  name: string
}

export const vendorsData: Vendor[] = [
  {
    id: "v1",
    name: "ABC Flooring Supply",
    addresses: [],
    phones: [{ phone: "9876543210" }],
    emails: [{ email: "sales@abc.com" }],
    paymentTerms: "NET_30",
  },
  {
    id: "v2",
    name: "Tile World Distributors",
    addresses: [],
    phones: [{ phone: "9123456780" }],
    emails: [{ email: "contact@tileworld.com" }],
    paymentTerms: "COD",
  },
]

export const teamMembers: TeamMember[] = [
  { id: "t1", name: "John Carter" },
  { id: "t2", name: "Michael Smith" },
  { id: "t3", name: "David Johnson" },
  { id: "t4", name: "Chris Brown" },
]




export const staticWorkOrders: WorkOrder[] = [
  {
    id: "WO-001",
    jobId: "JB-480",
    client: "Robin Stevens",
    technician: "Mike Johnson",
    createdDate: "Jan 10, 2026",
    updatedDate: "Jan 12, 2026",
    status: "in-progress",
  },
  {
    id: "WO-002",
    jobId: "JB-507",
    client: "Teresa Lafoon",
    technician: "Lisa Brown",
    createdDate: "Jan 9, 2026",
    updatedDate: "Jan 11, 2026",
    status: "pending",
  },
  {
    id: "WO-003",
    jobId: "JB-506",
    client: "Kristopher Decker",
    technician: "Tom Davis",
    createdDate: "Jan 12, 2026",
    updatedDate: "Jan 13, 2026",
    status: "completed",
  },
  {
    id: "WO-004",
    jobId: "JB-505",
    client: "William Chase",
    technician: "Sarah Miller",
    createdDate: "Jan 8, 2026",
    updatedDate: "Jan 10, 2026",
    status: "on-hold",
  },
  {
    id: "WO-005",
    jobId: "JB-504",
    client: "Jennifer Wilson",
    technician: "Mike Johnson",
    createdDate: "Jan 7, 2026",
    updatedDate: "Jan 9, 2026",
    status: "completed",
  },
  {
    id: "WO-006",
    jobId: "JB-503",
    client: "Robert Martinez",
    technician: "John Smith",
    createdDate: "Jan 6, 2026",
    updatedDate: "Jan 8, 2026",
    status: "in-progress",
  },
]
