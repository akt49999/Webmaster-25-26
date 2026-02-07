# Typography System - Coppell Community Hub

## Overview

The typography system has been completely redesigned with premium Google Fonts (Inter & Outfit), comprehensive font hierarchy, proper weight distribution, and consistent spacing to create a more sophisticated and professional appearance.

## Font Stack

### Primary Fonts

#### **Outfit** (Headings)
- **Purpose**: Display headings, titles, navigation
- **Weights**: 300 (Light), 400 (Regular), 600 (Semibold), 700 (Bold)
- **Characteristics**: Geometric, modern, premium feel
- **Use Cases**: All heading levels (h1-h6), page titles, CTAs

#### **Inter** (Body Text & UI)
- **Purpose**: Body text, paragraphs, UI elements
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Characteristics**: Clean, open, excellent readability
- **Use Cases**: Paragraphs, buttons, forms, navigation, labels

#### **Fira Code** (Code & Technical)
- **Purpose**: Code blocks, technical content, monospace
- **Use Cases**: Code snippets, terminal output, developer documentation

## Responsive Font Sizes

All font sizes are responsive using `clamp()` for fluid scaling:

| Class/Token | Mobile | Tablet | Desktop | Use Case |
|-------------|--------|--------|---------|----------|
| `text-xs` / h6 | 11px | 11px | 12px | Fine print, captions |
| `text-sm` | 13px | 13px | 14px | Small text, labels |
| `text-base` | 15px | 15px | 16px | Body text, standard |
| `text-lg` | 17px | 17px | 18px | Large body, intro |
| `text-xl` | 19px | 19px | 20px | Extra large body |
| `text-2xl` / h5 | 23px | 23px | 24px | Subheadings |
| `text-3xl` | 29px | 29px | 30px | Tertiary heading |
| `text-4xl` / h4 | 35px | 35px | 36px | Secondary heading |
| `text-5xl` / h3 | 42px | 42px | 48px | Primary heading |
| `text-6xl` / h2 h1 | 48px | 54px | 60px | Display heading |

## Font Hierarchy

### 6-Level Heading Hierarchy

```html
<!-- Display Heading (Extra Large - 60px) -->
<h1 class="heading-display">Main Page Title</h1>
<!-- OR -->
<h1>Main Page Title</h1> <!-- Always use semantic HTML -->

<!-- Primary Heading (Large - 48px) -->
<h2 class="heading-primary">Section Title</h2>

<!-- Secondary Heading (Medium - 36px) -->
<h3 class="heading-secondary">Subsection Title</h3>

<!-- Tertiary Heading (Small - 24px) -->
<h4 class="heading-tertiary">Another Level</h4>

<!-- Quaternary Heading (Extra Small - 20px) -->
<h5 class="heading-quaternary">Sub-item</h5>

<!-- Micro Heading (16px, uppercase) -->
<h6>Micro Label</h6>
```

### Heading Characteristics

| Level | Font | Size | Weight | Letter Spacing | Line Height | Color |
|-------|------|------|--------|-----------------|------------|-------|
| h1/Display | Outfit | 60px | Bold | 1px | 1.2 | Primary |
| h2/Primary | Outfit | 48px | Bold | 0.5px | 1.2 | Primary |
| h3/Secondary | Outfit | 36px | Bold | 0.5px | 1.375 | Primary |
| h4/Tertiary | Outfit | 24px | Semibold | 0px | 1.375 | Primary |
| h5/Quaternary | Outfit | 20px | Semibold | 0px | 1.5 | Primary |
| h6 | Outfit | 16px | Semibold | 0px | 1.5 | Primary |

## Line Heights

Consistent, professional line heights throughout:

```css
--line-height-tight: 1.2;       /* Headings (tight) */
--line-height-snug: 1.375;      /* Subheadings (snug) */
--line-height-normal: 1.5;      /* Body text (normal) */
--line-height-relaxed: 1.625;   /* Long-form content (relaxed) */
```

### Usage
```html
<!-- Automatic -->
<h1>Heading</h1>                  <!-- 1.2 line-height -->
<p>Body text</p>                  <!-- 1.625 line-height for paragraphs -->

<!-- Manual -->
<p class="leading-tight">...</p>
<div class="leading-relaxed">...</div>
```

## Letter Spacing

Strategic letter spacing for premium appearance:

```css
--letter-spacing-tight: -0.5px;   /* Negative for compact feel */
--letter-spacing-normal: 0px;     /* Default (no extra spacing) */
--letter-spacing-wide: 0.5px;     /* Subtle widening */
--letter-spacing-wider: 1px;      /* More prominent (headings) */
--letter-spacing-widest: 1.5px;   /* Luxury/premium (uppercase) */
```

### Heading Letter Spacing

- **h1 (Display)**: 1px (wider)
- **h2 (Primary)**: 0.5px (wide)
- **h3 (Secondary)**: 0.5px (wide)
- **h4-h6**: 0px (normal)
- **Uppercase**: 1px-1.5px (auto on uppercase text)

### Usage
```html
<!-- Automatic -->
<h1>Professional Heading</h1>      <!-- 1px letter-spacing -->
<h4>Regular Heading</h4>           <!-- 0px letter-spacing -->

<!-- Manual -->
<p class="tracking-wide">Wide spacing</p>
<p class="tracking-wider">More spacing</p>
<span class="tracking-widest uppercase">PREMIUM TEXT</span>
```

## Font Weights

Comprehensive weight system for visual hierarchy:

```css
--font-light: 300;        /* Subtle, delicate */
--font-normal: 400;       /* Default, body text */
--font-semibold: 600;     /* Medium emphasis */
--font-bold: 700;         /* Strong emphasis */
```

### Usage in Tailwind

```html
<p class="font-light">Light text</p>
<p class="font-normal">Regular text - default</p>
<p class="font-semibold">Semibold emphasis</p>
<p class="font-bold">Bold emphasis</p>

<strong>Bold text</strong>              <!-- font-weight: 700 -->
<em>Italic text</em>                   <!-- font-style: italic -->
```

### CSS Variables
```css
.my-element {
  font-weight: var(--font-bold);
}
```

## Text Styles & Semantic Classes

### Headings (Alternative to HTML Tags)
```html
<div class="heading-display">Display Heading</div>
<div class="heading-primary">Primary Heading</div>
<div class="heading-secondary">Secondary Heading</div>
<div class="heading-tertiary">Tertiary Heading</div>
<div class="heading-quaternary">Quaternary Heading</div>
```

### Body Text Variants
```html
<!-- Automatic sizes -->
<p class="text-xs">Extra small text</p>
<p class="text-sm">Small text</p>
<p>Normal text (default)</p>
<p class="text-lg">Large text</p>
<p class="text-xl">Extra large text</p>

<!-- Named paragraph classes -->
<p class="paragraph-sm">Small paragraph</p>
<p class="paragraph-lg">Large paragraph</p>
<p class="paragraph-xl">Extra large paragraph</p>
```

### Emphasis & Weight
```html
<strong>Bold text</strong>
<em>Italic text</em>

<span class="font-light">Light weight</span>
<span class="font-semibold">Semibold</span>
<span class="font-bold">Bold</span>

<u>Underline</u>
<del>Strikethrough</del>
```

### Labels & Captions
```html
<label for="input">Form Label</label>
<small>Caption text</small>

<span class="caption">Image caption</span>
<span class="label">Small label</span>
```

## Code & Technical Text

### Inline Code
```html
<code>function highlightCode()</code>

<!-- In markdown: `code` -->
```

### Code Blocks
```html
<pre><code>
const greeting = "Hello, World!";
console.log(greeting);
</code></pre>
```

**Styling**:
- Font: Fira Code (monospace)
- Background: `var(--bg-tertiary)`
- Padding: 1rem
- Border Radius: 4px

## Text Transform & Cases

### Utilities
```html
<span class="uppercase">Uppercase Text</span>    <!-- TEXT, with wider letter spacing -->
<span class="lowercase">Lowercase text</span>
<span class="capitalize">Capitalize Each Word</span>
<span class="normal-case">Normal CASE</span>
```

## Text Truncation & Line Clamping

### Single Line Truncation
```html
<p class="truncate">This very long text will be cut off with ellipsis...</p>
```

### Multi-line Clamping
```html
<!-- 2 lines -->
<p class="line-clamp-2">Long text that wraps to 2 lines maximum...</p>

<!-- 3 lines -->
<p class="line-clamp-3">Long text that wraps to 3 lines maximum...</p>

<!-- 4 lines -->
<p class="line-clamp-4">Long text that wraps to 4 lines maximum...</p>
```

## Font Families (Tailwind)

### Utility Classes
```html
<!-- Outfit (Headings) -->
<h2 class="font-heading">Heading Text</h2>

<!-- Inter (Body) - Default -->
<p class="font-body">Body text</p>

<!-- Monospace (Code) -->
<code class="font-mono">var x = 10;</code>

<!-- Sans serif (Default) -->
<p class="font-sans">Sans serif text</p>
```

## Light/Dark Mode

Typography automatically adapts to light/dark mode:

```css
/* Light mode (default) */
h1, h2, h3 { color: var(--text-primary); }  /* #1f2937 */
p { color: var(--text-secondary); }         /* #4b5563 */

/* Dark mode (automatic) */
.dark h1, .dark h2, .dark h3 { color: var(--text-primary); }  /* #f1f5f9 */
.dark p { color: var(--text-secondary); }                      /* #cbd5e1 */
```

## Accessibility Features

### Font Smoothing
- Automatic antialiasing across browsers
- Optimized for legibility
- `-webkit-font-smoothing: antialiased`
- `-moz-osx-font-smoothing: grayscale`

### High Contrast Mode
In high contrast mode:
- Font weights automatically increase
- Letter spacing increases
- Improves readability

### Reduced Motion
Respects `prefers-reduced-motion`:
- Disables font transitions
- Maintains keyboard navigation

### Large Text Mode
Automatically scales typography up to 18px base for magnified displays

## Common Patterns

### Hero Section
```html
<section class="py-20">
  <h1 class="heading-display tracking-wider text-center">
    Welcome to Community Hub
  </h1>
  <p class="text-xl text-center max-w-2xl">
    Premium typography with accessibility built-in
  </p>
</section>
```

### Card with Heading
```html
<div class="card">
  <h3 class="heading-secondary mb-4">Card Title</h3>
  <p class="paragraph-base">Card description goes here...</p>
</div>
```

### Form Labels
```html
<form>
  <label for="email" class="label">Email Address</label>
  <input type="email" id="email" class="font-body" />
</form>
```

### Button Text
```html
<!-- Primary button -->
<button class="font-semibold text-base">Click Me</button>

<!-- Small button -->
<button class="text-sm font-semibold">Small</button>

<!-- Large button -->
<button class="text-lg font-semibold">Large</button>
```

### Navigation Links
```html
<nav class="font-body font-semibold">
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>
```

## Migration Guide

### Before
```css
/* Old generic font stack */
font-family: Arial, sans-serif;

/* Inconsistent line heights */
h1 { line-height: 1.1; }
h2 { line-height: 1.3; }
p { line-height: 1.6; }

/* No letter spacing on headings */
h1 { font-size: 48px; font-weight: 700; }
```

### After
```css
/* New premium fonts (automatic) */
font-family: var(--font-body); /* Inter automatically */
h1 { font-family: var(--font-heading); } /* Outfit automatically */

/* Consistent line heights */
h1 { line-height: var(--line-height-tight); }
p { line-height: var(--line-height-relaxed); }

/* Premium letter spacing */
h1 {
  font-size: clamp(48px, 3rem, 60px);
  font-weight: 700;
  letter-spacing: 1px;
}
```

## Performance

### Web Fonts
- **Service**: Google Fonts (fastest CDN)
- **Subset**: wght@300;400;500;600;700
- **Load Strategy**: Async (non-blocking)
- **Variable Fonts**: Optimized for smaller file size

### Optimization
- Only essential font weights loaded
- System fonts as fallback
- `font-display: swap` for better UX
- ~50KB total for both fonts

## Browser Support

- ✓ Chrome/Edge (all versions)
- ✓ Firefox (all versions)
- ✓ Safari (all versions)
- ✓ Mobile browsers (iOS Safari, Chrome Mobile)
- ✓ Graceful degradation to system fonts if CDN fails

## Testing Checklist

- [ ] Test all heading levels (h1-h6)
- [ ] Check body text readability
- [ ] Verify responsive font sizes on mobile
- [ ] Test in light and dark modes
- [ ] Check focus states on links
- [ ] Verify code block formatting
- [ ] Test with font size zoom (200%)
- [ ] Check high contrast mode
- [ ] Verify print styles
- [ ] Test keyboard navigation

## File Structure

```
src/css/
├── typography.css          ← Font definitions & styles (primary)
├── global.css              ← Updated to use new typography
└── darkMode.css            ← Typography dark mode overrides

tailwind.config.js          ← Font family & size configuration
src/index.css               ← Imports typography.css
```

## CSS Variables Reference

```css
/* Font Families */
--font-heading: 'Outfit', system-ui, -apple-system, sans-serif;
--font-body: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'Fira Code', 'Monaco', 'Courier New', monospace;

/* Font Sizes (responsive) */
--text-xs through --text-6xl

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--line-height-tight: 1.2;
--line-height-snug: 1.375;
--line-height-normal: 1.5;
--line-height-relaxed: 1.625;

/* Letter Spacing */
--letter-spacing-tight: -0.5px;
--letter-spacing-normal: 0px;
--letter-spacing-wide: 0.5px;
--letter-spacing-wider: 1px;
--letter-spacing-widest: 1.5px;
```

## Questions & Support

For typography issues or proposals, refer to the architecture documentation or team planning meetings.
