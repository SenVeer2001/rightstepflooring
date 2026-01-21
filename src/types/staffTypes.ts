/* ===================== TYPES ===================== */

export type StaffStatus =
  | "active"
  | "inactive"
  | "on_leave"

export interface Staff {
  id: string
  name: string
  phone: string
  field: string
  type: string
  skills: string[]
  area: string
  status: StaffStatus
  createdDate: string
}


/* ===================== STATUS LABELS ===================== */

export const STAFF_STATUS_LABELS: Record<StaffStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  on_leave: "On Leave",
}

/* ===================== STATUS STYLES ===================== */

export const staffStatusStyles: Record<StaffStatus, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-200 text-gray-700",
  on_leave: "bg-yellow-100 text-yellow-800",
}

export interface StaffFormData {
  name: string
  phone: string
  field: string
  type: string
  skills: string[]
  area: string
  status: string
  imageFile?: File | null
}
