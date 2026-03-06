/**
 * Main Application Entry Point
 * KISHORE Portfolio - Information Technology Student
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        hideSkeletonLoader();
        initTheme();
        initNavigation();
        initScrollEffects();
        initTypingAnimation();
        initStats();
        initAbout();
        initSkillFilters();
        initProjectCards();
        initCertCards();
        initBlogPosts();
        initContactForm();
        initBackToTop();
        initSocialLinks();
        initCustomCursor();
        initScrollReveal();
        loadVisitorCount();
    }

    function hideSkeletonLoader() {
        const skeleton = document.getElementById('skeleton-loader');
        const app = document.getElementById('app');
        if (skeleton && app) {
            setTimeout(() => {
                skeleton.style.display = 'none';
                app.style.display = 'block';
            }, 500);
        }
    }

    function initTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const storedTheme = localStorage.getItem(APP_CONFIG.ui.theme.localStorageKey) || APP_CONFIG.ui.theme.default;
        
        document.documentElement.setAttribute('data-theme', storedTheme);
        updateThemeIcon(storedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem(APP_CONFIG.ui.theme.localStorageKey, newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    function initNavigation() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        
        if (hamburger) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
        }

        // Close menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // Active link highlighting
        const sections = document.querySelectorAll('section[id]');
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    function initScrollEffects() {
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    function initTypingAnimation() {
        const typedElement = document.querySelector('.typed-text');
        if (!typedElement) return;

        const strings = APP_CONFIG.owner.dynamicTitles || [
            'IT Student',
            'Tech Enthusiast',
            'Cloud Learner',
            'Beginner Developer'
        ];
        
        let i = 0;
        let j = 0;
        let currentString = '';
        let isDeleting = false;

        function type() {
            if (i < strings.length) {
                if (!isDeleting && j <= strings[i].length) {
                    currentString = strings[i].substring(0, j);
                    typedElement.textContent = currentString;
                    j++;
                    setTimeout(type, 100);
                } else if (isDeleting && j >= 0) {
                    currentString = strings[i].substring(0, j);
                    typedElement.textContent = currentString;
                    j--;
                    setTimeout(type, 50);
                } else {
                    if (!isDeleting) {
                        isDeleting = true;
                        setTimeout(type, 1000);
                    } else {
                        isDeleting = false;
                        i = (i + 1) % strings.length;
                        j = 0;
                        setTimeout(type, 200);
                    }
                }
            }
        }
        type();
    }

    function initStats() {
        const statsGrid = document.getElementById('statsGrid');
        if (!statsGrid) return;

        statsGrid.innerHTML = APP_CONFIG.stats.map(stat => `
            <div class="stat-item">
                <div class="stat-icon"><i class="fas ${stat.icon}"></i></div>
                <div class="stat-value">${stat.value}${stat.suffix || ''}</div>
                <div class="stat-label">${stat.label}</div>
            </div>
        `).join('');
    }

    function initAbout() {
        const educationList = document.getElementById('educationList');
        if (!educationList) return;

        educationList.innerHTML = APP_CONFIG.education.map(edu => `
            <div class="education-item">
                <h4>${edu.degree}</h4>
                <p>${edu.institution}</p>
                <p>${edu.period}</p>
                <p>${edu.description}</p>
            </div>
        `).join('');
    }

    function initSkillFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        let currentCategory = 'all';

        function renderSkills() {
            const skillsGrid = document.getElementById('skillsGrid');
            if (!skillsGrid) return;

            let allSkills = [];
            for (let category in APP_CONFIG.skills) {
                allSkills = [...allSkills, ...APP_CONFIG.skills[category]];
            }

            // Filter by category
            if (currentCategory !== 'all') {
                allSkills = allSkills.filter(skill => skill.category === currentCategory);
            }

            // Render
            skillsGrid.innerHTML = allSkills.map(skill => `
                <div class="skill-card">
                    <div class="skill-header">
                        <span class="skill-name">
                            <i class="${skill.icon}"></i>
                            ${skill.name}
                        </span>
                        <span class="skill-percentage">${skill.level}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${skill.level}%"></div>
                    </div>
                </div>
            `).join('');
        }

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentCategory = btn.dataset.category;
                renderSkills();
            });
        });

        renderSkills();
    }

    function initProjectCards() {
        const projectsGrid = document.getElementById('projectsGrid');
        if (!projectsGrid) return;

        projectsGrid.innerHTML = APP_CONFIG.projects.map(project => `
            <div class="project-card" data-id="${project.id}">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}" onerror="this.src='/assets/images/project-placeholder.jpg'">
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="project-link"><i class="fab fa-github"></i></a>` : ''}
                        ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="project-link"><i class="fas fa-external-link-alt"></i></a>` : ''}
                        <a href="#" class="project-link view-details"><i class="fas fa-info-circle"></i></a>
                    </div>
                </div>
            </div>
        `).join('');

        // Add modal event listeners
        document.querySelectorAll('.view-details').forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                showProjectModal(APP_CONFIG.projects[index]);
            });
        });
    }

    function showProjectModal(project) {
        const modal = document.getElementById('projectModal');
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <h2>${project.title}</h2>
            <img src="${project.image}" alt="${project.title}" style="width:100%; max-height:300px; object-fit:cover; border-radius:8px; margin:1rem 0;" onerror="this.src='/assets/images/project-placeholder.jpg'">
            <p>${project.longDescription || project.description}</p>
            <p><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>
            <p><strong>Category:</strong> ${project.category}</p>
            ${project.features ? `
                <p><strong>Features:</strong></p>
                <ul>
                    ${project.features.map(f => `<li>${f}</li>`).join('')}
                </ul>
            ` : ''}
            <div style="display:flex; gap:1rem; margin-top:1rem;">
                ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="btn btn-outline">GitHub</a>` : ''}
                ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="btn btn-primary">Live Demo</a>` : ''}
            </div>
        `;
        modal.classList.add('show');
        
        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = () => modal.classList.remove('show');
        window.onclick = (e) => {
            if (e.target === modal) modal.classList.remove('show');
        };
    }

    function initCertCards() {
        const certGrid = document.getElementById('certGrid');
        if (!certGrid) return;

        const getProgressColor = (progress) => {
            if (progress === 100) return '#10b981';
            if (progress >= 60) return '#f59e0b';
            return '#6366f1';
        };

        const getProgressText = (progress) => {
            if (progress === 100) return 'Completed';
            return `${progress}% Complete`;
        };

        certGrid.innerHTML = APP_CONFIG.certifications.map(cert => {
            const progressColor = getProgressColor(cert.progress);
            const progressText = getProgressText(cert.progress);
            
            return `
            <div class="cert-card" data-id="${cert.id}">
                <div class="cert-image">
                    <img src="${cert.image}" alt="${cert.name}" onerror="this.src='/assets/images/cert-placeholder.jpg'">
                    <div class="cert-progress-badge" style="background: ${progressColor}">
                        ${progressText}
                    </div>
                </div>
                <div class="cert-content">
                    <h3 class="cert-name">${cert.name}</h3>
                    <p class="cert-issuer">${cert.issuer}</p>
                    <p class="cert-date">${cert.date}</p>
                    <div class="cert-progress-bar">
                        <div class="progress-fill" style="width: ${cert.progress}%; background: ${progressColor}"></div>
                    </div>
                    <div class="cert-skills">
                        ${cert.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
            </div>
        `}).join('');

        // Add modal event
        document.querySelectorAll('.cert-card').forEach((card, index) => {
            card.addEventListener('click', () => showCertModal(APP_CONFIG.certifications[index]));
        });
    }

    function showCertModal(cert) {
        const modal = document.getElementById('certModal');
        const modalBody = document.getElementById('certModalBody');
        const progressColor = cert.progress === 100 ? '#10b981' : '#6366f1';
        
        modalBody.innerHTML = `
            <h2>${cert.name}</h2>
            <img src="${cert.image}" alt="${cert.name}" style="width:100%; max-height:300px; object-fit:contain; margin:1rem 0; border-radius:8px;" onerror="this.src='/assets/images/cert-placeholder.jpg'">
            <p><strong>Issuer:</strong> ${cert.issuer}</p>
            <p><strong>Date:</strong> ${cert.date}</p>
            <p><strong>Credential ID:</strong> ${cert.credentialId}</p>
            <p><strong>Progress:</strong> <span style="color: ${progressColor}">${cert.progress}%</span></p>
            <p><strong>Skills:</strong> ${cert.skills.join(', ')}</p>
            ${cert.verificationUrl && cert.verificationUrl !== '#' ? 
                `<a href="${cert.verificationUrl}" target="_blank" class="btn btn-primary">Verify Certificate</a>` : 
                '<p class="text-muted">Verification link will be available upon completion</p>'
            }
        `;
        modal.classList.add('show');
        
        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = () => modal.classList.remove('show');
        window.onclick = (e) => {
            if (e.target === modal) modal.classList.remove('show');
        };
    }

    function initBlogPosts() {
        const blogGrid = document.getElementById('blogGrid');
        if (!blogGrid) return;

        if (!APP_CONFIG.blogPosts || APP_CONFIG.blogPosts.length === 0) {
            blogGrid.innerHTML = '<p class="text-center">No blog posts yet. Check back soon!</p>';
            return;
        }

        blogGrid.innerHTML = APP_CONFIG.blogPosts.slice(0, 3).map(post => {
            const date = new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            return `
            <div class="blog-card">
                <div class="blog-image">
                    <img src="${post.image}" alt="${post.title}" onerror="this.src='/assets/images/blog-placeholder.jpg'">
                </div>
                <div class="blog-content">
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <div class="blog-meta">
                        <span><i class="far fa-calendar"></i> ${date}</span>
                        <span><i class="far fa-clock"></i> ${post.readTime} min read</span>
                    </div>
                    <a href="/blog.html" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>
        `}).join('');
    }

    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            // Simulate sending
            setTimeout(() => {
                alert('Message sent successfully! I\'ll get back to you soon.');
                form.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }, 1500);
        });
    }

    function initBackToTop() {
        const backToTop = document.getElementById('backToTop');
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

    function initSocialLinks() {
        const contact = APP_CONFIG.contact;
        
        // Hero social links
        const heroSocial = document.getElementById('socialLinksHero');
        if (heroSocial) {
            heroSocial.innerHTML = Object.values(contact).map(item => `
                <a href="${item.url}" target="_blank" class="social-icon" aria-label="${item.label}">
                    <i class="${item.icon}"></i>
                </a>
            `).join('');
        }

        // Contact section links
        const contactLinks = document.getElementById('contactLinks');
        if (contactLinks) {
            contactLinks.innerHTML = Object.values(contact).map(item => `
                <a href="${item.url}" class="contact-link" target="_blank">
                    <i class="${item.icon}"></i>
                    <span>${item.label}</span>
                </a>
            `).join('');
        }

        // Footer social
        const footerSocial = document.getElementById('footerSocial');
        if (footerSocial) {
            footerSocial.innerHTML = Object.values(contact).map(item => `
                <a href="${item.url}" target="_blank" class="social-icon" aria-label="${item.label}">
                    <i class="${item.icon}"></i>
                </a>
            `).join('');
        }
    }

    function initCustomCursor() {
        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');
        
        if (!cursor || !follower) return;

        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            follower.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        });

        document.addEventListener('mousedown', () => {
            cursor.style.transform += ' scale(0.8)';
            follower.style.transform += ' scale(1.5)';
        });

        document.addEventListener('mouseup', () => {
            cursor.style.transform = cursor.style.transform.replace(' scale(0.8)', '');
            follower.style.transform = follower.style.transform.replace(' scale(1.5)', '');
        });
    }

    function initScrollReveal() {
        const reveals = document.querySelectorAll('.reveal');
        
        function checkReveal() {
            reveals.forEach(element => {
                const windowHeight = window.innerHeight;
                const revealTop = element.getBoundingClientRect().top;
                const revealPoint = 150;
                
                if (revealTop < windowHeight - revealPoint) {
                    element.classList.add('active');
                }
            });
        }
        
        window.addEventListener('scroll', checkReveal);
        checkReveal();
    }

    function loadVisitorCount() {
        // Simulate visitor count with localStorage
        let count = localStorage.getItem('visitorCount') || 0;
        count = parseInt(count) + 1;
        localStorage.setItem('visitorCount', count);
        const visitorEl = document.getElementById('visitorCount');
        if (visitorEl) visitorEl.textContent = count;
    }
})();
