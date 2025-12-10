import { CycleLog, CycleSettings } from "./types";

export function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

export function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

export function daysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function formatDate(dateStr: string, format: "short" | "long" = "short"): string {
  const date = new Date(dateStr);
  if (format === "short") {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function getDayOfWeek(dateStr: string, isArabic: boolean = false): string {
  const date = new Date(dateStr);
  if (isArabic) {
    const dayNames = ["أحد", "إثن", "ثلث", "أربع", "خميس", "جمعة", "سبت"];
    return dayNames[date.getDay()];
  }
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export function getCurrentCycleDay(
  lastPeriodStart: string | null,
  cycleLength: number
): number | null {
  if (!lastPeriodStart) return null;
  
  const today = getTodayString();
  const daysSinceStart = daysBetween(lastPeriodStart, today);
  
  if (daysSinceStart < 0) return null;
  
  const cycleDay = (daysSinceStart % cycleLength) + 1;
  return cycleDay;
}

export function getNextPeriodDate(
  lastPeriodStart: string | null,
  cycleLength: number
): string | null {
  if (!lastPeriodStart) return null;
  
  const today = getTodayString();
  const daysSinceStart = daysBetween(lastPeriodStart, today);
  
  const cyclesCompleted = Math.floor(daysSinceStart / cycleLength);
  const nextPeriodStart = addDays(lastPeriodStart, (cyclesCompleted + 1) * cycleLength);
  
  return nextPeriodStart;
}

export function getDaysUntilNextPeriod(
  lastPeriodStart: string | null,
  cycleLength: number
): number | null {
  const nextPeriod = getNextPeriodDate(lastPeriodStart, cycleLength);
  if (!nextPeriod) return null;
  
  return daysBetween(getTodayString(), nextPeriod);
}

export function isPeriodDay(
  dateStr: string,
  lastPeriodStart: string | null,
  cycleLength: number,
  periodLength: number
): boolean {
  if (!lastPeriodStart) return false;
  
  const daysSinceStart = daysBetween(lastPeriodStart, dateStr);
  if (daysSinceStart < 0) return false;
  
  const dayInCycle = (daysSinceStart % cycleLength) + 1;
  return dayInCycle <= periodLength;
}

export function isFertileDay(
  dateStr: string,
  lastPeriodStart: string | null,
  cycleLength: number
): boolean {
  if (!lastPeriodStart) return false;
  
  const daysSinceStart = daysBetween(lastPeriodStart, dateStr);
  if (daysSinceStart < 0) return false;
  
  const dayInCycle = (daysSinceStart % cycleLength) + 1;
  const ovulationDay = cycleLength - 14;
  const fertileStart = ovulationDay - 5;
  const fertileEnd = ovulationDay + 1;
  
  return dayInCycle >= fertileStart && dayInCycle <= fertileEnd;
}

export function isOvulationDay(
  dateStr: string,
  lastPeriodStart: string | null,
  cycleLength: number
): boolean {
  if (!lastPeriodStart) return false;
  
  const daysSinceStart = daysBetween(lastPeriodStart, dateStr);
  if (daysSinceStart < 0) return false;
  
  const dayInCycle = (daysSinceStart % cycleLength) + 1;
  const ovulationDay = cycleLength - 14;
  
  return dayInCycle === ovulationDay;
}

export function getFertileWindow(
  lastPeriodStart: string | null,
  cycleLength: number
): { start: string; end: string } | null {
  if (!lastPeriodStart) return null;
  
  const today = getTodayString();
  const daysSinceStart = daysBetween(lastPeriodStart, today);
  const cyclesCompleted = Math.floor(daysSinceStart / cycleLength);
  
  const currentCycleStart = addDays(lastPeriodStart, cyclesCompleted * cycleLength);
  const ovulationDay = cycleLength - 14;
  
  const fertileStart = addDays(currentCycleStart, ovulationDay - 6);
  const fertileEnd = addDays(currentCycleStart, ovulationDay);
  
  return { start: fertileStart, end: fertileEnd };
}

export function getCyclePhase(
  dateStr: string,
  lastPeriodStart: string | null,
  cycleSettings: CycleSettings
): "period" | "fertile" | "ovulation" | "normal" {
  if (!lastPeriodStart) return "normal";
  
  if (isPeriodDay(dateStr, lastPeriodStart, cycleSettings.cycleLength, cycleSettings.periodLength)) {
    return "period";
  }
  
  if (isOvulationDay(dateStr, lastPeriodStart, cycleSettings.cycleLength)) {
    return "ovulation";
  }
  
  if (isFertileDay(dateStr, lastPeriodStart, cycleSettings.cycleLength)) {
    return "fertile";
  }
  
  return "normal";
}

export type DetailedCyclePhase = "period" | "follicular" | "fertile" | "ovulation" | "luteal";

export function getDetailedCyclePhase(
  dateStr: string,
  lastPeriodStart: string | null,
  cycleSettings: CycleSettings
): DetailedCyclePhase {
  if (!lastPeriodStart) return "follicular";
  
  const daysSinceStart = daysBetween(lastPeriodStart, dateStr);
  if (daysSinceStart < 0) return "follicular";
  
  const dayInCycle = (daysSinceStart % cycleSettings.cycleLength) + 1;
  const ovulationDay = cycleSettings.cycleLength - 14;
  const fertileStart = ovulationDay - 5;
  const fertileEnd = ovulationDay + 1;
  
  if (dayInCycle <= cycleSettings.periodLength) {
    return "period";
  }
  
  if (dayInCycle === ovulationDay) {
    return "ovulation";
  }
  
  if (dayInCycle >= fertileStart && dayInCycle <= fertileEnd) {
    return "fertile";
  }
  
  if (dayInCycle < ovulationDay) {
    return "follicular";
  }
  
  return "luteal";
}

export function getCycleDayForDate(
  dateStr: string,
  lastPeriodStart: string | null,
  cycleLength: number
): number | null {
  if (!lastPeriodStart) return null;
  
  const daysSinceStart = daysBetween(lastPeriodStart, dateStr);
  if (daysSinceStart < 0) return null;
  
  return (daysSinceStart % cycleLength) + 1;
}

export function getUpcomingDays(count: number): string[] {
  const today = getTodayString();
  const days: string[] = [];
  
  for (let i = 0; i < count; i++) {
    days.push(addDays(today, i));
  }
  
  return days;
}

export function getTimeOfDay(): "morning" | "afternoon" | "evening" | "night" {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export function getGreeting(name: string): string {
  const timeOfDay = getTimeOfDay();
  const greetings = {
    morning: `Good morning${name ? `, ${name}` : ""}`,
    afternoon: `Good afternoon${name ? `, ${name}` : ""}`,
    evening: `Good evening${name ? `, ${name}` : ""}`,
    night: `Good night${name ? `, ${name}` : ""}`,
  };
  
  return greetings[timeOfDay];
}

export function getDateForCycleDay(
  cycleDay: number,
  lastPeriodStart: string | null,
  cycleLength: number
): string | null {
  if (!lastPeriodStart || cycleDay < 1 || cycleDay > cycleLength) return null;
  
  const today = getTodayString();
  const currentCycleDay = getCurrentCycleDay(lastPeriodStart, cycleLength);
  
  if (currentCycleDay === null) return null;
  
  const dayDifference = cycleDay - currentCycleDay;
  return addDays(today, dayDifference);
}

export function getPhaseForCycleDay(
  cycleDay: number,
  cycleLength: number,
  periodLength: number,
  showFertile: boolean = false
): { phase: DetailedCyclePhase; color: string } {
  const ovulationDay = cycleLength - 14;
  const fertileStart = ovulationDay - 5;
  const fertileEnd = ovulationDay + 1;
  
  if (cycleDay <= periodLength) {
    return { phase: "period", color: "#FF3860" };
  }
  
  if (showFertile && cycleDay === ovulationDay) {
    return { phase: "ovulation", color: "#BA68C8" };
  }
  
  if (showFertile && cycleDay >= fertileStart && cycleDay <= fertileEnd) {
    return { phase: "fertile", color: "#8C64F0" };
  }
  
  if (cycleDay < ovulationDay) {
    return { phase: "follicular", color: "#4CAF50" };
  }
  
  return { phase: "luteal", color: "#FF9800" };
}

export function formatDateForRing(dateStr: string, isArabic: boolean = false): string {
  const date = new Date(dateStr);
  const day = date.getDate();
  
  const monthNamesEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthNamesAr = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  
  const month = isArabic ? monthNamesAr[date.getMonth()] : monthNamesEn[date.getMonth()];
  
  return isArabic ? `${day} ${month}` : `${month} ${day}`;
}
