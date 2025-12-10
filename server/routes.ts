import type { Express } from "express";
import { createServer, type Server } from "node:http";
import path from "node:path";
import { db } from "./db";
import { 
  articles, insertArticleSchema, updateArticleSchema, 
  users, userSubscriptions, subscriptionPlans,
  fatwas, insertFatwaSchema,
  cycleLogs, qadhaLogs,
  beautyProducts, insertBeautyProductSchema,
  beautyRoutines, insertBeautyRoutineSchema,
  daughters,
  notificationTemplates, insertNotificationTemplateSchema,
  notifications, insertNotificationSchema,
  adminRoles, insertAdminRoleSchema, adminUserRoles,
  featureFlags, insertFeatureFlagSchema,
  appSettings, insertAppSettingSchema,
  auditLogs, insertAuditLogSchema
} from "@shared/schema";
import { eq, and, ne, sql, or, isNull, count, gte, desc } from "drizzle-orm";
import { 
  getPlans, 
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  getUserSubscription, 
  activateSubscription, 
  cancelSubscription,
  seedDefaultPlans 
} from "./subscription";
import { generatePartnerCode, connectPartner, getPartnerSummary } from "./partner";
import {
  isStripeConfigured,
  createCheckoutSession,
  createCustomerPortalSession,
  cancelStripeSubscription,
  handleWebhookEvent,
} from "./stripe";
import {
  isMoyasarConfigured,
  getMoyasarPublishableKey,
  createSubscriptionPayment,
  handlePaymentCallback,
  handlePaymentWebhook,
  getPayment,
} from "./moyasar";
import {
  registerUser,
  loginUser,
  validateSession,
  logoutUser,
  updateUserProfile,
} from "./auth";
import {
  adminAuthMiddleware,
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserAdmin,
  deleteUser,
  createAdminUser,
  getAllSubscriptions,
  getSubscriptionPlans,
  createAppUser,
  grantPremiumAccess,
  revokePremiumAccess,
  getUsersWithSubscriptions,
  changeAdminPassword,
} from "./admin";

export async function registerRoutes(app: Express): Promise<Server> {
  await seedDefaultPlans();
  
  // ============ AUTH ROUTES ============
  
  app.post("/api/auth/register", async (req, res) => {
    try {
      const result = await registerUser(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      res.status(201).json({ user: result.user, token: result.token });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Failed to register" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const result = await loginUser(req.body);
      if (!result.success) {
        return res.status(401).json({ error: result.error });
      }
      res.json({ user: result.user, token: result.token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
      }
      
      const token = authHeader.split(" ")[1];
      const result = await validateSession(token);
      
      if (!result.valid) {
        return res.status(401).json({ error: "Invalid or expired session" });
      }
      
      res.json({ user: result.user });
    } catch (error) {
      console.error("Session validation error:", error);
      res.status(500).json({ error: "Failed to validate session" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        await logoutUser(token);
      }
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ error: "Failed to logout" });
    }
  });

  app.put("/api/auth/profile", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
      }
      
      const token = authHeader.split(" ")[1];
      const sessionResult = await validateSession(token);
      
      if (!sessionResult.valid) {
        return res.status(401).json({ error: "Invalid or expired session" });
      }
      
      const { displayName, profilePicture } = req.body;
      const updated = await updateUserProfile(sessionResult.user.id, { displayName, profilePicture });
      
      if (!updated) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json({ user: updated });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });
  
  // GET all articles (optionally filtered by persona)
  app.get("/api/articles", async (req, res) => {
    try {
      const { persona } = req.query;
      
      let allArticles;
      if (persona && typeof persona === 'string') {
        allArticles = await db.select().from(articles)
          .where(
            or(
              isNull(articles.personas),
              sql`${articles.personas} @> ARRAY[${persona}]::text[]`
            )
          )
          .orderBy(articles.createdAt);
      } else {
        allArticles = await db.select().from(articles).orderBy(articles.createdAt);
      }
      
      res.json(allArticles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  // GET single article by ID
  app.get("/api/articles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const [article] = await db.select().from(articles).where(eq(articles.id, id));
      
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  // GET related articles (same category, different article)
  app.get("/api/articles/:id/related", async (req, res) => {
    try {
      const { id } = req.params;
      const { persona, limit = "3" } = req.query;
      const limitNum = parseInt(limit as string, 10);
      
      const [article] = await db.select().from(articles).where(eq(articles.id, id));
      
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      const baseConditions = [
        eq(articles.category, article.category),
        ne(articles.id, id)
      ];
      
      if (persona && typeof persona === 'string') {
        baseConditions.push(
          or(
            isNull(articles.personas),
            sql`${articles.personas} @> ARRAY[${persona}]::text[]`
          ) as any
        );
      }
      
      const relatedArticles = await db.select().from(articles)
        .where(and(...baseConditions))
        .orderBy(articles.createdAt)
        .limit(limitNum);
      
      res.json(relatedArticles);
    } catch (error) {
      console.error("Error fetching related articles:", error);
      res.status(500).json({ error: "Failed to fetch related articles" });
    }
  });

  // POST create new article
  app.post("/api/articles", async (req, res) => {
    try {
      const parsed = insertArticleSchema.safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid article data", details: parsed.error.errors });
      }
      
      const [newArticle] = await db.insert(articles).values(parsed.data).returning();
      res.status(201).json(newArticle);
    } catch (error) {
      console.error("Error creating article:", error);
      res.status(500).json({ error: "Failed to create article" });
    }
  });

  // PUT update article
  app.put("/api/articles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const parsed = updateArticleSchema.safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid article data", details: parsed.error.errors });
      }
      
      const [updated] = await db
        .update(articles)
        .set({ ...parsed.data, updatedAt: new Date() })
        .where(eq(articles.id, id))
        .returning();
      
      if (!updated) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating article:", error);
      res.status(500).json({ error: "Failed to update article" });
    }
  });

  // DELETE article
  app.delete("/api/articles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const [deleted] = await db.delete(articles).where(eq(articles.id, id)).returning();
      
      if (!deleted) {
        return res.status(404).json({ error: "Article not found" });
      }
      
      res.json({ message: "Article deleted successfully" });
    } catch (error) {
      console.error("Error deleting article:", error);
      res.status(500).json({ error: "Failed to delete article" });
    }
  });

  // POST bulk create articles (admin only)
  app.post("/api/articles/bulk", adminAuthMiddleware, async (req, res) => {
    try {
      const { articles: articlesData } = req.body;
      
      if (!Array.isArray(articlesData) || articlesData.length === 0) {
        return res.status(400).json({ error: "يجب تقديم مصفوفة من المقالات" });
      }

      if (articlesData.length > 100) {
        return res.status(400).json({ error: "الحد الأقصى 100 مقال في المرة الواحدة" });
      }

      const results = {
        success: [] as any[],
        failed: [] as { index: number; error: string; data?: any }[]
      };

      for (let i = 0; i < articlesData.length; i++) {
        const articleData = articlesData[i];
        const parsed = insertArticleSchema.safeParse(articleData);
        
        if (!parsed.success) {
          results.failed.push({
            index: i,
            error: parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
            data: articleData
          });
          continue;
        }
        
        try {
          const [newArticle] = await db.insert(articles).values(parsed.data).returning();
          results.success.push(newArticle);
        } catch (dbError: any) {
          results.failed.push({
            index: i,
            error: dbError.message || "خطأ في قاعدة البيانات",
            data: articleData
          });
        }
      }

      res.status(201).json({
        message: `تم إضافة ${results.success.length} مقال بنجاح`,
        totalProvided: articlesData.length,
        successCount: results.success.length,
        failedCount: results.failed.length,
        success: results.success,
        failed: results.failed
      });
    } catch (error) {
      console.error("Error bulk creating articles:", error);
      res.status(500).json({ error: "فشل في إضافة المقالات" });
    }
  });

  // GET subscription plans (active only - for users)
  app.get("/api/subscription/plans", async (_req, res) => {
    try {
      const plans = await getPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      res.status(500).json({ error: "Failed to fetch subscription plans" });
    }
  });

  // GET current user subscription
  app.get("/api/subscription/current", async (req, res) => {
    try {
      const userId = (req.query.userId as string) || "default-user";
      const subscription = await getUserSubscription(userId);
      res.json(subscription);
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ error: "Failed to fetch subscription" });
    }
  });

  // POST activate subscription
  app.post("/api/subscription/activate", async (req, res) => {
    try {
      const { userId = "default-user", planCode, startTrial = true, stripeCustomerId, stripeSubscriptionId } = req.body;
      
      if (!planCode || !["monthly", "yearly"].includes(planCode)) {
        return res.status(400).json({ error: "Invalid plan code. Must be 'monthly' or 'yearly'" });
      }
      
      const subscription = await activateSubscription(userId, planCode, startTrial, stripeCustomerId, stripeSubscriptionId);
      res.json({ 
        success: true, 
        message: startTrial ? "Trial activated successfully" : "Subscription activated successfully",
        subscription 
      });
    } catch (error) {
      console.error("Error activating subscription:", error);
      res.status(500).json({ error: "Failed to activate subscription" });
    }
  });

  // POST cancel subscription
  app.post("/api/subscription/cancel", async (req, res) => {
    try {
      const { userId = "default-user" } = req.body;
      const subscription = await cancelSubscription(userId);
      res.json({ 
        success: true, 
        message: "Subscription cancelled successfully",
        subscription 
      });
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      res.status(500).json({ error: "Failed to cancel subscription" });
    }
  });

  // ============ STRIPE PAYMENT ROUTES ============
  
  // GET Stripe configuration status
  app.get("/api/stripe/status", (_req, res) => {
    res.json({ 
      configured: isStripeConfigured(),
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null,
    });
  });

  // POST create checkout session
  app.post("/api/stripe/create-checkout-session", async (req, res) => {
    try {
      if (!isStripeConfigured()) {
        return res.status(503).json({ 
          error: "Payment system not configured", 
          message: "Stripe is not set up. Please use trial activation instead." 
        });
      }
      
      const { userId = "default-user", planCode, successUrl, cancelUrl } = req.body;
      
      if (!planCode || !["monthly", "yearly"].includes(planCode)) {
        return res.status(400).json({ error: "Invalid plan code" });
      }
      
      if (!successUrl || !cancelUrl) {
        return res.status(400).json({ error: "Success and cancel URLs are required" });
      }
      
      const session = await createCheckoutSession(userId, planCode, successUrl, cancelUrl);
      res.json(session);
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // POST create customer portal session
  app.post("/api/stripe/create-portal-session", async (req, res) => {
    try {
      if (!isStripeConfigured()) {
        return res.status(503).json({ error: "Payment system not configured" });
      }
      
      const { userId = "default-user", returnUrl } = req.body;
      
      if (!returnUrl) {
        return res.status(400).json({ error: "Return URL is required" });
      }
      
      const subscription = await getUserSubscription(userId);
      
      if (!subscription.stripeCustomerId) {
        return res.status(400).json({ error: "No Stripe customer found for this user" });
      }
      
      const session = await createCustomerPortalSession(subscription.stripeCustomerId, returnUrl);
      res.json(session);
    } catch (error) {
      console.error("Error creating portal session:", error);
      res.status(500).json({ error: "Failed to create portal session" });
    }
  });

  // POST cancel Stripe subscription
  app.post("/api/stripe/cancel-subscription", async (req, res) => {
    try {
      if (!isStripeConfigured()) {
        return res.status(503).json({ error: "Payment system not configured" });
      }
      
      const { userId = "default-user" } = req.body;
      const subscription = await getUserSubscription(userId);
      
      if (!subscription.stripeSubscriptionId) {
        return res.status(400).json({ error: "No active Stripe subscription found" });
      }
      
      await cancelStripeSubscription(subscription.stripeSubscriptionId);
      const updated = await cancelSubscription(userId);
      
      res.json({ 
        success: true, 
        message: "Subscription cancelled successfully",
        subscription: updated 
      });
    } catch (error) {
      console.error("Error cancelling Stripe subscription:", error);
      res.status(500).json({ error: "Failed to cancel subscription" });
    }
  });

  // POST Stripe webhook
  app.post("/api/stripe/webhook", async (req, res) => {
    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      
      if (!webhookSecret) {
        console.warn("Stripe webhook secret not configured");
        return res.status(503).json({ error: "Webhook not configured" });
      }
      
      const signature = req.headers["stripe-signature"] as string;
      
      if (!signature) {
        return res.status(400).json({ error: "Missing Stripe signature" });
      }
      
      const result = await handleWebhookEvent(req.body, signature, webhookSecret);
      res.json(result);
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(400).json({ error: "Webhook processing failed" });
    }
  });

  // ============ MOYASAR PAYMENT ROUTES ============
  
  // GET Moyasar configuration status
  app.get("/api/moyasar/status", (_req, res) => {
    res.json({ 
      configured: isMoyasarConfigured(),
      publishableKey: getMoyasarPublishableKey(),
    });
  });

  // POST create payment form
  app.post("/api/moyasar/create-payment", async (req, res) => {
    try {
      if (!isMoyasarConfigured()) {
        return res.status(503).json({ 
          error: "Payment system not configured", 
          message: "Moyasar is not set up. Please use trial activation instead." 
        });
      }
      
      const { userId = "default-user", planCode, callbackUrl } = req.body;
      
      if (!planCode || !["monthly", "yearly"].includes(planCode)) {
        return res.status(400).json({ error: "Invalid plan code" });
      }
      
      if (!callbackUrl) {
        return res.status(400).json({ error: "Callback URL is required" });
      }
      
      const result = await createSubscriptionPayment(userId, planCode, callbackUrl);
      res.json(result);
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(500).json({ error: "Failed to create payment" });
    }
  });

  // GET payment callback (redirect after payment)
  app.get("/api/moyasar/callback", async (req, res) => {
    try {
      const { id, status } = req.query;
      
      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Payment ID is required" });
      }
      
      const result = await handlePaymentCallback(id, status as string);
      
      if (result.success) {
        res.redirect("/subscription/success");
      } else {
        res.redirect(`/subscription/cancel?error=${encodeURIComponent(result.error || "Payment failed")}`);
      }
    } catch (error) {
      console.error("Payment callback error:", error);
      res.redirect("/subscription/cancel?error=Processing+failed");
    }
  });

  // GET payment status (for polling from app)
  app.get("/api/moyasar/payment/:id", async (req, res) => {
    try {
      if (!isMoyasarConfigured()) {
        return res.status(503).json({ error: "Payment system not configured" });
      }
      
      const { id } = req.params;
      const payment = await getPayment(id);
      res.json(payment);
    } catch (error) {
      console.error("Error fetching payment:", error);
      res.status(500).json({ error: "Failed to fetch payment" });
    }
  });

  // POST Moyasar webhook
  app.post("/api/moyasar/webhook", async (req, res) => {
    try {
      const { id, type } = req.body;
      
      if (!id || !type) {
        return res.status(400).json({ error: "Invalid webhook payload" });
      }
      
      const result = await handlePaymentWebhook(id, type);
      res.json(result);
    } catch (error) {
      console.error("Moyasar webhook error:", error);
      res.status(400).json({ error: "Webhook processing failed" });
    }
  });

  // ============ ADMIN API ROUTES FOR PLAN MANAGEMENT ============
  
  // GET all plans (including inactive - for admin)
  app.get("/api/admin/plans", adminAuthMiddleware, async (_req, res) => {
    try {
      const plans = await getAllPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching all plans:", error);
      res.status(500).json({ error: "Failed to fetch plans" });
    }
  });

  // GET single plan by ID
  app.get("/api/admin/plans/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const plan = await getPlanById(id);
      
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }
      
      res.json(plan);
    } catch (error) {
      console.error("Error fetching plan:", error);
      res.status(500).json({ error: "Failed to fetch plan" });
    }
  });

  // POST create new plan
  app.post("/api/admin/plans", adminAuthMiddleware, async (req, res) => {
    try {
      const result = await createPlan(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      
      res.status(201).json(result.plan);
    } catch (error) {
      console.error("Error creating plan:", error);
      res.status(500).json({ error: "Failed to create plan" });
    }
  });

  // PUT update plan
  app.put("/api/admin/plans/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const result = await updatePlan(id, req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      
      res.json(result.plan);
    } catch (error) {
      console.error("Error updating plan:", error);
      res.status(500).json({ error: "Failed to update plan" });
    }
  });

  // DELETE plan
  app.delete("/api/admin/plans/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const result = await deletePlan(id);
      
      if (!result.success) {
        return res.status(404).json({ error: result.error });
      }
      
      res.json({ message: "Plan deleted successfully" });
    } catch (error) {
      console.error("Error deleting plan:", error);
      res.status(500).json({ error: "Failed to delete plan" });
    }
  });

  // POST generate partner code
  app.post("/api/partner/generateCode", async (req, res) => {
    try {
      const { userId = "default-user" } = req.body;
      
      const subscription = await getUserSubscription(userId);
      if (subscription.status !== "plus" && subscription.status !== "trial") {
        return res.status(403).json({ error: "Partner mode requires Wardaty Plus subscription" });
      }
      
      const { code, expiresAt } = generatePartnerCode(userId);
      res.json({ code, expiresAt: expiresAt.toISOString() });
    } catch (error) {
      console.error("Error generating partner code:", error);
      res.status(500).json({ error: "Failed to generate partner code" });
    }
  });

  // POST connect as partner
  app.post("/api/partner/connect", (req, res) => {
    try {
      const { code } = req.body;
      
      if (!code || typeof code !== "string" || code.length !== 6) {
        return res.status(400).json({ error: "Invalid code format" });
      }
      
      const partnerId = `partner-${Date.now()}`;
      const result = connectPartner(code, partnerId);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      
      res.json({ linkedUserId: result.linkedUserId, mode: "partner" });
    } catch (error) {
      console.error("Error connecting as partner:", error);
      res.status(500).json({ error: "Failed to connect as partner" });
    }
  });

  // GET partner summary
  app.get("/api/partner/summary", (req, res) => {
    try {
      const { userId } = req.query;
      
      if (!userId || typeof userId !== "string") {
        return res.status(400).json({ error: "User ID required" });
      }
      
      const summary = getPartnerSummary(userId);
      res.json(summary);
    } catch (error) {
      console.error("Error fetching partner summary:", error);
      res.status(500).json({ error: "Failed to fetch partner summary" });
    }
  });

  // ============ ADMIN DASHBOARD ROUTES ============

  // Serve admin dashboard HTML
  app.get("/admin", (_req, res) => {
    res.sendFile(path.join(process.cwd(), "server/public/admin/index.html"));
  });

  app.get("/admin/*", (_req, res) => {
    res.sendFile(path.join(process.cwd(), "server/public/admin/index.html"));
  });

  // Admin API: Dashboard stats
  app.get("/api/admin/dashboard/stats", adminAuthMiddleware, async (_req, res) => {
    try {
      const stats = await getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Admin API: Get all users
  app.get("/api/admin/users", adminAuthMiddleware, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await getAllUsers(page, limit);
      res.json(result);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Admin API: Get single user
  app.get("/api/admin/users/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const result = await getUserById(req.params.id);
      if (!result) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(result);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Admin API: Update user
  app.put("/api/admin/users/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const updated = await updateUserAdmin(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Admin API: Delete user
  app.delete("/api/admin/users/:id", adminAuthMiddleware, async (req, res) => {
    try {
      await deleteUser(req.params.id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Admin API: Get all subscriptions
  app.get("/api/admin/subscriptions", adminAuthMiddleware, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await getAllSubscriptions(page, limit);
      res.json(result);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      res.status(500).json({ error: "Failed to fetch subscriptions" });
    }
  });

  // Admin API: Create admin user (no auth required for initial setup)
  app.post("/api/admin/setup", async (req, res) => {
    try {
      const { username, email, password, setupKey } = req.body;
      
      // Simple setup key protection (in production, use a more secure method)
      const expectedKey = process.env.ADMIN_SETUP_KEY || "wardaty-admin-setup-2024";
      if (setupKey !== expectedKey) {
        return res.status(403).json({ error: "Invalid setup key" });
      }
      
      const admin = await createAdminUser(username, email, password);
      res.status(201).json({ message: "Admin user created", admin });
    } catch (error: any) {
      console.error("Error creating admin user:", error);
      if (error.message?.includes("duplicate")) {
        return res.status(400).json({ error: "Username or email already exists" });
      }
      res.status(500).json({ error: "Failed to create admin user" });
    }
  });

  // Admin login route
  app.post("/api/admin/login", async (req, res) => {
    try {
      const result = await loginUser(req.body);
      if (!result.success) {
        return res.status(401).json({ error: result.error });
      }
      
      // Check if user is admin
      if (!result.user?.isAdmin) {
        return res.status(403).json({ error: "Admin access required" });
      }
      
      res.json({ user: result.user, token: result.token });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });

  // Admin API: Create app user
  app.post("/api/admin/users", adminAuthMiddleware, async (req, res) => {
    try {
      const { username, email, password, displayName } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json({ error: "Username, email, and password are required" });
      }
      
      const user = await createAppUser(username, email, password, displayName);
      res.status(201).json({ message: "User created successfully", user });
    } catch (error: any) {
      console.error("Error creating user:", error);
      if (error.message?.includes("duplicate")) {
        return res.status(400).json({ error: "Username or email already exists" });
      }
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  // Admin API: Create admin user (from admin panel)
  app.post("/api/admin/admins", adminAuthMiddleware, async (req, res) => {
    try {
      const { username, email, password } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json({ error: "اسم المستخدم والبريد الإلكتروني وكلمة المرور مطلوبة" });
      }
      
      if (password.length < 6) {
        return res.status(400).json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" });
      }
      
      const admin = await createAdminUser(username, email, password);
      res.status(201).json({ message: "تم إنشاء المدير بنجاح", admin });
    } catch (error: any) {
      console.error("Error creating admin user:", error);
      if (error.message?.includes("duplicate")) {
        return res.status(400).json({ error: "اسم المستخدم أو البريد الإلكتروني موجود مسبقاً" });
      }
      res.status(500).json({ error: "فشل في إنشاء المدير" });
    }
  });

  // Admin API: Get users with subscription status
  app.get("/api/admin/users-with-subs", adminAuthMiddleware, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await getUsersWithSubscriptions(page, limit);
      res.json(result);
    } catch (error) {
      console.error("Error fetching users with subscriptions:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Admin API: Grant premium access
  app.post("/api/admin/users/:id/grant-premium", adminAuthMiddleware, async (req, res) => {
    try {
      const { durationDays } = req.body;
      const result = await grantPremiumAccess(req.params.id, durationDays || 365);
      res.json({ message: "Premium access granted", subscription: result });
    } catch (error) {
      console.error("Error granting premium:", error);
      res.status(500).json({ error: "Failed to grant premium access" });
    }
  });

  // Admin API: Revoke premium access
  app.post("/api/admin/users/:id/revoke-premium", adminAuthMiddleware, async (req, res) => {
    try {
      const result = await revokePremiumAccess(req.params.id);
      res.json({ message: "Premium access revoked", subscription: result });
    } catch (error) {
      console.error("Error revoking premium:", error);
      res.status(500).json({ error: "Failed to revoke premium access" });
    }
  });

  // Admin API: Change password
  app.post("/api/admin/change-password", adminAuthMiddleware, async (req, res) => {
    try {
      const admin = (req as any).admin;
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "كلمة المرور مطلوبة" });
      }
      
      const result = await changeAdminPassword(admin.id, currentPassword, newPassword);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }
      
      res.json({ message: "تم تحديث كلمة المرور بنجاح" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ error: "فشل تحديث كلمة المرور" });
    }
  });

  // ============ ADMIN REPORTS API ============
  
  // Admin API: Get detailed reports
  app.get("/api/admin/reports", adminAuthMiddleware, async (_req, res) => {
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

      const [totalUsers] = await db.select({ count: count() }).from(users);
      const [newUsersMonth] = await db.select({ count: count() }).from(users).where(gte(users.createdAt, thirtyDaysAgo));
      const [newUsersWeek] = await db.select({ count: count() }).from(users).where(gte(users.createdAt, sevenDaysAgo));

      const [activeSubscriptions] = await db.select({ count: count() }).from(userSubscriptions).where(eq(userSubscriptions.status, "active"));
      const [trialSubscriptions] = await db.select({ count: count() }).from(userSubscriptions).where(eq(userSubscriptions.status, "trial"));
      const [cancelledSubscriptions] = await db.select({ count: count() }).from(userSubscriptions).where(eq(userSubscriptions.status, "cancelled"));

      const [totalArticles] = await db.select({ count: count() }).from(articles);

      const plans = await db.select().from(subscriptionPlans);
      const monthlyPlan = plans.find(p => p.code === "monthly");
      const yearlyPlan = plans.find(p => p.code === "yearly");

      const estimatedMonthlyRevenue = Number(activeSubscriptions?.count || 0) * Number(monthlyPlan?.price || 0);
      const estimatedYearlyRevenue = Number(activeSubscriptions?.count || 0) * Number(yearlyPlan?.price || 0) / 12;

      const userGrowth = [];
      for (let i = 5; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        const [monthUsers] = await db.select({ count: count() }).from(users)
          .where(and(gte(users.createdAt, monthStart), sql`${users.createdAt} <= ${monthEnd}`));
        userGrowth.push({
          month: monthStart.toLocaleDateString('ar-SA', { month: 'short', year: 'numeric' }),
          users: monthUsers?.count || 0
        });
      }

      const subscriptionGrowth = [];
      for (let i = 5; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        const [monthSubs] = await db.select({ count: count() }).from(userSubscriptions)
          .where(and(gte(userSubscriptions.createdAt, monthStart), sql`${userSubscriptions.createdAt} <= ${monthEnd}`));
        subscriptionGrowth.push({
          month: monthStart.toLocaleDateString('ar-SA', { month: 'short', year: 'numeric' }),
          subscriptions: monthSubs?.count || 0
        });
      }

      const articlesByCategory = await db.select({
        category: articles.category,
        count: count()
      }).from(articles).groupBy(articles.category);

      res.json({
        overview: {
          totalUsers: totalUsers?.count || 0,
          newUsersMonth: newUsersMonth?.count || 0,
          newUsersWeek: newUsersWeek?.count || 0,
          totalArticles: totalArticles?.count || 0,
        },
        subscriptions: {
          active: activeSubscriptions?.count || 0,
          trial: trialSubscriptions?.count || 0,
          cancelled: cancelledSubscriptions?.count || 0,
          free: Math.max(0, (totalUsers?.count || 0) - (activeSubscriptions?.count || 0) - (trialSubscriptions?.count || 0)),
          conversionRate: trialSubscriptions?.count ? 
            Math.round((activeSubscriptions?.count || 0) / ((activeSubscriptions?.count || 0) + (trialSubscriptions?.count || 0)) * 100) : 0
        },
        revenue: {
          estimatedMonthly: estimatedMonthlyRevenue,
          monthlyPlanPrice: monthlyPlan?.price || 0,
          yearlyPlanPrice: yearlyPlan?.price || 0,
        },
        charts: {
          userGrowth,
          subscriptionGrowth,
          articlesByCategory
        }
      });
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });

  // Admin API: Get/Update payment gateway settings
  app.get("/api/admin/payment-settings", adminAuthMiddleware, (req, res) => {
    const host = req.get('host') || 'localhost:5000';
    // Check X-Forwarded-Proto header first (from reverse proxy), then req.protocol
    const forwardedProto = req.get('X-Forwarded-Proto');
    const protocol = forwardedProto || req.protocol || 'http';
    const webhookUrl = `${protocol}://${host}/api/stripe/webhook`;
    
    res.json({
      stripeConfigured: isStripeConfigured(),
      hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
      hasPublishableKey: !!process.env.STRIPE_PUBLISHABLE_KEY,
      hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY ? 
        process.env.STRIPE_PUBLISHABLE_KEY.substring(0, 20) + "..." : null,
      webhookUrl
    });
  });

  // ============ ADMIN FATWAS API ============
  
  // GET all fatwas (with filters)
  app.get("/api/admin/fatwas", adminAuthMiddleware, async (req, res) => {
    try {
      const { category, approved, published, limit = "50", offset = "0" } = req.query;
      let query = db.select().from(fatwas);
      
      const conditions = [];
      if (category && typeof category === "string") {
        conditions.push(eq(fatwas.category, category));
      }
      if (approved === "true") conditions.push(eq(fatwas.isApproved, true));
      if (approved === "false") conditions.push(eq(fatwas.isApproved, false));
      if (published === "true") conditions.push(eq(fatwas.isPublished, true));
      if (published === "false") conditions.push(eq(fatwas.isPublished, false));
      
      const allFatwas = await db.select().from(fatwas)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(fatwas.createdAt))
        .limit(parseInt(limit as string))
        .offset(parseInt(offset as string));
      
      const [total] = await db.select({ count: count() }).from(fatwas)
        .where(conditions.length > 0 ? and(...conditions) : undefined);
      
      res.json({ fatwas: allFatwas, total: total?.count || 0 });
    } catch (error) {
      console.error("Error fetching fatwas:", error);
      res.status(500).json({ error: "فشل في جلب الفتاوى" });
    }
  });

  // GET single fatwa
  app.get("/api/admin/fatwas/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const [fatwa] = await db.select().from(fatwas).where(eq(fatwas.id, id));
      if (!fatwa) return res.status(404).json({ error: "الفتوى غير موجودة" });
      res.json(fatwa);
    } catch (error) {
      console.error("Error fetching fatwa:", error);
      res.status(500).json({ error: "فشل في جلب الفتوى" });
    }
  });

  // POST create fatwa
  app.post("/api/admin/fatwas", adminAuthMiddleware, async (req, res) => {
    try {
      const parsed = insertFatwaSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "بيانات غير صالحة", details: parsed.error.errors });
      }
      const [newFatwa] = await db.insert(fatwas).values(parsed.data).returning();
      
      // Log the action
      await db.insert(auditLogs).values({
        adminId: (req as any).admin?.id,
        action: "create",
        resourceType: "fatwa",
        resourceId: newFatwa.id,
        details: { questionAr: newFatwa.questionAr?.substring(0, 100) },
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });
      
      res.status(201).json(newFatwa);
    } catch (error) {
      console.error("Error creating fatwa:", error);
      res.status(500).json({ error: "فشل في إنشاء الفتوى" });
    }
  });

  // PUT update fatwa
  app.put("/api/admin/fatwas/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await db.update(fatwas)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(fatwas.id, id))
        .returning();
      if (!updated) return res.status(404).json({ error: "الفتوى غير موجودة" });
      
      await db.insert(auditLogs).values({
        adminId: (req as any).admin?.id,
        action: "update",
        resourceType: "fatwa",
        resourceId: id,
        details: req.body,
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating fatwa:", error);
      res.status(500).json({ error: "فشل في تحديث الفتوى" });
    }
  });

  // DELETE fatwa
  app.delete("/api/admin/fatwas/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const [deleted] = await db.delete(fatwas).where(eq(fatwas.id, id)).returning();
      if (!deleted) return res.status(404).json({ error: "الفتوى غير موجودة" });
      
      await db.insert(auditLogs).values({
        adminId: (req as any).admin?.id,
        action: "delete",
        resourceType: "fatwa",
        resourceId: id,
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });
      
      res.json({ message: "تم حذف الفتوى بنجاح" });
    } catch (error) {
      console.error("Error deleting fatwa:", error);
      res.status(500).json({ error: "فشل في حذف الفتوى" });
    }
  });

  // POST bulk import fatwas
  app.post("/api/admin/fatwas/bulk", adminAuthMiddleware, async (req, res) => {
    try {
      const { fatwas: fatwaData } = req.body;
      if (!Array.isArray(fatwaData) || fatwaData.length === 0) {
        return res.status(400).json({ error: "يجب تقديم مصفوفة من الفتاوى" });
      }
      
      const results = { success: [] as any[], failed: [] as any[] };
      for (let i = 0; i < fatwaData.length; i++) {
        const parsed = insertFatwaSchema.safeParse({ ...fatwaData[i], importedAt: new Date() });
        if (!parsed.success) {
          results.failed.push({ index: i, error: parsed.error.errors });
          continue;
        }
        try {
          const [newFatwa] = await db.insert(fatwas).values(parsed.data).returning();
          results.success.push(newFatwa);
        } catch (err: any) {
          results.failed.push({ index: i, error: err.message });
        }
      }
      
      res.status(201).json({
        message: `تم استيراد ${results.success.length} فتوى بنجاح`,
        successCount: results.success.length,
        failedCount: results.failed.length,
        failed: results.failed
      });
    } catch (error) {
      console.error("Error bulk importing fatwas:", error);
      res.status(500).json({ error: "فشل في استيراد الفتاوى" });
    }
  });

  // POST approve/publish fatwas
  app.post("/api/admin/fatwas/:id/approve", adminAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const { isApproved, isPublished } = req.body;
      const [updated] = await db.update(fatwas)
        .set({ isApproved, isPublished, updatedAt: new Date() })
        .where(eq(fatwas.id, id))
        .returning();
      if (!updated) return res.status(404).json({ error: "الفتوى غير موجودة" });
      res.json(updated);
    } catch (error) {
      console.error("Error approving fatwa:", error);
      res.status(500).json({ error: "فشل في اعتماد الفتوى" });
    }
  });

  // ============ ADMIN CYCLE ANALYTICS API ============
  
  // GET cycle analytics (aggregate data)
  app.get("/api/admin/cycle-analytics", adminAuthMiddleware, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const start = startDate ? new Date(startDate as string) : thirtyDaysAgo;
      const end = endDate ? new Date(endDate as string) : now;
      
      // Total cycle logs
      const [totalLogs] = await db.select({ count: count() }).from(cycleLogs)
        .where(and(gte(cycleLogs.date, start), sql`${cycleLogs.date} <= ${end}`));
      
      // Period days count
      const [periodDays] = await db.select({ count: count() }).from(cycleLogs)
        .where(and(gte(cycleLogs.date, start), eq(cycleLogs.isPeriodDay, true)));
      
      // Active users (users with logs)
      const activeUsers = await db.selectDistinct({ userId: cycleLogs.userId }).from(cycleLogs)
        .where(gte(cycleLogs.date, start));
      
      // Flow intensity distribution
      const flowDistribution = await db.select({
        intensity: cycleLogs.flowIntensity,
        count: count()
      }).from(cycleLogs)
        .where(and(gte(cycleLogs.date, start), cycleLogs.flowIntensity))
        .groupBy(cycleLogs.flowIntensity);
      
      // Common symptoms
      const symptomLogs = await db.select({ symptoms: cycleLogs.symptoms }).from(cycleLogs)
        .where(and(gte(cycleLogs.date, start), cycleLogs.symptoms));
      
      const symptomCounts: Record<string, number> = {};
      symptomLogs.forEach(log => {
        log.symptoms?.forEach(symptom => {
          symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
        });
      });
      const topSymptoms = Object.entries(symptomCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([symptom, count]) => ({ symptom, count }));
      
      res.json({
        period: { start: start.toISOString(), end: end.toISOString() },
        totalLogs: totalLogs?.count || 0,
        periodDays: periodDays?.count || 0,
        activeUsers: activeUsers.length,
        flowDistribution,
        topSymptoms
      });
    } catch (error) {
      console.error("Error fetching cycle analytics:", error);
      res.status(500).json({ error: "فشل في جلب تحليلات الدورة" });
    }
  });

  // GET cycle logs list
  app.get("/api/admin/cycle-logs", adminAuthMiddleware, async (req, res) => {
    try {
      const { userId, startDate, endDate, limit = "100", offset = "0" } = req.query;
      
      const conditions = [];
      if (userId && typeof userId === "string") {
        conditions.push(eq(cycleLogs.userId, userId));
      }
      if (startDate) conditions.push(gte(cycleLogs.date, new Date(startDate as string)));
      if (endDate) conditions.push(sql`${cycleLogs.date} <= ${new Date(endDate as string)}`);
      
      const logs = await db.select({
        log: cycleLogs,
        user: { id: users.id, username: users.username, email: users.email }
      })
        .from(cycleLogs)
        .leftJoin(users, eq(cycleLogs.userId, users.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(cycleLogs.date))
        .limit(parseInt(limit as string))
        .offset(parseInt(offset as string));
      
      const [total] = await db.select({ count: count() }).from(cycleLogs)
        .where(conditions.length > 0 ? and(...conditions) : undefined);
      
      res.json({ logs, total: total?.count || 0 });
    } catch (error) {
      console.error("Error fetching cycle logs:", error);
      res.status(500).json({ error: "فشل في جلب سجلات الدورة" });
    }
  });

  // ============ ADMIN QADHA LOGS API ============
  
  // GET qadha analytics
  app.get("/api/admin/qadha-analytics", adminAuthMiddleware, async (req, res) => {
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      // Total qadha logs
      const [totalLogs] = await db.select({ count: count() }).from(qadhaLogs);
      
      // Completed vs pending
      const [completed] = await db.select({ count: count() }).from(qadhaLogs)
        .where(eq(qadhaLogs.isCompleted, true));
      const [pending] = await db.select({ count: count() }).from(qadhaLogs)
        .where(eq(qadhaLogs.isCompleted, false));
      
      // By prayer type
      const byPrayer = await db.select({
        prayerType: qadhaLogs.prayerType,
        total: count(),
      }).from(qadhaLogs).groupBy(qadhaLogs.prayerType);
      
      // Active users
      const activeUsers = await db.selectDistinct({ userId: qadhaLogs.userId }).from(qadhaLogs)
        .where(gte(qadhaLogs.date, thirtyDaysAgo));
      
      res.json({
        totalLogs: totalLogs?.count || 0,
        completed: completed?.count || 0,
        pending: pending?.count || 0,
        completionRate: totalLogs?.count ? Math.round(((completed?.count || 0) / totalLogs.count) * 100) : 0,
        byPrayer,
        activeUsers: activeUsers.length
      });
    } catch (error) {
      console.error("Error fetching qadha analytics:", error);
      res.status(500).json({ error: "فشل في جلب تحليلات القضاء" });
    }
  });

  // GET qadha logs list
  app.get("/api/admin/qadha-logs", adminAuthMiddleware, async (req, res) => {
    try {
      const { userId, prayerType, completed, limit = "100", offset = "0" } = req.query;
      
      const conditions = [];
      if (userId && typeof userId === "string") conditions.push(eq(qadhaLogs.userId, userId));
      if (prayerType && typeof prayerType === "string") conditions.push(eq(qadhaLogs.prayerType, prayerType));
      if (completed === "true") conditions.push(eq(qadhaLogs.isCompleted, true));
      if (completed === "false") conditions.push(eq(qadhaLogs.isCompleted, false));
      
      const logs = await db.select({
        log: qadhaLogs,
        user: { id: users.id, username: users.username, email: users.email }
      })
        .from(qadhaLogs)
        .leftJoin(users, eq(qadhaLogs.userId, users.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(qadhaLogs.date))
        .limit(parseInt(limit as string))
        .offset(parseInt(offset as string));
      
      const [total] = await db.select({ count: count() }).from(qadhaLogs)
        .where(conditions.length > 0 ? and(...conditions) : undefined);
      
      res.json({ logs, total: total?.count || 0 });
    } catch (error) {
      console.error("Error fetching qadha logs:", error);
      res.status(500).json({ error: "فشل في جلب سجلات القضاء" });
    }
  });

  // ============ ADMIN BEAUTY PRODUCTS API ============
  
  // GET all beauty products
  app.get("/api/admin/beauty-products", adminAuthMiddleware, async (req, res) => {
    try {
      const { category, recommended, limit = "50", offset = "0" } = req.query;
      
      const conditions = [];
      if (category && typeof category === "string") conditions.push(eq(beautyProducts.category, category));
      if (recommended === "true") conditions.push(eq(beautyProducts.isRecommended, true));
      
      const products = await db.select().from(beautyProducts)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(beautyProducts.createdAt))
        .limit(parseInt(limit as string))
        .offset(parseInt(offset as string));
      
      const [total] = await db.select({ count: count() }).from(beautyProducts)
        .where(conditions.length > 0 ? and(...conditions) : undefined);
      
      res.json({ products, total: total?.count || 0 });
    } catch (error) {
      console.error("Error fetching beauty products:", error);
      res.status(500).json({ error: "فشل في جلب منتجات التجميل" });
    }
  });

  // POST create beauty product
  app.post("/api/admin/beauty-products", adminAuthMiddleware, async (req, res) => {
    try {
      const parsed = insertBeautyProductSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "بيانات غير صالحة", details: parsed.error.errors });
      }
      const [newProduct] = await db.insert(beautyProducts).values(parsed.data).returning();
      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error creating beauty product:", error);
      res.status(500).json({ error: "فشل في إنشاء المنتج" });
    }
  });

  // PUT update beauty product
  app.put("/api/admin/beauty-products/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await db.update(beautyProducts)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(beautyProducts.id, id))
        .returning();
      if (!updated) return res.status(404).json({ error: "المنتج غير موجود" });
      res.json(updated);
    } catch (error) {
      console.error("Error updating beauty product:", error);
      res.status(500).json({ error: "فشل في تحديث المنتج" });
    }
  });

  // DELETE beauty product
  app.delete("/api/admin/beauty-products/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const [deleted] = await db.delete(beautyProducts).where(eq(beautyProducts.id, id)).returning();
      if (!deleted) return res.status(404).json({ error: "المنتج غير موجود" });
      res.json({ message: "تم حذف المنتج بنجاح" });
    } catch (error) {
      console.error("Error deleting beauty product:", error);
      res.status(500).json({ error: "فشل في حذف المنتج" });
    }
  });

  // ============ ADMIN BEAUTY ROUTINES API ============
  
  // GET all beauty routines
  app.get("/api/admin/beauty-routines", adminAuthMiddleware, async (req, res) => {
    try {
      const { timeOfDay, isDefault } = req.query;
      
      const conditions = [];
      if (timeOfDay && typeof timeOfDay === "string") conditions.push(eq(beautyRoutines.timeOfDay, timeOfDay));
      if (isDefault === "true") conditions.push(eq(beautyRoutines.isDefault, true));
      
      const routines = await db.select().from(beautyRoutines)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(beautyRoutines.createdAt));
      
      res.json(routines);
    } catch (error) {
      console.error("Error fetching beauty routines:", error);
      res.status(500).json({ error: "فشل في جلب روتين التجميل" });
    }
  });

  // POST create beauty routine
  app.post("/api/admin/beauty-routines", adminAuthMiddleware, async (req, res) => {
    try {
      const parsed = insertBeautyRoutineSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "بيانات غير صالحة", details: parsed.error.errors });
      }
      const [newRoutine] = await db.insert(beautyRoutines).values(parsed.data).returning();
      res.status(201).json(newRoutine);
    } catch (error) {
      console.error("Error creating beauty routine:", error);
      res.status(500).json({ error: "فشل في إنشاء الروتين" });
    }
  });

  // PUT update beauty routine
  app.put("/api/admin/beauty-routines/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await db.update(beautyRoutines)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(beautyRoutines.id, id))
        .returning();
      if (!updated) return res.status(404).json({ error: "الروتين غير موجود" });
      res.json(updated);
    } catch (error) {
      console.error("Error updating beauty routine:", error);
      res.status(500).json({ error: "فشل في تحديث الروتين" });
    }
  });

  // DELETE beauty routine
  app.delete("/api/admin/beauty-routines/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const [deleted] = await db.delete(beautyRoutines).where(eq(beautyRoutines.id, id)).returning();
      if (!deleted) return res.status(404).json({ error: "الروتين غير موجود" });
      res.json({ message: "تم حذف الروتين بنجاح" });
    } catch (error) {
      console.error("Error deleting beauty routine:", error);
      res.status(500).json({ error: "فشل في حذف الروتين" });
    }
  });

  // ============ ADMIN DAUGHTERS MODE API ============
  
  // GET all daughters (for mothers)
  app.get("/api/admin/daughters", adminAuthMiddleware, async (req, res) => {
    try {
      const { motherId, limit = "50", offset = "0" } = req.query;
      
      const conditions = [];
      if (motherId && typeof motherId === "string") conditions.push(eq(daughters.motherId, motherId));
      
      const allDaughters = await db.select({
        daughter: daughters,
        mother: { id: users.id, username: users.username, email: users.email }
      })
        .from(daughters)
        .leftJoin(users, eq(daughters.motherId, users.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(daughters.createdAt))
        .limit(parseInt(limit as string))
        .offset(parseInt(offset as string));
      
      const [total] = await db.select({ count: count() }).from(daughters)
        .where(conditions.length > 0 ? and(...conditions) : undefined);
      
      // Get mothers count
      const mothersCount = await db.selectDistinct({ motherId: daughters.motherId }).from(daughters);
      
      res.json({ 
        daughters: allDaughters, 
        total: total?.count || 0,
        mothersCount: mothersCount.length
      });
    } catch (error) {
      console.error("Error fetching daughters:", error);
      res.status(500).json({ error: "فشل في جلب بيانات البنات" });
    }
  });

  // ============ ADMIN NOTIFICATION TEMPLATES API ============
  
  // GET all notification templates
  app.get("/api/admin/notification-templates", adminAuthMiddleware, async (req, res) => {
    try {
      const { type, active } = req.query;
      
      const conditions = [];
      if (type && typeof type === "string") conditions.push(eq(notificationTemplates.type, type));
      if (active === "true") conditions.push(eq(notificationTemplates.isActive, true));
      if (active === "false") conditions.push(eq(notificationTemplates.isActive, false));
      
      const templates = await db.select().from(notificationTemplates)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(notificationTemplates.createdAt));
      
      res.json(templates);
    } catch (error) {
      console.error("Error fetching notification templates:", error);
      res.status(500).json({ error: "فشل في جلب قوالب الإشعارات" });
    }
  });

  // POST create notification template
  app.post("/api/admin/notification-templates", adminAuthMiddleware, async (req, res) => {
    try {
      const parsed = insertNotificationTemplateSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "بيانات غير صالحة", details: parsed.error.errors });
      }
      const [newTemplate] = await db.insert(notificationTemplates).values(parsed.data).returning();
      res.status(201).json(newTemplate);
    } catch (error) {
      console.error("Error creating notification template:", error);
      res.status(500).json({ error: "فشل في إنشاء القالب" });
    }
  });

  // PUT update notification template
  app.put("/api/admin/notification-templates/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await db.update(notificationTemplates)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(notificationTemplates.id, id))
        .returning();
      if (!updated) return res.status(404).json({ error: "القالب غير موجود" });
      res.json(updated);
    } catch (error) {
      console.error("Error updating notification template:", error);
      res.status(500).json({ error: "فشل في تحديث القالب" });
    }
  });

  // DELETE notification template
  app.delete("/api/admin/notification-templates/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const [deleted] = await db.delete(notificationTemplates).where(eq(notificationTemplates.id, id)).returning();
      if (!deleted) return res.status(404).json({ error: "القالب غير موجود" });
      res.json({ message: "تم حذف القالب بنجاح" });
    } catch (error) {
      console.error("Error deleting notification template:", error);
      res.status(500).json({ error: "فشل في حذف القالب" });
    }
  });

  // ============ ADMIN NOTIFICATIONS API ============
  
  // GET all notifications (sent log)
  app.get("/api/admin/notifications", adminAuthMiddleware, async (req, res) => {
    try {
      const { status, type, targetAudience, limit = "50", offset = "0" } = req.query;
      
      const conditions = [];
      if (status && typeof status === "string") conditions.push(eq(notifications.status, status));
      if (type && typeof type === "string") conditions.push(eq(notifications.type, type));
      if (targetAudience && typeof targetAudience === "string") conditions.push(eq(notifications.targetAudience, targetAudience));
      
      const allNotifications = await db.select().from(notifications)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(notifications.createdAt))
        .limit(parseInt(limit as string))
        .offset(parseInt(offset as string));
      
      const [total] = await db.select({ count: count() }).from(notifications)
        .where(conditions.length > 0 ? and(...conditions) : undefined);
      
      // Stats
      const [pending] = await db.select({ count: count() }).from(notifications).where(eq(notifications.status, "pending"));
      const [sent] = await db.select({ count: count() }).from(notifications).where(eq(notifications.status, "sent"));
      const [failed] = await db.select({ count: count() }).from(notifications).where(eq(notifications.status, "failed"));
      
      res.json({ 
        notifications: allNotifications, 
        total: total?.count || 0,
        stats: { pending: pending?.count || 0, sent: sent?.count || 0, failed: failed?.count || 0 }
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "فشل في جلب الإشعارات" });
    }
  });

  // POST create/send notification
  app.post("/api/admin/notifications", adminAuthMiddleware, async (req, res) => {
    try {
      const parsed = insertNotificationSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "بيانات غير صالحة", details: parsed.error.errors });
      }
      
      const notificationData = {
        ...parsed.data,
        status: parsed.data.scheduledAt ? "scheduled" : "pending",
      };
      
      const [newNotification] = await db.insert(notifications).values(notificationData).returning();
      
      // If not scheduled, mark as sent immediately (in real app, would send push notification here)
      if (!parsed.data.scheduledAt) {
        await db.update(notifications)
          .set({ status: "sent", sentAt: new Date() })
          .where(eq(notifications.id, newNotification.id));
      }
      
      res.status(201).json(newNotification);
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({ error: "فشل في إنشاء الإشعار" });
    }
  });

  // DELETE notification
  app.delete("/api/admin/notifications/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const [deleted] = await db.delete(notifications).where(eq(notifications.id, id)).returning();
      if (!deleted) return res.status(404).json({ error: "الإشعار غير موجود" });
      res.json({ message: "تم حذف الإشعار بنجاح" });
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(500).json({ error: "فشل في حذف الإشعار" });
    }
  });

  // POST send push notification (broadcast)
  app.post("/api/admin/send-notification", adminAuthMiddleware, async (req, res) => {
    try {
      const { titleAr, titleEn, bodyAr, bodyEn, target } = req.body;
      
      if (!titleAr || !bodyAr) {
        return res.status(400).json({ error: "العنوان والمحتوى بالعربية مطلوبان" });
      }
      
      const validTargets = ["all", "premium", "free", "single", "married", "mother"];
      const targetValue = validTargets.includes(target) ? target : "all";
      
      const [newNotification] = await db.insert(notifications).values({
        titleAr,
        titleEn: titleEn || titleAr,
        bodyAr,
        bodyEn: bodyEn || bodyAr,
        type: "push",
        targetAudience: targetValue,
        status: "sent",
        sentAt: new Date(),
      }).returning();
      
      await db.insert(auditLogs).values({
        adminId: (req as any).admin?.id,
        action: "send",
        resourceType: "notification",
        resourceId: newNotification.id,
        details: { titleAr, target: targetValue },
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });
      
      res.json({ 
        success: true, 
        message: "تم إرسال الإشعار بنجاح",
        notification: newNotification 
      });
    } catch (error) {
      console.error("Error sending notification:", error);
      res.status(500).json({ error: "فشل في إرسال الإشعار" });
    }
  });

  // ============ ADMIN ROLES & PERMISSIONS API ============
  
  // GET all roles
  app.get("/api/admin/roles", adminAuthMiddleware, async (_req, res) => {
    try {
      const roles = await db.select().from(adminRoles).orderBy(adminRoles.name);
      res.json(roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      res.status(500).json({ error: "فشل في جلب الأدوار" });
    }
  });

  // POST create role
  app.post("/api/admin/roles", adminAuthMiddleware, async (req, res) => {
    try {
      const parsed = insertAdminRoleSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "بيانات غير صالحة", details: parsed.error.errors });
      }
      const [newRole] = await db.insert(adminRoles).values(parsed.data).returning();
      
      await db.insert(auditLogs).values({
        adminId: (req as any).admin?.id,
        action: "create",
        resourceType: "role",
        resourceId: newRole.id,
        details: { name: newRole.name },
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });
      
      res.status(201).json(newRole);
    } catch (error) {
      console.error("Error creating role:", error);
      res.status(500).json({ error: "فشل في إنشاء الدور" });
    }
  });

  // PUT update role
  app.put("/api/admin/roles/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if system role
      const [role] = await db.select().from(adminRoles).where(eq(adminRoles.id, id));
      if (role?.isSystem) {
        return res.status(403).json({ error: "لا يمكن تعديل الأدوار النظامية" });
      }
      
      const [updated] = await db.update(adminRoles)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(adminRoles.id, id))
        .returning();
      if (!updated) return res.status(404).json({ error: "الدور غير موجود" });
      res.json(updated);
    } catch (error) {
      console.error("Error updating role:", error);
      res.status(500).json({ error: "فشل في تحديث الدور" });
    }
  });

  // DELETE role
  app.delete("/api/admin/roles/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if system role
      const [role] = await db.select().from(adminRoles).where(eq(adminRoles.id, id));
      if (role?.isSystem) {
        return res.status(403).json({ error: "لا يمكن حذف الأدوار النظامية" });
      }
      
      // Delete user assignments first
      await db.delete(adminUserRoles).where(eq(adminUserRoles.roleId, id));
      
      const [deleted] = await db.delete(adminRoles).where(eq(adminRoles.id, id)).returning();
      if (!deleted) return res.status(404).json({ error: "الدور غير موجود" });
      res.json({ message: "تم حذف الدور بنجاح" });
    } catch (error) {
      console.error("Error deleting role:", error);
      res.status(500).json({ error: "فشل في حذف الدور" });
    }
  });

  // POST assign role to user
  app.post("/api/admin/roles/assign", adminAuthMiddleware, async (req, res) => {
    try {
      const { userId, roleId } = req.body;
      if (!userId || !roleId) {
        return res.status(400).json({ error: "معرف المستخدم والدور مطلوبان" });
      }
      
      // Check if already assigned
      const [existing] = await db.select().from(adminUserRoles)
        .where(and(eq(adminUserRoles.userId, userId), eq(adminUserRoles.roleId, roleId)));
      if (existing) {
        return res.status(400).json({ error: "الدور مُعين بالفعل لهذا المستخدم" });
      }
      
      const [assignment] = await db.insert(adminUserRoles).values({ userId, roleId }).returning();
      res.status(201).json(assignment);
    } catch (error) {
      console.error("Error assigning role:", error);
      res.status(500).json({ error: "فشل في تعيين الدور" });
    }
  });

  // DELETE remove role from user
  app.delete("/api/admin/roles/assign/:userId/:roleId", adminAuthMiddleware, async (req, res) => {
    try {
      const { userId, roleId } = req.params;
      await db.delete(adminUserRoles)
        .where(and(eq(adminUserRoles.userId, userId), eq(adminUserRoles.roleId, roleId)));
      res.json({ message: "تم إلغاء تعيين الدور بنجاح" });
    } catch (error) {
      console.error("Error removing role assignment:", error);
      res.status(500).json({ error: "فشل في إلغاء تعيين الدور" });
    }
  });

  // ============ ADMIN FEATURE FLAGS API ============
  
  // GET all feature flags
  app.get("/api/admin/feature-flags", adminAuthMiddleware, async (_req, res) => {
    try {
      const flags = await db.select().from(featureFlags).orderBy(featureFlags.key);
      res.json(flags);
    } catch (error) {
      console.error("Error fetching feature flags:", error);
      res.status(500).json({ error: "فشل في جلب مفاتيح الميزات" });
    }
  });

  // POST create feature flag
  app.post("/api/admin/feature-flags", adminAuthMiddleware, async (req, res) => {
    try {
      const parsed = insertFeatureFlagSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "بيانات غير صالحة", details: parsed.error.errors });
      }
      const [newFlag] = await db.insert(featureFlags).values(parsed.data).returning();
      
      await db.insert(auditLogs).values({
        adminId: (req as any).admin?.id,
        action: "create",
        resourceType: "feature_flag",
        resourceId: newFlag.id,
        details: { key: newFlag.key },
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });
      
      res.status(201).json(newFlag);
    } catch (error) {
      console.error("Error creating feature flag:", error);
      res.status(500).json({ error: "فشل في إنشاء مفتاح الميزة" });
    }
  });

  // PUT update feature flag
  app.put("/api/admin/feature-flags/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await db.update(featureFlags)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(featureFlags.id, id))
        .returning();
      if (!updated) return res.status(404).json({ error: "مفتاح الميزة غير موجود" });
      
      await db.insert(auditLogs).values({
        adminId: (req as any).admin?.id,
        action: "update",
        resourceType: "feature_flag",
        resourceId: id,
        details: req.body,
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating feature flag:", error);
      res.status(500).json({ error: "فشل في تحديث مفتاح الميزة" });
    }
  });

  // DELETE feature flag
  app.delete("/api/admin/feature-flags/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const [deleted] = await db.delete(featureFlags).where(eq(featureFlags.id, id)).returning();
      if (!deleted) return res.status(404).json({ error: "مفتاح الميزة غير موجود" });
      res.json({ message: "تم حذف مفتاح الميزة بنجاح" });
    } catch (error) {
      console.error("Error deleting feature flag:", error);
      res.status(500).json({ error: "فشل في حذف مفتاح الميزة" });
    }
  });

  // POST toggle feature flag
  app.post("/api/admin/feature-flags/:id/toggle", adminAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const [flag] = await db.select().from(featureFlags).where(eq(featureFlags.id, id));
      if (!flag) return res.status(404).json({ error: "مفتاح الميزة غير موجود" });
      
      const [updated] = await db.update(featureFlags)
        .set({ isEnabled: !flag.isEnabled, updatedAt: new Date() })
        .where(eq(featureFlags.id, id))
        .returning();
      
      await db.insert(auditLogs).values({
        adminId: (req as any).admin?.id,
        action: "toggle",
        resourceType: "feature_flag",
        resourceId: id,
        details: { key: flag.key, enabled: !flag.isEnabled },
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });
      
      res.json(updated);
    } catch (error) {
      console.error("Error toggling feature flag:", error);
      res.status(500).json({ error: "فشل في تبديل مفتاح الميزة" });
    }
  });

  // ============ ADMIN APP SETTINGS API ============
  
  // GET all app settings
  app.get("/api/admin/app-settings", adminAuthMiddleware, async (req, res) => {
    try {
      const { category } = req.query;
      
      const conditions = [];
      if (category && typeof category === "string") conditions.push(eq(appSettings.category, category));
      
      const settings = await db.select().from(appSettings)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(appSettings.category, appSettings.key);
      
      res.json(settings);
    } catch (error) {
      console.error("Error fetching app settings:", error);
      res.status(500).json({ error: "فشل في جلب إعدادات التطبيق" });
    }
  });

  // GET single setting by key
  app.get("/api/admin/app-settings/:key", adminAuthMiddleware, async (req, res) => {
    try {
      const { key } = req.params;
      const [setting] = await db.select().from(appSettings).where(eq(appSettings.key, key));
      if (!setting) return res.status(404).json({ error: "الإعداد غير موجود" });
      res.json(setting);
    } catch (error) {
      console.error("Error fetching app setting:", error);
      res.status(500).json({ error: "فشل في جلب الإعداد" });
    }
  });

  // POST create app setting
  app.post("/api/admin/app-settings", adminAuthMiddleware, async (req, res) => {
    try {
      const parsed = insertAppSettingSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "بيانات غير صالحة", details: parsed.error.errors });
      }
      const [newSetting] = await db.insert(appSettings).values(parsed.data).returning();
      
      await db.insert(auditLogs).values({
        adminId: (req as any).admin?.id,
        action: "create",
        resourceType: "app_setting",
        resourceId: newSetting.id,
        details: { key: newSetting.key },
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });
      
      res.status(201).json(newSetting);
    } catch (error) {
      console.error("Error creating app setting:", error);
      res.status(500).json({ error: "فشل في إنشاء الإعداد" });
    }
  });

  // PUT update app setting
  app.put("/api/admin/app-settings/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await db.update(appSettings)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(appSettings.id, id))
        .returning();
      if (!updated) return res.status(404).json({ error: "الإعداد غير موجود" });
      
      await db.insert(auditLogs).values({
        adminId: (req as any).admin?.id,
        action: "update",
        resourceType: "app_setting",
        resourceId: id,
        details: req.body,
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      });
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating app setting:", error);
      res.status(500).json({ error: "فشل في تحديث الإعداد" });
    }
  });

  // DELETE app setting
  app.delete("/api/admin/app-settings/:id", adminAuthMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const [deleted] = await db.delete(appSettings).where(eq(appSettings.id, id)).returning();
      if (!deleted) return res.status(404).json({ error: "الإعداد غير موجود" });
      res.json({ message: "تم حذف الإعداد بنجاح" });
    } catch (error) {
      console.error("Error deleting app setting:", error);
      res.status(500).json({ error: "فشل في حذف الإعداد" });
    }
  });

  // ============ ADMIN AUDIT LOGS API ============
  
  // GET audit logs
  app.get("/api/admin/audit-logs", adminAuthMiddleware, async (req, res) => {
    try {
      const { adminId, resourceType, action, startDate, endDate, limit = "100", offset = "0" } = req.query;
      
      const conditions = [];
      if (adminId && typeof adminId === "string") conditions.push(eq(auditLogs.adminId, adminId));
      if (resourceType && typeof resourceType === "string") conditions.push(eq(auditLogs.resourceType, resourceType));
      if (action && typeof action === "string") conditions.push(eq(auditLogs.action, action));
      if (startDate) conditions.push(gte(auditLogs.createdAt, new Date(startDate as string)));
      if (endDate) conditions.push(sql`${auditLogs.createdAt} <= ${new Date(endDate as string)}`);
      
      const logs = await db.select({
        log: auditLogs,
        admin: { id: users.id, username: users.username, email: users.email }
      })
        .from(auditLogs)
        .leftJoin(users, eq(auditLogs.adminId, users.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(auditLogs.createdAt))
        .limit(parseInt(limit as string))
        .offset(parseInt(offset as string));
      
      const [total] = await db.select({ count: count() }).from(auditLogs)
        .where(conditions.length > 0 ? and(...conditions) : undefined);
      
      // Get unique resource types and actions for filters
      const resourceTypes = await db.selectDistinct({ type: auditLogs.resourceType }).from(auditLogs);
      const actions = await db.selectDistinct({ action: auditLogs.action }).from(auditLogs);
      
      res.json({ 
        logs, 
        total: total?.count || 0,
        filters: {
          resourceTypes: resourceTypes.map(r => r.type),
          actions: actions.map(a => a.action)
        }
      });
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ error: "فشل في جلب سجلات التدقيق" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
