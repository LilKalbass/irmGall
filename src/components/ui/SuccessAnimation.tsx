'use client';

import { motion } from 'framer-motion';
import { Check, Heart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Variant styles for success animation
 */
type SuccessVariant = 'check' | 'heart' | 'sparkles';

/**
 * Size options
 */
type SuccessSize = 'sm' | 'md' | 'lg';

/**
 * Props for SuccessAnimation component
 */
interface SuccessAnimationProps {
  /** Whether to show the animation */
  show: boolean;
  /** Animation variant */
  variant?: SuccessVariant;
  /** Size of the animation */
  size?: SuccessSize;
  /** Message to display */
  message?: string;
  /** Additional className */
  className?: string;
}

/**
 * Size configurations
 */
const sizeConfig: Record<SuccessSize, { circle: number; icon: number; text: string }> = {
  sm: { circle: 48, icon: 20, text: 'text-sm' },
  md: { circle: 64, icon: 28, text: 'text-base' },
  lg: { circle: 80, icon: 36, text: 'text-lg' },
};

/**
 * Variant icons
 */
const variantIcons: Record<SuccessVariant, React.ComponentType<{ size: number; className?: string }>> = {
  check: Check,
  heart: Heart,
  sparkles: Sparkles,
};

/**
 * Variant colors
 */
const variantColors: Record<SuccessVariant, string> = {
  check: 'bg-emerald-100 text-emerald-500',
  heart: 'bg-rose-100 text-rose-500',
  sparkles: 'bg-amber-100 text-amber-500',
};

/**
 * SuccessAnimation Component
 * 
 * A beautiful success animation with various styles.
 * 
 * @example
 * ```tsx
 * <SuccessAnimation show={showSuccess} variant="heart" message="Saved!" />
 * ```
 */
export function SuccessAnimation({
  show,
  variant = 'check',
  size = 'md',
  message,
  className,
}: SuccessAnimationProps) {
  const config = sizeConfig[size];
  const Icon = variantIcons[variant];
  const colorClass = variantColors[variant];
  
  if (!show) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className={cn('flex flex-col items-center gap-3', className)}
    >
      {/* Animated circle with icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5, bounce: 0.5 }}
        className={cn(
          'rounded-full flex items-center justify-center',
          colorClass
        )}
        style={{
          width: config.circle,
          height: config.circle,
        }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', duration: 0.5 }}
        >
          <Icon 
            size={config.icon} 
            className={variant === 'heart' ? 'fill-current' : ''} 
          />
        </motion.div>
      </motion.div>
      
      {/* Message */}
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={cn('font-medium text-gray-700', config.text)}
        >
          {message}
        </motion.p>
      )}
      
      {/* Sparkle effects */}
      <div className="absolute">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              x: Math.cos((i * 60 * Math.PI) / 180) * 40,
              y: Math.sin((i * 60 * Math.PI) / 180) * 40,
            }}
            transition={{
              delay: 0.2 + i * 0.05,
              duration: 0.6,
            }}
            className="absolute w-2 h-2 rounded-full bg-current"
            style={{ color: 'rgba(251, 113, 133, 0.6)' }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default SuccessAnimation;

