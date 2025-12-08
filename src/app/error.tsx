'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';
import { AnimatedBackground } from '@/components/background';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';

/**
 * Error Page Props
 */
interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error Page
 * 
 * Global error boundary page shown when an error occurs.
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log error to console (or error tracking service)
    console.error('Application error:', error);
  }, [error]);
  
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
          {/* Error illustration */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="relative w-32 h-32 mx-auto mb-6"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-100 to-orange-100" />
            <motion.div
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <AlertTriangle className="w-16 h-16 text-red-400" />
            </motion.div>
          </motion.div>
          
          {/* Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-2xl font-display font-bold text-gray-700 mb-2">
              Something went wrong 😢
            </h1>
            <p className="text-gray-500 mb-6">
              Don&apos;t worry, your memories are safe! Let&apos;s try that again.
            </p>
            
            {/* Error details (only in dev) */}
            {process.env.NODE_ENV === 'development' && error.message && (
              <div className="mb-6 p-3 bg-red-50/50 rounded-lg text-left">
                <p className="text-xs text-red-600 font-mono break-all">
                  {error.message}
                </p>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <GlassButton
                variant="primary"
                leftIcon={<RefreshCw size={18} />}
                onClick={reset}
                glow
              >
                Try Again
              </GlassButton>
              <Link href="/">
                <GlassButton
                  variant="secondary"
                  leftIcon={<Home size={18} />}
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

