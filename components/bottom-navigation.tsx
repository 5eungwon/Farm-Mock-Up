'use client'

import type { TabType } from '@/lib/types'
import { Leaf, Camera, Home, BookOpen, ShoppingBag } from 'lucide-react'

interface BottomNavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'explore' as const, label: '탐험', icon: Leaf },
    { id: 'capture' as const, label: '포착', icon: Camera },
    { id: 'farm' as const, label: '농장', icon: Home },
    { id: 'encyclopedia' as const, label: '도감', icon: BookOpen },
    { id: 'shop' as const, label: '상점', icon: ShoppingBag },
  ]

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-card border-t border-border px-1 pb-8 pt-2 z-50">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
