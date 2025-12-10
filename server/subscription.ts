import { db } from "./db";
import { subscriptionPlans, userSubscriptions, insertPlanSchema, updatePlanSchema } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface SubscriptionPlanDTO {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  price: number;
  currency: string;
  period: "monthly" | "yearly";
  periodAr: string;
  monthlyPrice: number;
  trialDays: number;
  features: string[];
  featuresAr: string[];
  popular: boolean;
  stripePriceId: string | null;
  stripeProductId: string | null;
}

export interface UserSubscriptionDTO {
  userId: string;
  status: "free" | "plus" | "trial";
  planCode: string | null;
  activatedAt: string | null;
  expiresAt: string | null;
  trialEndsAt: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  moyasarPaymentId: string | null;
}

const DEFAULT_PLANS = [
  {
    code: "monthly",
    nameEn: "Monthly",
    nameAr: "شهري",
    price: "4.99",
    currency: "USD",
    period: "monthly",
    trialDays: 7,
    featuresEn: [
      "Qadha Pro - Track missed and made-up days",
      "Beauty Pro - Unlimited routines & products",
      "Full Knowledge Library - All fatwa & articles",
      "Full Mother Mode - Track daughters' cycles",
      "Partner Mode - Shared insights dashboard",
      "Watch Integration - Sync with smartwatch",
      "Detailed Insights & Analytics",
      "Favorites & Reading History",
      "Export Data",
    ],
    featuresAr: [
      "القضاء برو - تتبع الأيام الفائتة والمقضية",
      "الجمال برو - روتينات ومنتجات غير محدودة",
      "المكتبة الكاملة - جميع الفتاوى والمقالات",
      "وضع الأم الكامل - تتبع دورات البنات",
      "وضع الشريك - لوحة تحكم مشتركة",
      "ربط الساعة الذكية",
      "تحليلات وإحصائيات مفصلة",
      "المفضلة وسجل القراءة",
      "تصدير البيانات",
    ],
    isActive: true,
    isPopular: false,
  },
  {
    code: "yearly",
    nameEn: "Yearly",
    nameAr: "سنوي",
    price: "35.99",
    currency: "USD",
    period: "yearly",
    trialDays: 7,
    featuresEn: [
      "All Monthly features",
      "Save 40% compared to monthly",
      "Priority support",
    ],
    featuresAr: [
      "جميع مميزات الاشتراك الشهري",
      "وفر 40% مقارنة بالشهري",
      "دعم أولوية",
    ],
    isActive: true,
    isPopular: true,
  },
];

export async function seedDefaultPlans(): Promise<void> {
  try {
    const existingPlans = await db.select().from(subscriptionPlans);
    if (existingPlans.length === 0) {
      for (const plan of DEFAULT_PLANS) {
        await db.insert(subscriptionPlans).values(plan);
      }
      console.log("Default subscription plans seeded successfully");
    }
  } catch (error) {
    console.error("Error seeding default plans:", error);
  }
}

export async function getPlans(): Promise<SubscriptionPlanDTO[]> {
  try {
    const plans = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, true));
    
    return plans.map((plan) => {
      const price = parseFloat(plan.price);
      const monthlyPrice = plan.period === "yearly" ? price / 12 : price;
      
      return {
        id: plan.id,
        code: plan.code,
        name: plan.nameEn,
        nameAr: plan.nameAr,
        price,
        currency: plan.currency,
        period: plan.period as "monthly" | "yearly",
        periodAr: plan.period === "yearly" ? "سنة" : "شهر",
        monthlyPrice: Math.round(monthlyPrice * 100) / 100,
        trialDays: plan.trialDays,
        features: plan.featuresEn || [],
        featuresAr: plan.featuresAr || [],
        popular: plan.isPopular,
        stripePriceId: plan.stripePriceId,
        stripeProductId: plan.stripeProductId,
      };
    });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return [];
  }
}

export async function getAllPlans(): Promise<SubscriptionPlanDTO[]> {
  try {
    const plans = await db.select().from(subscriptionPlans);
    
    return plans.map((plan) => {
      const price = parseFloat(plan.price);
      const monthlyPrice = plan.period === "yearly" ? price / 12 : price;
      
      return {
        id: plan.id,
        code: plan.code,
        name: plan.nameEn,
        nameAr: plan.nameAr,
        price,
        currency: plan.currency,
        period: plan.period as "monthly" | "yearly",
        periodAr: plan.period === "yearly" ? "سنة" : "شهر",
        monthlyPrice: Math.round(monthlyPrice * 100) / 100,
        trialDays: plan.trialDays,
        features: plan.featuresEn || [],
        featuresAr: plan.featuresAr || [],
        popular: plan.isPopular,
        stripePriceId: plan.stripePriceId,
        stripeProductId: plan.stripeProductId,
      };
    });
  } catch (error) {
    console.error("Error fetching all plans:", error);
    return [];
  }
}

export async function getPlanById(id: string) {
  try {
    const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id));
    return plan || null;
  } catch (error) {
    console.error("Error fetching plan by id:", error);
    return null;
  }
}

export async function getPlanByCode(code: string) {
  try {
    const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.code, code));
    return plan || null;
  } catch (error) {
    console.error("Error fetching plan by code:", error);
    return null;
  }
}

export async function createPlan(data: unknown) {
  try {
    const parsed = insertPlanSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors };
    }
    
    const [newPlan] = await db.insert(subscriptionPlans).values(parsed.data).returning();
    return { success: true, plan: newPlan };
  } catch (error) {
    console.error("Error creating plan:", error);
    return { success: false, error: "Failed to create plan" };
  }
}

export async function updatePlan(id: string, data: unknown) {
  try {
    const parsed = updatePlanSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors };
    }
    
    const [updated] = await db
      .update(subscriptionPlans)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(subscriptionPlans.id, id))
      .returning();
    
    if (!updated) {
      return { success: false, error: "Plan not found" };
    }
    
    return { success: true, plan: updated };
  } catch (error) {
    console.error("Error updating plan:", error);
    return { success: false, error: "Failed to update plan" };
  }
}

export async function deletePlan(id: string) {
  try {
    const [deleted] = await db.delete(subscriptionPlans).where(eq(subscriptionPlans.id, id)).returning();
    
    if (!deleted) {
      return { success: false, error: "Plan not found" };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting plan:", error);
    return { success: false, error: "Failed to delete plan" };
  }
}

export async function getUserSubscription(userId: string): Promise<UserSubscriptionDTO> {
  try {
    const [sub] = await db.select().from(userSubscriptions).where(eq(userSubscriptions.userId, userId));
    
    if (sub) {
      let status = sub.status as "free" | "plus" | "trial";
      
      if (status === "trial" && sub.trialEndsAt) {
        if (sub.trialEndsAt < new Date()) {
          status = "free";
          await db.update(userSubscriptions)
            .set({ status: "free", planId: null, trialEndsAt: null, updatedAt: new Date() })
            .where(eq(userSubscriptions.userId, userId));
        }
      }
      
      if (status === "plus" && sub.expiresAt) {
        if (sub.expiresAt < new Date()) {
          status = "free";
          await db.update(userSubscriptions)
            .set({ status: "free", planId: null, expiresAt: null, updatedAt: new Date() })
            .where(eq(userSubscriptions.userId, userId));
        }
      }
      
      const plan = sub.planId ? await getPlanByCode(sub.planId) : null;
      
      return {
        userId: sub.userId,
        status,
        planCode: plan?.code || null,
        activatedAt: sub.activatedAt?.toISOString() || null,
        expiresAt: sub.expiresAt?.toISOString() || null,
        trialEndsAt: sub.trialEndsAt?.toISOString() || null,
        stripeCustomerId: sub.stripeCustomerId,
        stripeSubscriptionId: sub.stripeSubscriptionId,
        moyasarPaymentId: sub.moyasarPaymentId,
      };
    }
    
    return {
      userId,
      status: "free",
      planCode: null,
      activatedAt: null,
      expiresAt: null,
      trialEndsAt: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      moyasarPaymentId: null,
    };
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    return {
      userId,
      status: "free",
      planCode: null,
      activatedAt: null,
      expiresAt: null,
      trialEndsAt: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      moyasarPaymentId: null,
    };
  }
}

export async function activateSubscription(
  userId: string,
  planCode: "monthly" | "yearly",
  startTrial: boolean = false,
  moyasarPaymentId?: string,
  stripeCustomerId?: string,
  stripeSubscriptionId?: string
): Promise<UserSubscriptionDTO> {
  try {
    const plan = await getPlanByCode(planCode);
    const now = new Date();
    
    let expiresAt: Date;
    let trialEndsAt: Date | null = null;
    
    if (startTrial) {
      const trialDays = plan?.trialDays || 7;
      trialEndsAt = new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000);
    }
    
    if (planCode === "yearly") {
      expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    } else {
      expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }
    
    const [existing] = await db.select().from(userSubscriptions).where(eq(userSubscriptions.userId, userId));
    
    const subscriptionData = {
      userId,
      planId: planCode,
      status: startTrial ? "trial" : "plus",
      activatedAt: now,
      expiresAt,
      trialEndsAt,
      moyasarPaymentId: moyasarPaymentId || null,
      stripeCustomerId: stripeCustomerId || null,
      stripeSubscriptionId: stripeSubscriptionId || null,
      updatedAt: now,
    };
    
    if (existing) {
      await db.update(userSubscriptions).set(subscriptionData).where(eq(userSubscriptions.userId, userId));
    } else {
      await db.insert(userSubscriptions).values(subscriptionData);
    }
    
    return {
      userId,
      status: startTrial ? "trial" : "plus",
      planCode,
      activatedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      trialEndsAt: trialEndsAt?.toISOString() || null,
      stripeCustomerId: stripeCustomerId || null,
      stripeSubscriptionId: stripeSubscriptionId || null,
      moyasarPaymentId: moyasarPaymentId || null,
    };
  } catch (error) {
    console.error("Error activating subscription:", error);
    throw error;
  }
}

export async function cancelSubscription(userId: string): Promise<UserSubscriptionDTO> {
  try {
    const now = new Date();
    
    await db.update(userSubscriptions)
      .set({
        status: "free",
        planId: null,
        expiresAt: null,
        trialEndsAt: null,
        cancelledAt: now,
        updatedAt: now,
      })
      .where(eq(userSubscriptions.userId, userId));
    
    return {
      userId,
      status: "free",
      planCode: null,
      activatedAt: null,
      expiresAt: null,
      trialEndsAt: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      moyasarPaymentId: null,
    };
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    throw error;
  }
}

export async function updateStripeIds(
  userId: string,
  stripeCustomerId: string,
  stripeSubscriptionId: string
): Promise<void> {
  try {
    await db.update(userSubscriptions)
      .set({
        stripeCustomerId,
        stripeSubscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(userSubscriptions.userId, userId));
  } catch (error) {
    console.error("Error updating Stripe IDs:", error);
    throw error;
  }
}
