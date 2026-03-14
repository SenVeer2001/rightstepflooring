import { useState, useRef, useCallback } from "react"
import { 
  ArrowLeft, 
  Send, 
  Trash2, 
  Plus, 
  Paperclip, 
  Layers, 
  SignatureIcon, 
  Zap,
  X,
  DollarSign,
  Hash,
  FileText,
  Upload,
  Link as LinkIcon,
  Ruler,
  Home
} from "lucide-react"
import { useNavigate } from "react-router-dom"

interface InvoiceSignature {
  name: string
  date: string
  image?: string
}

interface InvoiceItem {
  id: string
  name: string
  image?: string
  description: string
  quantity: number
  unit: string
  price: number
  cost: number
  amount: number
  taxable: boolean
  color?: string
  area?: string
}

/* MOCK DATA - Flooring Business */
const mockInvoice = {
  id: "FL-579",
  jobId: "JOB-454",
  clientName: "Jennifer Wheeler",
  billTo: {
    name: "Jennifer Wheeler",
    address: "6483 Jean Dr",
    city: "Raleigh",
    state: "North Carolina",
    zip: "27612",
    phone: "(919) 455-8261",
    email: "jwheeeler@hotmail.com",
  },
  serviceAddress: "6483 Jean Dr, Raleigh, NC 27612 (Residential - 2 Story Home)",
  invoiceName: "Premium Flooring Installation",
  invoiceDate: "1/22/2026",
  sent: "No",
  items: [
    {
      id: "1",
      name: "Oak Hardwood Flooring - Premium Grade",
      image: "https://images.pexels.com/photos/6585751/pexels-photo-6585751.jpeg",
      description: "Solid oak hardwood planks, 3/4\" thick, natural finish with protective coating",
      area: "Living Room",
      quantity: 450,
      unit: "sq ft",
      price: 8.50,
      cost: 5.20,
      amount: 3825,
      taxable: true,
      color: "#8B4513",
    },
    {
      id: "2",
      name: "Luxury Vinyl Plank - Waterproof Series",
      image: "https://images.pexels.com/photos/7018406/pexels-photo-7018406.jpeg",
      description: "Premium waterproof vinyl planks with wood texture, click-lock installation",
      area: "Kitchen & Dining",
      quantity: 320,
      unit: "sq ft",
      price: 5.75,
      cost: 3.40,
      amount: 1840,
      taxable: true,
      color: "#DEB887",
    },
    {
      id: "3",
      name: "Ceramic Floor Tiles - Porcelain",
      image: "https://images.pexels.com/photos/16501255/pexels-photo-16501255.jpeg",
      description: "High-durability porcelain tiles, matte finish, slip-resistant surface",
      area: "Bathrooms",
      quantity: 180,
      unit: "sq ft",
      price: 6.25,
      cost: 3.80,
      amount: 1125,
      taxable: true,
      color: "#D3D3D3",
    },
    {
      id: "4",
      name: "Carpet - Premium Plush",
      image: "https://images.pexels.com/photos/4112556/pexels-photo-4112556.jpeg",
      description: "Soft plush carpet with stain-resistant treatment and padding included",
      area: "Master Bedroom",
      quantity: 280,
      unit: "sq ft",
      price: 4.50,
      cost: 2.60,
      amount: 1260,
      taxable: true,
      color: "#F5F5DC",
    },
    {
      id: "5",
      name: "Floor Preparation & Leveling",
      image: undefined,
      description: "Subfloor preparation, leveling compound application, moisture barrier installation",
      area: "All Rooms",
      quantity: 1230,
      unit: "sq ft",
      price: 1.50,
      cost: 0.80,
      amount: 1845,
      taxable: true,
      color: "#808080",
    },
    {
      id: "6",
      name: "Professional Installation - Hardwood",
      image: undefined,
      description: "Expert installation including nailing, gluing, and precision alignment",
      area: "Living Room",
      quantity: 450,
      unit: "sq ft",
      price: 4.00,
      cost: 2.00,
      amount: 1800,
      taxable: false,
      color: "#CD853F",
    },
    {
      id: "7",
      name: "Baseboards & Quarter Round - Oak",
      image: undefined,
      description: "Matching oak baseboards with quarter round trim, includes installation",
      area: "All Rooms",
      quantity: 220,
      unit: "linear ft",
      price: 5.50,
      cost: 3.20,
      amount: 1210,
      taxable: true,
      color: "#8B4513",
    },
    {
      id: "8",
      name: "Transition Strips & Thresholds",
      image: undefined,
      description: "Metal and wood transition strips for doorways and room connections",
      area: "Various",
      quantity: 12,
      unit: "pieces",
      price: 35.00,
      cost: 18.00,
      amount: 420,
      taxable: true,
      color: "#A9A9A9",
    },
    {
      id: "9",
      name: "Old Flooring Removal",
      image: undefined,
      description: "Removal and disposal of existing carpet, vinyl, and underlayment",
      area: "All Rooms",
      quantity: 1230,
      unit: "sq ft",
      price: 1.25,
      cost: 0.60,
      amount: 1537.50,
      taxable: false,
      color: "#696969",
    },
    {
      id: "10",
      name: "Floor Finishing & Sealing",
      image: undefined,
      description: "Application of polyurethane sealant for hardwood protection (3 coats)",
      area: "Living Room",
      quantity: 450,
      unit: "sq ft",
      price: 2.80,
      cost: 1.40,
      amount: 1260,
      taxable: true,
      color: "#DAA520",
    },
  ],
  notes: "All materials are premium grade. Hardwood requires 48 hours drying time before furniture placement. Warranty: 25 years manufacturer, 2 years installation.",
  payments: [
    {
      type: "Deposit - Check",
      amount: 5000.00,
      date: "1/15/2026 10:30 AM",
      status: "Completed",
    },
  ],
  attachments: [] as string[],
  signatures: [] as InvoiceSignature[],
}

export function InvoicePaymentDetailsPage() {
  const navigate = useNavigate()
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>(mockInvoice.items)
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false)
  
  // Editable fields
  const [discount, setDiscount] = useState(500) // Initial discount
  const [taxRate, setTaxRate] = useState(7.5) // 7.5% sales tax
  const [laborCost, setLaborCost] = useState(2400) // Additional labor
  const [tip, setTip] = useState(0)
  const [notes, setNotes] = useState(mockInvoice.notes)

  const handleDeleteItem = (itemId: string) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== itemId))
  }

  const handleAddItem = (newItem: InvoiceItem) => {
    setInvoiceItems(prev => [...prev, newItem])
    setIsAddItemModalOpen(false)
  }

  // Calculations
  const itemCost = invoiceItems.reduce((sum, item) => sum + item.amount, 0)
  const taxableAmount = itemCost - discount
  const tax = (taxableAmount * taxRate) / 100
  const subtotal = itemCost - discount
  const total = subtotal + tax + laborCost + tip

  // Calculate total area
  const totalArea = invoiceItems
    .filter(item => item.unit === 'sq ft')
    .reduce((sum, item) => sum + item.quantity, 0)

  const handleSendInvoice = () => {
    console.log("Send flooring invoice")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Home size={20} className="text-amber-700" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Invoice #{mockInvoice.id}
                </h1>
                <p className="text-sm text-gray-500">Job: {mockInvoice.jobId} • {mockInvoice.invoiceName}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 hover:bg-gray-100 rounded-lg border font-medium flex gap-2 items-center transition text-sm">
              <Zap size={16} className="text-amber-600" /> Actions
            </button>
            <button
              onClick={handleSendInvoice}
              className="px-4 py-2 bg-amber-700 text-white rounded-lg font-medium hover:bg-amber-800 transition flex items-center gap-2 text-sm"
            >
              <Send size={16} />
              Send Invoice
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* PROJECT SUMMARY CARD */}
        <div className="bg-gradient-to-r from-amber-700 to-amber-600 rounded-xl p-6 text-white shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-amber-100 text-xs uppercase font-medium mb-1">Total Area</p>
              <p className="text-2xl font-bold flex items-baseline gap-1">
                {totalArea.toLocaleString()} <span className="text-base font-normal">sq ft</span>
              </p>
            </div>
            <div>
              <p className="text-amber-100 text-xs uppercase font-medium mb-1">Total Items</p>
              <p className="text-2xl font-bold">{invoiceItems.length}</p>
            </div>
            <div>
              <p className="text-amber-100 text-xs uppercase font-medium mb-1">Invoice Date</p>
              <p className="text-lg font-semibold">{mockInvoice.invoiceDate}</p>
            </div>
            <div>
              <p className="text-amber-100 text-xs uppercase font-medium mb-1">Status</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold
                ${mockInvoice.sent === "No" ? "bg-red-500" : "bg-green-500"}`}>
                {mockInvoice.sent === "No" ? "Not Sent" : "Sent"}
              </span>
            </div>
          </div>
        </div>

        {/* CLIENT INFO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* BILL TO */}
          <div className="bg-white rounded-lg border p-5 shadow-sm">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
              <FileText size={14} /> Bill To
            </h3>
            <div className="space-y-1.5 text-sm">
              <p className="font-semibold text-gray-900 text-base">{mockInvoice.billTo.name}</p>
              <p className="text-gray-600">{mockInvoice.billTo.address}</p>
              <p className="text-gray-600">
                {mockInvoice.billTo.city}, {mockInvoice.billTo.state} {mockInvoice.billTo.zip}
              </p>
              <p className="text-gray-600">{mockInvoice.billTo.phone}</p>
              <p className="text-gray-600">{mockInvoice.billTo.email}</p>
            </div>
          </div>

          {/* SERVICE ADDRESS */}
          <div className="bg-white rounded-lg border p-5 shadow-sm">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
              <Home size={14} /> Service Address
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">{mockInvoice.serviceAddress}</p>
          </div>

          {/* INVOICE INFO */}
          <div className="bg-white rounded-lg border p-5 shadow-sm space-y-3">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Invoice ID</p>
              <p className="text-base font-bold text-gray-900">{mockInvoice.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Project Name</p>
              <p className="text-sm text-gray-900">{mockInvoice.invoiceName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Invoice Date</p>
              <p className="text-sm text-gray-900">{mockInvoice.invoiceDate}</p>
            </div>
          </div>
        </div>

        {/* ITEMS TABLE */}
        <div className="bg-white rounded-lg border shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold flex gap-2 items-center text-gray-900">
              <Ruler className="text-amber-600" size={20} />
              Flooring Materials & Services
            </h2>
            <button
              onClick={() => setIsAddItemModalOpen(true)}
              className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-amber-700 text-white rounded-lg font-medium hover:bg-amber-800 transition"
            >
              <Plus size={16} />
              Add Item
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left px-3 py-3 font-semibold text-gray-700 text-xs uppercase">Item Details</th>
                  <th className="text-left px-3 py-3 font-semibold text-gray-700 text-xs uppercase">Area/Room</th>
                  <th className="text-center px-3 py-3 font-semibold text-gray-700 text-xs uppercase">Qty</th>
                  <th className="text-center px-3 py-3 font-semibold text-gray-700 text-xs uppercase">Unit</th>
                  <th className="text-right px-3 py-3 font-semibold text-gray-700 text-xs uppercase">Price</th>
                  <th className="text-right px-3 py-3 font-semibold text-gray-700 text-xs uppercase">Cost</th>
                  <th className="text-right px-3 py-3 font-semibold text-gray-700 text-xs uppercase">Amount</th>
                  <th className="text-center px-3 py-3 font-semibold text-gray-700 text-xs uppercase">Tax</th>
                  <th className="text-center px-3 py-3 font-semibold text-gray-700 text-xs uppercase">Color</th>
                  <th className="text-center px-3 py-3 font-semibold text-gray-700 text-xs uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoiceItems.map(item => (
                  <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-3 py-3 max-w-[280px]">
                      <div className="flex gap-3">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt="" 
                            className="h-14 w-14 rounded-lg object-cover border flex-shrink-0" 
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm mb-0.5">{item.name}</p>
                          <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{item.area || '-'}</span>
                    </td>
                    <td className="text-center px-3 py-3 font-medium">{item.quantity.toLocaleString()}</td>
                    <td className="text-center px-3 py-3 text-xs text-gray-600">{item.unit}</td>
                    <td className="text-right px-3 py-3">${item.price.toFixed(2)}</td>
                    <td className="text-right px-3 py-3 text-gray-600">${item.cost.toFixed(2)}</td>
                    <td className="text-right px-3 py-3 font-semibold">${item.amount.toFixed(2)}</td>
                    <td className="text-center px-3 py-3">
                      <span className={`text-xs px-2 py-1 rounded ${item.taxable ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {item.taxable ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="text-center px-3 py-3">
                      {item.color && (
                        <div
                          className="w-6 h-6 rounded border border-gray-300 mx-auto shadow-sm"
                          style={{ backgroundColor: item.color }}
                          title={item.color}
                        />
                      )}
                    </td>
                    <td className="text-center px-3 py-3">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 hover:bg-red-50 rounded transition text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MAIN CONTENT - TWO COLUMNS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* NOTES SECTION */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-base font-bold text-gray-900 mb-3">Project Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Add notes about materials, installation, warranty, or special instructions…"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>

            {/* PAYMENTS SECTION */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">Payment History</h3>
              <div className="space-y-3">
                {mockInvoice.payments.length > 0 ? (
                  mockInvoice.payments.map((payment, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <p className="text-xs text-gray-600 font-bold uppercase">Type</p>
                        <p className="font-semibold text-sm">{payment.type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-bold uppercase">Amount</p>
                        <p className="font-bold text-base text-green-700">${payment.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-bold uppercase">Date</p>
                        <p className="font-medium text-sm">{payment.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-bold uppercase">Status</p>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-600 text-white">
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No payments recorded</p>
                )}
              </div>
              <button className="mt-4 px-4 py-2 bg-amber-700 text-white text-sm rounded-lg font-medium hover:bg-amber-800 transition">
                + Add Payment
              </button>
            </div>

            {/* ATTACHMENTS SECTION */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">Attachments</h3>
              <div className="border-2 border-dashed rounded-lg p-8 text-center bg-gray-50 flex flex-col items-center justify-center">
                <Paperclip className="w-8 h-8 text-amber-600 mb-2" />
                <p className="text-sm text-gray-700 font-medium">Upload floor plans, photos, or documents</p>
                <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG, DWG</p>
              </div>
            </div>

            {/* SIGNATURES SECTION */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">Customer Signature</h3>
              <div className="border-2 border-dashed rounded-lg p-8 text-center bg-gray-50 flex flex-col items-center justify-center">
                <SignatureIcon className="w-10 h-10 text-amber-600 mb-3" />
                <p className="text-gray-600 mb-4 text-base font-medium">
                  {mockInvoice.signatures.length === 0
                    ? "No signatures collected"
                    : `${mockInvoice.signatures.length} signature(s)`}
                </p>
                <button className="px-4 py-2 bg-amber-700 text-white rounded-lg font-medium hover:bg-amber-800 transition text-sm">
                  Request Signature
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - SUMMARY BOX */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border shadow-sm p-6 space-y-4 sticky top-24">
              <h3 className="text-base font-bold text-gray-900 border-b pb-3">Invoice Summary</h3>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-700">Materials & Services</span>
                <input
                  type="number"
                  value={itemCost.toFixed(2)}
                  readOnly
                  className="max-w-[110px] border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-gray-50 text-right font-medium"
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-700">Discount</span>
                <input
                  type="number"
                  value={discount.toFixed(2)}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="max-w-[110px] border border-gray-300 rounded-md px-3 py-1.5 text-sm text-right"
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-700">Taxable Amount</span>
                <input
                  type="number"
                  value={taxableAmount.toFixed(2)}
                  readOnly
                  className="max-w-[110px] border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-gray-50 text-right"
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-700">Sales Tax Rate</span>
                <select
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="max-w-[110px] border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                >
                  <option value={0}>0%</option>
                  <option value={5}>5%</option>
                  <option value={7.5}>7.5%</option>
                  <option value={8.25}>8.25%</option>
                  <option value={10}>10%</option>
                </select>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-700">Sales Tax</span>
                <input
                  type="number"
                  value={tax.toFixed(2)}
                  readOnly
                  className="max-w-[110px] border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-gray-50 text-right"
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-700">Additional Labor</span>
                <input
                  type="number"
                  value={laborCost.toFixed(2)}
                  onChange={(e) => setLaborCost(Number(e.target.value))}
                  className="max-w-[110px] border border-gray-300 rounded-md px-3 py-1.5 text-sm text-right"
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-700">Gratuity/Tip</span>
                <input
                  type="number"
                  value={tip.toFixed(2)}
                  onChange={(e) => setTip(Number(e.target.value))}
                  className="max-w-[110px] border border-gray-300 rounded-md px-3 py-1.5 text-sm text-right"
                />
              </div>

              <div className="border-t pt-3" />

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-700 font-semibold">Subtotal</span>
                <input
                  type="number"
                  value={subtotal.toFixed(2)}
                  readOnly
                  className="max-w-[110px] border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-gray-50 font-semibold text-right"
                />
              </div>

              <div className="flex justify-between items-center border-t pt-3">
                <span className="font-bold text-base">Total Amount</span>
                <input
                  type="number"
                  value={total.toFixed(2)}
                  readOnly
                  className="max-w-[110px] border-2 border-amber-700 rounded-md px-3 py-1.5 text-sm bg-white font-bold text-amber-700 text-right"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                <p className="text-xs text-gray-600 text-center mb-1">Flexible Financing Available</p>
                <p className="text-sm font-semibold text-center text-amber-800">
                  As low as ${(total / 12).toFixed(2)}/mo with Affirm
                </p>
              </div>

              <button className="w-full px-4 py-2.5 bg-amber-700 text-white rounded-lg font-medium hover:bg-amber-800 transition text-sm mt-3">
                Send Loan Application
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ADD ITEM MODAL */}
      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        onSubmit={handleAddItem}
      />
    </div>
  )
}

/* ================= ADD ITEM MODAL (Flooring Version) ================= */

interface AddItemModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (item: InvoiceItem) => void
}

type ImageInputMode = "upload" | "url"

function AddItemModal({ isOpen, onClose, onSubmit }: AddItemModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    area: "",
    quantity: 1,
    unit: "sq ft",
    price: 0,
    cost: 0,
    taxable: true,
    color: "#D3D3D3",
  })

  // Image states
  const [imageMode, setImageMode] = useState<ImageInputMode>("upload")
  const [imageUrl, setImageUrl] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string>("")
  const [isDragging, setIsDragging] = useState(false)
  const [imageError, setImageError] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Calculate amount
  const amount = formData.quantity * formData.price

  // Get final image
  const finalImage = imageMode === "upload" ? uploadedImage : imageUrl

  // Handle file selection
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string)
      setUploadedFileName(file.name)
      setImageError(false)
    }
    reader.readAsDataURL(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileSelect(file)
  }, [])

  const removeUploadedImage = () => {
    setUploadedImage(null)
    setUploadedFileName("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      area: "",
      quantity: 1,
      unit: "sq ft",
      price: 0,
      cost: 0,
      taxable: true,
      color: "#D3D3D3",
    })
    setImageMode("upload")
    setImageUrl("")
    setUploadedImage(null)
    setUploadedFileName("")
    setImageError(false)
  }

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert("Please enter item name")
      return
    }

    if (formData.price <= 0) {
      alert("Please enter a valid price")
      return
    }

    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      area: formData.area,
      image: finalImage || undefined,
      quantity: formData.quantity,
      unit: formData.unit,
      price: formData.price,
      cost: formData.cost,
      amount: amount,
      taxable: formData.taxable,
      color: formData.color || undefined,
    }

    onSubmit(newItem)
    resetForm()
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b bg-amber-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-700 rounded-lg flex items-center justify-center">
              <Plus className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Add Flooring Item</h2>
              <p className="text-sm text-gray-600">Add material or service to invoice</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Item Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Item Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Oak Hardwood Flooring"
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-amber-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Area/Room */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Area/Room
            </label>
            <div className="relative">
              <Home size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.area}
                onChange={e => setFormData(prev => ({ ...prev, area: e.target.value }))}
                placeholder="e.g., Living Room, Kitchen"
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-amber-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Material specifications, brand, finish, etc."
              rows={2}
              className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-amber-600 focus:outline-none resize-none"
            />
          </div>

          {/* Image Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Item Image
              </label>
              
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setImageMode("upload")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all
                    ${imageMode === "upload" 
                      ? "bg-white text-amber-700 shadow-sm" 
                      : "text-gray-600 hover:text-gray-800"
                    }`}
                >
                  <Upload size={14} />
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode("url")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all
                    ${imageMode === "url" 
                      ? "bg-white text-amber-700 shadow-sm" 
                      : "text-gray-600 hover:text-gray-800"
                    }`}
                >
                  <LinkIcon size={14} />
                  URL
                </button>
              </div>
            </div>

            {imageMode === "upload" && (
              <div>
                {!uploadedImage ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                      ${isDragging 
                        ? "border-amber-600 bg-amber-50" 
                        : "border-gray-300 hover:border-amber-500 hover:bg-gray-50"
                      }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Upload className="text-amber-700" size={20} />
                    </div>
                    
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {isDragging ? "Drop image here" : "Click to upload or drag & drop"}
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                  </div>
                ) : (
                  <div className="relative border rounded-xl p-3 bg-gray-50">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img src={uploadedImage} alt="Preview" className="w-20 h-20 object-cover rounded-lg border" />
                        <button
                          type="button"
                          onClick={removeUploadedImage}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{uploadedFileName}</p>
                        <p className="text-xs text-gray-500 mt-1">Image uploaded</p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-2 text-xs text-amber-700 font-medium hover:underline"
                        >
                          Change image
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {imageMode === "url" && (
              <div className="space-y-3">
                <div className="relative">
                  <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={e => {
                      setImageUrl(e.target.value)
                      setImageError(false)
                    }}
                    placeholder="https://example.com/flooring-image.jpg"
                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  />
                </div>
                
                {imageUrl && !imageError && (
                  <div className="relative border rounded-xl p-3 bg-gray-50">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-lg border"
                          onError={() => setImageError(true)}
                        />
                        <button
                          type="button"
                          onClick={() => setImageUrl("")}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">External Image</p>
                        <p className="text-xs text-gray-500 mt-1 truncate">{imageUrl}</p>
                      </div>
                    </div>
                  </div>
                )}

                {imageUrl && imageError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">Unable to load image. Check the URL.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quantity, Unit, Price, Cost */}
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Qty <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0.1"
                step="any"
                value={formData.quantity}
                onChange={e => setFormData(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 1 }))}
                className="w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-amber-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Unit
              </label>
              <select
                value={formData.unit}
                onChange={e => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                className="w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-amber-600 focus:outline-none"
              >
                <option value="sq ft">sq ft</option>
                <option value="linear ft">linear ft</option>
                <option value="pieces">pieces</option>
                <option value="box">box</option>
                <option value="set">set</option>
                <option value="hour">hour</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price || ""}
                  onChange={e => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                  className="w-full pl-7 pr-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-amber-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cost
              </label>
              <div className="relative">
                <DollarSign size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cost || ""}
                  onChange={e => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                  className="w-full pl-7 pr-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-amber-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Taxable & Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Taxable
              </label>
              <div className="flex items-center gap-4 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="taxable"
                    checked={formData.taxable === true}
                    onChange={() => setFormData(prev => ({ ...prev, taxable: true }))}
                    className="accent-amber-700 w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="taxable"
                    checked={formData.taxable === false}
                    onChange={() => setFormData(prev => ({ ...prev, taxable: false }))}
                    className="accent-amber-700 w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Color Tag
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.color}
                  onChange={e => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-12 h-10 rounded-lg border cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={e => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  placeholder="#D3D3D3"
                  className="flex-1 px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-amber-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Amount Preview */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign size={18} className="text-amber-700" />
                <span className="text-sm font-semibold text-gray-700">Total Amount</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-amber-700">${amount.toFixed(2)}</p>
                <p className="text-xs text-gray-600">
                  {formData.quantity} {formData.unit} × ${formData.price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-4 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.name.trim() || formData.price <= 0}
            className="px-6 py-2 bg-amber-700 text-white rounded-lg text-sm font-semibold hover:bg-amber-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Invoice
          </button>
        </div>
      </div>
    </div>
  )
}