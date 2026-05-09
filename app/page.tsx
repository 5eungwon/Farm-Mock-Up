'use client'

import { useState } from 'react'
import type { TabType } from '@/lib/types'
import { BottomNavigation } from '@/components/bottom-navigation'
import { ExploreTab } from '@/components/explore-tab'
import { CaptureTab } from '@/components/capture-tab'
import { FarmTab } from '@/components/farm-tab'
import { EncyclopediaTab } from '@/components/encyclopedia-tab'

function PlaceholderTab({ label }: { label: string }) {
  return (
    <div className="flex flex-col h-full items-center justify-center text-muted-foreground">
      <p className="text-lg font-medium">{label}</p>
      <p className="text-sm mt-1">준비 중입니다</p>
    </div>
  )
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('explore')

  return (
    <>
      {/* Mobile: Full screen app */}
      <div className="md:hidden relative w-full h-dvh bg-background overflow-hidden">
        <div className="h-full">
          {activeTab === 'explore' && <ExploreTab />}
          {activeTab === 'capture' && <CaptureTab />}
          {activeTab === 'farm' && <FarmTab />}
          {activeTab === 'encyclopedia' && <EncyclopediaTab />}
          {activeTab === 'shop' && <PlaceholderTab label="상점" />}
        </div>
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Desktop: Phone frame mockup */}
      <div className="hidden md:flex justify-center items-center min-h-dvh bg-neutral-800">
        <div className="relative w-full max-w-[430px] h-[932px] bg-background overflow-hidden shadow-2xl rounded-[40px] border-[8px] border-neutral-900">
          {/* Status Bar (iOS style) */}
          <div className="absolute top-0 left-0 right-0 z-50 h-11 flex items-center justify-between px-6 bg-transparent">
            <span className="text-sm font-semibold text-foreground">9:41</span>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3C7.46 3 3.34 4.78.29 7.67c-.18.18-.29.43-.29.71s.11.53.29.71l2.48 2.48c.18.18.43.29.71.29s.53-.11.71-.29c1.68-1.68 3.99-2.72 6.81-2.72s5.13 1.04 6.81 2.72c.18.18.43.29.71.29s.53-.11.71-.29l2.48-2.48c.18-.18.29-.43.29-.71s-.11-.53-.29-.71C20.66 4.78 16.54 3 12 3z"/>
              </svg>
              <svg className="w-4 h-4 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2 22h20V2z"/>
              </svg>
              <svg className="w-6 h-3 text-foreground" fill="currentColor" viewBox="0 0 28 14">
                <rect x="0" y="0" width="25" height="14" rx="3" stroke="currentColor" strokeWidth="1" fill="none"/>
                <rect x="2" y="2" width="19" height="10" rx="1" fill="currentColor"/>
                <rect x="26" y="4" width="2" height="6" rx="1" fill="currentColor"/>
              </svg>
            </div>
          </div>

          {/* Dynamic Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 w-28 h-7 bg-black rounded-full" />

          {/* App Content */}
          <div className="h-full overflow-hidden pt-11">
            {activeTab === 'explore' && <ExploreTab />}
            {activeTab === 'capture' && <CaptureTab />}
            {activeTab === 'farm' && <FarmTab />}
            {activeTab === 'encyclopedia' && <EncyclopediaTab />}
            {activeTab === 'shop' && <PlaceholderTab label="상점" />}
          </div>

          {/* Bottom Navigation */}
          <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Home Indicator */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-foreground/30 rounded-full" />
        </div>
      </div>
    </>
  )
}
