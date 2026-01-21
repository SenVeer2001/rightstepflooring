import { X, Minus, Plus, Pencil } from "lucide-react"
import { useState } from "react"


interface PriceBookItem {
  id: string
  name: string
  price: number
  image: string
}

interface PriceBookCategory {
  id: string
  name: string
  image: string
  items: PriceBookItem[]
}

const priceBookData: PriceBookCategory[] = [
  {
    id: "flooring",
    name: "Flooring Install",
    image: "https://images.unsplash.com/photo-1582582494700-2a0f06d43e0c",
    items: [
      {
        id: "lvp",
        name: "LVP Installation",
        price: 2.5,
        image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
      },
      {
        id: "engineered-hardwood",
        name: "Engineered Hardwood Install",
        price: 3.5,
        image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e",
      },
      {
        id: "solid-hardwood",
        name: "Solid Hardwood Install",
        price: 4.25,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      },
      {
        id: "laminate",
        name: "Laminate Flooring Install",
        price: 2.2,
        image: "https://images.unsplash.com/photo-1582582494700-2a0f06d43e0c",
      },
      {
        id: "tile-install",
        name: "Tile Flooring Install",
        price: 5.75,
        image: "https://images.unsplash.com/photo-1586105251261-72a756497a11",
      },
    ],
  },
  {
    id: "carpet",
    name: "Carpet Services",
    image: "https://images.unsplash.com/photo-1586105251261-72a756497a11",
    items: [
      {
        id: "carpet-install",
        name: "Carpet Installation",
        price: 1.67,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      },
      {
        id: "carpet-removal",
        name: "Carpet Removal",
        price: 0.75,
        image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e",
      },
      {
        id: "carpet-stretch",
        name: "Carpet Stretching",
        price: 1.25,
        image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
      },
      {
        id: "carpet-repair",
        name: "Carpet Repair",
        price: 85,
        image: "https://images.unsplash.com/photo-1586105251261-72a756497a11",
      },
    ],
  },
  {
    id: "stairs",
    name: "Stairs",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
    items: [
      {
        id: "stair-carpet",
        name: "Carpet Stair Installation",
        price: 75,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      },
      {
        id: "stair-hardwood",
        name: "Hardwood Stair Install",
        price: 120,
        image: "https://images.unsplash.com/photo-1582582494700-2a0f06d43e0c",
      },
      {
        id: "stair-nosing",
        name: "Stair Nosing Install",
        price: 45,
        image: "https://images.unsplash.com/photo-1586105251261-72a756497a11",
      },
    ],
  },
  {
    id: "prep-work",
    name: "Prep & Removal",
    image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e",
    items: [
      {
        id: "floor-removal",
        name: "Old Floor Removal",
        price: 1.25,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      },
      {
        id: "subfloor-repair",
        name: "Subfloor Repair",
        price: 95,
        image: "https://images.unsplash.com/photo-1586105251261-72a756497a11",
      },
      {
        id: "leveling",
        name: "Floor Leveling",
        price: 2.75,
        image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
      },
    ],
  },
  {
    id: "additional",
    name: "Additional Services",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    items: [
      {
        id: "baseboard",
        name: "Baseboard Installation",
        price: 3.25,
        image: "https://images.unsplash.com/photo-1582582494700-2a0f06d43e0c",
      },
      {
        id: "transition-strip",
        name: "Transition Strip Install",
        price: 35,
        image: "https://images.unsplash.com/photo-1586105251261-72a756497a11",
      },
      {
        id: "moisture-barrier",
        name: "Moisture Barrier",
        price: 0.85,
        image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e",
      },
    ],
  },
]



export function PriceBookItemsModal({
  category,
  onClose,
}: {
  category: PriceBookCategory | null
  onClose: () => void
}) {
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  if (!category) return null

  const updateQuantity = (itemId: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + delta),
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
      <div className="bg-white w-full max-w-5xl rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="text-gray-600">
              ←
            </button>
            <h2 className="font-semibold">{category.name}</h2>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Items */}
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {category.items.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <img
                src={item.image}
                className="h-28 w-full object-cover"
              />

              <div className="p-3 space-y-2">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium">{item.name}</p>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Pencil size={14} />
                  </button>
                </div>

                <p className="text-xs text-gray-600">
                  ${item.price.toFixed(2)}
                </p>

                {/* Quantity */}
                <div className="flex items-center justify-between mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 border rounded"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="text-sm font-semibold">
                    {quantities[item.id] || 0}
                  </span>

                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1 border rounded"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button className="px-6 py-2 bg-primary text-white rounded-lg font-semibold">
            Add to estimate
          </button>
        </div>
      </div>
    </div>
  )
}
