import { X } from "lucide-react"

/* ================= TYPES ================= */

interface ShoppingListItem {
  id: string
  name: string
  price: number
  quantity: number
  total: number
  image?: string
}

interface ClientData {
  name: string
  email: string
  phone: string
  company?: string
  address?: string
}

interface ShoppingListModalProps {
  isOpen: boolean
  onClose: () => void
  client: ClientData | null
  items: ShoppingListItem[]
}

/* ================= STATIC SAMPLE DATA ================= */

const staticSampleItems: ShoppingListItem[] = [
  {
    id: "s1",
    name: "LVP Flooring - Oak Texture",
    price: 3.5,
    quantity: 100,
    total: 350,
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=150&h=150&fit=crop",
  },
  {
    id: "s2",
    name: "Carpet Padding 8lb",
    price: 1.2,
    quantity: 50,
    total: 60,
    image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=150&h=150&fit=crop",
  },
  {
    id: "s3",
    name: "Baseboard Trim - White",
    price: 0.85,
    quantity: 40,
    total: 34,
    image: "https://images.unsplash.com/photo-1504198458649-3128b932f49e?w=150&h=150&fit=crop",
  },
]

/* ================= COMPONENT ================= */

export function ShoppingListModal({
  isOpen,
  onClose,
  client,
  items,
}: ShoppingListModalProps) {
  if (!isOpen) return null

  const displayItems = items.length > 0 ? items : staticSampleItems
  const grandTotal = displayItems.reduce((sum, item) => sum + item.total, 0)

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
        >
          <X size={20} className="text-gray-600" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          
          {/* ===== HEADER SECTION WITH ABSOLUTE BG ===== */}
          <div className="relative">
            
            {/* Green Background - ABSOLUTE, starts from logo's middle */}
            <div 
              className="absolute left-0 right-0 bg-[#e2eccd]"
              style={{
                top: '70px',      // Half of logo height (144px / 2)
                height: '200px',  // Covers logo bottom half + title
              }}
            />
            
            {/* Logo - Centered, on top of everything */}
            <div className="relative z-10 flex justify-center pt-6 ">
              <div className="w-32 h-32 rounded-full  overflow-hidden flex items-center justify-center">
                <img 
                  src="/images/logo.jpeg" 
                  alt="Company Logo"
                  className="w-full h-full object-contain "
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                    const parent = (e.target as HTMLImageElement).parentElement
                    if (parent) {
                      parent.innerHTML = `<span class="text-[#3d8c40] font-bold text-sm text-center leading-tight px-2">YOUR<br/>LOGO</span>`
                    }
                  }}
                />
              </div>
            </div>
            
            {/* Title - On top of green background */}
            <div className="relative z-10 text-center pt-4 pb-10">
              <h1 className="text-2xl md:text-3xl font-sans tracking-[12px] text-[#2d3a1a] font-light">
                Client <br /><span className="font-extralight font-serif  ">Shopping List</span>
              </h1>
            </div>
          </div>

          {/* --- CONTENT SECTION --- */}
          <div className="p-8 md:p-10 space-y-8">
            
            {/* Contact Information */}
            <div className="space-y-3 max-w-xl mx-auto text-sm">
              {[
                { label: "Project/Client", value: client?.name },
                { label: "Company", value: client?.company },
                { label: "E-Mail", value: client?.email },
                { label: "Phone", value: client?.phone },
                { label: "Address", value: client?.address },
                { label: "Date", value: currentDate },
              ].map((field, idx) => (
                field.value && (
                  <div key={idx} className="flex items-center gap-4">
                    <label className="text-gray-600 font-medium min-w-[140px] text-xs uppercase tracking-wide">
                      {field.label}:
                    </label>
                    <div className="flex-1 border-b border-gray-300 pb-1 text-gray-800 font-medium">
                      {field.value}
                    </div>
                  </div>
                )
              ))}
            </div>

            {/* Description Text */}
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-gray-500 italic leading-relaxed text-sm">
                Choosing your selections can be stressful and time consuming, so we've 
                created this shopping list to make it easier. It's designed to guide you 
                through the shopping process for your new flooring, room by room.
              </p>
            </div>

            {/* --- PRODUCT TABLE --- */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-gray-700 uppercase tracking-wider border-b-2 border-[#e2eccd] pb-2 inline-block">
                Flooring Selections
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-[#f1f6e8] border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Stack Photo</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Item Name</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">Last Price</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">Qty</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayItems.map((item) => (
                      <tr 
                        key={item.id} 
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        {/* Photo */}
                        <td className="px-4 py-3">
                          <img 
                            src={item.image || "/images/placeholder.png"} 
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200 bg-gray-100"
                          />
                        </td>
                        
                        {/* Name */}
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {item.name}
                        </td>
                        
                        {/* Last Price */}
                        <td className="px-4 py-3 text-right text-gray-700">
                          ${item.price.toFixed(2)}
                        </td>
                        
                        {/* Quantity */}
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#e2eccd] text-[#2d3a1a] font-semibold text-xs">
                            {item.quantity}
                          </span>
                        </td>
                        
                        {/* Total */}
                        <td className="px-4 py-3 text-right font-bold text-primary">
                          ${item.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Grand Total */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t-2 border-[#e2eccd] mt-4">
                <span className="text-md font-bold text-gray-800">Grand Total:</span>
                <div className="w-30 h-10 bg-[#3d8c7a] rounded-lg px-4 flex items-center justify-center">
                  <span className="text-white font-bold text-md">
                    ${grandTotal.toFixed(2)} 
                  </span>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg overflow-hidden border-2 border-white">
                  <img 
                    src="/images/logo.jpeg" 
                    alt="Company Logo"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <span className="text-sm text-gray-500 lowercase font-medium">
                  rightstepflooringnc.com
                </span>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-gray-600 font-medium text-sm uppercase tracking-wide whitespace-nowrap">
                  Team Member:
                </label>
                <div className="border-b border-gray-300 pb-1 min-w-[160px] text-gray-700 font-medium">
                  Sales Representative
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <span>Print / Download</span>
          </button>
        </div>
      </div>
    </div>
  )
}