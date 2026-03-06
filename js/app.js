document.addEventListener('DOMContentLoaded', function() {
    console.log('KISHORE Portfolio - 25IT161');
    
    // Initialize theme
    initTheme();
    
    // Hide skeleton loader
    setTimeout(() => {
        document.getElementById('skeleton-loader').style.display = 'none';
        document.getElementById('app').style.display = 'block';
    }, 500);
    
    // Render stats
    renderStats();
    
    // Render skills
    renderSkills();
    
    // Render projects
    renderProjects();
    
    // Render certifications
    renderCertifications();
    
    // Render social links
    renderSocialLinks();
    
    // Initialize back to top button
    initBackToTop();
    
    // Initialize navbar scroll effect
    initNavbarScroll();
});

// Theme initialization function
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const storedTheme = localStorage.getItem('kishore-theme') || 'light'; // Default to light
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', storedTheme);
    updateThemeIcon(storedTheme);
    
    // Theme toggle click handler
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('kishore-theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
}

// Update theme toggle icon
function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Render stats from config
function renderStats() {
    const statsGrid = document.getElementById('statsGrid');
    if (statsGrid && APP_CONFIG.stats) {
        statsGrid.innerHTML = APP_CONFIG.stats.map(stat => `
            <div class="stat-item">
                <div class="stat-icon"><i class="fas ${stat.icon}"></i></div>
                <div class="stat-value">${stat.value}</div>
                <div class="stat-label">${stat.label}</div>
            </div>
        `).join('');
    }
}

// Render skills from config
function renderSkills() {
    const skillsGrid = document.getElementById('skillsGrid');
    if (!skillsGrid) return;
    
    let allSkills = [];
    Object.values(APP_CONFIG.skills).forEach(cat => {
        allSkills = allSkills.concat(cat);
    });
    
    skillsGrid.innerHTML = allSkills.map(skill => `
        <div class="skill-card">
            <div class="skill-header">
                <span><i class="${skill.icon}"></i> ${skill.name}</span>
                <span>${skill.level}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width:${skill.level}%"></div>
            </div>
        </div>
    `).join('');
}

// Render projects from config
function renderProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (projectsGrid && APP_CONFIG.projects) {
        projectsGrid.innerHTML = APP_CONFIG.projects.map(proj => `
            <div class="project-card">
                <div class="project-content">
                    <h3>${proj.title}</h3>
                    <p>${proj.description}</p>
                    <div style="margin-top:15px">
                        <a href="${proj.githubUrl}" target="_blank" style="color:#6366f1; text-decoration:none; font-weight:600;">
                            View on GitHub <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Render certifications from config
function renderCertifications() {
    const certGrid = document.getElementById('certGrid');
    if (certGrid && APP_CONFIG.certifications) {
        certGrid.innerHTML = APP_CONFIG.certifications.map(cert => {
            const progressColor = cert.progress === 100 ? '#10b981' : '#f59e0b';
            return `
            <div class="cert-card">
                <h3>${cert.name}</h3>
                <p style="color: var(--text-tertiary); margin-bottom: 5px;">${cert.issuer}</p>
                <p style="color: var(--primary); font-size: 0.9rem;">${cert.date}</p>
                <div style="height:4px; background: var(--border-color); margin-top:15px; border-radius:2px; overflow:hidden;">
                    <div style="width:${cert.progress}%; height:100%; background:${progressColor}; border-radius:2px;"></div>
                </div>
                <div style="display:flex; justify-content:space-between; margin-top:5px;">
                    <small style="color: var(--text-tertiary);">Progress</small>
                    <small style="color: ${progressColor}; font-weight:600;">${cert.progress}%</small>
                </div>
            </div>
        `}).join('');
    }
}

// Render social links
function renderSocialLinks() {
    const socialHero = document.getElementById('socialLinksHero');
    const contactLinks = document.getElementById('contactLinks');
    const footerSocial = document.getElementById('footerSocial');
    
    if (!APP_CONFIG.contact) return;
    
    const contactValues = Object.values(APP_CONFIG.contact);
    
    // Hero social icons
    if (socialHero) {
        socialHero.innerHTML = contactValues.map(c => 
            `<a href="${c.url}" target="_blank" class="social-icon" title="${c.label}">
                <i class="${c.icon}"></i>
            </a>`
        ).join('');
    }
    
    // Footer social icons
    if (footerSocial) {
        footerSocial.innerHTML = contactValues.map(c => 
            `<a href="${c.url}" target="_blank" class="social-icon" title="${c.label}">
                <i class="${c.icon}"></i>
            </a>`
        ).join('');
    }
    
    // Contact section links
    if (contactLinks) {
        contactLinks.innerHTML = contactValues.map(c =>
            `<a href="${c.url}" class="contact-link" target="_blank">
                <i class="${c.icon}"></i> ${c.label}
            </a>`
        ).join('');
    }
}

// Initialize back to top button
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Initialize navbar scroll effect
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}
