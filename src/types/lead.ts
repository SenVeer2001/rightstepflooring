import type { LeadStatus } from "../components/LeadModal"

export interface KanbanItemBase {
  id: string
  status: string
}

// Lead interface that extends KanbanItemBase
export interface Lead extends KanbanItemBase {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  service?: string
  budget?: number
  createdAt?: string
  status: LeadStatus
  source: string
  type?: string
  tags?: string[]
  requirement?: string
  createdDate?: string
}