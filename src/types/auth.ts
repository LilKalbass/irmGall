/**
 * Authentication types for the IRM Gallery application
 */

/**
 * User object stored in session
 */
export interface User {
  /** Unique identifier */
  id: string;
  /** Display nickname */
  nickname: string;
  /** User's avatar URL (optional) */
  avatarUrl?: string;
}

/**
 * Allowed user configuration (stored in config)
 */
export interface AllowedUser {
  /** User's nickname for login */
  nickname: string;
  /** Bcrypt hashed password */
  passwordHash: string;
  /** Optional display name */
  displayName?: string;
}

/**
 * Login credentials input
 */
export interface LoginCredentials {
  nickname: string;
  password: string;
}

/**
 * Session user type for NextAuth
 */
export interface SessionUser {
  id: string;
  nickname: string;
  name?: string;
}

/**
 * Extended session type
 */
export interface ExtendedSession {
  user: SessionUser;
  expires: string;
}

