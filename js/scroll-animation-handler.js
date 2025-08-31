/**
 * ============== SCROLL ANIMATION HANDLER ==============
 * Handles scroll-triggered animations for the professional animation system
 */

class ScrollAnimationHandler {
    constructor() {
        this.observers = new Map();
        this.animatedElements = new Set();
        
        this.init();
    }
    
    init() {
        // Create intersection observer for scroll animations
        this.createObserver();
        
        // Setup elements for scroll animations
        this.setupScrollAnimations();
        
        console.log('🎬 Scroll Animation Handler initialized');
    }
    
    createObserver() {
        // Create intersection observer with proper options
        const observerOptions = {
            root: null,
            rootMargin: '-10% 0px -10% 0px', // Trigger when 10% visible
            threshold: [0, 0.1, 0.5, 1.0]
        };
        
        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.triggerAnimation(entry.target);
                }
            });
        }, observerOptions);
    }
    
    setupScrollAnimations() {
        // Find all elements with scroll animation classes
        const animationSelectors = [
            '.appear-on-scroll',
            '.appear-from-left',
            '.appear-from-right',
            '.scale-in',
            '.stagger-children'
        ];
        
        animationSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // Add element to observer
                this.scrollObserver.observe(element);
                
                // Store original state
                if (!element.dataset.animationReady) {
                    element.dataset.animationReady = 'true';
                    
                    // Add will-change for better performance
                    element.style.willChange = 'transform, opacity';
                }
            });
        });
        
        console.log(`🎬 Setup ${document.querySelectorAll(animationSelectors.join(', ')).length} animated elements`);
    }
    
    triggerAnimation(element) {
        if (this.animatedElements.has(element)) return;
        
        this.animatedElements.add(element);
        
        // Add the 'is-visible' class to trigger CSS animations
        element.classList.add('is-visible');
        
        // Handle special cases
        if (element.classList.contains('stagger-children')) {
            this.handleStaggerAnimation(element);
        }
        
        // Clean up will-change after animation
        setTimeout(() => {
            element.style.willChange = 'auto';
        }, 1000);
        
        // Trigger audio feedback if available
        if (window.unifiedAudio) {
            window.unifiedAudio.playUISound('notification');
        }
    }
    
    handleStaggerAnimation(container) {
        const children = container.children;
        
        Array.from(children).forEach((child, index) => {
            // Add a small delay for stagger effect
            setTimeout(() => {
                child.classList.add('is-visible');
            }, index * 100);
        });
    }
    
    // Public API
    refreshAnimations() {
        // Re-setup animations for dynamically added content
        this.setupScrollAnimations();
    }
    
    triggerElementAnimation(element) {
        if (element) {
            this.triggerAnimation(element);
        }
    }
    
    destroy() {
        // Disconnect all observers
        if (this.scrollObserver) {
            this.scrollObserver.disconnect();
        }
        
        // Clear references
        this.animatedElements.clear();
        this.observers.clear();
        
        console.log('🧹 Scroll Animation Handler destroyed');
    }
}

// Initialize scroll animations when the unified controller is ready
window.addEventListener('laacademia:ready', () => {
    window.scrollAnimationHandler = new ScrollAnimationHandler();
});

// Fallback initialization if unified controller isn't available
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (!window.scrollAnimationHandler) {
            console.log('🎬 Fallback: Initializing scroll animations without unified controller');
            window.scrollAnimationHandler = new ScrollAnimationHandler();
        }
    }, 100);
});

// Make available globally
window.ScrollAnimationHandler = ScrollAnimationHandler;