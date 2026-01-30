"use client"

import { Trash2, Search, Download } from "lucide-react"
import { useMemo, useState } from "react"

/* ================= TYPES ================= */

interface ItemCategories {
  id: string
  name: string
  image?: string
  description: string
  Parent_category: string
  activeItems: string
  status?: "active" | "inactive"
  category: string
}

interface ItemCategoriesProps {
  onRowClick: (category: ItemCategories) => void
}

/* ================= DATA ================= */

const Items: ItemCategories[] = [
  {
    id: "1",
    name: "Flooring Installation",
    image: "https://images.pexels.com/photos/4263067/pexels-photo-4263067.jpeg",
    description: "Professional flooring installation services",
    Parent_category: "Flooring Services",
    activeItems: "Dustless Sanding and Refinishing",
    status: "active",
    category: "Dustless Sanding and Refinishing",
  },
  {
    id: "2",
    name: "Kitchen Remodeling",
    image: "https://images.pexels.com/photos/10827197/pexels-photo-10827197.jpeg",
    description: "Comprehensive kitchen remodeling solutions",
    Parent_category: "Kitchen Services",
    activeItems: "Cabinet Installation",
    status: "inactive",
    category: "Bathroom Services",
  },
]

/* ================= COMPONENT ================= */

export default function ItemCategories({
  onRowClick,
}: ItemCategoriesProps) {
  const [searchText, setSearchText] = useState("")
  const [statusFilter, setStatusFilter] =
    useState<"all" | "active" | "inactive">("all")

  const filteredItems = useMemo(() => {
    return Items.filter(item => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase()) ||
        item.Parent_category.toLowerCase().includes(searchText.toLowerCase())

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [searchText, statusFilter])

  return (
    <div className="space-y-4">

      {/* SEARCH */}
      <div className="flex gap-4 items-center justify-between">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            placeholder="Search categories..."
            value={searchText}
            onChange={event => setSearchText(event.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={event =>
              setStatusFilter(event.target.value as any)
            }
            className="px-3 py-2 border rounded-lg text-sm bg-gray-50"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full bg-gray-50 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Parent Category</th>
              <th className="px-4 py-3 text-left">Active Items</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.map(item => (
              <tr
                key={item.id}
                onClick={() => onRowClick(item)}
                className="border-t hover:bg-primary/10 cursor-pointer"
              >
                <td className="px-4 py-3 font-medium flex items-center gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      className="w-10 h-10 rounded object-cover"
                    />
                  )}
                  {item.name}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {item.description || "—"}
                </td>

                <td className="px-4 py-3">{item.Parent_category}</td>
                <td className="px-4 py-3">{item.activeItems}</td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  <Trash2 className="text-gray-500 hover:text-red-500" size={16} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
