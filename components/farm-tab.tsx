'use client'

import { useEffect, useRef, useState } from 'react'
import { Settings, Plus, ChevronRight, Sofa, Store } from 'lucide-react'
import { useStore } from '@/lib/store'
import type { Animal } from '@/lib/types'
import Image from 'next/image'

// Sample animals for demo (when store is empty)
const DEMO_ANIMALS: Animal[] = [
  {
    id: 'demo-1',
    name: '말티즈',
    type: '강아지',
    imageUrl: '/animals/maltese.jpg',
    location: '서울숲',
    capturedAt: new Date().toISOString(),
    likes: 0,
    position: { x: 25, y: 45 },
    velocity: { x: 0.2, y: 0.1 },
  },
  {
    id: 'demo-2',
    name: '고양이',
    type: '고양이',
    imageUrl: '/animals/cheese-cat.jpg',
    location: '연남동',
    capturedAt: new Date().toISOString(),
    likes: 0,
    position: { x: 60, y: 35 },
    velocity: { x: -0.15, y: 0.2 },
  },
  {
    id: 'demo-3',
    name: '오리',
    type: '오리',
    imageUrl: '/animals/duck.jpg',
    location: '한강공원',
    capturedAt: new Date().toISOString(),
    likes: 0,
    position: { x: 45, y: 55 },
    velocity: { x: 0.1, y: -0.1 },
  },
  {
    id: 'demo-4',
    name: '토끼',
    type: '토끼',
    imageUrl: '/animals/rabbit.jpg',
    location: '뚝섬',
    capturedAt: new Date().toISOString(),
    likes: 0,
    position: { x: 70, y: 50 },
    velocity: { x: -0.2, y: 0.15 },
  },
  {
    id: 'demo-5',
    name: '멍멍이',
    type: '강아지',
    imageUrl: '/animals/puppy.jpg',
    location: '성수동',
    capturedAt: new Date().toISOString(),
    likes: 0,
    position: { x: 35, y: 65 },
    velocity: { x: 0.15, y: -0.2 },
  },
]

interface AnimatedAnimal extends Animal {
  currentX: number
  currentY: number
  targetX: number
  targetY: number
  isMoving: boolean
  direction: 'left' | 'right'
}

export function FarmTab() {
  const { animals: storeAnimals, coins, level, exp, maxExp } = useStore()
  const [animatedAnimals, setAnimatedAnimals] = useState<AnimatedAnimal[]>([])
  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)

  // Use demo animals if store is empty
  const animals = storeAnimals.length > 0 ? storeAnimals : DEMO_ANIMALS

  // Initialize animated animals
  useEffect(() => {
    setAnimatedAnimals(
      animals.map((animal) => ({
        ...animal,
        currentX: animal.position.x,
        currentY: animal.position.y,
        targetX: animal.position.x,
        targetY: animal.position.y,
        isMoving: false,
        direction: 'right' as const,
      }))
    )
  }, [animals])

  // Animation loop
  useEffect(() => {
    const animate = (time: number) => {
      if (time - lastTimeRef.current > 50) {
        lastTimeRef.current = time

        setAnimatedAnimals((prev) =>
          prev.map((animal) => {
            // Randomly decide to move
            if (!animal.isMoving && Math.random() < 0.01) {
              const newTargetX = Math.max(10, Math.min(85, animal.currentX + (Math.random() - 0.5) * 20))
              const newTargetY = Math.max(25, Math.min(70, animal.currentY + (Math.random() - 0.5) * 15))
              return {
                ...animal,
                targetX: newTargetX,
                targetY: newTargetY,
                isMoving: true,
                direction: newTargetX > animal.currentX ? 'right' : 'left',
              }
            }

            // Move towards target
            if (animal.isMoving) {
              const dx = animal.targetX - animal.currentX
              const dy = animal.targetY - animal.currentY
              const distance = Math.sqrt(dx * dx + dy * dy)

              if (distance < 0.5) {
                return { ...animal, isMoving: false }
              }

              const speed = 0.3
              const vx = (dx / distance) * speed
              const vy = (dy / distance) * speed

              return {
                ...animal,
                currentX: animal.currentX + vx,
                currentY: animal.currentY + vy,
              }
            }

            return animal
          })
        )
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const expProgress = (exp / maxExp) * 100

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-40 px-4 pt-14 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground drop-shadow-sm">내 농장</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1.5">
              <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                <span className="text-[10px] font-bold text-accent-foreground">C</span>
              </div>
              <span className="font-semibold text-foreground">{coins.toLocaleString()}</span>
            </div>
            <button className="p-2 rounded-full bg-card/90 backdrop-blur-sm hover:bg-card transition-colors">
              <Settings className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Level Progress */}
        <div className="mt-3 bg-card/90 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">농장 레벨 {level}</span>
            <span className="text-xs text-muted-foreground">다음 레벨까지 {maxExp - exp}EXP</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${expProgress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Farm Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Farm Background */}
        <div className="absolute inset-0">
          <Image
            src="/farm-background.jpg"
            alt="Farm background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Animated Animals */}
        {animatedAnimals.map((animal) => (
          <div
            key={animal.id}
            className="absolute transition-transform duration-100"
            style={{
              left: `${animal.currentX}%`,
              top: `${animal.currentY}%`,
              transform: `translate(-50%, -50%) scaleX(${animal.direction === 'left' ? -1 : 1})`,
            }}
          >
            <div
              className={`relative w-16 h-16 rounded-full overflow-hidden border-3 border-white shadow-lg ${animal.isMoving ? 'animate-bounce' : ''
                }`}
              style={{
                animationDuration: '0.5s',
                animationIterationCount: animal.isMoving ? 'infinite' : '0',
              }}
            >
              <Image
                src={animal.imageUrl}
                alt={animal.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        ))}

        {/* Side Buttons */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3">
          <button className="flex flex-col items-center gap-1 p-3 bg-card/90 backdrop-blur-sm rounded-xl hover:bg-card transition-colors">
            <Sofa className="w-6 h-6 text-foreground" />
            <span className="text-xs text-foreground">꾸미기</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-3 bg-card/90 backdrop-blur-sm rounded-xl hover:bg-card transition-colors">
            <Store className="w-6 h-6 text-foreground" />
            <span className="text-xs text-foreground">상점</span>
          </button>
        </div>
      </div>

      {/* Animal List */}
      <div className="bg-card border-t border-border px-4 pt-3 pb-36">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">내 친구들</span>
            <span className="text-muted-foreground">{animatedAnimals.length}/20</span>
          </div>
          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            모아둔 동물 <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontal Animal List */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {animatedAnimals.map((animal) => (
            <div
              key={animal.id}
              className="flex flex-col items-center flex-shrink-0"
            >
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-muted mb-1 ring-2 ring-border">
                <Image
                  src={animal.imageUrl}
                  alt={animal.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs font-medium text-foreground max-w-16 truncate">
                {animal.name}
              </span>
            </div>
          ))}

          {/* Add Button */}
          <button className="flex flex-col items-center flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-1 border-2 border-dashed border-border hover:border-primary transition-colors">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">추가</span>
          </button>
        </div>
      </div>
    </div>
  )
}
