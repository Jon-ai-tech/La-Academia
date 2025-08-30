/* ============== LOCOMOTIVE-STYLE APPLICATION ============== */

(function() {
    'use strict';
    
    // Check for reduced motion
    const prefersReducedMotion = () => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    // Advanced Scroll Manager
    class AdvancedScrollManager {
        constructor() {
            this.scrollPosition = 0;
            this.ticking = false;
            this.elements = [];
            this.init();
        }

        init() {
            this.setupScrollElements();
            this.bindEvents();
        }

        setupScrollElements() {
            // Add scroll attributes to sections
            document.querySelectorAll('section').forEach((section, index) => {
                section.classList.add('scroll-element');
                section.dataset.scrollSpeed = (index % 2 === 0) ? '0.5' : '0.8';
                section.dataset.scrollOffset = '100';
                
                this.elements.push({
                    element: section,
                    speed: parseFloat(section.dataset.scrollSpeed || 1),
                    offset: parseInt(section.dataset.scrollOffset || 0),
                    inView: false
                });
            });

            // Add scroll attributes to cards
            document.querySelectorAll('.influencer-card, .enhanced-card').forEach((card, index) => {
                card.classList.add('stagger-element');
                card.style.transitionDelay = `${index * 0.1}s`;
            });
        }

        bindEvents() {
            window.addEventListener('scroll', () => {
                this.scrollPosition = window.pageYOffset;
                if (!this.ticking) {
                    requestAnimationFrame(this.updateElements.bind(this));
                    this.ticking = true;
                }
            });

            // Intersection Observer for appear animations
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-inview');
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.1, rootMargin: '50px' });

            // Observe all scroll elements
            document.querySelectorAll('.scroll-element, .stagger-element').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(50px)';
                el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                observer.observe(el);
            });
        }

        updateElements() {
            this.elements.forEach(item => {
                const elementTop = item.element.offsetTop;
                const elementHeight = item.element.offsetHeight;
                const windowHeight = window.innerHeight;

                // Check if element is in viewport
                const inView = (
                    this.scrollPosition + windowHeight > elementTop &&
                    this.scrollPosition < elementTop + elementHeight
                );

                if (inView && !item.inView) {
                    item.inView = true;
                    this.animateElement(item.element);
                }

                // Parallax effect
                if (inView && !prefersReducedMotion()) {
                    const yPos = -(this.scrollPosition * item.speed);
                    const transform = `translateY(${yPos}px)`;
                    item.element.style.transform = transform;
                }
            });

            this.ticking = false;
        }

        animateElement(element) {
            element.classList.add('animate-in');
            
            // Add sparkle effect on reveal
            if (window.particleSystem) {
                const rect = element.getBoundingClientRect();
                window.particleSystem.burst(
                    rect.left + rect.width / 2,
                    rect.top + rect.height / 2,
                    3
                );
            }
        }
    }

    // Enhanced 3D background effects
    class Enhanced3D {
        constructor() {
            this.shapes = [];
            this.colors = ['#FFC777', '#58A6FF', '#A855F7', '#E879F9'];
            this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
            this.init();
        }

        init() {
            if (prefersReducedMotion()) return;
            
            // Create more sophisticated floating shapes
            for (let i = 0; i < 8; i++) {
                this.createAdvancedShape(i);
            }
            
            this.addMouseTracking();
            this.animate();
        }

        createAdvancedShape(index) {
            const shape = document.createElement('div');
            const isWireframe = Math.random() > 0.6;
            const size = 30 + Math.random() * 50;
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            
            shape.className = 'floating-shape advanced-shape';
            shape.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                ${isWireframe ? 
                    `border: 2px solid ${color}; background: transparent;` : 
                    `background: ${color}; opacity: 0.4;`}
                border-radius: ${this.getRandomBorderRadius()};
                pointer-events: none;
                z-index: 1;
                left: ${Math.random() * window.innerWidth}px;
                top: ${Math.random() * window.innerHeight}px;
                animation: advancedFloat${index % 3} ${8 + Math.random() * 6}s ease-in-out infinite;
                transform-origin: center;
                filter: blur(${Math.random() * 1}px);
                mix-blend-mode: ${Math.random() > 0.7 ? 'screen' : 'normal'};
            `;
            
            shape.dataset.depth = Math.random() * 5 + 1;
            shape.dataset.rotationSpeed = (Math.random() - 0.5) * 2;
            
            document.body.appendChild(shape);
            this.shapes.push(shape);
        }

        getRandomBorderRadius() {
            const radiuses = [
                '50%', // Circle
                '0%',  // Square
                '25%', // Rounded square
                '50% 0 50% 0', // Organic shape 1
                '0 50% 0 50%', // Organic shape 2
                '30% 70% 70% 30%', // Blob
                '75% 25% 25% 75%', // Another blob
            ];
            return radiuses[Math.floor(Math.random() * radiuses.length)];
        }

        addMouseTracking() {
            document.addEventListener('mousemove', (e) => {
                this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
                this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
            });
        }

        animate() {
            // Smooth mouse tracking
            this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.02;
            this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.02;

            this.shapes.forEach((shape, index) => {
                const depth = parseFloat(shape.dataset.depth);
                const rotationSpeed = parseFloat(shape.dataset.rotationSpeed);
                
                const offsetX = this.mouse.x * (5 + depth * 3);
                const offsetY = this.mouse.y * (5 + depth * 3);
                const rotation = Date.now() * 0.0002 * rotationSpeed;
                
                shape.style.transform = `
                    translate(${offsetX}px, ${offsetY}px) 
                    rotate(${rotation}rad) 
                    scale(${1 + Math.sin(Date.now() * 0.001 + index) * 0.1})
                `;
            });
            
            requestAnimationFrame(() => this.animate());
        }
    }

    // Enhanced Particle System
    class EnhancedParticles {
        constructor() {
            this.particles = [];
            this.colors = ['#FFC777', '#58A6FF', '#A855F7', '#E879F9'];
            this.mouse = { x: 0, y: 0 };
            this.init();
        }

        init() {
            if (prefersReducedMotion()) return;
            
            this.createContainer();
            this.startParticleGeneration();
            this.addAdvancedInteractions();
        }

        createContainer() {
            const container = document.createElement('div');
            container.className = 'particles-container enhanced';
            container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
                overflow: hidden;
            `;
            document.body.appendChild(container);
            this.container = container;
        }

        createParticle(x = null, y = null, type = 'normal') {
            const particle = document.createElement('div');
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            const size = type === 'burst' ? Math.random() * 4 + 2 : Math.random() * 6 + 2;
            
            particle.className = `particle enhanced ${type}`;
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, ${color} 0%, ${color}80 50%, transparent 100%);
                border-radius: 50%;
                left: ${x !== null ? x : Math.random() * window.innerWidth}px;
                top: ${y !== null ? y : window.innerHeight + 10}px;
                animation: ${type}ParticleFloat ${type === 'burst' ? 2 : 8 + Math.random() * 4}s ease-out forwards;
                opacity: ${Math.random() * 0.8 + 0.2};
                filter: blur(${Math.random() * 0.5}px);
                mix-blend-mode: ${Math.random() > 0.8 ? 'screen' : 'normal'};
            `;
            
            this.container.appendChild(particle);
            
            setTimeout(() => {
                if (this.container && this.container.contains(particle)) {
                    this.container.removeChild(particle);
                }
            }, type === 'burst' ? 2000 : 12000);
        }

        startParticleGeneration() {
            setInterval(() => {
                if (Math.random() < 0.4) {
                    this.createParticle();
                }
            }, 1500);

            // Create ambient particles on scroll
            window.addEventListener('scroll', () => {
                if (Math.random() < 0.3) {
                    this.createParticle(
                        Math.random() * window.innerWidth,
                        window.scrollY + Math.random() * window.innerHeight
                    );
                }
            });
        }

        addAdvancedInteractions() {
            let lastMove = 0;
            document.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
                
                const now = Date.now();
                if (now - lastMove > 300 && Math.random() < 0.3) {
                    this.createParticle(e.clientX, e.clientY, 'trail');
                    lastMove = now;
                }
            });

            // Section entry particles
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const rect = entry.target.getBoundingClientRect();
                        this.burst(rect.left + rect.width / 2, rect.top, 3);
                    }
                });
            });

            document.querySelectorAll('section').forEach(section => {
                observer.observe(section);
            });
        }

        burst(x, y, count = 5) {
            for (let i = 0; i < count; i++) {
                setTimeout(() => {
                    this.createParticle(
                        x + (Math.random() - 0.5) * 100,
                        y + (Math.random() - 0.5) * 100,
                        'burst'
                    );
                }, i * 100);
            }
        }
    }

    // Enhanced Cursor with more effects
    class EnhancedCursor {
        constructor() {
            this.cursor = null;
            this.trails = [];
            this.mouse = { x: 0, y: 0 };
            this.velocity = { x: 0, y: 0 };
            this.lastMouse = { x: 0, y: 0 };
            this.init();
        }

        init() {
            if (this.isTouchDevice() || prefersReducedMotion()) return;

            this.createCursor();
            this.createTrails();
            this.addEventListeners();
            this.animate();
        }

        createCursor() {
            this.cursor = document.createElement('div');
            this.cursor.className = 'enhanced-cursor';
            this.cursor.style.cssText = `
                position: fixed;
                width: 24px;
                height: 24px;
                background: radial-gradient(circle, #FFC777 20%, #FFC77750 70%, transparent);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                mix-blend-mode: difference;
                transition: transform 0.1s ease;
            `;
            document.body.appendChild(this.cursor);
        }

        createTrails() {
            for (let i = 0; i < 8; i++) {
                const trail = document.createElement('div');
                const size = 8 - i;
                const opacity = (8 - i) / 8 * 0.6;
                
                trail.style.cssText = `
                    position: fixed;
                    width: ${size}px;
                    height: ${size}px;
                    background: radial-gradient(circle, #A855F7, #E879F9);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9998;
                    opacity: ${opacity};
                    mix-blend-mode: screen;
                `;
                document.body.appendChild(trail);
                this.trails.push({ 
                    element: trail, 
                    x: 0, 
                    y: 0,
                    delay: i * 0.03
                });
            }
        }

        addEventListeners() {
            document.addEventListener('mousemove', (e) => {
                this.velocity.x = e.clientX - this.lastMouse.x;
                this.velocity.y = e.clientY - this.lastMouse.y;
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
                this.lastMouse.x = e.clientX;
                this.lastMouse.y = e.clientY;
            });

            // Enhanced hover effects
            const interactives = document.querySelectorAll('a, button, input, textarea, .cursor-hover, .influencer-card');
            interactives.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    this.cursor.style.transform = 'scale(1.5)';
                    this.cursor.style.background = 'radial-gradient(circle, #58A6FF 20%, #58A6FF50 70%, transparent)';
                });
                el.addEventListener('mouseleave', () => {
                    this.cursor.style.transform = 'scale(1)';
                    this.cursor.style.background = 'radial-gradient(circle, #FFC777 20%, #FFC77750 70%, transparent)';
                });
            });

            // Hide cursor when leaving window
            document.addEventListener('mouseleave', () => {
                this.cursor.style.opacity = '0';
                this.trails.forEach(trail => {
                    trail.element.style.opacity = '0';
                });
            });

            document.addEventListener('mouseenter', () => {
                this.cursor.style.opacity = '1';
                this.trails.forEach((trail, index) => {
                    trail.element.style.opacity = (8 - index) / 8 * 0.6;
                });
            });
        }

        animate() {
            // Main cursor with slight lag for smoothness
            this.cursor.style.left = this.mouse.x - 12 + 'px';
            this.cursor.style.top = this.mouse.y - 12 + 'px';

            // Velocity-based scaling
            const velocityMagnitude = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
            const scale = 1 + Math.min(velocityMagnitude * 0.01, 0.5);
            this.cursor.style.transform = `scale(${scale})`;

            // Update trail positions with increasing delays
            this.trails.forEach((trail, index) => {
                const targetX = this.mouse.x;
                const targetY = this.mouse.y;
                
                // Smooth following with different delays
                const ease = 0.15 - index * 0.015;
                trail.x += (targetX - trail.x) * ease;
                trail.y += (targetY - trail.y) * ease;
                
                trail.element.style.left = trail.x - (8 - index) / 2 + 'px';
                trail.element.style.top = trail.y - (8 - index) / 2 + 'px';
            });

            requestAnimationFrame(() => this.animate());
        }

        isTouchDevice() {
            return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        }
    }

    // Enhanced Interactions with more sophisticated effects
    class EnhancedInteractions {
        constructor(particleSystem) {
            this.particleSystem = particleSystem;
            this.init();
        }

        init() {
            this.setupAdvancedButtonEffects();
            this.setupAdvancedCardEffects();
            this.setupScrollToTop();
            this.addAdvancedStyles();
        }

        setupAdvancedButtonEffects() {
            document.querySelectorAll('.decorative-btn, .cta-button, .voltage-button').forEach((btn, index) => {
                // Add ripple effect container
                const ripple = document.createElement('div');
                ripple.className = 'ripple-container';
                ripple.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: inherit;
                    overflow: hidden;
                    pointer-events: none;
                `;
                btn.style.position = 'relative';
                btn.style.overflow = 'hidden';
                btn.appendChild(ripple);

                // Enhanced hover effects
                btn.addEventListener('mouseenter', () => {
                    if (!prefersReducedMotion()) {
                        btn.style.transform = 'translateY(-3px) scale(1.02)';
                        btn.style.boxShadow = '0 10px 30px rgba(255, 199, 119, 0.4)';
                        btn.style.filter = 'brightness(1.1)';
                    }
                });

                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = '';
                    btn.style.boxShadow = '';
                    btn.style.filter = '';
                });

                btn.addEventListener('click', (e) => {
                    // Create ripple effect
                    this.createRipple(e, btn);
                    
                    // Particle burst
                    if (this.particleSystem) {
                        this.particleSystem.burst(e.clientX, e.clientY, 12);
                    }
                    
                    // Enhanced visual feedback
                    btn.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        if (!prefersReducedMotion()) {
                            btn.style.transform = 'translateY(-3px) scale(1.02)';
                        }
                    }, 100);
                });
            });
        }

        createRipple(event, button) {
            const rippleContainer = button.querySelector('.ripple-container');
            const rect = button.getBoundingClientRect();
            const ripple = document.createElement('div');
            const size = Math.max(rect.width, rect.height) * 2;
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple-animation 0.6s ease-out;
                pointer-events: none;
            `;

            rippleContainer.appendChild(ripple);

            setTimeout(() => {
                rippleContainer.removeChild(ripple);
            }, 600);
        }

        setupAdvancedCardEffects() {
            document.querySelectorAll('.influencer-card, .enhanced-card').forEach((card, index) => {
                // Add glow container
                const glow = document.createElement('div');
                glow.className = 'card-glow';
                glow.style.cssText = `
                    position: absolute;
                    top: -2px;
                    left: -2px;
                    right: -2px;
                    bottom: -2px;
                    border-radius: inherit;
                    background: linear-gradient(45deg, #FFC777, #58A6FF, #A855F7, #E879F9);
                    opacity: 0;
                    z-index: -1;
                    transition: opacity 0.3s ease;
                    filter: blur(10px);
                `;
                
                card.style.position = 'relative';
                card.appendChild(glow);

                card.addEventListener('mouseenter', () => {
                    if (!prefersReducedMotion()) {
                        card.style.transform = 'translateY(-8px) scale(1.03) rotateX(2deg)';
                        card.style.boxShadow = '0 20px 40px rgba(255, 199, 119, 0.3)';
                        glow.style.opacity = '0.6';
                        card.style.zIndex = '10';
                    }
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = '';
                    card.style.boxShadow = '';
                    card.style.zIndex = '';
                    glow.style.opacity = '0';
                });

                card.addEventListener('click', (e) => {
                    if (this.particleSystem) {
                        this.particleSystem.burst(e.clientX, e.clientY, 8);
                    }
                });
            });
        }

        setupScrollToTop() {
            const scrollBtn = document.getElementById('scrollToTopBtn');
            if (scrollBtn) {
                scrollBtn.style.cssText = `
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(45deg, #FFC777, #58A6FF);
                    border: none;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    opacity: 0;
                    visibility: hidden;
                    transform: scale(0.8);
                    z-index: 100;
                    box-shadow: 0 4px 20px rgba(255, 199, 119, 0.3);
                `;

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            scrollBtn.style.opacity = '0';
                            scrollBtn.style.visibility = 'hidden';
                            scrollBtn.style.transform = 'scale(0.8)';
                        } else {
                            scrollBtn.style.opacity = '1';
                            scrollBtn.style.visibility = 'visible';
                            scrollBtn.style.transform = 'scale(1)';
                        }
                    });
                });

                const firstSection = document.querySelector('section');
                if (firstSection) {
                    observer.observe(firstSection);
                }

                scrollBtn.addEventListener('mouseenter', () => {
                    if (!prefersReducedMotion()) {
                        scrollBtn.style.transform = 'scale(1.1) translateY(-5px)';
                        scrollBtn.style.boxShadow = '0 8px 25px rgba(88, 166, 255, 0.4)';
                    }
                });

                scrollBtn.addEventListener('mouseleave', () => {
                    scrollBtn.style.transform = 'scale(1)';
                    scrollBtn.style.boxShadow = '0 4px 20px rgba(255, 199, 119, 0.3)';
                });

                scrollBtn.addEventListener('click', (e) => {
                    if (this.particleSystem) {
                        this.particleSystem.burst(e.clientX, e.clientY, 15);
                    }
                    
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }
        }

        addAdvancedStyles() {
            const style = document.createElement('style');
            style.textContent = `
                @keyframes advancedFloat0 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
                    25% { transform: translate(-15px, -20px) rotate(45deg) scale(1.1); }
                    50% { transform: translate(10px, -30px) rotate(90deg) scale(0.9); }
                    75% { transform: translate(20px, -10px) rotate(135deg) scale(1.05); }
                }

                @keyframes advancedFloat1 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
                    33% { transform: translate(25px, -15px) rotate(-30deg) scale(1.2); }
                    66% { transform: translate(-20px, -25px) rotate(60deg) scale(0.8); }
                }

                @keyframes advancedFloat2 {
                    0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
                    20% { transform: translate(-10px, -30px) rotate(72deg) scale(1.15); }
                    40% { transform: translate(30px, -20px) rotate(144deg) scale(0.85); }
                    60% { transform: translate(-25px, -5px) rotate(216deg) scale(1.1); }
                    80% { transform: translate(15px, -35px) rotate(288deg) scale(0.95); }
                }

                @keyframes normalParticleFloat {
                    0% { transform: translateY(0px) scale(0) rotate(0deg); opacity: 0; }
                    10% { opacity: 0.8; transform: translateY(-10vh) scale(0.5) rotate(45deg); }
                    90% { opacity: 0.8; transform: translateY(-90vh) scale(1) rotate(360deg); }
                    100% { transform: translateY(-100vh) scale(0) rotate(405deg); opacity: 0; }
                }

                @keyframes burstParticleFloat {
                    0% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 1; }
                    100% { transform: translate(var(--random-x, 0), var(--random-y, -100px)) scale(0) rotate(180deg); opacity: 0; }
                }

                @keyframes trailParticleFloat {
                    0% { transform: translate(0, 0) scale(1); opacity: 0.8; }
                    100% { transform: translate(0, -50px) scale(0); opacity: 0; }
                }

                @keyframes ripple-animation {
                    0% { transform: scale(0); opacity: 1; }
                    100% { transform: scale(1); opacity: 0; }
                }

                .particle.enhanced.burst {
                    --random-x: ${Math.random() * 200 - 100}px;
                    --random-y: ${Math.random() * 100 + 50}px;
                }

                .enhanced-card, .influencer-card {
                    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
                    transform-style: preserve-3d;
                }

                .enhanced-button, .decorative-btn, .cta-button, .voltage-button {
                    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                    transform-style: preserve-3d;
                }

                .scroll-element {
                    transition: opacity 0.8s ease, transform 0.8s ease;
                }

                .is-inview {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }

                @media (prefers-reduced-motion: reduce) {
                    *, *::before, *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                        transform: none !important;
                    }
                    
                    .enhanced-cursor, .particle, .floating-shape {
                        display: none !important;
                    }
                }

                @media (max-width: 768px) {
                    .enhanced-cursor, .particle, .floating-shape {
                        display: none !important;
                    }
                    
                    .enhanced-card:hover, .influencer-card:hover {
                        transform: none !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Main Application
    class LocomotiveStyleApp {
        constructor() {
            this.scrollManager = null;
            this.threeD = null;
            this.particles = null;
            this.cursor = null;
            this.interactions = null;
            this.init();
        }

        init() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setup());
            } else {
                this.setup();
            }
        }

        setup() {
            console.log('🎯 Initializing Enhanced Locomotive-style experience...');
            
            // Initialize components
            this.scrollManager = new AdvancedScrollManager();
            this.threeD = new Enhanced3D();
            this.particles = new EnhancedParticles();
            this.cursor = new EnhancedCursor();
            this.interactions = new EnhancedInteractions(this.particles);

            // Make particle system globally available
            window.particleSystem = this.particles;

            // Add enhanced classes to elements
            document.querySelectorAll('.decorative-btn, .cta-button, .voltage-button').forEach(btn => {
                btn.classList.add('enhanced-button');
            });

            document.querySelectorAll('.influencer-card').forEach(card => {
                card.classList.add('enhanced-card');
            });

            console.log('✨ Enhanced Locomotive-style experience initialized!');
            
            // Create welcome burst
            setTimeout(() => {
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                this.particles.burst(centerX, centerY, 20);
            }, 1000);
        }

        triggerParticleBurst(x, y, count = 5) {
            if (this.particles) {
                this.particles.burst(x, y, count);
            }
        }
    }

    // Initialize the app
    const locomotiveApp = new LocomotiveStyleApp();
    
    // Make it globally available
    window.locomotiveApp = locomotiveApp;

    // Store original app functionality
    const originalAppScript = document.querySelector('script[src="app.js"]');
    if (originalAppScript) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'app.js');
        xhr.onload = function() {
            if (xhr.status === 200) {
                try {
                    eval(xhr.responseText);
                } catch (error) {
                    console.warn('Could not load original app.js:', error);
                }
            }
        };
        xhr.send();
    }

})();