import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, numeric, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  profilePicture: text("profile_picture"),
  isAdmin: boolean("is_admin").notNull().default(false),
  persona: varchar("persona", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  displayName: true,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;

export const articles = pgTable("articles", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull(),
  contentAr: text("content_ar"),
  contentEn: text("content_en"),
  category: varchar("category", { length: 50 }).notNull(),
  readTime: integer("read_time").notNull().default(5),
  icon: varchar("icon", { length: 50 }).notNull().default("book"),
  personas: text("personas").array(),
  imageUrl: text("image_url"),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type UpdateArticle = z.infer<typeof updateArticleSchema>;
export type Article = typeof articles.$inferSelect;

export const fatwas = pgTable("fatwas", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  questionAr: text("question_ar").notNull(),
  questionEn: text("question_en"),
  answerAr: text("answer_ar").notNull(),
  answerEn: text("answer_en"),
  scholar: varchar("scholar", { length: 200 }),
  source: varchar("source", { length: 500 }),
  sourceUrl: text("source_url"),
  category: varchar("category", { length: 50 }).notNull().default("general"),
  isApproved: boolean("is_approved").notNull().default(false),
  isPublished: boolean("is_published").notNull().default(false),
  importedAt: timestamp("imported_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertFatwaSchema = createInsertSchema(fatwas).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertFatwa = z.infer<typeof insertFatwaSchema>;
export type Fatwa = typeof fatwas.$inferSelect;

export const subscriptionPlans = pgTable("subscription_plans", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  code: varchar("code", { length: 50 }).notNull().unique(),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).notNull().default("SAR"),
  period: varchar("period", { length: 20 }).notNull(),
  trialDays: integer("trial_days").notNull().default(7),
  featuresEn: text("features_en").array(),
  featuresAr: text("features_ar").array(),
  isActive: boolean("is_active").notNull().default(true),
  isPopular: boolean("is_popular").notNull().default(false),
  stripePriceId: varchar("stripe_price_id", { length: 100 }),
  stripeProductId: varchar("stripe_product_id", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export type InsertPlan = z.infer<typeof insertPlanSchema>;
export type UpdatePlan = z.infer<typeof updatePlanSchema>;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;

export const userSubscriptions = pgTable("user_subscriptions", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 100 }).notNull(),
  planId: varchar("plan_id", { length: 100 }),
  status: varchar("status", { length: 20 }).notNull().default("free"),
  stripeCustomerId: varchar("stripe_customer_id", { length: 100 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 100 }),
  moyasarPaymentId: varchar("moyasar_payment_id", { length: 100 }),
  activatedAt: timestamp("activated_at"),
  expiresAt: timestamp("expires_at"),
  trialEndsAt: timestamp("trial_ends_at"),
  cancelledAt: timestamp("cancelled_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSubscriptionSchema = createInsertSchema(userSubscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateSubscriptionSchema = createInsertSchema(userSubscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type UpdateSubscription = z.infer<typeof updateSubscriptionSchema>;
export type UserSubscription = typeof userSubscriptions.$inferSelect;

export const adminRoles = pgTable("admin_roles", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 50 }).notNull().unique(),
  nameAr: varchar("name_ar", { length: 50 }).notNull(),
  description: text("description"),
  descriptionAr: text("description_ar"),
  permissions: text("permissions").array(),
  isSystem: boolean("is_system").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAdminRoleSchema = createInsertSchema(adminRoles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAdminRole = z.infer<typeof insertAdminRoleSchema>;
export type AdminRole = typeof adminRoles.$inferSelect;

export const adminUserRoles = pgTable("admin_user_roles", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  roleId: varchar("role_id").notNull().references(() => adminRoles.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

export type AdminUserRole = typeof adminUserRoles.$inferSelect;

export const cycleLogs = pgTable("cycle_logs", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  isPeriodDay: boolean("is_period_day").notNull().default(false),
  flowIntensity: varchar("flow_intensity", { length: 20 }),
  symptoms: text("symptoms").array(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCycleLogSchema = createInsertSchema(cycleLogs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCycleLog = z.infer<typeof insertCycleLogSchema>;
export type CycleLog = typeof cycleLogs.$inferSelect;

export const qadhaLogs = pgTable("qadha_logs", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  prayerType: varchar("prayer_type", { length: 20 }).notNull(),
  isCompleted: boolean("is_completed").notNull().default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertQadhaLogSchema = createInsertSchema(qadhaLogs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertQadhaLog = z.infer<typeof insertQadhaLogSchema>;
export type QadhaLog = typeof qadhaLogs.$inferSelect;

export const beautyProducts = pgTable("beauty_products", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  brand: varchar("brand", { length: 100 }),
  category: varchar("category", { length: 50 }).notNull(),
  descriptionAr: text("description_ar"),
  descriptionEn: text("description_en"),
  imageUrl: text("image_url"),
  isRecommended: boolean("is_recommended").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBeautyProductSchema = createInsertSchema(beautyProducts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBeautyProduct = z.infer<typeof insertBeautyProductSchema>;
export type BeautyProduct = typeof beautyProducts.$inferSelect;

export const beautyRoutines = pgTable("beauty_routines", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  timeOfDay: varchar("time_of_day", { length: 10 }).notNull(),
  stepsAr: text("steps_ar").array(),
  stepsEn: text("steps_en").array(),
  skinTypes: text("skin_types").array(),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBeautyRoutineSchema = createInsertSchema(beautyRoutines).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBeautyRoutine = z.infer<typeof insertBeautyRoutineSchema>;
export type BeautyRoutine = typeof beautyRoutines.$inferSelect;

export const daughters = pgTable("daughters", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  motherId: varchar("mother_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  birthDate: timestamp("birth_date"),
  cycleLength: integer("cycle_length").default(28),
  periodLength: integer("period_length").default(5),
  lastPeriodStart: timestamp("last_period_start"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDaughterSchema = createInsertSchema(daughters).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertDaughter = z.infer<typeof insertDaughterSchema>;
export type Daughter = typeof daughters.$inferSelect;

export const notificationTemplates = pgTable("notification_templates", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull(),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull(),
  bodyAr: text("body_ar").notNull(),
  bodyEn: text("body_en").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertNotificationTemplateSchema = createInsertSchema(notificationTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertNotificationTemplate = z.infer<typeof insertNotificationTemplateSchema>;
export type NotificationTemplate = typeof notificationTemplates.$inferSelect;

export const notifications = pgTable("notifications", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  templateId: varchar("template_id").references(() => notificationTemplates.id),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull(),
  bodyAr: text("body_ar").notNull(),
  bodyEn: text("body_en").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  targetAudience: varchar("target_audience", { length: 50 }),
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

export const featureFlags = pgTable("feature_flags", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  key: varchar("key", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  nameAr: varchar("name_ar", { length: 100 }).notNull(),
  description: text("description"),
  descriptionAr: text("description_ar"),
  isEnabled: boolean("is_enabled").notNull().default(false),
  enabledForPersonas: text("enabled_for_personas").array(),
  enabledForPlans: text("enabled_for_plans").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertFeatureFlagSchema = createInsertSchema(featureFlags).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertFeatureFlag = z.infer<typeof insertFeatureFlagSchema>;
export type FeatureFlag = typeof featureFlags.$inferSelect;

export const appSettings = pgTable("app_settings", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  valueJson: jsonb("value_json"),
  category: varchar("category", { length: 50 }).notNull().default("general"),
  description: text("description"),
  descriptionAr: text("description_ar"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAppSettingSchema = createInsertSchema(appSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAppSetting = z.infer<typeof insertAppSettingSchema>;
export type AppSetting = typeof appSettings.$inferSelect;

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id").references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  resourceType: varchar("resource_type", { length: 50 }).notNull(),
  resourceId: varchar("resource_id", { length: 100 }),
  details: jsonb("details"),
  ipAddress: varchar("ip_address", { length: 50 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;

export const PERMISSIONS = {
  USERS_VIEW: "users:view",
  USERS_CREATE: "users:create",
  USERS_EDIT: "users:edit",
  USERS_DELETE: "users:delete",
  SUBSCRIPTIONS_VIEW: "subscriptions:view",
  SUBSCRIPTIONS_MANAGE: "subscriptions:manage",
  CONTENT_VIEW: "content:view",
  CONTENT_CREATE: "content:create",
  CONTENT_EDIT: "content:edit",
  CONTENT_DELETE: "content:delete",
  ANALYTICS_VIEW: "analytics:view",
  NOTIFICATIONS_VIEW: "notifications:view",
  NOTIFICATIONS_SEND: "notifications:send",
  SETTINGS_VIEW: "settings:view",
  SETTINGS_EDIT: "settings:edit",
  ROLES_VIEW: "roles:view",
  ROLES_MANAGE: "roles:manage",
  AUDIT_VIEW: "audit:view",
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
