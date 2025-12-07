'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Camera } from 'lucide-react';
import { AnimatedBackground } from '@/components/background';
import { GlassCard } from '@/components/ui/GlassCard';

/**
 * Home Page
 * 
 * Landing page that redirects based on authentication status:
 * - Authenticated: Redirect to /gallery
 * - Unauthenticated: Redirect to /login
 */
export default function HomePage() {
  const { status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/gallery');
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);
  
  // Show loading while determining auth status
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AnimatedBackground type="gradient" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard
          blur="medium"
          opacity={30}
          rounded="2xl"
          className="p-8 text-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-cute"
          >
            <Camera className="w-8 h-8 text-white" />
          </motion.div>
          
          {/* Loading animation */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-4"
          >
            <Loader2 className="w-6 h-6 text-rose-400" />
          </motion.div>
          
          <h1 className="text-xl font-display font-bold gradient-text mb-2">
            IRM Gallery
          </h1>
          <p className="text-gray-500 text-sm">
            Loading your memories... ✨
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}

