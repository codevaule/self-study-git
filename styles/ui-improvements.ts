// UI 개선 스타일 가이드
// 이 파일은 프로젝트 전체에서 사용할 UI 스타일 상수와 유틸리티를 정의합니다.

import { cva } from "class-variance-authority"

// 그라데이션 배경 스타일
export const gradientBackgrounds = {
  primary: "bg-gradient-to-r from-blue-600 to-indigo-600",
  secondary: "bg-gradient-to-r from-purple-600 to-pink-600",
  success: "bg-gradient-to-r from-green-500 to-emerald-500",
  warning: "bg-gradient-to-r from-yellow-400 to-amber-500",
  info: "bg-gradient-to-r from-sky-400 to-blue-500",
  dark: "bg-gradient-to-r from-gray-700 to-gray-900",
  // 추가 그라데이션
  sunrise: "bg-gradient-to-r from-red-400 via-yellow-400 to-orange-500",
  sunset: "bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600",
  ocean: "bg-gradient-to-r from-cyan-400 to-blue-500",
  forest: "bg-gradient-to-r from-green-400 to-emerald-600",
  pastel: "bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400",
}

// 글래스 모피즘 효과
export const glassMorphism =
  "backdrop-blur-md bg-white/30 dark:bg-gray-900/30 border border-white/20 dark:border-gray-800/20"
export const strongGlassMorphism =
  "backdrop-blur-lg bg-white/40 dark:bg-gray-900/40 border border-white/30 dark:border-gray-800/30"
// 신규 유리 효과 추가
export const subtleGlassMorphism = 
  "backdrop-blur-sm bg-white/20 dark:bg-gray-900/20 border border-white/10 dark:border-gray-800/10"
export const coloredGlassMorphism = 
  "backdrop-blur-md bg-blue-50/30 dark:bg-blue-900/20 border border-blue-100/30 dark:border-blue-800/20"

// 그림자 효과
export const shadows = {
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  premium: "shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
  glow: "shadow-[0_0_15px_rgba(59,130,246,0.5)]",
  inner: "shadow-inner",
  // 신규 그림자 효과
  soft: "shadow-[0_5px_15px_rgba(0,0,0,0.05)]",
  floating: "shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]",
  coloredGlow: "shadow-[0_0_20px_rgba(79,70,229,0.4)]",
  sharpEdge: "shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]",
}

// 애니메이션 효과
export const animations = {
  fadeIn: "animate-fadeIn",
  slideUp: "animate-slideUp",
  pulse: "animate-pulse",
  bounce: "animate-bounce",
  spin: "animate-spin",
  wiggle: "animate-wiggle",
  // 신규 애니메이션
  breathe: "animate-breathe",
  float: "animate-float",
  shimmer: "animate-shimmer",
  slideInLeft: "animate-slideInLeft",
  slideInRight: "animate-slideInRight",
}

// 카드 스타일 변형
export const cardVariants = cva("rounded-lg overflow-hidden transition-all duration-300", {
  variants: {
    variant: {
      default: "bg-card text-card-foreground",
      glass: `${glassMorphism}`,
      outline: "bg-transparent border border-border",
      premium:
        "bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700",
      // 신규 카드 스타일
      subtle: "bg-gray-50 dark:bg-gray-800/50 text-card-foreground",
      colored: "bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-100",
      organic: "bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700",
      frosted: `${strongGlassMorphism} rounded-2xl`,
    },
    shadow: {
      none: "",
      sm: shadows.sm,
      md: shadows.md,
      lg: shadows.lg,
      xl: shadows.xl,
      premium: shadows.premium,
      glow: shadows.glow,
      // 신규 그림자 옵션
      soft: shadows.soft,
      floating: shadows.floating,
      coloredGlow: shadows.coloredGlow,
      sharpEdge: shadows.sharpEdge,
    },
    hover: {
      none: "",
      raise: "hover:-translate-y-1 hover:shadow-lg",
      glow: "hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]",
      scale: "hover:scale-[1.02]",
      // 신규 호버 효과
      rotate: "hover:rotate-1 hover:shadow-md",
      bounce: "transition-transform hover:translate-y-[-4px] hover:shadow-md active:translate-y-[0px]",
      shimmer: "hover:before:absolute hover:before:inset-0 hover:before:bg-gradient-to-r hover:before:from-transparent hover:before:via-white/20 hover:before:to-transparent hover:before:animate-shimmer",
      border: "hover:border-primary/50 hover:border-2",
    },
    // 신규 라운드 옵션 추가
    rounded: {
      default: "rounded-lg",
      none: "rounded-none",
      sm: "rounded",
      md: "rounded-lg",
      lg: "rounded-xl",
      xl: "rounded-2xl",
      full: "rounded-3xl",
    },
  },
  defaultVariants: {
    variant: "default",
    shadow: "md",
    hover: "none",
    rounded: "default",
  },
})

// 버튼 스타일 변형 (기존 shadcn/ui 버튼 확장)
export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // 기존 shadcn 변형
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-primary bg-background text-primary hover:bg-primary/10 font-medium",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",

        // 새로운 변형
        gradient: "text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
        glass: `${glassMorphism} text-foreground font-medium hover:bg-white/40 dark:hover:bg-gray-900/40`,
        premium: "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600",
        soft: "bg-primary/10 text-primary hover:bg-primary/20",
        
        // 신규 버튼 스타일
        vibrant: "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white",
        outline3d: "border-2 border-gray-900 dark:border-gray-100 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.7)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.7)]",
        minimal: "bg-background text-foreground border border-border hover:bg-accent/50",
        pill: "rounded-full bg-primary text-primary-foreground hover:bg-primary/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        // 신규 사이즈
        xs: "h-7 text-xs rounded px-2 py-1",
        xl: "h-14 rounded-lg px-10 py-4 text-base",
        pill: "h-10 px-6 rounded-full",
        wide: "h-10 px-8 py-2",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        // 신규 애니메이션
        shimmer: "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
        wiggle: "hover:animate-wiggle",
        spin: "hover:animate-spin",
      },
      shadow: {
        none: "",
        sm: shadows.sm,
        md: shadows.md,
        lg: shadows.lg,
        // 신규 그림자
        soft: shadows.soft,
        glow: shadows.glow,
        sharpEdge: shadows.sharpEdge,
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
      shadow: "none",
    },
  },
)

// 입력 필드 스타일 변형
export const inputVariants = cva(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        outline: "border-2",
        ghost: "border-none bg-transparent focus-visible:bg-accent/20",
        underlined:
          "border-t-0 border-l-0 border-r-0 rounded-none px-1 focus-visible:ring-0 focus-visible:border-primary",
        glass: `${glassMorphism} border-none focus-visible:bg-white/50 dark:focus-visible:bg-gray-900/50`,
        // 신규 입력 필드 스타일
        filled: "bg-muted/50 border-transparent focus-visible:bg-background",
        pill: "rounded-full px-4",
        material: "border-b-2 border-t-0 border-x-0 rounded-none px-1 bg-transparent focus-visible:ring-0",
        minimal: "border-dashed focus-visible:border-solid focus-visible:border-primary",
      },
      state: {
        default: "",
        error: "border-destructive focus-visible:ring-destructive",
        success: "border-green-500 focus-visible:ring-green-500",
        warning: "border-yellow-500 focus-visible:ring-yellow-500",
        info: "border-blue-500 focus-visible:ring-blue-500",
      },
      // 신규 크기 옵션
      size: {
        default: "h-10 text-sm",
        sm: "h-8 text-xs px-2.5",
        lg: "h-12 text-base px-4",
        xl: "h-14 text-lg px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      state: "default",
      size: "default",
    },
  },
)

// 타이포그래피 스타일
export const typography = {
  h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
  h2: "scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0",
  h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  h4: "scroll-m-20 text-xl font-semibold tracking-tight",
  p: "leading-7 [&:not(:first-child)]:mt-6",
  blockquote: "mt-6 border-l-2 border-primary pl-6 italic",
  list: "my-6 ml-6 list-disc [&>li]:mt-2",
  lead: "text-xl text-muted-foreground",
  large: "text-lg font-semibold",
  small: "text-sm font-medium leading-none",
  muted: "text-sm text-muted-foreground",
  gradient: "bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600",
  // 신규 텍스트 스타일
  display: "text-5xl font-bold tracking-tight lg:text-7xl",
  handwriting: "font-serif italic",
  mono: "font-mono text-sm",
  overline: "text-xs uppercase tracking-widest",
  strike: "line-through",
  highlight: "bg-yellow-100 dark:bg-yellow-800/30 px-1 rounded",
  subtle: "text-muted-foreground italic",
}

// 레이아웃 유틸리티
export const layouts = {
  section: "py-12 md:py-16 lg:py-20",
  container: "container mx-auto px-4 md:px-6",
  grid: "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3",
  flexBetween: "flex items-center justify-between",
  flexCenter: "flex items-center justify-center",
  flexStart: "flex items-center justify-start",
  flexEnd: "flex items-center justify-end",
  flexCol: "flex flex-col",
  flexColCenter: "flex flex-col items-center justify-center",
  // 신규 레이아웃
  autoGrid: "grid grid-cols-auto-fill gap-6",
  masonry: "columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6",
  stack: "grid place-items-center",
  sidebar: "grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6",
  dashboardGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
}

// 반응형 유틸리티
export const responsive = {
  hideOnMobile: "hidden md:block",
  hideOnDesktop: "md:hidden",
  showOnMobile: "block md:hidden",
  showOnDesktop: "hidden md:block",
  // 신규 반응형 유틸리티
  hideOnTablet: "hidden sm:block lg:block",
  showOnTablet: "hidden sm:block lg:hidden",
  onlyMobile: "block sm:hidden",
  onlyTablet: "hidden sm:block lg:hidden",
  onlyDesktop: "hidden lg:block",
}

// 간격 유틸리티
export const spacing = {
  section: "py-12 md:py-16 lg:py-20",
  sectionSm: "py-8 md:py-12",
  sectionLg: "py-16 md:py-24 lg:py-32",
  gapSm: "gap-2",
  gapMd: "gap-4",
  gapLg: "gap-6",
  gapXl: "gap-8",
  // 신규 간격
  gapXxl: "gap-12",
  stack: "space-y-4",
  stackSm: "space-y-2",
  stackMd: "space-y-6",
  stackLg: "space-y-8",
  inlineSm: "space-x-2",
  inlineMd: "space-x-4",
  inlineLg: "space-x-6",
}

// 신규: 색상 유틸리티
export const colorUtils = {
  brand: "text-primary",
  brandSubtle: "text-primary/70",
  success: "text-green-600 dark:text-green-400",
  error: "text-red-600 dark:text-red-400",
  warning: "text-yellow-600 dark:text-yellow-400",
  info: "text-blue-600 dark:text-blue-400",
  muted: "text-muted-foreground",
  bgBrand: "bg-primary",
  bgSuccess: "bg-green-100 dark:bg-green-900/30",
  bgError: "bg-red-100 dark:bg-red-900/30",
  bgWarning: "bg-yellow-100 dark:bg-yellow-900/30",
  bgInfo: "bg-blue-100 dark:bg-blue-900/30",
  bgMuted: "bg-muted",
}

// 신규: 토스트/알림 스타일
export const toastStyles = {
  base: "rounded-lg p-4 shadow-md",
  success: "bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-100",
  error: "bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-100",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-100",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-100",
  neutral: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
}

// 신규: 인터랙션 효과
export const interactionEffects = {
  pressDown: "active:translate-y-0.5",
  scaleOnHover: "hover:scale-105 transition-transform",
  fadeOnHover: "opacity-80 hover:opacity-100 transition-opacity",
  glowOnHover: "hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-shadow",
  popIn: "animate-popIn",
  reveal: "opacity-0 animate-reveal",
}

