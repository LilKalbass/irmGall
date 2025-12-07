'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { GlassButton } from './GlassButton';
import { cn } from '@/lib/utils';

/**
 * Props for ConfirmDialog component
 */
interface ConfirmDialogProps {
  /** Whether dialog is open */
  isOpen: boolean;
  /** Called when dialog should close */
  onClose: () => void;
  /** Called when action is confirmed */
  onConfirm: () => void;
  /** Dialog title */
  title: string;
  /** Dialog message/description */
  message: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Variant for styling */
  variant?: 'danger' | 'warning' | 'info';
  /** Whether action is in progress */
  isLoading?: boolean;
}

/**
 * Variant configurations
 */
const variants = {
  danger: {
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-100',
    confirmVariant: 'danger' as const,
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-100',
    confirmVariant: 'primary' as const,
  },
  info: {
    icon: AlertTriangle,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-100',
    confirmVariant: 'primary' as const,
  },
};

/**
 * ConfirmDialog Component
 * 
 * A beautiful confirmation dialog for destructive or important actions.
 * 
 * @example
 * ```tsx
 * <ConfirmDialog
 *   isOpen={showConfirm}
 *   onClose={() => setShowConfirm(false)}
 *   onConfirm={handleDelete}
 *   title="Delete Photo?"
 *   message="This action cannot be undone."
 *   variant="danger"
 * />
 * ```
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  const config = variants[variant];
  const Icon = config.icon;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-sm"
          >
            <GlassCard
              blur="heavy"
              opacity={50}
              rounded="2xl"
              className="p-6"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
              
              {/* Icon */}
              <div className={cn(
                'w-12 h-12 rounded-full mx-auto mb-4',
                'flex items-center justify-center',
                config.iconBg
              )}>
                <Icon className={cn('w-6 h-6', config.iconColor)} />
              </div>
              
              {/* Content */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {title}
                </h3>
                <p className="text-gray-500 text-sm">
                  {message}
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex gap-3">
                <GlassButton
                  variant="secondary"
                  fullWidth
                  onClick={onClose}
                  disabled={isLoading}
                >
                  {cancelText}
                </GlassButton>
                <GlassButton
                  variant={config.confirmVariant}
                  fullWidth
                  onClick={onConfirm}
                  isLoading={isLoading}
                >
                  {confirmText}
                </GlassButton>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ConfirmDialog;

