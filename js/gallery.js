// Gallery data management and dynamic loading
class PromptographyGallery {
    constructor() {
        this.galleryData = null;
        this.currentFilter = 'all';
        this.currentSort = 'newest';
        this.init();
    }

    async init() {
        try {
            await this.loadGalleryData();
            this.renderGallery();
            this.setupEventListeners();
        } catch (error) {
            console.error('Failed to initialize gallery:', error);
            this.renderFallbackGallery();
        }
    }

    async loadGalleryData() {
        try {
            const response = await fetch('data/gallery.json');
            if (!response.ok) {
                throw new Error('Failed to fetch gallery data');
            }
            this.galleryData = await response.json();
        } catch (error) {
            console.warn('Could not load gallery data, using fallback');
            throw error;
        }
    }

    renderGallery() {
        const galleryContainer = document.getElementById('gallery-grid');
        if (!galleryContainer || !this.galleryData) return;

        const filteredItems = this.getFilteredItems();
        const sortedItems = this.getSortedItems(filteredItems);

        galleryContainer.innerHTML = sortedItems.map(item => this.createGalleryItemHTML(item)).join('');
        
        // Update stats
        this.updateStats();
    }

    getFilteredItems() {
        if (!this.galleryData) return [];
        
        if (this.currentFilter === 'all') {
            return this.galleryData.gallery;
        }
        
        if (this.currentFilter === 'featured') {
            return this.galleryData.gallery.filter(item => item.featured);
        }
        
        return this.galleryData.gallery.filter(item => 
            item.category === this.currentFilter || 
            item.tags.includes(this.currentFilter)
        );
    }

    getSortedItems(items) {
        switch (this.currentSort) {
            case 'newest':
                return items.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
            case 'oldest':
                return items.sort((a, b) => new Date(a.dateCreated) - new Date(b.dateCreated));
            case 'popular':
                return items.sort((a, b) => b.likes - a.likes);
            case 'views':
                return items.sort((a, b) => b.views - a.views);
            default:
                return items;
        }
    }

    createGalleryItemHTML(item) {
        const formattedDate = new Date(item.dateCreated).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const tagElements = item.tags.slice(0, 2).map(tag => 
            `<span class="px-2 py-1 bg-${this.getTagColor(tag)}-600/20 text-${this.getTagColor(tag)}-400 rounded-full text-xs">${tag}</span>`
        ).join('');

        return `
            <div class="group cursor-pointer" onclick="openModal('${item.id}')">
                <div class="bg-slate-800 rounded-2xl shadow-lg overflow-hidden transform group-hover:scale-105 transition-all duration-300 group-hover:shadow-2xl">
                    <div class="aspect-square bg-gradient-to-br ${this.getGradientClasses(item.category)} relative overflow-hidden">
                        <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                        <div class="absolute inset-0 flex items-center justify-center text-white text-6xl font-bold opacity-50">
                            ${this.getCategoryEmoji(item.category)}
                        </div>
                        ${item.featured ? '<div class="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">Featured</div>' : ''}
                    </div>
                    <div class="p-6">
                        <h3 class="font-bold text-lg mb-2 text-white">${item.title}</h3>
                        <p class="font-serif italic text-sm text-slate-300 mb-3 leading-relaxed line-clamp-3">
                            "${item.prompt}"
                        </p>
                        <div class="flex flex-wrap gap-2 mb-3">
                            ${tagElements}
                        </div>
                        <div class="flex justify-between items-center text-xs text-slate-500">
                            <span>${formattedDate}</span>
                            <div class="flex items-center space-x-3">
                                <span class="flex items-center">
                                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
                                    </svg>
                                    ${item.likes}
                                </span>
                                <span class="flex items-center">
                                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                                        <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                                    </svg>
                                    ${item.views}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getGradientClasses(category) {
        const gradients = {
            landscape: 'from-green-400 to-blue-400',
            portrait: 'from-pink-400 to-violet-400',
            abstract: 'from-purple-400 to-indigo-400',
            fantasy: 'from-purple-400 to-pink-400',
            architecture: 'from-orange-400 to-red-400',
            nature: 'from-green-400 to-teal-400',
            digital: 'from-cyan-400 to-blue-400',
            space: 'from-indigo-400 to-purple-400',
            macro: 'from-emerald-400 to-cyan-400'
        };
        return gradients[category] || 'from-slate-400 to-slate-500';
    }

    getCategoryEmoji(category) {
        const emojis = {
            landscape: '🏞️',
            portrait: '👤',
            abstract: '🎨',
            fantasy: '🧙‍♂️',
            architecture: '🏛️',
            nature: '🌿',
            digital: '💻',
            space: '🌌',
            macro: '🔍'
        };
        return emojis[category] || '🎨';
    }

    getTagColor(tag) {
        const colors = ['indigo', 'purple', 'pink', 'blue', 'green', 'yellow', 'red', 'cyan'];
        const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    }

    updateStats() {
        if (!this.galleryData) return;

        const statsElements = {
            totalArtworks: document.getElementById('total-artworks'),
            totalViews: document.getElementById('total-views'),
            totalLikes: document.getElementById('total-likes')
        };

        if (statsElements.totalArtworks) {
            statsElements.totalArtworks.textContent = this.galleryData.stats.totalArtworks;
        }
        if (statsElements.totalViews) {
            statsElements.totalViews.textContent = this.galleryData.stats.totalViews.toLocaleString();
        }
        if (statsElements.totalLikes) {
            statsElements.totalLikes.textContent = this.galleryData.stats.totalLikes.toLocaleString();
        }
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('[data-filter]').forEach(button => {
            button.addEventListener('click', (e) => {
                this.currentFilter = e.target.dataset.filter;
                this.updateActiveFilter(e.target);
                this.renderGallery();
            });
        });

        // Sort dropdown
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.renderGallery();
            });
        }

        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchGallery(e.target.value);
                }, 300);
            });
        }
    }

    updateActiveFilter(activeButton) {
        document.querySelectorAll('[data-filter]').forEach(button => {
            button.classList.remove('bg-indigo-600', 'text-white');
            button.classList.add('bg-slate-700', 'text-slate-300');
        });
        
        activeButton.classList.remove('bg-slate-700', 'text-slate-300');
        activeButton.classList.add('bg-indigo-600', 'text-white');
    }

    searchGallery(query) {
        if (!this.galleryData || !query.trim()) {
            this.renderGallery();
            return;
        }

        const searchTerm = query.toLowerCase();
        const filteredItems = this.galleryData.gallery.filter(item => 
            item.title.toLowerCase().includes(searchTerm) ||
            item.prompt.toLowerCase().includes(searchTerm) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            item.category.toLowerCase().includes(searchTerm)
        );

        const galleryContainer = document.getElementById('gallery-grid');
        if (galleryContainer) {
            galleryContainer.innerHTML = filteredItems.map(item => this.createGalleryItemHTML(item)).join('');
        }
    }

    renderFallbackGallery() {
        // Fallback to static gallery if JSON loading fails
        console.log('Using static gallery as fallback');
    }

    // Modal functionality
    openModal(itemId) {
        if (!this.galleryData) return;
        
        const item = this.galleryData.gallery.find(galleryItem => galleryItem.id === itemId);
        if (!item) return;

        const modal = document.getElementById('modal');
        if (!modal) return;

        // Update modal content
        document.getElementById('modal-title').textContent = item.title;
        document.getElementById('modal-prompt').textContent = item.prompt;
        document.getElementById('modal-date').textContent = new Date(item.dateCreated).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Update modal image
        const modalImage = document.getElementById('modal-image');
        modalImage.className = `aspect-square bg-gradient-to-br ${this.getGradientClasses(item.category)} rounded-xl mb-6 flex items-center justify-center text-8xl`;
        modalImage.textContent = this.getCategoryEmoji(item.category);

        // Update tags
        const modalTags = document.getElementById('modal-tags');
        modalTags.innerHTML = item.tags.slice(0, 3).map(tag => 
            `<span class="px-3 py-1 bg-${this.getTagColor(tag)}-600/20 text-${this.getTagColor(tag)}-400 rounded-full text-sm mr-2">${tag}</span>`
        ).join('');

        // Show modal
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';

        // Update view count (in a real app, this would be sent to backend)
        item.views++;
        this.updateStats();
    }
}

// Modal functions (global scope for onclick handlers)
function openModal(itemId) {
    if (window.galleryInstance) {
        window.galleryInstance.openModal(itemId);
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.galleryInstance = new PromptographyGallery();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PromptographyGallery;
}
