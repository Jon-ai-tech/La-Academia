/**
 * ============== DOG STUDIO INTERACTIONS ============== 
 * Advanced cursor and UI sound effects inspired by Dog Studio
 * Premium interaction feedback for La Academia
 */

class DogStudioInteractions {
    constructor(audioSystem, particleSystem = null) {
        this.audioSystem = audioSystem;
        this.particleSystem = particleSystem;
        
        // Sound configuration
        this.sounds = {
            hover: {
                frequency: 800,
                duration: 150,
                volume: 0.3,
                type: 'sine'
            },
            click: {
                frequency: 400,
                duration: 200,
                volume: 0.5,
                type: 'square'
            },
            transition: {
                frequency: 600,
                duration: 300,
                volume: 0.4,
                type: 'sawtooth'
            },
            success: {
                frequencies: [440, 554, 659],
                duration: 500,
                volume: 0.6,
                type: 'sine'
            }
        };
        
        // Cursor states
        this.cursorState = 'normal';
        this.cursorElement = null;
        this.magneticElements = new Set();
        
        // Performance tracking
        this.soundCooldowns = new Map();
        this.lastHoverTime = 0;
        
        this.init();
    }

    init() {
        this.createAdvancedCursor();
        this.setupInteractiveElements();
        this.setupSoundTriggers();
        this.createAudioVisualizer();
        
        console.log('✨ DogStudioInteractions initialized');
    }

    // Create intelligent cursor system
    createAdvancedCursor() {
        // Skip on touch devices
        if (this.isTouchDevice()) return;
        
        this.cursorElement = document.createElement('div');
        this.cursorElement.className = 'dog-studio-cursor';
        this.cursorElement.innerHTML = `
            <div class="cursor-core"></div>
            <div class="cursor-ring"></div>
            <div class="cursor-trail"></div>
        `;
        
        document.body.appendChild(this.cursorElement);
        
        // Position tracking
        let mousePos = { x: 0, y: 0 };
        let cursorPos = { x: 0, y: 0 };
        
        document.addEventListener('mousemove', (e) => {
            mousePos.x = e.clientX;
            mousePos.y = e.clientY;
            
            // Update cursor state based on target
            this.updateCursorState(e.target);
        });
        
        // Smooth cursor following
        const updateCursor = () => {
            const speed = 0.15;
            cursorPos.x += (mousePos.x - cursorPos.x) * speed;
            cursorPos.y += (mousePos.y - cursorPos.y) * speed;
            
            this.cursorElement.style.transform = `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`;
            
            requestAnimationFrame(updateCursor);
        };
        updateCursor();
    }

    // Update cursor based on hover target
    updateCursorState(target) {
        const isInteractive = target.matches('button, a, [role="button"], .voltage-button, .decorative-btn, .influencer-card, input, textarea, select');
        const isText = target.matches('p, h1, h2, h3, h4, h5, h6, span, div[contenteditable]');
        
        let newState = 'normal';
        
        if (isInteractive) {
            newState = 'interactive';
        } else if (isText) {
            newState = 'text';
        }
        
        if (newState !== this.cursorState) {
            this.cursorState = newState;
            this.cursorElement.className = `dog-studio-cursor ${newState}`;
            
            // Play hover sound for interactive elements
            if (newState === 'interactive') {
                this.playHoverSound();
            }
        }
    }

    // Setup interactive elements
    setupInteractiveElements() {
        // Enhanced button interactions
        document.querySelectorAll('button, .voltage-button, .decorative-btn').forEach(btn => {
            this.enhanceButton(btn);
        });
        
        // Enhanced card interactions
        document.querySelectorAll('.influencer-card, .simple-influencer-card').forEach(card => {
            this.enhanceCard(card);
        });
        
        // Enhanced form interactions
        document.querySelectorAll('input, textarea, select').forEach(field => {
            this.enhanceFormField(field);
        });
        
        // Enhanced navigation
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            this.enhanceNavLink(link);
        });
    }

    // Enhance button with Dog Studio effects
    enhanceButton(button) {
        // Add magnetic effect for AI buttons
        if (button.classList.contains('voltage-button')) {
            this.addMagneticEffect(button);
        }
        
        button.addEventListener('mouseenter', () => {
            this.playHoverSound();
            this.addGlowEffect(button);
            
            // Particle burst for special buttons
            if (button.classList.contains('electric-cta') || button.classList.contains('voltage-button')) {
                this.createInteractionParticles(button, 'hover');
            }
        });
        
        button.addEventListener('mouseleave', () => {
            this.removeGlowEffect(button);
        });
        
        button.addEventListener('click', () => {
            this.playClickSound();
            this.addClickRipple(button);
            this.createInteractionParticles(button, 'click');
        });
    }

    // Enhance card interactions
    enhanceCard(card) {
        card.addEventListener('mouseenter', () => {
            this.playHoverSound();
            this.add3DLift(card);
            this.createInteractionParticles(card, 'hover', 3);
        });
        
        card.addEventListener('mouseleave', () => {
            this.remove3DLift(card);
        });
        
        card.addEventListener('click', (e) => {
            this.playClickSound();
            this.createInteractionParticles(card, 'click', 8);
        });
    }

    // Enhance form fields
    enhanceFormField(field) {
        field.addEventListener('focus', () => {
            this.playTransitionSound();
            this.addFocusGlow(field);
        });
        
        field.addEventListener('blur', () => {
            this.removeFocusGlow(field);
        });
        
        field.addEventListener('input', () => {
            // Subtle feedback on typing
            if (Math.random() < 0.1) { // Only occasionally
                this.createTypingParticle(field);
            }
        });
    }

    // Enhance navigation links
    enhanceNavLink(link) {
        link.addEventListener('mouseenter', () => {
            this.playHoverSound();
        });
        
        link.addEventListener('click', () => {
            this.playTransitionSound();
        });
    }

    // Add magnetic effect to premium elements
    addMagneticEffect(element) {
        this.magneticElements.add(element);
        
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const strength = 0.3;
            const transformX = x * strength;
            const transformY = y * strength;
            
            element.style.transform = `translate(${transformX}px, ${transformY}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
        });
    }

    // Sound generation methods
    playHoverSound() {
        if (this.shouldThrottleSound('hover', 100)) return;
        this.generateUISound(this.sounds.hover);
    }
    
    playClickSound() {
        this.generateUISound(this.sounds.click);
    }
    
    playTransitionSound() {
        this.generateUISound(this.sounds.transition);
    }
    
    playSuccessSound() {
        this.generateHarmony(this.sounds.success);
    }

    // Generate UI sound using Web Audio API
    generateUISound(config) {
        if (!this.audioSystem || !this.audioSystem.context) return;
        
        const ctx = this.audioSystem.context;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(config.frequency, ctx.currentTime);
        oscillator.type = config.type;
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(config.volume, ctx.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + config.duration / 1000);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + config.duration / 1000);
    }

    // Generate harmony for success sounds
    generateHarmony(config) {
        if (!this.audioSystem || !this.audioSystem.context) return;
        
        config.frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.generateUISound({
                    ...config,
                    frequency: freq,
                    duration: config.duration - (index * 50)
                });
            }, index * 100);
        });
    }

    // Visual effects methods
    addGlowEffect(element) {
        element.classList.add('dog-studio-glow');
    }
    
    removeGlowEffect(element) {
        element.classList.remove('dog-studio-glow');
    }
    
    addFocusGlow(element) {
        element.classList.add('dog-studio-focus');
    }
    
    removeFocusGlow(element) {
        element.classList.remove('dog-studio-focus');
    }
    
    add3DLift(element) {
        element.classList.add('dog-studio-lift');
    }
    
    remove3DLift(element) {
        element.classList.remove('dog-studio-lift');
    }

    // Create click ripple effect
    addClickRipple(element) {
        const ripple = document.createElement('div');
        ripple.className = 'dog-studio-ripple';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (rect.width - size) / 2 + 'px';
        ripple.style.top = (rect.height - size) / 2 + 'px';
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    // Create interaction particles
    createInteractionParticles(element, type, count = 5) {
        if (!this.particleSystem) return;
        
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        // Use different colors based on interaction type
        const colors = {
            hover: '#FFC777', // Aurora gold
            click: '#58A6FF',  // Cosmos blue
            success: '#C792EA' // Mystic violet
        };
        
        for (let i = 0; i < count; i++) {
            this.particleSystem.createParticle(
                x + (Math.random() - 0.5) * rect.width,
                y + (Math.random() - 0.5) * rect.height,
                type,
                colors[type] || colors.hover
            );
        }
    }

    // Create typing particle effect
    createTypingParticle(field) {
        if (!this.particleSystem) return;
        
        const rect = field.getBoundingClientRect();
        const x = rect.left + rect.width * 0.8;
        const y = rect.top + rect.height / 2;
        
        this.particleSystem.createParticle(x, y, 'typing', '#C792EA');
    }

    // Create audio visualizer
    createAudioVisualizer() {
        const visualizer = document.createElement('div');
        visualizer.className = 'audio-visualizer';
        visualizer.innerHTML = `
            <div class="visualizer-bars">
                ${Array.from({length: 5}, () => '<div class="bar"></div>').join('')}
            </div>
        `;
        
        // Position in corner
        visualizer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 40px;
            z-index: 1000;
            opacity: 0.7;
            pointer-events: none;
        `;
        
        document.body.appendChild(visualizer);
        
        // Animate bars based on audio
        if (this.audioSystem) {
            this.audioSystem.on('audioAnalysis', (data) => {
                this.updateVisualizer(visualizer, data);
            });
        }
    }

    // Update audio visualizer
    updateVisualizer(visualizer, audioData) {
        const bars = visualizer.querySelectorAll('.bar');
        const { frequencies } = audioData;
        
        // Map frequencies to bars
        const values = [
            frequencies.bass || 0,
            frequencies.bass * 0.8 + frequencies.mid * 0.2 || 0,
            frequencies.mid || 0,
            frequencies.mid * 0.2 + frequencies.treble * 0.8 || 0,
            frequencies.treble || 0
        ];
        
        bars.forEach((bar, index) => {
            const height = Math.max(2, values[index] * 30);
            bar.style.height = height + 'px';
        });
    }

    // Utility methods
    shouldThrottleSound(soundType, cooldownMs) {
        const now = Date.now();
        const lastTime = this.soundCooldowns.get(soundType) || 0;
        
        if (now - lastTime < cooldownMs) {
            return true;
        }
        
        this.soundCooldowns.set(soundType, now);
        return false;
    }
    
    isTouchDevice() {
        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    }

    // Public API
    setVolume(volume) {
        Object.keys(this.sounds).forEach(key => {
            if (this.sounds[key].volume !== undefined) {
                this.sounds[key].volume = this.sounds[key].volume * volume;
            }
        });
    }

    toggleSounds() {
        this.soundsEnabled = !this.soundsEnabled;
    }

    destroy() {
        // Remove cursor
        if (this.cursorElement) {
            this.cursorElement.remove();
        }
        
        // Remove visualizer
        const visualizer = document.querySelector('.audio-visualizer');
        if (visualizer) visualizer.remove();
        
        // Clear magnetic elements
        this.magneticElements.clear();
        
        console.log('✨ DogStudioInteractions destroyed');
    }
}

// Add required CSS for Dog Studio effects
if (!document.querySelector('#dog-studio-styles')) {
    const style = document.createElement('style');
    style.id = 'dog-studio-styles';
    style.textContent = `
        /* Advanced Cursor */
        .dog-studio-cursor {
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transition: transform 0.1s ease;
        }
        
        .cursor-core {
            width: 8px;
            height: 8px;
            background: #FFC777;
            border-radius: 50%;
            transform: translate(-50%, -50%);
        }
        
        .cursor-ring {
            position: absolute;
            width: 24px;
            height: 24px;
            border: 1px solid #FFC777;
            border-radius: 50%;
            top: -12px;
            left: -12px;
            opacity: 0.5;
            transition: all 0.2s ease;
        }
        
        .dog-studio-cursor.interactive .cursor-ring {
            width: 40px;
            height: 40px;
            top: -20px;
            left: -20px;
            border-color: #58A6FF;
        }
        
        .dog-studio-cursor.text .cursor-ring {
            width: 2px;
            height: 20px;
            border-radius: 0;
            border-left: 2px solid #C792EA;
            border-right: none;
            border-top: none;
            border-bottom: none;
            top: -10px;
            left: -1px;
        }
        
        /* Interactive Effects */
        .dog-studio-glow {
            box-shadow: 0 0 20px rgba(255, 199, 119, 0.4) !important;
            transition: box-shadow 0.3s ease !important;
        }
        
        .dog-studio-focus {
            box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.3) !important;
            border-color: #58A6FF !important;
        }
        
        .dog-studio-lift {
            transform: translateY(-5px) scale(1.02) !important;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2) !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        /* Ripple Effect */
        .dog-studio-ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 199, 119, 0.3);
            animation: ripple-expand 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-expand {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(1);
                opacity: 0;
            }
        }
        
        /* Audio Visualizer */
        .audio-visualizer {
            backdrop-filter: blur(10px);
            background: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            padding: 8px;
        }
        
        .visualizer-bars {
            display: flex;
            align-items: end;
            gap: 3px;
            height: 24px;
        }
        
        .visualizer-bars .bar {
            width: 8px;
            background: linear-gradient(180deg, #FFC777, #58A6FF);
            border-radius: 2px;
            transition: height 0.1s ease;
            min-height: 2px;
        }
        
        /* Reduce motion support */
        @media (prefers-reduced-motion: reduce) {
            .dog-studio-cursor,
            .dog-studio-glow,
            .dog-studio-focus,
            .dog-studio-lift,
            .visualizer-bars .bar {
                transition: none !important;
            }
            
            .dog-studio-ripple {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// Export for use
window.DogStudioInteractions = DogStudioInteractions;