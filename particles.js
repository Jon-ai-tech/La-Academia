/* ============== PARTICLES SYSTEM ============== */
/* Canvas-based particle effects for La Academia */

class ParticleSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouse = { x: 0, y: 0, radius: 150 };
        this.animationId = null;
        
        this.colors = [
            '#FFC777', // accent-gold
            '#58A6FF', // accent-blue
            '#00D4FF', // accent-electric
            '#A855F7', // accent-violet
            '#E879F9'  // accent-magenta
        ];
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.setupEventListeners();
        this.createParticles();
        this.animate();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particles-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        this.canvas.style.opacity = '0.6';
        
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
        
        document.addEventListener('mousemove', (event) => {
            this.mouse.x = event.clientX;
            this.mouse.y = event.clientY;
        });
        
        document.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });
    }
    
    resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        this.ctx.scale(dpr, dpr);
    }
    
    createParticles() {
        const particleCount = window.innerWidth < 768 ? 30 : 60;
        this.particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(
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
        
        // Draw connections between nearby particles
        this.drawConnections();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const opacity = (120 - distance) / 120 * 0.3;
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
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas) {
            this.canvas.remove();
        }
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
        this.color = color;
        this.size = Math.random() * 3 + 1;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.life = 1;
        this.maxLife = Math.random() * 300 + 200;
        this.age = 0;
        this.pulse = Math.random() * Math.PI * 2;
    }
    
    update(mouse) {
        this.age++;
        
        // Basic movement
        this.x += this.vx;
        this.y += this.vy;
        
        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.vx -= Math.cos(angle) * force * 0.2;
            this.vy -= Math.sin(angle) * force * 0.2;
        }
        
        // Drift back to original position
        this.vx += (this.originalX - this.x) * 0.001;
        this.vy += (this.originalY - this.y) * 0.001;
        
        // Apply friction
        this.vx *= 0.98;
        this.vy *= 0.98;
        
        // Boundary check
        if (this.x < 0 || this.x > window.innerWidth) {
            this.vx *= -0.8;
        }
        if (this.y < 0 || this.y > window.innerHeight) {
            this.vy *= -0.8;
        }
        
        // Keep in bounds
        this.x = Math.max(0, Math.min(window.innerWidth, this.x));
        this.y = Math.max(0, Math.min(window.innerHeight, this.y));
        
        // Pulse animation
        this.pulse += 0.02;
    }
    
    draw(ctx) {
        const pulseSize = this.size + Math.sin(this.pulse) * 0.5;
        const opacity = 0.3 + Math.sin(this.pulse) * 0.2;
        
        // Main particle
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = this.color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
        
        // Glow effect
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseSize * 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color + '20';
        ctx.fill();
    }
}

/* ============== CONSTELLATION EFFECT ============== */
class ConstellationEffect {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.stars = [];
        this.mouse = { x: 0, y: 0 };
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.createStars();
        this.setupEventListeners();
        this.animate();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'constellation-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '0';
        this.canvas.style.opacity = '0.4';
        
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createStars();
        });
        
        document.addEventListener('mousemove', (event) => {
            this.mouse.x = event.clientX;
            this.mouse.y = event.clientY;
        });
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createStars() {
        const starCount = Math.floor((window.innerWidth * window.innerHeight) / 15000);
        this.stars = [];
        
        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                phase: Math.random() * Math.PI * 2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        
        this.stars.forEach(star => {
            // Twinkling effect
            star.phase += star.twinkleSpeed;
            const twinkle = Math.sin(star.phase) * 0.3 + 0.7;
            
            // Mouse interaction
            const dx = this.mouse.x - star.x;
            const dy = this.mouse.y - star.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 100;
            
            let brightness = star.opacity * twinkle;
            if (distance < maxDistance) {
                brightness *= (1 + (maxDistance - distance) / maxDistance);
            }
            
            // Draw star
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 199, 119, ${Math.min(brightness, 1)})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

/* ============== FLOATING ELEMENTS ============== */
class FloatingElements {
    constructor() {
        this.elements = [];
        this.init();
    }
    
    init() {
        this.createFloatingElements();
        this.animate();
    }
    
    createFloatingElements() {
        const shapes = ['◆', '◇', '●', '○', '▲', '△', '■', '□', '◈', '◊'];
        const count = window.innerWidth < 768 ? 8 : 15;
        
        for (let i = 0; i < count; i++) {
            const element = document.createElement('div');
            element.className = 'floating-geometry';
            element.textContent = shapes[Math.floor(Math.random() * shapes.length)];
            
            // Random positioning
            element.style.left = Math.random() * window.innerWidth + 'px';
            element.style.top = Math.random() * window.innerHeight + 'px';
            element.style.fontSize = (Math.random() * 20 + 15) + 'px';
            
            // Random color from Aurora Dorada palette
            const colors = ['#FFC777', '#58A6FF', '#00D4FF', '#A855F7', '#E879F9'];
            element.style.color = colors[Math.floor(Math.random() * colors.length)];
            
            // Animation delay
            element.style.animationDelay = Math.random() * 8 + 's';
            element.style.animationDuration = (Math.random() * 4 + 6) + 's';
            
            document.body.appendChild(element);
            this.elements.push(element);
        }
    }
    
    animate() {
        // Additional JavaScript-based animation for more complex effects
        this.elements.forEach((element, index) => {
            const time = Date.now() * 0.001;
            const speed = 0.5 + index * 0.1;
            
            // Sine wave movement
            const x = parseFloat(element.style.left);
            const y = parseFloat(element.style.top);
            
            element.style.transform = `
                translateX(${Math.sin(time * speed) * 20}px)
                translateY(${Math.cos(time * speed * 0.8) * 15}px)
                rotate(${Math.sin(time * speed * 0.5) * 10}deg)
                scale(${1 + Math.sin(time * speed * 1.5) * 0.1})
            `;
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        this.elements.forEach(element => element.remove());
        this.elements = [];
    }
}

/* ============== INITIALIZATION ============== */
function initParticleEffects() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        console.log('Reduced motion preferred, skipping particle effects');
        return;
    }
    
    // Check performance
    if (window.innerWidth < 768) {
        console.log('Mobile device detected, using lightweight particle effects');
        new ConstellationEffect();
        return;
    }
    
    // Initialize full particle system
    new ParticleSystem();
    new ConstellationEffect();
    new FloatingElements();
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticleEffects);
} else {
    initParticleEffects();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        ParticleSystem, 
        ConstellationEffect, 
        FloatingElements,
        initParticleEffects 
    };
}