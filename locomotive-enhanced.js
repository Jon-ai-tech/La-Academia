/* ============== LOCOMOTIVE-STYLE APPLICATION ============== */

(function() {
    'use strict';
    
    // Check for reduced motion
    const prefersReducedMotion = () => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    // Simple 3D background effects
    class SimpleThreeD {
        constructor() {
            this.shapes = [];
            this.colors = ['#FFC777', '#58A6FF', '#A855F7', '#E879F9'];
            this.mouse = { x: 0, y: 0 };
            this.init();
        }

        init() {
            if (prefersReducedMotion()) return;
            
            // Create floating shapes using CSS
            for (let i = 0; i < 6; i++) {
                this.createShape();
            }
            
            this.addMouseTracking();
            this.animate();
        }

        createShape() {
            const shape = document.createElement('div');
            shape.className = 'floating-shape';
            shape.style.cssText = `
                position: fixed;
                width: ${20 + Math.random() * 40}px;
                height: ${20 + Math.random() * 40}px;
                background: ${this.colors[Math.floor(Math.random() * this.colors.length)]};
                border-radius: ${Math.random() > 0.5 ? '50%' : Math.random() * 20 + 'px'};
                opacity: 0.6;
                pointer-events: none;
                z-index: 1;
                left: ${Math.random() * window.innerWidth}px;
                top: ${Math.random() * window.innerHeight}px;
                animation: float ${6 + Math.random() * 4}s ease-in-out infinite;
                transform-origin: center;
            `;
            
            document.body.appendChild(shape);
            this.shapes.push(shape);
        }

        addMouseTracking() {
            document.addEventListener('mousemove', (e) => {
                this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            });
        }

        animate() {
            this.shapes.forEach((shape, index) => {
                const offsetX = this.mouse.x * (10 + index * 5);
                const offsetY = this.mouse.y * (10 + index * 5);
                shape.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${Date.now() * 0.001 * (index + 1)}rad)`;
            });
            
            requestAnimationFrame(() => this.animate());
        }
    }

    // Particle System
    class SimpleParticles {
        constructor() {
            this.particles = [];
            this.colors = ['#FFC777', '#58A6FF', '#A855F7', '#E879F9'];
            this.init();
        }

        init() {
            if (prefersReducedMotion()) return;
            
            this.createContainer();
            this.startParticleGeneration();
            this.addInteractions();
        }

        createContainer() {
            const container = document.createElement('div');
            container.className = 'particles-container';
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

        createParticle(x = null, y = null) {
            const particle = document.createElement('div');
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            const size = Math.random() * 6 + 2;
            
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, ${color} 0%, transparent 70%);
                border-radius: 50%;
                left: ${x !== null ? x : Math.random() * window.innerWidth}px;
                top: ${y !== null ? y : window.innerHeight + 10}px;
                animation: particleFloat ${8 + Math.random() * 4}s linear forwards;
            `;
            
            this.container.appendChild(particle);
            
            setTimeout(() => {
                if (this.container.contains(particle)) {
                    this.container.removeChild(particle);
                }
            }, 12000);
        }

        startParticleGeneration() {
            setInterval(() => {
                if (Math.random() < 0.3) {
                    this.createParticle();
                }
            }, 1000);
        }

        addInteractions() {
            let lastMove = 0;
            document.addEventListener('mousemove', (e) => {
                const now = Date.now();
                if (now - lastMove > 200 && Math.random() < 0.5) {
                    this.createParticle(e.clientX, e.clientY);
                    lastMove = now;
                }
            });
        }

        burst(x, y, count = 5) {
            for (let i = 0; i < count; i++) {
                setTimeout(() => {
                    this.createParticle(
                        x + (Math.random() - 0.5) * 100,
                        y + (Math.random() - 0.5) * 100
                    );
                }, i * 50);
            }
        }
    }

    // Custom Cursor
    class SimpleCursor {
        constructor() {
            this.cursor = null;
            this.trails = [];
            this.mouse = { x: 0, y: 0 };
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
            this.cursor.style.cssText = `
                position: fixed;
                width: 20px;
                height: 20px;
                background: #FFC777;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: transform 0.1s ease;
                box-shadow: 0 0 20px rgba(255, 199, 119, 0.3);
            `;
            document.body.appendChild(this.cursor);
        }

        createTrails() {
            for (let i = 0; i < 5; i++) {
                const trail = document.createElement('div');
                trail.style.cssText = `
                    position: fixed;
                    width: 6px;
                    height: 6px;
                    background: #A855F7;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9998;
                    opacity: ${(5 - i) / 5 * 0.7};
                    transform: scale(${(5 - i) / 5});
                `;
                document.body.appendChild(trail);
                this.trails.push({ element: trail, x: 0, y: 0 });
            }
        }

        addEventListeners() {
            document.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            });

            // Hover effects
            const interactives = document.querySelectorAll('a, button, input, textarea, .cursor-hover');
            interactives.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    this.cursor.style.transform = 'scale(2)';
                    this.cursor.style.background = '#58A6FF';
                });
                el.addEventListener('mouseleave', () => {
                    this.cursor.style.transform = 'scale(1)';
                    this.cursor.style.background = '#FFC777';
                });
            });
        }

        animate() {
            this.cursor.style.left = this.mouse.x + 'px';
            this.cursor.style.top = this.mouse.y + 'px';

            this.trails.forEach((trail, index) => {
                trail.x += (this.mouse.x - trail.x) * (0.2 - index * 0.02);
                trail.y += (this.mouse.y - trail.y) * (0.2 - index * 0.02);
                trail.element.style.left = trail.x + 'px';
                trail.element.style.top = trail.y + 'px';
            });

            requestAnimationFrame(() => this.animate());
        }

        isTouchDevice() {
            return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        }
    }

    // Enhanced Interactions
    class EnhancedInteractions {
        constructor(particleSystem) {
            this.particleSystem = particleSystem;
            this.init();
        }

        init() {
            this.setupButtonEffects();
            this.setupCardEffects();
            this.setupScrollToTop();
            this.addGlobalStyles();
        }

        setupButtonEffects() {
            document.querySelectorAll('.decorative-btn, .cta-button, .voltage-button').forEach(btn => {
                btn.addEventListener('mouseenter', () => {
                    btn.style.transform = 'translateY(-2px)';
                    btn.style.boxShadow = '0 8px 25px rgba(255, 199, 119, 0.3)';
                });

                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = 'translateY(0)';
                    btn.style.boxShadow = '';
                });

                btn.addEventListener('click', (e) => {
                    if (this.particleSystem) {
                        this.particleSystem.burst(e.clientX, e.clientY, 8);
                    }
                    
                    // Visual feedback
                    btn.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        btn.style.transform = 'translateY(-2px)';
                    }, 100);
                });
            });
        }

        setupCardEffects() {
            document.querySelectorAll('.influencer-card').forEach(card => {
                card.addEventListener('mouseenter', () => {
                    if (!prefersReducedMotion()) {
                        card.style.transform = 'translateY(-5px) scale(1.02)';
                        card.style.boxShadow = '0 15px 35px rgba(255, 199, 119, 0.2)';
                    }
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = '';
                    card.style.boxShadow = '';
                });

                card.addEventListener('click', (e) => {
                    if (this.particleSystem) {
                        this.particleSystem.burst(e.clientX, e.clientY, 5);
                    }
                });
            });
        }

        setupScrollToTop() {
            const scrollBtn = document.getElementById('scrollToTopBtn');
            if (scrollBtn) {
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

                scrollBtn.addEventListener('click', (e) => {
                    if (this.particleSystem) {
                        this.particleSystem.burst(e.clientX, e.clientY, 10);
                    }
                });
            }
        }

        addGlobalStyles() {
            const style = document.createElement('style');
            style.textContent = `
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    25% { transform: translateY(-10px) rotate(2deg); }
                    50% { transform: translateY(-5px) rotate(0deg); }
                    75% { transform: translateY(-15px) rotate(-2deg); }
                }

                @keyframes particleFloat {
                    0% { transform: translateY(0px) scale(0); opacity: 0; }
                    10% { opacity: 1; transform: translateY(-10vh) scale(0.5); }
                    90% { opacity: 1; transform: translateY(-90vh) scale(1); }
                    100% { transform: translateY(-100vh) scale(0); opacity: 0; }
                }

                .floating-shape {
                    animation: float 6s ease-in-out infinite !important;
                }

                .particle {
                    animation: particleFloat 8s linear forwards !important;
                }

                .enhanced-card {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .enhanced-button {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .enhanced-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    transition: left 0.5s ease;
                }

                .enhanced-button:hover::before {
                    left: 100%;
                }

                @media (prefers-reduced-motion: reduce) {
                    * {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Main Application
    class LocomotiveStyleApp {
        constructor() {
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
            console.log('🎯 Initializing Locomotive-style experience...');
            
            // Initialize components
            this.threeD = new SimpleThreeD();
            this.particles = new SimpleParticles();
            this.cursor = new SimpleCursor();
            this.interactions = new EnhancedInteractions(this.particles);

            // Add enhanced classes to elements
            document.querySelectorAll('.decorative-btn, .cta-button, .voltage-button').forEach(btn => {
                btn.classList.add('enhanced-button');
            });

            document.querySelectorAll('.influencer-card').forEach(card => {
                card.classList.add('enhanced-card');
            });

            console.log('✨ Locomotive-style experience initialized!');
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