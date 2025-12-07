import bcrypt from 'bcryptjs';
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
    passwordHash: '$2a$12$cpqQoQqv38YGibvsPttnueSAXRxWslxbG.GzmQj2y6G1zMuBxY8HS',
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
