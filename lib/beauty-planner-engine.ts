import {
  Persona,
  BeautyPreference,
  HairGoal,
  HijamaPreference,
  HormonalPhase,
  BeautyPlannerInput,
  BeautyPlannerResult,
  BeautyPlannerResultPremium,
  BeautyPlannerResultFree,
} from "./types";

function getHormonalPhase(cycleDay: number): HormonalPhase {
  if (cycleDay >= 1 && cycleDay <= 5) return "comfort";
  if (cycleDay >= 6 && cycleDay <= 12) return "regeneration";
  if (cycleDay >= 13 && cycleDay <= 16) return "peak_beauty";
  return "balance";
}

function getPhaseLabel(phase: HormonalPhase, language: "ar" | "en"): string {
  const labels = {
    ar: {
      comfort: "مرحلة الراحة",
      regeneration: "مرحلة التجديد",
      peak_beauty: "ذروة الجمال",
      balance: "مرحلة التوازن",
    },
    en: {
      comfort: "Comfort Phase",
      regeneration: "Regeneration Phase",
      peak_beauty: "Peak Beauty",
      balance: "Balance Phase",
    },
  };
  return labels[language][phase];
}

interface PhaseRecommendations {
  recommended: { ar: string[]; en: string[] };
  avoid: { ar: string[]; en: string[] };
  wellness: { ar: string; en: string };
}

const phaseData: Record<HormonalPhase, PhaseRecommendations> = {
  comfort: {
    recommended: {
      ar: [
        "ترطيب عميق للبشرة",
        "أقنعة مهدئة للبشرة",
        "زيوت طبيعية للجسم",
        "حمام دافئ مريح",
        "تدليك خفيف",
      ],
      en: [
        "Deep skin moisturizing",
        "Soothing face masks",
        "Natural body oils",
        "Warm relaxing bath",
        "Gentle massage",
      ],
    },
    avoid: {
      ar: [
        "علاجات الليزر",
        "التقشير القوي",
        "الشمع والإزالة المؤلمة",
        "العلاجات الكيميائية",
      ],
      en: [
        "Laser treatments",
        "Strong exfoliation",
        "Painful waxing",
        "Chemical treatments",
      ],
    },
    wellness: {
      ar: "ركزي على الراحة والاسترخاء. مارسي تمارين التنفس والتأمل",
      en: "Focus on rest and relaxation. Practice breathing exercises and meditation",
    },
  },
  regeneration: {
    recommended: {
      ar: [
        "تقشير لطيف للبشرة",
        "سيروم فيتامين سي",
        "علاجات تجديد البشرة",
        "تمارين رياضية منتظمة",
        "عناية مكثفة بالشعر",
      ],
      en: [
        "Gentle exfoliation",
        "Vitamin C serum",
        "Skin renewal treatments",
        "Regular exercise",
        "Intensive hair care",
      ],
    },
    avoid: {
      ar: [
        "الإفراط في التقشير",
        "المنتجات القاسية على البشرة",
      ],
      en: [
        "Over-exfoliation",
        "Harsh products on skin",
      ],
    },
    wellness: {
      ar: "وقت مثالي لبدء روتين جديد. طاقتك في ازدياد",
      en: "Perfect time to start a new routine. Your energy is rising",
    },
  },
  peak_beauty: {
    recommended: {
      ar: [
        "علاجات الوجه المتقدمة",
        "جلسات السبا الفاخرة",
        "تصوير احترافي",
        "مناسبات خاصة",
        "علاجات مكافحة الشيخوخة",
        "قص الشعر للتكثيف",
      ],
      en: [
        "Advanced facial treatments",
        "Luxury spa sessions",
        "Professional photoshoots",
        "Special occasions",
        "Anti-aging treatments",
        "Hair trimming for thickness",
      ],
    },
    avoid: {
      ar: [
        "إهمال العناية بالبشرة",
        "السهر المفرط",
      ],
      en: [
        "Neglecting skincare",
        "Excessive late nights",
      ],
    },
    wellness: {
      ar: "أنتِ في أفضل حالاتك! استمتعي بجمالك الطبيعي",
      en: "You're at your best! Enjoy your natural beauty",
    },
  },
  balance: {
    recommended: {
      ar: [
        "تنظيف عميق للبشرة",
        "أقنعة الطين والفحم",
        "علاجات حب الشباب",
        "التحكم في الدهون",
        "روتين موازنة البشرة",
      ],
      en: [
        "Deep skin cleansing",
        "Clay and charcoal masks",
        "Acne treatments",
        "Oil control",
        "Skin balancing routine",
      ],
    },
    avoid: {
      ar: [
        "الأطعمة الدهنية",
        "المنتجات الزيتية الثقيلة",
        "لمس الوجه كثيراً",
      ],
      en: [
        "Greasy foods",
        "Heavy oily products",
        "Touching face frequently",
      ],
    },
    wellness: {
      ar: "اشربي الكثير من الماء وحافظي على نظافة بشرتك",
      en: "Drink plenty of water and keep your skin clean",
    },
  },
};

function getHairNote(
  lunarDay: number,
  hairGoal: HairGoal,
  language: "ar" | "en"
): string {
  const isLengthOptimal = lunarDay >= 1 && lunarDay <= 14;
  const isThicknessOptimal = lunarDay >= 15 && lunarDay <= 30;

  if (hairGoal === "length") {
    if (isLengthOptimal) {
      return language === "ar"
        ? "اليوم مثالي لقص الشعر لتعزيز الطول! (يوم قمري 1-14)"
        : "Today is ideal for hair trimming to promote length! (Lunar day 1-14)";
    }
    return language === "ar"
      ? "انتظري حتى النصف الأول من الشهر القمري لقص الشعر (يوم 1-14)"
      : "Wait until the first half of the lunar month for hair trimming (day 1-14)";
  } else {
    if (isThicknessOptimal) {
      return language === "ar"
        ? "اليوم مثالي لقص الشعر لتعزيز الكثافة! (يوم قمري 15-30)"
        : "Today is ideal for hair trimming to promote thickness! (Lunar day 15-30)";
    }
    return language === "ar"
      ? "انتظري حتى النصف الثاني من الشهر القمري لقص الشعر (يوم 15-30)"
      : "Wait until the second half of the lunar month for hair trimming (day 15-30)";
  }
}

function getHijamaNote(
  lunarDay: number,
  cycleDay: number,
  hijamaPreference: HijamaPreference,
  language: "ar" | "en"
): string {
  if (hijamaPreference === "no") {
    return language === "ar"
      ? "الحجامة غير مفعّلة في إعداداتك"
      : "Hijama is disabled in your settings";
  }

  const isOptimalLunarDay = [17, 19, 21].includes(lunarDay);
  const isDuringPeriod = cycleDay >= 1 && cycleDay <= 5;

  if (isDuringPeriod) {
    return language === "ar"
      ? "تجنبي الحجامة أثناء فترة الدورة الشهرية"
      : "Avoid hijama during your menstrual period";
  }

  if (isOptimalLunarDay) {
    return language === "ar"
      ? `اليوم القمري ${lunarDay} مثالي للحجامة! (أيام السنة: 17، 19، 21)`
      : `Lunar day ${lunarDay} is ideal for hijama! (Sunnah days: 17, 19, 21)`;
  }

  return language === "ar"
    ? `الأيام المثالية للحجامة: 17، 19، 21 من الشهر القمري`
    : `Ideal days for hijama: 17, 19, 21 of the lunar month`;
}

function getPersonaNote(persona: Persona, language: "ar" | "en"): string {
  const notes = {
    single: {
      ar: "ركزي على التوهج والعناية الذاتية - أنتِ تستحقين التألق",
      en: "Focus on glow and self-care - you deserve to shine",
    },
    partner: {
      ar: "خطة مبسطة تناسب جدولك المزدحم",
      en: "Simplified plan that fits your busy schedule",
    },
    married: {
      ar: "عناية عميقة بالبشرة مع لمسة رومانسية ناعمة",
      en: "Deep skincare with a soft romantic touch",
    },
    mother: {
      ar: "روتين سريع وفعال يناسب حياة الأمهات المشغولات",
      en: "Quick and effective routine for busy moms",
    },
  };
  return notes[persona][language];
}

function filterRecommendations(
  recommendations: string[],
  preferences: BeautyPreference[],
  language: "ar" | "en"
): string[] {
  let filtered = [...recommendations];

  if (preferences.includes("avoid_laser")) {
    const laserTerms = language === "ar" 
      ? ["ليزر", "Laser"] 
      : ["laser", "Laser"];
    filtered = filtered.filter(
      (r) => !laserTerms.some((term) => r.toLowerCase().includes(term.toLowerCase()))
    );
  }

  if (preferences.includes("natural")) {
    const chemicalTerms = language === "ar"
      ? ["كيميائي", "Chemical"]
      : ["chemical", "Chemical"];
    filtered = filtered.filter(
      (r) => !chemicalTerms.some((term) => r.toLowerCase().includes(term.toLowerCase()))
    );
  }

  if (preferences.includes("spa")) {
    const spaRecommendation = language === "ar"
      ? "جلسة سبا مريحة"
      : "Relaxing spa session";
    if (!filtered.includes(spaRecommendation)) {
      filtered.unshift(spaRecommendation);
    }
  }

  if (preferences.includes("massage")) {
    const massageRecommendation = language === "ar"
      ? "تدليك استرخائي"
      : "Relaxation massage";
    if (!filtered.some((r) => r.toLowerCase().includes(language === "ar" ? "تدليك" : "massage"))) {
      filtered.push(massageRecommendation);
    }
  }

  if (preferences.includes("yoga")) {
    const yogaRecommendation = language === "ar"
      ? "جلسة يوغا للاسترخاء"
      : "Relaxing yoga session";
    if (!filtered.includes(yogaRecommendation)) {
      filtered.push(yogaRecommendation);
    }
  }

  return filtered;
}

function getSampleAction(phase: HormonalPhase, language: "ar" | "en"): string {
  const samples = {
    comfort: {
      ar: "رطبي بشرتك بعمق اليوم",
      en: "Deep moisturize your skin today",
    },
    regeneration: {
      ar: "جربي سيروم فيتامين سي",
      en: "Try vitamin C serum",
    },
    peak_beauty: {
      ar: "يوم مثالي لعلاج الوجه",
      en: "Perfect day for facial treatment",
    },
    balance: {
      ar: "استخدمي قناع التنظيف العميق",
      en: "Use a deep cleansing mask",
    },
  };
  return samples[phase][language];
}

function getUpsellMessage(language: "ar" | "en"): string {
  return language === "ar"
    ? "الخطة اليومية الكاملة متاحة فقط لمشتركات وردتي بلس"
    : "Full daily plan is available only for Wardaty Plus subscribers";
}

export function generateBeautyPlan(input: BeautyPlannerInput): BeautyPlannerResult {
  const {
    cycleDay,
    lunarDay,
    persona,
    preferences,
    hairGoal,
    hijamaPreference,
    isPremiumUser,
    language,
  } = input;

  const phaseKey = getHormonalPhase(cycleDay);
  const phase = getPhaseLabel(phaseKey, language);
  const data = phaseData[phaseKey];

  if (!isPremiumUser) {
    const result: BeautyPlannerResultFree = {
      type: "free",
      phase,
      phaseKey,
      sample: getSampleAction(phaseKey, language),
      upsell: getUpsellMessage(language),
    };
    return result;
  }

  let recommended = filterRecommendations(
    data.recommended[language],
    preferences,
    language
  );

  if (preferences.includes("quick_routines") && persona === "mother") {
    recommended = recommended.slice(0, 3);
  }

  const result: BeautyPlannerResultPremium = {
    type: "premium",
    phase,
    phaseKey,
    recommended,
    avoid: data.avoid[language],
    hairNote: getHairNote(lunarDay, hairGoal, language),
    hijamaNote: getHijamaNote(lunarDay, cycleDay, hijamaPreference, language),
    personaNote: getPersonaNote(persona, language),
    wellness: data.wellness[language],
  };

  return result;
}

export function getLunarDay(date: Date = new Date()): number {
  const islamicEpoch = new Date(622, 6, 19);
  const daysSinceEpoch = Math.floor(
    (date.getTime() - islamicEpoch.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const synodicMonth = 29.53059;
  const lunarCycles = daysSinceEpoch / synodicMonth;
  const currentCyclePosition = lunarCycles - Math.floor(lunarCycles);
  const lunarDay = Math.floor(currentCyclePosition * 30) + 1;
  
  return Math.max(1, Math.min(30, lunarDay));
}

export function getHijriDate(date: Date = new Date()): { day: number; month: number; year: number; monthName: { ar: string; en: string } } {
  const islamicMonths = {
    ar: [
      "محرم", "صفر", "ربيع الأول", "ربيع الثاني",
      "جمادى الأولى", "جمادى الآخرة", "رجب", "شعبان",
      "رمضان", "شوال", "ذو القعدة", "ذو الحجة"
    ],
    en: [
      "Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani",
      "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
      "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
    ]
  };

  const gregorianYear = date.getFullYear();
  const gregorianMonth = date.getMonth();
  const gregorianDay = date.getDate();

  const jd = Math.floor(
    (1461 * (gregorianYear + 4800 + Math.floor((gregorianMonth - 13) / 12))) / 4 +
    Math.floor((367 * (gregorianMonth - 1 - 12 * Math.floor((gregorianMonth - 13) / 12))) / 12) -
    Math.floor((3 * Math.floor((gregorianYear + 4900 + Math.floor((gregorianMonth - 13) / 12)) / 100)) / 4) +
    gregorianDay - 32075
  );

  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
            Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
             Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  
  const hijriMonth = Math.floor((24 * l3) / 709);
  const hijriDay = l3 - Math.floor((709 * hijriMonth) / 24);
  const hijriYear = 30 * n + j - 30;

  const monthIndex = Math.max(0, Math.min(11, hijriMonth - 1));

  return {
    day: hijriDay,
    month: hijriMonth,
    year: hijriYear,
    monthName: {
      ar: islamicMonths.ar[monthIndex],
      en: islamicMonths.en[monthIndex],
    },
  };
}
