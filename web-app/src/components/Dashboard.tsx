'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import DashboardContent from './DashboardContent'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black-950">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <DashboardContent />
          </div>
        </main>
      </div>
    </div>
  )
}