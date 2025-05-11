Quick Design Tokens
Modern design tokens library with TypeScript support for managing consistent design across your projects.
Installation
bash# Using npm
npm install @przemekr95/quick-design-tokens

# Using yarn

yarn add @przemekr95/quick-design-tokens

# Using pnpm

pnpm add @przemekr95/quick-design-tokens
Features

🔄 Fully typed with TypeScript
🎨 Multiple output formats (CSS, SCSS, JS/TS)
🧩 Modular architecture with core and theme tokens
📦 ESM and CommonJS support
🚀 Easy to extend with custom tokens

Usage
JavaScript / TypeScript
javascript// Import all tokens
import tokens from '@przemekr95/quick-design-tokens';

// Import specific tokens
import { colors, typography, spacing } from '@przemekr95/quick-design-tokens';

// Import a specific theme
import { prPhoto, prDev, prIskierka } from '@przemekr95/quick-design-tokens';

// Use tokens in your code
const primaryColor = colors.primary; // #007bff
const headingFont = typography.fontFamily.heading; // 'Montserrat, Georgia, serif'
const mediumSpacing = spacing.md; // '1rem'

// Use theme tokens
const photoThemePrimary = prPhoto.colors.primary; // #0066cc
const devThemeSecondary = prDev.colors.secondary; // #0066cc
const iskierkaAccent = prIskierka.colors.accent; // #ff6d00
React (JSX)
jsximport React from 'react';
import { colors, spacing, typography } from '@przemekr95/quick-design-tokens';

const Button = ({ children, variant = 'primary' }) => {
const buttonStyle = {
backgroundColor: colors[variant],
color: colors.light,
padding: `${spacing.xs} ${spacing.md}`,
fontFamily: typography.fontFamily.base,
fontSize: typography.fontSize.md,
fontWeight: typography.fontWeight.medium,
border: 'none',
borderRadius: '4px',
cursor: 'pointer',
};

return <button style={buttonStyle}>{children}</button>;
};

export default Button;
CSS
css/_ Import all tokens _/
@import '@przemekr95/quick-design-tokens/css';

/_ Import core tokens only _/
@import '@przemekr95/quick-design-tokens/css/core';

/_ Import specific theme _/
@import '@przemekr95/quick-design-tokens/css/pr-photo';
@import '@przemekr95/quick-design-tokens/css/pr-dev';
@import '@przemekr95/quick-design-tokens/css/pr-iskierka';

/_ Usage example _/
.button {
background-color: var(--primary);
color: var(--light);
padding: var(--spacing-xs) var(--spacing-md);
font-family: var(--typography-fontFamily-base);
font-size: var(--typography-fontSize-md);
font-weight: var(--typography-fontWeight-medium);
}

/_ Using theme tokens _/
.theme-photo .button {
background-color: var(--primary);
}

.pr-dev .card {
box-shadow: var(--boxShadow-md);
}

.pr-iskierka .highlight {
box-shadow: var(--lighting-glow-medium);
background-color: var(--lighting-ambient-soft);
}
SCSS
scss// Import all tokens
@import '@przemekr95/quick-design-tokens/scss';

// Import core tokens only
@import '@przemekr95/quick-design-tokens/scss/core';

// Import specific theme
@import '@przemekr95/quick-design-tokens/scss/pr-photo';
@import '@przemekr95/quick-design-tokens/scss/pr-dev';
@import '@przemekr95/quick-design-tokens/scss/pr-iskierka';

// Usage example with SCSS maps
.button {
background-color: map-get($colors, "primary");
  color: map-get($colors, "light");
padding: map-get($spacing, "xs") map-get($spacing, "md");
font-family: map-get(map-get($typography, "fontFamily"), "base");
  font-size: map-get(map-get($typography, "fontSize"), "md");
font-weight: map-get(map-get($typography, "fontWeight"), "medium");
}

// Using theme tokens
.photo-theme {
$theme-colors: $pr-photo-colors;

.button {
background-color: map-get($theme-colors, "primary");
}
}
Adding New Tokens
Adding Core Tokens

Add new token values to the appropriate file in src/tokens/core/:

colors.ts - For color tokens
typography.ts - For typography tokens
spacing.ts - For spacing, border radius, and box shadow tokens

Update the corresponding TypeScript interface in src/types/tokens.ts

Example - Adding a new color token:
typescript// src/tokens/core/colors.ts
export const colors: ColorTokens = {
primary: '#007bff',
secondary: '#6c757d',
// Add your new color
tertiary: '#20c997',
// ...other colors
};

// src/types/tokens.ts
export interface ColorTokens {
primary: string;
secondary: string;
// Add your new color
tertiary: string;
// ...other colors
[key: string]: string;
}
Adding New Themes

Create a new theme file in src/tokens/themes/:

typescript// src/tokens/themes/pr-newtheme.ts
import { ThemeTokens } from '../../types/tokens.js';
import { coreTokens } from '../core/index.js';
import merge from 'lodash.merge';

export const prNewTheme: ThemeTokens = merge({}, coreTokens, {
colors: {
primary: '#8e44ad',
secondary: '#2ecc71',
// Add your custom colors
},
// Add your custom token sections
customSection: {
feature1: 'value1',
feature2: 'value2'
}
});

Register the new theme in src/tokens/themes/index.ts:

typescriptimport { prPhoto } from './pr-photo.js';
import { prDev } from './pr-dev.js';
import { prNewTheme } from './pr-newtheme.js';
import { ThemeMap } from '../../types/tokens.js';

export const themes: ThemeMap = {
'pr-photo': prPhoto,
'pr-dev': prDev,
'pr-newtheme': prNewTheme,
};

export { prPhoto, prDev, prNewTheme };

Update src/tokens/index.ts to include the new theme:

typescriptexport const projectTokens = {
'pr-photo': prPhoto,
'pr-dev': prDev,
'pr-newtheme': prNewTheme
};

Export the new theme in src/index.ts:

typescriptexport {
// ...existing exports
prPhoto,
prDev,
prNewTheme
};

Update the ThemeKey type in src/types/tokens.ts:

typescriptexport type ThemeKey = 'pr-photo' | 'pr-dev' | 'pr-newtheme';

Update the package.json exports to include the new theme:

json"exports": {
// ...existing exports
"./scss/pr-newtheme": {
"default": "./dist/scss/pr_newtheme.scss"
},
"./css/pr-newtheme": {
"default": "./dist/css/pr_newtheme.css"
}
}
Building
bash# Build all output formats
npm run build

# Development mode with watch

npm run dev
License
MIT
