'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Size variants for the spinner
 */
type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Props for LoadingSpinner component
 */
interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: SpinnerSize;
  /** Custom color class */
  color?: string;
  /** Label text */
  label?: string;
  /** Additional className */
  className?: string;
}

/**
 * Size configurations
 */
const sizeConfig: Record<SpinnerSize, { size: number; stroke: number }> = {
  sm: { size: 20, stroke: 2 },
  md: { size: 32, stroke: 3 },
  lg: { size: 48, stroke: 4 },
  xl: { size: 64, stroke: 5 },
};

/**
 * LoadingSpinner Component
 * 
 * A beautiful animated loading spinner with optional label.
 * 
 * @example
 * ```tsx
 * <LoadingSpinner size="md" label="Loading..." />
 * ```
 */
export function LoadingSpinner({
  size = 'md',
  color = 'text-rose-400',
  label,
  className,
}: LoadingSpinnerProps) {
  const config = sizeConfig[size];
  const radius = (config.size - config.stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  
  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <motion.svg
        width={config.size}
        height={config.size}
        viewBox={`0 0 ${config.size} ${config.size}`}
        className={color}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {/* Background circle */}
        <circle
          cx={config.size / 2}
          cy={config.size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.stroke}
          opacity={0.2}
        />
        
        {/* Animated arc */}
        <motion.circle
          cx={config.size / 2}
          cy={config.size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{
            strokeDashoffset: [circumference, circumference * 0.25],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.svg>
      
      {label && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-500 font-medium"
        >
          {label}
        </motion.p>
      )}
    </div>
  );
}

/**
 * Cute heart loading animation
 */
export function HeartLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.2,
          }}
          className="text-rose-400"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Dots loading animation
 */
export function DotsLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
          }}
          className="w-2 h-2 rounded-full bg-rose-400"
        />
      ))}
    </div>
  );
}

export default LoadingSpinner;

