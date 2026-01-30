"use client"

import { Trash2, Search, Download } from "lucide-react"
import { useMemo, useState } from "react"

/* ================= TYPES ================= */

interface GroupItemData {
  id: string
  name: string
  price: number
  cost: number
  quantity: number
}

interface ItemGroup {
  id: string
  name: string
  image?: string
  description: string

  /** Display-only (table column) */
  items: string

  /** Real editable data (used by modal) */
  itemsData: GroupItemData[]

  groupType: string
  total: string
  status?: "active" | "inactive"
  category: string
}

interface ItemsGroupTableProps {
  onRowClick: (group: ItemGroup) => void
}

/* ================= MOCK DATA ================= */

const mockItemGroups: ItemGroup[] = [
  {
    id: "1",
    name: "Natural Sanding & Refinishing",
    image: "https://images.pexels.com/photos/5095271/pexels-photo-5095271.jpeg",
    description: "Includes sanding & refinishing",
    items: "Dustless Sanding and Refinishing",
    itemsData: [
      {
        id: "2",
        name: "Hardwood Install",
        price: 3.5,
        cost: 1.7,
        quantity: 1,
      },
    ],
    groupType: "Individual",
    total: "$71.10",
    status: "active",
    category: "Dustless Sanding and Refinishing",
  },
  {
    id: "2",
    name: "Bathroom Remodel",
    image: "https://images.pexels.com/photos/11701114/pexels-photo-11701114.jpeg",
    description: "",
    items: "Demolition and prep, Vanity and fixtures",
    itemsData: [],
    groupType: "Individual",
    total: "$20,150.00",
    status: "inactive",
    category: "",
  },
]

/* ================= COMPONENT ================= */

export default function ItemGroupsTable({
  onRowClick,
}: ItemsGroupTableProps) {
  const [searchText, setSearchText] = useState("")
  const [statusFilter, setStatusFilter] =
    useState<"all" | "active" | "inactive">("all")

  const filteredItems = useMemo(() => {
    return mockItemGroups.filter(group => {
      const matchesSearch =
        group.name.toLowerCase().includes(searchText.toLowerCase()) ||
        group.description.toLowerCase().includes(searchText.toLowerCase()) ||
        group.id.includes(searchText)

      const matchesStatus =
        statusFilter === "all" || group.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [searchText, statusFilter])

  return (
    <div className="space-y-4">

      {/* INFO */}
      <p className="text-sm text-gray-600">
        Item groups help you add multiple items to invoices and estimates
      </p>

      {/* FILTER BAR */}
      <div className="flex gap-4 items-center justify-between">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            placeholder="Search item groups..."
            value={searchText}
            onChange={event => setSearchText(event.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={event =>
              setStatusFilter(event.target.value as any)
            }
            className="px-3 py-2 border rounded-lg min-w-[200px] text-sm bg-gray-50"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">
            <Download size={16} className="text-primary" />
            Export
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm bg-gray-50">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Items</th>
              <th className="px-4 py-3 text-left">Group type</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.map(group => (
              <tr
                key={group.id}
                onClick={() => onRowClick(group)}
                className="border-b hover:bg-primary/10 cursor-pointer"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {group.image && (
                      <img
                        src={group.image}
                        className="w-10 h-10 rounded object-cover"
                      />
                    )}
                    <span className="font-medium">{group.name}</span>
                  </div>
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {group.description || "—"}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {group.items}
                </td>

                <td className="px-4 py-3">
                  {group.groupType}
                </td>

                <td className="px-4 py-3">
                  {group.total}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {group.category || "—"}
                </td>

                <td
                  className="px-4 py-3"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex justify-center">
                    <button className="text-gray-500 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredItems.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-gray-500"
                >
                  No item groups found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
