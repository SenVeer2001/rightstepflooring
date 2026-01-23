import { useState } from "react"
import { ArrowLeft, Send, Trash2, Plus, Paperclip, Layers, SignatureIcon, Zap } from "lucide-react"
import { useNavigate } from "react-router-dom"


interface InvoiceSignature {
  name: string
  date: string
  image?: string
}

interface InvoiceItem {
  id: string
  name: string
  image?:string
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
  {
    id: "5",
    name: "Vinyl Plank Flooring",
    image: "https://images.pexels.com/photos/5997967/pexels-photo-5997967.jpeg",
    description: "Waterproof vinyl plank flooring suitable for kitchens, bathrooms, and basements.",
    quantity: 300.0,
    price: 3.6,
    cost: 2.2,
    amount: 1080.0,
    taxable: true,
    color: "#A8A8A8",
  },
  {
    id: "6",
    name: "Floor Underlayment Padding",
    image: "https://images.pexels.com/photos/8092382/pexels-photo-8092382.jpeg",
    description: "High-density underlayment padding to reduce noise and improve floor longevity.",
    quantity: 6.0,
    price: 95.0,
    cost: 58.0,
    amount: 570.0,
    taxable: false,
    color: "#2E2E2E",
  },
  {
    id: "7",
    name: "Tile Grouting & Finishing",
    image: "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg",
    description: "Precision grouting and finishing service to enhance durability and appearance.",
    quantity: 320.0,
    price: 1.4,
    cost: 0.75,
    amount: 448.0,
    taxable: false,
    color: "#6F6F6F",
  },
  {
    id: "8",
    name: "Floor Material Delivery",
    image: "https://images.pexels.com/photos/6169056/pexels-photo-6169056.jpeg",
    description: "Transportation and delivery of flooring materials to the job site per truckload.",
    quantity: 1.0,
    price: 180.0,
    cost: 165.0,
    amount: 180.0,
    taxable: false,
  },
]
,
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
  
  // Editable fields
  const [discount, setDiscount] = useState(0)
  const [taxRate, setTaxRate] = useState(0)
  const [laborCost, setLaborCost] = useState(0)
  const [tip, setTip] = useState(0)
  const [notes, setNotes] = useState(mockInvoice.notes)

  const handleDeleteItem = (itemId: string) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== itemId))
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
    <div className="min-h-screen ">
      {/* HEADER */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className=" px-4 py-4 flex items-center justify-between">
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
            
            <button className="p-2 hover:bg-gray-100 rounded-lg border font-semibold flex gap-2 items-center  transition">
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

      <div className=" px-4 py-8 space-y-6">
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
              <p className="text-xs text-gray-500 uppercase font-semibold">
                Invoice ID
              </p>
              <p className="text-lg font-bold text-gray-900">{mockInvoice.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">
                Invoice Name
              </p>
              <p className="text-sm text-gray-900">{mockInvoice.invoiceName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">
                Invoice Date
              </p>
              <p className="text-sm text-gray-900">{mockInvoice.invoiceDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">
                Sent
              </p>
              <p
                className={`text-sm font-semibold ${
                  mockInvoice.sent === "No"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {mockInvoice.sent}
              </p>
            </div>
          </div>
        </div>

        {/* ITEMS TABLE */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
        <div className="flex justify-between">

                  <h2 className="text-lg font-bold flex gap-2 text-gray-900">Items<Layers className="text-primary"/></h2>
            <button
            onClick={() => console.log("Add item")}
            className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-primary text-gray-200 rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            <Plus size={16} />
            Add Item
          </button>

        </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    Item
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">
                    Cost
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">
                    Taxable
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">
                    Color
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoiceItems.map(item => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4 max-w-[250px]">
                      <div className="flex gap-3">
                        <img src={item?.image} alt="" height={10} width={70} className="max-h-13 w-15 rounded-md" />
                       <div>
                         <p className="font-semibold text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 text-wrap">
                          {item.description}
                        </p>
                       </div>
                      </div>
                    </td>
                    <td className="text-center px-4 py-4">
                      {item.quantity}
                    </td>
                    <td className="text-center px-4 py-4">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="text-center px-4 py-4">
                      ${item.cost.toFixed(2)}
                    </td>
                    <td className="text-center px-4 py-4 font-semibold">
                      ${item.amount.toFixed(2)}
                    </td>
                    <td className="text-center px-4 py-4">
                      {item.taxable ? "Yes" : "No"}
                    </td>
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
                        <p className="text-xs text-gray-600 font-semibold uppercase">
                          Type
                        </p>
                        <p className="font-bold text-md">{payment.type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-semibold uppercase">
                          Amount
                        </p>
                        <p className="font-bold text-lg">
                          ${payment.amount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-semibold uppercase">
                          Date
                        </p>
                        <p className="font-semibold">{payment.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-semibold uppercase">
                          Status
                        </p>
                        <p className="font-semibold text-green-600">
                          {payment.status}
                        </p>
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
              </div>    ``
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
                <button className="px-4 py-2  text-gray-900 rounded-lg font-semibold hover:bg-opacity-90 transition">
                  <SignatureIcon className="text-primary"/> Sign
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - 1/3 WIDTH - SUMMARY BOX */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border p-6 space-y-4 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900">Summary</h3>

              {/* Item Cost */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Item cost</span>
                <input
                  type="number"
                  value={itemCost.toFixed(2)}
                  readOnly
                  className="max-w-[120px] border border-gray-400 rounded-md px-2 py-1 text-sm bg-gray-100 text-right"
                />
              </div>

              {/* Discount */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Discount</span>
                <input
                  type="number"
                  value={discount.toFixed(2)}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="max-w-[120px] border border-gray-400 rounded-md px-2 py-1 text-sm text-right"
                />
              </div>

              {/* Taxable */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Taxable</span>
                <input
                  type="number"
                  value={taxableAmount.toFixed(2)}
                  readOnly
                  className="max-w-[120px] border border-gray-400 rounded-md px-2 py-1 text-sm bg-gray-100 text-right"
                />
              </div>

              {/* Tax Rate */}
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

              {/* Tax */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Tax</span>
                <input
                  type="number"
                  value={tax.toFixed(2)}
                  readOnly
                  className="max-w-[120px] border border-gray-400 rounded-md px-2 py-1 text-sm bg-gray-100 text-right"
                />
              </div>

              {/* Labor Cost */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Labor cost</span>
                <input
                  type="number"
                  value={laborCost.toFixed(2)}
                  onChange={(e) => setLaborCost(Number(e.target.value))}
                  className="max-w-[120px] border border-gray-400 rounded-md px-2 py-1 text-sm text-right"
                />
              </div>

              {/* Tip */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Tip</span>
                <input
                  type="number"
                  value={tip.toFixed(2)}
                  onChange={(e) => setTip(Number(e.target.value))}
                  className="max-w-[120px] border border-gray-400 rounded-md px-2 py-1 text-sm text-right"
                />
              </div>

              {/* Divider */}
              <div className="border-t pt-4" />

              {/* Subtotal */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-semibold">Subtotal</span>
                <input
                  type="number"
                  value={subtotal.toFixed(2)}
                  readOnly
                  className="max-w-[120px] border border-gray-400 rounded-md px-2 py-1 text-sm bg-gray-100 font-semibold text-right"
                />
              </div>

              {/* Total */}
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
    </div>
  )
}
