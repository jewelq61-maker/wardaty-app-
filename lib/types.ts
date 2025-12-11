export type Persona = "single" | "married" | "mother";

export type Mood = "great" | "good" | "okay" | "bad" | "terrible" | "anxious";

export interface CycleLog {
  date: string;
  isPeriod: boolean;
  flow?: "light" | "medium" | "heavy";
  symptoms?: string[];
  notes?: string;
}

export interface DailyLog {
  date: string;
  mood?: Mood;
  waterCups: number;
  beautyAM: boolean;
  beautyPM: boolean;
  sleepHours?: number;
}

export interface CycleSettings {
  cycleLength: number;
  periodLength: number;
  lastPeriodStart: string | null;
}

export interface QadhaLog {
  id: string;
  date: string;
  type: "missed" | "made_up";
  notes?: string;
  createdAt: string;
}

export interface QadhaSummary {
  baseTotalMissed: number;
  totalMissed: number;
  totalMadeUp: number;
  remaining: number;
  updatedAt: string;
}

export const DEFAULT_QADHA_SUMMARY: QadhaSummary = {
  baseTotalMissed: 0,
  totalMissed: 0,
  totalMadeUp: 0,
  remaining: 0,
  updatedAt: new Date().toISOString(),
};

export interface PregnancySettings {
  enabled: boolean;
  lmpDate: string | null;
  dueDate: string | null;
}

export const DEFAULT_PREGNANCY_SETTINGS: PregnancySettings = {
  enabled: false,
  lmpDate: null,
  dueDate: null,
};

export interface BeautyProduct {
  id: string;
  name: string;
  category: "cleanser" | "toner" | "serum" | "moisturizer" | "mask" | "exfoliant" | "other";
  expiryDate?: string;
  addedDate: string;
}

export interface BeautyRoutineLog {
  date: string;
  amSteps: string[];
  pmSteps: string[];
}

export type RoutineTime = "morning" | "evening" | "any";
export type RoutineFrequency = "daily" | "weekly" | "monthly";

export interface CustomRoutine {
  id: string;
  name: string;
  time: RoutineTime;
  frequency: RoutineFrequency;
  steps: string[];
  startDate?: string;
  reminderEnabled: boolean;
  reminderTime?: string;
  notificationId?: string;
  createdAt: string;
}

export type RoutineType = "morning" | "evening" | "weekly" | "monthly";

export type FontScale = "small" | "medium" | "large";

export interface Daughter {
  id: string;
  name: string;
  age: number;
  cycleSettings: CycleSettings;
  cycleLogs: CycleLog[];
}

export interface UserSettings {
  persona: Persona;
  name: string;
  nameAr: string;
  nameEn: string;
  age?: number;
  language: "ar" | "en";
  theme: "light" | "dark" | "system";
  calendarType: "gregorian" | "hijri" | "both";
  cycleSettings: CycleSettings;
  wellnessGoals?: {
    waterCups: number;
    sleepHours: number;
  };
  notificationsEnabled: boolean;
  isSubscribed: boolean;
  onboardingComplete: boolean;
  fontScale: FontScale;
}

export interface AppData {
  settings: UserSettings;
  cycleLogs: CycleLog[];
  dailyLogs: DailyLog[];
  qadhaLogs: QadhaLog[];
  qadhaSummary: QadhaSummary;
  beautyProducts: BeautyProduct[];
  beautyRoutineLogs: BeautyRoutineLog[];
  daughters: Daughter[];
  customRoutines: CustomRoutine[];
  pregnancySettings: PregnancySettings;
}

export const DEFAULT_SETTINGS: UserSettings = {
  persona: "single",
  name: "",
  nameAr: "",
  nameEn: "",
  language: "ar",
  theme: "system",
  calendarType: "hijri",
  cycleSettings: {
    cycleLength: 28,
    periodLength: 5,
    lastPeriodStart: null,
  },
  notificationsEnabled: true,
  isSubscribed: false,
  onboardingComplete: false,
  fontScale: "medium",
};

export const DEFAULT_APP_DATA: AppData = {
  settings: DEFAULT_SETTINGS,
  cycleLogs: [],
  dailyLogs: [],
  qadhaLogs: [],
  qadhaSummary: DEFAULT_QADHA_SUMMARY,
  beautyProducts: [],
  beautyRoutineLogs: [],
  daughters: [],
  customRoutines: [],
  pregnancySettings: DEFAULT_PREGNANCY_SETTINGS,
};

export type HairGoal = "length" | "thickness";
export type HijamaPreference = "yes" | "no";
export type BeautyPreference = "spa" | "natural" | "avoid_laser" | "massage" | "yoga" | "quick_routines";

export type SubscriptionStatus = "free" | "plus" | "trial";

export interface SubscriptionPlan {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  currency: string;
  period: "monthly" | "yearly";
  trialDays: number;
  features: string[];
  featuresAr: string[];
}

export interface UserSubscription {
  userId: string;
  status: SubscriptionStatus;
  planCode: "monthly" | "yearly" | null;
  activatedAt: string | null;
  expiresAt: string | null;
  trialEndsAt: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

export type HormonalPhase = "comfort" | "regeneration" | "peak_beauty" | "balance";

export interface BeautyPlannerInput {
  cycleDay: number;
  lunarDay: number;
  persona: Persona;
  preferences: BeautyPreference[];
  hairGoal: HairGoal;
  hijamaPreference: HijamaPreference;
  isPremiumUser: boolean;
  language: "ar" | "en";
}

export interface BeautyPlannerResultPremium {
  type: "premium";
  phase: string;
  phaseKey: HormonalPhase;
  recommended: string[];
  avoid: string[];
  hairNote: string;
  hijamaNote: string;
  personaNote: string;
  wellness: string;
}

export interface BeautyPlannerResultFree {
  type: "free";
  phase: string;
  phaseKey: HormonalPhase;
  sample: string;
  upsell: string;
}

export type BeautyPlannerResult = BeautyPlannerResultPremium | BeautyPlannerResultFree;

export interface BeautyPlannerSettings {
  hairGoal: HairGoal;
  hijamaPreference: HijamaPreference;
  preferences: BeautyPreference[];
}
