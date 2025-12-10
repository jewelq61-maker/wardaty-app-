import { db } from "./db";
import { users, sessions, registerSchema, loginSchema, type User } from "@shared/schema";
import { eq } from "drizzle-orm";
import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

const SALT_LENGTH = 32;
const KEY_LENGTH = 64;
const SESSION_EXPIRY_DAYS = 30;

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, key] = hash.split(":");
  if (!salt || !key) return false;
  
  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  const keyBuffer = Buffer.from(key, "hex");
  
  return timingSafeEqual(derivedKey, keyBuffer);
}

function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export async function registerUser(data: unknown): Promise<{ success: true; user: Omit<User, "password">; token: string } | { success: false; error: string }> {
  const parsed = registerSchema.safeParse(data);
  
  if (!parsed.success) {
    return { success: false, error: "Invalid registration data" };
  }
  
  const { username, email, password, displayName } = parsed.data;
  
  const existingEmail = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existingEmail.length > 0) {
    return { success: false, error: "Email already registered" };
  }
  
  const existingUsername = await db.select().from(users).where(eq(users.username, username)).limit(1);
  if (existingUsername.length > 0) {
    return { success: false, error: "Username already taken" };
  }
  
  const hashedPassword = await hashPassword(password);
  
  const [newUser] = await db
    .insert(users)
    .values({
      username,
      email,
      password: hashedPassword,
      displayName: displayName || username,
    })
    .returning();
  
  const token = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);
  
  await db.insert(sessions).values({
    userId: newUser.id,
    token,
    expiresAt,
  });
  
  const { password: _, ...userWithoutPassword } = newUser;
  
  return { success: true, user: userWithoutPassword, token };
}

export async function loginUser(data: unknown): Promise<{ success: true; user: Omit<User, "password">; token: string } | { success: false; error: string }> {
  const parsed = loginSchema.safeParse(data);
  
  if (!parsed.success) {
    return { success: false, error: "Invalid login data" };
  }
  
  const { email, password } = parsed.data;
  
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  
  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }
  
  const isValid = await verifyPassword(password, user.password);
  
  if (!isValid) {
    return { success: false, error: "Invalid email or password" };
  }
  
  const token = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);
  
  await db.insert(sessions).values({
    userId: user.id,
    token,
    expiresAt,
  });
  
  const { password: _, ...userWithoutPassword } = user;
  
  return { success: true, user: userWithoutPassword, token };
}

export async function validateSession(token: string): Promise<{ valid: true; user: Omit<User, "password"> } | { valid: false }> {
  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.token, token))
    .limit(1);
  
  if (!session || new Date(session.expiresAt) < new Date()) {
    if (session) {
      await db.delete(sessions).where(eq(sessions.token, token));
    }
    return { valid: false };
  }
  
  const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
  
  if (!user) {
    return { valid: false };
  }
  
  const { password: _, ...userWithoutPassword } = user;
  
  return { valid: true, user: userWithoutPassword };
}

export async function logoutUser(token: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.token, token));
}

export async function getUserById(userId: string): Promise<Omit<User, "password"> | null> {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  
  if (!user) {
    return null;
  }
  
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function updateUserProfile(userId: string, updates: { displayName?: string; profilePicture?: string }): Promise<Omit<User, "password"> | null> {
  const [updated] = await db
    .update(users)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();
  
  if (!updated) {
    return null;
  }
  
  const { password: _, ...userWithoutPassword } = updated;
  return userWithoutPassword;
}
