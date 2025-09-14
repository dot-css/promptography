// Admin JavaScript for Promptography
class PromptographyAdmin {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {};
        this.selectedImage = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFormValidation();
        this.updateStepIndicator();
    }

    setupEventListeners() {
        // Image upload
        const dropZone = document.getElementById('dropZone');
        const imageInput = document.getElementById('imageInput');

        dropZone.addEventListener('click', () => imageInput.click());
        dropZone.addEventListener('dragover', this.handleDragOver.bind(this));
        dropZone.addEventListener('dragleave', this.handleDragLeave.bind(this));
        dropZone.addEventListener('drop', this.handleDrop.bind(this));
        imageInput.addEventListener('change', this.handleImageSelect.bind(this));

        // Character counters
        document.getElementById('title').addEventListener('input', this.updateCharacterCount);
        document.getElementById('prompt').addEventListener('input', this.updateCharacterCount);

        // Real-time preview updates
        document.querySelectorAll('#adminForm input, #adminForm textarea, #adminForm select').forEach(input => {
            input.addEventListener('input', this.updatePreview.bind(this));
        });
    }

    setupFormValidation() {
        const form = document.getElementById('adminForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateJSON();
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('dragover');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processImage(files[0]);
        }
    }

    handleImageSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processImage(file);
        }
    }

    processImage(file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showNotification('Please select a valid image file', 'error');
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            this.showNotification('Image file size must be less than 5MB', 'error');
            return;
        }

        this.selectedImage = file;

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewContainer = document.getElementById('imagePreview');
            const previewImg = document.getElementById('previewImg');
            
            previewImg.src = e.target.result;
            previewContainer.classList.remove('hidden');
            
            // Update preview in step 4
            this.updatePreview();
        };
        reader.readAsDataURL(file);
    }

    removeImage() {
        this.selectedImage = null;
        document.getElementById('imagePreview').classList.add('hidden');
        document.getElementById('imageInput').value = '';
        this.updatePreview();
    }

    updateCharacterCount(e) {
        const input = e.target;
        const counterId = input.id + 'Count';
        const counter = document.getElementById(counterId);
        
        if (counter) {
            counter.textContent = input.value.length;
        }
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.showStep(this.currentStep);
                this.updateStepIndicator();
                this.updateNavigationButtons();
                this.updatePreview();
            }
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showStep(this.currentStep);
            this.updateStepIndicator();
            this.updateNavigationButtons();
        }
    }

    showStep(step) {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(stepEl => {
            stepEl.classList.remove('active');
        });

        // Show current step
        document.getElementById(`step${step}`).classList.add('active');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateStepIndicator() {
        document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
            const stepNumber = index + 1;
            const circle = indicator.querySelector('div');
            const label = indicator.querySelector('span');

            if (stepNumber <= this.currentStep) {
                circle.classList.remove('bg-slate-600', 'text-slate-400');
                circle.classList.add('bg-indigo-600', 'text-white');
                label.classList.remove('text-slate-400');
                label.classList.add('text-white');
                indicator.classList.add('active');
            } else {
                circle.classList.remove('bg-indigo-600', 'text-white');
                circle.classList.add('bg-slate-600', 'text-slate-400');
                label.classList.remove('text-white');
                label.classList.add('text-slate-400');
                indicator.classList.remove('active');
            }
        });
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');

        // Previous button
        prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';

        // Next/Submit button
        if (this.currentStep === this.totalSteps) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    }

    validateCurrentStep() {
        const currentStepEl = document.getElementById(`step${this.currentStep}`);
        const requiredFields = currentStepEl.querySelectorAll('[required]');
        let isValid = true;
        let firstInvalidField = null;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('border-red-500');
                isValid = false;
                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            } else {
                field.classList.remove('border-red-500');
            }
        });

        // Special validation for image in step 2
        if (this.currentStep === 2 && !this.selectedImage) {
            document.getElementById('dropZone').classList.add('border-red-500');
            isValid = false;
            this.showNotification('Please select an image', 'error');
        } else {
            document.getElementById('dropZone').classList.remove('border-red-500');
        }

        if (!isValid) {
            if (firstInvalidField) {
                firstInvalidField.focus();
            }
            this.showNotification('Please fill in all required fields', 'error');
        }

        return isValid;
    }

    updatePreview() {
        if (this.currentStep !== 4) return;

        const formData = this.collectFormData();

        // Update preview image
        const previewImageContainer = document.getElementById('previewImageContainer');
        if (this.selectedImage) {
            const img = document.getElementById('previewImg');
            if (img && img.src) {
                previewImageContainer.innerHTML = `<img src="${img.src}" alt="Preview" class="w-full h-full object-cover rounded-xl">`;
            }
        } else {
            previewImageContainer.innerHTML = '<span class="text-slate-400">No image selected</span>';
        }

        // Update preview text
        document.getElementById('previewTitle').textContent = formData.title || 'Untitled';
        document.getElementById('previewPrompt').textContent = formData.prompt || 'No prompt entered';

        // Update tags
        const tagsContainer = document.getElementById('previewTags');
        if (formData.tags && formData.tags.length > 0) {
            tagsContainer.innerHTML = formData.tags.map(tag => 
                `<span class="px-3 py-1 rounded-full text-sm bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">${tag}</span>`
            ).join('');
        } else {
            tagsContainer.innerHTML = '<span class="text-slate-400 text-sm">No tags</span>';
        }

        // Update details
        const detailsContainer = document.getElementById('previewDetails');
        detailsContainer.innerHTML = `
            <div><strong>Category:</strong> ${formData.category || 'None'}</div>
            <div><strong>Author:</strong> ${formData.author || 'Unknown'}</div>
            <div><strong>Model:</strong> ${formData.technicalDetails.model || 'Not specified'}</div>
            ${formData.metadata.featured ? '<div class="text-emerald-400"><strong>Featured:</strong> Yes</div>' : ''}
        `;
    }

    collectFormData() {
        const title = document.getElementById('title').value.trim();
        const author = document.getElementById('author').value.trim();
        const category = document.getElementById('category').value;
        const tagsInput = document.getElementById('tags').value.trim();
        const prompt = document.getElementById('prompt').value.trim();
        const description = document.getElementById('description').value.trim();
        const featured = document.getElementById('featured').checked;

        // Technical details
        const model = document.getElementById('model').value;
        const resolution = document.getElementById('resolution').value.trim();
        const iterations = parseInt(document.getElementById('iterations').value) || 1;
        const style = document.getElementById('style').value.trim();
        const additionalParams = document.getElementById('additionalParams').value.trim();

        // Process tags
        const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

        // Generate ID
        const id = this.generateId(title);

        // Generate image filename
        const imageExtension = this.selectedImage ? this.selectedImage.name.split('.').pop() : 'jpg';
        const imagePath = `images/${id}.${imageExtension}`;

        return {
            id: id,
            title: title,
            prompt: prompt,
            image: imagePath,
            category: category,
            tags: tags,
            dateCreated: new Date().toISOString().split('T')[0],
            author: author,
            description: description,
            technicalDetails: {
                model: model,
                resolution: resolution || "1024x1024",
                iterations: iterations,
                style: style || undefined,
                additionalParams: additionalParams || undefined
            },
            metadata: {
                featured: featured,
                likes: 0,
                views: 0,
                downloads: 0
            }
        };
    }

    generateId(title) {
        return title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .substring(0, 50) + 
            '-' + 
            Math.random().toString(36).substr(2, 6);
    }

    generateJSON() {
        if (!this.validateCurrentStep()) {
            return;
        }

        const data = this.collectFormData();
        const jsonString = JSON.stringify(data, null, 2);

        // Display JSON
        document.getElementById('jsonOutput').textContent = jsonString;

        this.showNotification('JSON generated successfully!', 'success');
    }

    copyJSON() {
        const jsonOutput = document.getElementById('jsonOutput').textContent;
        
        if (jsonOutput && jsonOutput !== '// Generated JSON will appear here') {
            navigator.clipboard.writeText(jsonOutput).then(() => {
                this.showNotification('JSON copied to clipboard!', 'success');
            }).catch(() => {
                this.showNotification('Failed to copy JSON', 'error');
            });
        } else {
            this.showNotification('No JSON to copy. Please generate first.', 'error');
        }
    }

    downloadJSON() {
        const jsonOutput = document.getElementById('jsonOutput').textContent;
        
        if (jsonOutput && jsonOutput !== '// Generated JSON will appear here') {
            const data = JSON.parse(jsonOutput);
            const blob = new Blob([jsonOutput], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `${data.id}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showNotification('JSON file downloaded!', 'success');
        } else {
            this.showNotification('No JSON to download. Please generate first.', 'error');
        }
    }

    generateImageFilename() {
        const title = document.getElementById('title').value.trim();
        
        if (!title) {
            this.showNotification('Please enter a title first', 'error');
            return;
        }

        const id = this.generateId(title);
        const extension = this.selectedImage ? this.selectedImage.name.split('.').pop() : 'jpg';
        const filename = `${id}.${extension}`;

        navigator.clipboard.writeText(filename).then(() => {
            this.showNotification(`Filename copied: ${filename}`, 'success');
        }).catch(() => {
            this.showNotification(`Suggested filename: ${filename}`, 'info');
        });
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
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }

    resetForm() {
        document.getElementById('adminForm').reset();
        this.selectedImage = null;
        this.currentStep = 1;
        this.showStep(1);
        this.updateStepIndicator();
        this.updateNavigationButtons();
        document.getElementById('imagePreview').classList.add('hidden');
        document.getElementById('jsonOutput').textContent = '// Generated JSON will appear here';
    }
}

// Global functions for HTML onclick handlers
function nextStep() {
    if (window.admin) {
        window.admin.nextStep();
    }
}

function previousStep() {
    if (window.admin) {
        window.admin.previousStep();
    }
}

function generateJSON() {
    if (window.admin) {
        window.admin.generateJSON();
    }
}

function copyJSON() {
    if (window.admin) {
        window.admin.copyJSON();
    }
}

function downloadJSON() {
    if (window.admin) {
        window.admin.downloadJSON();
    }
}

function generateImageFilename() {
    if (window.admin) {
        window.admin.generateImageFilename();
    }
}

function removeImage() {
    if (window.admin) {
        window.admin.removeImage();
    }
}

// Initialize the admin interface
document.addEventListener('DOMContentLoaded', () => {
    window.admin = new PromptographyAdmin();
});
