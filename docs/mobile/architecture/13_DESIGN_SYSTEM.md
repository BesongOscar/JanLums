# 13 — Design System

**Version:** 2.0.0
**Status:** Active
**Last Updated:** 2026-06-20
**Revisions Applied:** #13 (Design System Revision — JanLums Branding)

---

## 1. Brand Colors

### Primary Palette

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `primary-50` | `#E6F0FA` | 230, 240, 250 | Light background, hover |
| `primary-100` | `#B3D1F0` | 179, 209, 240 | Disabled background |
| `primary-200` | `#80B3E6` | 128, 179, 230 | — |
| `primary-300` | `#4D94DB` | 77, 148, 219 | — |
| `primary-400` | `#2680D1` | 38, 128, 209 | — |
| `primary-500` | `#0078D4` | 0, 120, 212 | **Primary brand color** |
| `primary-600` | `#006CBE` | 0, 108, 190 | Pressed state |
| `primary-700` | `#005FA8` | 0, 95, 168 | — |
| `primary-800` | `#005292` | 0, 82, 146 | — |
| `primary-900` | `#003D6E` | 0, 61, 110 | Dark mode primary |

### Secondary Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `secondary-500` | `#F59E0B` | Accent, highlights |
| `secondary-600` | `#D97706` | Pressed accent |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#059669` | Success states, completed |
| `success-light` | `#D1FAE5` | Success backgrounds |
| `warning` | `#D97706` | Warning states |
| `warning-light` | `#FEF3C7` | Warning backgrounds |
| `error` | `#DC2626` | Error states, destructive |
| `error-light` | `#FEE2E2` | Error backgrounds |
| `info` | `#0078D4` | Informational (uses primary) |
| `info-light` | `#E6F0FA` | Info backgrounds |

### Neutrals

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `gray-50` | `#F9FAFB` | 249, 250, 251 | Background |
| `gray-100` | `#F3F4F6` | 243, 244, 246 | Card backgrounds |
| `gray-200` | `#E5E7EB` | 229, 231, 235 | Borders, dividers |
| `gray-300` | `#D1D5DB` | 209, 213, 219 | Disabled borders |
| `gray-400` | `#9CA3AF` | 156, 163, 175 | Placeholder text |
| `gray-500` | `#6B7280` | 107, 114, 128 | Secondary text |
| `gray-600` | `#4B5563` | 75, 85, 99 | Body text |
| `gray-700` | `#374151` | 55, 65, 81 | Headings |
| `gray-800` | `#1F2937` | 31, 41, 55 | Primary text |
| `gray-900` | `#111827` | 17, 24, 39 | High-emphasis |

---

## 2. Order Status Colors

| Status | Hex | Background |
|--------|-----|-----------|
| `pending` | `#D97706` | `#FEF3C7` |
| `received` | `#2563EB` | `#DBEAFE` |
| `tagged` | `#4F46E5` | `#E0E7FF` |
| `in_wash` | `#0891B2` | `#CFFAFE` |
| `in_dry` | `#0D9488` | `#CCFBF1` |
| `in_press` | `#EA580C` | `#FED7AA` |
| `quality_check` | `#7C3AED` | `#EDE9FE` |
| `ready` | `#059669` | `#D1FAE5` |
| `out_for_delivery` | `#0284C7` | `#E0F2FE` |
| `completed` | `#047857` | `#D1FAE5` |
| `cancelled` | `#DC2626` | `#FEE2E2` |
| `rewash` | `#E11D48` | `#FFE4E6` |
| `damaged` | `#BE123C` | `#FECDD3` |
| `on_hold` | `#CA8A04` | `#FEF9C3` |

---

## 3. Typography

### Font Family

| Platform | Family |
|----------|--------|
| iOS | System (SF Pro) |
| Android | Roboto |
| Fallback | sans-serif |

### Type Scale

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| `display-lg` | 32px | 700 | 40px | -0.5px | Hero text |
| `display` | 28px | 700 | 34px | -0.3px | Screen titles |
| `heading-lg` | 22px | 600 | 28px | 0 | Section headers |
| `heading` | 18px | 600 | 24px | 0 | Card titles |
| `heading-sm` | 16px | 600 | 22px | 0 | Subsection headers |
| `body-lg` | 16px | 400 | 24px | 0.1px | Body text (large) |
| `body` | 14px | 400 | 20px | 0.1px | Body text |
| `body-sm` | 12px | 400 | 16px | 0.2px | Caption text |
| `label-lg` | 14px | 500 | 20px | 0.1px | Form labels |
| `label` | 12px | 500 | 16px | 0.3px | Badges, tags |
| `label-sm` | 10px | 500 | 14px | 0.5px | Fine print |
| `button-lg` | 16px | 600 | 24px | 0.3px | Large buttons |
| `button` | 14px | 600 | 20px | 0.3px | Buttons |
| `caption` | 12px | 400 | 16px | 0.2px | Helper text |
| `overline` | 10px | 600 | 14px | 1px | Overline labels |

---

## 4. Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `0` | 0px | — |
| `1` | 4px | Tight gaps, icon padding |
| `2` | 8px | Compact spacing |
| `3` | 12px | Default element spacing |
| `4` | 16px | Section padding |
| `5` | 20px | Screen horizontal padding |
| `6` | 24px | Large gaps |
| `8` | 32px | Section separation |
| `10` | 40px | Large section separation |
| `12` | 48px | Screen top/bottom padding |

---

## 5. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `none` | 0px | — |
| `sm` | 4px | Badges, chips |
| `md` | 8px | Cards, inputs |
| `lg` | 12px | Modals, bottom sheets |
| `xl` | 16px | Large cards |
| `2xl` | 20px | — |
| `full` | 9999px | Avatars, pills |

---

## 6. Elevation / Shadows

| Level | iOS Shadow | Android Shadow | Usage |
|-------|-----------|----------------|-------|
| `none` | none | 0 | — |
| `sm` | `0 1px 2px rgba(0,0,0,0.05)` | elevation: 1 | Subtle cards |
| `md` | `0 2px 4px rgba(0,0,0,0.1)` | elevation: 3 | Cards, buttons |
| `lg` | `0 4px 8px rgba(0,0,0,0.12)` | elevation: 6 | Modals |
| `xl` | `0 8px 16px rgba(0,0,0,0.15)` | elevation: 9 | Floating elements |

---

## 7. Component Tokens

### Button

| Variant | Background | Text | Border | Height | Radius |
|---------|-----------|------|--------|--------|--------|
| `primary` | `#0078D4` | `#FFFFFF` | none | 48px | `md` |
| `primary-pressed` | `#006CBE` | `#FFFFFF` | none | 48px | `md` |
| `secondary` | `#F3F4F6` | `#0078D4` | none | 48px | `md` |
| `outline` | `transparent` | `#0078D4` | `#0078D4` 1px | 48px | `md` |
| `ghost` | `transparent` | `#0078D4` | none | 48px | `md` |
| `danger` | `#DC2626` | `#FFFFFF` | none | 48px | `md` |
| `sm` | varies | varies | varies | 36px | `sm` |
| `lg` | varies | varies | varies | 56px | `md` |

### Input

| State | Border | Background | Label | Error |
|-------|--------|------------|-------|-------|
| Default | `#D1D5DB` | `#FFFFFF` | `#6B7280` | — |
| Focus | `#0078D4` | `#FFFFFF` | `#0078D4` | — |
| Error | `#DC2626` | `#FEF2F2` | `#DC2626` | `#DC2626` |
| Disabled | `#E5E7EB` | `#F9FAFB` | `#9CA3AF` | — |

### Card

| Variant | Background | Shadow | Border | Radius |
|---------|-----------|--------|--------|--------|
| `elevated` | `#FFFFFF` | `md` | none | `lg` |
| `outlined` | `#FFFFFF` | none | `#E5E7EB` 1px | `lg` |
| `filled` | `#F3F4F6` | none | none | `lg` |

### Badge

| Variant | Background | Text | Radius |
|---------|-----------|------|--------|
| `primary` | `#E6F0FA` | `#0078D4` | `full` |
| `success` | `#D1FAE5` | `#059669` | `full` |
| `warning` | `#FEF3C7` | `#D97706` | `full` |
| `danger` | `#FEE2E2` | `#DC2626` | `full` |

---

## 8. Iconography

| Library | Usage |
|---------|-------|
| `@expo/vector-icons` | All icons |
| `MaterialCommunityIcons` | Primary icon set |
| `Ionicons` | Tab bar icons |

### Tab Bar Icons

| Tab | Active | Inactive |
|-----|--------|----------|
| Home | `home` | `home-outline` |
| Order | `plus-circle` | `plus-circle-outline` |
| Track | `search` | `search-outline` |
| Account | `person` | `person-outline` |

### Common Icons

| Action | Icon |
|--------|------|
| Back | `arrow-left` |
| Close | `close` |
| Check | `check` |
| Edit | `pencil` |
| Delete | `trash-2` |
| Share | `share-variant` |
| Refresh | `refresh` |
| Filter | `tune` |
| Search | `magnify` |
| Sort | `sort` |
| Calendar | `calendar` |
| Clock | `clock-outline` |
| Location | `map-marker` |
| Phone | `phone` |
| Email | `email` |
| Camera | `camera` |
| QR Code | `qrcode-scan` |
| Notification | `bell` |
| Settings | `cog` |
| Logout | `logout` |
| Star | `star` |
| Heart | `heart` |

---

## 9. Animation Tokens

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `fast` | 150ms | ease-in-out | Button press, toggles |
| `normal` | 250ms | ease-in-out | Screen transitions |
| `slow` | 350ms | ease-in-out | Complex animations |
| `spring` | — | spring(60, 8) | Pull to refresh |

---

## 10. Responsive Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| `mobile` | < 375px | Compact |
| `default` | 375-428px | Standard |
| `large` | > 428px | Expanded |
