'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Lock } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

/**
 * Props for AuthGuard component
 */
interface AuthGuardProps {
  /** Children to render when authenticated */
  children: ReactNode;
  /** Custom loading component */
  loadingComponent?: ReactNode;
  /** Custom redirect path (default: /login) */
  redirectTo?: string;
}

/**
 * Default loading component
 */
function DefaultLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <GlassCard
        blur="medium"
        opacity={30}
        rounded="2xl"
        className="p-8 text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="inline-block mb-4"
        >
          <Loader2 className="w-8 h-8 text-rose-400" />
        </motion.div>
        <p className="text-gray-600 font-medium">Loading your gallery...</p>
        <p className="text-gray-400 text-sm mt-1">Just a moment ✨</p>
      </GlassCard>
    </div>
  );
}

/**
 * AuthGuard Component
 * 
 * Protects routes by checking authentication status.
 * Redirects to login page if not authenticated.
 * 
 * @example
 * ```tsx
 * <AuthGuard>
 *   <GalleryPage />
 * </AuthGuard>
 * ```
 */
export function AuthGuard({
  children,
  loadingComponent,
  redirectTo = '/login',
}: AuthGuardProps) {
  const { status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(redirectTo);
    }
  }, [status, router, redirectTo]);
  
  // Show loading while checking auth
  if (status === 'loading') {
    return loadingComponent || <DefaultLoading />;
  }
  
  // Don't render children if not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <GlassCard
          blur="medium"
          opacity={30}
          rounded="2xl"
          className="p-8 text-center"
        >
          <Lock className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Redirecting to login...</p>
        </GlassCard>
      </div>
    );
  }
  
  // Render children if authenticated
  return <>{children}</>;
}

export default AuthGuard;

