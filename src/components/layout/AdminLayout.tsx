import { useState } from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="relative flex h-screen overflow-hidden">

      {/* 🌈 Global Conic Gradient */}
      <div className="conic-gradient-bg" />
      <div className="glass-layout"/>
      <div className="glass-surface"/>

      {/* Sidebar - Now always visible with collapsible behavior */}
      <div className="z-40">
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
