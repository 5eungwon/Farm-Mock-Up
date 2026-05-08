'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Animal, FarmState } from './types'

interface StoreState extends FarmState {
  addAnimal: (animal: Omit<Animal, 'id' | 'position' | 'velocity'>) => void
  removeAnimal: (id: string) => void
  updateAnimalPosition: (id: string, x: number, y: number) => void
  addCoins: (amount: number) => void
  addExp: (amount: number) => void
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      animals: [],
      coins: 1240,
      level: 7,
      exp: 130,
      maxExp: 360,

      addAnimal: (animalData) =>
        set((state) => ({
          animals: [
            ...state.animals,
            {
              ...animalData,
              id: crypto.randomUUID(),
              position: {
                x: Math.random() * 60 + 20,
                y: Math.random() * 40 + 30,
              },
              velocity: {
                x: (Math.random() - 0.5) * 0.3,
                y: (Math.random() - 0.5) * 0.3,
              },
            },
          ],
          exp: state.exp + 50,
          coins: state.coins + 100,
        })),

      removeAnimal: (id) =>
        set((state) => ({
          animals: state.animals.filter((a) => a.id !== id),
        })),

      updateAnimalPosition: (id, x, y) =>
        set((state) => ({
          animals: state.animals.map((a) =>
            a.id === id ? { ...a, position: { x, y } } : a
          ),
        })),

      addCoins: (amount) =>
        set((state) => ({ coins: state.coins + amount })),

      addExp: (amount) =>
        set((state) => {
          const newExp = state.exp + amount
          if (newExp >= state.maxExp) {
            return {
              exp: newExp - state.maxExp,
              level: state.level + 1,
              maxExp: Math.floor(state.maxExp * 1.2),
            }
          }
          return { exp: newExp }
        }),
    }),
    {
      name: 'animal-farm-storage',
    }
  )
)
