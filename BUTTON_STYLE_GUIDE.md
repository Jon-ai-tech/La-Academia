# Guía de Estilos de Botones - Button Style Guide

## Resumen / Summary

Esta guía documenta los estilos unificados de botones implementados en el proyecto Maia Kode Genesis, estableciendo consistencia visual en toda la interfaz.

This guide documents the unified button styles implemented in the Maia Kode Genesis project, establishing visual consistency across the entire interface.

## Tipos de Botones / Button Types

### 1. 🔘 Botones Circulares Decorativos (Idioma)
**Circular Decorative Buttons (Language)**

**Uso:** Selección de idioma (ES/EN)  
**Use:** Language selection (ES/EN)

**HTML:**
```html
<div class="decorative-btn-container-circle">
    <button class="decorative-btn-circle lang-button active-lang bg-tertiary-dark text-tertiary-text">
        ES
    </button>
</div>
```

**CSS Clave / Key CSS:**
```css
.decorative-btn-container-circle {
    border-radius: 50%;
    background: linear-gradient(45deg, #58A6FF, #E441A5, #58A6FF);
}

.decorative-btn-circle {
    border-radius: 50%;
    background-color: var(--tertiary-dark);
}
```

### 2. 📱 Botones Rectangulares Decorativos (Navegación)
**Rectangular Decorative Buttons (Navigation)**

**Uso:** Navegación principal (El Objetivo, La Visión, etc.)  
**Use:** Main navigation (The Objective, The Vision, etc.)

**HTML:**
```html
<div class="decorative-btn-container">
    <button class="decorative-btn nav-button text-sm sm:text-base px-3 py-2 sm:px-4 rounded-md text-primary-text">
        <span class="lang-es">El Objetivo</span>
        <span class="lang-en hidden">The Objective</span>
    </button>
</div>
```

**CSS Clave / Key CSS:**
```css
.decorative-btn-container {
    border-radius: 0.8em;
    background: linear-gradient(45deg, #58A6FF, #E441A5, #58A6FF);
}

.decorative-btn {
    border-radius: 0.8em;
    background-color: var(--tertiary-dark);
}
```

### 3. ⚡ Botones IA con Efecto Voltage
**AI Buttons with Voltage Effect**

**Uso:** Funciones de IA (Generar Perfil, Resumir Patrones, etc.)  
**Use:** AI functions (Generate Profile, Summarize Patterns, etc.)

**HTML:**
```html
<div class="ai-btn-voltage">
    <button class="voltage-button api-button bg-accent-blue hover:bg-accent-blue-hover text-primary-dark">
        ✨ Generar el Perfil de IA Ideal
    </button>
</div>
```

**CSS Clave / Key CSS:**
```css
.ai-btn-voltage {
    border-radius: 12px; /* Configurable */
    position: relative;
    overflow: hidden;
}

.voltage-button {
    border-radius: 12px;
    background: var(--accent-blue);
    color: var(--primary-dark);
}
```

### 4. 🎯 Botones CTA (Call-to-Action)
**CTA Buttons**

**Uso:** Llamadas a la acción principales y secundarias  
**Use:** Primary and secondary call-to-action buttons

**HTML Primario / Primary HTML:**
```html
<div class="ai-btn-voltage secondary">
    <a href="#" class="voltage-button cta-button">
        Conoce más sobre el proyecto
    </a>
</div>
```

**HTML Secundario / Secondary HTML:**
```html
<div class="ai-btn-voltage secondary">
    <a href="#" class="voltage-button cta-button-secondary border border-accent-gold text-accent-gold font-semibold py-3 px-8 rounded-full">
        Enlace Secundario
    </a>
</div>
```

**CSS Clave / Key CSS:**
```css
.cta-button {
    border-radius: 12px;
    background-color: var(--accent-blue);
    color: var(--primary-dark);
}

.cta-button-secondary {
    border-color: var(--accent-gold);
    color: var(--accent-gold);
    background: transparent;
}
```

## Especificaciones de Border-Radius

| Tipo de Botón | Border-Radius | Descripción |
|---------------|---------------|-------------|
| Circular decorativo | `50%` | Perfectamente circular para idiomas |
| Rectangular decorativo | `0.8em` | Esquinas redondeadas para navegación |
| AI con voltage | `12px` | Configurable según necesidades |
| CTA primario | `12px` | Consistente con AI buttons |
| CTA secundario | `rounded-full` | Completamente redondeado |
| Scroll-to-top | `50%` | Circular para accesibilidad |

## Border-Radius Specifications

| Button Type | Border-Radius | Description |
|-------------|---------------|-------------|
| Circular decorative | `50%` | Perfectly circular for languages |
| Rectangular decorative | `0.8em` | Rounded corners for navigation |
| AI with voltage | `12px` | Configurable as needed |
| CTA primary | `12px` | Consistent with AI buttons |
| CTA secondary | `rounded-full` | Fully rounded |
| Scroll-to-top | `50%` | Circular for accessibility |

## Efectos Visuales / Visual Effects

### 🌈 Gradiente Animado (Botones Decorativos)
- Colores: `#58A6FF` (azul) y `#E441A5` (magenta)
- Animación: `gradientShift` de 3 segundos
- Hover: Blur y glow effect

### ⚡ Efecto Voltage (Botones IA)
- Rayo azul horizontal en hover
- Rayo dorado vertical en hover
- Glow effect intensificado
- Sombras dinámicas

## Reglas de Uso / Usage Rules

### ✅ Usar Para / Use For:
- **Decorativos:** Navegación y selección de idioma
- **Voltage:** Funciones de IA y CTA importantes
- **CTA:** Enlaces externos y acciones principales

### ❌ NO Mezclar / DON'T Mix:
- Clases de diferentes tipos de botones
- Efectos decorativos en botones funcionales de IA
- Border-radius inconsistentes

## Consistencia Visual / Visual Consistency

La implementación garantiza:
- Separación clara de responsabilidades entre tipos
- Sin conflictos de estilos CSS
- Experiencia visual profesional y cohesiva
- Accesibilidad mantenida en todos los tipos

The implementation ensures:
- Clear separation of responsibilities between types
- No CSS style conflicts
- Professional and cohesive visual experience
- Accessibility maintained across all types