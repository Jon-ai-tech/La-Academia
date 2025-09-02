/**
 * Student Journey Animation - Apple-like GSAP Implementation
 * Four-act progression: Chaos → Clarity → Construction → Result
 */

class StudentJourneyAnimation {
    constructor() {
        this.currentAct = 0;
        this.totalActs = 4;
        this.isAnimating = false;
        this.autoPlayTimer = null;
        this.autoPlayDelay = 4000; // 4 seconds per act
        
        this.init();
    }
    
    init() {
        // Check if GSAP is available (using our minimal GSAP)
        if (typeof gsap === 'undefined' && typeof MinimalGSAP === 'undefined') {
            console.warn('GSAP not available, using fallback animations');
            this.initFallbackAnimation();
            return;
        }
        
        // Use MinimalGSAP if available, otherwise use full GSAP
        this.gsap = typeof gsap !== 'undefined' ? gsap : MinimalGSAP;
        
        this.setupIntersectionObserver();
        this.setupProgressDots();
        this.startAutoPlay();
    }
    
    setupIntersectionObserver() {
        const journeyContainer = document.getElementById('journey-animation-container');
        if (!journeyContainer) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.startAnimation();
                } else {
                    this.pauseAnimation();
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(journeyContainer);
    }
    
    setupProgressDots() {
        const dots = document.querySelectorAll('.progress-dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToAct(index);
            });
        });
    }
    
    startAutoPlay() {
        this.autoPlayTimer = setInterval(() => {
            if (!this.isAnimating) {
                this.nextAct();
            }
        }, this.autoPlayDelay);
    }
    
    pauseAnimation() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
        }
    }
    
    startAnimation() {
        this.goToAct(0);
        this.startAutoPlay();
    }
    
    nextAct() {
        const nextAct = (this.currentAct + 1) % this.totalActs;
        this.goToAct(nextAct);
    }
    
    goToAct(actIndex) {
        if (this.isAnimating || actIndex === this.currentAct) return;
        
        this.isAnimating = true;
        this.currentAct = actIndex;
        
        // Update progress dots
        this.updateProgressDots();
        
        // Hide all acts first
        this.hideAllActs().then(() => {
            // Show the selected act
            switch (actIndex) {
                case 0:
                    this.animateAct1Chaos();
                    break;
                case 1:
                    this.animateAct2Clarity();
                    break;
                case 2:
                    this.animateAct3Construction();
                    break;
                case 3:
                    this.animateAct4Result();
                    break;
            }
        });
    }
    
    hideAllActs() {
        const acts = document.querySelectorAll('.journey-act');
        const promises = [];
        
        acts.forEach(act => {
            if (this.gsap.to) {
                promises.push(new Promise(resolve => {
                    this.gsap.to(act, {
                        opacity: 0,
                        duration: 0.3,
                        onComplete: resolve
                    });
                }));
            } else {
                act.style.opacity = '0';
                promises.push(Promise.resolve());
            }
        });
        
        return Promise.all(promises);
    }
    
    animateAct1Chaos() {
        const act = document.getElementById('act1-chaos');
        const icons = act.querySelectorAll('.floating-icon');
        
        // Show the act
        if (this.gsap.to) {
            this.gsap.to(act, { opacity: 1, duration: 0.5 });
            
            // Animate floating icons with chaotic movement
            icons.forEach((icon, index) => {
                this.gsap.fromTo(icon, 
                    { 
                        scale: 0,
                        rotation: Math.random() * 360,
                        opacity: 0
                    },
                    {
                        scale: 1,
                        opacity: 0.6,
                        duration: 0.8,
                        delay: index * 0.2,
                        ease: "back.out(1.7)"
                    }
                );
            });
        } else {
            act.style.opacity = '1';
            icons.forEach(icon => {
                icon.style.opacity = '0.6';
                icon.style.transform = 'scale(1)';
            });
        }
        
        setTimeout(() => { this.isAnimating = false; }, 1500);
    }
    
    animateAct2Clarity() {
        const act = document.getElementById('act2-clarity');
        const maiaAvatar = document.getElementById('maia-avatar');
        const organizedIcons = document.getElementById('organized-icons');
        
        // Show the act
        if (this.gsap.to) {
            this.gsap.to(act, { opacity: 1, duration: 0.5 });
            
            // Maia appears with impact
            this.gsap.fromTo(maiaAvatar,
                { scale: 0, opacity: 0 },
                { 
                    scale: 1.2, 
                    opacity: 1, 
                    duration: 0.8,
                    ease: "back.out(2)"
                }
            );
            
            // Then scale down to normal
            this.gsap.to(maiaAvatar, {
                scale: 1,
                duration: 0.4,
                delay: 0.8
            });
            
            // Organized icons appear in sequence
            this.gsap.fromTo(organizedIcons,
                { opacity: 0, y: 30 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 1,
                    delay: 1.2,
                    ease: "power2.out"
                }
            );
        } else {
            act.style.opacity = '1';
            maiaAvatar.style.opacity = '1';
            maiaAvatar.style.transform = 'scale(1)';
            organizedIcons.style.opacity = '1';
        }
        
        setTimeout(() => { this.isAnimating = false; }, 2000);
    }
    
    animateAct3Construction() {
        const act = document.getElementById('act3-construction');
        const expandingIcon = document.getElementById('expanding-icon');
        const projectMockup = document.getElementById('project-mockup');
        
        // Show the act
        if (this.gsap.to) {
            this.gsap.to(act, { opacity: 1, duration: 0.5 });
            
            // Icon expands dramatically
            this.gsap.fromTo(expandingIcon,
                { scale: 0, rotation: 0 },
                { 
                    scale: 1.5, 
                    rotation: 360,
                    duration: 1,
                    ease: "power2.out"
                }
            );
            
            // Icon transforms into project mockup
            this.gsap.to(expandingIcon, {
                scale: 0,
                opacity: 0,
                duration: 0.5,
                delay: 1
            });
            
            this.gsap.fromTo(projectMockup,
                { scale: 0, opacity: 0, rotation: -10 },
                { 
                    scale: 1, 
                    opacity: 1, 
                    rotation: 0,
                    duration: 0.8,
                    delay: 1.2,
                    ease: "back.out(1.7)"
                }
            );
        } else {
            act.style.opacity = '1';
            expandingIcon.style.transform = 'scale(1.5)';
            projectMockup.style.opacity = '1';
            projectMockup.style.transform = 'scale(1)';
        }
        
        setTimeout(() => { this.isAnimating = false; }, 2500);
    }
    
    animateAct4Result() {
        const act = document.getElementById('act4-result');
        const portfolioResult = document.getElementById('portfolio-result');
        const growthLine = document.querySelector('#growth-line path');
        
        // Show the act
        if (this.gsap.to) {
            this.gsap.to(act, { opacity: 1, duration: 0.5 });
            
            // Portfolio appears with bounce
            this.gsap.fromTo(portfolioResult,
                { scale: 0.5, opacity: 0, y: 50 },
                { 
                    scale: 1, 
                    opacity: 1, 
                    y: 0,
                    duration: 1,
                    ease: "back.out(1.7)"
                }
            );
            
            // Growth line draws
            if (growthLine) {
                this.gsap.fromTo(growthLine,
                    { 'stroke-dashoffset': 200, opacity: 0 },
                    { 
                        'stroke-dashoffset': 0, 
                        opacity: 1,
                        duration: 2,
                        delay: 1,
                        ease: "power2.out"
                    }
                );
            }
        } else {
            act.style.opacity = '1';
            portfolioResult.style.opacity = '1';
            portfolioResult.style.transform = 'scale(1)';
            if (growthLine) {
                growthLine.classList.add('animate');
            }
        }
        
        setTimeout(() => { this.isAnimating = false; }, 3000);
    }
    
    updateProgressDots() {
        const dots = document.querySelectorAll('.progress-dot');
        dots.forEach((dot, index) => {
            if (index === this.currentAct) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Fallback for when GSAP is not available
    initFallbackAnimation() {
        const container = document.getElementById('journey-animation-container');
        if (!container) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.fallbackAnimation();
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(container);
    }
    
    fallbackAnimation() {
        // Simple CSS-based fallback animation
        const acts = document.querySelectorAll('.journey-act');
        acts.forEach((act, index) => {
            setTimeout(() => {
                act.style.opacity = '1';
                act.style.transform = 'translateY(0)';
            }, index * 1000);
        });
    }
    
    destroy() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('journey-animation-container')) {
        window.studentJourneyAnimation = new StudentJourneyAnimation();
    }
});

// Handle prefers-reduced-motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    console.log('Reduced motion preferred, simplifying animations');
}