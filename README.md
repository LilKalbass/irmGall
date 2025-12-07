# IRM Gallery 📸✨

A beautiful polaroid-style photo gallery application with glassmorphism design, built with Next.js 15, TypeScript, and Tailwind CSS.

![IRM Gallery](https://via.placeholder.com/800x400/fce7f3/be185d?text=IRM+Gallery+%F0%9F%92%95)

## Features

- 🎨 **Glassmorphism Design** - Beautiful frosted glass UI effects
- 📷 **Polaroid-Style Photos** - Realistic polaroid frames with handwritten captions
- 🔐 **Whitelist Authentication** - Secure login with pre-approved users only
- ✏️ **Full CRUD Operations** - Create, read, update, and delete photos
- 🏷️ **Tags & Filtering** - Organize photos with tags, search, and filters
- ❤️ **Favorites** - Mark your favorite memories
- 🖼️ **Full-Screen Viewer** - View photos in beautiful full-screen mode with navigation
- 🎨 **Customizable Themes** - Multiple accent colors and background options
- 📱 **Responsive Design** - Works beautifully on all devices
- ✨ **Smooth Animations** - Delightful Framer Motion animations throughout
- ⬇️ **Download Photos** - Download your photos directly from the viewer
- 🔍 **Zoom Support** - Zoom in on photos in the viewer

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom glassmorphism components
- **State Management**: Zustand
- **Authentication**: NextAuth.js
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form + Zod
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd irmgallery
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   NEXTAUTH_SECRET=your-super-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   ```
   
   Generate a secret with:
   ```bash
   openssl rand -base64 32
   ```

4. **Configure allowed users**
   Edit `src/config/allowedUsers.ts` to add your users:
   ```typescript
   export const ALLOWED_USERS = [
     {
       nickname: 'your-username',
       passwordHash: 'generated-bcrypt-hash',
       displayName: 'Your Name',
     },
   ];
   ```
   
   Generate password hashes with:
   ```bash
   npm run hash-password -- "your-password"
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Default Login

For testing, you can use:
- **Nickname**: `admin`
- **Password**: `gallery123`

⚠️ **Important**: Change these credentials in production!

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/         # NextAuth endpoints
│   │   ├── photos/       # Photo CRUD endpoints
│   │   └── upload/       # File upload endpoint
│   ├── gallery/          # Main gallery page
│   └── login/            # Login page
├── components/
│   ├── auth/             # Authentication components
│   │   └── AuthGuard     # Protected route wrapper
│   ├── background/       # Background effects
│   │   ├── AnimatedBackground  # Main background component
│   │   ├── GradientMesh       # Animated gradient orbs
│   │   └── ParticleOverlay    # Floating particles
│   ├── gallery/          # Gallery components
│   │   ├── PolaroidFrame      # Polaroid photo card
│   │   ├── PhotoEditorModal   # Create/edit photos
│   │   ├── PhotoViewerModal   # Full-screen viewer
│   │   ├── GalleryGrid        # Photo grid layout
│   │   ├── GalleryHeader      # Header with actions
│   │   ├── GalleryFilters     # Search & filters
│   │   └── ImageUploader      # Drag & drop upload
│   ├── layout/           # Layout animations
│   │   └── PageTransition     # Page animations
│   ├── providers/        # Context providers
│   ├── settings/         # Settings modal
│   └── ui/               # Reusable UI components
│       ├── GlassCard          # Glassmorphism card
│       ├── GlassButton        # Glass styled button
│       ├── GlassInput         # Glass styled input
│       ├── GlassTextarea      # Glass styled textarea
│       ├── TagInput           # Tag input with chips
│       ├── ConfirmDialog      # Confirmation modal
│       ├── Confetti           # Celebration animation
│       ├── LoadingSpinner     # Loading animations
│       ├── SuccessAnimation   # Success feedback
│       ├── Tooltip            # Hover tooltips
│       ├── Avatar             # User avatars
│       └── Badge              # Status badges
├── config/               # App configuration
├── context/              # React contexts
├── hooks/                # Custom hooks
├── lib/                  # Utilities and helpers
│   └── validation/       # Zod schemas
├── stores/               # Zustand stores
├── styles/               # Global styles
└── types/                # TypeScript types
```

## Customization

### Adding New Users

1. Generate a password hash:
   ```bash
   npm run hash-password -- "user-password"
   ```

2. Add the user to `src/config/allowedUsers.ts`:
   ```typescript
   {
     nickname: 'newuser',
     passwordHash: '$2a$12$...',
     displayName: 'New User',
   }
   ```

### Changing Accent Colors

The app supports multiple accent colors. Users can change this in Settings, or you can modify the default in `src/types/settings.ts`.

Available colors:
- Rose (default)
- Lavender
- Mint
- Peach
- Sky

### Custom Backgrounds

Add new preset backgrounds in `src/context/BackgroundContext.tsx`:

```typescript
export const PRESET_BACKGROUNDS = [
  // ... existing presets
  {
    id: 'custom-gradient',
    name: 'My Custom Gradient',
    type: 'gradient',
    gradient: 'linear-gradient(135deg, #color1, #color2)',
  },
];
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/photos` | Get all photos with filters |
| POST | `/api/photos` | Create a new photo |
| GET | `/api/photos/[id]` | Get a single photo |
| PUT | `/api/photos/[id]` | Update a photo |
| DELETE | `/api/photos/[id]` | Delete a photo |
| POST | `/api/upload` | Upload an image |

## Scripts

```bash
npm run dev        # Start development server (with Turbopack)
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run hash-password -- "password"  # Generate password hash
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Design inspired by iOS glassmorphism and polaroid aesthetics
- Built with 💕 for preserving precious memories

---

Made with ✨ by IRM Gallery Team

