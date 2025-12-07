/**
 * Initialization script for IRM Gallery
 * 
 * This script:
 * 1. Creates required directories
 * 2. Initializes the photos.json data file
 * 3. Generates password hashes for default users
 * 
 * Run with: npm run init
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const PHOTOS_FILE = path.join(DATA_DIR, 'photos.json');

async function main() {
  console.log('\n✨ Initializing IRM Gallery...\n');
  
  // Create directories
  console.log('📁 Creating directories...');
  
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('   ✓ Created src/data/');
  } else {
    console.log('   ✓ src/data/ exists');
  }
  
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    console.log('   ✓ Created public/uploads/');
  } else {
    console.log('   ✓ public/uploads/ exists');
  }
  
  // Create photos.json if it doesn't exist
  console.log('\n📄 Checking data files...');
  
  if (!fs.existsSync(PHOTOS_FILE)) {
    fs.writeFileSync(PHOTOS_FILE, JSON.stringify([], null, 2));
    console.log('   ✓ Created photos.json');
  } else {
    console.log('   ✓ photos.json exists');
  }
  
  // Generate password hashes for default users
  console.log('\n🔐 Generating default password hashes...\n');
  
  const adminHash = await bcrypt.hash('gallery123', 12);
  
  console.log('Default user credentials:');
  console.log('═'.repeat(60));
  console.log('\n  Nickname: admin');
  console.log('  Password: gallery123');
  console.log('\n  Password Hash (copy to allowedUsers.ts):');
  console.log(`  ${adminHash}`);
  console.log('\n' + '═'.repeat(60));
  
  // Update allowedUsers.ts with the proper hash
  const allowedUsersPath = path.join(process.cwd(), 'src', 'config', 'allowedUsers.ts');
  
  const allowedUsersContent = `import bcrypt from 'bcryptjs';
import type { AllowedUser } from '@/types/auth';

/**
 * List of allowed users for the gallery
 * 
 * To add a new user:
 * 1. Run: npm run hash-password -- "yourpassword"
 * 2. Copy the hash and add it here
 * 
 * IMPORTANT: In production, consider moving this to a database
 * or environment variables for better security.
 */
export const ALLOWED_USERS: AllowedUser[] = [
  {
    nickname: 'admin',
    // Password: "gallery123" - CHANGE IN PRODUCTION!
    passwordHash: '${adminHash}',
    displayName: 'Admin',
  },
  // Add more users here using npm run hash-password -- "password"
];

/**
 * Validate user credentials against the whitelist
 * @param nickname - User's nickname
 * @param password - Plain text password
 * @returns User object if valid, null otherwise
 */
export async function validateCredentials(
  nickname: string,
  password: string
): Promise<AllowedUser | null> {
  const user = ALLOWED_USERS.find(
    (u) => u.nickname.toLowerCase() === nickname.toLowerCase()
  );
  
  if (!user) {
    return null;
  }
  
  try {
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    return isValidPassword ? user : null;
  } catch {
    return null;
  }
}

/**
 * Check if a nickname is in the whitelist
 * @param nickname - Nickname to check
 * @returns True if user exists in whitelist
 */
export function isUserAllowed(nickname: string): boolean {
  return ALLOWED_USERS.some(
    (u) => u.nickname.toLowerCase() === nickname.toLowerCase()
  );
}

/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export default ALLOWED_USERS;
`;
  
  fs.writeFileSync(allowedUsersPath, allowedUsersContent);
  console.log('\n✓ Updated src/config/allowedUsers.ts with proper hash');
  
  console.log('\n✅ Initialization complete!\n');
  console.log('─'.repeat(60));
  console.log('\nNext steps:\n');
  console.log('1. Create a .env.local file with:');
  console.log('   NEXTAUTH_SECRET=your-secret-key-here');
  console.log('   NEXTAUTH_URL=http://localhost:3000\n');
  console.log('2. Run: npm run dev\n');
  console.log('3. Open http://localhost:3000\n');
  console.log('4. Login with: admin / gallery123\n');
  console.log('─'.repeat(60));
  console.log('\n💕 Enjoy your gallery!\n');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});

