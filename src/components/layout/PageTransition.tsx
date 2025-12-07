'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Props for PageTransition component
 */
interface PageTransitionProps {
  /** Page content */
  children: ReactNode;
  /** Unique key for animation */
  pageKey?: string;
}

/**
 * Animation variants
 */
const variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1],
    },
  },
};

/**
 * PageTransition Component
 * 
 * Wraps page content with smooth fade/slide animations.
 * 
 * @example
 * ```tsx
 * <PageTransition pageKey="gallery">
 *   <GalleryContent />
 * </PageTransition>
 * ```
 */
export function PageTransition({ children, pageKey }: PageTransitionProps) {
  return (
    <motion.div
      key={pageKey}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered container for child animations
 */
interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

const containerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function StaggerContainer({ 
  children, 
  staggerDelay = 0.1,
  className 
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered child item
 */
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Fade in animation wrapper
 */
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({ 
  children, 
  delay = 0, 
  duration = 0.4,
  className 
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Scale in animation wrapper
 */
interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function ScaleIn({ children, delay = 0, className }: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        delay, 
        duration: 0.3,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Slide in animation wrapper
 */
type SlideDirection = 'up' | 'down' | 'left' | 'right';

interface SlideInProps {
  children: ReactNode;
  direction?: SlideDirection;
  delay?: number;
  className?: string;
}

const slideOffsets: Record<SlideDirection, { x: number; y: number }> = {
  up: { x: 0, y: 30 },
  down: { x: 0, y: -30 },
  left: { x: 30, y: 0 },
  right: { x: -30, y: 0 },
};

export function SlideIn({ 
  children, 
  direction = 'up', 
  delay = 0,
  className 
}: SlideInProps) {
  const offset = slideOffsets[direction];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ 
        delay, 
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;

