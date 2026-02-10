import { Plus, Edit, Trash2, Layers, Clock, TrendingUp } from "lucide-react"
import { useState } from "react"
import { PurchaseOrderFormModal } from "./clientPages/PurchaseOrderFormModal"
import { PurchaseOrderChoiceModal } from "./clientPages/PurchaseOrderChoiceModal"
import type { PurchaseOrder } from "../../types/vendor"




interface Item {
  id: number
  name: string
  description: string
  image?: string
  quantity: number
  price: number
  cost: number
  amount: number
  taxable: boolean
  color?: string
}

interface ItemsTabProps {
  items?: Item[]
  onAddItem?: () => void
  onEditItem?: (id: number) => void
  onDeleteItem?: (id: number) => void
}

export function ItemsTab({ items = [], onDeleteItem }: ItemsTabProps) {
  const [discount, setDiscount] = useState(0)
  const [taxRate, setTaxRate] = useState(0)
  const [laborCost, setLaborCost] = useState(0)
  const [techHours, setTechHours] = useState(0)
  const [techRate, setTechRate] = useState(0)
  const [tip, setTip] = useState(0)
  // const [timeTracking, setTimeTracking] = useState(0)
  const [commissionRate, setCommissionRate] = useState(0)
  const [customTechRateEnabled, setCustomTechRateEnabled] = useState(false)




// Purchase Order flow
const [choiceOpen, setChoiceOpen] = useState(false)
const [poFormOpen, setPoFormOpen] = useState(false)
const [poMode, setPoMode] = useState<"create" | "edit">("create")
const [editingPO, setEditingPO] = useState<PurchaseOrder | undefined>()



  const defaultItems: Item[] = [
    {
      id: 1,
      name: "Tile Installation",
      description: "Professional tile installation including alignment and finishing",
      image: "https://images.pexels.com/photos/16501255/pexels-photo-16501255.jpeg",
      quantity: 320,
      price: 3.25,
      cost: 1.85,
      amount: 1040,
      taxable: true,
      color: "#DADADA",
    },
    {
      id: 2,
      name: "Labor",
      description: "General labor hours for flooring work",
      image: "https://images.pexels.com/photos/16501255/pexels-photo-16501255.jpeg",
      quantity: 8,
      price: 100,
      cost: 60,
      amount: 800,
      taxable: false,
    },
  ]

  const displayItems = items.length > 0 ? items : defaultItems

  const purchaseOrders: PurchaseOrder[] = [
  {
    id: "101",
    vendorId: "v1",
    orderDate: "2024-02-10",
    items: displayItems.map(i => ({
      id: i.id,
      name: i.name,
      quantity: i.quantity,
      cost: i.cost,
    })),
  },
]


  // Calculations
  const itemCost = displayItems.reduce((sum, item) => sum + item.amount, 0)
  const subtotal = itemCost - discount
  const taxableAmount = subtotal
  const tax = (taxableAmount * taxRate) / 100
  const techCost = techHours * techRate
  const total = subtotal + tax + laborCost + techCost + tip

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold flex gap-2 text-gray-900">
          Job Items
          <Layers className="text-primary" />
        </h2>
      <button
  onClick={() => setChoiceOpen(true)}
  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold text-sm"
>
  <Plus size={18} />
  Purchase Order
</button>


      </div>

     
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Item</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Quantity</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Price</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Cost</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Amount</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Taxable</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Color</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayItems.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
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
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500 text-wrap">{item.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">{item.quantity}</td>
                  <td className="px-4 py-4 text-center">${item.price.toFixed(2)}</td>
                  <td className="px-4 py-4 text-center">${item.cost.toFixed(2)}</td>
                  <td className="px-4 py-4 text-center font-semibold">${item.amount.toFixed(2)}</td>
                  <td className="px-4 py-4 text-center">{item.taxable ? "Yes" : "No"}</td>
                  <td className="px-4 py-4 text-center">
                    {item.color && (
                      <div
                        className="w-6 h-6 rounded border border-gray-300 mx-auto"
                        style={{ backgroundColor: item.color }}
                        title={item.color}
                      />
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      {/* <button
                        onClick={() => onEditItem?.(item.id)}
                        className="p-1.5 text-primary hover:bg-blue-50 rounded"
                      >
                        <Edit size={16} />
                      </button> */}
                      <button
                        onClick={() => onDeleteItem?.(item.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE - Summary */}
        <div className="lg:col-span-2 bg-white border border-gray-300 rounded-lg p-6">
          <div className="space-y-4">
            {/* Row 1 */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 font-semibold">Total</span>
              <input
                type="number"
                value={itemCost.toFixed(2)}
                 min={0}
                readOnly
                className="max-w-[150px] border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-right font-semibold"
              />
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Subtotal</label>
                <input
                  type="number"
                  value={subtotal.toFixed(2)}
                   min={0}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-right"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Discount</label>
                <input
                  type="number"
                  value={discount.toFixed(2)}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                   min={0}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-right"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Due</label>
                <input
                  type="number"
                  value={subtotal.toFixed(2)}
                   min={0}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-right"
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Date</label>
                <input type="date" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Tax Rate</label>
                <select
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value={0}>0%</option>
                  <option value={5}>5%</option>
                  <option value={10}>10%</option>
                  <option value={18}>18%</option>
                  <option value={20}>20%</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Tax</label>
                <input
                  type="number"
                  value={tax.toFixed(2)}
                   min={0}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-right"
                />
              </div>
            </div>

            {/* Row 4 - Tech Hours */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Tech Hours</label>
                <input
                  type="number"
                  value={techHours}
                   min={0}
                  onChange={(e) => setTechHours(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Tech Rate</label>
                <input
                  type="number"
                  value={techRate}
                   min={0}
                  onChange={(e) => setTechRate(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Tech Cost</label>
                <input
                  type="number"
                  value={techCost.toFixed(2)}
                   min={0}
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-right"
                />
              </div>
            </div>

            {/* Row 5 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Labor Cost</label>
                <input
                  type="number"
                  value={laborCost}
                  onChange={(e) => setLaborCost(Number(e.target.value))}
                   min={0}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Tip</label>
                <input
                  type="number"
                  value={tip}
                  onChange={(e) => setTip(Number(e.target.value))}
                   min={0}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Add Payment Schedule */}
            <button className="text-primary font-semibold text-sm hover:underline">
              + Add payment schedule
            </button>
          </div>
        </div>

        {/* RIGHT SIDE - Total Summary Box */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 sticky top-24 h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Summary</h3>

          <div className="space-y-3">
            {/* Subtotal */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>

            {/* Discount */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Discount:</span>
              <span className="font-semibold">${discount.toFixed(2)}</span>
            </div>

            {/* Tax */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Tax:</span>
              <span className="font-semibold">${tax.toFixed(2)}</span>
            </div>

            {/* Tech Cost */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Tech cost:</span>
              <span className="font-semibold">${techCost.toFixed(2)}</span>
            </div>

            {/* Labor Cost */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Labor cost:</span>
              <span className="font-semibold">${laborCost.toFixed(2)}</span>
            </div>

            {/* Tip */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Tip:</span>
              <span className="font-semibold">${tip.toFixed(2)}</span>
            </div>

            {/* Divider */}
            <div className="border-t pt-3 my-2" />

            {/* Total */}
            <div className="flex justify-between items-center text-lg">
              <span className="font-bold">Total:</span>
              <span className="font-bold text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

    
      <div className="bg-white border border-gray-300 rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 flex gap-2 items-center">
            <Clock size={20} className="text-primary" />
            Time Tracking (00:00)
          </h3>
          <button className="px-4 py-2 bg-primary text-white rounded-full font-semibold text-sm hover:bg-yellow-500 transition">
            Add time
          </button>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock size={40} className="text-gray-400" />
            </div>
            <p className="text-gray-600 font-semibold">Add Time Tracking</p>
            <p className="text-sm text-gray-500">Track time spent on this job</p>
          </div>
        </div>
      </div>

     
      <div className="bg-white border border-gray-300 rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 flex gap-2 items-center">
            <TrendingUp size={20} className="text-primary" />
            Performance pay ($0)
          </h3>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={40} className="text-gray-400" />
            </div>
            <p className="text-gray-600 font-semibold">No commissions created for this job</p>
            <p className="text-sm text-gray-500">Automate your commissions</p>
          </div>
        </div>
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Commission Rate */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Commission rate</h3>
            <button className="px-3 py-1 bg-primary text-white rounded-full font-semibold text-xs  transition">
              Update
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-2">Commission Rate (%)</label>
              <input
                type="number"
                value={commissionRate}
                min={0}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="Enter commission rate"
              />
            </div>
          </div>
        </div>

        {/* Custom Tech Rate */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Custom Tech Rate:</h3>
            <button
              onClick={() => setCustomTechRateEnabled(!customTechRateEnabled)}
              className={`px-3 py-1 rounded-full font-semibold text-xs transition ${
                customTechRateEnabled
                  ? "bg-green-400 text-white hover:bg-green-500"
                  : "bg-gray-400 text-white hover:bg-gray-500"
              }`}
            >
              {customTechRateEnabled ? "ON" : "OFF"}
            </button>
          </div>
          {customTechRateEnabled && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">Tech Rate ($/hour)</label>
                <input
                  type="number"
                  value={techRate}
                  onChange={(e) => setTechRate(Number(e.target.value))}
                   min={0}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Enter tech rate"
                />
              </div>
            </div>
          )}
        </div>
      </div>


      <PurchaseOrderChoiceModal
  isOpen={choiceOpen}
  existingPOs={purchaseOrders.map(po => ({
    id: po.id,
    name: `PO #${po.id}`,
  }))}
  onClose={() => setChoiceOpen(false)}
  onContinue={({ mode, poId }) => {
    setPoMode(mode)
    setEditingPO(
      mode === "edit"
        ? purchaseOrders.find(po => po.id === poId)
        : undefined
    )
    setChoiceOpen(false)
    setPoFormOpen(true)
  }}
/>



<PurchaseOrderFormModal
  isOpen={poFormOpen}
  mode={poMode}
  initialPO={editingPO}
  jobItems={displayItems.map(i => ({
    id: i.id,
    name: i.name,
    quantity: i.quantity,
    cost: i.cost,
  }))}
  onClose={() => setPoFormOpen(false)}
/>


    </div>
  )
}
