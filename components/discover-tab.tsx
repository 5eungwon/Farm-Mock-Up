'use client'

import { Bell, MapPin, Heart, ChevronRight, Flame } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

const FILTERS = ['추천', '인기', '최신', '근처', '팔로잉']

const POPULAR_ANIMALS = [
  { id: '1', name: '말티즈', location: '서울숲', likes: 1200, image: '/animals/maltese.jpg', type: '강아지' },
  { id: '2', name: '치즈냥', location: '연남동', likes: 986, image: '/animals/cheese-cat.jpg', type: '고양이' },
  { id: '3', name: '오리', location: '성수동 카페거리', likes: 864, image: '/animals/duck.jpg', type: '오리' },
  { id: '4', name: '토끼', location: '뚝섬 한강공원', likes: 752, image: '/animals/rabbit.jpg', type: '토끼' },
]

const NEARBY_ANIMALS = [
  { id: '5', name: '아기 고양이', location: '서울숲 공원 산책로', time: '5분 전', distance: '0.2km', image: '/animals/kitten.jpg' },
  { id: '6', name: '멍멍이', location: '성수동 골목', time: '15분 전', distance: '0.4km', image: '/animals/puppy.jpg' },
  { id: '7', name: '비둘기', location: '뚝섬 한강공원', time: '20분 전', distance: '0.6km', image: '/animals/pigeon.jpg' },
]

const RECOMMENDED_PLACES = [
  { id: '1', name: '서울숲', likes: 3100, image: '/places/seoul-forest.jpg' },
  { id: '2', name: '연남동 골목', likes: 2600, image: '/places/yeonnam.jpg' },
  { id: '3', name: '뚝섬 한강공원', likes: 2300, image: '/places/ttukseom.jpg' },
]

export function DiscoverTab() {
  const [activeFilter, setActiveFilter] = useState('추천')

  const formatLikes = (likes: number) => {
    if (likes >= 1000) {
      return `${(likes / 1000).toFixed(1)}k`
    }
    return likes.toString()
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 scrollbar-hide">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-40 px-4 pt-14 pb-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">발견</h1>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              <span>서울 성동구</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-full hover:bg-muted">
              <Bell className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 px-4 space-y-6">
        {/* Popular Animals */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              지금 인기있는 동물 <Flame className="w-5 h-5 text-orange-500" />
            </h2>
            <button className="text-sm text-muted-foreground flex items-center">
              더보기 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {POPULAR_ANIMALS.map((animal) => (
              <div key={animal.id} className="flex flex-col items-center">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-muted mb-2">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                  <div className="absolute top-1 left-1 flex items-center gap-0.5 bg-black/40 rounded-full px-1.5 py-0.5 z-20">
                    <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                    <span className="text-[10px] text-white font-medium">{formatLikes(animal.likes)}</span>
                  </div>
                  <Image
                    src={animal.image}
                    alt={animal.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-foreground">{animal.name}</span>
                <span className="text-xs text-muted-foreground">{animal.location}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Nearby Animals */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">근처에서 발견했어요</h2>
            <span className="text-xs text-muted-foreground">내 위치 기준 1km</span>
          </div>
          <div className="space-y-3">
            {NEARBY_ANIMALS.map((animal) => (
              <div key={animal.id} className="flex items-center gap-3 p-3 bg-card rounded-2xl">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={animal.image}
                    alt={animal.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground">{animal.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{animal.location}</p>
                  <p className="text-xs text-muted-foreground">{animal.time}</p>
                </div>
                <span className="text-sm text-primary font-medium">{animal.distance}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Places */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">오늘의 추천 장소</h2>
            <button className="text-sm text-muted-foreground flex items-center">
              더보기 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {RECOMMENDED_PLACES.map((place) => (
              <div key={place.id} className="flex-shrink-0 w-32">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-muted mb-2">
                  <Image
                    src={place.image}
                    alt={place.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{place.name}</span>
                  <div className="flex items-center gap-0.5">
                    <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                    <span className="text-xs text-muted-foreground">{formatLikes(place.likes)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
