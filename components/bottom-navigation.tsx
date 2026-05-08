'use client'

import type { TabType } from '@/lib/types'
import { Compass, Camera, Home } from 'lucide-react'

interface BottomNavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'discover' as const, label: '발견', icon: Compass },
    { id: 'capture' as const, label: '찍기', icon: Camera },
    { id: 'farm' as const, label: '내 농장', icon: Home },
  ]

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-card border-t border-border px-4 pb-8 pt-2 z-50">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.id === 'capture' ? (
                <div className={`p-3 rounded-full ${isActive ? 'bg-primary' : 'bg-muted'}`}>
                  <Icon className={`w-6 h-6 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                </div>
              ) : (
                <Icon className="w-6 h-6" />
              )}
              <span className={`text-xs font-medium ${isActive ? 'text-primary' : ''}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
