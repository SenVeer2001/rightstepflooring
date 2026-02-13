// InvoiceDetailsPage.tsx
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
  Link as LinkIcon
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
  price: number
  cost: number
  amount: number
  taxable: boolean
  color?: string
}

/* MOCK DATA */
const mockInvoice = {
  id: "579",
  jobId: "454",
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
  serviceAddress: "Some ass billing address",
  invoiceName: "Right Step Flooring",
  invoiceDate: "1/22/2026",
  sent: "No",
  items: [
    {
      id: "1",
      name: "Ceramic Tile Installation",
      image: "https://images.pexels.com/photos/16501255/pexels-photo-16501255.jpeg",
      description: "Professional installation of ceramic floor tiles including alignment, spacing, and finishing.",
      quantity: 320.0,
      price: 3.25,
      cost: 1.85,
      amount: 1040.0,
      taxable: true,
      color: "#DADADA",
    },
    {
      id: "2",
      name: "Porcelain Floor Tiles",
      image: "https://images.pexels.com/photos/7018406/pexels-photo-7018406.jpeg",
      description: "Premium porcelain tiles with high durability and water resistance, ideal for living areas.",
      quantity: 210.0,
      price: 4.9,
      cost: 3.1,
      amount: 1029.0,
      taxable: true,
      color: "#CFCFCF",
    },
    {
      id: "3",
      name: "Hardwood Flooring Installation",
      image: "https://images.pexels.com/photos/6585751/pexels-photo-6585751.jpeg",
      description: "Natural hardwood floor installation with smooth finishing for a premium interior look.",
      quantity: 180.0,
      price: 7.8,
      cost: 5.2,
      amount: 1404.0,
      taxable: true,
      color: "#8B5A2B",
    },
    {
      id: "4",
      name: "Laminate Flooring Panels",
      image: "https://images.pexels.com/photos/4112556/pexels-photo-4112556.jpeg",
      description: "Scratch-resistant laminate panels designed to replicate real wood textures.",
      quantity: 260.0,
      price: 2.9,
      cost: 1.6,
      amount: 754.0,
      taxable: true,
      color: "#BFA58A",
    },
  ],
  notes: "",
  payments: [
    {
      type: "Check",
      amount: 1101.45,
      date: "1/21/2026 01:19 PM",
      status: "Completed",
    },
  ],
  attachments: [] as string[],
  signatures: [] as InvoiceSignature[],
}

export function InvoiceDetailsPage() {
  const navigate = useNavigate()
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>(mockInvoice.items)
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false)
  
  // Editable fields
  const [discount, setDiscount] = useState(0)
  const [taxRate, setTaxRate] = useState(0)
  const [laborCost, setLaborCost] = useState(0)
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

  const handleSendInvoice = () => {
    console.log("Send invoice")
  }

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Invoice #{mockInvoice.id}
              </h1>
              <p className="text-sm text-gray-500">Job ID: {mockInvoice.jobId}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <button className="p-2 hover:bg-gray-100 rounded-lg border font-semibold flex gap-2 items-center transition">
              <Zap size={18} className="text-primary" /> Action
            </button>
            <button
              onClick={handleSendInvoice}
              className="px-4 py-2 bg-[#387d22] text-white rounded-lg font-semibold hover:bg-opacity-90 transition flex items-center gap-2"
            >
              <Send size={16} />
              Send
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 space-y-6">
        {/* CLIENT INFO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* BILL TO */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
              Bill To:
            </h3>
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-gray-900">{mockInvoice.billTo.name}</p>
              <p className="text-gray-600">{mockInvoice.billTo.address}</p>
              <p className="text-gray-600">
                {mockInvoice.billTo.city}, {mockInvoice.billTo.state} {mockInvoice.billTo.zip}
              </p>
              <p className="text-gray-600">{mockInvoice.billTo.phone}</p>
              <p className="text-gray-600">{mockInvoice.billTo.email}</p>
            </div>
          </div>

          {/* SERVICE ADDRESS */}
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
              Service Address:
            </h3>
            <p className="text-sm text-gray-600">{mockInvoice.serviceAddress}</p>
          </div>

          {/* INVOICE INFO */}
          <div className="bg-white rounded-xl border p-6 space-y-3">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Invoice ID</p>
              <p className="text-lg font-bold text-gray-900">{mockInvoice.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Invoice Name</p>
              <p className="text-sm text-gray-900">{mockInvoice.invoiceName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Invoice Date</p>
              <p className="text-sm text-gray-900">{mockInvoice.invoiceDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Sent</p>
              <p className={`text-sm font-semibold ${mockInvoice.sent === "No" ? "text-red-600" : "text-green-600"}`}>
                {mockInvoice.sent}
              </p>
            </div>
          </div>
        </div>

        {/* ITEMS TABLE */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <div className="flex justify-between">
            <h2 className="text-lg font-bold flex gap-2 text-gray-900">
              Items <Layers className="text-primary"/>
            </h2>
            <button
              onClick={() => setIsAddItemModalOpen(true)}
              className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-opacity-90 transition"
            >
              <Plus size={16} />
              Add Item
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Item</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">Quantity</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">Price</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">Cost</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">Amount</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">Taxable</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">Color</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoiceItems.map(item => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4 max-w-[250px]">
                      <div className="flex gap-3">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt="" 
                            className="h-12 w-16 rounded-md object-cover" 
                          />
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-center px-4 py-4">{item.quantity}</td>
                    <td className="text-center px-4 py-4">${item.price.toFixed(2)}</td>
                    <td className="text-center px-4 py-4">${item.cost.toFixed(2)}</td>
                    <td className="text-center px-4 py-4 font-semibold">${item.amount.toFixed(2)}</td>
                    <td className="text-center px-4 py-4">{item.taxable ? "Yes" : "No"}</td>
                    <td className="text-center px-4 py-4">
                      {item.color && (
                        <div
                          className="w-6 h-6 rounded border border-gray-300 mx-auto"
                          style={{ backgroundColor: item.color }}
                          title={item.color}
                        />
                      )}
                    </td>
                    <td className="text-center px-4 py-4">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 hover:bg-red-50 rounded transition text-red-600"
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
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Add notes for this invoice…"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#387d22]"
              />
            </div>

            {/* PAYMENTS SECTION */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Payments</h3>
              <div className="space-y-3">
                {mockInvoice.payments.length > 0 ? (
                  mockInvoice.payments.map((payment, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-[#387d22]/10 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-600 font-semibold uppercase">Type</p>
                        <p className="font-bold text-md">{payment.type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-semibold uppercase">Amount</p>
                        <p className="font-bold text-lg">${payment.amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-semibold uppercase">Date</p>
                        <p className="font-semibold">{payment.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-semibold uppercase">Status</p>
                        <p className="font-semibold text-green-600">{payment.status}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No payments recorded</p>
                )}
              </div>
              <button className="mt-4 px-4 py-2 bg-primary text-white text-sm rounded-lg font-semibold hover:bg-opacity-90 transition">
                + Add payment
              </button>
            </div>

            {/* ATTACHMENTS SECTION */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Attachments</h3>
              <div className="border-2 border-dashed rounded-lg p-8 text-center bg-gray-50 flex flex-col items-center justify-center">
                <Paperclip className="w-8 h-8 text-[#387d22] mb-2" />
                <p className="text-sm text-gray-600">Upload attachments</p>
                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG</p>
              </div>
            </div>

            {/* SIGNATURES SECTION */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Signatures</h3>
              <div className="border-2 border-dashed rounded-lg p-8 text-center bg-gray-50 flex flex-col items-center justify-center">
                <p className="text-gray-500 mb-4 text-lg">
                  {mockInvoice.signatures.length === 0
                    ? "No signatures found"
                    : `${mockInvoice.signatures.length} signature(s)`}
                </p>
                <button className="px-4 py-2 text-gray-900 rounded-lg font-semibold hover:bg-opacity-90 transition">
                  <SignatureIcon className="text-primary"/> Sign
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - SUMMARY BOX */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border p-6 space-y-4 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900">Summary</h3>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Item cost</span>
                <input
                  type="number"
                  value={itemCost.toFixed(2)}
                  readOnly
                  className="max-w-[120px] border border-gray-400 rounded-md px-2 py-1 text-sm bg-gray-100 text-right"
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Discount</span>
                <input
                  type="number"
                  value={discount.toFixed(2)}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="max-w-[120px] border border-gray-400 rounded-md px-2 py-1 text-sm text-right"
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Taxable</span>
                <input
                  type="number"
                  value={taxableAmount.toFixed(2)}
                  readOnly
                  className="max-w-[120px] border border-gray-400 rounded-md px-2 py-1 text-sm bg-gray-100 text-right"
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Tax rate</span>
                <select
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="max-w-[120px] border border-gray-400 rounded-md px-2 py-1 text-sm"
                >
                  <option value={0}>0%</option>
                  <option value={5}>5%</option>
                  <option value={10}>10%</option>
                  <option value={18}>18%</option>
                  <option value={20}>20%</option>
                </select>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Tax</span>
                <input
                  type="number"
                  value={tax.toFixed(2)}
                  readOnly
                  className="max-w-[120px] border border-gray-400 rounded-md px-2 py-1 text-sm bg-gray-100 text-right"
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Labor cost</span>
                <input
                  type="number"
                  value={laborCost.toFixed(2)}
                  onChange={(e) => setLaborCost(Number(e.target.value))}
                  className="max-w-[120px] border border-gray-400 rounded-md px-2 py-1 text-sm text-right"
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Tip</span>
                <input
                  type="number"
                  value={tip.toFixed(2)}
                  onChange={(e) => setTip(Number(e.target.value))}
                  className="max-w-[120px] border border-gray-400 rounded-md px-2 py-1 text-sm text-right"
                />
              </div>

              <div className="border-t pt-4" />

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-semibold">Subtotal</span>
                <input
                  type="number"
                  value={subtotal.toFixed(2)}
                  readOnly
                  className="max-w-[120px] border border-gray-400 rounded-md px-2 py-1 text-sm bg-gray-100 font-semibold text-right"
                />
              </div>

              <div className="flex justify-between items-center text-base border-t pt-4">
                <span className="font-bold">Total</span>
                <input
                  type="number"
                  value={total.toFixed(2)}
                  readOnly
                  className="max-w-[120px] border-2 border-[#387d22] rounded-md px-2 py-1 text-sm bg-white font-bold text-[#387d22] text-right"
                />
              </div>

              <p className="text-sm text-gray-500 text-center mt-3">
                Or as low as ${(total / 12).toFixed(2)}/mo with Affirm
              </p>

              <button className="w-full px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary transition text-sm">
                Send loan application
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

/* ================= ADD ITEM MODAL ================= */

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
    quantity: 1,
    price: 0,
    cost: 0,
    taxable: true,
    color: "#DADADA",
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

  // Get final image (either uploaded or URL)
  const finalImage = imageMode === "upload" ? uploadedImage : imageUrl

  // Handle file selection
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file (JPG, PNG, GIF, etc.)")
      return
    }

    // Check file size (max 5MB)
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

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  // Handle drag events
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
    if (file) {
      handleFileSelect(file)
    }
  }, [])

  // Remove uploaded image
  const removeUploadedImage = () => {
    setUploadedImage(null)
    setUploadedFileName("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      quantity: 1,
      price: 0,
      cost: 0,
      taxable: true,
      color: "#DADADA",
    })
    setImageMode("upload")
    setImageUrl("")
    setUploadedImage(null)
    setUploadedFileName("")
    setImageError(false)
    setIsDragging(false)
  }

  // Handle submit
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
      image: finalImage || undefined,
      quantity: formData.quantity,
      price: formData.price,
      cost: formData.cost,
      amount: amount,
      taxable: formData.taxable,
      color: formData.color || undefined,
    }

    onSubmit(newItem)
    resetForm()
  }

  // Handle close
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
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Plus className="text-primary" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Add New Item</h2>
              <p className="text-sm text-gray-500">Add item details to the invoice</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter item name"
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter item description"
              rows={2}
              className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none resize-none"
            />
          </div>

          {/* Image Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Item Image
              </label>
              
              {/* Toggle between Upload and URL */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setImageMode("upload")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all
                    ${imageMode === "upload" 
                      ? "bg-white text-primary shadow-sm" 
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
                      ? "bg-white text-primary shadow-sm" 
                      : "text-gray-600 hover:text-gray-800"
                    }`}
                >
                  <LinkIcon size={14} />
                  URL
                </button>
              </div>
            </div>

            {/* Upload Mode */}
            {imageMode === "upload" && (
              <div>
                {!uploadedImage ? (
                  /* Drop Zone */
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                      ${isDragging 
                        ? "border-primary bg-primary/5" 
                        : "border-gray-300 hover:border-primary/50 hover:bg-gray-50"
                      }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Upload className="text-primary" size={24} />
                    </div>
                    
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {isDragging ? "Drop image here" : "Click to upload or drag & drop"}
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                ) : (
                  /* Image Preview */
                  <div className="relative border rounded-xl p-3 bg-gray-50">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img
                          src={uploadedImage}
                          alt="Preview"
                          className="w-24 h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={removeUploadedImage}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {uploadedFileName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Image uploaded successfully
                        </p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-2 text-xs text-primary font-medium hover:underline"
                        >
                          Change image
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* URL Mode */}
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
                    placeholder="https://example.com/image.jpg"
                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                
                {/* URL Preview */}
                {imageUrl && !imageError && (
                  <div className="relative border rounded-xl p-3 bg-gray-50">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="w-24 h-24 object-cover rounded-lg border"
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
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {imageUrl}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {imageUrl && imageError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">
                      Unable to load image. Please check the URL.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quantity, Price, Cost - Row */}
          <div className="grid grid-cols-3 gap-4">
            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={formData.quantity}
                  onChange={e => setFormData(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 1 }))}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price || ""}
                  onChange={e => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost
              </label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cost || ""}
                  onChange={e => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Taxable & Color - Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Taxable */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taxable
              </label>
              <div className="flex items-center gap-4 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="taxable"
                    checked={formData.taxable === true}
                    onChange={() => setFormData(prev => ({ ...prev, taxable: true }))}
                    className="accent-primary w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="taxable"
                    checked={formData.taxable === false}
                    onChange={() => setFormData(prev => ({ ...prev, taxable: false }))}
                    className="accent-primary w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  placeholder="#DADADA"
                  className="flex-1 px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Amount Preview */}
          <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign size={20} className="text-primary" />
                <span className="text-sm font-medium text-gray-700">Calculated Amount</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">${amount.toFixed(2)}</p>
                <p className="text-xs text-gray-500">
                  {formData.quantity} × ${formData.price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-4 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.name.trim() || formData.price <= 0}
            className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Item
          </button>
        </div>
      </div>
    </div>
  )
}