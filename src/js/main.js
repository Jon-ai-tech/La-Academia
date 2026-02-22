/* ============== MAIN LOCOMOTIVE-STYLE APPLICATION ============== */

import SmoothScrollManager from './locomotive-scroll.js';
import ThreeJSManager from './3d-animations.js';
import CursorEffects from './cursor-effects.js';
import ParticleSystem from './particle-system.js';

class LocomotiveApp {
    constructor() {
        this.scrollManager = null;
        this.threeJSManager = null;
        this.cursorEffects = null;
        this.particleSystem = null;
        this.isReduced = this.prefersReducedMotion();
        
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupApplication();
            });
        } else {
            this.setupApplication();
        }
    }

    setupApplication() {
        // Check for reduced motion preferences
        if (this.isReduced) {
            console.log('Reduced motion detected, skipping advanced animations');
            this.setupBasicFeatures();
            return;
        }

        // Initialize all systems
        this.setupScrollContainer();
        this.initializeSmoothScroll();
        this.initializeThreeJS();
        this.initializeCursor();
        this.initializeParticles();
        this.setupEnhancedInteractions();
        this.setupScrollToTop();
        
        // Load existing app.js functionality
        this.loadExistingFeatures();

        console.log('🎯 Locomotive-style app initialized successfully!');
    }

    setupScrollContainer() {
        // Add scroll container attribute to main content
        const main = document.querySelector('main');
        if (main) {
            main.setAttribute('data-scroll-container', '');
        }

        // Add scroll attributes to sections
        document.querySelectorAll('section').forEach((section, index) => {
            section.setAttribute('data-scroll', '');
            section.setAttribute('data-scroll-speed', index % 2 === 0 ? '1' : '2');
            section.classList.add('appear-element');
        });

        // Add scroll attributes to cards
        document.querySelectorAll('.influencer-card').forEach((card, index) => {
            card.setAttribute('data-scroll', '');
            card.classList.add('stagger-element');
        });
    }

    initializeSmoothScroll() {
        try {
            this.scrollManager = new SmoothScrollManager();
        } catch (error) {
            console.warn('Smooth scroll initialization failed:', error);
        }
    }

    initializeThreeJS() {
        try {
            // Create a background container for Three.js
            const threeContainer = document.createElement('div');
            threeContainer.id = 'three-background';
            threeContainer.style.position = 'fixed';
            threeContainer.style.top = '0';
            threeContainer.style.left = '0';
            threeContainer.style.width = '100%';
            threeContainer.style.height = '100%';
            threeContainer.style.zIndex = '1';
            threeContainer.style.pointerEvents = 'none';
            
            document.body.insertBefore(threeContainer, document.body.firstChild);
            
            this.threeJSManager = new ThreeJSManager(threeContainer);
        } catch (error) {
            console.warn('Three.js initialization failed:', error);
        }
    }

    initializeCursor() {
        try {
            this.cursorEffects = new CursorEffects();
            
            // Add magnetic effect to buttons
            document.querySelectorAll('.decorative-btn, .cta-button, .voltage-button').forEach(btn => {
                this.cursorEffects.addMagneticEffect(btn);
            });
        } catch (error) {
            console.warn('Cursor effects initialization failed:', error);
        }
    }

    initializeParticles() {
        try {
            this.particleSystem = new ParticleSystem();
            this.particleSystem.addMouseInteraction();
            this.particleSystem.addScrollInteraction();
        } catch (error) {
            console.warn('Particle system initialization failed:', error);
        }
    }

    setupEnhancedInteractions() {
        // Enhanced button interactions
        document.querySelectorAll('.decorative-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (this.particleSystem) {
                    this.particleSystem.burst(e.clientX, e.clientY, 8);
                }
            });
        });

        // Enhanced card interactions
        document.querySelectorAll('.influencer-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('hover-3d');
            });

            card.addEventListener('mouseleave', () => {
                card.classList.remove('hover-3d');
            });

            card.addEventListener('click', (e) => {
                if (this.particleSystem) {
                    this.particleSystem.burst(e.clientX, e.clientY, 5);
                }
            });
        });

        // Glow effects for interactive elements
        document.querySelectorAll('button, .cta-button, .api-button').forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.classList.add('glow-pulse');
            });

            element.addEventListener('mouseleave', () => {
                element.classList.remove('glow-pulse');
            });
        });
    }

    setupScrollToTop() {
        const scrollBtn = document.getElementById('scrollToTopBtn');
        if (scrollBtn) {
            scrollBtn.classList.add('scroll-to-top-btn');
            
            // Enhanced scroll to top functionality
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        scrollBtn.classList.remove('show');
                    } else {
                        scrollBtn.classList.add('show');
                    }
                });
            });

            const firstSection = document.querySelector('section');
            if (firstSection) {
                observer.observe(firstSection);
            }

            scrollBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.scrollManager && this.scrollManager.scroll) {
                    this.scrollManager.scroll.scrollTo(0);
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                
                if (this.particleSystem) {
                    this.particleSystem.burst(e.clientX, e.clientY, 10);
                }
            });
        }
    }

    loadExistingFeatures() {
        // Load the existing app.js functionality
        if (window.originalAppCode) {
            try {
                eval(window.originalAppCode);
            } catch (error) {
                console.warn('Could not load existing features:', error);
            }
        }
    }

    setupBasicFeatures() {
        // Setup basic functionality for users who prefer reduced motion
        document.querySelectorAll('.influencer-card').forEach(card => {
            card.addEventListener('click', (e) => {
                card.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 100);
            });
        });

        this.setupScrollToTop();
        this.loadExistingFeatures();
    }

    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    destroy() {
        if (this.scrollManager) {
            this.scrollManager.destroy();
        }
        if (this.threeJSManager) {
            this.threeJSManager.destroy();
        }
        if (this.cursorEffects) {
            this.cursorEffects.destroy();
        }
        if (this.particleSystem) {
            this.particleSystem.destroy();
        }
    }

    // Public API for external interactions
    triggerParticleBurst(x, y, count = 5) {
        if (this.particleSystem && !this.isReduced) {
            this.particleSystem.burst(x, y, count);
        }
    }

    updateScroll() {
        if (this.scrollManager) {
            this.scrollManager.update();
        }
    }
}

// Initialize the application
const locomotiveApp = new LocomotiveApp();

// Export for global access
window.locomotiveApp = locomotiveApp;

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (locomotiveApp.particleSystem) {
            locomotiveApp.particleSystem.pause();
        }
    } else {
        if (locomotiveApp.particleSystem) {
            locomotiveApp.particleSystem.resume();
        }
    }
});

export default LocomotiveApp;