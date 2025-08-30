/* ============== PARTICLE SYSTEM ============== */

class ParticleSystem {
    constructor(container) {
        this.container = container || document.body;
        this.particles = [];
        this.particleCount = window.innerWidth < 768 ? 15 : 30; // Fewer particles on mobile
        this.colors = [
            '#FFC777', // Gold
            '#58A6FF', // Blue
            '#A855F7', // Violet
            '#E879F9'  // Magenta
        ];
        
        this.init();
        this.createParticles();
        this.animate();
    }

    init() {
        // Create particle container
        this.particleContainer = document.createElement('div');
        this.particleContainer.className = 'particles-container';
        this.container.appendChild(this.particleContainer);

        // Handle resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random color
        const colorIndex = Math.floor(Math.random() * this.colors.length);
        const color = this.colors[colorIndex];
        
        // Add color class for CSS animations
        const colorClass = ['gold', 'blue', 'violet', 'magenta'][colorIndex];
        particle.classList.add(colorClass);
        
        // Random size
        const size = Math.random() * 8 + 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random starting position
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = window.innerHeight + 20 + 'px';
        
        // Store particle data
        particle.particleData = {
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 20,
            vx: (Math.random() - 0.5) * 2,
            vy: -(Math.random() * 2 + 1),
            size: size,
            color: color,
            opacity: Math.random() * 0.8 + 0.2,
            life: 1,
            decay: Math.random() * 0.01 + 0.005,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 4
        };
        
        // Set initial opacity
        particle.style.opacity = particle.particleData.opacity;
        
        // Random animation delay
        const delay = Math.random() * 5;
        particle.style.animationDelay = delay + 's';
        
        this.particleContainer.appendChild(particle);
        this.particles.push(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            this.removeParticle(particle);
        }, 12000 + delay * 1000);
    }

    removeParticle(particle) {
        const index = this.particles.indexOf(particle);
        if (index > -1) {
            this.particles.splice(index, 1);
            if (this.particleContainer.contains(particle)) {
                this.particleContainer.removeChild(particle);
            }
            
            // Create new particle to maintain count
            setTimeout(() => {
                this.createParticle();
            }, Math.random() * 2000);
        }
    }

    createFloatingParticle(x, y) {
        // Create temporary particle at specific position (for interactions)
        const particle = document.createElement('div');
        particle.className = 'particle floating-particle';
        
        const colorIndex = Math.floor(Math.random() * this.colors.length);
        const colorClass = ['gold', 'blue', 'violet', 'magenta'][colorIndex];
        particle.classList.add(colorClass);
        
        const size = Math.random() * 6 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        this.particleContainer.appendChild(particle);
        
        // Animate and remove
        setTimeout(() => {
            if (this.particleContainer.contains(particle)) {
                particle.style.opacity = '0';
                particle.style.transform = 'translateY(-50px) scale(0)';
                
                setTimeout(() => {
                    if (this.particleContainer.contains(particle)) {
                        this.particleContainer.removeChild(particle);
                    }
                }, 300);
            }
        }, 100);
    }

    animate() {
        // This method can be extended for manual particle animation
        // Currently using CSS animations for performance
        requestAnimationFrame(() => this.animate());
    }

    handleResize() {
        this.particleCount = window.innerWidth < 768 ? 15 : 30;
        
        // Adjust existing particles to new screen size
        this.particles.forEach(particle => {
            const data = particle.particleData;
            if (data.x > window.innerWidth) {
                data.x = window.innerWidth - 20;
                particle.style.left = data.x + 'px';
            }
        });
    }

    addMouseInteraction() {
        let lastMouseMove = 0;
        
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            
            // Throttle particle creation
            if (now - lastMouseMove > 100) {
                // Random chance to create particle on mouse move
                if (Math.random() < 0.3) {
                    this.createFloatingParticle(
                        e.clientX + (Math.random() - 0.5) * 50,
                        e.clientY + (Math.random() - 0.5) * 50
                    );
                }
                lastMouseMove = now;
            }
        });
    }

    addScrollInteraction() {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const now = Date.now();
            
            if (now - lastScroll > 200) {
                // Create particles during scroll
                for (let i = 0; i < 2; i++) {
                    this.createFloatingParticle(
                        Math.random() * window.innerWidth,
                        Math.random() * window.innerHeight
                    );
                }
                lastScroll = now;
            }
        });
    }

    burst(x, y, count = 5) {
        // Create burst of particles at specific location
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.createFloatingParticle(
                    x + (Math.random() - 0.5) * 100,
                    y + (Math.random() - 0.5) * 100
                );
            }, i * 50);
        }
    }

    destroy() {
        if (this.particleContainer && this.container.contains(this.particleContainer)) {
            this.container.removeChild(this.particleContainer);
        }
        this.particles = [];
    }

    pause() {
        this.particleContainer.style.animationPlayState = 'paused';
        this.particles.forEach(particle => {
            particle.style.animationPlayState = 'paused';
        });
    }

    resume() {
        this.particleContainer.style.animationPlayState = 'running';
        this.particles.forEach(particle => {
            particle.style.animationPlayState = 'running';
        });
    }
}

export default ParticleSystem;