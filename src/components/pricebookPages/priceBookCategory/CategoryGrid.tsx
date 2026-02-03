import { Edit2 } from "lucide-react"
import type { Category } from "../../../types/priceBook"

interface Props {
  categories: Category[]
  onSelect: (category: Category) => void
  onEdit: (category: Category) => void
}

export function CategoryGrid({
  categories,
  onSelect,
  onEdit,
}: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {categories.map(cat => (
        <div key={cat.id} className="relative  bg-white rounded-xl border
                       hover:shadow-md transition p-2 text-left flex flex-col justify-between">

      
          <button
            onClick={() => onSelect(cat)}
            className="w-full"
          >
            <img
              src={cat.image}
              className="h-30 w-full object-cover mb-3 rounded-lg"
            />
            <p className="font-semibold text-sm text-left">{cat.name}</p>
          </button>

          {/* FOOTER */}
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-primary">
              {cat.subCategories.length} sub-categories
            </p>

           
            <button
              onClick={e => {
                e.stopPropagation() // 🚨 VERY IMPORTANT
                onEdit(cat)
              }}
              className="px-1.5 py-1.5 text-white bg-primary rounded-full"
            >
              <Edit2 size={14} />
            </button>
          </div>

        </div>
      ))}
    </div>
  )
}
