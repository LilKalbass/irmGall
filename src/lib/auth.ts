import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { validateCredentials } from '@/config/allowedUsers';

/**
 * NextAuth configuration for whitelist-based authentication
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        nickname: { 
          label: 'Nickname', 
          type: 'text',
          placeholder: 'Enter your nickname',
        },
        password: { 
          label: 'Password', 
          type: 'password',
          placeholder: 'Enter your password',
        },
      },
      async authorize(credentials) {
        if (!credentials?.nickname || !credentials?.password) {
          throw new Error('Please enter both nickname and password');
        }
        
        const user = await validateCredentials(
          credentials.nickname,
          credentials.password
        );
        
        if (!user) {
          throw new Error('Invalid nickname or password');
        }
        
        // Return user object for session
        return {
          id: user.nickname.toLowerCase(),
          name: user.displayName || user.nickname,
          nickname: user.nickname,
        };
      },
    }),
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      // Add user info to JWT on login
      if (user) {
        token.nickname = (user as unknown as { nickname: string }).nickname;
      }
      return token;
    },
    
    async session({ session, token }) {
      // Add user info to session
      if (session.user) {
        (session.user as unknown as { nickname: string }).nickname = token.nickname as string;
        (session.user as unknown as { id: string }).id = token.sub as string;
      }
      return session;
    },
  },
  
  pages: {
    signIn: '/login',
    error: '/login',
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  
  debug: process.env.NODE_ENV === 'development',
};

export default authOptions;

