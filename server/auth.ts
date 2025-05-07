import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import * as crypto from 'crypto';
import { db } from '../db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { Request, Response, NextFunction } from 'express';

// Hash password with SHA-256 and salt
export function hashPassword(password: string, salt: string): string {
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

// Generate random salt
export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

// Microsoft OAuth Configuration
if (!process.env.MICROSOFT_CLIENT_ID || !process.env.MICROSOFT_CLIENT_SECRET || !process.env.MICROSOFT_TENANT_ID) {
  console.error('Missing required Microsoft OAuth environment variables');
}
const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID || '';
const MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET || '';
const MICROSOFT_TENANT_ID = process.env.MICROSOFT_TENANT_ID || '';
const CALLBACK_URL = process.env.MICROSOFT_CALLBACK_URL || 'http://localhost:3000/api/auth/microsoft/callback';

// Configure passport to use local strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      console.log(`Login attempt for user: ${username}`);
      
      // Find user by username
      const userResults = await db.select().from(users).where(eq(users.username, username));
      
      if (userResults.length === 0) {
        console.log(`User not found: ${username}`);
        return done(null, false, { message: 'Incorrect username or password.' });
      }
      
      const user = userResults[0];
      console.log(`User found: ${username}, Has password: ${!!user.password}, OAuth provider: ${user.oauth_provider || 'none'}`);
      
      // Check if this is an OAuth user without a password
      if (user.oauth_provider && !user.password) {
        console.log(`OAuth user without password: ${username}`);
        return done(null, false, { message: `Please sign in with ${user.oauth_provider}` });
      }
      
      // Make sure password exists
      if (!user.password) {
        console.log(`User has no password set: ${username}`);
        return done(null, false, { message: 'Invalid account configuration.' });
      }
      
      // Split stored password into hash and salt
      const [storedHash, salt] = user.password.split(':');
      
      // Hash the provided password with the same salt
      const computedHash = hashPassword(password, salt);
      
      // Compare the hashes
      if (storedHash !== computedHash) {
        console.log(`Password mismatch for user: ${username}`);
        return done(null, false, { message: 'Incorrect username or password.' });
      }
      
      console.log(`Successful login for user: ${username}`);
      return done(null, user);
    } catch (err) {
      console.error(`Login error for user ${username}:`, err);
      return done(err);
    }
  })
);

// Configure Microsoft OAuth strategy
passport.use(
  new MicrosoftStrategy(
    {
      clientID: MICROSOFT_CLIENT_ID,
      clientSecret: MICROSOFT_CLIENT_SECRET,
      tenant: MICROSOFT_TENANT_ID,
      callbackURL: CALLBACK_URL,
      scope: ['user.read'],
      authorizationURL: `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/oauth2/v2.0/authorize`,
      tokenURL: `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/oauth2/v2.0/token`,
    },
    async (
      accessToken: string, 
      refreshToken: string, 
      profile: { id: string; displayName?: string; emails?: { value: string }[] }, 
      done: (error: any, user?: any) => void
    ) => {
      try {
        // Check if user already exists
        const email = profile.emails && profile.emails[0]?.value;
        if (!email) {
          return done(new Error('Email is required from Microsoft profile'));
        }

        // Try to find user by email
        const userResults = await db.select().from(users).where(eq(users.username, email));
        
        if (userResults.length > 0) {
          // User exists, return the user
          return done(null, userResults[0]);
        }
        
        // Create a new user with Microsoft profile
        const result = await db.insert(users).values({
          username: email,
          password: null, // No password for OAuth users
          oauth_provider: 'microsoft',
          oauth_id: profile.id,
          display_name: profile.displayName || email
        }).returning();
        
        return done(null, result[0]);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize user to session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: number, done) => {
  try {
    const userResults = await db.select().from(users).where(eq(users.id, id));
    if (userResults.length === 0) {
      return done(null, false);
    }
    
    const user = userResults[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Middleware to check if user is authenticated
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  
  res.status(401).json({ message: 'Unauthorized' });
}

// Register a new user
export async function registerUser(username: string, password: string) {
  // Check if user already exists
  const existingUser = await db.select().from(users).where(eq(users.username, username));
  
  if (existingUser.length > 0) {
    throw new Error('Username already exists');
  }
  
  // Generate salt
  const salt = generateSalt();
  
  // Hash password with salt
  const hashedPassword = hashPassword(password, salt);
  
  // Store hash and salt together
  const passwordWithSalt = `${hashedPassword}:${salt}`;
  
  // Insert new user
  const result = await db.insert(users).values({
    username,
    password: passwordWithSalt
  }).returning();
  
  return result[0];
}

// Generate password reset token
export async function generateResetToken(username: string): Promise<string | null> {
  // Find user by username
  const userResults = await db.select().from(users).where(eq(users.username, username));
  
  if (userResults.length === 0) {
    return null;
  }
  
  // Generate token
  const token = crypto.randomBytes(32).toString('hex');
  
  // In a real application, you would store this token in the database
  // with an expiration time and associate it with the user
  // For simplicity, we're just returning the token
  
  return token;
}

export default passport; 