import type { Metadata, Viewport } from 'next';
import { Quicksand, Caveat } from 'next/font/google';
import { Providers } from '@/components/providers/Providers';
import '@/styles/globals.css';

/**
 * Quicksand - Main display font
 * A cute, rounded sans-serif font perfect for a soft aesthetic
 */
const quicksand = Quicksand({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-quicksand',
  weight: ['300', '400', '500', '600', '700'],
});

/**
 * Caveat - Handwriting font for captions
 * A casual brush script for that handwritten polaroid feel
 */
const caveat = Caveat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-caveat',
  weight: ['400', '500', '600', '700'],
});

/**
 * Viewport configuration
 */
export const viewport: Viewport = {
  themeColor: '#fb7185',
  width: 'device-width',
  initialScale: 1,
};

/**
 * App metadata
 */
export const metadata: Metadata = {
  title: 'IRM Gallery - Your Precious Memories',
  description: 'A beautiful polaroid-style photo gallery with glassmorphism design. Store and cherish your precious memories.',
  keywords: ['gallery', 'photos', 'memories', 'polaroid', 'album'],
  authors: [{ name: 'IRM Gallery' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon.svg',
  },
};

/**
 * Root Layout
 * 
 * The main layout wrapper for the entire application.
 * Sets up fonts, providers, and global structure.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`${quicksand.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased bg-[rgb(var(--bg-primary))] text-[rgb(var(--text-primary))] transition-colors duration-300">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

