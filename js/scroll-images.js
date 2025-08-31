/**
 * ============== SCROLL IMAGES CONFIGURATION ==============
 * Configuration for the Moto Scroll 2D image sequence
 * Defines image paths, timing, and scroll triggers
 */

class ScrollImagesConfig {
    constructor() {
        this.config = {
            // Image sequence settings
            basePath: 'assets/scroll-sequence/',
            imageFormat: 'jpg',
            totalFrames: 151,
            frameStart: 1,
            
            // Image dimensions (for optimization)
            targetWidth: 1920,
            targetHeight: 1080,
            
            // Performance settings
            preloadChunks: 20,
            maxConcurrentLoads: 5,
            
            // Scroll mapping
            scrollTriggers: [
                { start: 0, end: 0.2, frameRange: [1, 30] },      // Opening sequence
                { start: 0.2, end: 0.5, frameRange: [30, 75] },   // Main animation
                { start: 0.5, end: 0.8, frameRange: [75, 120] },  // Climax
                { start: 0.8, end: 1.0, frameRange: [120, 151] }  // Ending
            ],
            
            // Fallback images for missing frames
            placeholders: {
                loading: 'assets/placeholders/loading.jpg',
                error: 'assets/placeholders/missing.jpg'
            }
        };
    }
    
    // Generate complete image list with metadata
    generateImageList() {
        const images = [];
        
        for (let i = this.config.frameStart; i <= this.config.totalFrames; i++) {
            const frameNumber = i.toString().padStart(4, '0');
            const filename = `frame_${frameNumber}.${this.config.imageFormat}`;
            const fullPath = `${this.config.basePath}${filename}`;
            
            // Find which scroll trigger this frame belongs to
            const trigger = this.findScrollTrigger(i);
            
            images.push({
                index: i - 1, // 0-based index
                frameNumber: i,
                filename: filename,
                path: fullPath,
                trigger: trigger,
                loaded: false,
                loading: false,
                img: null,
                priority: this.calculatePriority(i)
            });
        }
        
        return images;
    }
    
    findScrollTrigger(frameNumber) {
        for (const trigger of this.config.scrollTriggers) {
            if (frameNumber >= trigger.frameRange[0] && frameNumber <= trigger.frameRange[1]) {
                return trigger;
            }
        }
        
        // Default to first trigger if not found
        return this.config.scrollTriggers[0];
    }
    
    calculatePriority(frameNumber) {
        // Higher priority for frames that are likely to be seen first
        if (frameNumber <= 10) return 1; // Highest priority for opening frames
        if (frameNumber <= 30) return 2; // High priority for early frames
        if (frameNumber >= this.config.totalFrames - 10) return 3; // High priority for ending frames
        return 4; // Normal priority for middle frames
    }
    
    // Get scroll percentage for a specific frame
    getScrollPercentForFrame(frameNumber) {
        const trigger = this.findScrollTrigger(frameNumber);
        if (!trigger) return 0;
        
        const frameProgress = (frameNumber - trigger.frameRange[0]) / 
                            (trigger.frameRange[1] - trigger.frameRange[0]);
        
        return trigger.start + (frameProgress * (trigger.end - trigger.start));
    }
    
    // Get frame number for a scroll percentage
    getFrameForScrollPercent(scrollPercent) {
        // Find the appropriate trigger
        let currentTrigger = null;
        
        for (const trigger of this.config.scrollTriggers) {
            if (scrollPercent >= trigger.start && scrollPercent <= trigger.end) {
                currentTrigger = trigger;
                break;
            }
        }
        
        if (!currentTrigger) {
            // Handle edge cases
            if (scrollPercent < 0) return this.config.frameStart;
            if (scrollPercent > 1) return this.config.totalFrames;
            return this.config.frameStart;
        }
        
        // Calculate frame within the trigger range
        const triggerProgress = (scrollPercent - currentTrigger.start) / 
                              (currentTrigger.end - currentTrigger.start);
        
        const frameRange = currentTrigger.frameRange[1] - currentTrigger.frameRange[0];
        const targetFrame = currentTrigger.frameRange[0] + (triggerProgress * frameRange);
        
        return Math.floor(Math.max(this.config.frameStart, 
                         Math.min(this.config.totalFrames, targetFrame)));
    }
    
    // Get preload strategy based on current frame
    getPreloadStrategy(currentFrame) {
        const strategy = {
            immediate: [], // Load these frames immediately
            background: [], // Load these frames in background
            priority: []   // Load these frames with high priority
        };
        
        // Always preload frames around current position
        const immediateRange = 5;
        const backgroundRange = 15;
        
        for (let i = -immediateRange; i <= immediateRange; i++) {
            const targetFrame = currentFrame + i;
            if (targetFrame >= this.config.frameStart && targetFrame <= this.config.totalFrames) {
                strategy.immediate.push(targetFrame);
            }
        }
        
        for (let i = -backgroundRange; i <= backgroundRange; i++) {
            const targetFrame = currentFrame + i;
            if (targetFrame >= this.config.frameStart && 
                targetFrame <= this.config.totalFrames && 
                !strategy.immediate.includes(targetFrame)) {
                strategy.background.push(targetFrame);
            }
        }
        
        // Add high priority frames (beginning and end)
        for (let i = this.config.frameStart; i <= Math.min(this.config.frameStart + 10, this.config.totalFrames); i++) {
            if (!strategy.immediate.includes(i) && !strategy.background.includes(i)) {
                strategy.priority.push(i);
            }
        }
        
        return strategy;
    }
    
    // Validate image paths (useful for development)
    async validateImagePaths() {
        console.log('🔍 Validating image paths...');
        
        const results = {
            total: this.config.totalFrames,
            found: 0,
            missing: [],
            errors: []
        };
        
        const images = this.generateImageList();
        const checkPromises = images.slice(0, 10).map(async (imageData) => {
            try {
                const response = await fetch(imageData.path, { method: 'HEAD' });
                if (response.ok) {
                    results.found++;
                } else {
                    results.missing.push(imageData.frameNumber);
                }
            } catch (error) {
                results.errors.push({
                    frame: imageData.frameNumber,
                    error: error.message
                });
            }
        });
        
        await Promise.all(checkPromises);
        
        console.log(`🔍 Validation complete: ${results.found}/${Math.min(10, results.total)} found`);
        if (results.missing.length > 0) {
            console.warn('🔍 Missing frames (sample):', results.missing);
        }
        
        return results;
    }
    
    // Create placeholder images directory structure
    createDirectoryStructure() {
        const structure = {
            baseDirectory: this.config.basePath,
            placeholderDirectory: 'assets/placeholders/',
            requiredFiles: [
                `${this.config.basePath}frame_0001.${this.config.imageFormat}`,
                `${this.config.basePath}frame_0075.${this.config.imageFormat}`,
                `${this.config.basePath}frame_0151.${this.config.imageFormat}`,
                'assets/placeholders/loading.jpg',
                'assets/placeholders/missing.jpg'
            ]
        };
        
        return structure;
    }
    
    // Get configuration for external use
    getConfig() {
        return { ...this.config };
    }
    
    // Update configuration
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}

// Create global instance
window.scrollImagesConfig = new ScrollImagesConfig();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrollImagesConfig;
}

// Auto-generate placeholder images if in development mode
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🏍️ Development mode detected - scroll images configuration loaded');
    
    // Provide helpful debugging
    window.debugScrollImages = {
        config: window.scrollImagesConfig,
        validate: () => window.scrollImagesConfig.validateImagePaths(),
        structure: () => window.scrollImagesConfig.createDirectoryStructure()
    };
}