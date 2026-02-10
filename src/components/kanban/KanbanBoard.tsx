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
import type { KanbanItemBase, KanbanColumn, KanbanTheme } from "./types"

/* ---------------- GLASS ---------------- */

const glass =
  "rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.12)]"

/* ---------------- COLUMN ---------------- */



function DroppableColumn<T extends KanbanItemBase>({
  column,
  items,
  renderCard,
}: {
  column: KanbanColumn
  items: T[]
  renderCard: (item: T) => React.ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <div
      ref={setNodeRef}
      className={`${glass} min-h-[520px] flex flex-col ${
        isOver ? "ring-2 ring-yellow-400 bg-yellow-50/40" : ""
      }`}
    >
      {/* Header */}
      <div
        className={`px-5 py-4 flex justify-between items-start rounded-t-xl
        ${column.headerClass ?? "bg-gray-100 text-gray-700"}
      `}
      >

        <div>
          <h3 className="text-sm font-semibold">
            {column.title}
          </h3>
          {column.description && (
            <p className="text-xs mt-1 opacity-70">
              {column.description}
            </p>
          )}
        </div>

        <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/70">
          {items.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {items.length ? (
          items.map(item => (
            <DraggableCard key={item.id} itemId={item.id}>
              {renderCard(item)}
            </DraggableCard>
          ))
        ) : (
          <div className="flex items-center justify-center h-28 border border-dashed rounded-xl">
            <p className="text-sm text-gray-400">No items</p>
          </div>
        )}
      </div>
    </div>
  )
}



function DraggableCard({
  itemId,
  children,
}: {
  itemId: string
  children: React.ReactNode
}) {
  const { setNodeRef, isDragging, attributes, listeners } =
    useSortable({ id: itemId })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ opacity: isDragging ? 0 : 1 }}
      className="cursor-grab active:cursor-grabbing"
    >
      {children}
    </div>
  )
}

/* ---------------- BOARD ---------------- */

export function BaseKanbanBoard<T extends KanbanItemBase>({
  items,
  columns,
  renderCard,
  onStatusChange,
  theme,
}: {
  items: T[]
  columns: KanbanColumn[]
  renderCard: (item: T) => React.ReactNode
  onStatusChange: (itemId: string, newStatus: string) => void
  theme?: KanbanTheme
}) {
  const [itemsState, setItemsState] = useState<T[]>(items)
  const [activeItem, setActiveItem] = useState<T | null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  )

  const itemsByStatus: Record<string, T[]> = {}
  columns.forEach(col => {
    itemsByStatus[col.id] = itemsState.filter(
      item => item.status === col.id
    )
  })

  const handleDragStart = (event: any) => {
    const item = itemsState.find(i => i.id === event.active.id)
    if (item) setActiveItem(item)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveItem(null)

    if (!over) return

    const targetStatus = columns.find(col => col.id === over.id)?.id
    if (!targetStatus) return

    const draggedItem = itemsState.find(i => i.id === active.id)
    if (!draggedItem || draggedItem.status === targetStatus) return

    const updatedItems = itemsState.map(item =>
      item.id === active.id
        ? { ...item, status: targetStatus }
        : item
    )

    setItemsState(updatedItems)
    onStatusChange(active.id as string, targetStatus)
  }

  return (
    <div
      className={`w-full p-3 rounded-2xl backdrop-blur-xl border
      ${theme?.boardBg ?? "bg-white/30 border-white/40"}
    `}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto pb-4">
          <div
            className="grid gap-4 min-w-max"
            style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(280px, 1fr))` }}
          >
            {columns.map(column => (
              <DroppableColumn
                key={column.id}
                column={column}
                items={itemsByStatus[column.id] || []}
                renderCard={renderCard}
              />
            ))}
          </div>
        </div>

        <DragOverlay adjustScale={false} dropAnimation={null}>
          {activeItem ? (
            <div className="pointer-events-none w-[280px] shadow-[0_30px_60px_rgba(0,0,0,0.25)] rounded-xl">
              {renderCard(activeItem)}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
