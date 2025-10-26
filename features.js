// ===================================
// FEATURE FLAGS CONFIGURATION
// ===================================
const featureFlags = {
    'dark-mode': true,
    'project-filters': true,
    'animations': true,
    'contact-form-v2': false,
    'enhanced-navigation': false
};

// Helper function to check if feature is enabled
function isFeatureEnabled(flagName) {
    return featureFlags[flagName] === true;
}

// ===================================
// DARK MODE FUNCTIONALITY
// ===================================
function toggleTheme() {
    if (!isFeatureEnabled('dark-mode')) {
        console.log('Dark mode feature is disabled');
        return;
    }
    
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    
    // Update ALL toggle buttons on the page (in case there are multiple)
    document.querySelectorAll('.theme-toggle').forEach(button => {
        const themeIcon = button.querySelector('#theme-icon') || button.querySelector('.theme-icon');
        const themeText = button.querySelector('#theme-text') || button.querySelector('.theme-text');
        
        if (themeIcon) themeIcon.textContent = isDark ? '☀️' : '🌙';
        if (themeText) themeText.textContent = isDark ? 'Light' : 'Dark';
    });
    
    // Save preference to localStorage (persists across ALL pages)
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    console.log(`Theme switched to: ${isDark ? 'dark' : 'light'} mode`);
}

// Load saved theme preference IMMEDIATELY (before page renders)
function loadThemePreference() {
    if (!isFeatureEnabled('dark-mode')) return;
    
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    console.log(`Loaded theme: ${savedTheme || 'light'} mode`);
}

// Update toggle button UI to match current theme
function updateThemeButton() {
    const isDark = document.body.classList.contains('dark-theme');
    
    document.querySelectorAll('.theme-toggle').forEach(button => {
        const themeIcon = button.querySelector('#theme-icon') || button.querySelector('.theme-icon');
        const themeText = button.querySelector('#theme-text') || button.querySelector('.theme-text');
        
        if (themeIcon) themeIcon.textContent = isDark ? '☀️' : '🌙';
        if (themeText) themeText.textContent = isDark ? 'Light' : 'Dark';
    });
}

// ===================================
// AUTO-ADD THEME TOGGLE TO NAVIGATION
// ===================================
function addThemeToggleToNav() {
    if (!isFeatureEnabled('dark-mode')) return;
    
    const nav = document.querySelector('nav');
    if (!nav) {
        console.warn('Navigation not found - cannot add theme toggle');
        return;
    }
    
    // Check if toggle already exists
    if (document.querySelector('.theme-toggle')) {
        updateThemeButton();
        return;
    }

    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'theme-toggle';
    toggleButton.onclick = toggleTheme;
    
    const isDark = document.body.classList.contains('dark-theme');
    toggleButton.innerHTML = `
        <span id="theme-icon" class="theme-icon">${isDark ? '☀️' : '🌙'}</span>
        <span id="theme-text" class="theme-text">${isDark ? 'Light' : 'Dark'}</span>
    `;
    
    // Add to navigation
    nav.appendChild(toggleButton);
    
    console.log('✅ Dark mode toggle added to navigation');
}

// ===================================
// SCROLL ANIMATIONS
// ===================================
function initializeScrollAnimations() {
    if (!isFeatureEnabled('animations')) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    // Observe all elements with scroll-reveal class
    document.querySelectorAll('.scroll-reveal').forEach(element => {
        observer.observe(element);
    });

    // Auto-add scroll-reveal to common elements
    document.querySelectorAll('.card, section > p, section > h2, section > h3').forEach(element => {
        if (!element.classList.contains('scroll-reveal')) {
            element.classList.add('scroll-reveal');
            observer.observe(element);
        }
    });
}

// ===================================
// PROJECT FILTERS
// ===================================
function initializeProjectFilters() {
    if (!isFeatureEnabled('project-filters')) {
        const filtersContainer = document.getElementById('projectFilters');
        if (filtersContainer) filtersContainer.style.display = 'none';
        return;
    }

    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.projects .card');

    if (filterButtons.length === 0) return; // Not on projects page

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            projectCards.forEach((card, index) => {
                if (filter === 'all') {
                    card.classList.remove('hidden');
                    card.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s`;
                } else {
                    const tech = card.getAttribute('data-tech') || '';
                    const year = card.getAttribute('data-year') || '';
                    
                    if (tech.includes(filter) || year === filter) {
                        card.classList.remove('hidden');
                        card.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s`;
                    } else {
                        card.classList.add('hidden');
                    }
                }
            });
        });
    });
}

// ===================================
// ENHANCED NAVIGATION (Future Feature)
// ===================================
function initializeEnhancedNavigation() {
    if (!isFeatureEnabled('enhanced-navigation')) return;

    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add active page highlighting
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// ===================================
// INITIALIZE ALL FEATURES
// ===================================
function initializeFeatures() {
    console.log('🚀 Initializing feature flags...');
    console.log('Active features:', Object.keys(featureFlags).filter(key => featureFlags[key]));

    // CRITICAL: Load theme FIRST before anything else renders
    loadThemePreference();
    
    // Add theme toggle to navigation
    addThemeToggleToNav();

    // Initialize all other features
    initializeScrollAnimations();
    initializeProjectFilters();
    initializeEnhancedNavigation();

    console.log('✅ All features initialized successfully');
}

// Load theme preference IMMEDIATELY (even before DOM is ready)
loadThemePreference();

// Run full initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFeatures);
} else {
    initializeFeatures();
}

// ===================================
// MAKE TOGGLE FUNCTION GLOBALLY AVAILABLE
// ===================================
// This ensures toggleTheme() can be called from anywhere
window.toggleTheme = toggleTheme;
