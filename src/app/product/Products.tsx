import { useState } from "react"
import {
    Plus,
    X,
    Image as ImageIcon,
    Edit,
    Trash2
} from "lucide-react"

/* ===================== TYPES ===================== */

interface Product {
    id: string
    image: string
    category: string
    subCategory: string
    type: string
    model: string
    brand: string
    booking: number
    inventory: number
    taxable: boolean
    purchasePrice: number
    markupPercent: number
    salePrice: number
    discount: number
}

/* ===================== STATIC DATA ===================== */
const initialProducts: Product[] = [
  {
    id: "P-001",
    image: "",
    category: "Flooring",
    subCategory: "Tiles",
    type: "Ceramic",
    model: "TX-200",
    brand: "Kajaria",
    booking: 12,
    inventory: 80,
    taxable: true,
    purchasePrice: 500,
    markupPercent: 10,
    salePrice: 550,
    discount: 5,
  },
  {
    id: "P-002",
    image: "",
    category: "Flooring",
    subCategory: "Tiles",
    type: "Vitrified",
    model: "VT-450",
    brand: "Somany",
    booking: 8,
    inventory: 120,
    taxable: true,
    purchasePrice: 720,
    markupPercent: 12,
    salePrice: 806,
    discount: 7,
  },
  {
    id: "P-003",
    image: "",
    category: "Flooring",
    subCategory: "Wood",
    type: "Laminate",
    model: "LM-320",
    brand: "Pergo",
    booking: 5,
    inventory: 60,
    taxable: true,
    purchasePrice: 1450,
    markupPercent: 15,
    salePrice: 1668,
    discount: 10,
  },
  {
    id: "P-004",
    image: "",
    category: "Carpets",
    subCategory: "Rugs",
    type: "Handwoven",
    model: "HW-900",
    brand: "Oriental Weavers",
    booking: 3,
    inventory: 25,
    taxable: false,
    purchasePrice: 3200,
    markupPercent: 20,
    salePrice: 3840,
    discount: 12,
  },
  {
    id: "P-005",
    image: "",
    category: "Flooring",
    subCategory: "Vinyl",
    type: "Luxury Vinyl",
    model: "LV-110",
    brand: "Armstrong",
    booking: 10,
    inventory: 90,
    taxable: true,
    purchasePrice: 980,
    markupPercent: 10,
    salePrice: 1078,
    discount: 6,
  },
  {
    id: "P-006",
    image: "",
    category: "Flooring",
    subCategory: "Stone",
    type: "Marble",
    model: "MR-700",
    brand: "Rajasthan Stones",
    booking: 2,
    inventory: 18,
    taxable: true,
    purchasePrice: 4200,
    markupPercent: 18,
    salePrice: 4956,
    discount: 8,
  },
]

/* ===================== COMPONENT ===================== */

export function Products() {
    const [products, setProducts] = useState<Product[]>(initialProducts)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    return (
        <div className="space-y-6 p-4 min-h-screen">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage product inventory and pricing
                    </p>
                </div>

                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-semibold hover:opacity-90"
                >
                    <Plus size={18} />
                    Create Product
                </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                {[
                                    "ID",
                                    "Image",
                                    "Category",
                                    "Type",
                                    "Brand",
                                    "Inventory",
                                    "Booking",
                                    "Taxable",
                                    "PP",
                                    "Markup",
                                    "Sale Price",
                                    "Discount",
                                    "Actions",
                                ].map((heading) => (
                                    <th
                                        key={heading}
                                        className="px-4 py-3 text-left font-semibold text-gray-900 whitespace-nowrap"
                                    >
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-t border-gray-200 hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3 font-semibold min-w-[100px]">{product.id}</td>

                                    <td className="px-4 py-3">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                className="w-10 h-10 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                                                <ImageIcon size={16} className="text-gray-500" />
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-4 py-3">
                                        {product.category} / {product.subCategory}
                                    </td>

                                    <td className="px-4 py-3">
                                        {product.type} ({product.model})
                                    </td>

                                    <td className="px-4 py-3">{product.brand}</td>

                                    <td className="px-4 py-3 font-semibold">
                                        {product.inventory}
                                    </td>

                                    <td className="px-4 py-3">{product.booking}</td>

                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full font-semibold ${product.taxable
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-200 text-gray-800"
                                                }`}
                                        >
                                            {product.taxable ? "Yes" : "No"}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3">₹{product.purchasePrice}</td>
                                    <td className="px-4 py-3">{product.markupPercent}%</td>
                                    <td className="px-4 py-3 font-semibold">
                                        ₹{product.salePrice}
                                    </td>
                                    <td className="px-4 py-3">{product.discount}%</td>

                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button className="p-2 hover:bg-gray-200 rounded">
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-red-100 text-red-600 rounded">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {products.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        No products found
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <CreateProductModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreate={(newProduct) =>
                        setProducts([newProduct, ...products])
                    }
                />
            )}
        </div>
    )
}

/* ===================== CREATE PRODUCT MODAL ===================== */
// import { useState } from "react"
import { } from "lucide-react"

function CreateProductModal({
    onClose,
    onCreate,
}: {
    onClose: () => void
    onCreate: (product: Product) => void
}) {
    const [formData, setFormData] = useState<Product>({
        id: "",
        image: "",
        category: "",
        subCategory: "",
        type: "",
        model: "",
        brand: "",
        booking: 0,
        inventory: 0,
        taxable: true,
        purchasePrice: 0,
        markupPercent: 10,
        salePrice: 0,
        discount: 0,
    })

    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const handleImageUpload = (file: File | null) => {
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result as string)
            setFormData({ ...formData, image: reader.result as string })
        }
        reader.readAsDataURL(file)
    }

    const handleRemoveImage = () => {
        setImagePreview(null)
        setFormData({ ...formData, image: "" })
    }


    const handleChange = (field: keyof Product, value: any) => {
        setFormData({ ...formData, [field]: value })
    }



    const handleSubmit = () => {
        onCreate(formData)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Create Product
                        </h2>
                        <p className="text-sm text-gray-500">
                            Add product details, pricing & inventory
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <X />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-5 space-y-6">

                    {/* Image Upload */}
                    <div className="flex items-center gap-4">
                        <div className="relative w-24 h-24 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden">
                            {imagePreview ? (
                                <>
                                    <img
                                        src={imagePreview}
                                        alt="Product"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={handleRemoveImage}
                                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-50"
                                        title="Remove image"
                                    >
                                        <X size={14} className="text-red-600" />
                                    </button>
                                </>
                            ) : (
                                <ImageIcon className="text-gray-400" />
                            )}
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-gray-900">
                                Product Image
                            </p>
                            <p className="text-xs text-gray-500">
                                JPG, PNG up to 5MB
                            </p>

                            <label className="inline-block mt-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(event) =>
                                        handleImageUpload(event.target.files?.[0] || null)
                                    }
                                />
                                <span className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold border border-gray-300 rounded-lg hover:bg-gray-100">
                                    Upload Image
                                </span>
                            </label>
                        </div>
                    </div>


                    {/* Basic Info */}
                    <Section title="Basic Information">
                        <Input label="Product ID" placeholder="P-001" onChange={(v) => handleChange("id", v)} />
                        <Input label="Category" placeholder="Flooring" onChange={(v) => handleChange("category", v)} />
                        <Input label="Sub Category" placeholder="Tiles" onChange={(v) => handleChange("subCategory", v)} />
                        <Input label="Type" placeholder="Ceramic" onChange={(v) => handleChange("type", v)} />
                        <Input label="Model" placeholder="TX-200" onChange={(v) => handleChange("model", v)} />
                        <Input label="Brand" placeholder="Kajaria" onChange={(v) => handleChange("brand", v)} />
                    </Section>

                    {/* Inventory */}
                    <Section title="Inventory">
                        <NumberInput label="Inventory" onChange={(v) => handleChange("inventory", v)} />
                        <NumberInput label="Booking" onChange={(v) => handleChange("booking", v)} />
                    </Section>

                    {/* Pricing */}
                    <Section title="Pricing">
                        <NumberInput label="Purchase Price (PP)" onChange={(v) => handleChange("purchasePrice", v)} />
                        <NumberInput label="Markup (%)" onChange={(v) => handleChange("markupPercent", v)} />
                        <NumberInput label="Sale Price" onChange={(v) => handleChange("salePrice", v)} />
                        <NumberInput label="Discount (%)" onChange={(v) => handleChange("discount", v)} />
                    </Section>

                    {/* Tax */}
                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                        <input
                            type="checkbox"
                            checked={formData.taxable}
                            onChange={(event) =>
                                handleChange("taxable", event.target.checked)
                            }
                            className="w-4 h-4 accent-primary"
                        />
                        <div>
                            <p className="font-semibold text-gray-900">Taxable</p>
                            <p className="text-xs text-gray-500">
                                Enable tax calculation for this product
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t flex justify-end gap-3 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-5 py-2 rounded-lg bg-primary text-white font-semibold hover:opacity-90"
                    >
                        Save Product
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ===================== SMALL UI COMPONENTS ===================== */

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  )
}


function Input({
  label,
  placeholder,
  onChange,
}: {
  label: string
  placeholder?: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-600">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm
           focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  )
}


function NumberInput({
  label,
  onChange,
}: {
  label: string
  onChange: (value: number) => void
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-600">
        {label}
      </label>
      <input
        type="number"
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm
        focus:bg-white   focus:outline-none focus:ring-2 focus:ring-primary transition"
      />
    </div>
  )
}

