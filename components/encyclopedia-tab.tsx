'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Settings, Star } from 'lucide-react'

type FilterType = 'all' | 'region' | 'rarity' | 'season'

const FILTERS = [
  { id: 'all' as FilterType, label: '전체' },
  { id: 'region' as FilterType, label: '지역별' },
  { id: 'rarity' as FilterType, label: '희귀도별' },
  { id: 'season' as FilterType, label: '계절별' },
]

interface DictionaryAnimal {
  id: number
  name: string
  imageUrl: string
  stars: number
  discovered: boolean
  region?: string
  rarity?: number
  season?: string
}

const ANIMALS: DictionaryAnimal[] = [
  { id: 1, name: '치즈냥', imageUrl: '/animals/cheese-cat.jpg', stars: 3, discovered: true, region: '홍대', rarity: 1, season: '봄' },
  { id: 2, name: '검동이', imageUrl: '/animals/kitten.jpg', stars: 3, discovered: true, region: '성수', rarity: 2, season: '여름' },
  { id: 3, name: '삼색이', imageUrl: '/animals/cheese-cat.jpg', stars: 3, discovered: true, region: '연남', rarity: 1, season: '봄' },
  { id: 4, name: '말티즈', imageUrl: '/animals/maltese.jpg', stars: 3, discovered: true, region: '한강', rarity: 2, season: '가을' },
  { id: 5, name: '오리', imageUrl: '/animals/duck.jpg', stars: 3, discovered: true, region: '한강', rarity: 1, season: '여름' },
  { id: 6, name: '???', imageUrl: '/animals/puppy.jpg', stars: 0, discovered: false, rarity: 3 },
  { id: 7, name: '???', imageUrl: '/animals/rabbit.jpg', stars: 0, discovered: false, rarity: 4 },
  { id: 8, name: '???', imageUrl: '/animals/pigeon.jpg', stars: 0, discovered: false, rarity: 2 },
  { id: 9, name: '???', imageUrl: '/animals/maltese.jpg', stars: 0, discovered: false, rarity: 3 },
  { id: 10, name: '???', imageUrl: '/animals/kitten.jpg', stars: 0, discovered: false, rarity: 4 },
  { id: 11, name: '???', imageUrl: '/animals/duck.jpg', stars: 0, discovered: false, rarity: 5 },
  { id: 12, name: '???', imageUrl: '/animals/puppy.jpg', stars: 0, discovered: false, rarity: 5 },
]

const TOTAL_ANIMALS = 87
const DISCOVERED_COUNT = 23
const COMPLETION_PERCENT = Math.round((DISCOVERED_COUNT / TOTAL_ANIMALS) * 100)

const RARITY_STARS: Record<number, number> = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 }

function StarRow({ count, filled }: { count: number; filled: boolean }) {
  return (
    <div className="flex gap-0.5 justify-center">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${filled ? 'fill-yellow-400 text-yellow-400' : 'fill-muted-foreground/20 text-muted-foreground/20'}`}
        />
      ))}
    </div>
  )
}

export function EncyclopediaTab() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  const filtered = ANIMALS.filter((a) => {
    if (activeFilter === 'all') return true
    return true
  })

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="sticky top-0 z-40 px-4 pt-14 pb-0 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">도감</h1>
          <button className="p-2 rounded-full hover:bg-muted transition-colors">
            <Settings className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Completion Stats */}
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">도감 완성도</p>
            <p className="text-4xl font-bold leading-none">
              {COMPLETION_PERCENT}
              <span className="text-xl font-semibold">%</span>
            </p>
          </div>
          <div className="text-right pb-0.5">
            <p className="text-xs text-muted-foreground mb-0.5">발견한 동물</p>
            <p className="text-base font-semibold">
              {DISCOVERED_COUNT}{' '}
              <span className="text-muted-foreground font-normal">/ {TOTAL_ANIMALS}</span>
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-muted rounded-full mb-4">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${COMPLETION_PERCENT}%` }}
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-border">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors relative ${
                activeFilter === filter.id
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {filter.label}
              {activeFilter === filter.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Animal Grid */}
      <main className="flex-1 overflow-y-auto scrollbar-hide pb-24 px-4 pt-4">
        <div className="grid grid-cols-3 gap-3">
          {filtered.map((animal) => (
            <div key={animal.id} className="flex flex-col items-center gap-1">
              {/* Animal Image */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-muted">
                <Image
                  src={animal.imageUrl}
                  alt={animal.discovered ? animal.name : '미발견 동물'}
                  fill
                  className={`object-cover ${animal.discovered ? '' : 'brightness-0'}`}
                />
              </div>

              {/* Name */}
              <p className={`text-sm font-medium truncate w-full text-center ${
                animal.discovered ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {animal.name}
              </p>

              {/* Stars */}
              {animal.discovered ? (
                <StarRow count={animal.stars} filled />
              ) : (
                <StarRow count={3} filled={false} />
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
