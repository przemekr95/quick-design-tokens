Quick Design Tokens
Modern design tokens library with TypeScript support for managing consistent design across your projects.
🚀 Features

Multi-project support - Global tokens + project-specific overrides (pr-dev, pr-photo)
Multiple output formats - SCSS, CSS (with planned JS/TS support)
Utility classes - Font utility classes with combined properties
Style Dictionary v5 - Built on the latest version of Style Dictionary
TypeScript first - Full TypeScript support with type definitions
Figma integration ready - Structure prepared for Figma token sync
GitHub Packages - Easy distribution via GitHub Packages

📦 Installation
bashnpm install @przemekr95/quick-design-tokens
🎯 Usage
SCSS Variables
scss// Import all tokens
@import '@przemekr95/quick-design-tokens/dist/scss/index';

// Or import specific project
@import '@przemekr95/quick-design-tokens/dist/scss/global/variables';
@import '@przemekr95/quick-design-tokens/dist/scss/pr-dev/variables';

// Use tokens
.button {
background-color: $color-primary;
font-family: $font-family-primary;
font-size: $font-size-md-fontSize;
line-height: $font-size-md-lineHeight;
}
SCSS Utility Classes
scss// Import utility classes
@import '@przemekr95/quick-design-tokens/dist/scss/global/classes';

// Use predefined font size classes
.my-text {
@extend .font-size-md; // Applies both font-size and line-height
}

// Or use directly in HTML

<p class="font-size-lg">This text uses large font size with proper line height</p>
CSS Variables
css/* Import CSS custom properties */
@import '@przemekr95/quick-design-tokens/dist/css/global/variables.css';

.button {
background-color: var(--color-primary);
font-family: var(--font-family-primary);
font-size: var(--font-size-md-fontSize);
line-height: var(--font-size-md-lineHeight);
}
CSS Utility Classes
css/_ Import utility classes _/
@import '@przemekr95/quick-design-tokens/dist/css/global/classes.css';

/_ Use predefined font size classes _/
.my-text {
/_ No need to specify both font-size and line-height _/
}
html<!-- Use directly in HTML -->

<p class="font-size-lg">This text uses large font size with proper line height</p>
<h1 class="font-size-3xl">Large heading</h1>
<small class="font-size-xs">Small text</small>
🏗️ Project Structure
figma-export/
├── global/           # Shared tokens across all projects
│   ├── color.json
│   └── font.json
├── pr-dev/          # Developer tools project
│   ├── color.json
│   └── font.json
└── pr-photo/        # Photo editing project
    ├── color.json
    └── font.json
🎨 Available Tokens
Global Tokens

Colors: Primary palette, neutral grays, semantic colors
Typography: Font families, sizes, weights

Font Size Classes
The system automatically generates utility classes for font sizes that combine both font-size and line-height:

.font-size-xs - 12px font, 16px line-height
.font-size-sm - 14px font, 20px line-height
.font-size-md - 16px font, 24px line-height
.font-size-lg - 18px font, 28px line-height
.font-size-xl - 20px font, 28px line-height
.font-size-2xl - 24px font, 32px line-height
.font-size-3xl - 30px font, 36px line-height

pr-dev Project

Colors: Brand colors, developer-specific syntax highlighting
Typography: Code fonts, UI fonts, documentation fonts

pr-photo Project

Colors: Creative palettes, photo overlays, filter colors
Typography: Artistic fonts, caption styles, watermark fonts

🔧 Development
Build Tokens
bashnpm run build
Watch Mode
bashnpm run dev
Type Checking
bashnpm run typecheck
Linting
bashnpm run lint
📋 Roadmap
Phase 1 - Current (SCSS/CSS Support)

✅ Style Dictionary v5 setup
✅ Multi-project token structure
✅ SCSS variables generation
✅ CSS custom properties generation
✅ Font utility classes generation
✅ Build system with preprocessing

Phase 2 - JavaScript/TypeScript Support

ESM module generation (dist/js/esm/)
CommonJS module generation (dist/js/cjs/)
TypeScript definitions (dist/types/)
Token utility functions
React/Vue component helpers

Phase 3 - Figma Integration

Figma API integration
Automated token sync
CI/CD pipeline for token updates
Design-code consistency validation

Phase 4 - Advanced Features

Theme system (light/dark modes)
Token composition and references
Mobile platform support (iOS/Android)
Component token mapping

🔧 Configuration
The system uses Style Dictionary v5 with custom preprocessing. Configuration is split across:

src/config.ts - Main Style Dictionary configuration
src/build.ts - Build pipeline and output generation
src/preformat.ts - Token preprocessing and normalization

📦 Distribution
Built tokens are available in:
dist/
├── scss/
│ ├── global/
│ │ ├── variables.scss # SCSS variables
│ │ ├── classes.scss # Font utility classes  
│ │ └── index.scss # Combined import
│ ├── pr-dev/
│ │ ├── variables.scss
│ │ ├── classes.scss
│ │ └── index.scss
│ ├── pr-photo/
│ │ ├── variables.scss
│ │ ├── classes.scss
│ │ └── index.scss
│ └── index.scss # All projects combined
├── css/
│ ├── global/
│ │ ├── variables.css # CSS custom properties
│ │ ├── classes.css # Font utility classes
│ │ └── index.css # Combined import
│ ├── pr-dev/
│ │ ├── variables.css
│ │ ├── classes.css
│ │ └── index.css
│ ├── pr-photo/
│ │ ├── variables.css
│ │ ├── classes.css
│ │ └── index.css
│ └── index.css # All projects combined
└── package.json
⚡ Design Philosophy
Variables vs Utility Classes
This system provides both approaches:
Variables (Traditional approach):
scss.custom-text {
font-size: $font-size-lg-fontSize;
line-height: $font-size-lg-lineHeight;
}
Utility Classes (Modern approach):
html<p class="font-size-lg">Perfect typography</p>
Benefits of Utility Classes:

✅ Guaranteed consistency (font-size and line-height always paired)
✅ Faster development (one class instead of two properties)
✅ Smaller bundle size (reused classes)
✅ Less chance for typography errors

When to use Variables:

Custom components requiring specific styling
Complex CSS calculations
Dynamic styling with CSS-in-JS

When to use Utility Classes:

Rapid prototyping
Consistent text styling across components
HTML-first development approach

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
