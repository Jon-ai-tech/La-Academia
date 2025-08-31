/**
 * ============== LA ACADEMIA UNIFIED CONTROLLER ==============
 * Central control system for audio-visual experience
 * Replaces multiple conflicting systems with a single, optimized solution
 */

class LaAcademiaController {
    constructor() {
        this.components = {
            audio: null,
            scroll: null,
            motoScroll: null,
            animations: null,
            cursor: null
        };
        
        this.state = {
            initialized: false,
            audioEnabled: true,
            scrollEnabled: true,
            animationsEnabled: !this.prefersReducedMotion(),
            userInteracted: false
        };
        
        this.init();
    }
    
    async init() {
        console.log('🎯 Initializing La Academia Unified Controller...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            await this.setup();
        }
    }
    
    async setup() {
        try {
            // Initialize components in order
            await this.initializeAudio();
            await this.initializeScrollSystem();
            await this.initializeMotoScroll();
            await this.initializeAnimations();
            await this.initializeCursor();
            
            // Setup event handlers
            this.setupEventHandlers();
            
            // Setup user interaction detection
            this.setupUserInteraction();
            
            this.state.initialized = true;
            console.log('✅ La Academia Controller initialized successfully');
            
            // Dispatch ready event
            window.dispatchEvent(new CustomEvent('laacademia:ready', {
                detail: { controller: this }
            }));
            
        } catch (error) {
            console.error('❌ Failed to initialize La Academia Controller:', error);
        }
    }
    
    async initializeAudio() {
        if (window.UnifiedAudio) {
            this.components.audio = new UnifiedAudio({
                volume: 0.7,
                enabled: this.state.audioEnabled
            });
        }
    }
    
    async initializeScrollSystem() {
        // Basic scroll handling - will be enhanced with locomotive if available
        this.components.scroll = {
            handlers: new Map(),
            
            on: (event, callback) => {
                if (!this.components.scroll.handlers.has(event)) {
                    this.components.scroll.handlers.set(event, []);
                }
                this.components.scroll.handlers.get(event).push(callback);
            },
            
            emit: (event, data) => {
                const handlers = this.components.scroll.handlers.get(event) || [];
                handlers.forEach(handler => handler(data));
            }
        };
        
        // Setup basic scroll handling
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    async initializeMotoScroll() {
        if (window.MotoScrollSystem) {
            this.components.motoScroll = new MotoScrollSystem({
                container: document.querySelector('.moto-scroll-container'),
                enabled: this.state.scrollEnabled
            });
        }
    }
    
    async initializeAnimations() {
        if (!this.state.animationsEnabled) return;
        
        this.components.animations = {
            activeAnimations: new Set(),
            
            // Basic animation system
            addAnimation: (element, animation) => {
                this.components.animations.activeAnimations.add({element, animation});
            },
            
            // Cleanup animations
            cleanup: () => {
                this.components.animations.activeAnimations.clear();
            }
        };
    }
    
    async initializeCursor() {
        if (!this.state.animationsEnabled) return;
        
        this.components.cursor = {
            element: null,
            init: () => {
                // Simple cursor enhancement
                const cursor = document.createElement('div');
                cursor.className = 'unified-cursor';
                cursor.style.cssText = `
                    position: fixed;
                    width: 20px;
                    height: 20px;
                    border: 2px solid #FFC777;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    mix-blend-mode: difference;
                    transform: translate(-50%, -50%);
                    transition: transform 0.1s ease;
                    display: none;
                `;
                document.body.appendChild(cursor);
                this.components.cursor.element = cursor;
                
                // Show on non-touch devices
                if (!('ontouchstart' in window)) {
                    document.addEventListener('mousemove', (e) => {
                        cursor.style.display = 'block';
                        cursor.style.left = e.clientX + 'px';
                        cursor.style.top = e.clientY + 'px';
                    });
                }
            }
        };
        
        this.components.cursor.init();
    }
    
    handleScroll() {
        const scrollY = window.scrollY;
        const scrollPercent = scrollY / (document.body.scrollHeight - window.innerHeight);
        
        // Emit scroll events
        this.components.scroll.emit('scroll', {
            y: scrollY,
            percent: scrollPercent,
            direction: this.lastScrollY > scrollY ? 'up' : 'down'
        });
        
        this.lastScrollY = scrollY;
        
        // Update moto scroll if present
        if (this.components.motoScroll && this.components.motoScroll.update) {
            this.components.motoScroll.update(scrollPercent);
        }
    }
    
    setupEventHandlers() {
        // Global event handlers for the unified system
        
        // Handle visibility changes for performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAllSystems();
            } else {
                this.resumeAllSystems();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', this.throttle(() => {
            this.handleResize();
        }, 250));
    }
    
    setupUserInteraction() {
        const handleFirstInteraction = () => {
            if (!this.state.userInteracted) {
                this.state.userInteracted = true;
                console.log('🎵 User interaction detected - enabling audio systems');
                
                // Enable audio systems after user interaction
                if (this.components.audio && this.components.audio.enable) {
                    this.components.audio.enable();
                }
                
                // Remove event listeners after first interaction
                document.removeEventListener('click', handleFirstInteraction);
                document.removeEventListener('touchstart', handleFirstInteraction);
                document.removeEventListener('keydown', handleFirstInteraction);
                
                // Dispatch interaction event
                window.dispatchEvent(new CustomEvent('laacademia:userInteraction'));
            }
        };
        
        // Listen for first user interaction
        document.addEventListener('click', handleFirstInteraction, { once: true });
        document.addEventListener('touchstart', handleFirstInteraction, { once: true });
        document.addEventListener('keydown', handleFirstInteraction, { once: true });
    }
    
    handleResize() {
        // Handle resize for all components
        Object.values(this.components).forEach(component => {
            if (component && component.handleResize) {
                component.handleResize();
            }
        });
    }
    
    pauseAllSystems() {
        Object.values(this.components).forEach(component => {
            if (component && component.pause) {
                component.pause();
            }
        });
    }
    
    resumeAllSystems() {
        Object.values(this.components).forEach(component => {
            if (component && component.resume) {
                component.resume();
            }
        });
    }
    
    // Utility methods
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    
    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }
    
    // Public API
    toggleAudio() {
        this.state.audioEnabled = !this.state.audioEnabled;
        if (this.components.audio && this.components.audio.toggle) {
            this.components.audio.toggle();
        }
        return this.state.audioEnabled;
    }
    
    setVolume(volume) {
        if (this.components.audio && this.components.audio.setVolume) {
            this.components.audio.setVolume(volume);
        }
    }
    
    triggerEffect(effectName, options = {}) {
        // Trigger various effects through the unified system
        switch (effectName) {
            case 'particleBurst':
                console.log('🎆 Particle burst triggered', options);
                break;
            case 'audioReactive':
                if (this.components.audio) {
                    console.log('🎵 Audio reactive effect triggered', options);
                }
                break;
            default:
                console.log(`✨ Effect '${effectName}' triggered`, options);
        }
    }
    
    destroy() {
        // Cleanup all components
        Object.values(this.components).forEach(component => {
            if (component && component.destroy) {
                component.destroy();
            }
        });
        
        console.log('🧹 La Academia Controller destroyed');
    }
}

// Initialize the unified controller
window.laAcademiaController = new LaAcademiaController();

// Global API for external access
window.laAcademia = {
    toggleAudio: () => window.laAcademiaController.toggleAudio(),
    setVolume: (volume) => window.laAcademiaController.setVolume(volume),
    triggerEffect: (effect, options) => window.laAcademiaController.triggerEffect(effect, options),
    getController: () => window.laAcademiaController
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LaAcademiaController;
}