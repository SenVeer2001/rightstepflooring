import type { Item } from "../components/customerPages/clientPages/PurchaseOrderFormModal"

// types/vendor.ts
export interface VendorAddress {
  address: string
  city: string
  state: string
  zip: string
}

export interface VendorPhone {
  phone: string
  ext?: string
}

export interface VendorEmail {
  email: string
}

export interface Vendor {
  id: string
  name: string
  addresses: VendorAddress[]
  phones: VendorPhone[]
  emails: VendorEmail[]
  contactName?: string
  contactJobTitle?: string
  paymentTerms?: string
  notes?: string
}

export interface PurchaseOrder {
  id: string
  vendorId: string
  orderDate: string
  items: Item[]
}

export interface WorkOrder {
  id: string
  teamIds: string[]
  orderDate: string
  items: Item[]
}

// ===================== PO STATUS TYPE =====================
export type POStatus = "po_created" | "po_approved" | "item_dispatched" | "item_received"

// ===================== PO ITEM TYPE =====================
export interface PurchaseOrderItem {
  id: number | string
  name: string
  image?: string
  type: "product" | "service"
  color?: string
  cost: number
  quantity: number
  status?: POStatus
}

// ===================== PO TABLE ITEM TYPE =====================
export interface PurchaseOrderTableItem {
  id: string
  vendorId?: string
  vendorName: string
  orderDate: string
  items: PurchaseOrderItem[]
}

// ===================== STATIC DATA =====================
export const staticPurchaseOrders: PurchaseOrderTableItem[] = [
  {
    id: "PO-1001",
    vendorId: "V-001",
    vendorName: "Flooring Depot",
    orderDate: "2024-02-10",
    items: [
      {
        id: 1,
        name: "Ceramic Tiles",
        image: "https://images.pexels.com/photos/16501255/pexels-photo-16501255.jpeg",
        type: "product",
        color: "#DADADA",
        cost: 45.99,
        quantity: 10,
        status: "po_created",
      },
      {
        id: 2,
        name: "Tile Installation Service",
        image: "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg",
        type: "service",
        cost: 150.00,
        quantity: 1,
        status: "po_approved",
      },
    ],
  },
  {
    id: "PO-1002",
    vendorId: "V-002",
    vendorName: "Modern Interiors",
    orderDate: "2024-02-15",
    items: [
      {
        id: 3,
        name: "Wood Flooring Panels",
        image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
        type: "product",
        color: "#A0522D",
        cost: 89.50,
        quantity: 25,
        status: "item_dispatched",
      },
    ],
  },
  {
    id: "PO-1003",
    vendorId: "V-003",
    vendorName: "Elite Supplies",
    orderDate: "2024-02-20",
    items: [
      {
        id: 4,
        name: "Adhesive & Grout",
        image: "https://images.pexels.com/photos/6474471/pexels-photo-6474471.jpeg",
        type: "product",
        color: "#F5F5F5",
        cost: 25.00,
        quantity: 5,
        status: "po_approved",
      },
      {
        id: 5,
        name: "Labor Assistance",
        image: "https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg",
        type: "service",
        cost: 200.00,
        quantity: 2,
        status: "item_received",
      },
    ],
  },
  {
    id: "PO-1004",
    vendorId: "V-004",
    vendorName: "Premium Materials Co.",
    orderDate: "2024-02-25",
    items: [
      {
        id: 6,
        name: "Marble Slabs",
        image: "https://images.pexels.com/photos/2098624/pexels-photo-2098624.jpeg",
        type: "product",
        color: "#E8E8E8",
        cost: 350.00,
        quantity: 4,
        status: "po_created",
      },
      {
        id: 7,
        name: "Granite Countertop",
        image: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg",
        type: "product",
        color: "#2F2F2F",
        cost: 275.00,
        quantity: 2,
        status: "item_dispatched",
      },
      {
        id: 8,
        name: "Installation & Polishing",
        image: "https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg",
        type: "service",
        cost: 500.00,
        quantity: 1,
        status: "po_approved",
      },
    ],
  },
]