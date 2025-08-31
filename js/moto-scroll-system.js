/**
 * ============== MOTO SCROLL SYSTEM 2D ==============
 * Image sequence scroll effect inspired by midudev's moto-scroll project
 * Creates smooth 2D animation based on scroll progress
 */

class MotoScrollSystem {
    constructor(options = {}) {
        this.options = {
            container: options.container || document.querySelector('.moto-scroll-container'),
            imageBasePath: options.imageBasePath || 'assets/scroll-sequence/',
            imageFormat: options.imageFormat || 'jpg',
            totalFrames: options.totalFrames || 151,
            frameStart: options.frameStart || 1,
            enabled: options.enabled !== false,
            preloadChunk: options.preloadChunk || 10, // Load images in chunks
            throttleDelay: options.throttleDelay || 16 // ~60fps
        };
        
        this.images = [];
        this.loadedImages = new Set();
        this.currentFrame = 0;
        this.targetFrame = 0;
        this.isLoading = false;
        this.isEnabled = this.options.enabled;
        
        this.canvas = null;
        this.ctx = null;
        this.canvasContainer = null;
        
        this.preloadQueue = [];
        this.loadingChunk = false;
        
        // Performance tracking
        this.lastScrollTime = 0;
        this.frameSkip = 0;
        
        this.init();
    }
    
    init() {
        if (!this.isEnabled) {
            console.log('🏍️ Moto Scroll disabled');
            return;
        }
        
        console.log('🏍️ Initializing Moto Scroll System...');
        
        this.setupCanvas();
        this.generateImageList();
        this.setupScrollTrigger();
        this.startPreloading();
        
        // Setup resize handler
        window.addEventListener('resize', this.throttle(() => {
            this.handleResize();
        }, 250));
        
        console.log('🏍️ Moto Scroll System initialized');
    }
    
    setupCanvas() {
        // Create canvas container if it doesn't exist
        this.canvasContainer = this.options.container;
        if (!this.canvasContainer) {
            this.canvasContainer = document.createElement('div');
            this.canvasContainer.className = 'moto-scroll-container';
            this.canvasContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: -1;
                pointer-events: none;
            `;
            document.body.appendChild(this.canvasContainer);
        }
        
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
        `;
        
        this.ctx = this.canvas.getContext('2d');
        this.canvasContainer.appendChild(this.canvas);
        
        // Set initial canvas size
        this.handleResize();
    }
    
    generateImageList() {
        this.images = [];
        
        for (let i = this.options.frameStart; i <= this.options.totalFrames; i++) {
            const frameNumber = i.toString().padStart(4, '0');
            const imagePath = `${this.options.imageBasePath}frame_${frameNumber}.${this.options.imageFormat}`;
            
            this.images.push({
                src: imagePath,
                img: null,
                loaded: false,
                loading: false
            });
        }
        
        console.log(`🏍️ Generated ${this.images.length} frame sequence`);
    }
    
    startPreloading() {
        // Start with loading the first few frames
        this.preloadChunk(0, Math.min(this.options.preloadChunk, this.images.length));
    }
    
    async preloadChunk(startIndex, endIndex) {
        if (this.loadingChunk) return;
        
        this.loadingChunk = true;
        console.log(`🏍️ Preloading frames ${startIndex} to ${endIndex}`);
        
        const promises = [];
        
        for (let i = startIndex; i < endIndex; i++) {
            if (i >= this.images.length || this.images[i].loaded || this.images[i].loading) continue;
            
            this.images[i].loading = true;
            
            const promise = new Promise((resolve, reject) => {
                const img = new Image();
                
                img.onload = () => {
                    this.images[i].img = img;
                    this.images[i].loaded = true;
                    this.images[i].loading = false;
                    this.loadedImages.add(i);
                    resolve(i);
                };
                
                img.onerror = () => {
                    // Create placeholder for missing images
                    this.images[i].img = this.createPlaceholderImage(i);
                    this.images[i].loaded = true;
                    this.images[i].loading = false;
                    console.warn(`🏍️ Failed to load frame ${i + 1}, using placeholder`);
                    resolve(i);
                };
                
                img.src = this.images[i].src;
            });
            
            promises.push(promise);
        }
        
        try {
            await Promise.all(promises);
            console.log(`🏍️ Loaded chunk: ${startIndex}-${endIndex}`);
        } catch (error) {
            console.warn('🏍️ Error loading image chunk:', error);
        }
        
        this.loadingChunk = false;
        
        // Render the first frame if this was the initial load
        if (startIndex === 0) {
            this.render();
        }
    }
    
    createPlaceholderImage(frameIndex) {
        // Create a simple placeholder canvas
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        
        // Draw a simple placeholder
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#FFC777';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Frame ${frameIndex + 1}`, canvas.width / 2, canvas.height / 2);
        
        // Convert to image
        const img = new Image();
        img.src = canvas.toDataURL();
        return img;
    }
    
    setupScrollTrigger() {
        // Calculate scroll triggers based on document height
        this.updateScrollTriggers();
        
        // Listen for scroll events (will be called by the unified controller)
    }
    
    updateScrollTriggers() {
        // This will be called when document height changes
        const documentHeight = document.body.scrollHeight;
        const windowHeight = window.innerHeight;
        this.scrollHeight = documentHeight - windowHeight;
        
        console.log(`🏍️ Updated scroll triggers: ${this.scrollHeight}px total scroll`);
    }
    
    update(scrollPercent) {
        if (!this.isEnabled || !this.images.length) return;
        
        const now = Date.now();
        if (now - this.lastScrollTime < this.options.throttleDelay) return;
        this.lastScrollTime = now;
        
        // Calculate target frame based on scroll percentage
        this.targetFrame = Math.floor(scrollPercent * (this.images.length - 1));
        this.targetFrame = Math.max(0, Math.min(this.images.length - 1, this.targetFrame));
        
        // Smooth frame transition
        if (this.currentFrame !== this.targetFrame) {
            this.currentFrame = this.targetFrame; // Direct assignment for now, could add easing
            this.render();
            this.preloadNearbyFrames();
        }
    }
    
    preloadNearbyFrames() {
        // Preload frames around current frame
        const preloadRange = this.options.preloadChunk;
        const start = Math.max(0, this.currentFrame - preloadRange);
        const end = Math.min(this.images.length, this.currentFrame + preloadRange);
        
        // Check if we need to load more frames
        let needsLoading = false;
        for (let i = start; i < end; i++) {
            if (!this.images[i].loaded && !this.images[i].loading) {
                needsLoading = true;
                break;
            }
        }
        
        if (needsLoading && !this.loadingChunk) {
            this.preloadChunk(start, end);
        }
    }
    
    render() {
        if (!this.ctx || !this.canvas) return;
        
        const frameData = this.images[this.currentFrame];
        
        if (!frameData || !frameData.loaded || !frameData.img) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw current frame
        this.drawImageCover(frameData.img);
        
        // Debug info (remove in production)
        if (window.location.search.includes('debug')) {
            this.drawDebugInfo();
        }
    }
    
    drawImageCover(img) {
        // Draw image to cover the entire canvas (like CSS object-fit: cover)
        const canvasRatio = this.canvas.width / this.canvas.height;
        const imgRatio = img.width / img.height;
        
        let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
        
        if (canvasRatio > imgRatio) {
            // Canvas is wider than image
            drawWidth = this.canvas.width;
            drawHeight = drawWidth / imgRatio;
            offsetY = (this.canvas.height - drawHeight) / 2;
        } else {
            // Canvas is taller than image
            drawHeight = this.canvas.height;
            drawWidth = drawHeight * imgRatio;
            offsetX = (this.canvas.width - drawWidth) / 2;
        }
        
        this.ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }
    
    drawDebugInfo() {
        this.ctx.fillStyle = 'rgba(255, 199, 119, 0.8)';
        this.ctx.fillRect(10, 10, 200, 60);
        
        this.ctx.fillStyle = '#000';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`Frame: ${this.currentFrame + 1}/${this.images.length}`, 15, 25);
        this.ctx.fillText(`Loaded: ${this.loadedImages.size}/${this.images.length}`, 15, 40);
        this.ctx.fillText(`Loading: ${this.loadingChunk ? 'Yes' : 'No'}`, 15, 55);
    }
    
    handleResize() {
        if (!this.canvas) return;
        
        const rect = this.canvasContainer.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        // Set actual canvas size (accounting for device pixel ratio)
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        // Scale context to match device pixel ratio
        this.ctx.scale(dpr, dpr);
        
        // Re-render current frame
        this.render();
    }
    
    // Utility function
    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }
    
    // Public API
    setEnabled(enabled) {
        this.isEnabled = enabled;
        if (!enabled && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    goToFrame(frameIndex) {
        if (frameIndex >= 0 && frameIndex < this.images.length) {
            this.currentFrame = frameIndex;
            this.targetFrame = frameIndex;
            this.render();
            this.preloadNearbyFrames();
        }
    }
    
    getProgress() {
        return this.images.length > 0 ? this.currentFrame / (this.images.length - 1) : 0;
    }
    
    getLoadingProgress() {
        return this.images.length > 0 ? this.loadedImages.size / this.images.length : 0;
    }
    
    destroy() {
        // Remove canvas
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        // Clear image references
        this.images.forEach(imageData => {
            if (imageData.img) {
                imageData.img.src = '';
                imageData.img = null;
            }
        });
        
        this.images = [];
        this.loadedImages.clear();
        
        console.log('🧹 Moto Scroll System destroyed');
    }
}

// Make available globally
window.MotoScrollSystem = MotoScrollSystem;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MotoScrollSystem;
}