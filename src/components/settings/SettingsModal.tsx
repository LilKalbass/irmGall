'use client';

import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sun, Moon, Monitor, Palette, Image as ImageIcon, Grid, LogOut, RotateCcw } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { useSettingsStore } from '@/stores/settingsStore';
import { useBackground } from '@/context/BackgroundContext';
import { cn } from '@/lib/utils';
import type { ThemeMode, AccentColor } from '@/types/settings';

/**
 * Props for SettingsModal component
 */
interface SettingsModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Called when modal should close */
  onClose: () => void;
}

/**
 * Theme options configuration
 */
const THEME_OPTIONS: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
  { value: 'light', label: 'Light', icon: <Sun size={16} /> },
  { value: 'dark', label: 'Dark', icon: <Moon size={16} /> },
  { value: 'system', label: 'Auto', icon: <Monitor size={16} /> },
];

/**
 * Accent color options - warm palette
 */
const ACCENT_COLORS: { value: AccentColor; label: string; color: string }[] = [
  { value: 'rose', label: 'Blush', color: 'bg-blush-300' },
  { value: 'peach', label: 'Peach', color: 'bg-peach-300' },
  { value: 'lavender', label: 'Lavender', color: 'bg-lavender-300' },
  { value: 'mint', label: 'Sage', color: 'bg-sage-300' },
  { value: 'sky', label: 'Sky', color: 'bg-sky-300' },
];

/**
 * SettingsModal Component
 * 
 * A slide-out settings panel with warm, lovely styling.
 */
export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { data: session } = useSession();
  const { settings, setTheme, setAccentColor, setReduceMotion, resetSettings } = useSettingsStore();
  const { setPreset, setBlurIntensity, setOverlayOpacity, presets, selectedPresetId, blurIntensity, overlayOpacity } = useBackground();
  
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-blush-900/20 backdrop-blur-sm"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm"
          >
            <GlassCard
              blur="heavy"
              opacity={85}
              rounded="xl"
              hoverEffect="none"
              className="h-full overflow-y-auto scrollbar-cute rounded-r-none"
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-bold gradient-text">
                    Settings ✨
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-blush-100/50 dark:hover:bg-blush-500/20 transition-colors"
                  >
                    <X size={18} className="text-blush-500 dark:text-blush-300" />
                  </button>
                </div>
                
                {/* Settings Sections */}
                <div className="space-y-6">
                  {/* Appearance */}
                  <section>
                    <h3 className="text-xs font-semibold text-blush-500 dark:text-blush-300 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <Palette size={14} />
                      Appearance
                    </h3>
                    
                    {/* Theme */}
                    <div className="mb-4">
                      <label className="text-xs font-medium text-blush-700 dark:text-blush-200 mb-2 block">
                        Theme
                      </label>
                      <div className="flex gap-2">
                        {THEME_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setTheme(option.value)}
                            className={cn(
                              'flex-1 flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl',
                              'transition-all duration-200 text-xs font-medium',
                              settings.appearance.theme === option.value
                                ? 'bg-blush-100 dark:bg-blush-500/30 text-blush-700 dark:text-blush-200 ring-1 ring-blush-300 dark:ring-blush-500/50'
                                : 'bg-white/30 dark:bg-white/10 text-blush-600 dark:text-blush-300 hover:bg-white/50 dark:hover:bg-white/20'
                            )}
                          >
                            {option.icon}
                            <span>{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Accent Color */}
                    <div className="mb-4">
                      <label className="text-xs font-medium text-blush-700 dark:text-blush-200 mb-2 block">
                        Accent Color
                      </label>
                      <div className="flex gap-2">
                        {ACCENT_COLORS.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setAccentColor(color.value)}
                            title={color.label}
                            className={cn(
                              'w-8 h-8 rounded-full transition-all duration-200',
                              color.color,
                              settings.appearance.accentColor === color.value
                                ? 'ring-2 ring-offset-2 ring-blush-400 scale-110'
                                : 'hover:scale-105 opacity-80 hover:opacity-100'
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Reduce Motion */}
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-blush-700 dark:text-blush-200">
                        Reduce Motion
                      </label>
                      <button
                        onClick={() => setReduceMotion(!settings.appearance.reduceMotion)}
                        className={cn(
                          'relative w-10 h-5 rounded-full transition-colors duration-200',
                          settings.appearance.reduceMotion
                            ? 'bg-blush-400'
                            : 'bg-blush-200'
                        )}
                      >
                        <span
                          className={cn(
                            'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200',
                            settings.appearance.reduceMotion
                              ? 'translate-x-5'
                              : 'translate-x-0.5'
                          )}
                        />
                      </button>
                    </div>
                  </section>
                  
                  {/* Background */}
                  <section>
                    <h3 className="text-xs font-semibold text-blush-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <ImageIcon size={14} />
                      Background
                    </h3>
                    
                    {/* Preset Backgrounds */}
                    <div className="mb-4">
                      <label className="text-xs font-medium text-blush-700 mb-2 block">
                        Style
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {presets.map((preset) => (
                          <button
                            key={preset.id}
                            onClick={() => setPreset(preset.id)}
                            className={cn(
                              'aspect-square rounded-lg overflow-hidden transition-all duration-200',
                              'border-2',
                              selectedPresetId === preset.id
                                ? 'border-blush-400 ring-2 ring-blush-200'
                                : 'border-transparent hover:border-blush-200'
                            )}
                          >
                            {preset.type === 'gradient' && (
                              <div 
                                className="w-full h-full"
                                style={{ background: preset.gradient }}
                              />
                            )}
                            {preset.type === 'solid' && (
                              <div 
                                className="w-full h-full"
                                style={{ backgroundColor: preset.color }}
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Blur Intensity */}
                    <div className="mb-4">
                      <label className="text-xs font-medium text-blush-700 mb-2 flex justify-between">
                        <span>Blur</span>
                        <span className="text-blush-400">{blurIntensity}px</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={blurIntensity}
                        onChange={(e) => setBlurIntensity(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-blush-100 rounded-full appearance-none cursor-pointer accent-blush-400"
                      />
                    </div>
                    
                    {/* Overlay Opacity */}
                    <div>
                      <label className="text-xs font-medium text-blush-700 mb-2 flex justify-between">
                        <span>Overlay</span>
                        <span className="text-blush-400">{overlayOpacity}%</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={overlayOpacity}
                        onChange={(e) => setOverlayOpacity(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-blush-100 rounded-full appearance-none cursor-pointer accent-blush-400"
                      />
                    </div>
                  </section>
                  
                  {/* Account */}
                  <section>
                    <h3 className="text-xs font-semibold text-blush-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <Grid size={14} />
                      Account
                    </h3>
                    
                    {/* User Info */}
                    <div className="bg-blush-50/50 rounded-xl p-3 mb-3">
                      <p className="text-xs text-blush-500">Logged in as</p>
                      <p className="font-medium text-blush-700 text-sm">
                        {session?.user?.name || 'User'} 💕
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="space-y-2">
                      <GlassButton
                        variant="secondary"
                        fullWidth
                        size="sm"
                        leftIcon={<RotateCcw size={14} />}
                        onClick={resetSettings}
                      >
                        Reset to Defaults
                      </GlassButton>
                      
                      <GlassButton
                        variant="danger"
                        fullWidth
                        size="sm"
                        leftIcon={<LogOut size={14} />}
                        onClick={handleLogout}
                      >
                        Log Out
                      </GlassButton>
                    </div>
                  </section>
                  
                  {/* App Info */}
                  <section className="text-center text-blush-400 text-xs pt-3 border-t border-blush-100/50">
                    <p>IRM Gallery v1.0.0</p>
                    <p className="text-[10px] mt-0.5">Made with 💕</p>
                  </section>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default SettingsModal;
