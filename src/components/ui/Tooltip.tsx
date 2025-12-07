'use client';

import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Tooltip position options
 */
type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Props for Tooltip component
 */
interface TooltipProps {
  /** Content to show in tooltip */
  content: ReactNode;
  /** Children to wrap with tooltip */
  children: ReactNode;
  /** Tooltip position */
  position?: TooltipPosition;
  /** Delay before showing (ms) */
  delay?: number;
  /** Additional className for tooltip */
  className?: string;
}

/**
 * Position styles
 */
const positionStyles: Record<TooltipPosition, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

/**
 * Animation variants based on position
 */
const getAnimationVariants = (position: TooltipPosition) => {
  const directions = {
    top: { initial: { y: 5 }, animate: { y: 0 } },
    bottom: { initial: { y: -5 }, animate: { y: 0 } },
    left: { initial: { x: 5 }, animate: { x: 0 } },
    right: { initial: { x: -5 }, animate: { x: 0 } },
  };
  
  return {
    initial: { opacity: 0, scale: 0.95, ...directions[position].initial },
    animate: { opacity: 1, scale: 1, ...directions[position].animate },
    exit: { opacity: 0, scale: 0.95, ...directions[position].initial },
  };
};

/**
 * Tooltip Component
 * 
 * A beautiful animated tooltip with glassmorphism style.
 * 
 * @example
 * ```tsx
 * <Tooltip content="Delete this photo" position="top">
 *   <button>🗑️</button>
 * </Tooltip>
 * ```
 */
export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 300,
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };
  
  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };
  
  const variants = getAnimationVariants(position);
  
  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-50 pointer-events-none',
              'px-3 py-1.5 rounded-lg',
              'bg-gray-900/90 backdrop-blur-sm',
              'text-white text-sm font-medium',
              'whitespace-nowrap',
              'shadow-lg',
              positionStyles[position],
              className
            )}
          >
            {content}
            
            {/* Arrow */}
            <div
              className={cn(
                'absolute w-2 h-2 bg-gray-900/90 rotate-45',
                position === 'top' && 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
                position === 'bottom' && 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
                position === 'left' && 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2',
                position === 'right' && 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2'
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Tooltip;

