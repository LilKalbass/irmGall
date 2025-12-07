'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { BackgroundType, PresetBackground } from '@/types/settings';

/**
 * Preset backgrounds for the gallery
 */
export const PRESET_BACKGROUNDS: PresetBackground[] = [
  {
    id: 'gradient-default',
    name: 'Dreamy Pastels',
    type: 'gradient',
    gradient: 'linear-gradient(135deg, #fce7f3 0%, #faf5ff 50%, #e0f2fe 100%)',
    thumbnail: '/backgrounds/gradient-default.jpg',
  },
  {
    id: 'gradient-sunset',
    name: 'Soft Sunset',
    type: 'gradient',
    gradient: 'linear-gradient(135deg, #fed7aa 0%, #fecaca 50%, #fae8ff 100%)',
    thumbnail: '/backgrounds/gradient-sunset.jpg',
  },
  {
    id: 'gradient-ocean',
    name: 'Ocean Breeze',
    type: 'gradient',
    gradient: 'linear-gradient(135deg, #a5f3fc 0%, #c4b5fd 50%, #fbcfe8 100%)',
    thumbnail: '/backgrounds/gradient-ocean.jpg',
  },
  {
    id: 'gradient-forest',
    name: 'Mint Garden',
    type: 'gradient',
    gradient: 'linear-gradient(135deg, #bbf7d0 0%, #a5f3fc 50%, #ddd6fe 100%)',
    thumbnail: '/backgrounds/gradient-forest.jpg',
  },
  {
    id: 'gradient-lavender',
    name: 'Lavender Dreams',
    type: 'gradient',
    gradient: 'linear-gradient(135deg, #e9d5ff 0%, #fbcfe8 50%, #fef3c7 100%)',
    thumbnail: '/backgrounds/gradient-lavender.jpg',
  },
  {
    id: 'solid-blush',
    name: 'Blush Pink',
    type: 'solid',
    color: '#fdf2f8',
    thumbnail: '/backgrounds/solid-blush.jpg',
  },
  {
    id: 'solid-cream',
    name: 'Warm Cream',
    type: 'solid',
    color: '#fefce8',
    thumbnail: '/backgrounds/solid-cream.jpg',
  },
];

/**
 * Background context state
 */
interface BackgroundState {
  type: BackgroundType;
  url?: string;
  gradient?: string;
  color?: string;
  blurIntensity: number;
  overlayOpacity: number;
  selectedPresetId?: string;
}

/**
 * Background context value
 */
interface BackgroundContextValue extends BackgroundState {
  /** Set background to a preset */
  setPreset: (presetId: string) => void;
  /** Set custom image background */
  setCustomImage: (url: string) => void;
  /** Set custom video background */
  setCustomVideo: (url: string) => void;
  /** Set blur intensity */
  setBlurIntensity: (value: number) => void;
  /** Set overlay opacity */
  setOverlayOpacity: (value: number) => void;
  /** Reset to default background */
  resetBackground: () => void;
  /** Available presets */
  presets: PresetBackground[];
}

/**
 * Default background state
 */
const DEFAULT_STATE: BackgroundState = {
  type: 'gradient',
  blurIntensity: 10,
  overlayOpacity: 30,
  selectedPresetId: 'gradient-default',
};

const STORAGE_KEY = 'irm-gallery-background';

const BackgroundContext = createContext<BackgroundContextValue | null>(null);

/**
 * BackgroundProvider Component
 * 
 * Provides background state management throughout the app.
 * Persists settings to localStorage.
 */
export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BackgroundState>(DEFAULT_STATE);
  
  // Load saved settings on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as BackgroundState;
        setState(parsed);
      } catch (error) {
        console.error('Failed to parse saved background settings:', error);
      }
    }
  }, []);
  
  // Save settings when they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);
  
  const setPreset = useCallback((presetId: string) => {
    const preset = PRESET_BACKGROUNDS.find(p => p.id === presetId);
    if (!preset) return;
    
    setState(prev => ({
      ...prev,
      type: preset.type,
      url: preset.url,
      gradient: preset.gradient,
      color: preset.color,
      selectedPresetId: presetId,
    }));
  }, []);
  
  const setCustomImage = useCallback((url: string) => {
    setState(prev => ({
      ...prev,
      type: 'image',
      url,
      selectedPresetId: undefined,
    }));
  }, []);
  
  const setCustomVideo = useCallback((url: string) => {
    setState(prev => ({
      ...prev,
      type: 'video',
      url,
      selectedPresetId: undefined,
    }));
  }, []);
  
  const setBlurIntensity = useCallback((value: number) => {
    setState(prev => ({
      ...prev,
      blurIntensity: Math.max(0, Math.min(20, value)),
    }));
  }, []);
  
  const setOverlayOpacity = useCallback((value: number) => {
    setState(prev => ({
      ...prev,
      overlayOpacity: Math.max(0, Math.min(100, value)),
    }));
  }, []);
  
  const resetBackground = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);
  
  const value: BackgroundContextValue = {
    ...state,
    setPreset,
    setCustomImage,
    setCustomVideo,
    setBlurIntensity,
    setOverlayOpacity,
    resetBackground,
    presets: PRESET_BACKGROUNDS,
  };
  
  return (
    <BackgroundContext.Provider value={value}>
      {children}
    </BackgroundContext.Provider>
  );
}

/**
 * Hook to access background context
 */
export function useBackground(): BackgroundContextValue {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
}

export default BackgroundContext;

