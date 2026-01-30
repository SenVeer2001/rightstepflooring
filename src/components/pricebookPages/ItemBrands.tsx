"use client"

import { Trash2, Search } from "lucide-react"
import { useMemo, useState } from "react"

interface ItemBrand {
  id: string
  name: string
  description: string
}

interface ItemBrandsTableProps {
  onRowClick: (brand: ItemBrand) => void
}

const Brands: ItemBrand[] = [
  {
    id: "1",
    name: "Mohawk",
    description: "A leading flooring manufacturer offering durable solutions.",
  },
  {
    id: "2",
    name: "Cali Floors",
    description: "Premium hardwood, bamboo, and luxury vinyl flooring.",
  },
]

export default function ItemBrandsTable({
  onRowClick,
}: ItemBrandsTableProps) {
  const [searchText, setSearchText] = useState("")

  const filteredBrands = useMemo(() => {
    return Brands.filter(brand =>
      brand.name.toLowerCase().includes(searchText.toLowerCase())
    )
  }, [searchText])

  return (
    <div className="space-y-4">

      {/* SEARCH */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        <input
          placeholder="Search"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm bg-gray-50">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredBrands.map(brand => (
              <tr
                key={brand.id}
                onClick={() => onRowClick(brand)}
                className="border-t bg-gray-50 hover:bg-primary/10 cursor-pointer"
              >
                <td className="px-4 py-3 font-medium">{brand.name}</td>
                <td className="px-4 py-3 text-gray-600">
                  {brand.description || "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  <Trash2
                    size={16}
                    className="inline text-gray-500 hover:text-red-500"
                    onClick={e => e.stopPropagation()}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
