const HIJRI_MONTHS_AR = [
  "محرم",
  "صفر",
  "ربيع الأول",
  "ربيع الثاني",
  "جمادى الأولى",
  "جمادى الآخرة",
  "رجب",
  "شعبان",
  "رمضان",
  "شوال",
  "ذو القعدة",
  "ذو الحجة",
];

const HIJRI_MONTHS_EN = [
  "Muharram",
  "Safar",
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  "Jumada al-Awwal",
  "Jumada al-Thani",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhu al-Qi'dah",
  "Dhu al-Hijjah",
];

export interface HijriDate {
  day: number;
  month: number;
  year: number;
  monthName: string;
  monthNameEn: string;
}

export function gregorianToHijri(date: Date): HijriDate {
  const gYear = date.getFullYear();
  const gMonth = date.getMonth() + 1;
  const gDay = date.getDate();
  
  const jd = gregorianToJulian(gYear, gMonth, gDay);
  return julianToHijri(jd);
}

export function hijriToGregorian(hYear: number, hMonth: number, hDay: number): Date {
  const jd = hijriToJulian(hYear, hMonth, hDay);
  return julianToGregorian(jd);
}

function gregorianToJulian(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  
  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
}

function julianToHijri(jd: number): HijriDate {
  const l = Math.floor(jd - 1948439.5) + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * l3) / 709);
  const day = l3 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  
  return {
    day,
    month,
    year,
    monthName: HIJRI_MONTHS_AR[month - 1] || "",
    monthNameEn: HIJRI_MONTHS_EN[month - 1] || "",
  };
}

function hijriToJulian(year: number, month: number, day: number): number {
  return day + Math.ceil(29.5001 * (month - 1)) + (year - 1) * 354 + Math.floor((3 + 11 * year) / 30) + 1948439.5 - 1;
}

function julianToGregorian(jd: number): Date {
  const z = Math.floor(jd + 0.5);
  const a = Math.floor((z - 1867216.25) / 36524.25);
  const aa = z + 1 + a - Math.floor(a / 4);
  const b = aa + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);
  
  const day = b - d - Math.floor(30.6001 * e);
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;
  
  return new Date(year, month - 1, day);
}

export function formatHijriDate(date: Date, language: "ar" | "en"): string {
  const hijri = gregorianToHijri(date);
  if (language === "ar") {
    return `${hijri.day} ${hijri.monthName} ${hijri.year}`;
  }
  return `${hijri.day} ${hijri.monthNameEn} ${hijri.year}`;
}

export function getHijriMonthName(month: number, language: "ar" | "en"): string {
  if (language === "ar") {
    return HIJRI_MONTHS_AR[month - 1] || "";
  }
  return HIJRI_MONTHS_EN[month - 1] || "";
}

export function getLunarDay(date: Date): number {
  const hijri = gregorianToHijri(date);
  return hijri.day;
}

export function isWhiteDay(date: Date): boolean {
  const lunarDay = getLunarDay(date);
  return lunarDay === 13 || lunarDay === 14 || lunarDay === 15;
}
