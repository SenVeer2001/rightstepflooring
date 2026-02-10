import type { KanbanColumn } from "../types"

export const leadKanbanColumns: KanbanColumn[] = [
  { id: "new", title: "New Leads", description: "Recently added" },
  { id: "contacted", title: "Contacted", description: "Initial contact made" },
  { id: "qualified", title: "Qualified", description: "Lead qualified" },
  { id: "proposal-sent", title: "Proposal Sent", description: "Quote delivered" },
  { id: "follow-up", title: "Follow-up", description: "Pending response" },
  { id: "closed-won", title: "Closed – Won", description: "Deal closed" },
  { id: "closed-lost", title: "Closed – Lost", description: "Lost opportunity" },
]
