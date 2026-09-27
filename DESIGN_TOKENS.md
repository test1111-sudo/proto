# Agento Design Tokens

Developer handoff reference for the Agento prototype.

## Color palette

| Category | Token | Hex | Purpose / Common Use Case |
|---|---|---:|---|
| Brand | `primary` | `#6D4BCC` | Primary actions, active navigation and brand accents |
| Brand | `primary-hover` | `#5635B4` | Hover and pressed states for primary actions |
| Brand | `primary-soft` | `#EDE7FF` | Selected navigation, subtle badges and highlighted areas |
| Surfaces | `background` | `#F8F5FF` | Application background |
| Surfaces | `surface` | `#FFFFFF` | Cards, tables, panels and inputs |
| Text | `text-primary` | `#211B2D` | Headings and primary content |
| Text | `text-secondary` | `#746C80` | Supporting copy, metadata and placeholders |
| Border | `border` | `#E7E2EC` | Dividers, outlines and inactive controls |
| Success | `success` | `#18794E` | Active, available and successful states |
| Success | `success-background` | `#DDF5E8` | Success badge and message backgrounds |
| Warning | `warning` | `#925500` | Conflicts, discrepancies and attention states |
| Warning | `warning-background` | `#FFF0D1` | Warning badge and message backgrounds |
| Error | `error` | `#B42318` | Errors, unavailable sources and stale states |
| Error | `error-background` | `#FEE4E2` | Error badge and message backgrounds |

## Typography

| Category | Variant Name | Default HTML Tag | Font Specification | Purpose / Common Use Case |
|---|---|---|---|---|
| Headings | `h1` | `<h1>` | 30px / 38px · Semibold 600 | Main page title |
|  | `h2` | `<h2>` | 22px / 28px · Semibold 600 | Major section titles |
|  | `h3` | `<h3>` | 19px / 24px · Semibold 600 | Panel and subsection titles |
|  | `h4` | `<h4>` | 17px / 22px · Semibold 600 | Card titles |
|  | `h5` | `<h5>` | 14px / 20px · Semibold 600 | Small content headings |
|  | `h6` | `<h6>` | 13px / 18px · Semibold 600 | Compact headings and alerts |
| Subtitles | `subtitle1` | `<p>` | 17px / 26px · Regular 400 | Large supporting text below headings |
|  | `subtitle2` | `<p>` | 14px / 21px · Semibold 600 | Compact supporting text |
| Body Text | `body1` | `<p>` | 14px / 21px · Regular 400 | Default paragraphs and form content |
|  | `body2` | `<p>` | 13px / 20px · Regular 400 | Secondary copy and dense interface content |
| UI Elements | `button` | `<span>` | 14px / 20px · Bold 700 | Primary and secondary button labels |
|  | `label` | `<label>` | 12px / 18px · Semibold 600 | Form labels, filters and table headings |
|  | `caption` | `<span>` | 11px / 17px · Regular 400 | Metadata, timestamps and helper text |
|  | `overline` | `<span>` | 11px / 16px · Bold 700 | Eyebrows, statuses and category labels |
|  | `metric` | `<strong>` | 22px / 28px · Semibold 600 | Dashboard and summary values |

- Font family: `"Noto Sans Georgian", Arial, sans-serif`
- Heading letter spacing: `-0.02em`
- Default letter spacing: `0`

## CSS tokens

```css
:root {
  --color-primary: #6D4BCC;
  --color-primary-hover: #5635B4;
  --color-primary-soft: #EDE7FF;
  --color-background: #F8F5FF;
  --color-surface: #FFFFFF;
  --color-text-primary: #211B2D;
  --color-text-secondary: #746C80;
  --color-border: #E7E2EC;
  --color-success: #18794E;
  --color-success-background: #DDF5E8;
  --color-warning: #925500;
  --color-warning-background: #FFF0D1;
  --color-error: #B42318;
  --color-error-background: #FEE4E2;

  --font-family-primary: "Noto Sans Georgian", Arial, sans-serif;
  --font-size-xs: 11px;
  --font-size-sm: 12px;
  --font-size-md: 13px;
  --font-size-base: 14px;
  --font-size-lg: 17px;
  --font-size-xl: 19px;
  --font-size-2xl: 22px;
  --font-size-3xl: 30px;
  --font-size-4xl: 42px;
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --line-height-tight: 1.15;
  --line-height-heading: 1.25;
  --line-height-body: 1.5;
  --line-height-relaxed: 1.6;
  --letter-spacing-tight: -0.02em;
  --letter-spacing-normal: 0;
}
```

## TypeScript tokens

```ts
export const designTokens = {
  colors: {
    primary: "#6D4BCC",
    primaryHover: "#5635B4",
    primarySoft: "#EDE7FF",
    background: "#F8F5FF",
    surface: "#FFFFFF",
    textPrimary: "#211B2D",
    textSecondary: "#746C80",
    border: "#E7E2EC",
    success: "#18794E",
    successBackground: "#DDF5E8",
    warning: "#925500",
    warningBackground: "#FFF0D1",
    error: "#B42318",
    errorBackground: "#FEE4E2",
  },
  typography: {
    fontFamily: '"Noto Sans Georgian", Arial, sans-serif',
    fontSize: {
      xs: "11px",
      sm: "12px",
      md: "13px",
      base: "14px",
      lg: "17px",
      xl: "19px",
      "2xl": "22px",
      "3xl": "30px",
      "4xl": "42px",
    },
    fontWeight: { regular: 400, semibold: 600, bold: 700, extrabold: 800 },
    lineHeight: { tight: 1.15, heading: 1.25, body: 1.5, relaxed: 1.6 },
    letterSpacing: { tight: "-0.02em", normal: "0" },
  },
} as const;
```
