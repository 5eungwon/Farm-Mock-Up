'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MapPin, Bell, Star, PawPrint, X, Navigation } from 'lucide-react'

type FilterType = 'all' | 'discoverable' | 'rare' | 'night'

const FILTERS = [
  { id: 'all' as FilterType, label: '전체' },
  { id: 'discoverable' as FilterType, label: '발견 가능' },
  { id: 'rare' as FilterType, label: '희귀' },
  { id: 'night' as FilterType, label: '야간 출몰' },
]

interface MapAnimal {
  id: number
  name: string
  imageUrl: string | null
  stars: number
  distance: number
  x: number
  y: number
  silhouette?: boolean
  unknown?: boolean
  location?: string
  tags?: string[]
  rarity?: string
}

const MAP_ANIMALS: MapAnimal[] = [
  { id: 1, name: '치즈냥', imageUrl: '/animals/cheese-cat.jpg', stars: 3, distance: 120, x: 18, y: 22, location: '홍대 공원 근처', tags: ['주간 출몰', '사람을 잘 따름'], rarity: '희귀' },
  { id: 2, name: '토끼', imageUrl: '/animals/rabbit.jpg', stars: 2, distance: 95, x: 67, y: 13, location: '연남동 골목', tags: ['풀숲 서식', '빠른 이동'], rarity: '보통' },
  { id: 3, name: '???', imageUrl: '/animals/kitten.jpg', stars: 0, distance: 250, x: 9, y: 47, silhouette: true, location: '미확인 구역', tags: ['미발견'] },
  { id: 4, name: '???', imageUrl: null, stars: 0, distance: 180, x: 72, y: 45, unknown: true, location: '미확인 구역', tags: ['미발견'] },
  { id: 5, name: '???', imageUrl: '/animals/kitten.jpg', stars: 0, distance: 320, x: 40, y: 65, silhouette: true, location: '미확인 구역', tags: ['야간 출몰'] },
]

const PAW_PRINTS = [
  { x: 47, y: 17 },
  { x: 83, y: 31 },
  { x: 28, y: 67 },
  { x: 60, y: 57 },
  { x: 56, y: 27 },
]

const FEATURED = {
  name: '치즈냥',
  stars: 3,
  location: '홍대 공원 근처',
  distance: '120m',
  imageUrl: '/animals/cheese-cat.jpg',
  tags: ['주간 출몰', '사람을 잘 따름'],
}

function AnimalBottomSheet({ animal, onClose }: { animal: MapAnimal; onClose: () => void }) {
  const isUnknown = animal.unknown || animal.silhouette
  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 z-[100]"
        onClick={onClose}
      />
      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 z-[101] bg-card rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        <div className="px-5 pt-2 pb-8">
          {/* Animal image + name */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
              {animal.unknown ? (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-400">?</span>
                </div>
              ) : (
                <Image
                  src={animal.imageUrl!}
                  alt={animal.name}
                  fill
                  className={`object-cover ${animal.silhouette ? 'brightness-[0.2] grayscale' : ''}`}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold mb-1">
                {isUnknown ? '미발견 동물' : animal.name}
              </h2>
              {!isUnknown && animal.stars > 0 && (
                <div className="flex gap-0.5 mb-1">
                  {Array.from({ length: animal.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              )}
              {!isUnknown && animal.rarity && (
                <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                  {animal.rarity}
                </span>
              )}
            </div>
          </div>

          {/* Info rows */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{animal.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Navigation className="w-4 h-4 flex-shrink-0" />
              <span>{animal.distance}m 거리</span>
            </div>
          </div>

          {/* Tags */}
          {animal.tags && animal.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {animal.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-muted text-muted-foreground px-3 py-1.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* CTA Button */}
          <button
            className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-colors ${
              isUnknown
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground active:opacity-80'
            }`}
            disabled={isUnknown}
          >
            {isUnknown ? '발견 정보 없음' : '발견하러 가기'}
          </button>
        </div>
      </div>
    </>
  )
}

export function ExploreTab() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [selectedAnimal, setSelectedAnimal] = useState<MapAnimal | null>(null)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="sticky top-0 z-40 px-4 pt-14 pb-3 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold">탐험</h1>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 bg-muted rounded-full px-3 py-1.5">
              <MapPin className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium">서울 성동구</span>
            </button>
            <button className="p-2 rounded-full hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </header>

      {/* Map Area + Bottom Sheet overlay */}
      <div className="flex-1 relative overflow-hidden">
        {/* Map SVG Background */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base warm beige */}
          <rect width="100" height="100" fill="#ede5d0" />

          {/* Park areas */}
          <rect x="52" y="46" width="26" height="22" rx="3" fill="#c8dba8" />
          <ellipse cx="65" cy="57" rx="13" ry="10" fill="#c5d9a5" />
          <rect x="0" y="76" width="17" height="24" rx="2" fill="#c8dba8" />
          <ellipse cx="8" cy="83" rx="7" ry="8" fill="#c5d9a5" />

          {/* River at bottom */}
          <path d="M0 91 Q20 88 45 91 Q70 94 100 89 L100 100 L0 100 Z" fill="#b5cfe6" />

          {/* Main horizontal roads */}
          <rect x="0" y="43" width="100" height="3.5" fill="#faf7ef" />
          <rect x="0" y="19" width="100" height="2" fill="#f5f0e5" />
          <rect x="0" y="66" width="100" height="2.5" fill="#f5f0e5" />

          {/* Main vertical roads */}
          <rect x="40" y="0" width="3.5" height="100" fill="#faf7ef" />
          <rect x="18" y="0" width="2" height="100" fill="#f5f0e5" />
          <rect x="72" y="0" width="2.5" height="100" fill="#f5f0e5" />

          {/* Diagonal / secondary roads */}
          <line x1="0" y1="32" x2="42" y2="43" stroke="#f5f0e5" strokeWidth="1.5" />
          <line x1="40" y1="43" x2="20" y2="66" stroke="#f5f0e5" strokeWidth="1.2" />
          <line x1="72" y1="43" x2="86" y2="66" stroke="#f5f0e5" strokeWidth="1.2" />
          <line x1="40" y1="43" x2="55" y2="66" stroke="#f5f0e5" strokeWidth="1" />

          {/* Building blocks */}
          <rect x="2" y="2" width="14" height="15" rx="1.5" fill="#ddd5c0" />
          <rect x="22" y="2" width="16" height="15" rx="1.5" fill="#ddd5c0" />
          <rect x="2" y="22" width="14" height="18" rx="1.5" fill="#ddd5c0" />
          <rect x="2" y="47" width="14" height="16" rx="1.5" fill="#ddd5c0" />
          <rect x="22" y="22" width="15" height="18" rx="1.5" fill="#ddd5c0" />
          <rect x="22" y="47" width="16" height="16" rx="1.5" fill="#ddd5c0" />
          <rect x="44" y="0" width="25" height="17" rx="1.5" fill="#ddd5c0" />
          <rect x="44" y="47" width="5" height="15" rx="1.5" fill="#ddd5c0" />
          <rect x="74" y="0" width="24" height="17" rx="1.5" fill="#ddd5c0" />
          <rect x="74" y="22" width="24" height="18" rx="1.5" fill="#ddd5c0" />
          <rect x="74" y="47" width="24" height="16" rx="1.5" fill="#ddd5c0" />
          <rect x="22" y="69" width="16" height="14" rx="1.5" fill="#ddd5c0" />
          <rect x="44" y="69" width="25" height="14" rx="1.5" fill="#ddd5c0" />
          <rect x="74" y="69" width="24" height="14" rx="1.5" fill="#ddd5c0" />
        </svg>

        {/* Paw Prints */}
        {PAW_PRINTS.map((paw, idx) => (
          <div
            key={idx}
            className="absolute pointer-events-none"
            style={{ left: `${paw.x}%`, top: `${paw.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <PawPrint className="w-5 h-5 text-primary/35" />
          </div>
        ))}

        {/* User Location Dot */}
        <div
          className="absolute"
          style={{ left: '38%', top: '41%', transform: 'translate(-50%, -50%)' }}
        >
          <div className="relative w-4 h-4">
            <div className="absolute inset-0 rounded-full bg-blue-400 opacity-50 animate-ping" />
            <div className="relative w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-md" />
          </div>
        </div>

        {/* Animal Markers */}
        {MAP_ANIMALS.map((animal) => (
          <button
            key={animal.id}
            className="absolute focus:outline-none"
            style={{ left: `${animal.x}%`, top: `${animal.y}%`, transform: 'translate(-50%, -50%)' }}
            onClick={() => setSelectedAnimal(animal)}
          >
            {/* Stars above */}
            {animal.stars > 0 && (
              <div className="flex justify-center gap-0.5 mb-1">
                {Array.from({ length: animal.stars }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            )}

            {/* Circle marker */}
            {animal.unknown ? (
              <div className="w-14 h-14 rounded-full bg-gray-200/90 border-[3px] border-white shadow-lg flex items-center justify-center active:scale-95 transition-transform">
                <span className="text-2xl font-bold text-gray-400">?</span>
              </div>
            ) : (
              <div className="relative w-14 h-14 rounded-full border-[3px] border-white shadow-lg overflow-hidden active:scale-95 transition-transform">
                <Image
                  src={animal.imageUrl!}
                  alt={animal.name}
                  fill
                  className={`object-cover ${animal.silhouette ? 'brightness-[0.2] grayscale' : ''}`}
                />
              </div>
            )}

            {/* Distance label */}
            <p className="text-center text-[11px] font-semibold mt-1 text-gray-600 drop-shadow-sm">
              {animal.distance}m
            </p>
          </button>
        ))}

        {/* Animal Info Bottom Sheet */}
        {selectedAnimal && (
          <AnimalBottomSheet
            animal={selectedAnimal}
            onClose={() => setSelectedAnimal(null)}
          />
        )}
      </div>

      {/* Featured Animal Card */}
      <div className="bg-card border-t border-border px-4 pt-3 pb-24">
        <div className="flex gap-3 items-center">
          {/* Animal image */}
          <div className="relative w-[68px] h-[68px] rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src={FEATURED.imageUrl}
              alt={FEATURED.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-bold text-base">{FEATURED.name}</span>
              <div className="flex gap-0.5">
                {Array.from({ length: FEATURED.stars }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{FEATURED.location}</p>
            <p className="text-sm font-semibold text-foreground">{FEATURED.distance}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1 flex-shrink-0">
            {FEATURED.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] bg-muted text-muted-foreground px-2.5 py-1 rounded-full whitespace-nowrap text-center"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
