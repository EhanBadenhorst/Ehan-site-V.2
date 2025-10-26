// ============================================
// EHAN'S PORTFOLIO - SITE FEATURES
// Dark Mode, Animations, and Project Filters
// ============================================

console.log('🚀 Loading site features...');

// Feature Flags
const features = {
    darkMode: true,
    animations: true,
    projectFilters: true
};

// Mobile breakpoint (px)
const MOBILE_BREAKPOINT = 768;

// ============================================
// DARK MODE FUNCTIONALITY
// ============================================

function toggleTheme() {
    if (!features.darkMode) return;
    
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    
    // Update all toggle buttons
    updateAllToggleButtons(isDark);
    
    // Save to localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    console.log(`✅ Theme switched to ${isDark ? 'dark' : 'light'} mode`);
}

function updateAllToggleButtons(isDark) {
    document.querySelectorAll('.theme-toggle').forEach(button => {
        const icon = button.querySelector('.theme-icon');
        const text = button.querySelector('.theme-text');
        
        if (icon) icon.textContent = isDark ? '☀️' : '🌙';
        if (text) text.textContent = isDark ? 'Light' : 'Dark';
    });
}

function loadSavedTheme() {
    if (!features.darkMode) return;
    
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    console.log(`Theme loaded: ${savedTheme || 'light'}`);
}

function addThemeToggleButton() {
    if (!features.darkMode) return;
    
    const nav = document.querySelector('nav');
    if (!nav) {
        console.warn('⚠️ Navigation not found');
        return;
    }
    
    // If button already exists, update and ensure placement
    if (document.querySelector('.theme-toggle')) {
        updateAllToggleButtons(document.body.classList.contains('dark-theme'));
        placeThemeToggleForViewport();
        return;
    }
    
    const isDark = document.body.classList.contains('dark-theme');
    
    const button = document.createElement('button');
    button.className = 'theme-toggle';
    button.onclick = toggleTheme;
    button.innerHTML = `
        <span class="theme-icon">${isDark ? '☀️' : '🌙'}</span>
        <span class="theme-text">${isDark ? 'Light' : 'Dark'}</span>
    `;
    
    // Default placement: inside nav (desktop)
    nav.appendChild(button);
    placeThemeToggleForViewport();
    window.addEventListener('resize', placeThemeToggleForViewport);
    
    console.log('✅ Dark mode toggle added');
}

function placeThemeToggleForViewport() {
    const button = document.querySelector('.theme-toggle');
    if (!button) return;
    const nav = document.querySelector('nav');

    // Find an existing mobile container or header actions area
    let mobileContainer = document.querySelector('.mobile-tools') || document.querySelector('.header-actions') || null;

    if (window.innerWidth <= MOBILE_BREAKPOINT) {
        // Ensure there's a mobile container to hold the toggle
        if (!mobileContainer) {
            mobileContainer = document.createElement('div');
            mobileContainer.className = 'mobile-tools';
            // Place mobile-tools at top of body if no header-actions exists
            if (document.body.firstChild) {
                document.body.insertBefore(mobileContainer, document.body.firstChild);
            } else {
                document.body.appendChild(mobileContainer);
            }
        }
        if (button.parentNode !== mobileContainer) {
            mobileContainer.appendChild(button);
        }
        button.classList.add('theme-toggle-mobile');
    } else {
        // Put back inside nav (desktop)
        if (nav && button.parentNode !== nav) {
            nav.appendChild(button);
        }
        button.classList.remove('theme-toggle-mobile');
    }
}

// ============================================
// MOBILE NAV BEHAVIOR (KEEP NAV VISIBLE)
// ============================================

function initMobileNav() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    if (nav.dataset.mobileInit === 'true') return; // already initialized
    nav.dataset.mobileInit = 'true';

    // Ensure nav remains visible on mobile; no hamburger created.
    nav.style.display = ''; // let CSS handle layout
    // Make nav sticky via CSS (see CSS snippet)
    // Ensure theme toggle placement updates on resize
    window.addEventListener('resize', placeThemeToggleForViewport);

    console.log('✅ Mobile nav initialized: navigation will remain visible at the top (no hamburger).');
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
    if (!features.animations) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Add scroll-reveal to elements
    const elements = document.querySelectorAll('.card, section > p, section > h2, section > h3, .btn, .intro-container, section ul li');
    
    elements.forEach((el, index) => {
        el.classList.add('scroll-reveal');
        el.style.transitionDelay = `${index * 0.05}s`;
        observer.observe(el);
    });
    
    console.log(`✅ Animations initialized for ${elements.length} elements`);
}

// ============================================
// PROJECT FILTERS
// ============================================

function initProjectFilters() {
    if (!features.projectFilters) {
        const filters = document.getElementById('projectFilters');
        if (filters) filters.style.display = 'none';
        return;
    }
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.projects .card');
    
    if (filterButtons.length === 0) return; // Not on projects page
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active from all
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active to clicked
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            projectCards.forEach((card, index) => {
                const tech = card.getAttribute('data-tech') || '';
                const year = card.getAttribute('data-year') || '';
                
                if (filter === 'all' || tech.includes(filter) || year === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s`;
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
    
    console.log('✅ Project filters initialized');
}

// ============================================
// INITIALIZE EVERYTHING
// ============================================

function initializeAll() {
    console.log('🎯 Initializing all features...');
    
    // Load theme first (immediate)
    loadSavedTheme();
    
    // Add UI elements
    addThemeToggleButton();
    initMobileNav();
    
    // Initialize features
    initScrollAnimations();
    initProjectFilters();
    
    console.log('✅ All features ready!');
}

// ============================================
// RUN ON PAGE LOAD
// ============================================

// Load theme immediately (prevents flash)
loadSavedTheme();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAll);
} else {
    initializeAll();
}

// Make toggle available globally
window.toggleTheme = toggleTheme;

console.log('✨ Site features loaded successfully!');
