import { useState, useEffect } from "react"
import type { Lead } from "../../components/LeadCard"
import { LeadsService } from "../../services/leadService"
import { KanbanBoard } from "../../components/KanbanBoard"

/* ---------------- TYPES ---------------- */

type LeadInput = Partial<Lead> & {
  id: string
  name: string
  email: string
  phone: string
  budget: number
  status: string
}

interface KanbanViewProps {
  leads: LeadInput[]
  onLeadsUpdate?: (leads: Lead[]) => void
}

/* ---------------- HELPERS ---------------- */

function normalizeLead(lead: LeadInput): Lead {
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    budget: lead.budget,
    status: lead.status,
    createdAt: lead.createdAt ?? new Date().toISOString(),
    address: lead.address ?? "",
    city: lead.city ?? "",
    state: lead.state ?? "",
    service: lead.service ?? "",
    source: lead.source ?? "Direct Input",
    requirement: lead.requirement ?? "",
  }
}



export function KanbanView({ leads: initialLeads, onLeadsUpdate }: KanbanViewProps) {
  const [leads, setLeads] = useState<Lead[]>(
    initialLeads.map(normalizeLead)
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLeads(initialLeads.map(normalizeLead))
  }, [initialLeads])

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      setError(null)

      try {
        await LeadsService.updateLeadStatus(leadId, newStatus)
      } catch {
        console.log("Mock mode: API unavailable")
      }

      const updatedLeads = leads.map(lead =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )

      setLeads(updatedLeads)
      onLeadsUpdate?.(updatedLeads)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update lead status"
      setError(message)
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <KanbanBoard
        leads={leads}
        onStatusChange={handleStatusChange}
        isLoading={isLoading}
      />
    </div>
  )
}
