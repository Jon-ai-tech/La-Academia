/**
 * ============== UNIFIED AUDIO SYSTEM ==============
 * Consolidated audio system for La Academia
 * Replaces multiple conflicting audio systems with one optimized solution
 */

class UnifiedAudio {
    constructor(options = {}) {
        this.options = {
            volume: options.volume || 0.7,
            enabled: options.enabled !== false,
            fftSize: options.fftSize || 1024,
            smoothing: options.smoothing || 0.8
        };
        
        this.context = null;
        this.analyser = null;
        this.gainNode = null;
        this.dataArray = null;
        
        this.audioElements = new Map();
        this.isEnabled = this.options.enabled;
        this.isInitialized = false;
        
        // Sound library for UI interactions
        this.uiSounds = {
            hover: { frequency: 800, type: 'sine', duration: 100, volume: 0.1 },
            click: { frequency: 1200, type: 'square', duration: 150, volume: 0.15 },
            success: { frequency: 600, type: 'triangle', duration: 300, volume: 0.2 },
            notification: { frequency: 440, type: 'sawtooth', duration: 200, volume: 0.12 }
        };
        
        this.beatDetection = {
            lastBeat: 0,
            threshold: 0.3,
            decay: 0.98,
            sensitivity: 1.0
        };
        
        this.listeners = new Map();
    }
    
    async init() {
        if (this.isInitialized || !this.isEnabled) return;
        
        try {
            // Create audio context
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create analyser
            this.analyser = this.context.createAnalyser();
            this.analyser.fftSize = this.options.fftSize;
            this.analyser.smoothingTimeConstant = this.options.smoothing;
            
            // Create gain node for master volume
            this.gainNode = this.context.createGain();
            this.gainNode.gain.setValueAtTime(this.options.volume, this.context.currentTime);
            
            // Connect gain to destination
            this.gainNode.connect(this.context.destination);
            
            // Create data array for frequency analysis
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            
            this.isInitialized = true;
            console.log('🎵 Unified Audio System initialized');
            
            // Start analysis loop if we have audio
            this.startAnalysis();
            
        } catch (error) {
            console.warn('⚠️ Audio initialization failed:', error);
            this.isEnabled = false;
        }
    }
    
    async enable() {
        if (!this.isEnabled) {
            this.isEnabled = true;
            await this.init();
        }
        
        // Resume audio context if suspended
        if (this.context && this.context.state === 'suspended') {
            await this.context.resume();
        }
    }
    
    disable() {
        this.isEnabled = false;
        if (this.context && this.context.state === 'running') {
            this.context.suspend();
        }
    }
    
    toggle() {
        if (this.isEnabled) {
            this.disable();
        } else {
            this.enable();
        }
        return this.isEnabled;
    }
    
    setVolume(volume) {
        this.options.volume = Math.max(0, Math.min(1, volume));
        
        if (this.gainNode) {
            this.gainNode.gain.setValueAtTime(
                this.options.volume, 
                this.context.currentTime
            );
        }
    }
    
    // Play UI sounds using Web Audio API
    playUISound(soundType) {
        if (!this.isEnabled || !this.context || !this.uiSounds[soundType]) return;
        
        try {
            const sound = this.uiSounds[soundType];
            const oscillator = this.context.createOscillator();
            const envelope = this.context.createGain();
            
            oscillator.connect(envelope);
            envelope.connect(this.gainNode);
            
            oscillator.frequency.setValueAtTime(sound.frequency, this.context.currentTime);
            oscillator.type = sound.type;
            
            // ADSR envelope
            envelope.gain.setValueAtTime(0, this.context.currentTime);
            envelope.gain.linearRampToValueAtTime(sound.volume, this.context.currentTime + 0.01);
            envelope.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + sound.duration / 1000);
            
            oscillator.start(this.context.currentTime);
            oscillator.stop(this.context.currentTime + sound.duration / 1000);
            
        } catch (error) {
            console.warn('Failed to play UI sound:', error);
        }
    }
    
    // Load and manage audio files
    async loadAudio(id, url, options = {}) {
        if (!this.isEnabled || !this.context) return null;
        
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
            
            const audioData = {
                buffer: audioBuffer,
                source: null,
                gainNode: null,
                isPlaying: false,
                loop: options.loop || false,
                volume: options.volume || 1.0
            };
            
            this.audioElements.set(id, audioData);
            return audioData;
            
        } catch (error) {
            console.warn(`Failed to load audio "${id}":`, error);
            return null;
        }
    }
    
    // Play audio with crossfading support
    async playAudio(id, options = {}) {
        if (!this.isEnabled || !this.context) return;
        
        const audioData = this.audioElements.get(id);
        if (!audioData) return;
        
        try {
            // Stop existing source
            if (audioData.source) {
                audioData.source.stop();
            }
            
            // Create new source
            audioData.source = this.context.createBufferSource();
            audioData.source.buffer = audioData.buffer;
            audioData.source.loop = audioData.loop;
            
            // Create gain node for this audio
            audioData.gainNode = this.context.createGain();
            audioData.gainNode.gain.setValueAtTime(0, this.context.currentTime);
            
            // Connect: source -> gain -> analyser -> master gain -> destination
            audioData.source.connect(audioData.gainNode);
            audioData.gainNode.connect(this.analyser);
            this.analyser.connect(this.gainNode);
            
            // Fade in
            const fadeInTime = options.fadeIn || 0.5;
            audioData.gainNode.gain.linearRampToValueAtTime(
                audioData.volume, 
                this.context.currentTime + fadeInTime
            );
            
            audioData.source.start();
            audioData.isPlaying = true;
            
            // Handle ended event
            audioData.source.onended = () => {
                audioData.isPlaying = false;
            };
            
        } catch (error) {
            console.warn(`Failed to play audio "${id}":`, error);
        }
    }
    
    stopAudio(id, options = {}) {
        const audioData = this.audioElements.get(id);
        if (!audioData || !audioData.source || !audioData.isPlaying) return;
        
        const fadeOutTime = options.fadeOut || 0.5;
        
        if (audioData.gainNode) {
            audioData.gainNode.gain.linearRampToValueAtTime(
                0, 
                this.context.currentTime + fadeOutTime
            );
            
            setTimeout(() => {
                if (audioData.source) {
                    audioData.source.stop();
                    audioData.isPlaying = false;
                }
            }, fadeOutTime * 1000);
        }
    }
    
    // Audio analysis for visual effects
    startAnalysis() {
        if (!this.isEnabled || !this.analyser) return;
        
        const analyze = () => {
            if (!this.isEnabled || !this.analyser) return;
            
            this.analyser.getByteFrequencyData(this.dataArray);
            
            // Calculate frequency bands
            const frequencies = this.getFrequencyBands();
            
            // Beat detection
            const beat = this.detectBeat(frequencies);
            
            // Emit events
            this.emit('audioAnalysis', { frequencies, beat });
            
            if (beat) {
                this.emit('beat', { strength: beat.strength, frequencies });
            }
            
            requestAnimationFrame(analyze);
        };
        
        analyze();
    }
    
    getFrequencyBands() {
        if (!this.dataArray) return { bass: 0, mid: 0, treble: 0, overall: 0 };
        
        const length = this.dataArray.length;
        const bass = this.getAverageFrequency(0, length * 0.1);
        const mid = this.getAverageFrequency(length * 0.1, length * 0.6);
        const treble = this.getAverageFrequency(length * 0.6, length);
        const overall = this.getAverageFrequency(0, length);
        
        return {
            bass: bass / 255,
            mid: mid / 255,
            treble: treble / 255,
            overall: overall / 255
        };
    }
    
    getAverageFrequency(startIndex, endIndex) {
        let sum = 0;
        for (let i = startIndex; i < endIndex; i++) {
            sum += this.dataArray[i];
        }
        return sum / (endIndex - startIndex);
    }
    
    detectBeat(frequencies) {
        const now = Date.now();
        const bassEnergy = frequencies.bass;
        
        // Simple beat detection based on bass energy
        if (bassEnergy > this.beatDetection.threshold) {
            if (now - this.beatDetection.lastBeat > 300) { // Minimum time between beats
                this.beatDetection.lastBeat = now;
                return {
                    detected: true,
                    strength: bassEnergy,
                    time: now
                };
            }
        }
        
        // Decay threshold
        this.beatDetection.threshold *= this.beatDetection.decay;
        this.beatDetection.threshold = Math.max(0.1, this.beatDetection.threshold);
        
        return null;
    }
    
    // Event system
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }
    
    emit(event, data) {
        const eventListeners = this.listeners.get(event) || [];
        eventListeners.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.warn(`Error in audio event listener for "${event}":`, error);
            }
        });
    }
    
    // Handle page visibility for performance
    pause() {
        this.audioElements.forEach((audioData, id) => {
            if (audioData.isPlaying && !audioData.loop) {
                this.stopAudio(id, { fadeOut: 0.1 });
            }
        });
        
        if (this.context && this.context.state === 'running') {
            this.context.suspend();
        }
    }
    
    resume() {
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    }
    
    destroy() {
        // Stop all audio
        this.audioElements.forEach((audioData, id) => {
            this.stopAudio(id, { fadeOut: 0 });
        });
        
        // Clear all references
        this.audioElements.clear();
        this.listeners.clear();
        
        // Close audio context
        if (this.context) {
            this.context.close();
        }
        
        console.log('🧹 Unified Audio System destroyed');
    }
}

// Make available globally
window.UnifiedAudio = UnifiedAudio;

// Auto-initialize global instance
window.addEventListener('laacademia:userInteraction', () => {
    if (!window.unifiedAudio) {
        window.unifiedAudio = new UnifiedAudio();
        window.unifiedAudio.init();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnifiedAudio;
}