import { useMemo, useState } from "react"
import { Download, Search } from "lucide-react"

interface Item {
  id: string
  image: string
  name: string
  description: string
  price: number
  cost: number
  type: string
  category: string
  model?: string
  brand?: string
  booking?: string
  inventory?: string
  taxable?: string
  status: "active" | "inactive"
}

interface ItemsProductsTableProps {
  onRowClick: (item: Item) => void
}

const ITEMS_DATA: Item[] = [
  {
    id: "1001",
    image: "https://images.pexels.com/photos/7491011/pexels-photo-7491011.jpeg",
    name: "Measurement & Estimate",
    description: "Home floor measurement and estimate for full house",
    price: 0,
    cost: 0,
    type: "Service",
    category: "Additional Service",
    model: "ME-001",
    brand: "RSF",
    booking: "No",
    inventory: "N/A",
    taxable: "No",
    status: "active",
  },
  {
    id: "1002",
    image: "https://images.pexels.com/photos/5974037/pexels-photo-5974037.jpeg",
    name: "Hardwood Install",
    description: "Nailed hardwood install per sq ft labor charge",
    price: 3.5,
    cost: 1.7,
    type: "Service",
    category: "Flooring",
    model: "HI-002",
    brand: "RSF",
    booking: "No",
    inventory: "N/A",
    taxable: "Yes",
    status: "inactive",
  },
]

export default function ItemsProductsTable({
  onRowClick,
}: ItemsProductsTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchText, setSearchText] = useState("")
  const [statusFilter, setStatusFilter] =
    useState<"all" | "active" | "inactive">("all")

  /* ================= FILTER ================= */

  const filteredItems = useMemo(() => {
    return ITEMS_DATA.filter(item => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase()) ||
        item.id.includes(searchText)

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [searchText, statusFilter])

  /* ================= SELECTION ================= */

  const isAllSelected =
    filteredItems.length > 0 &&
    filteredItems.every(item => selectedIds.includes(item.id))

  const toggleSelectAll = () => {
    setSelectedIds(isAllSelected ? [] : filteredItems.map(i => i.id))
  }

  const toggleRowSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  /* ================= UI ================= */

  return (
    <div className="rounded-xl space-y-4">

      {/* TOP BAR */}
      <div className="flex gap-4 items-center justify-between">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            placeholder="Search items..."
            value={searchText}
            onChange={event => setSearchText(event.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm
                       focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={event => setStatusFilter(event.target.value as any)}
            className="px-3 py-2 border rounded-lg min-w-[200px]
                       text-sm bg-gray-50"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2
                             text-sm border rounded-lg hover:bg-gray-50">
            <Download size={16} className="text-primary" />
            Export
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="border rounded-xl overflow-hidden bg-white">
        <div className="max-h-[420px] overflow-auto">
          <table className="min-w-[1300px] w-full text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="p-3">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="accent-primary"
                  />
                </th>
                <th className="p-3 text-left">Item</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3">Price</th>
                <th className="p-3">Cost</th>
                <th className="p-3">Type</th>
                <th className="p-3">Category</th>
                <th className="p-3">Model</th>
                <th className="p-3">Brand</th>
                <th className="p-3">Booking</th>
                <th className="p-3">Inventory</th>
                <th className="p-3">Taxable</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map(item => (
                <tr
                  key={item.id}
                  onClick={() => onRowClick(item)}
                  className="border-b hover:bg-primary/10 cursor-pointer"
                >
                  {/* CHECKBOX */}
                  <td
                    className="p-3"
                    onClick={event => event.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleRowSelect(item.id)}
                      className="accent-primary"
                    />
                  </td>

                  {/* ITEM */}
                  <td className="p-3">
                    <div className="flex gap-3 items-center">
                      <img
                        src={item.image}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div>
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-xs text-gray-500">
                          #{item.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3 max-w-[250px]">
                    <div className="truncate text-gray-700">
                      {item.description}
                    </div>
                  </td>

                  <td className="p-3 text-center">${item.price}</td>
                  <td className="p-3 text-center">${item.cost}</td>
                  <td className="p-3 text-center">{item.type}</td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3 text-center">{item.model}</td>
                  <td className="p-3 text-center">{item.brand}</td>
                  <td className="p-3 text-center">{item.booking}</td>
                  <td className="p-3 text-center">{item.inventory}</td>
                  <td className="p-3 text-center">{item.taxable}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No items found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
