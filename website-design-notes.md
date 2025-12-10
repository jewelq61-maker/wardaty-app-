# Wardaty Website Design System - Key Findings

## 1. Color Palette

### Background Colors
- **Light sections**: #F8F9FA (very light gray/white)
- **Dark sections**: #2C3E50 or similar dark navy (for "المعرفة" card)
- **Card backgrounds**: White (#FFFFFF) with subtle shadows

### Persona Colors (Confirmed from website)
- **العزباء (Single)**: #FF5FA8 (bright pink)
- **المتزوجة (Married)**: #FF7C7C (coral/salmon)
- **الأم (Mother)**: #9A63E8 (purple)
- **الشريك (Partner)**: #7EC8E3 (light blue)

### Brand Colors
- **Primary Violet**: #8C64F0 (in logo and accents)
- **Accent Coral**: #FF6B9D (in CTA buttons)

## 2. Typography

### Headings
- **Hero Title**: ~60-80px, weight: 800, color: #2C3E50
- **Section Titles**: ~40-48px, weight: 700, color: #2C3E50
- **Card Titles**: ~24-28px, weight: 700, color: #2C3E50

### Body Text
- **Size**: 16-18px
- **Weight**: 400-500
- **Color**: #6B7280 (gray)
- **Line-height**: 1.6-1.8

### Font Family
- Arabic: Likely "Tajawal", "Cairo", or "IBM Plex Sans Arabic"
- English: System fonts or "Inter", "Poppins"

## 3. Card Design

### Light Cards (Features)
```
Background: #FFFFFF
Border-radius: 20-24px
Padding: 32px
Box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06)
Border: none or 1px solid rgba(0, 0, 0, 0.04)
```

### Dark Cards (المعرفة)
```
Background: #2C3E50 or #1A1330
Border-radius: 24px
Padding: 40px
Text color: #FFFFFF
Box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12)
```

### Icon Circles
```
Size: 56-64px
Background: White or light tint of persona color
Border-radius: 50%
Icon size: 28-32px
Icon color: Persona color or violet
```

## 4. Buttons

### Primary CTA Button
```
Background: linear-gradient(135deg, #8C64F0 0%, #FF6B9D 100%)
Color: #FFFFFF
Border-radius: 28-32px (pill-shaped)
Padding: 16px 40px
Font-size: 16-18px
Font-weight: 600
Box-shadow: 0 8px 24px rgba(140, 100, 240, 0.3)
Transition: all 0.3s ease
```

### Secondary Button
```
Background: transparent or white
Border: 2px solid currentColor
Color: Persona color or violet
Border-radius: 28-32px
Padding: 14px 36px
Font-size: 16px
Font-weight: 600
```

## 5. Spacing System

### Scale
- 4px (xs)
- 8px (sm)
- 12px (md)
- 16px (base)
- 24px (lg)
- 32px (xl)
- 48px (2xl)
- 64px (3xl)
- 80px (4xl)

### Section Spacing
- **Between sections**: 80-120px
- **Section padding**: 64-80px vertical, 24-48px horizontal

### Card Grid
- **Gap**: 24-32px
- **Columns**: 1 (mobile), 2 (tablet), 4 (desktop for personas)

## 6. Layout Patterns

### Hero Section
- Full-width
- Centered content
- Large title + subtitle
- 2 CTAs (primary + secondary)
- Generous vertical padding (100-120px)

### Persona Cards Grid
- 4 columns on desktop
- 2 columns on tablet
- 1 column on mobile
- Equal height cards
- Flower icon at top
- Title + description
- Hover effect: slight scale + shadow increase

### Features Section
- Alternating layout (text left/right, image right/left)
- Large feature card with icon
- Title + description
- Generous spacing between features

## 7. Effects & Interactions

### Hover States
```css
/* Cards */
transform: translateY(-4px);
box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
transition: all 0.3s ease;

/* Buttons */
transform: scale(1.02);
box-shadow: 0 12px 32px rgba(140, 100, 240, 0.4);
```

### Active States
- Persona color applied
- Slightly darker shade on press
- Haptic feedback (in app)

## 8. Icons

### Style
- Outline style (not filled)
- Stroke-width: 2px
- Size: 24px (standard), 32px (large), 20px (small)
- Color: Persona color or violet

### Persona Flowers
- 5-petal flower shape
- Solid fill with persona color
- Size: 80-96px
- Slight drop shadow

## 9. Navigation

### Top Nav (Website)
```
Background: rgba(255, 255, 255, 0.95)
Backdrop-filter: blur(10px)
Height: 72px
Border-bottom: 1px solid rgba(0, 0, 0, 0.06)
Position: sticky
Z-index: 100
```

### Bottom Nav (App - to implement)
```
Background: rgba(26, 19, 48, 0.95)
Backdrop-filter: blur(20px)
Height: 72px
Border-top: 1px solid rgba(255, 255, 255, 0.1)
Position: absolute bottom
Safe area insets: applied
```

## 10. Implementation Priorities

### Phase 1: Core Design System
1. Update colors.ts with exact colors from website
2. Create spacing constants
3. Create typography scale
4. Create shadow/elevation system

### Phase 2: Components
1. Update Button component (primary, secondary, with gradients)
2. Create Card component (light, dark, glass variants)
3. Update ThemedText with proper sizes
4. Create IconCircle component

### Phase 3: Screens
1. Onboarding (light theme, gradient buttons)
2. Persona selection (4-card grid with flowers)
3. Home screen (dark theme with glass cards)
4. Bottom navigation (dark with persona colors)

### Phase 4: Polish
1. Add transitions and animations
2. Implement hover/press states
3. Test RTL/LTR
4. Add haptic feedback

## Key Differences from Current App

### Current App Issues
- Using too much gradient everywhere
- Dark mode when website is light
- Inconsistent spacing
- Wrong persona colors
- No glass effects
- Typography too small
- Cards too cramped

### Target Design
- Light theme for onboarding/marketing screens
- Dark theme for app screens (like Apple Health at night)
- Glass cards with blur effects
- Correct persona colors (#FF5FA8, #FF7C7C, #9A63E8, #7EC8E3)
- Generous spacing (32px+)
- Large, clear typography
- Subtle shadows and glows
- Professional, premium feel
