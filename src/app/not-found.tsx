'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Camera, ArrowLeft } from 'lucide-react';
import { AnimatedBackground } from '@/components/background';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';

/**
 * 404 Not Found Page
 * 
 * A cute error page shown when a route is not found.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AnimatedBackground type="gradient" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard
          blur="heavy"
          opacity={35}
          rounded="2xl"
          hoverEffect="none"
          className="p-8 md:p-12 text-center max-w-md"
        >
          {/* Cute illustration */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="relative w-32 h-32 mx-auto mb-6"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-100 to-lavender-100" />
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Camera className="w-16 h-16 text-rose-400" />
            </motion.div>
            <div className="absolute -top-2 -right-2 text-4xl">❓</div>
          </motion.div>
          
          {/* Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-6xl font-display font-bold gradient-text mb-2">
              404
            </h1>
            <h2 className="text-xl font-display font-semibold text-gray-700 mb-2">
              Oops! Page not found
            </h2>
            <p className="text-gray-500 mb-8">
              This memory seems to have wandered off somewhere... 🌸
            </p>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/gallery">
                <GlassButton
                  variant="primary"
                  leftIcon={<Home size={18} />}
                  glow
                >
                  Back to Gallery
                </GlassButton>
              </Link>
              <Link href="/">
                <GlassButton
                  variant="secondary"
                  leftIcon={<ArrowLeft size={18} />}
                >
                  Go Home
                </GlassButton>
              </Link>
            </div>
          </motion.div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

