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
    
    // Update toggle button if it exists
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    
    if (themeIcon) themeIcon.textContent = isDark ? '☀️' : '🌙';
    if (themeText) themeText.textContent = isDark ? 'Light' : 'Dark';
    
    // Save preference to localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Load saved theme preference
function loadThemePreference() {
    if (!isFeatureEnabled('dark-mode')) return;
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        const themeIcon = document.getElementById('theme-icon');
        const themeText = document.getElementById('theme-text');
        if (themeIcon) themeIcon.textContent = '☀️';
        if (themeText) themeText.textContent = 'Light';
    }
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

    // Load theme preference first
    loadThemePreference();

    // Initialize all features
    initializeScrollAnimations();
    initializeProjectFilters();
    initializeEnhancedNavigation();

    console.log('✅ Features initialized successfully');
}

// Run on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFeatures);
} else {
    initializeFeatures();
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Add theme toggle button to navigation (if dark mode is enabled)
function addThemeToggleToNav() {
    if (!isFeatureEnabled('dark-mode')) return;
    
    const nav = document.querySelector('nav');
    if (!nav || document.querySelector('.theme-toggle')) return;

    const toggleButton = document.createElement('button');
    toggleButton.className = 'theme-toggle';
    toggleButton.onclick = toggleTheme;
    toggleButton.innerHTML = `
        <span id="theme-icon">🌙</span>
        <span id="theme-text">Dark</span>
    `;
    
    nav.appendChild(toggleButton);
}

// Call this after DOM is loaded
document.addEventListener('DOMContentLoaded', addThemeToggleToNav);
