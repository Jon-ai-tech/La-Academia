/**
 * Apple-like Scroll Reveal System
 * Smooth fade-up animations with Intersection Observer for performance
 */

class ScrollRevealSystem {
    constructor() {
        this.options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }
    
    init() {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.showAllElements();
            return;
        }
        
        this.setupObserver();
        this.addRevealClasses();
    }
    
    setupObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.revealElement(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, this.options);
    }
    
    addRevealClasses() {
        // Add reveal classes to elements that should animate
        const selectors = [
            'section h2',
            'section h3',
            'section p',
            '.card',
            '.influencer-card',
            '.testimonial',
            '.feature',
            '.cta-section',
            '.form-container',
            '.video-container',
            '.maia-video-container'
        ];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, index) => {
                // Skip if already has reveal class or is inside journey animation
                if (element.classList.contains('reveal') || 
                    element.closest('#journey-animation-container')) {
                    return;
                }
                
                element.classList.add('reveal');
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                element.style.transitionDelay = `${Math.min(index * 0.1, 0.5)}s`;
                
                this.observer.observe(element);
            });
        });
    }
    
    revealElement(element) {
        // Use requestAnimationFrame for smooth animation
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            
            // Add revealed class for any additional styling
            element.classList.add('revealed');
        });
    }
    
    showAllElements() {
        // For users with reduced motion preference
        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            element.classList.add('revealed');
        });
    }
    
    // Method to manually reveal elements (for dynamic content)
    revealNewElements(container = document) {
        const newElements = container.querySelectorAll('.reveal:not(.revealed)');
        newElements.forEach(element => {
            this.observer.observe(element);
        });
    }
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

/**
 * Form Enhancement System
 * Loading states, success feedback, and Apple-like interactions
 */

class FormEnhancementSystem {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupFormHandlers();
        this.setupInputEnhancements();
    }
    
    setupFormHandlers() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(form);
            });
        });
    }
    
    setupInputEnhancements() {
        const inputs = document.querySelectorAll('input[type="email"], input[type="text"]');
        inputs.forEach(input => {
            // Enhanced focus states
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('input-focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('input-focused');
            });
            
            // Floating label effect (if needed)
            this.handlePlaceholder(input);
        });
    }
    
    handlePlaceholder(input) {
        const currentLang = document.documentElement.lang || 'es';
        const placeholder = input.getAttribute(`data-placeholder-${currentLang}`);
        if (placeholder) {
            input.placeholder = placeholder;
        }
    }
    
    async handleFormSubmit(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        this.showLoadingState(submitButton);
        
        try {
            // Simulate form submission (replace with actual API call)
            await this.simulateFormSubmission(form);
            
            // Show success state
            this.showSuccessState(submitButton);
            
            // Reset after delay
            setTimeout(() => {
                this.resetButtonState(submitButton, originalText);
            }, 3000);
            
        } catch (error) {
            // Show error state
            this.showErrorState(submitButton);
            
            // Reset after delay
            setTimeout(() => {
                this.resetButtonState(submitButton, originalText);
            }, 3000);
        }
    }
    
    showLoadingState(button) {
        button.classList.add('btn-loading');
        button.disabled = true;
        button.style.pointerEvents = 'none';
    }
    
    showSuccessState(button) {
        button.classList.remove('btn-loading');
        button.classList.add('btn-success');
        button.innerHTML = `
            <span class="lang-es">¡Enviado! ✓</span>
            <span class="lang-en hidden">Sent! ✓</span>
        `;
    }
    
    showErrorState(button) {
        button.classList.remove('btn-loading');
        button.classList.add('btn-error');
        button.innerHTML = `
            <span class="lang-es">Error. Intenta de nuevo</span>
            <span class="lang-en hidden">Error. Try again</span>
        `;
    }
    
    resetButtonState(button, originalText) {
        button.classList.remove('btn-loading', 'btn-success', 'btn-error');
        button.disabled = false;
        button.style.pointerEvents = 'auto';
        button.innerHTML = originalText;
    }
    
    async simulateFormSubmission(form) {
        // Simulate network delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success (90% success rate)
                if (Math.random() > 0.1) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Simulated network error'));
                }
            }, 2000);
        });
    }
}

/**
 * Performance Optimization System
 * Lazy loading, preloading, and performance monitoring
 */

class PerformanceOptimizationSystem {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupLazyLoading();
        this.preloadCriticalResources();
        this.monitorPerformance();
    }
    
    setupLazyLoading() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    preloadCriticalResources() {
        // Preload critical fonts and resources
        const criticalResources = [
            'https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mPbF4YW9aKk6Ls5W6w.woff2'
        ];
        
        criticalResources.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'font';
            link.type = 'font/woff2';
            link.crossOrigin = 'anonymous';
            link.href = url;
            document.head.appendChild(link);
        });
    }
    
    monitorPerformance() {
        // Monitor First Contentful Paint
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.name === 'first-contentful-paint') {
                        console.log(`First Contentful Paint: ${entry.startTime}ms`);
                        
                        // Check if we meet our performance target
                        if (entry.startTime < 1800) { // < 1.8s
                            console.log('✅ Performance target met!');
                        } else {
                            console.warn('⚠️ Performance target missed');
                        }
                    }
                });
            });
            
            observer.observe({ entryTypes: ['paint'] });
        }
    }
}

// Initialize all systems when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll reveal system
    window.scrollRevealSystem = new ScrollRevealSystem();
    
    // Initialize form enhancement system
    window.formEnhancementSystem = new FormEnhancementSystem();
    
    // Initialize performance optimization system
    window.performanceOptimizationSystem = new PerformanceOptimizationSystem();
    
    console.log('🍎 Apple-like design systems initialized');
});

// Update placeholders when language changes
document.addEventListener('languageChanged', () => {
    if (window.formEnhancementSystem) {
        const inputs = document.querySelectorAll('input[data-placeholder-es], input[data-placeholder-en]');
        inputs.forEach(input => {
            window.formEnhancementSystem.handlePlaceholder(input);
        });
    }
});