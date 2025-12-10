# Wardaty Website Design Analysis

## Color System (من الموقع)

### Background Colors
- **Main Background**: Very light gray/white (#F8F9FA or similar)
- **Dark sections**: Deep purple/navy (#0F0820, #1A1330)

### Brand Colors
- **Primary Violet**: #8C64F0 (visible in logo and accents)
- **Accent Coral/Pink**: #FF6B9D (visible in buttons)

### Persona Colors (من المتطلبات)
- **Single**: #FF5FA8
- **Married**: #FF7C7C
- **Mother**: #9A63E8
- **Partner**: #7EC8E3

## Typography

### Hero Section
- **Main Title**: Very large, bold, dark navy (#2C3E50 or similar)
- **Font**: Arabic font (likely Tajawal or similar)
- **Size**: ~60-80px for hero
- **Weight**: 700-800 (bold/extra-bold)

### Body Text
- **Size**: 16-18px
- **Weight**: 400-500
- **Color**: Dark gray (#4A5568)

### Buttons
- **Primary Button**: 
  - Background: Gradient (violet to coral) or solid persona color
  - Text: White
  - Border-radius: 24-32px (very rounded)
  - Padding: 16px 32px
  - Font-size: 16-18px
  - Font-weight: 600
  - Box-shadow: 0 8px 24px rgba(140, 100, 240, 0.3)

- **Secondary Button**:
  - Background: Transparent or white
  - Border: 2px solid
  - Text: Persona color
  - Border-radius: 24-32px

## Layout & Spacing

### Spacing Scale
- **XS**: 4px
- **SM**: 8px
- **MD**: 16px
- **LG**: 24px
- **XL**: 32px
- **2XL**: 48px
- **3XL**: 64px

### Section Padding
- **Top/Bottom**: 64-80px
- **Left/Right**: 24-32px (mobile), 48-64px (tablet+)

### Card Spacing
- **Gap between cards**: 16-24px
- **Card padding**: 24-32px

## Glassmorphism Effect

```css
background: rgba(37, 27, 64, 0.6);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
```

## Glow Effects

```css
box-shadow: 
  0 0 20px rgba(140, 100, 240, 0.3),
  0 0 40px rgba(140, 100, 240, 0.2),
  0 0 60px rgba(140, 100, 240, 0.1);
```

## Gradients

### Primary Gradient (Violet → Coral)
```css
background: linear-gradient(135deg, #8C64F0 0%, #FF6B9D 100%);
```

### Soft Gradient (Violet → Peach)
```css
background: linear-gradient(135deg, #9A63E8 0%, #FFB8D1 100%);
```

## Border Radius
- **Cards**: 16-24px
- **Buttons**: 24-32px (pill-shaped)
- **Small elements**: 8-12px

## Shadows

### Card Shadow
```css
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
```

### Elevated Shadow
```css
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
```

### Glow Shadow (for active elements)
```css
box-shadow: 0 4px 20px rgba(persona-color, 0.4);
```

## Navigation

### Top Navigation
- **Background**: White with subtle shadow
- **Height**: 64-72px
- **Logo**: Colored (violet + pink)
- **Links**: Dark gray, hover = persona color
- **CTA Button**: Gradient or persona color

### Bottom Navigation (App)
- **Background**: Dark (#1A1330) with blur
- **Height**: 64-72px
- **Active tab**: Persona color
- **Inactive tab**: Gray (#6B7280)
- **Icons**: 24px
- **Labels**: 12px, weight 500

## FAB Button
- **Size**: 56x56px
- **Background**: Persona color
- **Icon**: White, 24px
- **Shadow**: 0 4px 20px rgba(persona-color, 0.4)
- **Position**: Bottom right, 16px from edges

## Key Design Principles

1. **Clean & Minimal**: Lots of white space, no clutter
2. **Premium Feel**: Subtle shadows, smooth gradients, glow effects
3. **Feminine Touch**: Soft colors, rounded corners, gentle transitions
4. **Professional**: Consistent spacing, proper typography hierarchy
5. **Dark Mode Support**: Deep purples instead of pure black
6. **Persona Integration**: Colors appear in accents, not overwhelming

## Implementation Notes

- Use dark theme (#0F0820, #1A1330) for main app background
- Cards should have glass effect (#251B40 with blur)
- Persona colors ONLY for accents (FAB, active states, highlights)
- Typography should be large and clear
- Spacing should be generous (24-32px between sections)
- All transitions should be smooth (200-300ms)
- RTL support: flip layout, icons, and text alignment
