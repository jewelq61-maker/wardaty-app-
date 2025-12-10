import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import {
  AppData,
  UserSettings,
  CycleLog,
  DailyLog,
  QadhaLog,
  QadhaSummary,
  BeautyProduct,
  BeautyRoutineLog,
  Daughter,
  CustomRoutine,
  RoutineTime,
  RoutineFrequency,
  Mood,
  PregnancySettings,
  DEFAULT_APP_DATA,
  DEFAULT_SETTINGS,
  DEFAULT_QADHA_SUMMARY,
  DEFAULT_PREGNANCY_SETTINGS,
  UserSubscription,
  SubscriptionPlan,
  SubscriptionStatus,
} from "./types";
import { getApiUrl, apiRequest } from "./query-client";
import {
  loadAllData,
  saveSettings,
  saveCycleLogs,
  saveDailyLogs,
  saveQadhaLogs,
  saveQadhaSummary,
  saveBeautyProducts,
  saveBeautyRoutineLogs,
  saveDaughters,
  saveCustomRoutines,
  savePregnancySettings,
  generateId,
  clearAllData,
} from "./storage";
import { getTodayString } from "./cycle-utils";

const DEFAULT_SUBSCRIPTION: UserSubscription = {
  userId: "default",
  status: "free",
  planCode: null,
  activatedAt: null,
  expiresAt: null,
  trialEndsAt: null,
};

interface AppContextType {
  data: AppData;
  isLoading: boolean;
  isPlus: boolean;
  isTrial: boolean;
  subscription: UserSubscription;
  subscriptionPlans: SubscriptionPlan[];
  refreshSubscription: () => Promise<void>;
  activateSubscription: (planCode: "monthly" | "yearly", startTrial?: boolean) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  addCycleLog: (log: Omit<CycleLog, "date"> & { date?: string }) => Promise<void>;
  updateDailyLog: (updates: Partial<DailyLog>) => Promise<void>;
  getTodaysDailyLog: () => DailyLog;
  initializeQadha: (totalMissed: number) => Promise<void>;
  addMadeUpDay: (date?: string, notes?: string) => Promise<void>;
  addMissedDay: (date?: string, notes?: string) => Promise<void>;
  deleteMadeUpDay: (logId: string) => Promise<void>;
  updateTotalMissed: (newTotal: number) => Promise<void>;
  getQadhaCalendarMarks: (month: number, year: number) => string[];
  autoRecalculateQadha: () => Promise<void>;
  addBeautyProduct: (product: Omit<BeautyProduct, "id" | "addedDate">) => Promise<void>;
  deleteBeautyProduct: (id: string) => Promise<void>;
  updateBeautyRoutine: (amStep?: string, pmStep?: string) => Promise<void>;
  getTodaysBeautyRoutine: () => BeautyRoutineLog;
  addDaughter: (daughter: Omit<Daughter, "id" | "cycleLogs">) => Promise<void>;
  updateDaughter: (id: string, updates: Partial<Daughter>) => Promise<void>;
  deleteDaughter: (id: string) => Promise<void>;
  addCustomRoutine: (routine: {
    name: string;
    time: RoutineTime;
    frequency: RoutineFrequency;
    steps: string[];
    startDate?: string;
    reminderEnabled: boolean;
    reminderTime?: string;
  }) => Promise<void>;
  updateCustomRoutine: (id: string, updates: Partial<CustomRoutine>) => Promise<void>;
  deleteCustomRoutine: (id: string) => Promise<void>;
  resetApp: () => Promise<void>;
  enablePregnancy: (lmpDate: string) => Promise<void>;
  disablePregnancy: () => Promise<void>;
  getPregnancyWeek: () => number | null;
  getPregnancyTrimester: () => number | null;
  getPregnancyDueDate: () => string | null;
  getPregnancyDaysRemaining: () => number | null;
  addQadhaLog: (type: "missed" | "completed") => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(DEFAULT_APP_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<UserSubscription>(DEFAULT_SUBSCRIPTION);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);

  const isPlus = useMemo(() => {
    return subscription.status === "plus" || subscription.status === "trial";
  }, [subscription.status]);

  const isTrial = useMemo(() => {
    return subscription.status === "trial";
  }, [subscription.status]);

  useEffect(() => {
    loadData();
    fetchSubscriptionData();
  }, []);

  async function fetchSubscriptionData() {
    try {
      const baseUrl = getApiUrl();
      
      const [plansRes, currentRes] = await Promise.all([
        fetch(new URL("/api/subscription/plans", baseUrl).toString()),
        fetch(new URL("/api/subscription/current", baseUrl).toString()),
      ]);

      if (plansRes.ok) {
        const plans = await plansRes.json();
        setSubscriptionPlans(plans);
      }

      if (currentRes.ok) {
        const current = await currentRes.json();
        setSubscription(current);
      }
    } catch (error) {
      console.error("Error fetching subscription data:", error);
    }
  }

  const refreshSubscription = useCallback(async () => {
    try {
      const baseUrl = getApiUrl();
      const res = await fetch(new URL("/api/subscription/current", baseUrl).toString());
      if (res.ok) {
        const current = await res.json();
        setSubscription(current);
      }
    } catch (error) {
      console.error("Error refreshing subscription:", error);
    }
  }, []);

  const activateSubscriptionFn = useCallback(async (planCode: "monthly" | "yearly", startTrial: boolean = false) => {
    try {
      const baseUrl = getApiUrl();
      const res = await apiRequest("POST", new URL("/api/subscription/activate", baseUrl).toString(), {
        planCode,
        startTrial,
      });
      
      if (res.ok) {
        const updated = await res.json();
        setSubscription(updated);
        await updateSettings({ isSubscribed: true });
      }
    } catch (error) {
      console.error("Error activating subscription:", error);
      throw error;
    }
  }, []);

  const cancelSubscriptionFn = useCallback(async () => {
    try {
      const baseUrl = getApiUrl();
      const res = await apiRequest("POST", new URL("/api/subscription/cancel", baseUrl).toString(), {});
      
      if (res.ok) {
        const updated = await res.json();
        setSubscription(updated);
        await updateSettings({ isSubscribed: false });
      }
    } catch (error) {
      console.error("Error canceling subscription:", error);
      throw error;
    }
  }, []);

  async function loadData() {
    try {
      const loadedData = await loadAllData();
      setData(loadedData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateSettings(updates: Partial<UserSettings>) {
    const newSettings = { ...data.settings, ...updates };
    setData((prev) => ({ ...prev, settings: newSettings }));
    await saveSettings(newSettings);
  }

  async function addCycleLog(log: Omit<CycleLog, "date"> & { date?: string }) {
    const newLog: CycleLog = {
      ...log,
      date: log.date || getTodayString(),
    };
    
    const existingIndex = data.cycleLogs.findIndex((l) => l.date === newLog.date);
    let newLogs: CycleLog[];
    
    if (existingIndex >= 0) {
      newLogs = [...data.cycleLogs];
      newLogs[existingIndex] = newLog;
    } else {
      newLogs = [...data.cycleLogs, newLog];
    }
    
    setData((prev) => ({ ...prev, cycleLogs: newLogs }));
    await saveCycleLogs(newLogs);
    
    if (newLog.isPeriod && !data.settings.cycleSettings.lastPeriodStart) {
      await updateSettings({
        cycleSettings: {
          ...data.settings.cycleSettings,
          lastPeriodStart: newLog.date,
        },
      });
    }
  }

  function getTodaysDailyLog(): DailyLog {
    const today = getTodayString();
    const existing = data.dailyLogs.find((l) => l.date === today);
    return existing || {
      date: today,
      waterCups: 0,
      beautyAM: false,
      beautyPM: false,
    };
  }

  async function updateDailyLog(updates: Partial<DailyLog>) {
    const today = getTodayString();
    const existingIndex = data.dailyLogs.findIndex((l) => l.date === today);
    
    let newLogs: DailyLog[];
    
    if (existingIndex >= 0) {
      newLogs = [...data.dailyLogs];
      newLogs[existingIndex] = { ...newLogs[existingIndex], ...updates };
    } else {
      newLogs = [...data.dailyLogs, { date: today, waterCups: 0, beautyAM: false, beautyPM: false, ...updates }];
    }
    
    setData((prev) => ({ ...prev, dailyLogs: newLogs }));
    await saveDailyLogs(newLogs);
  }

  async function initializeQadha(totalMissed: number) {
    const now = new Date().toISOString();
    const newSummary: QadhaSummary = {
      baseTotalMissed: totalMissed,
      totalMissed,
      totalMadeUp: 0,
      remaining: totalMissed,
      updatedAt: now,
    };
    
    setData((prev) => ({ ...prev, qadhaSummary: newSummary, qadhaLogs: [] }));
    await Promise.all([
      saveQadhaSummary(newSummary),
      saveQadhaLogs([]),
    ]);
  }

  async function addMadeUpDay(date?: string, notes?: string) {
    const targetDate = date || getTodayString();
    const now = new Date().toISOString();
    const logId = generateId();
    
    let newLogs: QadhaLog[] = [];
    let newSummary: QadhaSummary = DEFAULT_QADHA_SUMMARY;
    let shouldSkip = false;
    
    setData((prev) => {
      const existingLog = prev.qadhaLogs.find(
        (log) => log.date === targetDate && log.type === "made_up"
      );
      if (existingLog) {
        shouldSkip = true;
        return prev;
      }
      
      const newLog: QadhaLog = {
        id: logId,
        date: targetDate,
        type: "made_up",
        notes,
        createdAt: now,
      };
      
      newLogs = [...prev.qadhaLogs, newLog];
      const madeUpCount = newLogs.filter((l) => l.type === "made_up").length;
      const newRemaining = Math.max(prev.qadhaSummary.totalMissed - madeUpCount, 0);
      
      newSummary = {
        ...prev.qadhaSummary,
        totalMadeUp: madeUpCount,
        remaining: newRemaining,
        updatedAt: now,
      };
      
      return {
        ...prev,
        qadhaLogs: newLogs,
        qadhaSummary: newSummary,
      };
    });
    
    if (shouldSkip) return;
    
    await Promise.all([
      saveQadhaLogs(newLogs),
      saveQadhaSummary(newSummary),
    ]);
  }

  async function addMissedDay(date?: string, notes?: string) {
    const now = new Date().toISOString();
    const logDate = date || getTodayString();
    const logId = generateId();
    
    let newLogs: QadhaLog[] = [];
    let newSummary: QadhaSummary = DEFAULT_QADHA_SUMMARY;
    let shouldSkip = false;
    
    setData((prev) => {
      const existingLog = prev.qadhaLogs.find(
        (log) => log.date === logDate && log.type === "missed"
      );
      if (existingLog) {
        shouldSkip = true;
        return prev;
      }
      
      const newLog: QadhaLog = {
        id: logId,
        date: logDate,
        type: "missed",
        notes,
        createdAt: now,
      };
      
      newLogs = [...prev.qadhaLogs, newLog];
      const newTotalMissed = prev.qadhaSummary.totalMissed + 1;
      const newRemaining = Math.max(newTotalMissed - prev.qadhaSummary.totalMadeUp, 0);
      
      newSummary = {
        ...prev.qadhaSummary,
        totalMissed: newTotalMissed,
        remaining: newRemaining,
        updatedAt: now,
      };
      
      return {
        ...prev,
        qadhaLogs: newLogs,
        qadhaSummary: newSummary,
      };
    });
    
    if (shouldSkip) return;
    
    await Promise.all([
      saveQadhaLogs(newLogs),
      saveQadhaSummary(newSummary),
    ]);
  }

  async function deleteMadeUpDay(logId: string) {
    const now = new Date().toISOString();
    
    let newLogs: QadhaLog[] = [];
    let newSummary: QadhaSummary = DEFAULT_QADHA_SUMMARY;
    let shouldSkip = false;
    
    setData((prev) => {
      const logToDelete = prev.qadhaLogs.find((l) => l.id === logId);
      if (!logToDelete) {
        shouldSkip = true;
        return prev;
      }
      
      newLogs = prev.qadhaLogs.filter((l) => l.id !== logId);
      
      const missedLogCount = newLogs.filter((l) => l.type === "missed").length;
      const madeUpLogCount = newLogs.filter((l) => l.type === "made_up").length;
      const baseTotalMissed = prev.qadhaSummary.baseTotalMissed ?? 0;
      const newTotalMissed = baseTotalMissed + missedLogCount;
      const newRemaining = Math.max(newTotalMissed - madeUpLogCount, 0);
      
      newSummary = {
        baseTotalMissed,
        totalMissed: newTotalMissed,
        totalMadeUp: madeUpLogCount,
        remaining: newRemaining,
        updatedAt: now,
      };
      
      return {
        ...prev,
        qadhaLogs: newLogs,
        qadhaSummary: newSummary,
      };
    });
    
    if (shouldSkip) return;
    
    await Promise.all([
      saveQadhaLogs(newLogs),
      saveQadhaSummary(newSummary),
    ]);
  }

  async function updateTotalMissed(newTotal: number) {
    const now = new Date().toISOString();
    
    let newSummary: QadhaSummary = DEFAULT_QADHA_SUMMARY;
    let shouldSkip = false;
    
    setData((prev) => {
      const missedLogCount = prev.qadhaLogs.filter((l) => l.type === "missed").length;
      
      if (newTotal < missedLogCount) {
        console.warn(`Cannot set totalMissed (${newTotal}) below recorded missed log count (${missedLogCount})`);
        shouldSkip = true;
        return prev;
      }
      
      const newBaseTotalMissed = newTotal - missedLogCount;
      const newRemaining = Math.max(newTotal - prev.qadhaSummary.totalMadeUp, 0);
      
      newSummary = {
        ...prev.qadhaSummary,
        baseTotalMissed: newBaseTotalMissed,
        totalMissed: newTotal,
        remaining: newRemaining,
        updatedAt: now,
      };
      
      return { ...prev, qadhaSummary: newSummary };
    });
    
    if (shouldSkip) return;
    
    await saveQadhaSummary(newSummary);
  }

  function getQadhaCalendarMarks(month: number, year: number): string[] {
    return data.qadhaLogs
      .filter((log) => {
        if (log.type !== "made_up") return false;
        const logDate = new Date(log.date);
        return logDate.getMonth() === month && logDate.getFullYear() === year;
      })
      .map((log) => log.date);
  }

  async function autoRecalculateQadha() {
    const now = new Date().toISOString();
    
    let newSummary: QadhaSummary = DEFAULT_QADHA_SUMMARY;
    
    setData((prev) => {
      const missedLogCount = prev.qadhaLogs.filter((l) => l.type === "missed").length;
      const madeUpCount = prev.qadhaLogs.filter((l) => l.type === "made_up").length;
      const baseTotalMissed = prev.qadhaSummary.baseTotalMissed ?? 0;
      
      const totalMissed = baseTotalMissed + missedLogCount;
      const remaining = Math.max(totalMissed - madeUpCount, 0);
      
      newSummary = {
        baseTotalMissed,
        totalMissed,
        totalMadeUp: madeUpCount,
        remaining,
        updatedAt: now,
      };
      
      return { ...prev, qadhaSummary: newSummary };
    });
    
    await saveQadhaSummary(newSummary);
  }

  async function addBeautyProduct(product: Omit<BeautyProduct, "id" | "addedDate">) {
    const newProduct: BeautyProduct = {
      ...product,
      id: generateId(),
      addedDate: getTodayString(),
    };
    
    const newProducts = [...data.beautyProducts, newProduct];
    setData((prev) => ({ ...prev, beautyProducts: newProducts }));
    await saveBeautyProducts(newProducts);
  }

  async function deleteBeautyProduct(id: string) {
    const newProducts = data.beautyProducts.filter((p) => p.id !== id);
    setData((prev) => ({ ...prev, beautyProducts: newProducts }));
    await saveBeautyProducts(newProducts);
  }

  function getTodaysBeautyRoutine(): BeautyRoutineLog {
    const today = getTodayString();
    const existing = data.beautyRoutineLogs.find((l) => l.date === today);
    return existing || {
      date: today,
      amSteps: [],
      pmSteps: [],
    };
  }

  async function updateBeautyRoutine(amStep?: string, pmStep?: string) {
    const today = getTodayString();
    const existingIndex = data.beautyRoutineLogs.findIndex((l) => l.date === today);
    
    let newLogs: BeautyRoutineLog[];
    
    if (existingIndex >= 0) {
      newLogs = [...data.beautyRoutineLogs];
      const current = newLogs[existingIndex];
      
      if (amStep) {
        if (current.amSteps.includes(amStep)) {
          current.amSteps = current.amSteps.filter((s) => s !== amStep);
        } else {
          current.amSteps = [...current.amSteps, amStep];
        }
      }
      
      if (pmStep) {
        if (current.pmSteps.includes(pmStep)) {
          current.pmSteps = current.pmSteps.filter((s) => s !== pmStep);
        } else {
          current.pmSteps = [...current.pmSteps, pmStep];
        }
      }
    } else {
      newLogs = [
        ...data.beautyRoutineLogs,
        {
          date: today,
          amSteps: amStep ? [amStep] : [],
          pmSteps: pmStep ? [pmStep] : [],
        },
      ];
    }
    
    setData((prev) => ({ ...prev, beautyRoutineLogs: newLogs }));
    await saveBeautyRoutineLogs(newLogs);
  }

  async function addDaughter(daughter: Omit<Daughter, "id" | "cycleLogs">) {
    const newDaughter: Daughter = {
      ...daughter,
      id: generateId(),
      cycleLogs: [],
    };
    
    const newDaughters = [...data.daughters, newDaughter];
    setData((prev) => ({ ...prev, daughters: newDaughters }));
    await saveDaughters(newDaughters);
  }

  async function updateDaughter(id: string, updates: Partial<Daughter>) {
    const newDaughters = data.daughters.map((d) =>
      d.id === id ? { ...d, ...updates } : d
    );
    setData((prev) => ({ ...prev, daughters: newDaughters }));
    await saveDaughters(newDaughters);
  }

  async function deleteDaughter(id: string) {
    const newDaughters = data.daughters.filter((d) => d.id !== id);
    setData((prev) => ({ ...prev, daughters: newDaughters }));
    await saveDaughters(newDaughters);
  }

  async function addCustomRoutine(routine: {
    name: string;
    time: RoutineTime;
    frequency: RoutineFrequency;
    steps: string[];
    startDate?: string;
    reminderEnabled: boolean;
    reminderTime?: string;
  }) {
    const newRoutine: CustomRoutine = {
      ...routine,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const newRoutines = [...data.customRoutines, newRoutine];
    setData((prev) => ({ ...prev, customRoutines: newRoutines }));
    await saveCustomRoutines(newRoutines);
  }

  async function updateCustomRoutine(id: string, updates: Partial<CustomRoutine>) {
    const newRoutines = data.customRoutines.map((r) =>
      r.id === id ? { ...r, ...updates } : r
    );
    setData((prev) => ({ ...prev, customRoutines: newRoutines }));
    await saveCustomRoutines(newRoutines);
  }

  async function deleteCustomRoutine(id: string) {
    const newRoutines = data.customRoutines.filter((r) => r.id !== id);
    setData((prev) => ({ ...prev, customRoutines: newRoutines }));
    await saveCustomRoutines(newRoutines);
  }

  async function enablePregnancy(lmpDate: string) {
    const lmpDateObj = new Date(lmpDate);
    const dueDateObj = new Date(lmpDateObj);
    dueDateObj.setDate(dueDateObj.getDate() + 280);
    const dueDate = dueDateObj.toISOString().split("T")[0];
    
    const newPregnancySettings: PregnancySettings = {
      enabled: true,
      lmpDate,
      dueDate,
    };
    
    setData((prev) => ({ ...prev, pregnancySettings: newPregnancySettings }));
    await savePregnancySettings(newPregnancySettings);
  }

  async function disablePregnancy() {
    const newPregnancySettings = DEFAULT_PREGNANCY_SETTINGS;
    setData((prev) => ({ ...prev, pregnancySettings: newPregnancySettings }));
    await savePregnancySettings(newPregnancySettings);
  }

  function getPregnancyWeek(): number | null {
    const { pregnancySettings } = data;
    if (!pregnancySettings.enabled || !pregnancySettings.lmpDate) {
      return null;
    }
    
    const lmpDate = new Date(pregnancySettings.lmpDate);
    const today = new Date();
    const diffTime = today.getTime() - lmpDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const week = Math.floor(diffDays / 7) + 1;
    
    return Math.min(Math.max(week, 1), 42);
  }

  function getPregnancyTrimester(): number | null {
    const week = getPregnancyWeek();
    if (week === null) return null;
    
    if (week <= 12) return 1;
    if (week <= 27) return 2;
    return 3;
  }

  function getPregnancyDueDate(): string | null {
    const { pregnancySettings } = data;
    if (!pregnancySettings.enabled || !pregnancySettings.dueDate) {
      return null;
    }
    return pregnancySettings.dueDate;
  }

  function getPregnancyDaysRemaining(): number | null {
    const { pregnancySettings } = data;
    if (!pregnancySettings.enabled || !pregnancySettings.dueDate) {
      return null;
    }
    
    const dueDate = new Date(pregnancySettings.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(diffDays, 0);
  }

  async function addQadhaLog(type: "missed" | "completed") {
    if (type === "missed") {
      await addMissedDay();
    } else {
      await addMadeUpDay();
    }
  }

  async function resetApp() {
    await clearAllData();
    setData(DEFAULT_APP_DATA);
  }

  return (
    <AppContext.Provider
      value={{
        data,
        isLoading,
        isPlus,
        isTrial,
        subscription,
        subscriptionPlans,
        refreshSubscription,
        activateSubscription: activateSubscriptionFn,
        cancelSubscription: cancelSubscriptionFn,
        updateSettings,
        addCycleLog,
        updateDailyLog,
        getTodaysDailyLog,
        initializeQadha,
        addMadeUpDay,
        addMissedDay,
        deleteMadeUpDay,
        updateTotalMissed,
        getQadhaCalendarMarks,
        autoRecalculateQadha,
        addBeautyProduct,
        deleteBeautyProduct,
        updateBeautyRoutine,
        getTodaysBeautyRoutine,
        addDaughter,
        updateDaughter,
        deleteDaughter,
        addCustomRoutine,
        updateCustomRoutine,
        deleteCustomRoutine,
        resetApp,
        enablePregnancy,
        disablePregnancy,
        getPregnancyWeek,
        getPregnancyTrimester,
        getPregnancyDueDate,
        getPregnancyDaysRemaining,
        addQadhaLog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
