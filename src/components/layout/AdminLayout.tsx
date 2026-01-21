import { useState } from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="relative flex h-screen overflow-hidden">

      {/* 🌈 Global Conic Gradient */}
      <div className="conic-gradient-bg" />
      <div className="glass-layout"/>
<div className="glass-surface"/>


      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform md:static md:z-0 md:transform-none ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* Glass Layout */}
      <div className="glass-layout flex flex-1 flex-col overflow-hidden">

        <Header />

        <main className="mt-1 flex-1 overflow-auto p-4 md:p-6 ">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>

      </div>
    </div>
  )
}
