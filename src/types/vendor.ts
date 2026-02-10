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