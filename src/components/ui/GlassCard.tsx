'use client';

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Blur intensity options for glass effect
 */
type BlurIntensity = 'light' | 'medium' | 'heavy';

/**
 * Hover effect options
 */
type HoverEffect = 'lift' | 'glow' | 'scale' | 'none';

/**
 * Props for GlassCard component
 */
interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Content to render inside the card */
  children: ReactNode;
  /** Blur intensity level */
  blur?: BlurIntensity;
  /** Background opacity (0-100) */
  opacity?: number;
  /** Hover effect type */
  hoverEffect?: HoverEffect;
  /** Whether the card has a border */
  bordered?: boolean;
  /** Border radius size */
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  /** Whether to show inner shadow for depth */
  innerShadow?: boolean;
  /** Whether the card is interactive (clickable) */
  interactive?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * Blur intensity class mapping
 */
const blurClasses: Record<BlurIntensity, string> = {
  light: 'backdrop-blur-md',
  medium: 'backdrop-blur-lg',
  heavy: 'backdrop-blur-xl',
};

/**
 * Hover effect class mapping
 */
const hoverClasses: Record<HoverEffect, string> = {
  lift: 'hover:-translate-y-1 hover:shadow-glass-lg',
  glow: 'hover:shadow-glow',
  scale: 'hover:scale-[1.01]',
  none: '',
};

/**
 * Border radius class mapping
 */
const roundedClasses: Record<string, string> = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
  '2xl': 'rounded-[2rem]',
  full: 'rounded-full',
};

/**
 * GlassCard Component
 * 
 * A beautiful warm-tinted glassmorphism card with customizable blur, opacity, and effects.
 */
export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      blur = 'medium',
      opacity = 65,
      hoverEffect = 'lift',
      bordered = true,
      rounded = 'xl',
      innerShadow = true,
      interactive = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'relative overflow-hidden',
          // Background - uses CSS variable that changes in dark mode
          'bg-[var(--glass-bg)]',
          // Blur
          blurClasses[blur],
          // Border radius
          roundedClasses[rounded],
          // Hover effect
          'transition-all duration-300 ease-out',
          hoverClasses[hoverEffect],
          // Border - warm tint (adapts to dark mode)
          bordered && 'border border-blush-200/30 dark:border-blush-400/20',
          // Shadow
          'shadow-glass dark:shadow-lg dark:shadow-black/20',
          // Inner shadow for depth
          innerShadow && 'shadow-glass-inner',
          // Interactive cursor
          interactive && 'cursor-pointer',
          // Prevent overflow
          'max-w-full',
          className
        )}
        {...props}
      >
        {/* Warm gradient overlay for extra depth - dimmed in dark mode */}
        <div 
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-50 dark:opacity-10"
          style={{
            background: 'linear-gradient(135deg, rgba(255,250,248,0.2) 0%, transparent 50%, rgba(255,230,220,0.1) 100%)',
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 max-w-full overflow-hidden">
          {children}
        </div>
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export default GlassCard;
