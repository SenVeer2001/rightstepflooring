import { useState } from "react"

import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  pointerWithin,
  type DragEndEvent,
} from "@dnd-kit/core"
import { useSortable } from "@dnd-kit/sortable"
import { useDroppable } from "@dnd-kit/core"
import { LeadCard, type Lead } from "./kanban/leadKanban/LeadCard"

/* ---------------- TYPES ---------------- */

interface KanbanColumn {
  id: string
  title: string
  description?: string
}

interface KanbanBoardProps {
  leads: Lead[]
  onStatusChange: (leadId: string, newStatus: string) => void
  isLoading?: boolean
}

/* ---------------- COLUMNS ---------------- */

const kanbanColumns: KanbanColumn[] = [
  { id: "new", title: "New Leads", description: "Recently added" },
  { id: "contacted", title: "Contacted", description: "Initial contact made" },
  { id: "qualified", title: "Qualified", description: "Lead qualified" },
  { id: "proposal-sent", title: "Proposal Sent", description: "Quote delivered" },
  { id: "follow-up", title: "Follow-up", description: "Pending response" },
  { id: "closed-won", title: "Closed – Won", description: "Deal closed" },
  { id: "closed-lost", title: "Closed – Lost", description: "Lost opportunity" },
]


const statusColorMap: Record<string, { count: string; empty: string }> = { new: { count: "bg-blue-100 text-blue-700", empty: "text-blue-400" }, contacted: { count: "bg-yellow-100 text-yellow-700", empty: "text-yellow-400" }, qualified: { count: "bg-green-100 text-green-700", empty: "text-green-400" }, "proposal-sent": { count: "bg-purple-100 text-purple-700", empty: "text-purple-400", }, "follow-up": { count: "bg-orange-100 text-orange-700", empty: "text-orange-400", }, "closed-won": { count: "bg-emerald-100 text-emerald-700", empty: "text-emerald-400", }, "closed-lost": { count: "bg-red-100 text-red-700", empty: "text-red-400", }, }
/* ---------------- GLASS ---------------- */

const glass =
  "rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.12)]"

/* ---------------- COLUMN ---------------- */

function DroppableColumn({
  column,
  leads,
}: {
  column: KanbanColumn
  leads: Lead[]
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <div
      ref={setNodeRef}
      className={`${glass} min-h-[520px] flex flex-col ${isOver ? "ring-2 ring-yellow-400 bg-yellow-50/40" : ""
        } `}
    >
      {/* Header */}
      <div className={`px-5 py-4 flex justify-between items-start rounded-t-xl ${ statusColorMap[column.id].count }`}>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
          {column.title}
        </h3>
        {column.description && (
          <p className="text-xs text-gray-600 mt-1">
            {column.description}
          </p>
        )}
        </div>
        <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100">
          {leads.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {leads.length ? (
          leads.map((lead) => (
            <DraggableLeadCard key={lead.id} lead={lead} />
          ))
        ) : (
          <div className="flex items-center justify-center h-28 border border-dashed rounded-xl">
            <p className="text-sm text-gray-400">No leads</p>
          </div>
        )}
      </div>
    </div>
  )
}


function DraggableLeadCard({ lead }: { lead: Lead }) {
  const {
    setNodeRef,
    isDragging,
    attributes,
    listeners,
  } = useSortable({ id: lead.id })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ opacity: isDragging ? 0 : 1 }}
      className="cursor-grab active:cursor-grabbing "
    >
      {/* @ts-ignore */}
      <LeadCard lead={lead} index={0} />
    </div>
  )
}



export function KanbanBoard({
  leads,
  onStatusChange,
  isLoading = false,
}: KanbanBoardProps) {
  const [leadsState, setLeadsState] = useState<Lead[]>(leads)
  const [activeLead, setActiveLead] = useState<Lead | null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  )

  const leadsByStatus: Record<string, Lead[]> = {}
  kanbanColumns.forEach((col) => {
    leadsByStatus[col.id] = leadsState.filter(
      (lead) => lead.status === col.id
    )
  })

  const handleDragStart = (event: any) => {
    const lead = leadsState.find((l) => l.id === event.active.id)
    if (lead) setActiveLead(lead)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveLead(null)

    if (!over) return

    const leadId = active.id as string
    const targetColumnId = kanbanColumns.find(
      (col) => col.id === over.id
    )?.id

    if (!targetColumnId) return

    const draggedLead = leadsState.find((l) => l.id === leadId)
    if (!draggedLead || draggedLead.status === targetColumnId) return

    const updatedLeads = leadsState.map((lead) =>
      lead.id === leadId
        ? { ...lead, status: targetColumnId }
        : lead
    )

    // @ts-ignore
    setLeadsState(updatedLeads)
    onStatusChange(leadId, targetColumnId)
  }

  return (
    <div className="w-full p-3 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/40">
      {isLoading ? (
        <div className="py-12 text-center text-gray-500">
          Loading leads...
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="overflow-x-auto pb-4">
            <div className="grid grid-cols-7 gap-4 min-w-max">
              {kanbanColumns.map((column) => (
                <DroppableColumn
                  key={column.id}
                  column={column}
                  leads={leadsByStatus[column.id]}
                />
              ))}
            </div>
          </div>

          {/* DRAG OVERLAY — FOLLOWS CURSOR EXACTLY */}
          <DragOverlay adjustScale={false} dropAnimation={null}>
            {activeLead ? (
              <div className="pointer-events-none w-[280px] shadow-[0_30px_60px_rgba(0,0,0,0.25)] rounded-xl">
                {/* @ts-ignore */}
                <LeadCard lead={activeLead} index={0} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  )
}
