/**
 * Blog Module - Firestore Blog Management
 * KISHORE Portfolio System
 */

const Blog = (function() {
    // Cache DOM elements
    let blogGrid = null;
    let filterContainer = null;
    let currentCategory = 'all';

    // Initialize on blog page
    function init() {
        blogGrid = document.getElementById('blogPostsGrid');
        filterContainer = document.getElementById('blogCategoryFilter');
        
        if (!blogGrid) return;
        
        initCategoryFilters();
        loadPosts();
    }

    // Initialize category filters
    function initCategoryFilters() {
        if (!filterContainer) return;

        // Add "All" button (already there)
        // Add categories from config
        const categories = new Set();
        APP_CONFIG.blogPosts.forEach(post => {
            if (post.category) categories.add(post.category);
        });

        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.dataset.category = cat;
            btn.textContent = cat;
            filterContainer.appendChild(btn);
        });

        // Add event listeners
        filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentCategory = btn.dataset.category === 'all' ? 'all' : btn.dataset.category;
                loadPosts();
            });
        });
    }

    // Load blog posts
    async function loadPosts() {
        if (!blogGrid) return;

        blogGrid.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i> Loading posts...
            </div>
        `;

        try {
            // Try Firebase first, fallback to config
            let posts = [];
            
            if (firebaseDb) {
                try {
                    let query = firebaseDb.collection('blogPosts').orderBy('date', 'desc');
                    
                    if (currentCategory !== 'all') {
                        query = query.where('category', '==', currentCategory);
                    }
                    
                    const snapshot = await query.get();
                    
                    if (!snapshot.empty) {
                        snapshot.forEach(doc => {
                            posts.push({ id: doc.id, ...doc.data() });
                        });
                    }
                } catch (fbError) {
                    console.log('Firebase not available, using config data');
                }
            }

            // Fallback to config data
            if (posts.length === 0) {
                posts = APP_CONFIG.blogPosts.filter(post => 
                    currentCategory === 'all' || post.category === currentCategory
                );
            }

            if (posts.length === 0) {
                blogGrid.innerHTML = '<p class="text-center">No blog posts yet. Check back soon!</p>';
                return;
            }

            blogGrid.innerHTML = posts.map(post => createPostCard(post)).join('');
            attachReadMoreListeners();

        } catch (error) {
            console.error('Error loading posts:', error);
            blogGrid.innerHTML = '<p class="text-center">Error loading posts. Please refresh.</p>';
        }
    }

    function createPostCard(post) {
        const date = formatDate(post.date || post.publishedAt);
        const excerpt = post.excerpt || (post.content ? post.content.substring(0, 150) + '...' : '');
        
        return `
            <div class="blog-card" data-id="${post.id}">
                <div class="blog-image">
                    <img src="${post.image || '/assets/images/blog-placeholder.jpg'}" 
                         alt="${post.title}"
                         onerror="this.src='/assets/images/blog-placeholder.jpg'">
                </div>
                <div class="blog-content">
                    <h3 class="blog-title">${escapeHtml(post.title)}</h3>
                    <p class="blog-excerpt">${escapeHtml(excerpt)}</p>
                    <div class="blog-meta">
                        <span><i class="far fa-calendar"></i> ${date}</span>
                        <span><i class="far fa-folder"></i> ${post.category || 'Uncategorized'}</span>
                        ${post.readTime ? `<span><i class="far fa-clock"></i> ${post.readTime} min read</span>` : ''}
                    </div>
                    <a href="#" class="read-more" data-id="${post.id}">
                        Read More <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
    }

    function attachReadMoreListeners() {
        document.querySelectorAll('.read-more').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const postId = link.dataset.id;
                const post = findPostById(postId);
                if (post) {
                    showPostModal(post);
                }
            });
        });
    }

    function findPostById(id) {
        // Try from config first
        let post = APP_CONFIG.blogPosts.find(p => p.id == id);
        
        // If not found, might be from Firebase - we need to fetch
        if (!post) {
            const card = document.querySelector(`.blog-card[data-id="${id}"]`);
            if (card) {
                // Extract from DOM (fallback)
                return {
                    id: id,
                    title: card.querySelector('.blog-title')?.textContent || 'Post',
                    excerpt: card.querySelector('.blog-excerpt')?.textContent || '',
                    category: card.querySelector('.blog-meta span:nth-child(2)')?.textContent.replace('📁 ', '') || 'General',
                    date: card.querySelector('.blog-meta span:first-child')?.textContent.replace('📅 ', '') || '',
                    content: 'Full content would load from Firebase...'
                };
            }
        }
        
        return post;
    }

    function showPostModal(post) {
        const modal = document.getElementById('projectModal');
        const modalBody = document.getElementById('modalBody');
        
        const date = formatDate(post.date || post.publishedAt);
        const content = post.content || post.longDescription || post.excerpt || 'Content not available.';
        
        modalBody.innerHTML = `
            <h2>${escapeHtml(post.title)}</h2>
            <div style="margin-bottom: 1rem;">
                <span style="color: var(--primary);">${post.category || 'General'}</span>
                <span style="margin-left: 1rem; color: var(--text-tertiary);">📅 ${date}</span>
                ${post.readTime ? `<span style="margin-left: 1rem; color: var(--text-tertiary);">⏱️ ${post.readTime} min read</span>` : ''}
            </div>
            <img src="${post.image || '/assets/images/blog-placeholder.jpg'}" 
                 alt="${post.title}" 
                 style="width:100%; max-height:300px; object-fit:cover; border-radius:8px; margin:1rem 0;"
                 onerror="this.src='/assets/images/blog-placeholder.jpg'">
            <div class="blog-content-full" style="line-height: 1.8;">
                ${content.replace(/\n/g, '<br>')}
            </div>
            <div style="margin-top: 2rem;">
                <p><em>Written by ${post.author || 'KISHORE'}</em></p>
            </div>
        `;
        
        modal.classList.add('show');
        
        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = () => {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        };
        
        window.onclick = (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                document.body.style.overflow = '';
            }
        };
    }

    // Helper functions
    function formatDate(dateInput) {
        if (!dateInput) return 'Unknown date';
        
        try {
            const date = new Date(dateInput);
            if (isNaN(date.getTime())) return String(dateInput);
            
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return String(dateInput);
        }
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Public API
    return {
        init: init,
        loadPosts: loadPosts,
        reload: () => {
            currentCategory = 'all';
            document.querySelectorAll('.filter-btn').forEach(btn => {
                if (btn.dataset.category === 'all') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            loadPosts();
        }
    };
})();

// Initialize on blog page
if (window.location.pathname.includes('blog.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        Blog.init();
    });
}

window.Blog = Blog;
