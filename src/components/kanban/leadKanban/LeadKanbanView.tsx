import { BaseKanbanBoard } from "../KanbanBoard"
import { leadKanbanColumns } from "./leadKanbanColumns"
import { LeadCard, type Lead } from "./LeadCard"

export function LeadKanbanBoard({
  leads,
  onLeadsUpdate,
}: {
  leads: Lead[]
  onLeadsUpdate: (leads: Lead[]) => void
}) {
  const handleStatusChange = (leadId: string, status: string) => {
    const updatedLeads = leads.map(lead =>
      lead.id === leadId ? { ...lead, status } : lead
    )
    // @ts-ignore
    onLeadsUpdate(updatedLeads)
  }

  return (
    <BaseKanbanBoard
      items={leads}
      columns={leadKanbanColumns}
      onStatusChange={handleStatusChange}
      // @ts-ignore
      renderCard={(lead) => <LeadCard lead={lead} index={0} />}
    />
  )
}
