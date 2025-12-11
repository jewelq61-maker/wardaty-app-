# Onboarding API Endpoint Documentation

**Date:** December 11, 2024  
**Version:** 2.0  
**Purpose:** Document API endpoint and payload for saving user data after onboarding

---

## 📋 Overview

After the user completes the onboarding flow, the app needs to save the collected data including the new `age` and `wellnessGoals` fields to persistent storage.

**Current Implementation:** Local storage only (AsyncStorage)  
**Recommended:** Add backend API sync for multi-device support

---

## 🔧 Current Implementation

### **Local Storage (AsyncStorage)**

#### **Function:**
```typescript
// lib/AppContext.tsx (line 212-216)
async function updateSettings(updates: Partial<UserSettings>) {
  const newSettings = { ...data.settings, ...updates };
  setData((prev) => ({ ...prev, settings: newSettings }));
  await saveSettings(newSettings);
}

// lib/storage.ts (line 46-52)
export async function saveSettings(settings: UserSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving settings:", error);
  }
}
```

#### **Storage Key:**
```typescript
const STORAGE_KEYS = {
  SETTINGS: "@wardaty_settings",
  // ... other keys
};
```

#### **How Onboarding Uses It:**
```typescript
// screens/OnboardingScreen.tsx (line 147-162)
const handleNext = async () => {
  if (step === "personalData") {
    const ageNum = parseInt(age);
    const cycleLengthNum = parseInt(cycleLength);
    const periodLengthNum = parseInt(periodLength);
    const waterGoalNum = parseInt(waterGoal) || 8;
    const sleepGoalNum = parseInt(sleepGoal) || 8;

    await updateSettings({
      persona: role === "partner" ? "partner" : persona,
      name,
      age: ageNum, // ✨ NEW
      cycleSettings: {
        ...settings.cycleSettings,
        cycleLength: cycleLengthNum,
        periodLength: periodLengthNum,
        lastPeriodStart: lastPeriodDate || new Date().toISOString().split("T")[0],
      },
      wellnessGoals: { // ✨ NEW
        waterCups: waterGoalNum,
        sleepHours: sleepGoalNum,
      },
      onboardingCompleted: true,
    });

    await clearProgress();
    navigation.navigate("Main");
  }
};
```

---

## 🌐 Recommended Backend API

### **Endpoint:**
```
POST /api/user/settings
```

### **Purpose:**
- Save user settings to backend database
- Enable multi-device sync
- Backup user data
- Analytics and insights

### **Authentication:**
```
Authorization: Bearer <user_token>
```

### **Headers:**
```http
Content-Type: application/json
Accept: application/json
```

---

## 📦 Request Payload

### **Complete UserSettings Structure:**

```typescript
interface UserSettings {
  persona: "single" | "married" | "mother" | "partner";
  name: string;
  nameAr: string;
  nameEn: string;
  age?: number; // ✨ NEW
  language: "ar" | "en";
  theme: "light" | "dark" | "system";
  calendarType: "gregorian" | "hijri" | "both";
  cycleSettings: {
    cycleLength: number;
    periodLength: number;
    lastPeriodStart: string | null;
  };
  wellnessGoals?: { // ✨ NEW
    waterCups: number;
    sleepHours: number;
  };
  notificationsEnabled: boolean;
  isSubscribed: boolean;
  onboardingComplete: boolean;
  fontScale: "small" | "medium" | "large";
}
```

### **Example Payload (Female User):**

```json
{
  "persona": "single",
  "name": "Aisha",
  "nameAr": "عائشة",
  "nameEn": "Aisha",
  "age": 25,
  "language": "ar",
  "theme": "system",
  "calendarType": "hijri",
  "cycleSettings": {
    "cycleLength": 28,
    "periodLength": 5,
    "lastPeriodStart": "2024-12-01"
  },
  "wellnessGoals": {
    "waterCups": 8,
    "sleepHours": 8
  },
  "notificationsEnabled": true,
  "isSubscribed": false,
  "onboardingComplete": true,
  "fontScale": "medium"
}
```

### **Example Payload (Partner/Male):**

```json
{
  "persona": "partner",
  "name": "Ahmed",
  "nameAr": "أحمد",
  "nameEn": "Ahmed",
  "age": 30,
  "language": "ar",
  "theme": "dark",
  "calendarType": "hijri",
  "cycleSettings": {
    "cycleLength": 28,
    "periodLength": 5,
    "lastPeriodStart": null
  },
  "wellnessGoals": {
    "waterCups": 10,
    "sleepHours": 7
  },
  "notificationsEnabled": true,
  "isSubscribed": false,
  "onboardingComplete": true,
  "fontScale": "medium"
}
```

**Note:** Partners don't track their own cycle, but the structure remains for consistency.

---

## 📤 Response Format

### **Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Settings saved successfully",
  "data": {
    "userId": "user_123456",
    "settings": {
      "persona": "single",
      "name": "Aisha",
      "age": 25,
      "language": "ar",
      "wellnessGoals": {
        "waterCups": 8,
        "sleepHours": 8
      },
      "onboardingComplete": true
    },
    "updatedAt": "2024-12-11T10:30:00Z"
  }
}
```

### **Error Response (400 Bad Request):**

```json
{
  "success": false,
  "error": "Validation error",
  "details": {
    "age": "Age must be between 13 and 100",
    "cycleSettings.cycleLength": "Cycle length must be between 21 and 35 days"
  }
}
```

### **Error Response (401 Unauthorized):**

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### **Error Response (500 Internal Server Error):**

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Failed to save settings"
}
```

---

## 🔒 Validation Rules

### **Backend Validation:**

```typescript
// Validation schema (example using Zod)
const UserSettingsSchema = z.object({
  persona: z.enum(["single", "married", "mother", "partner"]),
  name: z.string().min(1).max(100),
  nameAr: z.string().optional(),
  nameEn: z.string().optional(),
  age: z.number().int().min(13).max(100).optional(), // ✨ NEW
  language: z.enum(["ar", "en"]),
  theme: z.enum(["light", "dark", "system"]),
  calendarType: z.enum(["gregorian", "hijri", "both"]),
  cycleSettings: z.object({
    cycleLength: z.number().int().min(21).max(35),
    periodLength: z.number().int().min(3).max(7),
    lastPeriodStart: z.string().nullable(),
  }),
  wellnessGoals: z.object({ // ✨ NEW
    waterCups: z.number().int().min(1).max(20),
    sleepHours: z.number().int().min(4).max(12),
  }).optional(),
  notificationsEnabled: z.boolean(),
  isSubscribed: z.boolean(),
  onboardingComplete: z.boolean(),
  fontScale: z.enum(["small", "medium", "large"]),
});
```

### **Validation Rules:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `persona` | enum | ✅ Yes | "single" \| "married" \| "mother" \| "partner" |
| `name` | string | ✅ Yes | 1-100 characters |
| `age` | number | ❌ No | 13-100 (if provided) |
| `language` | enum | ✅ Yes | "ar" \| "en" |
| `cycleSettings.cycleLength` | number | ✅ Yes | 21-35 |
| `cycleSettings.periodLength` | number | ✅ Yes | 3-7 |
| `cycleSettings.lastPeriodStart` | string | ❌ No | ISO date format (YYYY-MM-DD) |
| `wellnessGoals.waterCups` | number | ❌ No | 1-20 (if provided) |
| `wellnessGoals.sleepHours` | number | ❌ No | 4-12 (if provided) |
| `onboardingComplete` | boolean | ✅ Yes | true after onboarding |

---

## 💻 Implementation Examples

### **1. Frontend API Call (React Native):**

```typescript
// lib/api.ts
export async function saveUserSettings(settings: Partial<UserSettings>): Promise<void> {
  try {
    const token = await getAuthToken(); // Get user auth token
    
    const response = await fetch(`${API_BASE_URL}/api/user/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save settings');
    }

    const data = await response.json();
    console.log('Settings saved:', data);
    return data;
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
}
```

### **2. Updated Onboarding Handler:**

```typescript
// screens/OnboardingScreen.tsx
const handleNext = async () => {
  if (step === "personalData") {
    const ageNum = parseInt(age);
    const cycleLengthNum = parseInt(cycleLength);
    const periodLengthNum = parseInt(periodLength);
    const waterGoalNum = parseInt(waterGoal) || 8;
    const sleepGoalNum = parseInt(sleepGoal) || 8;

    const settingsUpdate = {
      persona: role === "partner" ? "partner" : persona,
      name,
      age: ageNum, // ✨ NEW
      cycleSettings: {
        ...settings.cycleSettings,
        cycleLength: cycleLengthNum,
        periodLength: periodLengthNum,
        lastPeriodStart: lastPeriodDate || new Date().toISOString().split("T")[0],
      },
      wellnessGoals: { // ✨ NEW
        waterCups: waterGoalNum,
        sleepHours: sleepGoalNum,
      },
      onboardingCompleted: true,
    };

    // Save locally first (offline support)
    await updateSettings(settingsUpdate);

    // Then sync to backend (if online)
    try {
      await saveUserSettings(settingsUpdate);
      console.log('Settings synced to backend');
    } catch (error) {
      console.error('Failed to sync settings:', error);
      // Continue anyway - local data is saved
    }

    await clearProgress();
    navigation.navigate("Main");
  }
};
```

### **3. Backend API Handler (Node.js/Express):**

```typescript
// routes/user.ts
import { Router } from 'express';
import { z } from 'zod';
import { authenticateUser } from '../middleware/auth';
import { UserSettingsSchema } from '../schemas/user';
import { saveUserSettings } from '../services/user';

const router = Router();

router.post('/api/user/settings', authenticateUser, async (req, res) => {
  try {
    // Validate request body
    const settings = UserSettingsSchema.parse(req.body);
    
    // Get user ID from auth token
    const userId = req.user.id;
    
    // Save to database
    const savedSettings = await saveUserSettings(userId, settings);
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'Settings saved successfully',
      data: {
        userId,
        settings: savedSettings,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Validation error
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors.reduce((acc, err) => {
          acc[err.path.join('.')] = err.message;
          return acc;
        }, {}),
      });
    } else {
      // Server error
      console.error('Error saving settings:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to save settings',
      });
    }
  }
});

export default router;
```

### **4. Database Schema (Prisma):**

```prisma
// prisma/schema.prisma
model User {
  id                    String    @id @default(cuid())
  email                 String    @unique
  name                  String
  nameAr                String?
  nameEn                String?
  age                   Int?      // ✨ NEW
  persona               Persona   @default(SINGLE)
  language              Language  @default(AR)
  theme                 Theme     @default(SYSTEM)
  calendarType          CalendarType @default(HIJRI)
  cycleLength           Int       @default(28)
  periodLength          Int       @default(5)
  lastPeriodStart       DateTime?
  waterGoalCups         Int?      @default(8) // ✨ NEW
  sleepGoalHours        Int?      @default(8) // ✨ NEW
  notificationsEnabled  Boolean   @default(true)
  isSubscribed          Boolean   @default(false)
  onboardingComplete    Boolean   @default(false)
  fontScale             FontScale @default(MEDIUM)
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}

enum Persona {
  SINGLE
  MARRIED
  MOTHER
  PARTNER
}

enum Language {
  AR
  EN
}

enum Theme {
  LIGHT
  DARK
  SYSTEM
}

enum CalendarType {
  GREGORIAN
  HIJRI
  BOTH
}

enum FontScale {
  SMALL
  MEDIUM
  LARGE
}
```

---

## 🔄 Sync Strategy

### **Offline-First Approach:**

```typescript
// lib/sync.ts
export async function syncSettings(settings: UserSettings): Promise<void> {
  // 1. Save locally first (always succeeds)
  await saveSettings(settings);
  
  // 2. Try to sync to backend (may fail if offline)
  if (await isOnline()) {
    try {
      await saveUserSettings(settings);
      await markAsSynced(settings);
    } catch (error) {
      console.error('Sync failed, will retry later:', error);
      await markAsUnsynced(settings);
    }
  } else {
    await markAsUnsynced(settings);
  }
}

// Background sync when connection restored
export function setupBackgroundSync() {
  NetInfo.addEventListener(state => {
    if (state.isConnected) {
      syncUnsyncedData();
    }
  });
}
```

---

## 📊 Example API Calls

### **cURL Example:**

```bash
curl -X POST https://api.wardaty.app/api/user/settings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "persona": "single",
    "name": "Aisha",
    "age": 25,
    "language": "ar",
    "cycleSettings": {
      "cycleLength": 28,
      "periodLength": 5,
      "lastPeriodStart": "2024-12-01"
    },
    "wellnessGoals": {
      "waterCups": 8,
      "sleepHours": 8
    },
    "onboardingComplete": true
  }'
```

### **JavaScript/Fetch Example:**

```javascript
const response = await fetch('https://api.wardaty.app/api/user/settings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + userToken,
  },
  body: JSON.stringify({
    persona: 'single',
    name: 'Aisha',
    age: 25,
    language: 'ar',
    cycleSettings: {
      cycleLength: 28,
      periodLength: 5,
      lastPeriodStart: '2024-12-01',
    },
    wellnessGoals: {
      waterCups: 8,
      sleepHours: 8,
    },
    onboardingComplete: true,
  }),
});

const data = await response.json();
console.log(data);
```

### **Axios Example:**

```typescript
import axios from 'axios';

const response = await axios.post(
  'https://api.wardaty.app/api/user/settings',
  {
    persona: 'single',
    name: 'Aisha',
    age: 25,
    language: 'ar',
    cycleSettings: {
      cycleLength: 28,
      periodLength: 5,
      lastPeriodStart: '2024-12-01',
    },
    wellnessGoals: {
      waterCups: 8,
      sleepHours: 8,
    },
    onboardingComplete: true,
  },
  {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`,
    },
  }
);

console.log(response.data);
```

---

## 🧪 Testing

### **Unit Tests (Jest):**

```typescript
// __tests__/api/saveSettings.test.ts
import { saveUserSettings } from '../lib/api';

describe('saveUserSettings', () => {
  it('should save settings with age and wellness goals', async () => {
    const settings = {
      name: 'Aisha',
      age: 25,
      wellnessGoals: {
        waterCups: 8,
        sleepHours: 8,
      },
    };

    const response = await saveUserSettings(settings);
    expect(response.success).toBe(true);
    expect(response.data.settings.age).toBe(25);
    expect(response.data.settings.wellnessGoals.waterCups).toBe(8);
  });

  it('should validate age range', async () => {
    const settings = {
      name: 'Test',
      age: 150, // Invalid
    };

    await expect(saveUserSettings(settings)).rejects.toThrow('Age must be between 13 and 100');
  });
});
```

### **Integration Tests:**

```typescript
// __tests__/integration/onboarding.test.ts
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import OnboardingScreen from '../screens/OnboardingScreen';

describe('Onboarding Integration', () => {
  it('should save age and wellness goals after completion', async () => {
    const { getByPlaceholderText, getByText } = render(<OnboardingScreen />);

    // ... navigate through steps ...

    // Fill age
    fireEvent.changeText(getByPlaceholderText('25'), '25');

    // Fill wellness goals
    fireEvent.changeText(getByPlaceholderText('8'), '8'); // water
    fireEvent.changeText(getByPlaceholderText('8'), '8'); // sleep

    // Submit
    fireEvent.press(getByText('Finish'));

    await waitFor(() => {
      expect(mockSaveSettings).toHaveBeenCalledWith(
        expect.objectContaining({
          age: 25,
          wellnessGoals: {
            waterCups: 8,
            sleepHours: 8,
          },
        })
      );
    });
  });
});
```

---

## 📝 Summary

### **Current Implementation:**
- ✅ Local storage only (AsyncStorage)
- ✅ `age` and `wellnessGoals` saved locally
- ✅ Works offline
- ❌ No multi-device sync
- ❌ No backend backup

### **Recommended Implementation:**
- ✅ Offline-first approach
- ✅ Backend API for sync
- ✅ Multi-device support
- ✅ Data backup
- ✅ Analytics capabilities

### **New Fields in UserSettings:**
1. **`age?: number`** - User's age (13-100)
2. **`wellnessGoals?: { waterCups: number; sleepHours: number }`** - Daily wellness targets

### **API Endpoint:**
```
POST /api/user/settings
Authorization: Bearer <token>
Content-Type: application/json
```

### **Payload Example:**
```json
{
  "age": 25,
  "wellnessGoals": {
    "waterCups": 8,
    "sleepHours": 8
  },
  "onboardingComplete": true
}
```

---

**Status:** ✅ Documentation Complete  
**Next Steps:** Implement backend API and sync logic
