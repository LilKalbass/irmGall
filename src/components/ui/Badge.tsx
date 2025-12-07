'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

/**
 * Badge variant options
 */
type BadgeVariant = 'default' | 'rose' | 'lavender' | 'mint' | 'peach' | 'sky' | 'success' | 'warning' | 'danger';

/**
 * Badge size options
 */
type BadgeSize = 'sm' | 'md' | 'lg';

/**
 * Props for Badge component
 */
interface BadgeProps {
  /** Badge content */
  children: ReactNode;
  /** Color variant */
  variant?: BadgeVariant;
  /** Size */
  size?: BadgeSize;
  /** Whether badge is outlined */
  outlined?: boolean;
  /** Whether badge is pill-shaped */
  pill?: boolean;
  /** Icon on the left */
  icon?: ReactNode;
  /** Additional className */
  className?: string;
}

/**
 * Variant styles
 */
const variantStyles: Record<BadgeVariant, { solid: string; outline: string }> = {
  default: {
    solid: 'bg-gray-100 text-gray-700',
    outline: 'border-gray-300 text-gray-700',
  },
  rose: {
    solid: 'bg-rose-100 text-rose-700',
    outline: 'border-rose-300 text-rose-700',
  },
  lavender: {
    solid: 'bg-purple-100 text-purple-700',
    outline: 'border-purple-300 text-purple-700',
  },
  mint: {
    solid: 'bg-emerald-100 text-emerald-700',
    outline: 'border-emerald-300 text-emerald-700',
  },
  peach: {
    solid: 'bg-orange-100 text-orange-700',
    outline: 'border-orange-300 text-orange-700',
  },
  sky: {
    solid: 'bg-sky-100 text-sky-700',
    outline: 'border-sky-300 text-sky-700',
  },
  success: {
    solid: 'bg-emerald-100 text-emerald-700',
    outline: 'border-emerald-300 text-emerald-700',
  },
  warning: {
    solid: 'bg-amber-100 text-amber-700',
    outline: 'border-amber-300 text-amber-700',
  },
  danger: {
    solid: 'bg-red-100 text-red-700',
    outline: 'border-red-300 text-red-700',
  },
};

/**
 * Size styles
 */
const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

/**
 * Badge Component
 * 
 * A cute badge component for displaying status, counts, or labels.
 * 
 * @example
 * ```tsx
 * <Badge variant="rose" pill>New</Badge>
 * <Badge variant="mint" icon={<Check size={12} />}>Verified</Badge>
 * ```
 */
export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  outlined = false,
  pill = false,
  icon,
  className,
}: BadgeProps) {
  const styles = variantStyles[variant];
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium',
        sizeStyles[size],
        pill ? 'rounded-full' : 'rounded-md',
        outlined ? `bg-transparent border ${styles.outline}` : styles.solid,
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

/**
 * Notification Badge (small dot or count)
 */
interface NotificationBadgeProps {
  /** Count to display (if > 0) */
  count?: number;
  /** Maximum count to display (shows "99+" if exceeded) */
  max?: number;
  /** Show as dot only */
  dot?: boolean;
  /** Children to wrap */
  children: ReactNode;
  /** Additional className */
  className?: string;
}

export function NotificationBadge({
  count = 0,
  max = 99,
  dot = false,
  children,
  className,
}: NotificationBadgeProps) {
  const displayCount = count > max ? `${max}+` : count;
  const showBadge = dot || count > 0;
  
  return (
    <div className={cn('relative inline-block', className)}>
      {children}
      
      {showBadge && (
        <span
          className={cn(
            'absolute -top-1 -right-1',
            'bg-rose-500 text-white',
            'flex items-center justify-center',
            'font-medium',
            dot
              ? 'w-2.5 h-2.5 rounded-full'
              : 'min-w-[18px] h-[18px] px-1 rounded-full text-xs'
          )}
        >
          {!dot && displayCount}
        </span>
      )}
    </div>
  );
}

export default Badge;

