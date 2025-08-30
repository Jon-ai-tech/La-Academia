/**
 * ============== AUDIO PARALLAX SYNC - DOG STUDIO STYLE ==============
 * Synchronizes parallax layers with audio frequency analysis
 * Creates immersive audiovisual experience for La Academia
 */

class AudioParallaxSync {
    constructor(audioSystem, options = {}) {
        this.audioSystem = audioSystem;
        this.isEnabled = true;
        this.intensity = options.intensity || 1.0;
        
        // Parallax layers configuration
        this.layers = {
            stars: {
                elements: [],
                parallax: 0.1,
                audioFreq: 'treble',
                transform: 'scale',
                baseSize: 1,
                maxMultiplier: 1.5
            },
            nebulae: {
                elements: [],
                parallax: 0.3,
                audioFreq: 'bass',
                transform: 'opacity',
                baseOpacity: 0.6,
                maxMultiplier: 1.0
            },
            particles: {
                elements: [],
                parallax: 0.6,
                audioFreq: 'mid',
                transform: 'translate',
                baseOffset: 0,
                maxOffset: 10
            },
            waves: {
                elements: [],
                parallax: 1.2,
                audioFreq: 'all',
                transform: 'wave',
                baseAmplitude: 5,
                maxAmplitude: 20
            }
        };
        
        // Beat effect configuration
        this.beatEffects = {
            expansion: {
                duration: 300,
                scale: 1.1,
                active: false
            },
            ripple: {
                duration: 800,
                rings: 3,
                active: false
            }
        };
        
        // Performance tracking
        this.lastFrameTime = 0;
        this.frameSkip = 0;
        this.targetFPS = 60;
        
        this.init();
    }

    init() {
        // Discover and categorize parallax elements
        this.discoverElements();
        
        // Listen to audio system events
        if (this.audioSystem) {
            this.audioSystem.on('audioAnalysis', (data) => this.updateParallax(data));
            this.audioSystem.on('beatDetected', (data) => this.triggerBeatEffects(data));
        }
        
        // Setup scroll listener
        this.setupScrollListener();
        
        console.log('🌊 AudioParallaxSync initialized');
        console.log(`📊 Discovered layers:`, Object.keys(this.layers).map(key => 
            `${key}: ${this.layers[key].elements.length} elements`
        ));
    }

    // Discover elements with data attributes
    discoverElements() {
        // Find elements with parallax data attributes
        document.querySelectorAll('[data-parallax]').forEach(el => {
            const parallaxValue = parseFloat(el.dataset.parallax) || 0.5;
            const audioReactive = el.dataset.audioReactive === 'true';
            const audioFreq = el.dataset.audioFrequency || 'mid';
            const beatReactive = el.dataset.beatReactive === 'true';
            const direction = el.dataset.parallaxDirection || 'vertical';
            
            // Store original styles
            const computedStyle = getComputedStyle(el);
            el._originalTransform = el.style.transform || '';
            el._originalOpacity = computedStyle.opacity;
            
            // Categorize element
            const elementData = {
                element: el,
                parallax: parallaxValue,
                audioReactive,
                audioFreq,
                beatReactive,
                direction,
                baseTransform: el._originalTransform,
                currentOffset: { x: 0, y: 0, scale: 1, opacity: 1 }
            };
            
            // Add to appropriate layer
            if (audioReactive) {
                this.addToLayer(elementData, audioFreq);
            }
        });
        
        // Create default visual elements if none exist
        this.createDefaultElements();
    }

    // Add element to specific layer
    addToLayer(elementData, frequency) {
        if (frequency === 'treble') {
            this.layers.stars.elements.push(elementData);
        } else if (frequency === 'bass') {
            this.layers.nebulae.elements.push(elementData);
        } else if (frequency === 'mid') {
            this.layers.particles.elements.push(elementData);
        } else if (frequency === 'all') {
            this.layers.waves.elements.push(elementData);
        }
    }

    // Create default visual elements if none exist
    createDefaultElements() {
        this.createStarField();
        this.createNebulae();
        this.createFloatingParticles();
        this.createAudioWaves();
    }

    // Create animated star field (treble reactive)
    createStarField() {
        if (this.layers.stars.elements.length > 0) return;
        
        const starContainer = document.createElement('div');
        starContainer.className = 'audio-parallax-stars';
        starContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        `;
        
        // Create 50 stars
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: #FFC777;
                border-radius: 50%;
                box-shadow: 0 0 6px #FFC777;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                opacity: ${0.5 + Math.random() * 0.5};
                will-change: transform;
            `;
            
            starContainer.appendChild(star);
            
            // Add to stars layer
            this.layers.stars.elements.push({
                element: star,
                parallax: 0.1,
                audioReactive: true,
                audioFreq: 'treble',
                baseTransform: '',
                currentOffset: { x: 0, y: 0, scale: 1, opacity: parseFloat(star.style.opacity) }
            });
        }
        
        document.body.appendChild(starContainer);
    }

    // Create nebulae (bass reactive)
    createNebulae() {
        if (this.layers.nebulae.elements.length > 0) return;
        
        const nebulaContainer = document.createElement('div');
        nebulaContainer.className = 'audio-parallax-nebulae';
        nebulaContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 2;
            overflow: hidden;
        `;
        
        // Create 3 nebulae
        for (let i = 0; i < 3; i++) {
            const nebula = document.createElement('div');
            nebula.style.cssText = `
                position: absolute;
                width: ${200 + Math.random() * 300}px;
                height: ${200 + Math.random() * 300}px;
                background: radial-gradient(ellipse at center, rgba(199, 146, 234, 0.2) 0%, rgba(88, 166, 255, 0.1) 50%, transparent 100%);
                border-radius: 50%;
                top: ${Math.random() * 80}%;
                left: ${Math.random() * 80}%;
                opacity: 0.6;
                will-change: transform;
                filter: blur(2px);
            `;
            
            nebulaContainer.appendChild(nebula);
            
            // Add to nebulae layer
            this.layers.nebulae.elements.push({
                element: nebula,
                parallax: 0.3,
                audioReactive: true,
                audioFreq: 'bass',
                baseTransform: '',
                currentOffset: { x: 0, y: 0, scale: 1, opacity: 0.6 }
            });
        }
        
        document.body.appendChild(nebulaContainer);
    }

    // Create floating particles (mid reactive)
    createFloatingParticles() {
        if (this.layers.particles.elements.length > 0) return;
        
        const particleContainer = document.createElement('div');
        particleContainer.className = 'audio-parallax-particles';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 3;
            overflow: hidden;
        `;
        
        // Create 20 particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 8 + 2}px;
                height: ${Math.random() * 8 + 2}px;
                background: linear-gradient(45deg, #FFC777, #58A6FF);
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                opacity: ${0.3 + Math.random() * 0.4};
                will-change: transform;
                animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            `;
            
            particleContainer.appendChild(particle);
            
            // Add to particles layer
            this.layers.particles.elements.push({
                element: particle,
                parallax: 0.6,
                audioReactive: true,
                audioFreq: 'mid',
                baseTransform: '',
                currentOffset: { x: 0, y: 0, scale: 1, opacity: parseFloat(particle.style.opacity) }
            });
        }
        
        document.body.appendChild(particleContainer);
    }

    // Create audio waves (all frequencies reactive)
    createAudioWaves() {
        if (this.layers.waves.elements.length > 0) return;
        
        const waveContainer = document.createElement('div');
        waveContainer.className = 'audio-parallax-waves';
        waveContainer.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100px;
            pointer-events: none;
            z-index: 4;
            overflow: hidden;
        `;
        
        // Create wave SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.cssText = `
            width: 100%;
            height: 100%;
        `;
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#FFC777');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('opacity', '0.5');
        
        svg.appendChild(path);
        waveContainer.appendChild(svg);
        document.body.appendChild(waveContainer);
        
        // Add to waves layer
        this.layers.waves.elements.push({
            element: path,
            container: waveContainer,
            parallax: 1.2,
            audioReactive: true,
            audioFreq: 'all',
            baseTransform: '',
            currentOffset: { x: 0, y: 0, scale: 1, opacity: 0.5 }
        });
    }

    // Main parallax update function
    updateParallax(audioData) {
        if (!this.isEnabled) return;
        
        // Performance throttling
        const now = Date.now();
        if (now - this.lastFrameTime < 1000 / this.targetFPS) return;
        this.lastFrameTime = now;
        
        const { frequencies } = audioData;
        const scrollY = window.pageYOffset;
        
        // Update each layer
        Object.keys(this.layers).forEach(layerName => {
            const layer = this.layers[layerName];
            this.updateLayer(layer, frequencies, scrollY);
        });
    }

    // Update specific layer
    updateLayer(layer, frequencies, scrollY) {
        const audioIntensity = this.getAudioIntensity(layer.audioFreq, frequencies);
        
        layer.elements.forEach(elementData => {
            const { element, parallax, direction, currentOffset } = elementData;
            
            // Calculate parallax offset
            let parallaxY = 0;
            let parallaxX = 0;
            
            if (direction === 'vertical' || direction === 'both') {
                parallaxY = scrollY * parallax;
            }
            if (direction === 'horizontal' || direction === 'both') {
                parallaxX = scrollY * parallax * 0.5;
            }
            
            // Apply audio reactivity
            if (elementData.audioReactive) {
                this.applyAudioTransform(element, layer, audioIntensity, currentOffset);
            }
            
            // Apply parallax transform
            const transform = `translate3d(${parallaxX + currentOffset.x}px, ${parallaxY + currentOffset.y}px, 0) scale(${currentOffset.scale})`;
            element.style.transform = elementData.baseTransform + ' ' + transform;
            
            if (currentOffset.opacity !== 1) {
                element.style.opacity = currentOffset.opacity;
            }
        });
    }

    // Apply audio-based transformations
    applyAudioTransform(element, layer, intensity, currentOffset) {
        const multipliedIntensity = intensity * this.intensity;
        
        switch (layer.transform) {
            case 'scale':
                currentOffset.scale = layer.baseSize + (multipliedIntensity * (layer.maxMultiplier - layer.baseSize));
                break;
                
            case 'opacity':
                currentOffset.opacity = layer.baseOpacity + (multipliedIntensity * (layer.maxMultiplier - layer.baseOpacity));
                break;
                
            case 'translate':
                const offsetAmount = multipliedIntensity * layer.maxOffset;
                currentOffset.x = Math.sin(Date.now() * 0.001) * offsetAmount;
                currentOffset.y = Math.cos(Date.now() * 0.001) * offsetAmount;
                break;
                
            case 'wave':
                if (element.tagName === 'path') {
                    this.updateWavePath(element, intensity, layer);
                }
                break;
        }
    }

    // Update wave path based on audio
    updateWavePath(path, intensity, layer) {
        const container = path.parentElement;
        if (!container) return;
        
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        const amplitude = layer.baseAmplitude + (intensity * layer.maxAmplitude);
        
        let pathString = `M 0 ${height / 2}`;
        
        // Create wave based on audio intensity
        const points = 20;
        for (let i = 1; i <= points; i++) {
            const x = (width / points) * i;
            const y = height / 2 + Math.sin((i / points) * Math.PI * 2 + Date.now() * 0.002) * amplitude;
            pathString += ` L ${x} ${y}`;
        }
        
        path.setAttribute('d', pathString);
    }

    // Get audio intensity for specific frequency range
    getAudioIntensity(freqRange, frequencies) {
        switch (freqRange) {
            case 'bass': return frequencies.bass || 0;
            case 'mid': return frequencies.mid || 0;
            case 'treble': return frequencies.treble || 0;
            case 'all': return (frequencies.bass + frequencies.mid + frequencies.treble) / 3 || 0;
            default: return 0;
        }
    }

    // Trigger beat effects
    triggerBeatEffects(beatData) {
        if (!this.isEnabled) return;
        
        // Expansion effect
        this.triggerExpansion(beatData);
        
        // Ripple effect
        this.triggerRipple(beatData);
    }

    // Beat expansion effect
    triggerExpansion(beatData) {
        const { expansion } = this.beatEffects;
        if (expansion.active) return;
        
        expansion.active = true;
        
        // Apply to all layers
        Object.values(this.layers).forEach(layer => {
            layer.elements.forEach(({ element }) => {
                element.style.transition = `transform ${expansion.duration}ms ease-out`;
                element.style.transform += ` scale(${expansion.scale})`;
                
                setTimeout(() => {
                    element.style.transform = element.style.transform.replace(` scale(${expansion.scale})`, '');
                }, expansion.duration / 2);
            });
        });
        
        setTimeout(() => {
            expansion.active = false;
        }, expansion.duration);
    }

    // Beat ripple effect
    triggerRipple(beatData) {
        const { ripple } = this.beatEffects;
        if (ripple.active) return;
        
        ripple.active = true;
        
        // Create ripple element
        const rippleElement = document.createElement('div');
        rippleElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border: 2px solid #FFC777;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            opacity: 0.7;
            transform: translate(-50%, -50%);
            animation: rippleExpand ${ripple.duration}ms ease-out forwards;
        `;
        
        document.body.appendChild(rippleElement);
        
        setTimeout(() => {
            document.body.removeChild(rippleElement);
            ripple.active = false;
        }, ripple.duration);
    }

    // Setup scroll listener for parallax
    setupScrollListener() {
        let ticking = false;
        
        const updateParallaxScroll = () => {
            if (this.audioSystem && this.audioSystem.dataArray) {
                // Use current audio data for scroll-based updates
                const frequencies = this.audioSystem.getFrequencyData();
                this.updateParallax({ frequencies });
            }
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallaxScroll);
                ticking = true;
            }
        });
    }

    // Public API
    setIntensity(intensity) {
        this.intensity = Math.max(0, Math.min(3, intensity));
    }

    toggle() {
        this.isEnabled = !this.isEnabled;
        
        if (!this.isEnabled) {
            // Reset all elements
            Object.values(this.layers).forEach(layer => {
                layer.elements.forEach(({ element, baseTransform }) => {
                    element.style.transform = baseTransform;
                    element.style.opacity = element._originalOpacity || '';
                });
            });
        }
    }

    destroy() {
        // Remove created elements
        ['.audio-parallax-stars', '.audio-parallax-nebulae', '.audio-parallax-particles', '.audio-parallax-waves']
            .forEach(selector => {
                const el = document.querySelector(selector);
                if (el) el.remove();
            });
        
        console.log('🌊 AudioParallaxSync destroyed');
    }
}

// Add required CSS animations
if (!document.querySelector('#audio-parallax-styles')) {
    const style = document.createElement('style');
    style.id = 'audio-parallax-styles';
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(120deg); }
            66% { transform: translateY(5px) rotate(240deg); }
        }
        
        @keyframes rippleExpand {
            0% {
                width: 0;
                height: 0;
                opacity: 0.7;
            }
            100% {
                width: 300px;
                height: 300px;
                opacity: 0;
            }
        }
        
        .audio-parallax-stars,
        .audio-parallax-nebulae,
        .audio-parallax-particles,
        .audio-parallax-waves {
            will-change: transform;
            backface-visibility: hidden;
        }
    `;
    document.head.appendChild(style);
}

// Export for use
window.AudioParallaxSync = AudioParallaxSync;