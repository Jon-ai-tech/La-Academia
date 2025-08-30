/**
 * ============== MAIA AUDIO INTEGRATION ============== 
 * Main integration script for the complete audiovisual system
 * Combines all Dog Studio inspired features for La Academia
 */

class MaiaAudioIntegration {
    constructor() {
        this.audioSystem = null;
        this.parallaxSync = null;
        this.dogStudioFx = null;
        this.maiaSounds = null;
        
        // System state
        this.initialized = false;
        this.musicEnabled = true;
        this.parallaxEnabled = true;
        this.soundsEnabled = true;
        
        // User preferences
        this.preferences = {
            volume: 0.7,
            parallaxIntensity: 1.0,
            audioReactivity: true,
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        };
        
        // Control elements
        this.controls = {
            audioToggle: null,
            parallaxToggle: null,
            volumeSlider: null,
            statusIndicator: null
        };
        
        this.init();
    }

    async init() {
        console.log('🎯 Initializing Maia Audio Integration...');
        
        // Wait for DOM and audio systems to be ready
        await this.waitForSystems();
        
        // Initialize all components
        this.initializeComponents();
        this.setupControls();
        this.loadPreferences();
        this.startWelcomeSequence();
        
        this.initialized = true;
        console.log('✨ Maia Audio Integration initialized successfully!');
    }

    async waitForSystems() {
        // Wait for audio system
        while (!window.maiaAudio) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Wait for particle system if available
        while (!window.particleSystem && !window.locomotiveApp) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.log('🔗 All systems ready for integration');
    }

    initializeComponents() {
        // Get audio system reference
        this.audioSystem = window.maiaAudio;
        
        // Initialize Maia Sounds
        this.maiaSounds = new MaiaSounds();
        
        // Initialize parallax sync
        this.parallaxSync = new AudioParallaxSync(this.audioSystem, {
            intensity: this.preferences.parallaxIntensity
        });
        
        // Initialize Dog Studio interactions
        const particleSystem = window.particleSystem || (window.locomotiveApp && window.locomotiveApp.particles);
        this.dogStudioFx = new DogStudioInteractions(this.audioSystem, particleSystem);
        
        // Setup cross-component communication
        this.setupComponentCommunication();
        
        console.log('🎵 All audio components initialized');
    }

    setupComponentCommunication() {
        if (!this.audioSystem) return;
        
        // Audio analysis events
        this.audioSystem.on('audioAnalysis', (data) => {
            this.handleAudioAnalysis(data);
        });
        
        // Beat detection events
        this.audioSystem.on('beatDetected', (data) => {
            this.handleBeatDetection(data);
        });
        
        // Audio state changes
        this.audioSystem.on('audioStarted', () => {
            this.updateStatus('🎵 Music Playing');
        });
        
        this.audioSystem.on('audioPaused', () => {
            this.updateStatus('⏸️ Music Paused');
        });
        
        // Error handling
        this.audioSystem.on('error', (error) => {
            console.error('Audio system error:', error);
            this.updateStatus('❌ Audio Error', 'error');
        });
    }

    setupControls() {
        // Get control elements
        this.controls.audioToggle = document.getElementById('audioToggle');
        this.controls.parallaxToggle = document.getElementById('parallaxToggle');
        this.controls.volumeSlider = document.getElementById('volumeSlider');
        this.controls.statusIndicator = document.getElementById('audioStatus');
        
        // Audio toggle
        if (this.controls.audioToggle) {
            this.controls.audioToggle.addEventListener('click', () => {
                this.toggleMusic();
                this.dogStudioFx.playClickSound();
            });
        }
        
        // Parallax toggle
        if (this.controls.parallaxToggle) {
            this.controls.parallaxToggle.addEventListener('click', () => {
                this.toggleParallax();
                this.dogStudioFx.playClickSound();
            });
        }
        
        // Volume control
        if (this.controls.volumeSlider) {
            this.controls.volumeSlider.addEventListener('input', (e) => {
                const volume = e.target.value / 100;
                this.setVolume(volume);
                
                // Throttled feedback sound
                if (!this._volumeFeedbackTimeout) {
                    this.dogStudioFx.playHoverSound();
                    this._volumeFeedbackTimeout = setTimeout(() => {
                        this._volumeFeedbackTimeout = null;
                    }, 200);
                }
            });
        }
        
        // Keyboard shortcuts
        this.setupKeyboardControls();
        
        console.log('🎮 Audio controls setup complete');
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            // Only process if not in input field
            if (e.target.matches('input, textarea, select')) return;
            
            switch (e.code) {
                case 'KeyM':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.toggleMusic();
                    }
                    break;
                    
                case 'KeyP':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.toggleParallax();
                    }
                    break;
                    
                case 'ArrowUp':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.adjustVolume(0.1);
                    }
                    break;
                    
                case 'ArrowDown':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.adjustVolume(-0.1);
                    }
                    break;
            }
        });
    }

    async startWelcomeSequence() {
        if (this.preferences.reducedMotion) return;
        
        // Wait a bit for page to settle
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
            // Load ambient space audio
            await this.loadAmbientAudio();
            
            // Start welcome experience
            await this.maiaSounds.playExperience('welcome', this.audioSystem.context);
            
            // Show status
            this.updateStatus('🌟 Welcome to La Academia!');
            
            console.log('🎭 Welcome sequence completed');
            
        } catch (error) {
            console.warn('Welcome sequence failed:', error);
            this.updateStatus('🎵 Audio System Ready');
        }
    }

    async loadAmbientAudio() {
        // In a real implementation, these would be actual audio files
        // For now, we'll create a simple ambient tone
        if (this.audioSystem && this.audioSystem.context) {
            this.createAmbientAudio();
        }
    }

    createAmbientAudio() {
        // Create a simple ambient soundscape using Web Audio API
        const ctx = this.audioSystem.context;
        
        // Low frequency ambient hum
        const baseOsc = ctx.createOscillator();
        const baseGain = ctx.createGain();
        
        baseOsc.type = 'sine';
        baseOsc.frequency.setValueAtTime(110, ctx.currentTime); // A2
        baseGain.gain.setValueAtTime(0.1, ctx.currentTime);
        
        baseOsc.connect(baseGain);
        baseGain.connect(ctx.destination);
        
        // Add subtle modulation
        const modOsc = ctx.createOscillator();
        const modGain = ctx.createGain();
        
        modOsc.type = 'sine';
        modOsc.frequency.setValueAtTime(0.1, ctx.currentTime); // Very slow modulation
        modGain.gain.setValueAtTime(2, ctx.currentTime);
        
        modOsc.connect(modGain);
        modGain.connect(baseOsc.frequency);
        
        // Start ambient sound
        baseOsc.start();
        modOsc.start();
        
        // Store references for later control
        this.ambientNodes = { baseOsc, baseGain, modOsc, modGain };
    }

    handleAudioAnalysis(data) {
        if (!this.preferences.audioReactivity) return;
        
        const { frequencies, beat } = data;
        
        // Update visual elements based on frequencies
        this.updateVisualElements(frequencies);
        
        // Update page-level audio classes
        this.updateAudioClasses(frequencies);
    }

    handleBeatDetection(data) {
        if (!this.preferences.audioReactivity) return;
        
        // Flash beat indicator on body
        document.body.classList.add('beat-flash');
        setTimeout(() => {
            document.body.classList.remove('beat-flash');
        }, 100);
        
        // Trigger success sound for strong beats
        if (data.energy > 0.7) {
            this.maiaSounds.playLearningFeedback('progress', this.audioSystem.context);
        }
    }

    updateVisualElements(frequencies) {
        // Update bass-reactive elements
        document.querySelectorAll('[data-audio-frequency="bass"]').forEach(el => {
            const intensity = frequencies.bass || 0;
            if (intensity > 0.3) {
                el.classList.add('audio-active');
                setTimeout(() => el.classList.remove('audio-active'), 200);
            }
        });
        
        // Update mid-reactive elements
        document.querySelectorAll('[data-audio-frequency="mid"]').forEach(el => {
            const intensity = frequencies.mid || 0;
            if (intensity > 0.3) {
                el.classList.add('audio-active');
                setTimeout(() => el.classList.remove('audio-active'), 150);
            }
        });
        
        // Update treble-reactive elements
        document.querySelectorAll('[data-audio-frequency="treble"]').forEach(el => {
            const intensity = frequencies.treble || 0;
            if (intensity > 0.3) {
                el.classList.add('audio-active');
                setTimeout(() => el.classList.remove('audio-active'), 100);
            }
        });
        
        // Update all-frequency elements
        document.querySelectorAll('[data-audio-frequency="all"]').forEach(el => {
            const avgIntensity = (frequencies.bass + frequencies.mid + frequencies.treble) / 3;
            if (avgIntensity > 0.4) {
                el.classList.add('audio-active');
                setTimeout(() => el.classList.remove('audio-active'), 180);
            }
        });
    }

    updateAudioClasses(frequencies) {
        const body = document.body;
        
        // Add frequency-based classes to body
        body.classList.toggle('bass-active', frequencies.bass > 0.5);
        body.classList.toggle('mid-active', frequencies.mid > 0.5);
        body.classList.toggle('treble-active', frequencies.treble > 0.5);
    }

    // Public API methods
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        
        if (this.audioSystem) {
            this.audioSystem.toggleMusic();
        }
        
        // Update control appearance
        if (this.controls.audioToggle) {
            this.controls.audioToggle.classList.toggle('active', this.musicEnabled);
        }
        
        this.updateStatus(this.musicEnabled ? '🎵 Music On' : '🔇 Music Off');
        this.savePreferences();
    }

    toggleParallax() {
        this.parallaxEnabled = !this.parallaxEnabled;
        
        if (this.parallaxSync) {
            this.parallaxSync.toggle();
        }
        
        // Update control appearance
        if (this.controls.parallaxToggle) {
            this.controls.parallaxToggle.classList.toggle('active', this.parallaxEnabled);
        }
        
        this.updateStatus(this.parallaxEnabled ? '🌊 Parallax On' : '⏹️ Parallax Off');
        this.savePreferences();
    }

    setVolume(volume) {
        this.preferences.volume = Math.max(0, Math.min(1, volume));
        
        if (this.audioSystem) {
            this.audioSystem.setVolume(this.preferences.volume);
        }
        
        if (this.dogStudioFx) {
            this.dogStudioFx.setVolume(this.preferences.volume);
        }
        
        // Update slider if not the source
        if (this.controls.volumeSlider && this.controls.volumeSlider.value / 100 !== volume) {
            this.controls.volumeSlider.value = volume * 100;
        }
        
        this.savePreferences();
    }

    adjustVolume(delta) {
        this.setVolume(this.preferences.volume + delta);
        this.updateStatus(`🔊 Volume: ${Math.round(this.preferences.volume * 100)}%`);
    }

    setParallaxIntensity(intensity) {
        this.preferences.parallaxIntensity = Math.max(0, Math.min(3, intensity));
        
        if (this.parallaxSync) {
            this.parallaxSync.setIntensity(this.preferences.parallaxIntensity);
        }
        
        this.savePreferences();
    }

    toggleAudioReactivity() {
        this.preferences.audioReactivity = !this.preferences.audioReactivity;
        this.updateStatus(`🎨 Audio Reactivity: ${this.preferences.audioReactivity ? 'On' : 'Off'}`);
        this.savePreferences();
    }

    updateStatus(message, type = 'info') {
        if (!this.controls.statusIndicator) return;
        
        const statusText = this.controls.statusIndicator.querySelector('#statusText');
        if (statusText) {
            statusText.textContent = message;
        }
        
        // Show status temporarily
        this.controls.statusIndicator.classList.add('visible');
        
        // Auto-hide after delay
        clearTimeout(this._statusTimeout);
        this._statusTimeout = setTimeout(() => {
            this.controls.statusIndicator.classList.remove('visible');
        }, 3000);
        
        // Add type-specific styling
        this.controls.statusIndicator.className = `audio-status visible ${type}`;
    }

    // Preferences management
    savePreferences() {
        try {
            localStorage.setItem('maiaAudioPrefs', JSON.stringify(this.preferences));
        } catch (error) {
            console.warn('Failed to save audio preferences:', error);
        }
    }

    loadPreferences() {
        try {
            const saved = localStorage.getItem('maiaAudioPrefs');
            if (saved) {
                const prefs = JSON.parse(saved);
                this.preferences = { ...this.preferences, ...prefs };
                
                // Apply loaded preferences
                this.setVolume(this.preferences.volume);
                this.setParallaxIntensity(this.preferences.parallaxIntensity);
                
                console.log('🔧 Audio preferences loaded');
            }
        } catch (error) {
            console.warn('Failed to load audio preferences:', error);
        }
    }

    // Educational context integration
    onLearningStateChange(state) {
        if (this.maiaSounds) {
            this.maiaSounds.adaptToLearningState(state);
        }
        
        console.log(`🎓 Learning state changed: ${state}`);
    }

    playEducationalFeedback(type) {
        if (this.maiaSounds && this.audioSystem) {
            this.maiaSounds.playLearningFeedback(type, this.audioSystem.context);
        }
    }

    // Cleanup
    destroy() {
        // Stop ambient audio
        if (this.ambientNodes) {
            Object.values(this.ambientNodes).forEach(node => {
                if (node.stop) node.stop();
                if (node.disconnect) node.disconnect();
            });
        }
        
        // Destroy components
        if (this.parallaxSync) this.parallaxSync.destroy();
        if (this.dogStudioFx) this.dogStudioFx.destroy();
        if (this.audioSystem) this.audioSystem.destroy();
        
        console.log('🎵 Maia Audio Integration destroyed');
    }
}

// Global API object for external access
window.maiaControls = {
    toggleMusic: () => window.maiaIntegration?.toggleMusic(),
    setVolume: (volume) => window.maiaIntegration?.setVolume(volume),
    setParallaxIntensity: (intensity) => window.maiaIntegration?.setParallaxIntensity(intensity),
    toggleAudioReactivity: () => window.maiaIntegration?.toggleAudioReactivity(),
    switchTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        console.log(`🎨 Theme switched to: ${theme}`);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for user interaction before full initialization
    const initMaiaAudio = () => {
        if (!window.maiaIntegration) {
            window.maiaIntegration = new MaiaAudioIntegration();
            
            // Remove event listeners after init
            document.removeEventListener('click', initMaiaAudio);
            document.removeEventListener('touchstart', initMaiaAudio);
            document.removeEventListener('keydown', initMaiaAudio);
        }
    };
    
    // Listen for first user interaction
    document.addEventListener('click', initMaiaAudio, { once: true });
    document.addEventListener('touchstart', initMaiaAudio, { once: true });
    document.addEventListener('keydown', initMaiaAudio, { once: true });
    
    console.log('🎯 Maia Audio Integration ready for user interaction');
});