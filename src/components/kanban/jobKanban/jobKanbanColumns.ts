import type { KanbanColumn } from "../types"

export const jobKanbanColumns: KanbanColumn[] = [
  { id: "submitted", title: "Submitted" },
  { id: "in-progress", title: "In Progress" },
  { id: "pending", title: "Pending" },
  { id: "unscheduled", title: "Unscheduled" },
]
