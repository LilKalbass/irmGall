'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';

/**
 * ThemeProvider Component
 * 
 * Applies the theme mode (light/dark) to the document.
 * Listens to settings changes and system preference.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettingsStore();
  const theme = settings.appearance.theme;
  
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      // Use system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(systemPrefersDark ? 'dark' : 'light');
      
      // Listen for system preference changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        root.classList.remove('light', 'dark');
        root.classList.add(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Use user preference
      root.classList.add(theme);
    }
  }, [theme]);
  
  return <>{children}</>;
}

export default ThemeProvider;

