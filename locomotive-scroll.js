/* ============== LOCOMOTIVE SCROLL SYSTEM - PURE CSS/JS ============== */
/* Enhanced smooth scrolling and scroll-triggered animations for La Academia */

class PureLocomotiveScroll {
    constructor() {
        this.elements = [];
        this.observers = [];
        this.isDesktop = window.innerWidth > 768;
        
        this.init();
    }
    
    init() {
        this.setupScrollTriggers();
        this.setupParallaxElements();
        this.setupCustomCursor();
        this.setupSmoothNavigation();
        this.addStaggeredAnimations();
    }
    
    setupScrollTriggers() {
        // Enhanced intersection observer with different thresholds
        const observerOptions = {
            threshold: [0, 0.1, 0.5, 1],
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                
                if (entry.isIntersecting) {
                    if (entry.intersectionRatio >= 0.1) {
                        element.classList.add('revealed');
                        
                        // Add stagger animation to children
                        if (element.children.length > 0) {
                            element.classList.add('stagger-animation');
                        }
                    }
                } else {
                    // Optional: remove revealed class when out of view for re-animation
                    // element.classList.remove('revealed');
                }
            });
        }, observerOptions);
        
        // Auto-detect elements that should animate
        const animatableSelectors = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', 'blockquote', 'section',
            '.card', '.video-placeholder', 
            '.hover-3d', '.morph-shape',
            '[class*="bg-"]',
            'img', 'button'
        ];
        
        animatableSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach((element, index) => {
                // Don't animate elements that already have hero-animate class
                if (!element.classList.contains('hero-animate')) {
                    const animations = ['reveal-fade-up', 'reveal-scale', 'reveal-slide-left'];
                    const randomAnimation = animations[index % animations.length];
                    element.classList.add(randomAnimation);
                    observer.observe(element);
                }
            });
        });
        
        this.observers.push(observer);
    }
    
    setupParallaxElements() {
        const parallaxElements = document.querySelectorAll('[data-speed]');
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.speed) || 0.5;
            this.elements.push({
                element: element,
                speed: speed,
                offset: element.offsetTop
            });
        });
        
        // Auto-add parallax to sections
        document.querySelectorAll('section').forEach((section, index) => {
            const speed = 0.2 + (index * 0.1);
            section.setAttribute('data-speed', speed);
            this.elements.push({
                element: section,
                speed: speed,
                offset: section.offsetTop
            });
        });
        
        if (this.elements.length > 0) {
            this.handleScroll();
            window.addEventListener('scroll', this.handleScroll.bind(this));
        }
    }
    
    handleScroll() {
        const scrollY = window.pageYOffset;
        
        this.elements.forEach(({ element, speed, offset }) => {
            const yPos = -(scrollY - offset) * speed;
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        // Update scroll progress
        const progress = scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        this.updateScrollProgress(progress, scrollY);
    }
    
    updateScrollProgress(progress, scrollY) {
        // Custom scroll progress event
        window.dispatchEvent(new CustomEvent('pureLocomotiveScroll', {
            detail: { progress, scrollY }
        }));
        
        // Update any progress indicators
        const progressBars = document.querySelectorAll('.scroll-progress');
        progressBars.forEach(bar => {
            bar.style.transform = `scaleX(${progress})`;
        });
    }
    
    setupCustomCursor() {
        if (!this.isDesktop) return;
        
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);
        
        const trails = [];
        for (let i = 0; i < 3; i++) {
            const trail = document.createElement('div');
            trail.className = 'custom-cursor-trail';
            document.body.appendChild(trail);
            trails.push({ element: trail, x: 0, y: 0 });
        }
        
        let mouseX = 0, mouseY = 0;
        let cursorVisible = false;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!cursorVisible) {
                cursor.style.opacity = '1';
                cursorVisible = true;
            }
        });
        
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            cursorVisible = false;
        });
        
        // Animate cursor and trails
        const animateCursor = () => {
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
            
            trails.forEach((trail, index) => {
                const speed = 0.2 - (index * 0.05);
                trail.x += (mouseX - trail.x) * speed;
                trail.y += (mouseY - trail.y) * speed;
                
                trail.element.style.left = trail.x + 'px';
                trail.element.style.top = trail.y + 'px';
            });
            
            requestAnimationFrame(animateCursor);
        };
        animateCursor();
        
        // Cursor interactions
        document.querySelectorAll('a, button, [role="button"]').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
                cursor.style.background = 'radial-gradient(circle, var(--accent-electric), transparent)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.background = 'radial-gradient(circle, var(--accent-gold), transparent)';
            });
        });
    }
    
    setupSmoothNavigation() {
        // Enhanced smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const navHeight = document.querySelector('nav')?.offsetHeight || 0;
                    const offsetPosition = targetElement.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    addStaggeredAnimations() {
        // Add staggered animations to grid layouts
        const grids = document.querySelectorAll('.grid, .flex-wrap, [class*="grid-"]');
        grids.forEach(grid => {
            const children = [...grid.children];
            children.forEach((child, index) => {
                child.style.animationDelay = `${index * 0.1}s`;
            });
        });
    }
    
    // Method to add magnetic hover effects
    addMagneticEffects() {
        const magneticElements = document.querySelectorAll('.magnetic-hover');
        
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const moveX = x * 0.3;
                const moveY = y * 0.3;
                
                el.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0, 0)';
            });
        });
    }
    
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        window.removeEventListener('scroll', this.handleScroll.bind(this));
    }
}

/* ============== ENHANCED PARTICLE SYSTEM ============== */
class EnhancedParticleSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouse = { x: 0, y: 0, radius: 100 };
        this.colors = ['#FFC777', '#58A6FF', '#00D4FF', '#A855F7', '#E879F9'];
        
        // Only run on desktop for better performance
        if (window.innerWidth > 768) {
            this.init();
        }
    }
    
    init() {
        this.createCanvas();
        this.setupEventListeners();
        this.createParticles();
        this.animate();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'enhanced-particles-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        this.canvas.style.opacity = '0.4';
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        // React to scroll
        window.addEventListener('scroll', () => {
            const scrollProgress = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
            this.updateOpacity(0.4 * (1 - scrollProgress * 0.5));
        });
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    updateOpacity(opacity) {
        this.canvas.style.opacity = Math.max(0.1, opacity);
    }
    
    createParticles() {
        const count = Math.min(40, Math.floor(window.innerWidth / 30));
        for (let i = 0; i < count; i++) {
            this.particles.push(new EnhancedParticle(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight,
                this.colors[Math.floor(Math.random() * this.colors.length)]
            ));
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
        });
        
        // Draw connections
        this.drawConnections();
        
        requestAnimationFrame(() => this.animate());
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const opacity = (100 - distance) / 100 * 0.3;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 199, 119, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

class EnhancedParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
        this.color = color;
        this.size = Math.random() * 2 + 1;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.02 + Math.random() * 0.02;
    }
    
    update(mouse) {
        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.vx += Math.cos(Math.atan2(dy, dx)) * force * 0.1;
            this.vy += Math.sin(Math.atan2(dy, dx)) * force * 0.1;
        }
        
        // Apply velocity
        this.x += this.vx;
        this.y += this.vy;
        
        // Restore to original position
        this.vx += (this.originalX - this.x) * 0.001;
        this.vy += (this.originalY - this.y) * 0.001;
        
        // Friction
        this.vx *= 0.99;
        this.vy *= 0.99;
        
        // Boundaries
        if (this.x < 0 || this.x > window.innerWidth) this.vx *= -0.8;
        if (this.y < 0 || this.y > window.innerHeight) this.vy *= -0.8;
        
        this.pulse += this.pulseSpeed;
    }
    
    draw(ctx) {
        const pulseSize = this.size + Math.sin(this.pulse) * 0.5;
        const opacity = 0.4 + Math.sin(this.pulse) * 0.2;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = this.color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
        
        // Glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseSize * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = this.color + '20';
        ctx.fill();
    }
}

/* ============== INITIALIZATION ============== */
function initPureLocomotiveEffects() {
    // Check for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        console.log('Reduced motion preferred, using minimal animations');
        document.querySelectorAll('.reveal-fade-up, .reveal-scale, .reveal-slide-left')
            .forEach(el => el.classList.add('revealed'));
        return;
    }
    
    // Initialize systems
    const locomotiveScroll = new PureLocomotiveScroll();
    const particleSystem = new EnhancedParticleSystem();
    
    // Add magnetic effects after DOM is ready
    setTimeout(() => {
        locomotiveScroll.addMagneticEffects();
    }, 1000);
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPureLocomotiveEffects);
} else {
    initPureLocomotiveEffects();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PureLocomotiveScroll, EnhancedParticleSystem };
}