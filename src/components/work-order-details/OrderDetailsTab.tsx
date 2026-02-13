

import { useState } from "react"

type TabKey =
  | "photos"
  | "items"
  | "pages"
  | "files"
  | "payments"
  | "checklists"
  | "reports"

interface OrderDetailsTabsProps {
  photosCount?: number
  itemCount?:number
  pagesCount?: number
  filesCount?: number
  paymentsCount?: number

  PhotosComponent: React.ReactNode
  ItemsComponent: React.ReactNode
  PagesComponent: React.ReactNode
  FilesComponent: React.ReactNode
  PaymentsComponent: React.ReactNode
  ChecklistsComponent: React.ReactNode
  ReportsComponent: React.ReactNode
}

export function OrderDetailsTabs({
  photosCount = 0,
  itemCount = 0,
  pagesCount = 0,
  filesCount = 0,
  paymentsCount = 0,
  PhotosComponent,
  ItemsComponent,
  PagesComponent,
  FilesComponent,
  PaymentsComponent,
  ChecklistsComponent,
  ReportsComponent,
}: OrderDetailsTabsProps) {

  const [activeTab, setActiveTab] = useState<TabKey>("photos")

  const tabs = [
    { key: "photos", label: "Photos", count: photosCount },
    { key: "items", label: "Items", count: itemCount },

    { key: "pages", label: "Pages", count: pagesCount },
    { key: "files", label: "Files", count: filesCount },
    { key: "payments", label: "Payments", count: paymentsCount },
    { key: "checklists", label: "Checklists" },
    { key: "reports", label: "Reports" },
  ] as const

  return (
    <div className="w-full">

      {/* TAB HEADER */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex gap-6 px-6 overflow-x-auto">

          {tabs.map(tab => {
            const isActive = activeTab === tab.key

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative py-4 text-sm font-semibold whitespace-nowrap transition-all
                  ${
                    isActive
                      ? "text-primary"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
              >
                <span className="flex items-center gap-1">
                  {tab.label}
                  {"count" in tab && tab.count !== undefined && (
                    <span className="text-gray-400">
                      ({tab.count})
                    </span>
                  )}
                </span>

           

                {isActive && (
                  <span className="absolute left-0 bottom-0 h-[3px] w-full bg-primary rounded-full" />
                )}
              </button>
            )
          })}

          
        </div>

      
           
       
      </div>

        


      {/* TAB CONTENT */}
      <div className="p-6 bg-white">
        {activeTab === "photos" && PhotosComponent}
        {activeTab === "items" && ItemsComponent}

        {activeTab === "pages" && PagesComponent}
        {activeTab === "files" && FilesComponent}
        {activeTab === "payments" && PaymentsComponent}
        {activeTab === "checklists" && ChecklistsComponent}
        {activeTab === "reports" && ReportsComponent}
      </div>
    </div>
  )
}
