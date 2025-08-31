/**
 * Minimal GSAP-like animation library for Genesis animation
 * Provides basic timeline and animation functionality
 */

class MinimalGSAP {
    static timeline(options = {}) {
        return new Timeline(options);
    }

    static set(targets, vars) {
        const elements = this.getElements(targets);
        elements.forEach(el => {
            this.applyStyles(el, vars);
        });
        return this;
    }

    static to(targets, vars) {
        const elements = this.getElements(targets);
        const duration = (vars.duration || 1) * 1000;
        
        elements.forEach(el => {
            this.animate(el, vars, duration);
        });
        
        return this;
    }

    static fromTo(targets, fromVars, toVars) {
        this.set(targets, fromVars);
        return this.to(targets, toVars);
    }

    static getElements(selector) {
        if (typeof selector === 'string') {
            return Array.from(document.querySelectorAll(selector));
        }
        return Array.isArray(selector) ? selector.flatMap(s => this.getElements(s)) : [selector];
    }

    static applyStyles(element, vars) {
        Object.keys(vars).forEach(prop => {
            if (prop === 'opacity') {
                element.style.opacity = vars[prop];
            } else if (prop === 'scale') {
                element.style.transform = `scale(${vars[prop]})`;
            } else if (prop === 'x') {
                const current = element.style.transform || '';
                element.style.transform = current.replace(/translateX\([^)]*\)/, '') + ` translateX(${vars[prop]})`;
            } else if (prop === 'y') {
                const current = element.style.transform || '';
                element.style.transform = current.replace(/translateY\([^)]*\)/, '') + ` translateY(${vars[prop]})`;
            }
        });
    }

    static animate(element, vars, duration) {
        const startTime = performance.now();
        const startStyles = this.getCurrentStyles(element);
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Apply easing (simple ease-out)
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            
            Object.keys(vars).forEach(prop => {
                if (prop === 'duration' || prop === 'onUpdate') return;
                
                if (prop === 'opacity') {
                    const start = startStyles.opacity || 1;
                    const target = vars[prop];
                    element.style.opacity = start + (target - start) * easedProgress;
                } else if (prop === 'scale') {
                    const start = startStyles.scale || 1;
                    const target = vars[prop];
                    const current = start + (target - start) * easedProgress;
                    element.style.transform = `scale(${current})`;
                }
            });

            if (vars.onUpdate) vars.onUpdate.call({ progress: () => easedProgress });
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    static getCurrentStyles(element) {
        const computed = getComputedStyle(element);
        return {
            opacity: parseFloat(computed.opacity) || 1,
            scale: 1 // Default scale
        };
    }

    static registerPlugin() {
        // ScrollTrigger mock - for now just return true
        return true;
    }
}

class Timeline {
    constructor(options = {}) {
        this.options = options;
        this.animations = [];
        this.setupScrollTrigger();
    }

    setupScrollTrigger() {
        if (!this.options.scrollTrigger) return;

        const trigger = this.options.scrollTrigger;
        const element = document.querySelector(trigger.trigger);
        
        if (!element) return;

        let ticking = false;
        
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const rect = element.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    const elementHeight = element.offsetHeight;
                    
                    // Calculate scroll progress
                    const scrollProgress = Math.max(0, Math.min(1, 
                        (windowHeight - rect.top) / (windowHeight + elementHeight)
                    ));
                    
                    this.progress(scrollProgress);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll);
        onScroll(); // Initial call
    }

    to(targets, vars, position = "+=0") {
        this.animations.push({ type: 'to', targets, vars, position });
        return this;
    }

    set(targets, vars) {
        MinimalGSAP.set(targets, vars);
        return this;
    }

    fromTo(targets, fromVars, toVars, position = "+=0") {
        this.animations.push({ type: 'fromTo', targets, fromVars, toVars, position });
        return this;
    }

    progress(value) {
        // Simple progress implementation - execute animations based on scroll progress
        const totalAnimations = this.animations.length;
        const animationsToExecute = Math.floor(value * totalAnimations);
        
        this.animations.forEach((anim, index) => {
            const animProgress = Math.max(0, Math.min(1, (value * totalAnimations) - index));
            
            if (animProgress > 0) {
                if (anim.type === 'to') {
                    this.executeAnimation(anim.targets, anim.vars, animProgress);
                } else if (anim.type === 'fromTo') {
                    this.executeFromToAnimation(anim.targets, anim.fromVars, anim.toVars, animProgress);
                }
            }
        });
    }

    executeAnimation(targets, vars, progress) {
        const elements = MinimalGSAP.getElements(targets);
        
        elements.forEach(el => {
            Object.keys(vars).forEach(prop => {
                if (prop === 'duration') return;
                
                if (prop === 'opacity') {
                    const current = parseFloat(el.style.opacity || 1);
                    const target = vars[prop];
                    el.style.opacity = current + (target - current) * progress;
                } else if (prop === 'scale') {
                    const target = vars[prop];
                    el.style.transform = `scale(${progress * target})`;
                } else if (prop === 'x') {
                    if (typeof vars[prop] === 'string') {
                        el.style.transform = `translateX(${vars[prop]})`;
                    }
                } else if (prop === 'y') {
                    const target = parseFloat(vars[prop]) || 0;
                    el.style.transform = `translateY(${target * progress}px)`;
                }
            });
        });
    }

    executeFromToAnimation(targets, fromVars, toVars, progress) {
        const elements = MinimalGSAP.getElements(targets);
        
        elements.forEach(el => {
            Object.keys(toVars).forEach(prop => {
                if (prop === 'duration') return;
                
                const fromValue = fromVars[prop] || 0;
                const toValue = toVars[prop];
                
                if (prop === 'opacity') {
                    el.style.opacity = fromValue + (toValue - fromValue) * progress;
                } else if (prop === 'scale') {
                    const currentScale = fromValue + (toValue - fromValue) * progress;
                    el.style.transform = `scale(${currentScale})`;
                } else if (prop === 'y') {
                    const currentY = fromValue + (toValue - fromValue) * progress;
                    el.style.transform = `translateY(${currentY}px)`;
                }
            });
        });
    }
}

// Export to global scope
window.gsap = MinimalGSAP;
window.ScrollTrigger = { /* mock */ };

// For compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MinimalGSAP;
}