# Quick Design Tokens v1.0.0 🎉

Modern design tokens library with full TypeScript support for managing consistent design across your projects.

## 🚀 Features

✅ **Multi-project support** - Global tokens + project-specific overrides (global, pr-dev, pr-photo, pr-iskierka)  
✅ **Multiple output formats** - SCSS, CSS, JavaScript (ESM/CJS), TypeScript definitions  
✅ **Clean typography API** - Combined font-size/line-height in single variable (`$text-md`)  
✅ **Utility classes** - Font and spacing utility classes with combined properties  
✅ **React 19 compatible** - Full ES modules and TypeScript support  
✅ **Style Dictionary v5** - Built on the latest version of Style Dictionary  
✅ **TypeScript first** - Complete TypeScript definitions with intellisense  
✅ **Tree-shaking support** - Import only what you need  
✅ **Production ready** - v1.0.0 stable API  
✅ **GitHub Packages** - Professional distribution

## 🎯 What's New in v1.0.0

- 🧹 **Clean API** - Removed legacy variables, only modern syntax
- 🚀 **JavaScript/TypeScript** - Full ES modules support for React/Vue/Angular
- ⚡ **Unified spacing** - Single `$spacing-*` scale for margin, padding, gap, etc.
- 📝 **Modern typography** - `TextMd: "16px/24px"` for CSS font shorthand
- 🎨 **Extended color palettes** - More colors for modern UIs (pr-iskierka project)
- 📦 **Smaller bundle** - No redundant tokens, optimized output
- 🎯 **Consistent API** - SCSS, JavaScript, and TypeScript use same naming convention

## 📦 Installation

```bash
npm install @przemekr95/quick-design-tokens
```

## 🎯 Usage

## React/TypeScript 
```tsx
// Import tokens for React/Next.js projects
import { tokens } from '@przemekr95/quick-design-tokens/dist/js/esm/pr-iskierka/tokens.js';

// Use modern typography tokens in styled-components
const Button = styled.button`
  background-color: ${tokens.ColorPrimary};    // #282a7e (purple)
  font: ${tokens.TextMd};                      // "16px/24px" - CSS font shorthand!
  color: ${tokens.ColorText};
  padding: ${tokens.Spacing3} ${tokens.Spacing4}; // 12px 16px (unified spacing)
  border-radius: ${tokens.Spacing2};           // 8px
`;

// Individual typography values for flexibility
const Heading = styled.h1`
  font-size: ${tokens.FontLg};     // 18px
  line-height: ${tokens.LineLg};   // 28px
  margin-bottom: ${tokens.Spacing6}; // 24px
`;

// Or import all projects
import allTokens from '@przemekr95/quick-design-tokens/dist/js/esm/index.js';
const iskierkaColors = allTokens['pr-iskierka'].ColorPrimary;
```

## SCSS Variables (Clean API v1.0.0)
```scss
// Import all tokens
@import '@przemekr95/quick-design-tokens/dist/scss/index';

// Or import specific project
@import '@przemekr95/quick-design-tokens/dist/scss/pr-iskierka/variables';

// Modern typography variables (v1.0.0)
.button {
  background-color: $color-primary;
  font: #{$text-md};        // "16px/24px" combined for CSS font shorthand!
  color: $color-text;
  padding: $spacing-3 $spacing-4;  // 12px 16px (unified spacing scale)
  border-radius: $spacing-2;       // 8px
}

// Individual values available for flexibility
.heading {
  font-size: $font-lg;             // 18px
  line-height: $line-lg;           // 28px
  font-weight: $font-weight-semibold;
  margin-bottom: $spacing-6;       // 24px (same scale for all spacing)
}
```

## CSS Variables & Utility Classes (v1.0.0)
```css
/* Import CSS custom properties */
@import '@przemekr95/quick-design-tokens/dist/css/pr-iskierka/variables.css';

.button {
  background-color: var(--color-primary);     /* #282a7e */
  font-family: var(--font-family-primary);
  font-size: var(--font-md);                  /* 16px - modern format! */
  line-height: var(--line-md);                /* 24px - modern format! */
  padding: var(--spacing-3) var(--spacing-4); /* 12px 16px - unified spacing */
  border-radius: var(--spacing-2);            /* 8px */
}

/* Import utility classes (unified spacing) */
@import '@przemekr95/quick-design-tokens/dist/css/pr-iskierka/classes.css';
@import '@przemekr95/quick-design-tokens/dist/css/pr-iskierka/spacing.css';
```

```html
<!-- All classes use unified spacing scale -->
<div class="p-6 m-4">                       <!-- padding: 24px, margin: 16px -->
  <h1 class="font-size-3xl mb-3">          <!-- 30px/36px, margin-bottom: 12px -->
    pr-iskierka Club
  </h1>
  <p class="font-size-lg p-4 m-2">         <!-- 18px/28px, padding: 16px, margin: 8px -->
    Perfect typography with unified spacing
  </p>
  <small class="font-size-xs">Small text</small> <!-- 12px/16px -->
</div>
```
🏗️ Project Structure
```
figma-export/
├── global/           # Shared tokens across all projects
│   ├── color.json    # Base color palette
│   ├── font.json     # Typography system
│   └── spacing.json  # Spacing scale
├── pr-dev/          # Developer tools project
│   └── color.json   # Developer-specific colors
├── pr-photo/        # Photo editing project  
│   └── color.json   # Photo app colors
└── pr-iskierka/     # Club website project (NEW!)
    └── color.json   # Club brand colors + extended palette
```
🎨 Available Tokens

## Global Tokens (Inherited by all projects)
- **Colors**: Primary, secondary, neutral, background, text, success, warning, error
- **Typography**: Font families (Inter, JetBrains Mono, Cal Sans), weights (300-700)
- **Font Sizes**: xs(12px), sm(14px), md(16px), lg(18px), xl(20px), 2xl(24px), 3xl(30px)
- **Unified Spacing**: Single scale for margin, padding, gap, border-radius (0px, 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px, 128px, 160px, 192px, 224px, 256px)

## Modern Typography System (v1.0.0)
```scss
// Combined typography variables (perfect for CSS font shorthand)
$text-xs: "12px/16px";   // font-size/line-height combined
$text-sm: "14px/20px";
$text-md: "16px/24px";
$text-lg: "18px/28px";
$text-xl: "20px/28px";
$text-2xl: "24px/32px";
$text-3xl: "30px/36px";

// Usage with CSS font shorthand:
.heading {
  font: #{$text-lg}; // Outputs: font: 18px/28px;
}

// Individual variables for flexibility:
$font-xs: 12px;        // only font-size
$line-xs: 16px;        // only line-height

// Font families and weights:
$font-family-primary: Inter, system-ui, sans-serif;
$font-family-mono: 'JetBrains Mono', monospace;
$font-weight-regular: 400;
$font-weight-semibold: 600;
```

## Project-Specific Tokens

### pr-dev Project
- **Colors**: Developer blue theme (#2563eb primary, #1d4ed8 secondary)
- **Use case**: Developer tools, code editors, documentation

### pr-photo Project  
- **Colors**: Photo app cyan theme (#38bdf8 primary, #7dd3fc secondary)
- **Use case**: Photo editing, creative tools

### pr-iskierka Project (NEW!)
- **Colors**: Club purple/navy theme (#282a7e primary, #4c51bf secondary, #1B1464 background)
- **Extended palette**: accent, info, muted, surface, border colors
- **Use case**: Club/organization websites, branded applications

## Utility Classes
```css
/* Font size classes (combine font-size + line-height) */
.font-size-xs, .font-size-sm, .font-size-md, .font-size-lg, 
.font-size-xl, .font-size-2xl, .font-size-3xl

/* Spacing classes (optimized for common usage) */
.m-0, .m-1, .m-2, .m-3, .m-4, .m-5, .m-6, .m-8, .m-10, .m-12, .m-16  /* 0px to 64px */
.mt-*, .mr-*, .mb-*, .ml-*, .mx-*, .my-*  /* All directional variants */
.p-*, .pt-*, .pr-*, .pb-*, .pl-*, .px-*, .py-*  /* All padding variants */

/* For larger values, use CSS variables directly: */
/* margin: var(--spacing-24); /* 96px */ */
/* padding: var(--spacing-32); /* 128px */ */
```

🔧 Development
Build Tokens
bashnpm run build
Watch Mode
bashnpm run dev
Type Checking
bashnpm run typecheck
Linting
bashnpm run lint
## �️ Roadmap

### ✅ v1.0.0 - Production Ready (Current)
- ✅ Style Dictionary v5 setup
- ✅ Multi-project token structure (global, pr-dev, pr-photo, pr-iskierka)
- ✅ Unified spacing system - single scale for all spacing needs
- ✅ SCSS/CSS variables generation with modern syntax
- ✅ JavaScript/TypeScript support (ESM/CJS) with consistent API
- ✅ React 19 compatibility with tree-shaking support
- ✅ Clean typography API (`TextMd: "16px/24px"`, `FontMd: "16px"`, `LineMd: "24px"`)
- ✅ Utility classes (font sizes, spacing) based on unified scale
- ✅ Extended color palettes for modern UIs

### 🔄 v1.1.0 - Enhanced Features
- 🔄 Semantic color tokens (primary-50, primary-100, etc.)
- 🔄 Dark/light theme support
- 🔄 Component tokens (button-primary-bg, input-border, etc.)
- 🔄 Better TypeScript interfaces with generics
- 🔄 CSS-in-JS helpers (styled-components, emotion)

### 📋 v1.2.0 - Figma Integration
- 📋 Figma API integration
- 📋 Automated token sync
- 📋 CI/CD pipeline for token updates  
- 📋 Design-code consistency validation

### 📋 v2.0.0 - Multi-Platform
- 📋 Mobile platform support (iOS/Android)
- 📋 Figma Plugin
- 📋 Advanced theming system
- 📋 Token composition and references

🔧 Configuration
The system uses Style Dictionary v5 with custom preprocessing. Configuration is split across:

src/config.ts - Main Style Dictionary configuration
src/build.ts - Build pipeline and output generation
src/preformat.ts - Token preprocessing and normalization

📦 Distribution (v1.0.0)
Built tokens are available in multiple formats with consistent API:

```
dist/
├── scss/                    # SCSS Variables
│   ├── global/
│   │   ├── variables.scss   # Enhanced with $text-* variables
│   │   ├── classes.scss     # Font utility classes
│   │   ├── spacing.scss     # Spacing utility classes
│   │   └── index.scss       # Combined imports
│   ├── pr-dev/, pr-photo/, pr-iskierka/ # Project-specific
│   └── index.scss           # All projects combined
├── css/                     # CSS Custom Properties
│   ├── global/
│   │   ├── variables.css    # CSS custom properties
│   │   ├── classes.css      # Font utility classes
│   │   ├── spacing.css      # Spacing utility classes
│   │   └── index.css        # Combined imports
│   ├── pr-dev/, pr-photo/, pr-iskierka/ # Project-specific
│   └── index.css            # All projects combined
├── js/                      # JavaScript/TypeScript (NEW!)
│   ├── esm/                 # ES Modules
│   │   ├── global/
│   │   │   ├── tokens.js    # export const tokens = {...}
│   │   │   └── index.js     # Re-exports
│   │   ├── pr-dev/, pr-photo/, pr-iskierka/ # Project-specific
│   │   └── index.js         # All projects: { "global": ..., "pr-dev": ... }
│   └── cjs/                 # CommonJS
│       ├── global/, pr-dev/, pr-photo/, pr-iskierka/ # module.exports
│       └── index.js         # All projects combined
└── types/                   # TypeScript Definitions (NEW!)
    ├── global/
    │   ├── tokens.d.ts      # Type definitions
    │   └── index.d.ts       # Re-exports
    ├── pr-dev/, pr-photo/, pr-iskierka/ # Project-specific
    └── index.d.ts           # All projects interface
```
## 🔧 Framework Examples (v1.0.0)

### React + TypeScript (Modern v1.0.0 API)
```tsx
import { tokens } from '@przemekr95/quick-design-tokens/dist/js/esm/pr-iskierka/tokens.js';

const MyComponent: React.FC = () => (
  <button style={{
    backgroundColor: tokens.ColorPrimary,      // #282a7e
    font: tokens.TextMd,                       // "16px/24px" - CSS font shorthand!
    color: tokens.ColorText,
    padding: `${tokens.Spacing3} ${tokens.Spacing4}`, // "12px 16px"
    borderRadius: tokens.Spacing2              // "8px"
  }}>
    Click me
  </button>
);
```

### Next.js 13+ (App Router)
```tsx
import { tokens } from '@przemekr95/quick-design-tokens/dist/js/esm/global/tokens.js';

export default function HomePage() {
  return (
    <div style={{ 
      backgroundColor: tokens.ColorBackground,
      fontFamily: tokens.FontFamilyPrimary 
    }}>
      Welcome to Next.js with Design Tokens!
    </div>
  );
}
```

### Styled Components (Enhanced v1.0.0)
```tsx
import styled from 'styled-components';
import { tokens } from '@przemekr95/quick-design-tokens/dist/js/esm/pr-iskierka/tokens.js';

const Button = styled.button`
  background-color: ${tokens.ColorPrimary};    // #282a7e (pr-iskierka purple)
  font: ${tokens.TextMd};                      // "16px/24px" - perfect CSS font!
  color: ${tokens.ColorText};
  padding: ${tokens.Spacing3} ${tokens.Spacing4}; // 12px 16px (unified spacing)
  border-radius: ${tokens.Spacing2};           // 8px
  border: 1px solid ${tokens.ColorBorder};     // #d1d5db
  
  &:hover {
    background-color: ${tokens.ColorAccent};   // #4c51bf (hover state)
  }
`;

// Typography example with individual values
const Heading = styled.h1`
  font-size: ${tokens.FontLg};        // 18px
  line-height: ${tokens.LineLg};      // 28px
  font-weight: ${tokens.FontWeightSemibold}; // 600
  margin-bottom: ${tokens.Spacing6};  // 24px
  color: ${tokens.ColorPrimary};
`;
```

### Sass/SCSS (Enhanced v1.0.0 - Unified Spacing)
```scss
@import '@przemekr95/quick-design-tokens/dist/scss/pr-iskierka/variables';

.button {
  background-color: $color-primary;    // #282a7e
  font: #{$text-md};                   // "16px/24px" combined!
  color: $color-text;
  padding: $spacing-3 $spacing-4;      // 12px 16px (unified spacing)
  border-radius: $spacing-2;           // 8px (same scale)
  border: 1px solid $color-border;
  
  &:hover {
    background-color: $color-accent;   // #4c51bf
  }
}

.card {
  padding: $spacing-6;                 // 24px all around
  margin-bottom: $spacing-4;           // 16px
  border-radius: $spacing-3;           // 12px (all from same scale!)
  background: $color-surface;          // #f8fafc
}

// Typography with individual control
.heading {
  font-size: $font-lg;                // 18px
  line-height: $line-lg;              // 28px
  font-weight: $font-weight-semibold; // 600
  margin-bottom: $spacing-6;          // 24px
}
```

⚡ Design Philosophy

## 🎯 Unified Spacing System (v1.0.0)

**Why only `spacing` tokens instead of separate margin/padding?**

❌ **Old approach (redundant):**
```scss
$margin-4: 16px;   // Same values,
$padding-4: 16px;  // different names,
$spacing-4: 16px;  // hard to maintain
```

✅ **New approach (unified):**
```scss
$spacing-4: 16px;  // One scale, used everywhere
```

**Benefits:**
- 🎯 **Single source of truth** - one scale for all spacing needs
- 🔧 **Easier maintenance** - change once, affects all spacing
- 📏 **Consistent rhythm** - margin, padding, gap, border-radius all aligned
- 📦 **Smaller bundle** - no redundant variables + optimized utility classes
- 🎨 **Better design consistency** - forces unified spatial relationships
- ⚡ **Performance optimized** - only practical utility classes (0-16), larger values via CSS variables

**Usage examples:**
```scss
.card {
  padding: $spacing-6;           // 24px internal spacing
  margin-bottom: $spacing-4;     // 16px external spacing  
  border-radius: $spacing-2;     // 8px border radius
  gap: $spacing-3;              // 12px flex/grid gap
}
// All using the same scale = perfect visual harmony! 🎨
```

## Variables vs Utility Classes vs JavaScript
This system provides three approaches:

### 1. JavaScript Objects (v1.0.0 - Best for React/Vue)
```tsx
// ✅ Type-safe, tree-shakeable, intellisense, unified spacing
backgroundColor: tokens.ColorPrimary,    // #282a7e
font: tokens.TextMd,                     // "16px/24px" - CSS font shorthand
padding: `${tokens.Spacing3} ${tokens.Spacing4}`, // "12px 16px"
borderRadius: tokens.Spacing2            // "8px" (same scale!)
```

### 2. SCSS Variables (v1.0.0 - Best for traditional CSS)
```scss
// ✅ Combined typography + unified spacing scale
.component {
  font: #{$text-md};              // "16px/24px"
  padding: $spacing-3 $spacing-4; // 12px 16px
  border-radius: $spacing-2;      // 8px (all from one scale!)
}
```

### 3. Utility Classes (Best for rapid prototyping)
```html
<!-- ✅ Guaranteed consistency, no custom CSS needed -->
<p class="font-size-lg p-4 m-2">Perfect typography</p>
```

### When to use each:

**JavaScript Objects**: React, Vue, Angular, CSS-in-JS libraries
**SCSS Variables**: Traditional websites, WordPress, custom components  
**Utility Classes**: Rapid prototyping, HTML-first development, avoiding custom CSS

## 💡 Real-World Usage Examples

### Building a Card Component
```tsx
// React with TypeScript
const Card = styled.div`
  background: ${tokens.ColorSurface};      // #f8fafc
  border: 1px solid ${tokens.ColorBorder}; // #d1d5db  
  border-radius: ${tokens.Spacing3};       // 12px
  padding: ${tokens.Spacing6};             // 24px
  margin-bottom: ${tokens.Spacing4};       // 16px
  
  h3 {
    font: ${tokens.TextLg};                // "18px/28px"
    color: ${tokens.ColorPrimary};         // #282a7e
    margin-bottom: ${tokens.Spacing3};     // 12px
  }
  
  p {
    font: ${tokens.TextMd};                // "16px/24px"  
    color: ${tokens.ColorText};            // #2f3542
    margin-bottom: ${tokens.Spacing4};     // 16px
  }
`;
```

### SCSS Button Variants
```scss
@import '@przemekr95/quick-design-tokens/dist/scss/pr-iskierka/variables';

.btn {
  font: #{$text-md};                    // 16px/24px base
  padding: $spacing-3 $spacing-4;      // 12px 16px
  border-radius: $spacing-2;            // 8px
  border: none;
  cursor: pointer;
  
  &--primary {
    background: $color-primary;         // #282a7e
    color: $color-neutral;             // #f1f2f6
  }
  
  &--secondary {
    background: $color-secondary;       // #4c51bf
    color: $color-neutral;
  }
  
  &--large {
    font: #{$text-lg};                 // 18px/28px
    padding: $spacing-4 $spacing-6;    // 16px 24px
  }
}
```

### Utility-First HTML (Optimized Classes)
```html
<!-- Common spacing classes (0-16 range) -->
<div class="p-6 m-4">                    <!-- padding: 24px, margin: 16px -->
  <h1 class="font-size-2xl mb-3">       <!-- 24px/32px font, margin-bottom: 12px -->
    pr-iskierka Club
  </h1>
  <p class="font-size-md mb-4">         <!-- 16px/24px font, margin-bottom: 16px -->
    Welcome to our club website
  </p>
  <button class="p-3 font-size-md">     <!-- padding: 12px, 16px/24px font -->
    Join Now
  </button>
</div>

<!-- For larger spacing, use inline styles with CSS variables -->
<section style="padding: var(--spacing-24); margin: var(--spacing-32);">
  <!-- 96px padding, 128px margin -->
  <div class="p-8 mb-12">              <!-- 32px padding, 48px margin-bottom -->
    Large content area
  </div>
</section>
```

🤝 Contributing

Fork the repository
Create your feature branch (git checkout -b feature/amazing-feature)
Add your tokens to the appropriate JSON files
Run npm run build to generate outputs
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

📄 License
MIT © przemekr95
