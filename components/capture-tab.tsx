'use client'

import { useState, useRef, useCallback } from 'react'
import { X, HelpCircle, ImageIcon, Zap, Camera, MapPin, Pencil } from 'lucide-react'
import { useStore } from '@/lib/store'
import Image from 'next/image'

type CaptureState = 'ready' | 'preview' | 'processing' | 'naming'

interface CapturedAnimal {
  originalImage: string
  processedImage: string
  detectedType: string
}

export function CaptureTab() {
  const [state, setState] = useState<CaptureState>('ready')
  const [flashOn, setFlashOn] = useState(false)
  const [capturedAnimal, setCapturedAnimal] = useState<CapturedAnimal | null>(null)
  const [animalName, setAnimalName] = useState('')
  const [location] = useState('서울 성동구 성수동')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const addAnimal = useStore((s) => s.addAnimal)

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const imageUrl = URL.createObjectURL(file)
    setState('processing')

    // Simulate background removal processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For demo: use same image as "processed" (in real app, this would be the removed background version)
    setCapturedAnimal({
      originalImage: imageUrl,
      processedImage: imageUrl,
      detectedType: detectAnimalType(),
    })
    setState('preview')
  }, [])

  const detectAnimalType = () => {
    const types = ['고양이', '강아지', '토끼', '오리', '새']
    return types[Math.floor(Math.random() * types.length)]
  }

  const handleCapture = () => {
    fileInputRef.current?.click()
  }

  const handleConfirm = () => {
    setState('naming')
    setAnimalName(capturedAnimal?.detectedType || '')
  }

  const handleSaveAnimal = () => {
    if (!capturedAnimal || !animalName.trim()) return

    addAnimal({
      name: animalName.trim(),
      type: capturedAnimal.detectedType,
      imageUrl: capturedAnimal.processedImage,
      location,
      capturedAt: new Date().toISOString(),
      likes: 0,
    })

    // Reset state
    setState('ready')
    setCapturedAnimal(null)
    setAnimalName('')
  }

  const handleCancel = () => {
    setState('ready')
    setCapturedAnimal(null)
    setAnimalName('')
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#e8e4d9]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-14 pb-4">
        <button onClick={handleCancel} className="p-2 rounded-full hover:bg-black/10">
          <X className="w-6 h-6 text-foreground" />
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-card/80 text-sm">
          <HelpCircle className="w-4 h-4" />
          가이드
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4">
        {state === 'processing' && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-lg font-medium text-foreground">동물을 인식하고 있어요...</p>
          </div>
        )}

        {state === 'ready' && (
          <>
            {/* Guide Message */}
            <div className="bg-[#d4cfc0] rounded-2xl px-6 py-4 mb-8 text-center">
              <p className="text-foreground font-medium">동물이 화면 안에 들어오게 해주세요!</p>
              <p className="text-muted-foreground text-sm">자동으로 인식할게요</p>
            </div>

            {/* Camera Preview Area */}
            <div className="relative w-full max-w-sm aspect-square bg-[#c5bfae] rounded-3xl overflow-hidden flex items-center justify-center">
              {/* Viewfinder corners */}
              <div className="absolute top-8 left-8 w-12 h-12 border-l-4 border-t-4 border-white/60 rounded-tl-2xl" />
              <div className="absolute top-8 right-8 w-12 h-12 border-r-4 border-t-4 border-white/60 rounded-tr-2xl" />
              <div className="absolute bottom-8 left-8 w-12 h-12 border-l-4 border-b-4 border-white/60 rounded-bl-2xl" />
              <div className="absolute bottom-8 right-8 w-12 h-12 border-r-4 border-b-4 border-white/60 rounded-br-2xl" />

              <div className="text-center text-muted-foreground">
                <Camera className="w-16 h-16 mx-auto mb-2 opacity-50" />
                <p className="text-sm">사진을 선택하거나 촬영하세요</p>
              </div>
            </div>
          </>
        )}

        {(state === 'preview' || state === 'naming') && capturedAnimal && (
          <>
            {/* Preview Image */}
            <div className="relative w-full max-w-sm aspect-square bg-[#c5bfae] rounded-3xl overflow-hidden mb-4">
              <Image
                src={capturedAnimal.processedImage}
                alt="Captured animal"
                fill
                className="object-cover"
              />
              {/* Simulated "cutout" effect overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-8 left-8 w-12 h-12 border-l-4 border-t-4 border-primary/60 rounded-tl-2xl" />
                <div className="absolute top-8 right-8 w-12 h-12 border-r-4 border-t-4 border-primary/60 rounded-tr-2xl" />
                <div className="absolute bottom-8 left-8 w-12 h-12 border-l-4 border-b-4 border-primary/60 rounded-bl-2xl" />
                <div className="absolute bottom-8 right-8 w-12 h-12 border-r-4 border-b-4 border-primary/60 rounded-br-2xl" />
              </div>
            </div>

            {/* Animal Info */}
            <div className="w-full max-w-sm bg-card rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted">
                  <Image
                    src={capturedAnimal.processedImage}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  {state === 'naming' ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={animalName}
                        onChange={(e) => setAnimalName(e.target.value)}
                        placeholder="이름을 지어주세요"
                        className="flex-1 bg-muted rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        autoFocus
                      />
                      <Pencil className="w-5 h-5 text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{capturedAnimal.detectedType}</span>
                      <Pencil className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{location}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Bottom Controls */}
      <footer className="px-4 pb-32 pt-4">
        {state === 'ready' && (
          <div className="flex items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-4 rounded-2xl bg-card hover:bg-muted transition-colors"
              >
                <ImageIcon className="w-6 h-6 text-foreground" />
              </button>
              <span className="text-xs text-muted-foreground">앨범</span>
            </div>

            <button
              onClick={handleCapture}
              className="p-5 rounded-full bg-primary hover:bg-primary/90 transition-colors shadow-lg"
            >
              <Camera className="w-8 h-8 text-primary-foreground" />
            </button>

            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => setFlashOn(!flashOn)}
                className={`p-4 rounded-2xl transition-colors ${flashOn ? 'bg-accent text-accent-foreground' : 'bg-card hover:bg-muted text-foreground'
                  }`}
              >
                <Zap className="w-6 h-6" />
              </button>
              <span className="text-xs text-muted-foreground">플래시</span>
            </div>
          </div>
        )}

        {state === 'preview' && (
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 py-4 rounded-2xl bg-muted text-foreground font-medium hover:bg-muted/80 transition-colors"
            >
              다시 찍기
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-4 rounded-2xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              농장에 추가하기
            </button>
          </div>
        )}

        {state === 'naming' && (
          <button
            onClick={handleSaveAnimal}
            disabled={!animalName.trim()}
            className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            완료
          </button>
        )}
      </footer>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  )
}
