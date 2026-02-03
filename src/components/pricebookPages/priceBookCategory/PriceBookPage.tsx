// PriceBookPage.tsx
import { useState } from "react"
import { priceBookCategories } from "../../../services/priceBookData"
import type{ Category } from "../../../types/priceBook"

import { PriceBookPopup } from "./PriceBookPopup"
import { CategoryGrid } from "./CategoryGrid"

interface Props {
  onEditCategory: (category: Category) => void
}

export default function PriceBookPage({ onEditCategory }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  return (
    <>
      <CategoryGrid
        categories={priceBookCategories}
        onSelect={setSelectedCategory}
        onEdit = {onEditCategory}
      />

      <PriceBookPopup
        isOpen={!!selectedCategory}
        category={selectedCategory}
        onClose={() => setSelectedCategory(null)}
      />
    </>
  )
}
