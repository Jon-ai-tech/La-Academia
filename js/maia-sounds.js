/**
 * ============== MAIA SOUNDS CONFIGURATION ============== 
 * Audio configuration specific to La Academia Maia Kode
 * Aurora Dorada palette integration and educational context
 */

class MaiaSounds {
    constructor() {
        // Aurora Dorada color palette
        this.palette = {
            primary: '#FFC777',    // Dorado Aurora
            secondary: '#58A6FF',  // Azul Cosmos  
            accent: '#C792EA',     // Violeta Místico
            success: '#98C379',    // Verde Éxito
            warning: '#E5C07B',    // Ámbar Advertencia
            error: '#E06C75'       // Rojo Error
        };
        
        // Predefined audio experiences
        this.experiences = {
            welcome: {
                name: 'Secuencia de Bienvenida',
                sequence: [
                    { sound: 'ambient_space', delay: 0, duration: 2000 },
                    { sound: 'maia_notification', delay: 2000, duration: 1000 },
                    { sound: 'discovery_sound', delay: 4000, duration: 2000 }
                ]
            },
            achievement: {
                name: 'Celebración de Logros',
                sequence: [
                    { sound: 'success_chord', delay: 0, duration: 800 },
                    { sound: 'golden_echo', delay: 300, duration: 1200 },
                    { sound: 'level_complete', delay: 800, duration: 1500 }
                ]
            },
            exploration: {
                name: 'Modo Exploración',
                loop: true,
                sounds: ['cosmic_ambient', 'discovery_interactions', 'ui_reactive']
            }
        };
        
        // Sound library paths (URLs would be actual audio files in production)
        this.soundLibrary = {
            // Ambient sounds
            ambient_space: {
                url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoQXrTp66hVFApGn+DyvmEaJS7OmYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoQXrTp66hVFApGn+DyvmEaJS7OmYqFbF1fdJivrJBhNjVgodDbq2EcBj',
                volume: 0.3,
                loop: true,
                fadeIn: 2000
            },
            cosmic_ambient: {
                url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoQXrTp66hVFApGn+DyvmEaJaUcBjiR1/LMeSwFJHfH8N2QQAoQXrTp66hVFApGn+DyvmEaJaUcBjiR1/LMeSwFJHfH8N2QQAoQXrTp66hVFApGn+DyvmEaJaU=',
                volume: 0.2,
                loop: true,
                fadeIn: 1500
            },
            
            // UI interaction sounds
            maia_notification: {
                frequency: 659.25, // E5 - friendly notification
                duration: 400,
                volume: 0.4,
                type: 'sine',
                envelope: {
                    attack: 50,
                    decay: 150,
                    sustain: 0.6,
                    release: 200
                }
            },
            discovery_sound: {
                frequencies: [523.25, 659.25, 783.99], // C5-E5-G5 triad
                duration: 600,
                volume: 0.5,
                type: 'sine',
                stagger: 100
            },
            
            // Success sounds
            success_chord: {
                frequencies: [261.63, 329.63, 392.00, 523.25], // C major 7
                duration: 800,
                volume: 0.6,
                type: 'sine',
                stagger: 50
            },
            golden_echo: {
                frequency: 880, // A5 - golden resonance
                duration: 1200,
                volume: 0.4,
                type: 'sawtooth',
                effects: ['reverb', 'delay']
            },
            level_complete: {
                frequencies: [523.25, 659.25, 783.99, 1046.5], // Ascending C major
                duration: 1500,
                volume: 0.7,
                type: 'triangle',
                stagger: 200,
                finale: true
            },
            
            // Interactive feedback
            hover_resonance: {
                frequency: 440, // A4 - comfortable resonance
                duration: 120,
                volume: 0.2,
                type: 'sine'
            },
            click_pulse: {
                frequency: 220, // A3 - deeper click
                duration: 150,
                volume: 0.3,
                type: 'square',
                effects: ['echo']
            },
            transition_flow: {
                frequencyStart: 440,
                frequencyEnd: 880,
                duration: 300,
                volume: 0.3,
                type: 'sine'
            }
        };
        
        // Educational context sounds
        this.contextSounds = {
            learning: {
                background: 'cosmic_ambient',
                interactions: 'hover_resonance',
                success: 'discovery_sound',
                error: 'gentle_correction'
            },
            exploration: {
                background: 'ambient_space',
                interactions: 'click_pulse',
                discovery: 'success_chord'
            },
            achievement: {
                celebration: 'level_complete',
                progression: 'golden_echo'
            }
        };
        
        // Volume management by time and context
        this.volumeProfiles = {
            morning: { // 6-12
                ambient: 0.4,
                ui: 0.5,
                feedback: 0.6
            },
            afternoon: { // 12-18
                ambient: 0.5,
                ui: 0.6,
                feedback: 0.7
            },
            evening: { // 18-22
                ambient: 0.3,
                ui: 0.4,
                feedback: 0.5
            },
            night: { // 22-6
                ambient: 0.2,
                ui: 0.3,
                feedback: 0.4
            }
        };
        
        this.currentContext = 'learning';
        this.currentVolumeProfile = this.getTimeBasedProfile();
    }

    // Get volume profile based on time of day
    getTimeBasedProfile() {
        const hour = new Date().getHours();
        
        if (hour >= 6 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 18) return 'afternoon';
        if (hour >= 18 && hour < 22) return 'evening';
        return 'night';
    }

    // Generate synthesized sound
    generateSound(soundConfig, audioContext) {
        if (!audioContext) return;
        
        const config = this.soundLibrary[soundConfig] || soundConfig;
        
        // Handle chord/harmony sounds
        if (config.frequencies) {
            return this.generateHarmony(config, audioContext);
        }
        
        // Handle single frequency sounds
        if (config.frequency) {
            return this.generateSingleTone(config, audioContext);
        }
        
        // Handle frequency sweeps
        if (config.frequencyStart && config.frequencyEnd) {
            return this.generateSweep(config, audioContext);
        }
    }

    // Generate single tone with envelope
    generateSingleTone(config, audioContext) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(config.frequency, audioContext.currentTime);
        oscillator.type = config.type || 'sine';
        
        // Apply envelope if specified
        if (config.envelope) {
            const { attack, decay, sustain, release } = config.envelope;
            const attackTime = attack / 1000;
            const decayTime = decay / 1000;
            const releaseTime = release / 1000;
            const totalTime = config.duration / 1000;
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(config.volume, audioContext.currentTime + attackTime);
            gainNode.gain.linearRampToValueAtTime(config.volume * sustain, audioContext.currentTime + attackTime + decayTime);
            gainNode.gain.setValueAtTime(config.volume * sustain, audioContext.currentTime + totalTime - releaseTime);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + totalTime);
        } else {
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(config.volume, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + config.duration / 1000);
        }
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + config.duration / 1000);
        
        return { oscillator, gainNode };
    }

    // Generate harmony/chord
    generateHarmony(config, audioContext) {
        const nodes = [];
        
        config.frequencies.forEach((freq, index) => {
            const delay = (config.stagger || 0) * index / 1000;
            
            setTimeout(() => {
                const singleConfig = {
                    ...config,
                    frequency: freq,
                    volume: config.volume / config.frequencies.length // Distribute volume
                };
                
                const result = this.generateSingleTone(singleConfig, audioContext);
                nodes.push(result);
            }, delay);
        });
        
        return nodes;
    }

    // Generate frequency sweep
    generateSweep(config, audioContext) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(config.frequencyStart, audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(config.frequencyEnd, audioContext.currentTime + config.duration / 1000);
        oscillator.type = config.type || 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(config.volume, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + config.duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + config.duration / 1000);
        
        return { oscillator, gainNode };
    }

    // Play educational context sound
    playContextSound(context, situation, audioContext) {
        const contextConfig = this.contextSounds[context];
        if (!contextConfig || !contextConfig[situation]) return;
        
        const soundName = contextConfig[situation];
        return this.generateSound(soundName, audioContext);
    }

    // Play predefined experience sequence
    async playExperience(experienceName, audioContext) {
        const experience = this.experiences[experienceName];
        if (!experience) return;
        
        if (experience.sequence) {
            // Sequential sounds
            experience.sequence.forEach(step => {
                setTimeout(() => {
                    this.generateSound(step.sound, audioContext);
                }, step.delay);
            });
        } else if (experience.sounds) {
            // Simultaneous or looped sounds
            experience.sounds.forEach(soundName => {
                this.generateSound(soundName, audioContext);
            });
        }
        
        console.log(`🎵 Playing Maia experience: ${experience.name}`);
    }

    // Get contextual volume
    getContextualVolume(soundType) {
        const profile = this.volumeProfiles[this.currentVolumeProfile];
        return profile[soundType] || 0.5;
    }

    // Educational feedback sounds
    playLearningFeedback(type, audioContext) {
        const feedbackSounds = {
            correct: 'discovery_sound',
            incorrect: 'gentle_correction',
            hint: 'maia_notification',
            progress: 'success_chord',
            completion: 'level_complete'
        };
        
        const soundName = feedbackSounds[type];
        if (soundName) {
            return this.generateSound(soundName, audioContext);
        }
    }

    // Adaptive audio based on learning progress
    adaptToLearningState(state) {
        const adaptations = {
            focused: {
                ambient: 0.3,
                ui: 0.2,
                encourageFrequency: 30000 // Every 30s
            },
            struggling: {
                ambient: 0.2,
                ui: 0.4,
                supportSounds: true,
                gentleCorrection: true
            },
            achieving: {
                ambient: 0.4,
                ui: 0.6,
                celebrationSounds: true,
                positiveReinforcement: true
            },
            exploring: {
                ambient: 0.5,
                ui: 0.5,
                discoverySounds: true,
                curiosityRewards: true
            }
        };
        
        const adaptation = adaptations[state];
        if (adaptation) {
            console.log(`🎵 Adapting audio for learning state: ${state}`);
            // Apply adaptations...
        }
    }

    // Create personalized sound profile
    createPersonalizedProfile(preferences = {}) {
        const profile = {
            volume: preferences.volume || 0.5,
            complexity: preferences.complexity || 'medium', // simple, medium, complex
            motivationStyle: preferences.motivation || 'encouraging', // gentle, encouraging, energetic
            culturalContext: preferences.culture || 'universal',
            accessibility: preferences.accessibility || {}
        };
        
        // Adjust sounds based on profile
        this.personalizeExperience(profile);
        
        return profile;
    }

    // Personalize experience based on profile
    personalizeExperience(profile) {
        // Adjust complexity
        if (profile.complexity === 'simple') {
            // Use simpler sounds, fewer harmonies
            Object.keys(this.soundLibrary).forEach(key => {
                const sound = this.soundLibrary[key];
                if (sound.frequencies && sound.frequencies.length > 2) {
                    sound.frequencies = sound.frequencies.slice(0, 2);
                }
            });
        }
        
        // Adjust motivational style
        if (profile.motivationStyle === 'gentle') {
            Object.values(this.soundLibrary).forEach(sound => {
                if (sound.volume) sound.volume *= 0.8;
                if (sound.duration) sound.duration = Math.min(sound.duration, 400);
            });
        }
        
        console.log(`🎵 Personalized audio profile applied: ${profile.motivationStyle} style`);
    }

    // Accessibility features
    createAccessibleAlternatives() {
        // Visual alternatives for audio cues
        const visualCues = {
            beat: () => document.body.classList.add('beat-flash'),
            success: () => this.createVisualCelebration(),
            notification: () => this.createVisualAlert(),
            progress: () => this.updateVisualProgress()
        };
        
        // Haptic feedback alternatives (if supported)
        const hapticCues = {
            beat: () => this.triggerHaptic('light'),
            success: () => this.triggerHaptic('medium'),
            error: () => this.triggerHaptic('heavy')
        };
        
        return { visualCues, hapticCues };
    }

    // Visual celebration effect
    createVisualCelebration() {
        const celebration = document.createElement('div');
        celebration.className = 'maia-visual-celebration';
        celebration.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 200px;
            height: 200px;
            border: 3px solid ${this.palette.primary};
            border-radius: 50%;
            opacity: 0;
            z-index: 10000;
            pointer-events: none;
            animation: celebrationPulse 1s ease-out;
        `;
        
        document.body.appendChild(celebration);
        
        setTimeout(() => {
            document.body.removeChild(celebration);
        }, 1000);
    }

    // Trigger haptic feedback if available
    triggerHaptic(intensity) {
        if (navigator.vibrate) {
            const patterns = {
                light: [50],
                medium: [100, 50, 100],
                heavy: [200, 100, 200, 100, 200]
            };
            navigator.vibrate(patterns[intensity] || patterns.medium);
        }
    }
}

// Add celebration animation CSS
if (!document.querySelector('#maia-sounds-styles')) {
    const style = document.createElement('style');
    style.id = 'maia-sounds-styles';
    style.textContent = `
        @keyframes celebrationPulse {
            0% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.5);
            }
            50% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1.2);
            }
            100% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(1.5);
            }
        }
        
        .beat-flash {
            background-color: rgba(255, 199, 119, 0.1);
            transition: background-color 0.1s ease;
        }
        
        .maia-visual-alert {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 16px;
            background: linear-gradient(135deg, #FFC777, #58A6FF);
            color: #000;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// Export for use
window.MaiaSounds = MaiaSounds;