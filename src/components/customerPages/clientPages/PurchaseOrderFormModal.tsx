// PurchaseOrderFormModal.tsx
import { useEffect, useState } from "react"
import { SelectItemsFromJobModal } from "./SelectItemsFromJobModal"
import { CreateVendorModal } from "./CreateVendorModal"
import type { PurchaseOrder, Vendor } from "../../../types/vendor"
import { Download } from "lucide-react"
import Select from "react-select"
import { vendorsData } from "../../../services/orderdata"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export interface Item {
  id: number
  name: string
  quantity: number
  cost: number
  image?: string
  color?: string
  type: string
}

interface PurchaseOrderFormModalProps {
  isOpen: boolean
  mode: "create" | "edit"
  initialPO?: PurchaseOrder | null
  onClose: () => void
  jobItems?: Item[]
}

export function PurchaseOrderFormModal({
  isOpen,
  mode,
  initialPO,
  onClose,
  jobItems = [],
}: PurchaseOrderFormModalProps) {

  /* -------------------- ALL HOOKS FIRST -------------------- */
  const [isItemSelectorOpen, setIsItemSelectorOpen] = useState(false)
  const [vendors, setVendors] = useState<Vendor[]>(vendorsData || [])
  const [vendorOpenForm, setVendorOpenForm] = useState(false)
  const [selectedPOItems, setSelectedPOItems] = useState<Item[]>([])
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([])
  const [orderDate, setOrderDate] = useState("")
  const [isDownloading, setIsDownloading] = useState(false)

  /* -------------------- PREFILL (EDIT MODE) -------------------- */
  useEffect(() => {
    if (!isOpen) return

    if (mode === "edit" && initialPO) {
      setSelectedVendorIds([initialPO.vendorId])
      setOrderDate(initialPO.orderDate || "")
      setSelectedPOItems(initialPO.items || [])
    }

    if (mode === "create") {
      setSelectedVendorIds([])
      setOrderDate("")
      setSelectedPOItems([])
    }
  }, [isOpen, mode, initialPO])

  /* -------------------- PDF GENERATION -------------------- */
  const generatePDF = () => {
    if (selectedPOItems.length === 0) {
      alert("Please add items to the purchase order before downloading.")
      return
    }

    setIsDownloading(true)
    
    try {
      const doc = new jsPDF()
      
      // Get vendor details
      const selectedVendor = vendors.find(v => v.id === selectedVendorIds[0])
      const vendorName = selectedVendor?.name || "No vendor selected"
      const poNumber = initialPO?.id || `PO-${Date.now()}`
      
      // Company Header
      doc.setFontSize(22)
      doc.setTextColor(41, 128, 185)
      doc.text("PURCHASE ORDER", 105, 20, { align: "center" })
      
      // Draw header line
      doc.setDrawColor(41, 128, 185)
      doc.setLineWidth(0.5)
      doc.line(20, 25, 190, 25)
      
      // PO Number and Date
      doc.setFontSize(11)
      doc.setTextColor(60, 60, 60)
      doc.setFont("helvetica", "bold")
      doc.text("PO Number:", 20, 35)
      doc.setFont("helvetica", "normal")
      doc.text(poNumber, 50, 35)
      
      doc.setFont("helvetica", "bold")
      doc.text("Date:", 20, 42)
      doc.setFont("helvetica", "normal")
      doc.text(orderDate || new Date().toLocaleDateString(), 50, 42)
      
      // Vendor Information Box
      doc.setFillColor(245, 245, 245)
      doc.rect(20, 50, 85, 35, 'F')
      
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(41, 128, 185)
      doc.text("Vendor Information", 25, 58)
      
      doc.setFontSize(10)
      doc.setTextColor(60, 60, 60)
      doc.setFont("helvetica", "bold")
      doc.text(vendorName, 25, 66)
      
      doc.setFont("helvetica", "normal")
      if (selectedVendor) {
        let yPos = 72
         // @ts-ignore
        if (selectedVendor.email) {
           // @ts-ignore
          doc.text(`Email: ${selectedVendor.email}`, 25, yPos)
          yPos += 5
        }
         // @ts-ignore
        if (selectedVendor.phone) {
           // @ts-ignore
          doc.text(`Phone: ${selectedVendor.phone}`, 25, yPos)
          yPos += 5
        }
         // @ts-ignore
        if (selectedVendor.address) {
           // @ts-ignore
          doc.text(`Address: ${selectedVendor.address}`, 25, yPos)
        }
      }
      
      // Calculate totals
      const subtotal = selectedPOItems.reduce((sum, item) => 
        sum + (item.cost * item.quantity), 0
      )
      const tax = subtotal * 0.1 // 10% tax
      const total = subtotal + tax
      
      // Items Table
      const tableData = selectedPOItems.map((item, index) => [
        (index + 1).toString(),
        item.name,
        item.type === "product" ? "Product" : "Service",
        item.quantity.toString(),
        `$${item.cost.toFixed(2)}`,
        `$${(item.cost * item.quantity).toFixed(2)}`
      ])
      
      autoTable(doc, {
        head: [["#", "Item Description", "Type", "Qty", "Unit Cost", "Total"]],
        body: tableData,
        startY: 95,
        theme: 'striped',
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [60, 60, 60]
        },
        columnStyles: {
          0: { cellWidth: 15, halign: 'center' },
          1: { cellWidth: 75 },
          2: { cellWidth: 25, halign: 'center' },
          3: { cellWidth: 20, halign: 'center' },
          4: { cellWidth: 25, halign: 'right' },
          5: { cellWidth: 25, halign: 'right' }
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: { left: 20, right: 20 }
      })
      
      // Get the final Y position after table
      const finalY = (doc as any).lastAutoTable.finalY || 150
      
      // Summary Box
      const summaryStartY = finalY + 10
      doc.setFillColor(245, 245, 245)
      doc.rect(130, summaryStartY, 60, 30, 'F')
      
      doc.setFontSize(10)
      doc.setTextColor(60, 60, 60)
      doc.setFont("helvetica", "normal")
      
      // Subtotal
      doc.text("Subtotal:", 135, summaryStartY + 8)
      doc.text(`$${subtotal.toFixed(2)}`, 185, summaryStartY + 8, { align: "right" })
      
      // Tax
      doc.text("Tax (10%):", 135, summaryStartY + 15)
      doc.text(`$${tax.toFixed(2)}`, 185, summaryStartY + 15, { align: "right" })
      
      // Total line
      doc.setDrawColor(41, 128, 185)
      doc.setLineWidth(0.3)
      doc.line(135, summaryStartY + 18, 185, summaryStartY + 18)
      
      // Total
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(41, 128, 185)
      doc.text("Total:", 135, summaryStartY + 25)
      doc.text(`$${total.toFixed(2)}`, 185, summaryStartY + 25, { align: "right" })
      
      // Terms & Conditions
      const termsY = summaryStartY + 40
      doc.setFontSize(11)
      doc.setTextColor(41, 128, 185)
      doc.setFont("helvetica", "bold")
      doc.text("Terms & Conditions:", 20, termsY)
      
      doc.setFontSize(9)
      doc.setTextColor(80, 80, 80)
      doc.setFont("helvetica", "normal")
      doc.text("• Payment terms: Net 30 days from date of invoice", 20, termsY + 7)
      doc.text("• Please reference PO number on all invoices and shipments", 20, termsY + 13)
      doc.text("• All items subject to inspection and approval upon delivery", 20, termsY + 19)
      doc.text("• Any discrepancies must be reported within 48 hours of receipt", 20, termsY + 25)
      
      // Footer
      doc.setDrawColor(200, 200, 200)
      doc.setLineWidth(0.5)
      doc.line(20, 275, 190, 275)
      
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text("This is a computer-generated purchase order", 105, 280, { align: "center" })
      doc.text(`Generated on ${new Date().toLocaleString()}`, 105, 285, { align: "center" })
      
      // Save the PDF
      const fileName = `PO_${poNumber}_${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(fileName)
      
      console.log("PDF generated successfully:", fileName)
      
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  /* -------------------- CONDITIONAL RENDER -------------------- */
  if (!isOpen) return null

  /* -------------------- SAFE FILTERING -------------------- */
  const safeJobItems = jobItems || []
  
  const availableItems = safeJobItems.filter(
    jobItem =>
      !selectedPOItems.some(
        selectedItem => selectedItem.id === jobItem.id
      )
  )

  /* -------------------- VENDOR OPTIONS -------------------- */
  const vendorOptions = [
    ...(vendors || []).map(vendor => ({
      value: vendor.id,
      label: vendor.name,
    })),
    {
      value: "__create__",
      label: "+ Create vendor",
    },
  ]

  const selectedVendorOptions = vendorOptions.filter(option =>
    selectedVendorIds.includes(option.value)
  )

  /* -------------------- HANDLE SAVE -------------------- */
  const handleSave = () => {
    const poData = {
      id: initialPO?.id || Date.now().toString(),
      vendorId: selectedVendorIds[0] || "",
      orderDate: orderDate,
      items: selectedPOItems,
    }
    console.log("Saving PO:", poData)
    onClose()
  }

  // Calculate totals for display
  const subtotal = selectedPOItems.reduce((sum, item) => sum + (item.cost * item.quantity), 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  /* -------------------- UI -------------------- */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-6xl p-6 shadow-xl min-h-[80vh] max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            {mode === "create" ? "Create purchase order" : "Edit purchase order"}
          </h2>
          <div className="flex items-center gap-3">
            {/* Download Button */}
            <button
              onClick={generatePDF}
              disabled={selectedPOItems.length === 0 || isDownloading}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={18} />
              {isDownloading ? "Generating..." : "Download PDF"}
            </button>
            
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* VENDOR + DATE */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vendor
            </label>
            <Select
              options={vendorOptions}
              value={selectedVendorOptions}
              onChange={selectedOption => {
                if (!selectedOption) return

                // @ts-ignore
                if (selectedOption.value === "__create__") {
                  setVendorOpenForm(true)
                  return
                }
                // @ts-ignore
                setSelectedVendorIds([selectedOption.value])
              }}
              className="text-sm"
              placeholder="Select vendor"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Date
            </label>
            <input
              type="date"
              value={orderDate}
              onChange={e => setOrderDate(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* ADD ITEMS */}
        <div className="flex gap-3 mb-4">
          <select
            className="flex-1 border rounded-md px-3 py-2 text-sm"
            value=""
            onChange={e => {
              const itemId = Number(e.target.value)
              const item = safeJobItems.find(i => i.id === itemId)
              if (!item) return
              setSelectedPOItems(prev => [...prev, item])
            }}
          >
            <option value="">Add items</option>
            {availableItems.map(item => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsItemSelectorOpen(true)}
            className="px-4 py-2 border rounded-md text-sm font-semibold hover:bg-gray-50"
          >
            Select from job
          </button>
        </div>

        {/* ITEMS TABLE */}
        <div className="border rounded-lg overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Item</th>
                <th className="px-4 py-2 text-center">Cost</th>
                <th className="px-4 py-2 text-center">Qty</th>
                <th className="px-4 py-2 text-center">Total</th>
                <th className="px-4 py-2 text-center">Color</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedPOItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-400">
                    No items added
                  </td>
                </tr>
              ) : (
                selectedPOItems.map(item => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-4 max-w-[300px]">
                      <div className="flex gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            height={50}
                            width={70}
                            className="max-h-14 w-16 rounded-md object-cover"
                          />
                        )}
                        <div className="flex flex-col gap-1">
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <span
                            className={`py-1 rounded-full text-xs font-semibold ${
                              item.type === "product"
                                ? "text-blue-700"
                                : "text-green-700"
                            }`}
                          >
                            {item.type === "product" ? "Product" : "Service"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center">${item.cost.toFixed(2)}</td>
                    <td className="px-4 py-2 text-center">{item.quantity}</td>
                    <td className="px-4 py-2 text-center font-medium">
                      ${(item.cost * item.quantity).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {item.color ? (
                        <div
                          className="w-6 h-6 rounded border border-gray-300 mx-auto"
                          style={{ backgroundColor: item.color }}
                          title={item.color}
                        />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() =>
                          setSelectedPOItems(prev =>
                            prev.filter(i => i.id !== item.id)
                          )
                        }
                        className="text-red-600 text-xs hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* SUMMARY */}
        {selectedPOItems.length > 0 && (
          <div className="flex justify-end mb-4">
            <div className="bg-gray-50 rounded-lg p-4 w-64">
              <div className="flex justify-between text-sm mb-2">
                <span>Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Tax (10%):</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="px-6 py-2 bg-primary text-white rounded-full text-sm font-semibold"
          >
            Save PO
          </button>
        </div>

        {/* MODALS */}
        <SelectItemsFromJobModal
          isOpen={isItemSelectorOpen}
          jobItems={safeJobItems}
          selectedPOItems={selectedPOItems}
          onClose={() => setIsItemSelectorOpen(false)}
          onChange={setSelectedPOItems}
        />

        <CreateVendorModal
          open={vendorOpenForm}
          onClose={() => setVendorOpenForm(false)}
          onSave={vendor => {
            setVendors(prev => [...prev, vendor])
            setSelectedVendorIds(prev => [...prev, vendor.id])
          }}
        />
      </div>
    </div>
  )
}