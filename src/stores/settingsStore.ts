import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSettings, ThemeMode, AccentColor, BackgroundType } from '@/types/settings';
import { DEFAULT_SETTINGS } from '@/types/settings';

/**
 * Settings store state interface
 */
interface SettingsState {
  settings: UserSettings;
}

/**
 * Settings store actions interface
 */
interface SettingsActions {
  /** Update theme mode */
  setTheme: (theme: ThemeMode) => void;
  /** Update accent color */
  setAccentColor: (color: AccentColor) => void;
  /** Update font size */
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  /** Update reduce motion preference */
  setReduceMotion: (reduce: boolean) => void;
  /** Update background type */
  setBackgroundType: (type: BackgroundType) => void;
  /** Update background blur intensity */
  setBlurIntensity: (value: number) => void;
  /** Update background overlay opacity */
  setOverlayOpacity: (value: number) => void;
  /** Update selected background preset */
  setSelectedBackground: (id: string) => void;
  /** Update custom background URL */
  setCustomBackgroundUrl: (url: string) => void;
  /** Update gallery default sort */
  setDefaultSort: (sort: string) => void;
  /** Update cards per row */
  setCardsPerRow: (count: number) => void;
  /** Toggle show dates */
  setShowDates: (show: boolean) => void;
  /** Toggle show tags */
  setShowTags: (show: boolean) => void;
  /** Reset all settings to defaults */
  resetSettings: () => void;
  /** Update multiple settings at once */
  updateSettings: (updates: Partial<UserSettings>) => void;
}

/**
 * Combined settings store type
 */
type SettingsStore = SettingsState & SettingsActions;

/**
 * Settings store with Zustand and persistence
 * 
 * Manages all user settings and persists them to localStorage.
 */
export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      // Initial state
      settings: DEFAULT_SETTINGS,
      
      // Actions
      setTheme: (theme) => set((state) => ({
        settings: {
          ...state.settings,
          appearance: { ...state.settings.appearance, theme },
        },
      })),
      
      setAccentColor: (accentColor) => set((state) => ({
        settings: {
          ...state.settings,
          appearance: { ...state.settings.appearance, accentColor },
        },
      })),
      
      setFontSize: (fontSize) => set((state) => ({
        settings: {
          ...state.settings,
          appearance: { ...state.settings.appearance, fontSize },
        },
      })),
      
      setReduceMotion: (reduceMotion) => set((state) => ({
        settings: {
          ...state.settings,
          appearance: { ...state.settings.appearance, reduceMotion },
        },
      })),
      
      setBackgroundType: (type) => set((state) => ({
        settings: {
          ...state.settings,
          background: { ...state.settings.background, type },
        },
      })),
      
      setBlurIntensity: (blurIntensity) => set((state) => ({
        settings: {
          ...state.settings,
          background: { ...state.settings.background, blurIntensity },
        },
      })),
      
      setOverlayOpacity: (overlayOpacity) => set((state) => ({
        settings: {
          ...state.settings,
          background: { ...state.settings.background, overlayOpacity },
        },
      })),
      
      setSelectedBackground: (selectedId) => set((state) => ({
        settings: {
          ...state.settings,
          background: { ...state.settings.background, selectedId },
        },
      })),
      
      setCustomBackgroundUrl: (customUrl) => set((state) => ({
        settings: {
          ...state.settings,
          background: { ...state.settings.background, customUrl },
        },
      })),
      
      setDefaultSort: (defaultSort) => set((state) => ({
        settings: {
          ...state.settings,
          gallery: { ...state.settings.gallery, defaultSort },
        },
      })),
      
      setCardsPerRow: (cardsPerRow) => set((state) => ({
        settings: {
          ...state.settings,
          gallery: { ...state.settings.gallery, cardsPerRow },
        },
      })),
      
      setShowDates: (showDates) => set((state) => ({
        settings: {
          ...state.settings,
          gallery: { ...state.settings.gallery, showDates },
        },
      })),
      
      setShowTags: (showTags) => set((state) => ({
        settings: {
          ...state.settings,
          gallery: { ...state.settings.gallery, showTags },
        },
      })),
      
      resetSettings: () => set({ settings: DEFAULT_SETTINGS }),
      
      updateSettings: (updates) => set((state) => ({
        settings: {
          ...state.settings,
          ...updates,
          appearance: { ...state.settings.appearance, ...updates.appearance },
          background: { ...state.settings.background, ...updates.background },
          gallery: { ...state.settings.gallery, ...updates.gallery },
        },
      })),
    }),
    {
      name: 'irm-gallery-settings',
    }
  )
);

export default useSettingsStore;

