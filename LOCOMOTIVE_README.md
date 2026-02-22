# 🎯 La Academia Maia Kode - Locomotive Style

## Quick Start

### Development
```bash
npm run preview    # Start development server
npm run build     # Build SCSS and process assets  
npm run dev       # Watch files and auto-rebuild (with BrowserSync)
```

## ✨ Features Implemented

### Locomotive-Style Effects
- **3D Floating Animations**: Advanced geometric shapes with Aurora Dorada colors
- **Particle System**: Dynamic particles with mouse/scroll interactions  
- **Custom Cursor**: Enhanced cursor with velocity-based effects and trails
- **Scroll Animations**: Parallax effects and appear animations
- **Interactive Effects**: Ripple clicks, gradient glows, particle bursts

### Build System
- **Gulp**: Automated SASS compilation and asset processing
- **BrowserSync**: Live reload during development
- **SASS**: Organized stylesheets with modular architecture

### Colors (Aurora Dorada)
- `#FFC777` - Dorado Vibrante (Gold)
- `#58A6FF` - Azul Eléctrico (Electric Blue)  
- `#A855F7` - Violeta Creativo (Creative Violet)
- `#E879F9` - Magenta Geek-Chic (Geek-Chic Magenta)

## 🛠️ Architecture

```
/src/
  /scss/
    _variables.scss    # Aurora Dorada color system
    _3d-effects.scss   # 3D animations and transforms
    _locomotive.scss   # Scroll-based animations
    _animations.scss   # Advanced keyframe animations
    main.scss         # Main stylesheet importing all partials
  
locomotive-enhanced.js # Main locomotive-style application
```

## 🎨 Visual Effects

- **Enhanced 3D Shapes**: 8 sophisticated floating elements with wireframes and organic shapes
- **Advanced Particles**: Multi-type system (normal, burst, trail) with scroll interactions
- **Smooth Cursor**: Radial gradient cursor with 8-element trail system
- **Ripple Effects**: Physical button click animations
- **Scroll Parallax**: Sections move at different speeds
- **Appear Animations**: Elements fade in when scrolled into view

## 📱 Responsive & Accessible

- Mobile-optimized (effects disabled on touch devices)
- Respects `prefers-reduced-motion` settings
- Cross-browser compatible
- Performance optimized with requestAnimationFrame

## 🚀 Performance

- Throttled mouse interactions
- Intersection Observer for efficient scroll animations
- Memory management with proper cleanup
- Optimized for 60fps animations