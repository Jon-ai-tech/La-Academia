/* ============== CUSTOM CURSOR EFFECTS ============== */

class CursorEffects {
    constructor() {
        this.cursor = null;
        this.trails = [];
        this.isHovering = false;
        this.mousePosition = { x: 0, y: 0 };
        
        this.init();
        this.addEventListeners();
    }

    init() {
        // Skip on touch devices
        if (this.isTouchDevice()) {
            return;
        }

        // Create main cursor
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        document.body.appendChild(this.cursor);

        // Create cursor trails
        for (let i = 0; i < 6; i++) {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.opacity = (6 - i) / 6;
            trail.style.transform = `scale(${(6 - i) / 6})`;
            document.body.appendChild(trail);
            this.trails.push({
                element: trail,
                x: 0,
                y: 0,
                delay: i * 0.05
            });
        }

        this.animate();
    }

    addEventListeners() {
        if (this.isTouchDevice()) {
            return;
        }

        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
        });

        // Handle hover states for interactive elements
        const interactiveElements = document.querySelectorAll(
            'a, button, input, textarea, select, [role="button"], .cursor-hover'
        );

        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.setHoverState(true);
            });

            element.addEventListener('mouseleave', () => {
                this.setHoverState(false);
            });
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            if (this.cursor) {
                this.cursor.style.opacity = '0';
            }
            this.trails.forEach(trail => {
                trail.element.style.opacity = '0';
            });
        });

        document.addEventListener('mouseenter', () => {
            if (this.cursor) {
                this.cursor.style.opacity = '1';
            }
            this.trails.forEach((trail, index) => {
                trail.element.style.opacity = (6 - index) / 6;
            });
        });

        // Add click effect
        document.addEventListener('mousedown', () => {
            this.addClickEffect();
        });
    }

    setHoverState(isHovering) {
        this.isHovering = isHovering;
        
        if (this.cursor) {
            if (isHovering) {
                this.cursor.classList.add('hover');
            } else {
                this.cursor.classList.remove('hover');
            }
        }
    }

    addClickEffect() {
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.position = 'fixed';
        ripple.style.left = this.mousePosition.x + 'px';
        ripple.style.top = this.mousePosition.y + 'px';
        ripple.style.width = '0px';
        ripple.style.height = '0px';
        ripple.style.border = '2px solid #FFC777';
        ripple.style.borderRadius = '50%';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '10000';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.animation = 'cursor-ripple 0.6s ease-out forwards';
        
        document.body.appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => {
            if (document.body.contains(ripple)) {
                document.body.removeChild(ripple);
            }
        }, 600);

        // Add CSS animation if not exists
        if (!document.getElementById('cursor-effects-styles')) {
            const style = document.createElement('style');
            style.id = 'cursor-effects-styles';
            style.textContent = `
                @keyframes cursor-ripple {
                    0% {
                        width: 0px;
                        height: 0px;
                        opacity: 1;
                    }
                    100% {
                        width: 60px;
                        height: 60px;
                        opacity: 0;
                    }
                }
                
                .cursor-magnetic {
                    transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
                }
            `;
            document.head.appendChild(style);
        }
    }

    animate() {
        if (!this.cursor) return;

        // Update main cursor position
        this.cursor.style.left = this.mousePosition.x + 'px';
        this.cursor.style.top = this.mousePosition.y + 'px';

        // Update trail positions with delay
        this.trails.forEach((trail, index) => {
            const targetX = this.mousePosition.x;
            const targetY = this.mousePosition.y;
            
            // Smooth following with delay
            trail.x += (targetX - trail.x) * (0.2 - index * 0.02);
            trail.y += (targetY - trail.y) * (0.2 - index * 0.02);
            
            trail.element.style.left = trail.x + 'px';
            trail.element.style.top = trail.y + 'px';
        });

        requestAnimationFrame(() => this.animate());
    }

    addMagneticEffect(element) {
        if (this.isTouchDevice()) return;

        element.classList.add('cursor-magnetic');

        element.addEventListener('mouseenter', () => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const translateX = (this.mousePosition.x - centerX) * 0.3;
            const translateY = (this.mousePosition.y - centerY) * 0.3;
            
            element.style.transform = `translate(${translateX}px, ${translateY}px)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
        });

        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const translateX = (e.clientX - centerX) * 0.1;
            const translateY = (e.clientY - centerY) * 0.1;
            
            element.style.transform = `translate(${translateX}px, ${translateY}px)`;
        });
    }

    isTouchDevice() {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
    }

    destroy() {
        if (this.cursor && document.body.contains(this.cursor)) {
            document.body.removeChild(this.cursor);
        }

        this.trails.forEach(trail => {
            if (document.body.contains(trail.element)) {
                document.body.removeChild(trail.element);
            }
        });

        const styles = document.getElementById('cursor-effects-styles');
        if (styles) {
            document.head.removeChild(styles);
        }
    }
}

export default CursorEffects;