// Main JavaScript for Promptography
class Promptography {
    constructor() {
        this.posts = [];
        this.filteredPosts = [];
        this.currentFilter = 'all';
        this.currentPost = null;
        this.init();
    }

    async init() {
        try {
            await this.loadData();
            this.setupEventListeners();
            this.renderGallery();
            this.initializeIntersectionObserver();
        } catch (error) {
            console.error('Failed to initialize Promptography:', error);
            this.showError('Failed to load gallery. Please try again later.');
        }
    }

    async loadData() {
        try {
            const response = await fetch('data/data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.posts = data.posts;
            this.filteredPosts = [...this.posts];
        } catch (error) {
            console.error('Error loading data:', error);
            // Fallback to demo data if JSON fails to load
            this.loadDemoData();
        }
    }

    loadDemoData() {
        // Fallback demo data
        this.posts = [
            {
                id: "demo-1",
                title: "Demo Image",
                prompt: "A beautiful demonstration of AI art generation with detailed prompts and stunning visual results",
                image: "https://via.placeholder.com/400x400/6366f1/ffffff?text=Demo+Art",
                category: "landscapes",
                tags: ["demo", "placeholder", "example"],
                dateCreated: "2025-01-15",
                author: "Demo Artist",
                description: "This is a demo image to showcase the gallery functionality.",
                technicalDetails: {
                    model: "Demo Model",
                    resolution: "400x400",
                    iterations: 1
                },
                metadata: {
                    featured: true,
                    likes: 42,
                    views: 100
                }
            }
        ];
        this.filteredPosts = [...this.posts];
    }

    setupEventListeners() {
        // Navigation
        document.getElementById('mobileMenuBtn')?.addEventListener('click', this.toggleMobileMenu);
        document.getElementById('darkModeToggle')?.addEventListener('click', this.toggleDarkMode);
        
        // Search
        document.getElementById('searchBtn')?.addEventListener('click', this.openSearchModal);
        document.getElementById('searchInput')?.addEventListener('input', this.handleSearch.bind(this));
        
        // Modal close handlers
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) {
                this.closeAllModals();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', this.handleSmoothScroll);
        });
    }

    toggleMobileMenu() {
        const menu = document.getElementById('mobileMenu');
        menu?.classList.toggle('hidden');
    }

    toggleDarkMode() {
        // This is a placeholder - in a real implementation you'd toggle dark/light themes
        const toggle = document.getElementById('darkModeToggle');
        const icon = toggle?.querySelector('div');
        
        if (icon) {
            icon.classList.toggle('translate-x-4');
            // In a real app, you'd also toggle dark mode classes
            console.log('Dark mode toggled');
        }
    }

    openSearchModal() {
        const modal = document.getElementById('searchModal');
        const input = document.getElementById('searchInput');
        modal?.classList.remove('hidden');
        input?.focus();
        document.body.style.overflow = 'hidden';
    }

    closeSearchModal() {
        const modal = document.getElementById('searchModal');
        modal?.classList.add('hidden');
        document.body.style.overflow = '';
        document.getElementById('searchInput').value = '';
        document.getElementById('searchResults').innerHTML = '';
    }

    handleSearch(e) {
        const query = e.target.value.toLowerCase().trim();
        const resultsContainer = document.getElementById('searchResults');
        
        if (query.length < 2) {
            resultsContainer.innerHTML = '';
            return;
        }

        const results = this.posts.filter(post => 
            post.title.toLowerCase().includes(query) ||
            post.prompt.toLowerCase().includes(query) ||
            post.tags.some(tag => tag.toLowerCase().includes(query)) ||
            post.description.toLowerCase().includes(query)
        );

        this.renderSearchResults(results);
    }

    renderSearchResults(results) {
        const container = document.getElementById('searchResults');
        
        if (results.length === 0) {
            container.innerHTML = '<p class="text-slate-400 text-center py-4">No results found</p>';
            return;
        }

        container.innerHTML = results.map(post => `
            <div class="flex items-center space-x-4 p-3 hover:bg-slate-700/30 rounded-lg cursor-pointer transition-colors duration-300" 
                 onclick="app.openPost('${post.id}'); app.closeSearchModal();">
                <img src="${post.image}" alt="${post.title}" 
                     class="w-12 h-12 object-cover rounded-lg"
                     onerror="this.src='https://via.placeholder.com/48x48/6366f1/ffffff?text=?'">
                <div class="flex-1">
                    <h4 class="font-medium text-white">${post.title}</h4>
                    <p class="text-sm text-slate-400 truncate">${post.prompt}</p>
                </div>
            </div>
        `).join('');
    }

    handleKeyboard(e) {
        // ESC key closes modals
        if (e.key === 'Escape') {
            this.closeAllModals();
        }
        
        // Arrow keys for modal navigation
        if (document.getElementById('postModal').classList.contains('hidden') === false) {
            if (e.key === 'ArrowLeft') {
                this.navigateModal(-1);
            } else if (e.key === 'ArrowRight') {
                this.navigateModal(1);
            }
        }
    }

    handleSmoothScroll(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    filterGallery(category) {
        this.currentFilter = category;
        
        // Update filter button states
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-indigo-600', 'text-white');
            btn.classList.add('bg-slate-700', 'text-slate-300');
        });
        
        event.target.classList.remove('bg-slate-700', 'text-slate-300');
        event.target.classList.add('active', 'bg-indigo-600', 'text-white');
        
        // Filter posts
        if (category === 'all') {
            this.filteredPosts = [...this.posts];
        } else {
            this.filteredPosts = this.posts.filter(post => post.category === category);
        }
        
        this.renderGallery();
    }

    renderGallery() {
        const container = document.getElementById('galleryGrid');
        
        // Remove skeleton loaders
        container.querySelectorAll('.skeleton-card').forEach(card => card.remove());
        
        if (this.filteredPosts.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-16">
                    <p class="text-slate-400 text-lg">No artworks found in this category.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredPosts.map(post => `
            <div class="gallery-item group relative overflow-hidden rounded-2xl glass-morphism bg-white/5 border border-white/10 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 ease-out cursor-pointer"
                 data-category="${post.category}"
                 onclick="app.openPost('${post.id}')">
                <div class="aspect-square relative overflow-hidden">
                    <img src="${post.image}" 
                         alt="${post.title}"
                         class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                         onerror="this.src='https://via.placeholder.com/400x400/6366f1/ffffff?text=${encodeURIComponent(post.title)}'">
                    
                    <!-- Overlay -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div class="absolute bottom-0 left-0 right-0 p-6">
                            <h3 class="text-xl font-bold font-serif mb-2 text-white">${post.title}</h3>
                            <p class="text-sm text-slate-300 italic font-serif line-clamp-2 mb-3">"${post.prompt.substring(0, 100)}${post.prompt.length > 100 ? '...' : ''}"</p>
                            <div class="flex flex-wrap gap-2">
                                ${post.tags.slice(0, 3).map(tag => `
                                    <span class="px-2 py-1 rounded-full text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                        ${tag}
                                    </span>
                                `).join('')}
                                ${post.tags.length > 3 ? `<span class="px-2 py-1 rounded-full text-xs bg-slate-500/20 text-slate-300">+${post.tags.length - 3}</span>` : ''}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Featured badge -->
                    ${post.metadata.featured ? `
                        <div class="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                            Featured
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');

        // Initialize lazy loading for new images
        this.initializeLazyLoading();
    }

    openPost(postId) {
        this.currentPost = this.posts.find(post => post.id === postId);
        if (!this.currentPost) return;

        // Populate modal content
        document.getElementById('modalTitle').textContent = this.currentPost.title;
        document.getElementById('modalImage').src = this.currentPost.image;
        document.getElementById('modalImage').alt = this.currentPost.title;
        document.getElementById('modalPrompt').textContent = this.currentPost.prompt;
        document.getElementById('modalDescription').textContent = this.currentPost.description;
        
        // Render tags
        const tagsContainer = document.getElementById('modalTags');
        tagsContainer.innerHTML = this.currentPost.tags.map(tag => `
            <span class="px-3 py-1 rounded-full text-sm bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                ${tag}
            </span>
        `).join('');
        
        // Render technical details
        const techContainer = document.getElementById('modalTechnicalDetails');
        const tech = this.currentPost.technicalDetails;
        techContainer.innerHTML = `
            <div class="grid grid-cols-2 gap-4">
                <div><span class="font-medium">Model:</span> ${tech.model}</div>
                <div><span class="font-medium">Resolution:</span> ${tech.resolution}</div>
                <div><span class="font-medium">Iterations:</span> ${tech.iterations}</div>
                <div><span class="font-medium">Style:</span> ${tech.style || 'N/A'}</div>
            </div>
            <div class="mt-2">
                <span class="font-medium">Author:</span> ${this.currentPost.author} | 
                <span class="font-medium">Date:</span> ${new Date(this.currentPost.dateCreated).toLocaleDateString()} |
                <span class="font-medium">Views:</span> ${this.currentPost.metadata.views.toLocaleString()}
            </div>
        `;

        // Show modal
        document.getElementById('postModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        document.getElementById('postModal').classList.add('hidden');
        document.body.style.overflow = '';
        this.currentPost = null;
    }

    closeAllModals() {
        this.closeModal();
        this.closeSearchModal();
    }

    navigateModal(direction) {
        if (!this.currentPost) return;
        
        const currentIndex = this.filteredPosts.findIndex(post => post.id === this.currentPost.id);
        let nextIndex;
        
        if (direction === 1) { // Next
            nextIndex = (currentIndex + 1) % this.filteredPosts.length;
        } else { // Previous
            nextIndex = currentIndex === 0 ? this.filteredPosts.length - 1 : currentIndex - 1;
        }
        
        this.openPost(this.filteredPosts[nextIndex].id);
    }

    copyPrompt() {
        if (!this.currentPost) return;
        
        navigator.clipboard.writeText(this.currentPost.prompt).then(() => {
            this.showNotification('Prompt copied to clipboard!', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy prompt', 'error');
        });
    }

    sharePost() {
        if (!this.currentPost) return;
        
        const url = `${window.location.origin}${window.location.pathname}#post-${this.currentPost.id}`;
        
        if (navigator.share) {
            navigator.share({
                title: this.currentPost.title,
                text: this.currentPost.description,
                url: url
            });
        } else {
            navigator.clipboard.writeText(url).then(() => {
                this.showNotification('Link copied to clipboard!', 'success');
            }).catch(() => {
                this.showNotification('Failed to copy link', 'error');
            });
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white transition-all duration-300 transform translate-x-full`;
        
        if (type === 'success') {
            notification.classList.add('bg-emerald-600');
        } else if (type === 'error') {
            notification.classList.add('bg-red-600');
        } else {
            notification.classList.add('bg-indigo-600');
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    showError(message) {
        const container = document.getElementById('galleryGrid');
        container.innerHTML = `
            <div class="col-span-full text-center py-16">
                <div class="glass-morphism bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md mx-auto">
                    <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 class="text-xl font-semibold text-red-400 mb-2">Oops! Something went wrong</h3>
                    <p class="text-red-300">${message}</p>
                    <button onclick="location.reload()" class="mt-4 px-6 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors duration-300">
                        Try Again
                    </button>
                </div>
            </div>
        `;
    }

    initializeLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('skeleton-loader');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    initializeIntersectionObserver() {
        // Animate elements on scroll
        const observeElements = document.querySelectorAll('.gallery-item, .floating-orb');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        observeElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    }
}

// Global functions for HTML onclick handlers
function scrollToGallery() {
    document.getElementById('gallery').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function openSubmitModal() {
    // Placeholder for submit modal - would open admin interface or submission form
    alert('Submit functionality would open here. For now, please use the admin interface.');
}

function filterGallery(category) {
    if (window.app) {
        window.app.filterGallery(category);
    }
}

function closeModal() {
    if (window.app) {
        window.app.closeModal();
    }
}

function closeSearchModal() {
    if (window.app) {
        window.app.closeSearchModal();
    }
}

function copyPrompt() {
    if (window.app) {
        window.app.copyPrompt();
    }
}

function sharePost() {
    if (window.app) {
        window.app.sharePost();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new Promptography();
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
