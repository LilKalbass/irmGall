'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';
import { BackgroundProvider } from '@/context/BackgroundContext';
import { ThemeProvider } from './ThemeProvider';
import type { ReactNode } from 'react';

/**
 * Props for Providers component
 */
interface ProvidersProps {
  children: ReactNode;
}

/**
 * Providers Component
 * 
 * Wraps the app with all necessary providers for auth, state, and UI.
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <BackgroundProvider>
          {children}
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
              },
              className: 'font-sans',
            }}
            closeButton
            richColors
          />
        </BackgroundProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

export default Providers;

