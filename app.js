// ============== INICIO: Simplified app.js for Maia Kode Academy Landing Page ==============

document.addEventListener('DOMContentLoaded', () => {
    
    let currentLanguage = 'es'; // Track current language

    // Export language update function for potential external use
    window.updateAppLanguage = function(lang) {
        currentLanguage = lang;
        console.log(`App language updated to: ${lang}`);
    };

    // Language system is now handled entirely in index.html inline script
    // This file is kept minimal to preserve any potential future functionality
    
    console.log('Maia Kode Academy - Simplified App Loaded');
    console.log('Language system active:', currentLanguage);
    
    // Placeholder for future academy functionality
    // such as progress tracking, user preferences, etc.
    
});

// ============== FIN: Simplified app.js ==============
