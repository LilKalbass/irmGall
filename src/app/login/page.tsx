'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Camera, Sparkles, AlertCircle, Heart } from 'lucide-react';
import { AnimatedBackground } from '@/components/background';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassButton } from '@/components/ui/GlassButton';
import { cn } from '@/lib/utils';

/**
 * Login form content (needs Suspense boundary for useSearchParams)
 */
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/gallery';
  const error = searchParams.get('error');
  
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(
    error === 'CredentialsSignin' ? 'Invalid nickname or password' : null
  );
  
  /**
   * Handle login form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);
    
    try {
      const result = await signIn('credentials', {
        nickname: nickname.trim(),
        password,
        redirect: false,
        callbackUrl,
      });
      
      if (result?.error) {
        setLoginError('Invalid nickname or password');
        setIsLoading(false);
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setLoginError('Something went wrong');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center p-4">
      {/* Warm background */}
      <AnimatedBackground
        type="gradient"
        blurIntensity={0}
        overlayOpacity={0}
      />
      
      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10 w-full max-w-sm"
      >
        <GlassCard
          blur="heavy"
          opacity={80}
          rounded="2xl"
          hoverEffect="none"
          className="p-6 sm:p-8"
        >
          {/* Header */}
          <div className="text-center mb-6">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex"
            >
              <div className={cn(
                'p-4 rounded-2xl mb-3',
                'bg-gradient-to-br from-blush-300 to-blush-400',
                'shadow-cute-lg'
              )}>
                <Camera className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-display font-bold mb-1"
            >
              <span className="gradient-text">Welcome Back</span>
              <Sparkles className="inline-block ml-2 w-5 h-5 text-cream-500" />
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-blush-600/70"
            >
              Sign in to your gallery
            </motion.p>
          </div>
          
          {/* Error message */}
          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'flex items-center gap-2 p-3 mb-4 rounded-xl',
                'bg-red-50/80 text-red-600 text-sm'
              )}
            >
              <AlertCircle size={16} />
              <span>{loginError}</span>
            </motion.div>
          )}
          
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <GlassInput
              label="Nickname"
              type="text"
              placeholder="Your nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              autoComplete="username"
              autoFocus
            />
            
            <GlassInput
              label="Password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            
            <GlassButton
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              loadingText="Signing in..."
              glow
              className="mt-6"
            >
              <Heart size={16} className="mr-1" />
              Sign In
            </GlassButton>
          </form>
          
          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs text-blush-500/60 mt-6"
          >
            Access is invite-only 💕
          </motion.p>
        </GlassCard>
        
        {/* Decorative elements */}
        <motion.div
          animate={{ 
            y: [0, -6, 0],
            rotate: [0, 3, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-6 -right-4 text-3xl pointer-events-none opacity-80"
        >
          ✨
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, 6, 0],
            rotate: [0, -3, 0],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute -bottom-4 -left-4 text-2xl pointer-events-none opacity-80"
        >
          💕
        </motion.div>
      </motion.div>
    </div>
  );
}

/**
 * Login Page
 */
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-blush-400">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
