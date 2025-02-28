class MenuManager {
    constructor() {
        this.menuData = [];
        this.init();
        this.initializeCategoryNav();
    }

    async init() {
        this.showLoading();
        await this.fetchMenuData();
        this.renderMenu();
        this.setupAutoRefresh();
        this.hideLoading();
        this.updateLastUpdatedTime();
    }

    showLoading() {
        document.getElementById('loading-overlay').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loading-overlay').classList.add('hidden');
    }

    updateLastUpdatedTime() {
        const timeElement = document.getElementById('last-updated-time');
        const now = new Date();
        timeElement.textContent = now.toLocaleString();
    }

    initializeCategoryNav() {
        const categoryList = document.getElementById('category-list');
        categoryList.innerHTML = CONFIG.CATEGORIES.map(category => 
            `<li data-category="${category}">${category}</li>`
        ).join('');

        categoryList.addEventListener('click', (e) => {
            if (e.target.tagName === 'LI') {
                const category = e.target.dataset.category;
                this.scrollToCategory(category);
                
                // Update active state
                categoryList.querySelectorAll('li').forEach(li => 
                    li.classList.remove('active'));
                e.target.classList.add('active');
            }
        });
    }

    scrollToCategory(category) {
        const categorySection = document.querySelector(
            `.menu-category h2[data-category="${category}"]`
        );
        if (categorySection) {
            categorySection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    async fetchMenuData() {
        try {
            const response = await fetch(CONFIG.WEBAPP_URL);
            const data = await response.json();
            this.menuData = data.items;
        } catch (error) {
            console.error('Error fetching menu data:', error);
            this.showError('Failed to load menu data. Please try again later.');
        }
    }

    renderMenu() {
        const menuContainer = document.getElementById('menu-container');
        menuContainer.innerHTML = '';

        CONFIG.CATEGORIES.forEach(category => {
            const categoryItems = this.menuData.filter(item => 
                item.category.toLowerCase() === category.toLowerCase()
            );
            
            if (categoryItems.length > 0) {
                const categorySection = this.createCategorySection(category, categoryItems);
                menuContainer.appendChild(categorySection);
            }
        });
    }

    createCategorySection(category, items) {
        const section = document.createElement('section');
        section.className = 'menu-category';
        
        const heading = document.createElement('h2');
        heading.textContent = category;
        heading.dataset.category = category;
        section.appendChild(heading);

        const itemsGrid = document.createElement('div');
        itemsGrid.className = 'menu-items-grid';

        items.forEach(item => {
            const itemCard = this.createItemCard(item);
            itemsGrid.appendChild(itemCard);
        });

        section.appendChild(itemsGrid);
        return section;
    }

    createItemCard(item) {
        const card = document.createElement('div');
        card.className = 'menu-item-card';
        
        card.innerHTML = `
            <div class="item-image">
                <img src="${item.imageUrl || 'assets/placeholder.svg'}" 
                     alt="${item.name}" 
                     onerror="this.src='assets/placeholder.svg'">
            </div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="description">${item.description}</p>
                <p class="price">$${item.price}</p>
            </div>
        `;

        return card;
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    setupAutoRefresh() {
        setInterval(async () => {
            await this.fetchMenuData();
            this.renderMenu();
            this.updateLastUpdatedTime();
        }, CONFIG.UPDATE_INTERVAL);
    }
}

// Initialize menu when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MenuManager();
}); 