export interface PriceBookItem {
  id: string
  name: string
  price?: number
  cost?: number
  type?: "service" | "product"
}
