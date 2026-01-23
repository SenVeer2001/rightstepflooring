import { useState } from 'react'
import { ArrowLeft, Upload, Plus, Trash2, ChevronDown, MoreVertical, Info, RefreshCw, Send, File, FileSymlinkIcon, Layers2, Save, Edit2, X, SignatureIcon, Paperclip } from 'lucide-react'
import { PriceBookModal } from '../../components/PriceBookModal'
import { useNavigate, useLocation } from "react-router-dom"
import { AddItemSearchModal } from '../../components/estimatesModel/AddItemSearchModal'
import { CreateItemModal } from '../../components/estimatesModel/CreateItemModal'
import { ItemDetailsModal } from '../../components/estimatesModel/ItemDetailsModal'
import { DepositModal } from '../../components/estimatesModel/DepositModal'


interface LineItem {
  id: string
  description: string
  image?:string
  quantity: number
  price: number
  cost: number
  amount: number
  taxable: boolean
  color?: string
}


interface Estimate {
  id: string
  leadId: string
  leadName: string
  title: string
  description: string
  clientEmail: string
  clientPhone: string
  serviceAddress: string
  status: 'pending' | 'approved' | 'rejected'
  estimateNumber: string
  imageUrl?: string   // 👈 ADD THIS
  items: LineItem[]
}




interface PriceBookItem {
  id: string
  name: string
  price: number
  image?: string
}

interface PriceBookCategory {
  id: string
  name: string
  image?: string
  items: PriceBookItem[]
}



const priceBookItems: PriceBookItem[] = [
  // @ts-ignore
  { id: "1", name: "Base residential rekey", price: 150, cost: 60 },
  // @ts-ignore
  { id: "2", name: "Smart lock installation (Gold)", price: 300, cost: 120 },
  // @ts-ignore
  { id: "3", name: "Service fee", price: 100, cost: 30 },
]

const priceBookData: PriceBookCategory[] = [
  /* ================= FLOORING ================= */
  {
    id: "flooring",
    name: "Flooring Install",
    image: "https://images.pexels.com/photos/48889/cleaning-washing-cleanup-the-ilo-48889.jpeg",
    items: [
      {
        id: "lvp",
        name: "LVP Installation",
        price: 2.5,
        image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
      },
      {
        id: "hardwood",
        name: "Hardwood Installation",
        price: 4.25,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      },
      {
        id: "tile-floor",
        name: "Tile Flooring",
        price: 5.75,
        image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
      },
    ],
  },

  /* ================= CARPET ================= */
  {
    id: "carpet",
    name: "Carpet Services",
    image: "https://images.unsplash.com/photo-1586105251261-72a756497a11",
    items: [
      {
        id: "carpet-install",
        name: "Carpet Installation",
        price: 1.67,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      },
      {
        id: "carpet-removal",
        name: "Carpet Removal",
        price: 0.85,
        image: "https://images.pexels.com/photos/4107284/pexels-photo-4107284.jpeg",
      },
      {
        id: "carpet-clean",
        name: "Carpet Deep Cleaning",
        price: 0.95,
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6",
      },
    ],
  },

  /* ================= PAINTING ================= */
  {
    id: "painting",
    name: "Painting",
    image: "https://images.unsplash.com/photo-1599619351208-3e6c839d6828",
    items: [
      {
        id: "interior-paint",
        name: "Interior Wall Painting",
        price: 1.5,
        image: "https://images.pexels.com/photos/6764289/pexels-photo-6764289.jpeg",
      },
      {
        id: "exterior-paint",
        name: "Exterior Painting",
        price: 2.75,
        image: "https://images.pexels.com/photos/221027/pexels-photo-221027.jpeg",
      },
      {
        id: "ceiling-paint",
        name: "Ceiling Painting",
        price: 1.9,
        image: "https://images.pexels.com/photos/69903/pexels-photo-69903.jpeg",
      },
    ],
  },

  /* ================= PLUMBING ================= */
  {
    id: "plumbing",
    name: "Plumbing",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
    items: [
      {
        id: "faucet-install",
        name: "Faucet Installation",
        price: 120,
        image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea",
      },
      {
        id: "toilet-install",
        name: "Toilet Installation",
        price: 180,
        image: "https://images.pexels.com/photos/10421641/pexels-photo-10421641.jpeg",
      },
      {
        id: "leak-fix",
        name: "Leak Repair",
        price: 95,
        image: "https://images.pexels.com/photos/11658940/pexels-photo-11658940.jpeg",
      },
    ],
  },

  /* ================= ELECTRICAL ================= */
  {
    id: "electrical",
    name: "Electrical",
    image: "https://images.pexels.com/photos/9989522/pexels-photo-9989522.jpeg",
    items: [
      {
        id: "light-install",
        name: "Light Fixture Installation",
        price: 85,
        image: "https://images.unsplash.com/photo-1604014237800-1c9102c219da",
      },
      {
        id: "ceiling-fan",
        name: "Ceiling Fan Installation",
        price: 120,
        image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a",
      },
      {
        id: "switch-repair",
        name: "Switch / Socket Repair",
        price: 65,
        image: "https://images.pexels.com/photos/7596370/pexels-photo-7596370.jpeg",
      },
    ],
  },
]




export function Estimates() {
  const [Tab, setActiveTab] = useState<'view' | 'add'>('view')
  const [isPriceBookOpen, setIsPriceBookOpen] = useState(false)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)

  const [editingItemData, setEditingItemData] = useState<LineItem & { taxPercent?: number } | null>(null)

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0)
  const [taxRate, setTaxRate] = useState(0)
  const [deposit, setDeposit] = useState(0)
  const [laborCost, setLaborCost] = useState(0)
  const [notes, setNotes] = useState("")

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const [selectedItem, setSelectedItem] = useState<PriceBookItem | null>(null)
  const [newItemName, setNewItemName] = useState("")

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [depositConfig, setDepositConfig] = useState<{
    depositType: "amount" | "percentage"
    depositValue: number
  }>({
    depositType: "amount",
    depositValue: 0,
  })








  const navigate = useNavigate()
  const location = useLocation()

  const activeTab: "view" | "add" =
    location.pathname.endsWith("/add") ? "add" : "view"

  const [estimates, setEstimates] = useState<Estimate[]>([
    {
      id: "1",
      leadId: "1134",
      leadName: "Trang Leminh",
      title: "Paint Estimate",

      // ✅ CLEAN DESCRIPTION (USER EDITABLE)
      description:
        "Interior wall painting including preparation, priming, and two coats of paint.",

      clientEmail: "tthanhieminh@gmail.com",
      clientPhone: "(561) 715-9420",
      serviceAddress: "5534 Jessip St, Morrisville, North Carolina 27560",
      status: "pending",
      estimateNumber: "1134-1",
      imageUrl: "/images/logo.jpeg",

      items: [
        {
          id: "1",
          description:
            "Paint - Labor\nPatching small holes\nPrep walls / sanding\nPrime all walls\nPaint walls (2 coats)\nPaint baseboard trim",
          quantity: 2000,
          price: 2.5,
          cost: 1.15,
          amount: 5000,
          taxable: false,
          color: "Purple",
          image:"https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg"
        },
      ],
    },
  ])


  const [selectedEstimate, setSelectedEstimate] = useState<Estimate | null>(estimates[0])
  const [newEstimate, setNewEstimate] = useState<Partial<Estimate>>({
    leadId: '',
    leadName: '',
    title: '',
    description: '',
    clientEmail: '',
    clientPhone: '',
    serviceAddress: '',
    status: 'pending',
    items: [],
  })


  const handleSelectExistingItem = (item: PriceBookItem) => {
    setSelectedItem(item)
    setIsSearchModalOpen(false)
    setIsDetailsModalOpen(true)
  }

  const handleCreateNewItem = (name: string) => {
    setNewItemName(name)
    setIsSearchModalOpen(false)
    setIsCreateModalOpen(true)
  }

  const handleSaveCreatedItem = (item: PriceBookItem) => {
    setSelectedItem(item)
    setIsCreateModalOpen(false)
    setIsDetailsModalOpen(true)
  }

  const handleSaveItemToEstimate = (item: any) => {
    //@ts-ignore
    setCurrentData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: Date.now().toString(),
          description: item.name,
          quantity: item.quantity,
          price: item.price,
          cost: item.cost,
          amount: item.quantity * item.price,
          taxable: false,
          color: "",
        },
      ],
    }))

    setIsDetailsModalOpen(false)
    setSelectedItem(null)
  }


  const [newItem, setNewItem] = useState<Partial<LineItem> & { taxPercent?: number }>({
    description: "",
    quantity: 0,
    price: 0,
    cost: 0,
    taxable: false,
    taxPercent: 0,
    color: "",
  })


  const handleAddFromPriceBook = (
    item: PriceBookItem,
    quantity: number
  ) => {
    const newLineItem: LineItem = {
      id: Date.now().toString(),
      description: item.name,
      quantity: quantity,
      price: item.price,
      cost: 0,
      amount: quantity * item.price,
      taxable: false,
    }

    if (activeTab === "view" && selectedEstimate) {
      setSelectedEstimate({
        ...selectedEstimate,
        items: [...selectedEstimate.items, newLineItem],
      })
    } else {
      setNewEstimate({
        ...newEstimate,
        items: [...(newEstimate.items || []), newLineItem],
      })
    }
  }


  const handleRemoveItem = (itemId: string) => {
    if (activeTab === 'view' && selectedEstimate) {
      setSelectedEstimate({
        ...selectedEstimate,
        items: selectedEstimate.items.filter(item => item.id !== itemId),
      })
    } else {
      setNewEstimate({
        ...newEstimate,
        items: (newEstimate.items || []).filter(item => item.id !== itemId),
      })
    }
  }

  const handleSaveNewEstimate = () => {
    if (newEstimate.leadId && newEstimate.title && newEstimate.items && newEstimate.items.length > 0) {
      const estimate: Estimate = {
        id: Date.now().toString(),
        leadId: newEstimate.leadId || '',
        leadName: newEstimate.leadName || '',
        title: newEstimate.title || '',
        description: newEstimate.description || '',
        clientEmail: newEstimate.clientEmail || '',
        clientPhone: newEstimate.clientPhone || '',
        serviceAddress: newEstimate.serviceAddress || '',
        status: newEstimate.status || 'pending',
        estimateNumber: `${newEstimate.leadId}-${estimates.length + 1}`,
        items: newEstimate.items,
      }

      setEstimates([...estimates, estimate])
      setActiveTab('view')
      setSelectedEstimate(estimate)
      setNewEstimate({
        leadId: '',
        leadName: '',
        title: '',
        description: '',
        clientEmail: '',
        clientPhone: '',
        serviceAddress: '',
        status: 'pending',
        items: [],
      })
    }
  }

  const estimateImageUrl = selectedEstimate?.imageUrl || "/images/logo.jpeg"

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    setUploadedImage(previewUrl)

    // OPTIONAL: later save file to backend here
  }
  const handleRemoveImage = () => {
    setUploadedImage(null)

  }
  const handleAddItem = () => {
    if (!newItem.description || !newItem.quantity || !newItem.price) return

    const baseAmount = newItem.quantity * newItem.price
    const taxAmount =
      newItem.taxable && newItem.taxPercent
        ? (baseAmount * newItem.taxPercent) / 100
        : 0

    const createdLineItem: LineItem = {
      id: Date.now().toString(),
      description: newItem.description,
      quantity: newItem.quantity,
      price: newItem.price,
      cost: newItem.cost || 0,
      amount: baseAmount + taxAmount,
      taxable: newItem.taxable || false,
      color: newItem.color,
    }

    // existing logic...
  }

  const handleEditItem = (item: LineItem) => {
    setEditingItemId(item.id)
    setEditingItemData({ ...item, taxPercent: 0 })
  }

  const handleSaveItem = () => {
    if (!editingItemData) return
    //@ts-ignore
    const updatedItems = currentData.items.map(item =>
      item.id === editingItemData.id
        ? {
          ...editingItemData,
          amount:
            editingItemData.quantity * editingItemData.price +
            (editingItemData.taxable && editingItemData.taxPercent
              ? (editingItemData.quantity *
                editingItemData.price *
                editingItemData.taxPercent) /
              100
              : 0),
        }
        : item
    )

    if (activeTab === "view" && selectedEstimate) {
      setSelectedEstimate({ ...selectedEstimate, items: updatedItems })
    } else {
      setNewEstimate({ ...newEstimate, items: updatedItems })
    }

    setEditingItemId(null)
    setEditingItemData(null)
  }



  const updateItemField = (
    itemId: string,
    fieldName: keyof LineItem,
    fieldValue: any
  ) => {
    const updateItems = (items: LineItem[]) =>
      items.map(item =>
        item.id === itemId
          ? {
            ...item,
            [fieldName]: fieldValue,
            amount:
              fieldName === "quantity" || fieldName === "price"
                ? (fieldName === "quantity" ? fieldValue : item.quantity) *
                (fieldName === "price" ? fieldValue : item.price)
                : item.amount,
          }
          : item
      )

    if (activeTab === "view" && selectedEstimate) {
      setSelectedEstimate({
        ...selectedEstimate,
        items: updateItems(selectedEstimate.items),
      })
    } else {
      setNewEstimate({
        ...newEstimate,
        items: updateItems(newEstimate.items || []),
      })
    }
  }





  const currentData = activeTab === 'view' && selectedEstimate ? selectedEstimate : newEstimate


  //@ts-ignore
  const itemCost = currentData.items.reduce(
    (sum, item) => sum + item.amount,
    0
  )

  const taxableAmount = itemCost - discount
  const tax = (taxableAmount * taxRate) / 100
  const subtotal = taxableAmount + tax
  const total = subtotal + laborCost




  return (
    <div className="flex flex-col h-screen ">
      {/* Breadcrumb */}
      <div className="px-6 pt-2 pb-2 text-xs text-gray-500 uppercase tracking-wider ">
        CALLS # TEXT MESSAGES # LEAD (1182) # LEADS # LEAD ({selectedEstimate?.leadId || '1134'}) # ESTIMATE ({activeTab === 'view' ? selectedEstimate?.id : 'NEW'})
      </div>

      {/* Header with Back and Tabs */}
      <div className="px-6 py-4  ">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            {activeTab === 'view' && selectedEstimate && (
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <ArrowLeft size={20} className="text-gray-700" />
              </button>
            )}
            <h2 className="text-xl font-semibold text-gray-900">
              {activeTab === 'view' && selectedEstimate ? `Lead ID: ${selectedEstimate.leadId}` : 'Create New Estimate'}
            </h2>
          </div>
          <div className="flex gap-5">
            <button className="px-4 py-2 border  text-gray-700 hover:bg-gray-100 border-gray-400 font-semibold rounded-lg transition">
              ⚡ Actions
            </button>
            <button className="px-6 py-2 flex gap-1 bg-primary hover:bg-[#2c621b] text-white  font-semibold rounded-lg transition">
              <Send width={10} height={10} className='h-4 w-4 mt-1' />Send
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4">
          {/* VIEW TAB */}
          <button
            onClick={() => navigate("/estimates/view")}
            className={`px-4 py-2 font-semibold border-b-2 transition
      ${activeTab === "view"
                ? "text-primary border-primary"
                : "text-gray-600 border-transparent hover:text-gray-900"
              }
    `}
          >
            {selectedEstimate?.title || "Estimate"}
          </button>


          <button
            onClick={() => navigate("/estimates/add")}
            className={`px-4 py-2 font-semibold border-b-2 transition
      ${activeTab === "add"
                ? "text-primary border-primary"
                : "text-gray-600 border-transparent hover:text-gray-900"
              }
    `}
          >
            Add estimate
          </button>
        </div>

      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="">

          <div className="bg-white rounded-xl border shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

              {/* Upload Image */}
              <div className="lg:col-span-2 flex justify-center lg:justify-start">
                <div className="flex flex-col items-center gap-2">

                  {/* IMAGE BOX */}
                  <div
                    className="relative h-32 w-32 rounded-md border-2 border-dashed border-primary
                 bg-primary/5 flex items-center justify-center
                 hover:bg-primary/10 transition overflow-hidden"
                  >
                    {/* IMAGE */}
                    {(uploadedImage || estimateImageUrl) ? (
                      <>
                        <img
                          src={uploadedImage || estimateImageUrl}
                          alt="Estimate image"
                          className="h-full w-full object-cover rounded-md"
                        />

                        {/* REMOVE */}
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-1 right-1 bg-white rounded-full p-1
                       shadow hover:bg-red-100 transition"
                        >
                          <X size={14} className="text-red-600 font-semibold" />
                        </button>
                      </>
                    ) : (
                      <>
                        {/* UPLOAD ICON */}
                        <Upload size={28} className="text-primary" />

                        {/* FILE INPUT */}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </>
                    )}
                  </div>

                  {/* LABEL */}
                  <p className="text-xs text-gray-600 font-medium">
                    Upload image
                  </p>
                </div>
              </div>

              <div className="lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>

                <select
                  value={currentData.status}
                  onChange={(e) =>
                    activeTab === "view" && selectedEstimate
                      ? setSelectedEstimate({
                        ...selectedEstimate,
                        status: e.target.value as any,
                      })
                      : setNewEstimate({
                        ...newEstimate,
                        status: e.target.value as any,
                      })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg
                     text-sm bg-white
                     focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                <p className="text-md text-gray-600 mt-3 ml-1">
                  Estimate #{currentData.estimateNumber || "XXXX-X"}
                </p>
              </div>

              {/* Client Details */}
              <div className="lg:col-span-3">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Client details
                </p>

                <div className="flex items-start gap-3">
                  <div
                    className="h-12 w-12 rounded-full bg-primary/15
                     flex items-center justify-center
                     text-primary font-bold text-lg"
                  >
                    {currentData.leadName?.charAt(0) || "C"}
                  </div>

                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">
                      {currentData.leadName || "Client Name"}
                    </p>
                    <p className="text-gray-600">
                      {currentData.clientEmail || "email@example.com"}
                    </p>
                    <p className="text-gray-600">
                      {currentData.clientPhone || "(XXX) XXX-XXXX"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address + Status */}
              <div className="lg:col-span-3 space-y-4">

                {/* Service Address */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Service address
                  </p>
                  <textarea
                    rows={4}
                    value={currentData.serviceAddress || ""}
                    onChange={(e) =>
                      activeTab === "view" && selectedEstimate
                        ? setSelectedEstimate({
                          ...selectedEstimate,
                          serviceAddress: e.target.value,
                        })
                        : setNewEstimate({
                          ...newEstimate,
                          serviceAddress: e.target.value,
                        })
                    }
                    placeholder="Same as billing address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg
                     text-sm resize-none bg-gray-50
                     focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>



              </div>

            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <button className="px-4 py-2 rounded-full bg-primary text-white font-semibold text-sm"
              onClick={() => setIsSearchModalOpen(true)}
            >
              + Add item
            </button>
            <button
              onClick={() => setIsPriceBookOpen(true)}
              className="px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold hover:bg-primary hover:border-primary hover:text-white"
            >
              Price book
            </button>
            {/* <button className="px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold hover:bg-primary hover:border-primary hover:text-white">
              Load proposal template
            </button> */}

            <button className="px-4 py-2 rounded-full bg-secondary text-black font-semibold text-sm">
              Mark as won
            </button>
          </div>

          {/* Items Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-1">
              <h3 className="text-lg font-semibold text-gray-900">Items</h3>
              <Layers2 className='text-primary h-5' />
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm hidden md:table">

                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Taxable</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Color</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentData.items && currentData.items.length > 0 ? (
                    currentData.items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        {/* DESCRIPTION */}
                        <td className="px-2.5 py-3 min-w-[230px]">
                          <div className='flex items-center gap-2'>
                            <img src={item?.image} alt="" height={20} width={70} className="max-h-15 w-15 rounded-md" />
                            <div className=''>
                              <span className='text-gray-800 font-semibold text-xs'>Paint Estimate</span>
                              {editingItemId === item.id ? (
                                <textarea
                                  value={editingItemData?.description || ""}
                                  onChange={e =>
                                    setEditingItemData({ ...editingItemData!, description: e.target.value })
                                  }
                                  className="w-full h-14 px-3 py-2 border rounded-md text-xs
                   focus:ring-1 focus:ring-primary"
                                />
                              ) : (
                                <p className="text-xs text-gray-700 whitespace-pre-wrap">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* QUANTITY */}
                        <td className="px-6 py-3">
                          {editingItemId === item.id ? (
                            <input
                              type="number"
                              value={editingItemData?.quantity}
                              onChange={e =>
                                setEditingItemData({ ...editingItemData!, quantity: Number(e.target.value) })
                              }
                              className="w-20 px-2 py-1 border rounded-md text-xs focus:ring-1 focus:ring-primary"
                            />
                          ) : (
                            item.quantity.toFixed(2)
                          )}
                        </td>

                        {/* PRICE */}
                        <td className="px-6 py-3">
                          {editingItemId === item.id ? (
                            <input
                              type="number"
                              value={editingItemData?.price}
                              onChange={e =>
                                setEditingItemData({ ...editingItemData!, price: Number(e.target.value) })
                              }
                              className="w-20 px-2 py-1 border rounded-md text-xs focus:ring-1 focus:ring-primary"
                            />
                          ) : (
                            `$${item.price.toFixed(2)}`
                          )}
                        </td>

                        {/* COST */}
                        <td className="px-6 py-3">
                          {editingItemId === item.id ? (
                            <input
                              type="number"
                              value={editingItemData?.cost}
                              onChange={e =>
                                setEditingItemData({ ...editingItemData!, cost: Number(e.target.value) })
                              }
                              className="w-20 px-2 py-1 border rounded-md text-xs focus:ring-1 focus:ring-primary"
                            />
                          ) : (
                            `$${item.cost.toFixed(2)}`
                          )}
                        </td>

                        {/* AMOUNT */}
                        <td className="px-6 py-3 font-semibold">
                          $
                          {(item.quantity * item.price).toFixed(2)}
                        </td>

                        {/* TAX */}
                        <td className="px-6 py-3">
                          {editingItemId === item.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={editingItemData?.taxable}
                                onChange={e =>
                                  setEditingItemData({
                                    ...editingItemData!,
                                    taxable: e.target.checked,
                                    taxPercent: e.target.checked ? editingItemData?.taxPercent || 0 : 0,
                                  })
                                }
                                className="accent-primary"
                              />
                              {editingItemData?.taxable && (
                                <input
                                  type="number"
                                  value={editingItemData.taxPercent || ""}
                                  onChange={e =>
                                    setEditingItemData({
                                      ...editingItemData!,
                                      taxPercent: Number(e.target.value),
                                    })
                                  }
                                  placeholder="%"
                                  className="w-14 px-2 py-1 border rounded-md text-xs"
                                />
                              )}
                            </div>
                          ) : (
                            item.taxable ? "Yes" : "No"
                          )}
                        </td>

                        {/* COLOR */}
                        <td className="px-6 py-3">
                          {editingItemId === item.id ? (
                            <input
                              value={editingItemData?.color || ""}
                              onChange={e =>
                                setEditingItemData({ ...editingItemData!, color: e.target.value })
                              }
                              className="w-20 px-2 py-1 border rounded-md text-xs"
                            />
                          ) : (
                            item.color || "-"
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-6 py-3 text-center flex gap-2">
                          {editingItemId === item.id ? (
                            <>
                              <button
                                onClick={handleSaveItem}
                                className="text-green-600 font-semibold p-1 rounded-sm bg-primary"
                              >
                                <Save className='w-4 h-5 text-white' />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingItemId(null)
                                  setEditingItemData(null)
                                }}
                                className="text-gray-200 p-1 rounded-sm bg-gray-800"
                              >
                                <X className='w-4 h-5 ' />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditItem(item)}
                                className="text-white  p-1 rounded-sm bg-primary"
                              >
                                <Edit2 className='w-4 h-5 ' />
                              </button>
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-white px-1  p-1 rounded-sm bg-red-500"
                              >
                                <Trash2 className='w-4 h-5 ' />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>


                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                        No items added yet
                      </td>
                    </tr>
                  )}

                  {/* Add Item Row */}
                  <tr className="bg-[#f6faf4] border-t-2 border-primary/20">
                    {/* DESCRIPTION */}
                    <td className="px-6 py-3">
                      <textarea
                        value={newItem.description || ""}
                        onChange={(e) =>
                          setNewItem({ ...newItem, description: e.target.value })
                        }
                        placeholder="Item description..."
                        className="w-full h-16 px-3 py-2 border border-gray-300 rounded-md
                 text-xs resize-none bg-white
                 focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </td>

                    {/* QUANTITY */}
                    <td className="px-6 py-3">
                      <input
                        type="number"
                        value={newItem.quantity || ""}
                        onChange={(e) =>
                          setNewItem({ ...newItem, quantity: Number(e.target.value) })
                        }
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md
                 text-xs bg-white focus:ring-1 focus:ring-primary"
                      />
                    </td>

                    {/* PRICE */}
                    <td className="px-6 py-3">
                      <input
                        type="number"
                        value={newItem.price || ""}
                        onChange={(e) =>
                          setNewItem({ ...newItem, price: Number(e.target.value) })
                        }
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md
                 text-xs bg-white focus:ring-1 focus:ring-primary"
                      />
                    </td>

                    {/* COST */}
                    <td className="px-6 py-3">
                      <input
                        type="number"
                        value={newItem.cost || ""}
                        onChange={(e) =>
                          setNewItem({ ...newItem, cost: Number(e.target.value) })
                        }
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md
                 text-xs bg-white focus:ring-1 focus:ring-primary"
                      />
                    </td>

                    {/* AMOUNT */}
                    <td className="px-6 py-3 text-sm font-semibold text-gray-900">
                      ${((newItem.quantity || 0) * (newItem.price || 0)).toFixed(2)}
                    </td>

                    {/* TAXABLE */}
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newItem.taxable || false}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              taxable: e.target.checked,
                              taxPercent: e.target.checked ? newItem.taxPercent || 0 : 0,
                            })
                          }
                          className="rounded accent-primary"
                        />

                        {newItem.taxable && (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={newItem.taxPercent || ""}
                              onChange={(e) =>
                                setNewItem({
                                  ...newItem,
                                  taxPercent: Number(e.target.value),
                                })
                              }
                              placeholder="%"
                              className="w-14 px-2 py-1 border border-gray-300 rounded-md
                       text-xs bg-white focus:ring-1 focus:ring-primary"
                            />
                            <span className="text-xs text-gray-600">%</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* COLOR */}
                    <td className="px-6 py-3">
                      <input
                        type="text"
                        value={newItem.color || ""}
                        onChange={(e) =>
                          setNewItem({ ...newItem, color: e.target.value })
                        }
                        placeholder="Color"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md
                 text-xs bg-white focus:ring-1 focus:ring-primary"
                      />
                    </td>

                    {/* ADD BUTTON */}
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={handleAddItem}
                        className="bg-primary hover:bg-[#2c621b] text-white
                 px-4 py-2 rounded-md text-xs font-semibold transition"
                      >
                        Add
                      </button>
                    </td>
                  </tr>

                </tbody>
              </table>
              <div className="md:hidden space-y-4">
                {/* @ts-ignore */}
                {currentData.items.map(item => (
                  <div
                    key={item.id}
                    className="bg-white border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex justify-between">
                      <h4 className="font-semibold text-sm">
                        {item.description}
                      </h4>
                      <button
                        onClick={() => setEditingItemId(item.id)}
                        className="text-primary"
                      >
                        ✏️
                      </button>
                    </div>

                    <div className="text-sm text-gray-600">
                      Qty: {item.quantity} | Price: ${item.price}
                    </div>

                    <div className="font-semibold">
                      Total: ${item.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

            </div>




          </div>

          {/* Action Buttons */}
          {activeTab === 'add' && (
            <div className="mt-6 flex gap-3 text-sm justify-end">
              <button
                onClick={() => setActiveTab('view')}
                className="px-6 py-2 border-2 border-gray-500 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewEstimate}
                className="px-6 py-2 bg-primary hover:bg-[#2c621b] text-white font-medium rounded-lg transition"
              >
                Save Estimate
              </button>
            </div>
          )}
        </div>



        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-3 space-y-4">

            {/* NOTES */}
            <div className="bg-white rounded-xl border p-5">
              <h3 className="text-sm font-semibold mb-2">Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Add notes for this estimate…"
                className="w-full rounded-lg border px-4 py-3 text-sm bg-gray-50
                       focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* PAYMENTS */}
            <div className="bg-white rounded-xl border p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold">Payments / Deposits</h3>

              </div>

              <p className="text-sm text-gray-500 mb-3">
                No payments added yet
              </p>

              <button className="w-full py-2 rounded-lg border border-primary
                             text-primary font-semibold text-sm">
                + Add payment
              </button>
            </div>

            {/* ATTACHMENTS */}
            <div className="bg-white rounded-xl border p-5">
              <h3 className="text-sm font-semibold mb-3">Attachments</h3>
              <div className="border-2 border-dashed rounded-lg p-6 text-center bg-gray-50 flex flex-col items-center justify-center">
                <Paperclip className='w-6 h-6 text-primary' />
                <p className="text-sm text-gray-600">Upload attachments</p>
                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG</p>
              </div>
            </div>

            {/* SIGNATURE */}
            <div className="bg-white rounded-xl border p-5">
              <h3 className="text-sm font-semibold mb-3">Signature</h3>
              <div className="border-2 border-dashed flex flex-row items-center justify-center rounded-lg p-6 text-center bg-gray-50">
                <p className="text-sm text-gray-600"><SignatureIcon className='h-8 w-8 text-primary' /> Add customer signature</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-2 bg-white rounded-xl border p-5 space-y-3">

            <InputRow label="Item cost" value={itemCost} readOnly />

            <InputRow
              label="Discount"
              value={discount}
              onChange={setDiscount}
            />

            <InputRow
              label="Taxable"
              value={taxableAmount}
              readOnly
            />

            {/* TAX RATE */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Tax rate :</span>
              <select
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="border max-w-[300px] border-gray-400 rounded-md px-2 py-2.5 text-sm"
              >
                <option value={0}>0%</option>
                <option value={5}>5%</option>
                <option value={10}>10%</option>
                <option value={18}>18%</option>
                <option value={20}>20%</option>

              </select>
            </div>

            <InputRow label="Tax" value={tax} readOnly />

            <InputRow
              label="Labor cost"
              value={laborCost}
              onChange={setLaborCost}
            />

            {/* <InputRow
              label="Deposit"
              value={deposit}
              onChange={setDeposit}
            /> */}
            <div className='flex items-center justify-between'>
              <button
                type="button"
                onClick={() => setIsDepositModalOpen(true)}
                className={` text-sm text-left text-blue-500 underline cursor-pointer"
                `}
              >
                Deposit:
              </button>
              <input
                type="number"
                value={deposit}
                // readOnly={readOnly}
                min={0}
                // @ts-ignore
                onChange={setDeposit}
                className={`max-w-[300px] border border-gray-400 rounded-md px-2 py-1 text-sm
              `}
              />
            </div>

            <div className="border-t pt-3 flex justify-between font-semibold text-base">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>

            <div className="text-sm text-gray-500">
              With optional: ${total.toFixed(2)}
            </div>
            <button className="text-sm w-full text-right font-semibold underline text-primary">
              + Add payment schedule
            </button>
          </div>
        </div>

      </div>
      <PriceBookModal
        isOpen={isPriceBookOpen}
        onClose={() => setIsPriceBookOpen(false)}
        // @ts-ignore
        data={priceBookData}
        onAddToEstimate={handleAddFromPriceBook}
      />
      {/* SEARCH ITEM MODAL */}
      <AddItemSearchModal
        isOpen={isSearchModalOpen}
        items={priceBookItems}
        onClose={() => setIsSearchModalOpen(false)}
        // @ts-ignore
        onSelect={handleSelectExistingItem}
        onCreateNew={handleCreateNewItem}
      />

      {/* CREATE ITEM MODAL */}
      <CreateItemModal
        isOpen={isCreateModalOpen}
        initialName={newItemName}
        onCancel={() => setIsCreateModalOpen(false)}
        // @ts-ignore
        onSave={handleSaveCreatedItem}
      />

      {/* ITEM DETAILS MODAL */}
      {selectedItem && (
        <ItemDetailsModal
          isOpen={isDetailsModalOpen}
          item={selectedItem}
          onClose={() => setIsDetailsModalOpen(false)}
          onSave={handleSaveItemToEstimate}
        />
      )}

      <DepositModal
        isOpen={isDepositModalOpen}
        initialType="amount"
        initialValue={deposit}
        onClose={() => setIsDepositModalOpen(false)}
        onSave={(data) => {
          if (data.depositType === "amount") {
            setDeposit(data.depositValue)
          } else {
            // example: percentage → convert using total
            setDeposit((total * data.depositValue) / 100)
          }
          setIsDepositModalOpen(false)
        }}
      />


    </div>
  )
}


function InputRow({
  label,
  value,
  onChange,
  readOnly = false,
}: {
  label: string
  value: number
  onChange?: (val: number) => void
  readOnly?: boolean
}) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-600 flex text-left">{label}<span>:</span></span>
      <input
        type="number"
        value={value.toFixed(2)}
        readOnly={readOnly}
        min={0}
        onChange={(e) => onChange?.(Number(e.target.value))}
        className={`max-w-[300px] border border-gray-400 rounded-md px-2 py-1 text-sm text-left
          ${readOnly ? "bg-gray-100" : "bg-white"}`}
      />
    </div>
  )
}
