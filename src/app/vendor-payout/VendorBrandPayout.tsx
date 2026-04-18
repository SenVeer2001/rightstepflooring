import { useMemo, useState } from "react"
import {
  Calendar, Download, DollarSign, TrendingUp, Filter, X, Eye, FileText,
  CheckCircle, Clock, XCircle, AlertTriangle, Building2, Package,
  CreditCard, Hash, Layers, Ruler, Tag, ShoppingCart
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Tooltip } from "react-tooltip"
import "react-tooltip/dist/react-tooltip.css"

/* ===================== TYPES ===================== */

interface PayoutItem {
  id: string
  itemName: string
  sku: string
  category: string
  quantity: number
  unit: string
  unitPrice: number
  totalPrice: number
  receivedDate: string
  condition: "perfect" | "minor_damage" | "damaged" | "returned"
  warehouse: string
  notes?: string
}

interface VendorPayoutEntry {
  id: string
  vendorName: string
  brandName: string
  purchaseOrderNumber: string
  jobId: string
  client: string
  product: string
  createdAt: string
  revenue: number
  vendorPayout: number
  paidAmount: number
  holdAmount: number
  payoutStatus: "paid" | "pending" | "partial" | "overdue" | "cancelled"
  paymentDate?: string
  paymentMethod?: string
  paymentReference?: string
  notes?: string
  items: PayoutItem[]
}

/* ===================== MOCK DATA ===================== */

const vendorPayoutData: VendorPayoutEntry[] = [
  {
    id: "VP-001",
    vendorName: "Shaw Flooring Distributors",
    brandName: "Shaw Floors",
    purchaseOrderNumber: "PO-2026-0145",
    jobId: "JB-480",
    client: "Robin Stevens",
    product: "Luxury Vinyl Plank",
    createdAt: "2026-01-05",
    revenue: 12000,
    vendorPayout: 4500,
    paidAmount: 4500,
    holdAmount: 0,
    payoutStatus: "paid",
    paymentDate: "2026-01-15",
    paymentMethod: "Bank Transfer",
    paymentReference: "TXN-78945612",
    notes: "Full payment completed on time.",
    items: [
      {
        id: "ITM-001",
        itemName: "Shaw Floorté Pro LVP - Aged Oak",
        sku: "SH-FP-AO-7x48",
        category: "Luxury Vinyl Plank",
        quantity: 45,
        unit: "boxes",
        unitPrice: 62.50,
        totalPrice: 2812.50,
        receivedDate: "2026-01-10",
        condition: "perfect",
        warehouse: "Main Warehouse A",
        notes: "Full pallet received in good condition.",
      },
      {
        id: "ITM-002",
        itemName: "Shaw LVP Underlayment Roll",
        sku: "SH-UL-ROLL-100",
        category: "Underlayment",
        quantity: 8,
        unit: "rolls",
        unitPrice: 89.00,
        totalPrice: 712.00,
        receivedDate: "2026-01-10",
        condition: "perfect",
        warehouse: "Main Warehouse A",
      },
      {
        id: "ITM-003",
        itemName: "Transition Strips - T-Molding Oak",
        sku: "SH-TS-TM-OAK-6FT",
        category: "Accessories",
        quantity: 12,
        unit: "pieces",
        unitPrice: 18.75,
        totalPrice: 225.00,
        receivedDate: "2026-01-11",
        condition: "perfect",
        warehouse: "Main Warehouse A",
      },
      {
        id: "ITM-004",
        itemName: "LVP Adhesive - Heavy Duty",
        sku: "SH-ADH-HD-1GAL",
        category: "Adhesives",
        quantity: 5,
        unit: "gallons",
        unitPrice: 150.10,
        totalPrice: 750.50,
        receivedDate: "2026-01-10",
        condition: "perfect",
        warehouse: "Main Warehouse A",
      },
    ],
  },
  {
    id: "VP-002",
    vendorName: "Mohawk Tile Supplies",
    brandName: "Mohawk",
    purchaseOrderNumber: "PO-2026-0178",
    jobId: "JB-506",
    client: "Kristopher Decker",
    product: "Porcelain Tile",
    createdAt: "2026-01-06",
    revenue: 18500,
    vendorPayout: 6200,
    paidAmount: 6200,
    holdAmount: 0,
    payoutStatus: "paid",
    paymentDate: "2026-01-18",
    paymentMethod: "Check",
    paymentReference: "CHK-33201",
    notes: "Paid via check. Cleared on Jan 20.",
    items: [
      {
        id: "ITM-005",
        itemName: "Mohawk Porcelain Tile - Marble White 24x24",
        sku: "MH-PT-MW-24x24",
        category: "Porcelain Tile",
        quantity: 120,
        unit: "sq ft",
        unitPrice: 28.50,
        totalPrice: 3420.00,
        receivedDate: "2026-01-12",
        condition: "perfect",
        warehouse: "Tile Storage B",
      },
      {
        id: "ITM-006",
        itemName: "Mohawk Porcelain Tile - Marble Grey 24x24",
        sku: "MH-PT-MG-24x24",
        category: "Porcelain Tile",
        quantity: 80,
        unit: "sq ft",
        unitPrice: 28.50,
        totalPrice: 2280.00,
        receivedDate: "2026-01-12",
        condition: "minor_damage",
        warehouse: "Tile Storage B",
        notes: "3 tiles had minor edge chips. Vendor notified.",
      },
      {
        id: "ITM-007",
        itemName: "Tile Grout - Bright White 25lb",
        sku: "MH-GR-BW-25LB",
        category: "Grout",
        quantity: 4,
        unit: "bags",
        unitPrice: 45.00,
        totalPrice: 180.00,
        receivedDate: "2026-01-13",
        condition: "perfect",
        warehouse: "Tile Storage B",
      },
      {
        id: "ITM-008",
        itemName: "Tile Spacers 1/8 inch",
        sku: "MH-SP-125-500",
        category: "Accessories",
        quantity: 3,
        unit: "bags",
        unitPrice: 12.00,
        totalPrice: 36.00,
        receivedDate: "2026-01-13",
        condition: "perfect",
        warehouse: "Tile Storage B",
      },
      {
        id: "ITM-009",
        itemName: "Tile Mortar - Thinset 50lb",
        sku: "MH-MR-TS-50LB",
        category: "Mortar",
        quantity: 8,
        unit: "bags",
        unitPrice: 35.50,
        totalPrice: 284.00,
        receivedDate: "2026-01-12",
        condition: "perfect",
        warehouse: "Tile Storage B",
      },
    ],
  },
  {
    id: "VP-003",
    vendorName: "Karastan Carpet Warehouse",
    brandName: "Karastan",
    purchaseOrderNumber: "PO-2026-0192",
    jobId: "JB-504",
    client: "Jennifer Wilson",
    product: "Carpet",
    createdAt: "2026-01-04",
    revenue: 7500,
    vendorPayout: 2800,
    paidAmount: 0,
    holdAmount: 2800,
    payoutStatus: "pending",
    notes: "Awaiting job completion confirmation.",
    items: [
      {
        id: "ITM-010",
        itemName: "Karastan SmartStrand Carpet - Dove Grey",
        sku: "KR-SS-DG-12FT",
        category: "Carpet",
        quantity: 65,
        unit: "sq yards",
        unitPrice: 32.00,
        totalPrice: 2080.00,
        receivedDate: "2026-01-08",
        condition: "perfect",
        warehouse: "Carpet Warehouse C",
      },
      {
        id: "ITM-011",
        itemName: "Carpet Padding - 8lb Rebond",
        sku: "KR-PAD-8LB-SY",
        category: "Padding",
        quantity: 65,
        unit: "sq yards",
        unitPrice: 6.50,
        totalPrice: 422.50,
        receivedDate: "2026-01-08",
        condition: "perfect",
        warehouse: "Carpet Warehouse C",
      },
      {
        id: "ITM-012",
        itemName: "Carpet Tack Strips - 4ft",
        sku: "KR-TS-4FT-BDL",
        category: "Installation Supplies",
        quantity: 20,
        unit: "pieces",
        unitPrice: 14.88,
        totalPrice: 297.50,
        receivedDate: "2026-01-09",
        condition: "perfect",
        warehouse: "Carpet Warehouse C",
      },
    ],
  },
  {
    id: "VP-004",
    vendorName: "Armstrong Hardwood Co.",
    brandName: "Armstrong",
    purchaseOrderNumber: "PO-2026-0210",
    jobId: "JB-510",
    client: "Amanda Foster",
    product: "Hardwood Flooring",
    createdAt: "2026-01-08",
    revenue: 22000,
    vendorPayout: 8500,
    paidAmount: 4250,
    holdAmount: 4250,
    payoutStatus: "partial",
    paymentDate: "2026-01-20",
    paymentMethod: "Bank Transfer",
    paymentReference: "TXN-88123456",
    notes: "50% advance paid. Remaining after inspection.",
    items: [
      {
        id: "ITM-013",
        itemName: "Armstrong Prime Harvest Oak - Natural 5\"",
        sku: "AR-PH-ON-5x48",
        category: "Hardwood Flooring",
        quantity: 80,
        unit: "boxes",
        unitPrice: 78.00,
        totalPrice: 6240.00,
        receivedDate: "2026-01-14",
        condition: "perfect",
        warehouse: "Hardwood Storage D",
      },
      {
        id: "ITM-014",
        itemName: "Hardwood Floor Stain - Golden Oak",
        sku: "AR-ST-GO-1QT",
        category: "Stains & Finishes",
        quantity: 6,
        unit: "quarts",
        unitPrice: 42.00,
        totalPrice: 252.00,
        receivedDate: "2026-01-14",
        condition: "perfect",
        warehouse: "Hardwood Storage D",
      },
      {
        id: "ITM-015",
        itemName: "Polyurethane Finish - Semi-Gloss",
        sku: "AR-PU-SG-1GAL",
        category: "Stains & Finishes",
        quantity: 4,
        unit: "gallons",
        unitPrice: 85.00,
        totalPrice: 340.00,
        receivedDate: "2026-01-14",
        condition: "perfect",
        warehouse: "Hardwood Storage D",
      },
      {
        id: "ITM-016",
        itemName: "Hardwood Flooring Nails - 2 inch",
        sku: "AR-NL-2IN-5LB",
        category: "Installation Supplies",
        quantity: 3,
        unit: "boxes",
        unitPrice: 28.00,
        totalPrice: 84.00,
        receivedDate: "2026-01-15",
        condition: "perfect",
        warehouse: "Hardwood Storage D",
      },
      {
        id: "ITM-017",
        itemName: "Moisture Barrier Sheets",
        sku: "AR-MB-SHEET-100",
        category: "Underlayment",
        quantity: 5,
        unit: "rolls",
        unitPrice: 116.80,
        totalPrice: 584.00,
        receivedDate: "2026-01-14",
        condition: "minor_damage",
        warehouse: "Hardwood Storage D",
        notes: "1 roll had torn packaging. Material inside OK.",
      },
      {
        id: "ITM-018",
        itemName: "Quarter Round Molding - Oak 8ft",
        sku: "AR-QR-OAK-8FT",
        category: "Moldings",
        quantity: 25,
        unit: "pieces",
        unitPrice: 40.00,
        totalPrice: 1000.00,
        receivedDate: "2026-01-15",
        condition: "perfect",
        warehouse: "Hardwood Storage D",
      },
    ],
  },
  {
    id: "VP-005",
    vendorName: "Shaw Laminate Supply",
    brandName: "Shaw Floors",
    purchaseOrderNumber: "PO-2026-0225",
    jobId: "JB-511",
    client: "Marcus Chen",
    product: "Laminate",
    createdAt: "2026-01-09",
    revenue: 9800,
    vendorPayout: 3200,
    paidAmount: 0,
    holdAmount: 0,
    payoutStatus: "cancelled",
    notes: "Job cancelled. No payout required.",
    items: [
      {
        id: "ITM-019",
        itemName: "Shaw Laminate - Classic Hickory 7mm",
        sku: "SH-LM-CH-7MM",
        category: "Laminate",
        quantity: 35,
        unit: "boxes",
        unitPrice: 55.00,
        totalPrice: 1925.00,
        receivedDate: "2026-01-12",
        condition: "returned",
        warehouse: "Return Dock",
        notes: "Returned to vendor after job cancellation.",
      },
      {
        id: "ITM-020",
        itemName: "Laminate Underlayment Foam",
        sku: "SH-UL-FOAM-200",
        category: "Underlayment",
        quantity: 4,
        unit: "rolls",
        unitPrice: 65.00,
        totalPrice: 260.00,
        receivedDate: "2026-01-12",
        condition: "returned",
        warehouse: "Return Dock",
        notes: "Returned to vendor after job cancellation.",
      },
    ],
  },
  {
    id: "VP-006",
    vendorName: "Daltile Commercial",
    brandName: "Daltile",
    purchaseOrderNumber: "PO-2026-0238",
    jobId: "JB-515",
    client: "Sarah Williams",
    product: "Ceramic Tile",
    createdAt: "2026-01-12",
    revenue: 15000,
    vendorPayout: 5500,
    paidAmount: 0,
    holdAmount: 5500,
    payoutStatus: "overdue",
    notes: "Payment overdue by 15 days. Follow up required.",
    items: [
      {
        id: "ITM-021",
        itemName: "Daltile Ceramic - Almond Cream 12x12",
        sku: "DT-CR-AC-12x12",
        category: "Ceramic Tile",
        quantity: 200,
        unit: "sq ft",
        unitPrice: 15.50,
        totalPrice: 3100.00,
        receivedDate: "2026-01-16",
        condition: "perfect",
        warehouse: "Tile Storage B",
      },
      {
        id: "ITM-022",
        itemName: "Daltile Ceramic - Almond Cream Border 4x12",
        sku: "DT-CR-ACB-4x12",
        category: "Ceramic Tile",
        quantity: 50,
        unit: "pieces",
        unitPrice: 8.00,
        totalPrice: 400.00,
        receivedDate: "2026-01-16",
        condition: "perfect",
        warehouse: "Tile Storage B",
      },
      {
        id: "ITM-023",
        itemName: "Ceramic Tile Grout - Almond 10lb",
        sku: "DT-GR-AL-10LB",
        category: "Grout",
        quantity: 6,
        unit: "bags",
        unitPrice: 32.00,
        totalPrice: 192.00,
        receivedDate: "2026-01-17",
        condition: "perfect",
        warehouse: "Tile Storage B",
      },
      {
        id: "ITM-024",
        itemName: "Waterproof Membrane Sheet",
        sku: "DT-WM-SHEET-5x5",
        category: "Waterproofing",
        quantity: 10,
        unit: "sheets",
        unitPrice: 85.00,
        totalPrice: 850.00,
        receivedDate: "2026-01-16",
        condition: "damaged",
        warehouse: "Tile Storage B",
        notes: "2 sheets arrived with tears. Replacement requested.",
      },
      {
        id: "ITM-025",
        itemName: "Tile Caulk - Almond",
        sku: "DT-CK-AL-10OZ",
        category: "Sealants",
        quantity: 12,
        unit: "tubes",
        unitPrice: 9.50,
        totalPrice: 114.00,
        receivedDate: "2026-01-17",
        condition: "perfect",
        warehouse: "Tile Storage B",
      },
      {
        id: "ITM-026",
        itemName: "Cement Backer Board 3x5",
        sku: "DT-CB-3x5-HALF",
        category: "Backer Board",
        quantity: 15,
        unit: "sheets",
        unitPrice: 56.27,
        totalPrice: 844.00,
        receivedDate: "2026-01-16",
        condition: "perfect",
        warehouse: "Tile Storage B",
      },
    ],
  },
  {
    id: "VP-007",
    vendorName: "Mohawk Carpet Division",
    brandName: "Mohawk",
    purchaseOrderNumber: "PO-2026-0251",
    jobId: "JB-518",
    client: "John Smith",
    product: "Commercial Carpet",
    createdAt: "2026-01-14",
    revenue: 28000,
    vendorPayout: 10500,
    paidAmount: 10500,
    holdAmount: 0,
    payoutStatus: "paid",
    paymentDate: "2026-01-25",
    paymentMethod: "Wire Transfer",
    paymentReference: "WIRE-9912345",
    notes: "Large order. Full payment sent via wire.",
    items: [
      {
        id: "ITM-027",
        itemName: "Mohawk Commercial Carpet Tile - Slate 24x24",
        sku: "MH-CCT-SL-24x24",
        category: "Carpet Tile",
        quantity: 500,
        unit: "tiles",
        unitPrice: 14.50,
        totalPrice: 7250.00,
        receivedDate: "2026-01-19",
        condition: "perfect",
        warehouse: "Commercial Storage E",
      },
      {
        id: "ITM-028",
        itemName: "Mohawk Commercial Carpet Tile - Charcoal 24x24",
        sku: "MH-CCT-CH-24x24",
        category: "Carpet Tile",
        quantity: 150,
        unit: "tiles",
        unitPrice: 14.50,
        totalPrice: 2175.00,
        receivedDate: "2026-01-19",
        condition: "perfect",
        warehouse: "Commercial Storage E",
      },
      {
        id: "ITM-029",
        itemName: "Carpet Tile Adhesive - 4 Gallon",
        sku: "MH-CTA-4GAL",
        category: "Adhesives",
        quantity: 6,
        unit: "buckets",
        unitPrice: 125.00,
        totalPrice: 750.00,
        receivedDate: "2026-01-20",
        condition: "perfect",
        warehouse: "Commercial Storage E",
      },
      {
        id: "ITM-030",
        itemName: "Carpet Tile Edge Strips - 6ft",
        sku: "MH-CTE-6FT",
        category: "Accessories",
        quantity: 30,
        unit: "pieces",
        unitPrice: 10.83,
        totalPrice: 325.00,
        receivedDate: "2026-01-20",
        condition: "perfect",
        warehouse: "Commercial Storage E",
      },
    ],
  },
  {
    id: "VP-008",
    vendorName: "Mannington Mills",
    brandName: "Mannington",
    purchaseOrderNumber: "PO-2026-0264",
    jobId: "JB-520",
    client: "Emma Davis",
    product: "Luxury Vinyl Tile",
    createdAt: "2026-01-16",
    revenue: 11500,
    vendorPayout: 4200,
    paidAmount: 2100,
    holdAmount: 2100,
    payoutStatus: "partial",
    paymentDate: "2026-01-28",
    paymentMethod: "Bank Transfer",
    paymentReference: "TXN-55678901",
    notes: "First installment paid. Balance due Feb 10.",
    items: [
      {
        id: "ITM-031",
        itemName: "Mannington Adura Max - Iron Hill Graphite",
        sku: "MN-AM-IHG-6x48",
        category: "Luxury Vinyl Tile",
        quantity: 55,
        unit: "boxes",
        unitPrice: 52.00,
        totalPrice: 2860.00,
        receivedDate: "2026-01-22",
        condition: "perfect",
        warehouse: "Main Warehouse A",
      },
      {
        id: "ITM-032",
        itemName: "Mannington LVT Underlayment",
        sku: "MN-UL-LVT-ROLL",
        category: "Underlayment",
        quantity: 6,
        unit: "rolls",
        unitPrice: 78.00,
        totalPrice: 468.00,
        receivedDate: "2026-01-22",
        condition: "perfect",
        warehouse: "Main Warehouse A",
      },
      {
        id: "ITM-033",
        itemName: "Mannington Stair Nose Molding - Graphite",
        sku: "MN-SN-GR-78IN",
        category: "Moldings",
        quantity: 8,
        unit: "pieces",
        unitPrice: 55.00,
        totalPrice: 440.00,
        receivedDate: "2026-01-23",
        condition: "perfect",
        warehouse: "Main Warehouse A",
      },
      {
        id: "ITM-034",
        itemName: "Multi-Surface Floor Cleaner",
        sku: "MN-FC-MS-32OZ",
        category: "Maintenance",
        quantity: 12,
        unit: "bottles",
        unitPrice: 18.00,
        totalPrice: 216.00,
        receivedDate: "2026-01-22",
        condition: "perfect",
        warehouse: "Main Warehouse A",
      },
      {
        id: "ITM-035",
        itemName: "LVT Seam Sealer",
        sku: "MN-SS-LVT-8OZ",
        category: "Sealants",
        quantity: 8,
        unit: "tubes",
        unitPrice: 27.00,
        totalPrice: 216.00,
        receivedDate: "2026-01-23",
        condition: "minor_damage",
        warehouse: "Main Warehouse A",
        notes: "1 tube cap was broken. Sealed with tape.",
      },
    ],
  },
]

/* ===================== CONDITION CONFIG ===================== */

function getConditionConfig(condition: string) {
  switch (condition) {
    case "perfect":
      return {
        label: "Perfect",
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-300",
        icon: CheckCircle,
        dot: "bg-green-500",
      }
    case "minor_damage":
      return {
        label: "Minor Damage",
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-300",
        icon: AlertTriangle,
        dot: "bg-yellow-500",
      }
    case "damaged":
      return {
        label: "Damaged",
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-300",
        icon: XCircle,
        dot: "bg-red-500",
      }
    case "returned":
      return {
        label: "Returned",
        bg: "bg-gray-100",
        text: "text-gray-800",
        border: "border-gray-300",
        icon: Package,
        dot: "bg-gray-500",
      }
    default:
      return {
        label: "Unknown",
        bg: "bg-gray-100",
        text: "text-gray-800",
        border: "border-gray-300",
        icon: FileText,
        dot: "bg-gray-500",
      }
  }
}

/* ===================== PAYOUT ITEMS POPUP ===================== */

interface PayoutItemsPopupProps {
  isOpen: boolean
  onClose: () => void
  entry: VendorPayoutEntry | null
}

function PayoutItemsPopup({ isOpen, onClose, entry }: PayoutItemsPopupProps) {
  if (!isOpen || !entry) return null

  const items = entry.items
  const totalItems = items.reduce((s, i) => s + i.quantity, 0)
  const totalValue = items.reduce((s, i) => s + i.totalPrice, 0)
  const perfectCount = items.filter(i => i.condition === "perfect").length
  const issueCount = items.filter(i => i.condition !== "perfect").length

  const categories = useMemo(() => {
    const catMap: Record<string, { count: number; value: number }> = {}
    items.forEach(item => {
      if (!catMap[item.category]) {
        catMap[item.category] = { count: 0, value: 0 }
      }
      catMap[item.category].count += item.quantity
      catMap[item.category].value += item.totalPrice
    })
    return catMap
  }, [items])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-primary px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingCart size={20} />
                Payout Items Received
              </h2>
              <p className="text-sm text-white/80 mt-0.5">
                {entry.purchaseOrderNumber} — {entry.vendorName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <Layers size={16} className="text-indigo-500" />
              </div>
              <p className="text-xs text-gray-500">Line Items</p>
              <p className="text-lg font-bold text-gray-900">{items.length}</p>
            </div>
            {/* <div className="bg-white rounded-xl border p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <Package size={16} className="text-blue-500" />
              </div>
              <p className="text-xs text-gray-500">Total Qty</p>
              <p className="text-lg font-bold text-gray-900">{totalItems.toLocaleString()}</p>
            </div> */}
            <div className="bg-white rounded-xl border p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <DollarSign size={16} className="text-green-500" />
              </div>
              <p className="text-xs text-gray-500">Total Value</p>
              <p className="text-lg font-bold text-green-600">${totalValue.toLocaleString()}</p>
            </div>
            {/* <div className="bg-white rounded-xl border p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                {issueCount > 0 ? (
                  <AlertTriangle size={16} className="text-amber-500" />
                ) : (
                  <CheckCircle size={16} className="text-green-500" />
                )}
              </div>
              <p className="text-xs text-gray-500">Condition</p>
              <p className={`text-lg font-bold ${issueCount > 0 ? "text-amber-600" : "text-green-600"}`}>
                {issueCount > 0 ? `${issueCount} Issues` : "All Good"}
              </p>
            </div> */}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="px-6 pt-4 pb-2">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Tag size={12} /> Category Breakdown
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(categories).map(([cat, data]) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary rounded-full text-xs font-medium text-primary"
              >
                {cat}
                <span className="bg-primary/80 text-white px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                  {data.count} units • ${data.value.toLocaleString()}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Items Table */}
        <div className="px-6 py-4 max-h-[45vh] overflow-y-auto">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <Package size={12} /> Items Detail
          </h3>

          <div className="space-y-3">
            {items.map((item, index) => {
              const condConfig = getConditionConfig(item.condition)
              return (
                <div
                  key={item.id}
                  className={`bg-white border rounded-xl p-4 hover:shadow-md transition-shadow ${
                    item.condition === "damaged" ? "border-red-200 bg-red-50/30" :
                    item.condition === "returned" ? "border-gray-300 bg-gray-50/50" :
                    item.condition === "minor_damage" ? "border-yellow-200 bg-yellow-50/30" :
                    "border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Left: Item info */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600 font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">
                          {item.itemName}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 rounded text-[11px] font-mono text-gray-600 border">
                            {item.sku}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {item.category}
                          </span>
                        </div>

                        {/* Quantity & Price Row */}
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <Ruler size={12} className="text-gray-400" />
                            <span className="text-xs text-gray-600">
                              <span className="font-semibold text-gray-800">{item.quantity}</span> {item.unit}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign size={12} className="text-gray-400" />
                            <span className="text-xs text-gray-600">
                              ${item.unitPrice.toFixed(2)} / {item.unit.replace(/s$/, '')}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={12} className="text-gray-400" />
                            <span className="text-xs text-gray-600">{item.receivedDate}</span>
                          </div>
                        </div>

                        {/* Warehouse */}
                        <div className="flex items-center gap-1 mt-1.5">
                          <Building2 size={11} className="text-gray-400" />
                          <span className="text-[11px] text-gray-500">{item.warehouse}</span>
                        </div>

                        {/* Notes */}
                        {item.notes && (
                          <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-1.5">
                            <p className="text-[11px] text-yellow-800">
                              <span className="font-semibold">Note:</span> {item.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Price & Condition */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="text-base font-bold text-gray-900">
                        ${item.totalPrice.toLocaleString()}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${condConfig.bg} ${condConfig.text} border ${condConfig.border}`}
                      >
                        <condConfig.icon size={11} />
                        {condConfig.label}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Hash size={12} />
              {entry.id}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-gray-500">{perfectCount} Perfect</span>
              {issueCount > 0 && (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 ml-2" />
                  <span className="text-xs text-gray-500">{issueCount} With Issues</span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

/* ===================== PAYOUT DETAIL POPUP ===================== */

interface PayoutPopupProps {
  isOpen: boolean
  onClose: () => void
  entry: VendorPayoutEntry | null
}

function VendorPayoutPopup({ isOpen, onClose, entry }: PayoutPopupProps) {
  if (!isOpen || !entry) return null

  const statusConfig = getPayoutStatusConfig(entry.payoutStatus)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Payout Details</h2>
              <p className="text-sm text-white/80">{entry.purchaseOrderNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Status</span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}
            >
              <statusConfig.icon size={13} />
              {statusConfig.label}
            </span>
          </div>

          {/* Vendor & Brand Info */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{entry.vendorName}</p>
                <p className="text-xs text-gray-500">
                  Brand: <span className="font-medium text-gray-700">{entry.brandName}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-400">Product</p>
                <p className="text-sm font-medium text-gray-700">{entry.product}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Client</p>
                <p className="text-sm font-medium text-gray-700">{entry.client}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Job ID</p>
                <p className="text-sm font-semibold text-primary">{entry.jobId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Created</p>
                <p className="text-sm font-medium text-gray-700">{entry.createdAt}</p>
              </div>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
              Financial Breakdown
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 px-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign size={15} className="text-green-600" />
                  <span className="text-sm text-gray-700">Revenue</span>
                </div>
                <span className="text-sm font-bold text-green-600">
                  ${entry.revenue.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 px-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CreditCard size={15} className="text-red-600" />
                  <span className="text-sm text-gray-700">Vendor Payout</span>
                </div>
                <span className="text-sm font-bold text-red-600">
                  ${entry.vendorPayout.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 px-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} className="text-blue-600" />
                  <span className="text-sm text-gray-700">Paid Amount</span>
                </div>
                <span className="text-sm font-bold text-blue-600">
                  ${entry.paidAmount.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 px-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={15} className="text-amber-600" />
                  <span className="text-sm text-gray-700">Hold Amount</span>
                </div>
                <span className="text-sm font-bold text-amber-600">
                  ${entry.holdAmount.toLocaleString()}
                </span>
              </div>

              {/* Balance */}
              <div className="flex items-center justify-between py-3 px-3 bg-gray-100 rounded-lg border-2 border-gray-200">
                <span className="text-sm font-bold text-gray-800">Balance Due</span>
                <span className="text-base font-bold text-gray-900">
                  ${(entry.vendorPayout - entry.paidAmount).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          {entry.paymentDate && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                Payment Information
              </h3>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400">Payment Date</p>
                    <p className="text-sm font-medium text-gray-700">{entry.paymentDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Method</p>
                    <p className="text-sm font-medium text-gray-700">{entry.paymentMethod}</p>
                  </div>
                  {entry.paymentReference && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-400">Reference</p>
                      <p className="text-sm font-mono font-medium text-gray-700 bg-white px-2 py-1 rounded border">
                        {entry.paymentReference}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {entry.notes && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Notes</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                <p className="text-sm text-gray-700">{entry.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Hash size={12} />
            {entry.id}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            {entry.payoutStatus !== "paid" && entry.payoutStatus !== "cancelled" && (
              <button className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors">
                Mark as Paid
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ===================== STATUS CONFIG ===================== */

function getPayoutStatusConfig(status: string) {
  switch (status) {
    case "paid":
      return {
        label: "Paid",
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-300",
        icon: CheckCircle,
        dot: "bg-green-500",
      }
    case "pending":
      return {
        label: "Pending",
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-300",
        icon: Clock,
        dot: "bg-yellow-500",
      }
    case "partial":
      return {
        label: "Partial",
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-300",
        icon: TrendingUp,
        dot: "bg-blue-500",
      }
    case "overdue":
      return {
        label: "Overdue",
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-300",
        icon: AlertTriangle,
        dot: "bg-red-500",
      }
    case "cancelled":
      return {
        label: "Cancelled",
        bg: "bg-gray-100",
        text: "text-gray-800",
        border: "border-gray-300",
        icon: XCircle,
        dot: "bg-gray-500",
      }
    default:
      return {
        label: "Unknown",
        bg: "bg-gray-100",
        text: "text-gray-800",
        border: "border-gray-300",
        icon: FileText,
        dot: "bg-gray-500",
      }
  }
}

/* ===================== MAIN COMPONENT ===================== */

export default function VendorBrandPayout() {
  const navigate = useNavigate()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [brandFilter, setBrandFilter] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [quickDateFilter, setQuickDateFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  // Popup states
  const [selectedEntry, setSelectedEntry] = useState<VendorPayoutEntry | null>(null)
  const [showPopup, setShowPopup] = useState(false)
  const [showItemsPopup, setShowItemsPopup] = useState(false)


  const brands = useMemo(() => {
    const brandSet = new Set(vendorPayoutData.map(e => e.brandName))
    return ["all", ...Array.from(brandSet)]
  }, [])

  const vendors = useMemo(() => {
    const vendorSet = new Set(vendorPayoutData.map(e => e.vendorName))
    return Array.from(vendorSet)
  }, [])


  const getDateRange = (filter: string) => {
    const today = new Date()
    const oneDay = 24 * 60 * 60 * 1000
    switch (filter) {
      case "last_week":
        return { from: new Date(today.getTime() - 7 * oneDay), to: today }
      case "last_month":
        return { from: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()), to: today }
      case "last_3_months":
        return { from: new Date(today.getFullYear(), today.getMonth() - 3, today.getDate()), to: today }
      default:
        return null
    }
  }
  const stats = useMemo(() => {
    const totalRevenue = vendorPayoutData.reduce((s, e) => s + e.revenue, 0)
    const totalPayout = vendorPayoutData.reduce((s, e) => s + e.vendorPayout, 0)
    const totalPaid = vendorPayoutData.reduce((s, e) => s + e.paidAmount, 0)
    const totalPending = vendorPayoutData
      .filter(e => e.payoutStatus === "pending" || e.payoutStatus === "partial")
      .reduce((s, e) => s + (e.vendorPayout - e.paidAmount), 0)
    const totalOverdue = vendorPayoutData
      .filter(e => e.payoutStatus === "overdue")
      .reduce((s, e) => s + (e.vendorPayout - e.paidAmount), 0)

    return { totalRevenue, totalPayout, totalPaid, totalPending, totalOverdue }
  }, [])



  const statusTabs = [
    { id: "all", label: "All" },
    { id: "paid", label: "Paid" },
    { id: "pending", label: "Pending" },
    { id: "partial", label: "Partial" },
    { id: "overdue", label: "Overdue" },
    { id: "cancelled", label: "Cancelled" },
  ]

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: vendorPayoutData.length }
    vendorPayoutData.forEach(e => {
      counts[e.payoutStatus] = (counts[e.payoutStatus] || 0) + 1
    })
    return counts
  }, [])



  const filtered = useMemo(() => {
    return vendorPayoutData.filter(entry => {
      const s = search.toLowerCase()
      const matchesSearch =
        entry.vendorName.toLowerCase().includes(s) ||
        entry.brandName.toLowerCase().includes(s) ||
        entry.purchaseOrderNumber.toLowerCase().includes(s) ||
        entry.jobId.toLowerCase().includes(s) ||
        entry.client.toLowerCase().includes(s) ||
        entry.product.toLowerCase().includes(s)

      const matchesStatus = statusFilter === "all" || entry.payoutStatus === statusFilter
      const matchesBrand = brandFilter === "all" || entry.brandName === brandFilter

      let matchesDate = true
      if (quickDateFilter !== "all") {
        const range = getDateRange(quickDateFilter)
        if (range) {
          const d = new Date(entry.createdAt)
          matchesDate = d >= range.from && d <= range.to
        }
      } else if (dateFrom || dateTo) {
        const d = new Date(entry.createdAt)
        if (dateFrom && dateTo) matchesDate = d >= new Date(dateFrom) && d <= new Date(dateTo)
        else if (dateFrom) matchesDate = d >= new Date(dateFrom)
        else if (dateTo) matchesDate = d <= new Date(dateTo)
      }

      return matchesSearch && matchesStatus && matchesBrand && matchesDate
    })
  }, [search, statusFilter, brandFilter, dateFrom, dateTo, quickDateFilter])

  const totalPages = Math.ceil(filtered.length / rowsPerPage)
  const paginatedData = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  const clearAllFilters = () => {
    setSearch("")
    setStatusFilter("all")
    setBrandFilter("all")
    setQuickDateFilter("all")
    setDateFrom("")
    setDateTo("")
  }

  const hasActiveFilters =
    search || statusFilter !== "all" || brandFilter !== "all" ||
    quickDateFilter !== "all" || dateFrom || dateTo

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Building2 size={28} className="text-primary" />
          Vendor / Brand Payout
        </h1>
        <p className="text-gray-600 mt-1">Track and manage all vendor & brand payouts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Payout</p>
              <p className="text-xl font-bold text-red-600">
                ${stats.totalPayout.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Paid</p>
              <p className="text-xl font-bold text-blue-600">
                ${stats.totalPaid.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl font-bold text-yellow-600">
                ${stats.totalPending.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-xl font-bold text-red-600">
                ${stats.totalOverdue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {statusTabs.map((tab) => {
          const isActive = statusFilter === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id)
                setCurrentPage(1)
              }}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab.label}
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                {statusCounts[tab.id] || 0}
              </span>
            </button>
          )
        })}
      </div>
   
      {/* Filters */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-gray-50/50">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search vendor, brand, PO number........"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none bg-white"
              />
            </div>

           
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              {[
                { value: "all", label: "All Time" },
                { value: "last_week", label: "Last Week" },
                { value: "last_month", label: "Last Month" },
                { value: "last_3_months", label: "3 Months" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    setQuickDateFilter(item.value)
                    if (item.value !== "all") {
                      setDateFrom("")
                      setDateTo("")
                    }
                    setCurrentPage(1)
                  }}
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition whitespace-nowrap ${
                    quickDateFilter === item.value
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm rounded-xl text-white bg-primary font-semibold hover:bg-primary/90 transition shadow-sm">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* Filter Row */}
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <Calendar size={12} /> From
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value)
                  setQuickDateFilter("all")
                  setCurrentPage(1)
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <Calendar size={12} /> To
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value)
                  setQuickDateFilter("all")
                  setCurrentPage(1)
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <Building2 size={12} /> Brand
              </label>
              <select
                value={brandFilter}
                onChange={(e) => {
                  setBrandFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="all">All Brands</option>
                {brands.filter(b => b !== "all").map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <DollarSign size={12} /> Payout Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="all">All</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="px-4 py-3 border-t bg-gradient-to-r from-primary/5 to-indigo-50 flex items-center gap-3 flex-wrap">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
              <Filter size={12} /> Active Filters:
            </span>

            <div className="flex items-center gap-2 flex-wrap">
              {search && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border rounded-full text-xs font-medium text-gray-700 shadow-sm">
                  Search: "{search}"
                  <button onClick={() => setSearch("")} className="text-gray-400 hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              )}
              {brandFilter !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-50 border border-pink-200 rounded-full text-xs font-medium text-pink-700">
                  <Building2 size={12} /> {brandFilter}
                  <button onClick={() => setBrandFilter("all")} className="text-pink-400 hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              )}
              {quickDateFilter !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-medium text-blue-700">
                  <Calendar size={12} />
                  {quickDateFilter === "last_week" ? "Last Week" :
                    quickDateFilter === "last_month" ? "Last Month" : "3 Months"}
                  <button onClick={() => setQuickDateFilter("all")} className="text-blue-400 hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              )}
              {dateFrom && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border rounded-full text-xs font-medium text-gray-700 shadow-sm">
                  From: {dateFrom}
                  <button onClick={() => setDateFrom("")} className="text-gray-400 hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              )}
              {dateTo && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border rounded-full text-xs font-medium text-gray-700 shadow-sm">
                  To: {dateTo}
                  <button onClick={() => setDateTo("")} className="text-gray-400 hover:text-red-500">
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>

            <button 
              onClick={clearAllFilters}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <X size={14} /> Clear All
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="px-4 py-2 border-t bg-gray-50">
          <p className="text-xs text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filtered.length}</span> results
            {hasActiveFilters && (
              <span className="text-gray-400"> (filtered from {vendorPayoutData.length} total)</span>
            )}
          </p>
        </div>
      </div>

      {/* ===================== TABLE ===================== */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Vendor / Brand",
                  "PO Number",
                  "Created At",
                  // "Items",
                  "Vendor Payout",
                  "Paid",
                  "Status",
                  "Action",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-left font-semibold whitespace-nowrap"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">No vendor payouts found</p>
                  </td>
                </tr>
              ) : (
                paginatedData.map((entry) => {
                  const statusConfig = getPayoutStatusConfig(entry.payoutStatus)
                  const balance = entry.vendorPayout - entry.paidAmount
                  const itemCount = entry.items.length
                  const totalQty = entry.items.reduce((s, i) => s + i.quantity, 0)
                  return (
                    <tr key={entry.id} className="border-t hover:bg-gray-50 transition-colors">
                      {/* Vendor / Brand */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5 min-w-[200px]">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Building2 size={18} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{entry.vendorName}</p>
                            <p className="text-xs text-gray-500">{entry.brandName}</p>
                          </div>
                        </div>
                      </td>

                      {/* PO Number */}
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg border border-gray-300 bg-gray-50 text-xs font-mono font-semibold text-gray-700 shadow-sm">
                          {entry.purchaseOrderNumber}
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="px-4 py-3 text-gray-500 text-nowrap">{entry.createdAt}</td>

                      {/* Items - Clickable to open items popup */}
                      {/* <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            setSelectedEntry(entry)
                            setShowItemsPopup(true)
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-xs font-semibold text-indigo-700 transition-colors cursor-pointer"
                          data-tooltip-id="action-tooltip"
                          data-tooltip-content="View received items"
                        >
                          <Package size={13} />
                          {itemCount} items
                          <span className="text-[10px] text-indigo-500 font-normal">
                            ({totalQty} units)
                          </span>
                        </button>
                      </td> */}

                      {/* Payout - Clickable with popup */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            setSelectedEntry(entry)
                            setShowItemsPopup(true)
                          }}
                          className="font-semibold text-red-600 hover:text-red-700 underline cursor-pointer text-nowrap"
                          data-tooltip-id="action-tooltip"
                          data-tooltip-content="View Payout Details"
                        >
                          ${entry.vendorPayout.toLocaleString()}
                        </button>
                      </td>

                      {/* Paid */}
                      <td className="px-4 py-3 font-semibold text-blue-600 text-nowrap">
                        ${entry.paidAmount.toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                          {statusConfig.label}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setSelectedEntry(entry)
                              setShowPopup(true)
                            }}
                            className="p-1.5 rounded hover:bg-primary/10 text-primary transition-colors"
                            data-tooltip-id="action-tooltip"
                            data-tooltip-content="View Payout Details"
                          >
                            <Eye size={16} />
                          </button>
                          {/* <button
                            onClick={() => {
                              setSelectedEntry(entry)
                              setShowItemsPopup(true)
                            }}
                            className="p-1.5 rounded hover:bg-indigo-100 text-indigo-600 transition-colors"
                            data-tooltip-id="action-tooltip"
                            data-tooltip-content="View Items Received"
                          >
                            <Package size={16} />
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">{(currentPage - 1) * rowsPerPage + 1}</span>
              {" - "}
              <span className="font-semibold">
                {Math.min(currentPage * rowsPerPage, filtered.length)}
              </span>
              {" of "}
              <span className="font-semibold">{filtered.length}</span>
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm rounded border disabled:opacity-50 hover:bg-gray-100"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm rounded border disabled:opacity-50 hover:bg-gray-100"
              >
                Prev
              </button>
              <span className="px-3 py-1.5 text-sm font-semibold">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1.5 text-sm rounded border disabled:opacity-50 hover:bg-gray-100"
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1.5 text-sm rounded border disabled:opacity-50 hover:bg-gray-100"
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payout Details Popup */}
      <VendorPayoutPopup
        isOpen={showPopup}
        onClose={() => {
          setShowPopup(false)
          setSelectedEntry(null)
        }}
        entry={selectedEntry}
      />

      {/* Payout Items Popup */}
      <PayoutItemsPopup
        isOpen={showItemsPopup}
        onClose={() => {
          setShowItemsPopup(false)
          setSelectedEntry(null)
        }}
        entry={selectedEntry}
      />

      {/* Tooltips */}
      <Tooltip
        id="action-tooltip"
        place="top"
        className="!bg-gray-800 !text-white !text-xs !px-2 !py-1 !rounded"
      />
    </div>
  )
}