'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Props for Confetti component
 */
interface ConfettiProps {
  /** Whether to show confetti */
  show: boolean;
  /** Duration in milliseconds */
  duration?: number;
  /** Number of confetti pieces */
  count?: number;
}

/**
 * Single confetti piece
 */
interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  rotation: number;
  scale: number;
  shape: 'circle' | 'square' | 'heart';
}

/**
 * Confetti colors (pastel palette)
 */
const COLORS = [
  '#fda4af', // Rose
  '#d8b4fe', // Lavender
  '#86efac', // Mint
  '#fdba74', // Peach
  '#7dd3fc', // Sky
  '#fcd34d', // Yellow
  '#f9a8d4', // Pink
];

/**
 * Generate random confetti pieces
 */
function generateConfetti(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.5,
    shape: (['circle', 'square', 'heart'] as const)[Math.floor(Math.random() * 3)],
  }));
}

/**
 * Confetti Component
 * 
 * Displays a celebratory confetti animation.
 * 
 * @example
 * ```tsx
 * <Confetti show={showCelebration} duration={3000} />
 * ```
 */
export function Confetti({ show, duration = 3000, count = 50 }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (show) {
      setPieces(generateConfetti(count));
      setIsVisible(true);
      
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, count, duration]);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{
                x: `${piece.x}vw`,
                y: -20,
                rotate: piece.rotation,
                scale: piece.scale,
                opacity: 1,
              }}
              animate={{
                y: '110vh',
                rotate: piece.rotation + 720,
                opacity: [1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2 + Math.random() * 2,
                ease: 'easeIn',
              }}
              className="absolute"
              style={{ left: 0 }}
            >
              {piece.shape === 'circle' && (
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: piece.color }}
                />
              )}
              {piece.shape === 'square' && (
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: piece.color }}
                />
              )}
              {piece.shape === 'heart' && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill={piece.color}
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

export default Confetti;

