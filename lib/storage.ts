import AsyncStorage from "@react-native-async-storage/async-storage";
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
  PregnancySettings,
  DEFAULT_APP_DATA,
  DEFAULT_SETTINGS,
  DEFAULT_QADHA_SUMMARY,
  DEFAULT_PREGNANCY_SETTINGS,
} from "./types";

const STORAGE_KEYS = {
  SETTINGS: "@wardaty_settings",
  CYCLE_LOGS: "@wardaty_cycle_logs",
  DAILY_LOGS: "@wardaty_daily_logs",
  QADHA_LOGS: "@wardaty_qadha_logs",
  QADHA_SUMMARY: "@wardaty_qadha_summary",
  BEAUTY_PRODUCTS: "@wardaty_beauty_products",
  BEAUTY_ROUTINE_LOGS: "@wardaty_beauty_routine_logs",
  DAUGHTERS: "@wardaty_daughters",
  CUSTOM_ROUTINES: "@wardaty_custom_routines",
  PREGNANCY_SETTINGS: "@wardaty_pregnancy_settings",
};

export async function loadSettings(): Promise<UserSettings> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (data) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error("Error loading settings:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving settings:", error);
  }
}

export async function loadCycleLogs(): Promise<CycleLog[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CYCLE_LOGS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading cycle logs:", error);
    return [];
  }
}

export async function saveCycleLogs(logs: CycleLog[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CYCLE_LOGS, JSON.stringify(logs));
  } catch (error) {
    console.error("Error saving cycle logs:", error);
  }
}

export async function loadDailyLogs(): Promise<DailyLog[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading daily logs:", error);
    return [];
  }
}

export async function saveDailyLogs(logs: DailyLog[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
  } catch (error) {
    console.error("Error saving daily logs:", error);
  }
}

export async function loadQadhaLogs(): Promise<QadhaLog[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.QADHA_LOGS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading qadha logs:", error);
    return [];
  }
}

export async function saveQadhaLogs(logs: QadhaLog[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.QADHA_LOGS, JSON.stringify(logs));
  } catch (error) {
    console.error("Error saving qadha logs:", error);
  }
}

export async function loadQadhaSummary(): Promise<QadhaSummary> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.QADHA_SUMMARY);
    if (data) {
      return { ...DEFAULT_QADHA_SUMMARY, ...JSON.parse(data) };
    }
    return DEFAULT_QADHA_SUMMARY;
  } catch (error) {
    console.error("Error loading qadha summary:", error);
    return DEFAULT_QADHA_SUMMARY;
  }
}

export async function saveQadhaSummary(summary: QadhaSummary): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.QADHA_SUMMARY, JSON.stringify(summary));
  } catch (error) {
    console.error("Error saving qadha summary:", error);
  }
}

export async function loadBeautyProducts(): Promise<BeautyProduct[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.BEAUTY_PRODUCTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading beauty products:", error);
    return [];
  }
}

export async function saveBeautyProducts(products: BeautyProduct[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.BEAUTY_PRODUCTS, JSON.stringify(products));
  } catch (error) {
    console.error("Error saving beauty products:", error);
  }
}

export async function loadBeautyRoutineLogs(): Promise<BeautyRoutineLog[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.BEAUTY_ROUTINE_LOGS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading beauty routine logs:", error);
    return [];
  }
}

export async function saveBeautyRoutineLogs(logs: BeautyRoutineLog[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.BEAUTY_ROUTINE_LOGS, JSON.stringify(logs));
  } catch (error) {
    console.error("Error saving beauty routine logs:", error);
  }
}

export async function loadDaughters(): Promise<Daughter[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.DAUGHTERS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading daughters:", error);
    return [];
  }
}

export async function saveDaughters(daughters: Daughter[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.DAUGHTERS, JSON.stringify(daughters));
  } catch (error) {
    console.error("Error saving daughters:", error);
  }
}

export async function loadCustomRoutines(): Promise<CustomRoutine[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_ROUTINES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading custom routines:", error);
    return [];
  }
}

export async function saveCustomRoutines(routines: CustomRoutine[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_ROUTINES, JSON.stringify(routines));
  } catch (error) {
    console.error("Error saving custom routines:", error);
  }
}

export async function loadPregnancySettings(): Promise<PregnancySettings> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PREGNANCY_SETTINGS);
    if (data) {
      return { ...DEFAULT_PREGNANCY_SETTINGS, ...JSON.parse(data) };
    }
    return DEFAULT_PREGNANCY_SETTINGS;
  } catch (error) {
    console.error("Error loading pregnancy settings:", error);
    return DEFAULT_PREGNANCY_SETTINGS;
  }
}

export async function savePregnancySettings(settings: PregnancySettings): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PREGNANCY_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving pregnancy settings:", error);
  }
}

export async function loadAllData(): Promise<AppData> {
  try {
    const [settings, cycleLogs, dailyLogs, qadhaLogs, qadhaSummary, beautyProducts, beautyRoutineLogs, daughters, customRoutines, pregnancySettings] =
      await Promise.all([
        loadSettings(),
        loadCycleLogs(),
        loadDailyLogs(),
        loadQadhaLogs(),
        loadQadhaSummary(),
        loadBeautyProducts(),
        loadBeautyRoutineLogs(),
        loadDaughters(),
        loadCustomRoutines(),
        loadPregnancySettings(),
      ]);

    const migratedRoutines = migrateCustomRoutines(customRoutines);
    if (migratedRoutines.needsSave) {
      await saveCustomRoutines(migratedRoutines.routines);
    }

    return {
      settings,
      cycleLogs,
      dailyLogs,
      qadhaLogs,
      qadhaSummary,
      beautyProducts,
      beautyRoutineLogs,
      daughters,
      customRoutines: migratedRoutines.routines,
      pregnancySettings,
    };
  } catch (error) {
    console.error("Error loading all data:", error);
    return DEFAULT_APP_DATA;
  }
}

function migrateCustomRoutines(routines: CustomRoutine[]): { routines: CustomRoutine[]; needsSave: boolean } {
  let needsSave = false;

  const migratedRoutines = routines.map((routine) => {
    const legacyRoutine = routine as CustomRoutine & { type?: string };
    
    if (legacyRoutine.type && !routine.time) {
      needsSave = true;
      let time: "morning" | "evening" | "any";
      let frequency: "daily" | "weekly" | "monthly";

      switch (legacyRoutine.type) {
        case "morning":
          time = "morning";
          frequency = "daily";
          break;
        case "evening":
          time = "evening";
          frequency = "daily";
          break;
        case "weekly":
          time = "any";
          frequency = "weekly";
          break;
        case "monthly":
          time = "any";
          frequency = "monthly";
          break;
        default:
          time = "any";
          frequency = "daily";
      }

      const migratedRoutine: CustomRoutine = {
        ...routine,
        time,
        frequency,
        reminderEnabled: routine.reminderEnabled ?? false,
        startDate: routine.startDate || (frequency !== "daily" ? routine.createdAt?.split("T")[0] : undefined),
      };

      delete (migratedRoutine as any).type;
      return migratedRoutine;
    }

    if (routine.reminderEnabled === undefined) {
      needsSave = true;
      return {
        ...routine,
        reminderEnabled: false,
      };
    }

    return routine;
  });

  return { routines: migratedRoutines, needsSave };
}

export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error("Error clearing all data:", error);
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
