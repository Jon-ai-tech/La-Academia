/* ============== LOCOMOTIVE SCROLL SETUP ============== */

import LocomotiveScroll from 'locomotive-scroll';

class SmoothScrollManager {
    constructor() {
        this.scroll = null;
        this.init();
    }

    init() {
        // Initialize Locomotive Scroll
        this.scroll = new LocomotiveScroll({
            el: document.querySelector('[data-scroll-container]'),
            smooth: true,
            multiplier: 1,
            class: 'is-reveal',
            smartphone: {
                smooth: true
            },
            tablet: {
                smooth: true
            }
        });

        // Update scroll after images load
        this.scroll.on('scroll', (instance) => {
            // Update custom cursor position if needed
            document.dispatchEvent(new CustomEvent('locomotive-scroll', {
                detail: instance
            }));
        });

        // Refresh scroll after everything is loaded
        window.addEventListener('load', () => {
            this.scroll.update();
        });

        // Handle resize
        window.addEventListener('resize', () => {
            this.scroll.update();
        });

        this.setupScrollTriggers();
    }

    setupScrollTriggers() {
        // Add custom scroll triggers for specific elements
        const elements = document.querySelectorAll('[data-scroll]');
        
        elements.forEach(element => {
            this.scroll.on('call', (value, way, obj) => {
                // Handle custom scroll events
                if (obj.el === element) {
                    element.classList.add('is-inview');
                }
            });
        });
    }

    destroy() {
        if (this.scroll) {
            this.scroll.destroy();
        }
    }

    update() {
        if (this.scroll) {
            this.scroll.update();
        }
    }
}

export default SmoothScrollManager;