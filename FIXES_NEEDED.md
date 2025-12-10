# Wardaty App - Fixes Needed

## 🔴 Critical Issues

### 1. RTL/LTR Direction
- [ ] Fix RTL alignment in all screens
- [ ] Ensure text alignment follows language direction
- [ ] Fix icon positions in RTL mode
- [ ] Test all screens in both Arabic and English

### 2. Light/Dark Mode Switching
- [ ] Implement theme switching in settings
- [ ] Update ThemePersonaContext to support both modes
- [ ] Ensure all screens respect theme setting
- [ ] Add smooth transitions between themes

### 3. Pregnancy Mode
- [ ] Hide cycle tracking when pregnancy mode is enabled
- [ ] Show pregnancy tracker on HomeScreen
- [ ] Display week number, trimester, due date
- [ ] Add pregnancy-specific tips and insights

## 🟡 High Priority

### 4. Articles Section
- [x] Add real article content (5 articles added)
- [ ] Update ArticlesScreen to use local data
- [ ] Update ArticleDetailScreen to show full content
- [ ] Add "Related Articles" section at bottom
- [ ] Improve article card design
- [ ] Add category filtering

### 5. FAB Button Unification
- [ ] Create LogEntryModal component
- [ ] Show options: Period, Water, Mood, Sleep, Other
- [ ] Use same modal across all screens
- [ ] Consistent design and behavior

### 6. Onboarding Language Selection
- [ ] Make language selection truly first (no default)
- [ ] Show bilingual UI until language is chosen
- [ ] Start translations only after selection

## 🟢 Medium Priority

### 7. UI/UX Improvements
- [ ] Fix cut-off "تفعيل" button in pregnancy settings
- [ ] Improve button sizing and padding
- [ ] Add loading states for all async operations
- [ ] Improve error messages
- [ ] Add empty states for all lists

### 8. Calendar Improvements
- [ ] Add month/year navigation
- [ ] Improve day selection UX
- [ ] Show cycle phase colors
- [ ] Add legend for colors

### 9. Profile Screen
- [ ] Improve persona selector layout
- [ ] Add profile picture support
- [ ] Better settings organization
- [ ] Add data export feature

## 📝 Implementation Notes

### RTL Fixes
```typescript
// Use I18nManager properly
import { I18nManager } from 'react-native';

// In styles
const styles = StyleSheet.create({
  container: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    textAlign: isRTL ? 'right' : 'left',
  }
});
```

### Pregnancy Mode Logic
```typescript
// In HomeScreen
if (settings.pregnancyMode) {
  return <PregnancyTracker />;
} else {
  return <CycleTracker />;
}
```

### Articles Integration
```typescript
// Replace API calls with:
import { articles, getRelatedArticles } from '@/data/articles';

// In ArticleDetailScreen
const relatedArticles = getRelatedArticles(articleId, 3);
```

### FAB Modal
```typescript
const LogEntryModal = () => {
  const options = [
    { id: 'period', icon: 'droplet', titleAr: 'الدورة', titleEn: 'Period' },
    { id: 'water', icon: 'droplet', titleAr: 'الماء', titleEn: 'Water' },
    { id: 'mood', icon: 'smile', titleAr: 'المزاج', titleEn: 'Mood' },
    { id: 'sleep', icon: 'moon', titleAr: 'النوم', titleEn: 'Sleep' },
  ];
  // Show bottom sheet with options
};
```

## 🎨 Design Consistency

### Colors
- Use PersonaColors only for accents
- Dark theme: #0F0820 (background), #1A1330 (elevated), #251B40 (cards)
- Light theme: #FFFFFF (background), #F8F9FA (elevated), #FFFFFF (cards)

### Spacing
- Use Spacing scale: 4, 8, 12, 16, 20, 24, 32, 48, 64
- Consistent padding: 16px horizontal, 20px vertical
- Card margins: 16px

### Typography
- Titles: 24-28px bold
- Subtitles: 16-18px medium
- Body: 14-16px regular
- Captions: 12-14px regular

## 🧪 Testing Checklist

- [ ] Test in Arabic (RTL)
- [ ] Test in English (LTR)
- [ ] Test dark mode
- [ ] Test light mode
- [ ] Test pregnancy mode
- [ ] Test all navigation flows
- [ ] Test on iOS
- [ ] Test on Android
- [ ] Test offline mode

## 📦 Files to Update

### Immediate
1. `screens/HomeScreen.tsx` - Add pregnancy mode
2. `screens/ArticlesScreen.tsx` - Use local data
3. `screens/ArticleDetailScreen.tsx` - Add related articles
4. `lib/ThemePersonaContext.tsx` - Support theme switching
5. `components/LogEntryModal.tsx` - Create new component

### Secondary
6. All screens - Fix RTL alignment
7. `screens/OnboardingScreen.tsx` - Fix language selection
8. `screens/SettingsScreen.tsx` - Add theme toggle
9. `navigation/MainTabNavigator.tsx` - Unified FAB

## 🚀 Priority Order

1. **RTL Fixes** - Most visible issue
2. **Articles** - User-requested feature
3. **Pregnancy Mode** - Core functionality
4. **FAB Unification** - UX improvement
5. **Theme Switching** - User preference
6. **Onboarding** - First impression

---

**Note:** This document tracks all pending fixes. Update checkboxes as issues are resolved.
