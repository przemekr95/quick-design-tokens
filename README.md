# Quick Design Tokens

Modern design tokens library with TypeScript support for managing consistent design across your projects.

## 🚀 Features

- **Multi-project support** - Global tokens + project-specific overrides (pr-dev, pr-photo)
- **Multiple output formats** - SCSS, CSS (with planned JS/TS support)
- **Style Dictionary v5** - Built on the latest version of Style Dictionary
- **TypeScript first** - Full TypeScript support with type definitions
- **Figma integration ready** - Structure prepared for Figma token sync
- **GitHub Packages** - Easy distribution via GitHub Packages

## 📦 Installation

```bash
npm install @przemekr95/quick-design-tokens
```

## 🎯 Usage

### SCSS

```scss
// Import all tokens
@import '@przemekr95/quick-design-tokens/dist/scss/index';

// Or import specific project
@import '@przemekr95/quick-design-tokens/dist/scss/global/variables';
@import '@przemekr95/quick-design-tokens/dist/scss/pr-dev/variables';

// Use tokens
.button {
  background-color: $color-primary-500;
  font-family: $font-family-primary;
  font-size: $font-size-base;
}
```

### CSS

```css
/* Import CSS custom properties */
@import '@przemekr95/quick-design-tokens/dist/css/global/variables.css';

.button {
  background-color: var(--color-primary-500);
  font-family: var(--font-family-primary);
  font-size: var(--font-size-base);
}
```

## 🏗️ Project Structure

```
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
```

## 🎨 Available Tokens

### Global Tokens

- **Colors**: Primary palette, neutral grays, semantic colors
- **Typography**: Font families, sizes, weights

### pr-dev Project

- **Colors**: Brand colors, developer-specific syntax highlighting
- **Typography**: Code fonts, UI fonts, documentation fonts

### pr-photo Project

- **Colors**: Creative palettes, photo overlays, filter colors
- **Typography**: Artistic fonts, caption styles, watermark fonts

## 🔧 Development

### Build Tokens

```bash
npm run build
```

### Watch Mode

```bash
npm run dev
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

## 📋 Roadmap

### Phase 1 - Current (SCSS/CSS Support)

- ✅ Style Dictionary v5 setup
- ✅ Multi-project token structure
- ✅ SCSS variables generation
- ✅ CSS custom properties generation
- ✅ Build system with preprocessing

### Phase 2 - JavaScript/TypeScript Support

- [ ] ESM module generation (`dist/js/esm/`)
- [ ] CommonJS module generation (`dist/js/cjs/`)
- [ ] TypeScript definitions (`dist/types/`)
- [ ] Token utility functions
- [ ] React/Vue component helpers

### Phase 3 - Figma Integration

- [ ] Figma API integration
- [ ] Automated token sync
- [ ] CI/CD pipeline for token updates
- [ ] Design-code consistency validation

### Phase 4 - Advanced Features

- [ ] Theme system (light/dark modes)
- [ ] Token composition and references
- [ ] Mobile platform support (iOS/Android)
- [ ] Component token mapping

## 🔧 Configuration

The system uses Style Dictionary v5 with custom preprocessing. Configuration is split across:

- `src/config.ts` - Main Style Dictionary configuration
- `src/build.ts` - Build pipeline and output generation
- `src/preformat.ts` - Token preprocessing and normalization

## 📦 Distribution

Built tokens are available in:

```
dist/
├── scss/
│   ├── global/variables.scss
│   ├── pr-dev/variables.scss
│   ├── pr-photo/variables.scss
│   └── index.scss
├── css/
│   ├── global/variables.css
│   ├── pr-dev/variables.css
│   └── pr-photo/variables.css
└── package.json
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Add your tokens to the appropriate JSON files
4. Run `npm run build` to generate outputs
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

MIT © przemekr95
