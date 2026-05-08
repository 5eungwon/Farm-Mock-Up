# 동물농장 (Animal Farm) — Claude Code 가이드

## 프로젝트 개요

모바일 전용 Next.js 앱. 동물을 발견·수집해 나만의 농장을 꾸미는 소셜 앱 목업.

- **스택**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Zustand
- **배포**: Vercel (`@vercel/analytics` 내장)

---

## UI 아키텍처 — 반드시 숙지

### 앱 컨테이너 구조

`app/page.tsx`가 두 개의 뷰를 동시에 렌더링한다:

| 환경 | 클래스 | 크기 |
|------|--------|------|
| 모바일 (`< md`) | `w-full h-dvh overflow-hidden` | 기기 전체 화면 |
| 데스크톱 (`≥ md`) | `max-w-[430px] h-[932px] overflow-hidden` | iPhone 14 Pro Max 프레임 |

**탭 컴포넌트는 항상 이 컨테이너 안에서 렌더링된다.** 컨테이너 바깥으로 넘치는 UI는 잘린다.

---

## UI 규칙 — Claude가 반드시 따라야 할 사항

### 1. 탭 컴포넌트 루트 레이아웃

```tsx
// ✅ 올바른 패턴
export function SomeTab() {
  return (
    <div className="flex flex-col h-full">
      {/* sticky 헤더 */}
      <header className="sticky top-0 z-40 ...">...</header>
      {/* 스크롤 영역 */}
      <main className="flex-1 overflow-y-auto scrollbar-hide pb-24">...</main>
    </div>
  )
}

// ❌ 금지 — 컨테이너 밖으로 넘침
export function SomeTab() {
  return <div className="min-h-screen">...</div>
}
```

### 2. 절대 사용 금지 (탭 컴포넌트 내부)

| 금지 클래스 | 대체 |
|------------|------|
| `min-h-screen`, `h-screen` | `h-full` |
| `100vh`, `100dvh` (인라인) | `h-full` |
| 고정 픽셀 높이 (`h-[600px]`) | `flex-1` 또는 `%` |
| `fixed` positioning | `absolute` (컨테이너 기준) |

### 3. 하단 네비게이션 여백

- BottomNavigation 높이: **약 80px** (`pt-2 pb-8` + 아이콘)
- 스크롤 콘텐츠 최하단에 반드시 `pb-24`(96px) 이상 추가
- 농장탭처럼 absolute 배치된 콘텐츠는 `pb-36` 사용

```tsx
// ✅ 스크롤 탭
<div className="flex flex-col h-full overflow-y-auto scrollbar-hide pb-24">

// ✅ 고정 레이아웃 탭 (농장처럼 배경 이미지 있을 때)
<div className="bg-card border-t px-4 pt-3 pb-36">
```

### 4. 헤더 / 상태바 여백

- 모바일: 기기 상태바 자동 처리 (`viewportFit: 'cover'`)
- 데스크톱 프레임: 상단 Dynamic Island 영역 `pt-11` 처리됨
- 탭 헤더는 `pt-14`로 상태바 아래에 배치

```tsx
<header className="sticky top-0 z-40 px-4 pt-14 pb-3 bg-background/95 backdrop-blur-sm">
```

### 5. 이미지

항상 Next.js `<Image>`를 사용하고, `fill` 모드일 때 부모에 명시적 크기 필요:

```tsx
// ✅
<div className="relative w-16 h-16 rounded-xl overflow-hidden">
  <Image src={url} alt={alt} fill className="object-cover" />
</div>

// ✅ aspect-ratio 활용
<div className="relative w-full aspect-square rounded-2xl overflow-hidden">
  <Image src={url} alt={alt} fill className="object-cover" />
</div>

// ❌ 금지
<img src={url} alt={alt} />
```

### 6. 텍스트 오버플로우

좁은 컨테이너에서 텍스트는 반드시 말줄임 처리:

```tsx
// 한 줄
<span className="truncate max-w-16">긴 텍스트</span>

// 여러 줄
<p className="line-clamp-2">긴 텍스트</p>
```

### 7. 수평 스크롤 리스트

```tsx
<div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
  {items.map(item => (
    <div key={item.id} className="flex-shrink-0 w-32">...</div>
  ))}
</div>
```

`flex-shrink-0` 없으면 아이템이 찌그러짐.

### 8. 그리드

좁은 컨테이너(430px) 기준으로 설계. `grid-cols-4` 이상은 아이템이 너무 작아짐:

| 컬럼 수 | 적합한 상황 |
|---------|-----------|
| `grid-cols-2` | 카드형 콘텐츠 |
| `grid-cols-3` | 이미지 갤러리 |
| `grid-cols-4` | 소형 아이콘 목록 (최대) |

### 9. 반응형 클래스

이 앱은 **모바일 전용**이지만 데스크톱에서 폰 프레임으로 표시됨.
탭 컴포넌트 내부에서 `md:`, `lg:` 반응형 prefix는 **사용하지 않는다** — 항상 430px 이하 기준으로 설계.

`md:`, `lg:` prefix는 `app/page.tsx`의 컨테이너 전환에만 사용.

### 10. z-index 레이어

| 레이어 | z-index | 용도 |
|--------|---------|------|
| 배경 | z-0 | 배경 이미지 |
| 콘텐츠 | z-10 | 일반 콘텐츠 |
| 헤더 | z-40 | sticky 헤더 |
| 바텀 네비 | z-50 | BottomNavigation |
| 모달/오버레이 | z-[100]+ | 다이얼로그 등 |

---

## 컴포넌트 패턴

### 카드

```tsx
<div className="p-3 bg-card rounded-2xl border border-border">
```

### 필 버튼 (필터)

```tsx
<button className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
  isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
}`}>
```

### 유리 효과 (배경 위 UI)

```tsx
<div className="bg-card/90 backdrop-blur-sm rounded-xl px-3 py-1.5">
```

---

## 상태 관리

Zustand store (`lib/store.ts`):
- `animals`: 수집한 동물 목록
- `coins`, `level`, `exp`, `maxExp`: 농장 상태

새 전역 상태는 `lib/store.ts`에 추가.

---

## 배포

Vercel로 배포. `@vercel/analytics`는 production에서만 활성화됨 (`process.env.NODE_ENV === 'production'`).

```bash
# Vercel CLI로 배포
npx vercel

# 프로덕션 배포
npx vercel --prod
```

또는 GitHub에 push 후 vercel.com에서 연결.
