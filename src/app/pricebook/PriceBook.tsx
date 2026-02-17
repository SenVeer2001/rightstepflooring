"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import ItemsProductsTable from "../../components/pricebookPages/ItemsProductsTable"
import ItemGroupsTable from "../../components/pricebookPages/ItemGroupsTable"

import ItemBrandsTable from "../../components/pricebookPages/ItemBrands"


import ItemModal from "../../components/pricebookPages/pricebookModels/ItemModel"
import ItemGroupModal from "../../components/pricebookPages/pricebookModels/ItemGroupModal"

import BrandModal from "../../components/pricebookPages/pricebookModels/BrandModel"
import PriceBookPage from "../../components/pricebookPages/priceBookCategory/PriceBookPage"
import CategoryModal from "../../components/pricebookPages/priceBookCategory/CategoryModel"

type TabKey =
  | "Items & products"
  | "Item groups"
  | "Item categories"
  | "Item brands"

export default function PriceBook() {
  const [activeTab, setActiveTab] = useState<TabKey>("Items & products")
  const [openModal, setOpenModal] = useState(false)

  const [itemModalMode, setItemModalMode] =
    useState<"create" | "edit">("create")
  const [selectedItem, setSelectedItem] = useState<any | null>(null)

  const [groupModalMode, setGroupModalMode] =
    useState<"create" | "edit">("create")
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null)

  const [categoryModalMode, setCategoryModalMode] =
    useState<"create" | "edit">("create")
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null)

  const [brandModalMode, setBrandModalMode] =
    useState<"create" | "edit">("create")
  const [selectedBrand, setSelectedBrand] = useState<any | null>(null)




  const handleEditCategory = (category: any) => {
    setSelectedCategory(category)
    setCategoryModalMode("edit")
    setOpenModal(true)
  }



  const handleAddNew = () => {
    if (activeTab === "Items & products") {
      setSelectedItem(null)
      setItemModalMode("create")
    }

    if (activeTab === "Item groups") {
      setSelectedGroup(null)
      setGroupModalMode("create")
    }

    if (activeTab === "Item categories") {
      setSelectedCategory(null)
      setCategoryModalMode("create")
    }

    if (activeTab === "Item brands") {
      handleAddNewBrand()
      return
    }

    setOpenModal(true)
  }

  const handleAddNewBrand = () => {
    setSelectedBrand(null)
    setBrandModalMode("create")
    setOpenModal(true)
  }

  const handleEditBrand = (brand: any) => {
    setSelectedBrand(brand)
    setBrandModalMode("edit")
    setOpenModal(true)
  }

  const handleEditItem = (item: any) => {
    setSelectedItem(item)
    setItemModalMode("edit")
    setOpenModal(true)
  }

  const handleEditGroup = (group: any) => {
    setSelectedGroup(group)
    setGroupModalMode("edit")
    setOpenModal(true)
  }



  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Price book</h1>

        <button
          onClick={handleAddNew}
          className="px-5 py-2 bg-primary text-white rounded-full flex items-center gap-2 text-sm font-semibold"
        >
          <Plus size={16} />
          Add New
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-6 border-b">
        {(["Item categories","Items & products", "Item groups",  "Item brands"] as TabKey[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-[16px] font-semibold border-b-2 ${activeTab === tab
              ? "border-primary text-primary"
              : "border-transparent text-gray-600"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

     

       {activeTab === "Item categories" && (
        <PriceBookPage onEditCategory={handleEditCategory} />
      )}

      {activeTab === "Items & products" && (
        <ItemsProductsTable onRowClick={handleEditItem} />
      )}

      {activeTab === "Item groups" && (
        <ItemGroupsTable onRowClick={handleEditGroup} />
      )}

    


      {activeTab === "Item brands" && (
        <ItemBrandsTable onRowClick={handleEditBrand} />
      )}

    

      <ItemModal
        open={openModal && activeTab === "Items & products"}
        mode={itemModalMode}
        initialData={selectedItem}
        onClose={() => setOpenModal(false)}
        onSave={() => setOpenModal(false)}
        onDelete={() => setOpenModal(false)}
      />

      <ItemGroupModal
        open={openModal && activeTab === "Item groups"}
        mode={groupModalMode}
        initialData={selectedGroup}
        onClose={() => setOpenModal(false)}
        onSave={() => setOpenModal(false)}
      />

      <CategoryModal
        open={openModal && activeTab === "Item categories"}
        mode={categoryModalMode}
        initialData={selectedCategory}
        onClose={() => setOpenModal(false)}
        onSave={data => {
          console.log(
            categoryModalMode === "create"
              ? "Create Category:"
              : "Update Category:",
            data
          )
          setOpenModal(false)
        }}
      />

      <BrandModal
        open={openModal && activeTab === "Item brands"}
        mode={brandModalMode}
        initialData={selectedBrand}
        onClose={() => setOpenModal(false)}
        onSave={data => {
          console.log(
            brandModalMode === "create" ? "Create Brand:" : "Update Brand:",
            data
          )
          setOpenModal(false)
        }}
      />
    </div>
  )
}
