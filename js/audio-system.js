/**
 * ============== AUDIO SYSTEM - DOG STUDIO INSPIRED ============== 
 * Advanced Web Audio API system with FFT analysis and beat detection
 * Optimized for La Academia Maia Kode experience
 */

class AudioSystem {
    constructor(options = {}) {
        this.context = null;
        this.analyser = null;
        this.dataArray = null;
        this.bufferLength = 0;
        
        // Audio sources
        this.currentAudio = null;
        this.audioElements = new Map();
        
        // FFT Analysis
        this.fftSize = options.fftSize || 2048;
        this.smoothingTimeConstant = options.smoothing || 0.8;
        
        // Beat detection
        this.beatThreshold = options.beatThreshold || 0.3;
        this.beatSensitivity = options.beatSensitivity || 1.2;
        this.lastBeatTime = 0;
        this.beatCooldown = options.beatCooldown || 200; // ms
        
        // Frequency ranges (0-100% of spectrum)
        this.frequencies = {
            bass: { start: 0, end: 0.1 },      // 0-10% for nebulae
            mid: { start: 0.1, end: 0.6 },    // 10-60% for particles  
            treble: { start: 0.6, end: 1.0 }  // 60-100% for stars
        };
        
        // Volume management
        this.masterVolume = options.volume || 0.7;
        this.adaptiveVolume = true;
        this.volumeByTime = this.getVolumeByTime();
        
        // Crossfade system
        this.crossfadeDuration = options.crossfade || 2000; // ms
        this.crossfading = false;
        
        // Event system
        this.listeners = new Map();
        
        // Initialize
        this.init();
    }

    async init() {
        try {
            // Create audio context
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
            
            // Create analyser
            this.analyser = this.context.createAnalyser();
            this.analyser.fftSize = this.fftSize;
            this.analyser.smoothingTimeConstant = this.smoothingTimeConstant;
            
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
            
            // Connect to destination
            this.analyser.connect(this.context.destination);
            
            // Start analysis loop
            this.startAnalysis();
            
            console.log('🎵 AudioSystem initialized successfully');
            this.emit('initialized');
            
        } catch (error) {
            console.error('❌ AudioSystem initialization failed:', error);
            this.emit('error', error);
        }
    }

    // Load audio file
    async loadAudio(id, url, options = {}) {
        try {
            const audio = new Audio(url);
            audio.crossOrigin = 'anonymous';
            audio.loop = options.loop || false;
            audio.volume = (options.volume || 1) * this.masterVolume;
            
            // Wait for audio to load
            await new Promise((resolve, reject) => {
                audio.addEventListener('loadeddata', resolve);
                audio.addEventListener('error', reject);
            });
            
            // Create audio source
            const source = this.context.createMediaElementSource(audio);
            source.connect(this.analyser);
            
            this.audioElements.set(id, {
                element: audio,
                source: source,
                options: options
            });
            
            console.log(`🎵 Audio loaded: ${id}`);
            this.emit('audioLoaded', { id, audio });
            
            return audio;
            
        } catch (error) {
            console.error(`❌ Failed to load audio ${id}:`, error);
            this.emit('error', error);
            return null;
        }
    }

    // Play audio with crossfade
    async playAudio(id, options = {}) {
        if (this.context.state === 'suspended') {
            await this.context.resume();
        }
        
        const audioData = this.audioElements.get(id);
        if (!audioData) {
            console.warn(`⚠️ Audio not found: ${id}`);
            return false;
        }
        
        const { element: audio } = audioData;
        
        // Crossfade if another audio is playing
        if (this.currentAudio && this.currentAudio !== audio) {
            await this.crossfade(this.currentAudio, audio, options.fadeTime || this.crossfadeDuration);
        } else {
            // Simple play
            try {
                await audio.play();
                this.currentAudio = audio;
                this.emit('audioStarted', { id, audio });
            } catch (error) {
                console.error(`❌ Failed to play audio ${id}:`, error);
                return false;
            }
        }
        
        return true;
    }

    // Stop audio
    stopAudio(id) {
        const audioData = this.audioElements.get(id);
        if (audioData) {
            const { element: audio } = audioData;
            audio.pause();
            audio.currentTime = 0;
            
            if (this.currentAudio === audio) {
                this.currentAudio = null;
            }
            
            this.emit('audioStopped', { id, audio });
        }
    }

    // Crossfade between audio tracks
    async crossfade(fromAudio, toAudio, duration = 2000) {
        this.crossfading = true;
        
        const steps = 50;
        const stepTime = duration / steps;
        const volumeStep = 1 / steps;
        
        const fromVolume = fromAudio.volume;
        const toVolume = toAudio.volume;
        
        // Start new audio at 0 volume
        toAudio.volume = 0;
        await toAudio.play();
        
        // Crossfade
        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;
            
            fromAudio.volume = fromVolume * (1 - progress);
            toAudio.volume = toVolume * progress;
            
            await new Promise(resolve => setTimeout(resolve, stepTime));
        }
        
        // Stop old audio
        fromAudio.pause();
        fromAudio.currentTime = 0;
        fromAudio.volume = fromVolume;
        
        this.currentAudio = toAudio;
        this.crossfading = false;
        
        this.emit('crossfadeComplete', { from: fromAudio, to: toAudio });
    }

    // Main analysis loop
    startAnalysis() {
        const analyze = () => {
            if (!this.analyser) return;
            
            this.analyser.getByteFrequencyData(this.dataArray);
            
            // Calculate frequency ranges
            const frequencies = this.getFrequencyData();
            
            // Beat detection
            const beatDetected = this.detectBeat(frequencies);
            
            // Emit analysis data
            this.emit('audioAnalysis', {
                frequencies,
                beat: beatDetected,
                raw: this.dataArray
            });
            
            requestAnimationFrame(analyze);
        };
        
        analyze();
    }

    // Get frequency data for bass, mid, treble
    getFrequencyData() {
        const frequencies = {};
        
        Object.keys(this.frequencies).forEach(range => {
            const { start, end } = this.frequencies[range];
            const startBin = Math.floor(start * this.bufferLength);
            const endBin = Math.floor(end * this.bufferLength);
            
            let sum = 0;
            let count = 0;
            
            for (let i = startBin; i < endBin; i++) {
                sum += this.dataArray[i];
                count++;
            }
            
            frequencies[range] = count > 0 ? sum / count / 255 : 0; // Normalize 0-1
        });
        
        return frequencies;
    }

    // Intelligent beat detection
    detectBeat(frequencies) {
        const now = Date.now();
        if (now - this.lastBeatTime < this.beatCooldown) {
            return false;
        }
        
        // Combine bass and mid for beat detection
        const energy = (frequencies.bass * 0.7) + (frequencies.mid * 0.3);
        
        // Dynamic threshold based on recent average
        const threshold = this.beatThreshold * this.beatSensitivity;
        
        if (energy > threshold) {
            this.lastBeatTime = now;
            this.emit('beatDetected', { energy, frequencies });
            return true;
        }
        
        return false;
    }

    // Adaptive volume by time of day
    getVolumeByTime() {
        const hour = new Date().getHours();
        
        // Quieter at night (22-7), normal during day
        if (hour >= 22 || hour <= 7) {
            return this.masterVolume * 0.5; // Night mode
        } else if (hour >= 8 && hour <= 18) {
            return this.masterVolume; // Day mode
        } else {
            return this.masterVolume * 0.8; // Evening mode
        }
    }

    // Set master volume
    setVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        
        // Update all audio elements
        this.audioElements.forEach(({ element }) => {
            const baseVolume = element.dataset.baseVolume || 1;
            element.volume = baseVolume * this.masterVolume;
        });
        
        this.emit('volumeChanged', this.masterVolume);
    }

    // Toggle music
    toggleMusic() {
        if (this.currentAudio) {
            if (this.currentAudio.paused) {
                this.currentAudio.play();
                this.emit('musicResumed');
            } else {
                this.currentAudio.pause();
                this.emit('musicPaused');
            }
        }
    }

    // Event system
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data));
        }
    }

    // Cleanup
    destroy() {
        // Stop all audio
        this.audioElements.forEach((audioData, id) => {
            this.stopAudio(id);
        });
        
        // Close audio context
        if (this.context) {
            this.context.close();
        }
        
        // Clear references
        this.audioElements.clear();
        this.listeners.clear();
        
        console.log('🎵 AudioSystem destroyed');
    }
}

// Export for use
window.AudioSystem = AudioSystem;

// Global audio system instance
window.maiaAudio = null;

// Initialize audio system when document loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait for user interaction before initializing audio context
    const initAudio = () => {
        if (!window.maiaAudio) {
            window.maiaAudio = new AudioSystem({
                fftSize: 2048,
                smoothing: 0.8,
                volume: 0.7,
                beatThreshold: 0.3
            });
            
            // Remove event listeners after init
            document.removeEventListener('click', initAudio);
            document.removeEventListener('touchstart', initAudio);
            document.removeEventListener('keydown', initAudio);
        }
    };
    
    // Listen for first user interaction
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('touchstart', initAudio, { once: true });
    document.addEventListener('keydown', initAudio, { once: true });
});