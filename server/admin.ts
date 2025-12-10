import { Request, Response, NextFunction } from "express";
import { db } from "./db";
import { users, sessions, userSubscriptions, subscriptionPlans, articles } from "@shared/schema";
import { eq, count, desc, sql, and, gte } from "drizzle-orm";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

const SALT_LENGTH = 32;
const KEY_LENGTH = 64;

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function validateAdminSession(token: string): Promise<{ id: string; username: string; email: string; isAdmin: boolean } | null> {
  try {
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.token, token))
      .limit(1);

    if (!session || new Date(session.expiresAt) < new Date()) {
      return null;
    }

    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        isAdmin: users.isAdmin,
      })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user || !user.isAdmin) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error validating admin session:", error);
    return null;
  }
}

export async function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.substring(7);
  const admin = await validateAdminSession(token);

  if (!admin) {
    return res.status(403).json({ error: "Admin access required" });
  }

  (req as any).admin = admin;
  next();
}

export async function getDashboardStats() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [totalUsers] = await db.select({ count: count() }).from(users);
  const [newUsersThisMonth] = await db
    .select({ count: count() })
    .from(users)
    .where(gte(users.createdAt, thirtyDaysAgo));
  const [newUsersThisWeek] = await db
    .select({ count: count() })
    .from(users)
    .where(gte(users.createdAt, sevenDaysAgo));

  const [activeSubscriptions] = await db
    .select({ count: count() })
    .from(userSubscriptions)
    .where(eq(userSubscriptions.status, "active"));

  const [trialSubscriptions] = await db
    .select({ count: count() })
    .from(userSubscriptions)
    .where(eq(userSubscriptions.status, "trial"));

  const [totalArticles] = await db.select({ count: count() }).from(articles);

  const recentUsers = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      displayName: users.displayName,
      isAdmin: users.isAdmin,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(10);

  return {
    users: {
      total: totalUsers?.count || 0,
      newThisMonth: newUsersThisMonth?.count || 0,
      newThisWeek: newUsersThisWeek?.count || 0,
    },
    subscriptions: {
      active: activeSubscriptions?.count || 0,
      trial: trialSubscriptions?.count || 0,
    },
    articles: {
      total: totalArticles?.count || 0,
    },
    recentUsers,
  };
}

export async function getAllUsers(page: number = 1, limit: number = 20) {
  const offset = (page - 1) * limit;
  
  const [totalCount] = await db.select({ count: count() }).from(users);
  
  const usersList = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      displayName: users.displayName,
      profilePicture: users.profilePicture,
      isAdmin: users.isAdmin,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(limit)
    .offset(offset);

  return {
    users: usersList,
    pagination: {
      page,
      limit,
      total: totalCount?.count || 0,
      totalPages: Math.ceil((totalCount?.count || 0) / limit),
    },
  };
}

export async function getUserById(userId: string) {
  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      displayName: users.displayName,
      profilePicture: users.profilePicture,
      isAdmin: users.isAdmin,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) return null;

  const [subscription] = await db
    .select()
    .from(userSubscriptions)
    .where(eq(userSubscriptions.userId, userId))
    .limit(1);

  return { user, subscription };
}

export async function updateUserAdmin(userId: string, updates: { isAdmin?: boolean; displayName?: string }) {
  const [updatedUser] = await db
    .update(users)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
      username: users.username,
      email: users.email,
      displayName: users.displayName,
      isAdmin: users.isAdmin,
    });

  return updatedUser;
}

export async function deleteUser(userId: string) {
  await db.delete(users).where(eq(users.id, userId));
  return { success: true };
}

export async function createAdminUser(username: string, email: string, password: string) {
  const hashedPassword = await hashPassword(password);
  
  const [newUser] = await db
    .insert(users)
    .values({
      username,
      email,
      password: hashedPassword,
      isAdmin: true,
    })
    .returning({
      id: users.id,
      username: users.username,
      email: users.email,
      isAdmin: users.isAdmin,
    });

  return newUser;
}

export async function getAllSubscriptions(page: number = 1, limit: number = 20) {
  const offset = (page - 1) * limit;
  
  const [totalCount] = await db.select({ count: count() }).from(userSubscriptions);
  
  const subscriptionsList = await db
    .select()
    .from(userSubscriptions)
    .orderBy(desc(userSubscriptions.createdAt))
    .limit(limit)
    .offset(offset);

  return {
    subscriptions: subscriptionsList,
    pagination: {
      page,
      limit,
      total: totalCount?.count || 0,
      totalPages: Math.ceil((totalCount?.count || 0) / limit),
    },
  };
}

export async function getSubscriptionPlans() {
  return await db.select().from(subscriptionPlans).orderBy(subscriptionPlans.createdAt);
}

export async function createAppUser(username: string, email: string, password: string, displayName?: string) {
  const hashedPassword = await hashPassword(password);
  
  const [newUser] = await db
    .insert(users)
    .values({
      username,
      email,
      password: hashedPassword,
      displayName: displayName || username,
      isAdmin: false,
    })
    .returning({
      id: users.id,
      username: users.username,
      email: users.email,
      displayName: users.displayName,
      isAdmin: users.isAdmin,
      createdAt: users.createdAt,
    });

  return newUser;
}

export async function grantPremiumAccess(userId: string, durationDays: number = 365) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);
  
  const [existing] = await db
    .select()
    .from(userSubscriptions)
    .where(eq(userSubscriptions.userId, userId))
    .limit(1);
  
  if (existing) {
    const [updated] = await db
      .update(userSubscriptions)
      .set({
        status: "active",
        activatedAt: now,
        expiresAt: expiresAt,
        cancelledAt: null,
        updatedAt: now,
      })
      .where(eq(userSubscriptions.userId, userId))
      .returning();
    return updated;
  } else {
    const [created] = await db
      .insert(userSubscriptions)
      .values({
        userId,
        status: "active",
        activatedAt: now,
        expiresAt: expiresAt,
      })
      .returning();
    return created;
  }
}

export async function revokePremiumAccess(userId: string) {
  const now = new Date();
  
  const [existing] = await db
    .select()
    .from(userSubscriptions)
    .where(eq(userSubscriptions.userId, userId))
    .limit(1);
  
  if (existing) {
    const [updated] = await db
      .update(userSubscriptions)
      .set({
        status: "free",
        cancelledAt: now,
        updatedAt: now,
      })
      .where(eq(userSubscriptions.userId, userId))
      .returning();
    return updated;
  }
  
  return null;
}

export async function getUsersWithSubscriptions(page: number = 1, limit: number = 20) {
  const offset = (page - 1) * limit;
  
  const [totalCount] = await db.select({ count: count() }).from(users);
  
  const usersList = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      displayName: users.displayName,
      isAdmin: users.isAdmin,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt))
    .limit(limit)
    .offset(offset);

  const usersWithSubs = await Promise.all(
    usersList.map(async (user) => {
      const [subscription] = await db
        .select()
        .from(userSubscriptions)
        .where(eq(userSubscriptions.userId, user.id))
        .limit(1);
      
      return {
        ...user,
        subscription: subscription || null,
        isPremium: subscription?.status === "active" || subscription?.status === "trial",
      };
    })
  );

  return {
    users: usersWithSubs,
    pagination: {
      page,
      limit,
      total: totalCount?.count || 0,
      totalPages: Math.ceil((totalCount?.count || 0) / limit),
    },
  };
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, key] = hash.split(":");
  if (!salt || !key) return false;
  
  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  const keyBuffer = Buffer.from(key, "hex");
  
  return timingSafeEqual(derivedKey, keyBuffer);
}

export async function changeAdminPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return { success: false, error: "المستخدم غير موجود" };
    }

    const isValid = await verifyPassword(currentPassword, user.password);
    if (!isValid) {
      return { success: false, error: "كلمة المرور الحالية غير صحيحة" };
    }

    if (newPassword.length < 6) {
      return { success: false, error: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل" };
    }

    const newHash = await hashPassword(newPassword);
    await db
      .update(users)
      .set({ password: newHash, updatedAt: new Date() })
      .where(eq(users.id, userId));

    return { success: true };
  } catch (error) {
    console.error("Error changing password:", error);
    return { success: false, error: "حدث خطأ أثناء تغيير كلمة المرور" };
  }
}
