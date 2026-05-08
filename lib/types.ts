export interface Animal {
  id: string
  name: string
  type: string
  imageUrl: string
  location: string
  capturedAt: string
  likes: number
  position: {
    x: number
    y: number
  }
  velocity: {
    x: number
    y: number
  }
}

export interface FarmState {
  animals: Animal[]
  coins: number
  level: number
  exp: number
  maxExp: number
}

export type TabType = 'discover' | 'capture' | 'farm'
