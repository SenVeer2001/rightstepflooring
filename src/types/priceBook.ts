// types.ts
export interface PriceBookItem {
  id: string
  name: string
  image: string
  price: number
  stock?: "in" | "out"
}

export interface SubCategory {
  id: string
  name: string
  image: string
  items: PriceBookItem[]
}

export interface Category {
  id: string
  name: string
  image: string
  subCategories: SubCategory[]
}
