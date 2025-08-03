// Main JavaScript file

// State management
let currentTab = 'home';
let currentCollection = null;
let currentRestaurant = null;
let homeMap = null;
let discoverMap = null;
let userLocation = { lat: 10.7769, lng: 106.7009 };

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    initializeTabs();
    initializeCategories();
    initializeBannerSlider();
    loadRestaurants();
    loadOCOPProducts();
    loadPromotions();
    initializeMaps();
    setupEventListeners();
    
    // Add global click listener to debug
    document.addEventListener('click', (e) => {
        console.log('Global click detected on:', e.target);
        console.log('Target classes:', e.target.className);
        console.log('Closest collection-item:', e.target.closest('.collection-item'));
    });
    
    // Test collection items after a delay
    setTimeout(() => {
        console.log('Testing collection items after delay...');
        const items = document.querySelectorAll('.collection-item');
        console.log('Collection items found:', items.length);
        items.forEach((item, i) => {
            console.log(`Item ${i}:`, item.dataset.collection, item.offsetWidth, 'x', item.offsetHeight);
            
            // Test if element is actually clickable
            const rect = item.getBoundingClientRect();
            const elementAtPoint = document.elementFromPoint(rect.left + rect.width/2, rect.top + rect.height/2);
            console.log(`Element at center of item ${i}:`, elementAtPoint);
            console.log(`Is same element?`, elementAtPoint === item || item.contains(elementAtPoint));
        });
        
        // Force add click listener directly to first item as test
        const firstItem = items[0];
        if (firstItem) {
            console.log('Adding direct click listener to first item as test');
            firstItem.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('DIRECT ONCLICK TRIGGERED!');
                openCollectionView('phuong-cho-quan');
            };
        }
    }, 1000);
});

// Tab navigation
function initializeTabs() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tab = item.dataset.tab;
            switchTab(tab);
        });
    });
}

function switchTab(tab) {
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.tab === tab);
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.getElementById(`${tab}-tab`).classList.add('active');
    currentTab = tab;
    
    // Show/hide header based on tab
    const header = document.querySelector('.header');
    if (tab === 'home') {
        header.style.display = 'block';
    } else {
        header.style.display = 'none';
    }
    
    // Special handling for discover tab
    if (tab === 'discover' && discoverMap) {
        setTimeout(() => {
            discoverMap.invalidateSize();
        }, 300);
    }
}

// Categories
function initializeCategories() {
    const categories = document.querySelectorAll('.category-item');
    
    categories.forEach(category => {
        category.addEventListener('click', () => {
            categories.forEach(c => c.classList.remove('active'));
            category.classList.add('active');
            
            // Filter restaurants by category
            const categoryName = category.querySelector('span').textContent;
            filterRestaurantsByCategory(categoryName);
        });
    });
}

function filterRestaurantsByCategory(category) {
    const filtered = category === 'Gọi ý' 
        ? window.appData.restaurants 
        : window.appData.restaurants.filter(r => r.category === category);
    
    renderRestaurants(filtered, 'suggestions-list');
}

// Banner slider
function initializeBannerSlider() {
    const container = document.querySelector('.banner-container');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    
    // Auto slide
    setInterval(() => {
        currentSlide = (currentSlide + 1) % dots.length;
        updateSlider();
    }, 5000);
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });
    
    function updateSlider() {
        container.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
}

// Load restaurants
function loadRestaurants() {
    renderRestaurants(window.appData.restaurants, 'suggestions-list');
}

function renderRestaurants(restaurants, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = restaurants.map(restaurant => `
        <div class="restaurant-card" onclick="openRestaurantDetails(${restaurant.id})">
            <img src="${restaurant.image}" alt="${restaurant.name}" class="restaurant-image" onerror="this.src='https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop'">
            <div class="restaurant-info">
                <div class="restaurant-name">${restaurant.name}</div>
                <div class="restaurant-description">${restaurant.description}</div>
                <div class="restaurant-meta">
                    <span>${restaurant.distance} • </span>
                    <span class="rating">★ ${restaurant.rating}</span>
                    ${restaurant.discount ? `<span class="discount">Giảm ${restaurant.discount}%</span>` : ''}
                    ${restaurant.freeship ? '<span class="freeship">Freeship</span>' : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Collections
function openCollectionView(collectionId) {
    console.log('Opening collection view for:', collectionId);
    const collectionView = document.getElementById('collection-view');
    const collectionTitle = document.getElementById('collection-title');
    
    if (!collectionView) {
        console.error('Collection view element not found!');
        return;
    }
    
    if (!collectionTitle) {
        console.error('Collection title element not found!');
        return;
    }
    
    // Update title
    const titles = {
        'phuong-cho-quan': 'Phường Chợ Quán',
        'phuong-cau-lanh-ong': 'Phường Cầu Lãnh Ông',
        'phuong-nhieu-loc': 'Phường Nhiều Lộc',
        'phuong-khanh-hoi-4': 'Phường Khánh Hội 4'
    };
    
    collectionTitle.textContent = titles[collectionId] || 'Bộ sưu tập';
    currentCollection = collectionId;
    
    // Filter restaurants
    const filtered = window.appData.restaurants.filter(r => r.collection === collectionId);
    console.log('Filtered restaurants:', filtered.length);
    renderRestaurants(filtered, 'collection-restaurants');
    
    // Show view
    console.log('Adding active class to collection view');
    collectionView.classList.add('active');
    
    // Force style recalculation
    setTimeout(() => {
        console.log('Collection view classes:', collectionView.className);
        console.log('Collection view style:', window.getComputedStyle(collectionView).transform);
    }, 100);
}

function closeCollectionView() {
    document.getElementById('collection-view').classList.remove('active');
    currentCollection = null;
}

// Restaurant details
function openRestaurantDetails(restaurantId) {
    const restaurant = window.appData.restaurants.find(r => r.id === restaurantId);
    if (!restaurant) return;
    
    currentRestaurant = restaurant;
    const detailsView = document.getElementById('restaurant-details');
    
    detailsView.innerHTML = `
        <div class="restaurant-hero">
            <img src="${restaurant.image}" alt="${restaurant.name}" onerror="this.src='https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop'">
            <button class="back-btn" onclick="closeRestaurantDetails()">←</button>
        </div>
        <div class="restaurant-detail-info">
            <h1>${restaurant.name}</h1>
            <p class="restaurant-subtitle">${restaurant.description}</p>
            <div class="restaurant-stats">
                <span>⏱ 6h - 21h</span>
                <span>📍 ${restaurant.distance}</span>
                <span>⭐ ${restaurant.rating} (999+)</span>
            </div>
            <div class="menu-section">
                <h2>Món nổi bật</h2>
                <div class="menu-grid">
                    ${restaurant.menu.map(item => `
                        <div class="menu-item">
                            <img src="${restaurant.image}" alt="${item.name}" onerror="this.src='https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'">
                            <div class="menu-item-info">
                                <div class="menu-item-name">${item.name}</div>
                                <div class="menu-item-price">${item.price}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        <button class="order-btn">Đặt món ngay</button>
    `;
    
    detailsView.classList.add('active');
}

function closeRestaurantDetails() {
    document.getElementById('restaurant-details').classList.remove('active');
    currentRestaurant = null;
}

// OCOP Products
function loadOCOPProducts() {
    const container = document.getElementById('ocop-products');
    
    container.innerHTML = window.appData.ocopProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
            </div>
        </div>
    `).join('');
}

// Promotions
function loadPromotions() {
    // MB Bank promotions
    const mbContainer = document.getElementById('mb-promotions');
    mbContainer.innerHTML = window.appData.promotions.mb.map(promo => `
        <div class="promotion-card">
            <div class="promotion-header-content">
                <img src="${promo.image}" alt="${promo.title}" class="promotion-image">
                <div class="promotion-content">
                    <div class="promotion-title">${promo.title}</div>
                    <div class="promotion-description">${promo.description}</div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Vietcoco promotions
    const vietcocoContainer = document.getElementById('vietcoco-promotions');
    vietcocoContainer.innerHTML = window.appData.promotions.vietcoco.map(promo => `
        <div class="promotion-card">
            <div class="promotion-header-content">
                <img src="${promo.image}" alt="${promo.title}" class="promotion-image">
                <div class="promotion-content">
                    <div class="promotion-title">${promo.title}</div>
                    <div class="promotion-description">${promo.description}</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Maps
function initializeMaps() {
    // Home tab mini map
    if (document.getElementById('home-map')) {
        homeMap = L.map('home-map', {
            center: [userLocation.lat, userLocation.lng],
            zoom: 15,
            zoomControl: false
        });
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(homeMap);
        
        // User location marker
        L.marker([userLocation.lat, userLocation.lng], {
            icon: L.divIcon({
                className: 'user-marker',
                html: '<div style="background-color: #ff4d4f; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
                iconSize: [26, 26],
                iconAnchor: [13, 13]
            })
        }).addTo(homeMap);
    }
    
    // Discover tab map
    if (document.getElementById('discover-map')) {
        discoverMap = L.map('discover-map', {
            center: [userLocation.lat, userLocation.lng],
            zoom: 14,
            zoomControl: false
        });
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(discoverMap);
        
        // User location
        L.marker([userLocation.lat, userLocation.lng], {
            icon: L.divIcon({
                className: 'user-marker',
                html: '<div style="background-color: #ff4d4f; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
                iconSize: [26, 26],
                iconAnchor: [13, 13]
            })
        }).addTo(discoverMap);
        
        // Add restaurant markers
        window.appData.restaurants.forEach(restaurant => {
            const marker = L.marker([restaurant.location.lat, restaurant.location.lng], {
                icon: L.divIcon({
                    className: 'restaurant-marker',
                    html: '<div style="background-color: #ff4d4f; width: 40px; height: 40px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 20px;">🍽️</div>',
                    iconSize: [46, 46],
                    iconAnchor: [23, 23]
                })
            }).addTo(discoverMap);
            
            marker.on('click', () => {
                showDiscoverCard(restaurant);
            });
        });
    }
}

function showDiscoverCard(restaurant) {
    const card = document.querySelector('.discover-card');
    
    card.innerHTML = `
        <div class="restaurant-card" onclick="openRestaurantDetails(${restaurant.id})">
            <img src="${restaurant.image}" alt="${restaurant.name}" class="restaurant-image">
            <div class="restaurant-info">
                <div class="restaurant-name">${restaurant.name}</div>
                <div class="restaurant-description">${restaurant.description}</div>
                <div class="restaurant-meta">
                    <span>${restaurant.distance} • </span>
                    <span class="rating">★ ${restaurant.rating}</span>
                    ${restaurant.discount ? `<span class="discount">Giảm ${restaurant.discount}%</span>` : ''}
                    ${restaurant.freeship ? '<span class="freeship">Freeship</span>' : ''}
                </div>
            </div>
        </div>
    `;
    
    card.classList.add('active');
}

// Event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    // Collection items
    const collectionItems = document.querySelectorAll('.collection-item');
    console.log('Found collection items:', collectionItems.length);
    
    collectionItems.forEach((item, index) => {
        console.log(`Collection item ${index}:`, item.dataset.collection);
        
        // Simple click without preventDefault/stopPropagation first
        item.addEventListener('click', (e) => {
            console.log('COLLECTION CLICK EVENT FIRED!', item.dataset.collection);
            const collection = item.dataset.collection;
            if (collection) {
                openCollectionView(collection);
            }
        });
        
        // Add multiple test events
        item.addEventListener('mousedown', () => {
            console.log('Mouse down on collection item', index);
        });
        
        item.addEventListener('mouseup', () => {
            console.log('Mouse up on collection item', index);
        });
        
        item.addEventListener('pointerdown', () => {
            console.log('Pointer down on collection item', index);
        });
    });
    
    // Alternative: Event delegation for collection items
    document.body.addEventListener('click', (e) => {
        const collectionItem = e.target.closest('.collection-item');
        if (collectionItem) {
            console.log('Event delegation - Collection clicked via body listener');
            const collection = collectionItem.dataset.collection;
            console.log('Collection from delegation:', collection);
            if (collection) {
                openCollectionView(collection);
            }
        }
    });
    
    // Back buttons
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
    
    // Locate button in discover tab
    const locateBtn = document.querySelector('.locate-btn');
    if (locateBtn) {
        locateBtn.addEventListener('click', () => {
            if (discoverMap) {
                discoverMap.setView([userLocation.lat, userLocation.lng], 16);
            }
        });
    }
    
    // Filter buttons in collection view
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Apply filter logic here
            const filterType = btn.textContent;
            let filtered = window.appData.restaurants.filter(r => r.collection === currentCollection);
            
            if (filterType === 'Khuyến mãi') {
                filtered = filtered.filter(r => r.discount > 0);
            } else if (filterType === 'Đánh giá') {
                filtered.sort((a, b) => b.rating - a.rating);
            }
            
            renderRestaurants(filtered, 'collection-restaurants');
        });
    });
    
    // Smooth scrolling for all scrollable elements
    document.querySelectorAll('.categories, .restaurant-list, .product-list').forEach(element => {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        element.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - element.offsetLeft;
            scrollLeft = element.scrollLeft;
        });
        
        element.addEventListener('mouseleave', () => {
            isDown = false;
        });
        
        element.addEventListener('mouseup', () => {
            isDown = false;
        });
        
        element.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - element.offsetLeft;
            const walk = (x - startX) * 2;
            element.scrollLeft = scrollLeft - walk;
        });
    });
}

// Make functions globally accessible
window.openCollectionView = openCollectionView;
window.closeCollectionView = closeCollectionView;
window.openRestaurantDetails = openRestaurantDetails;
window.closeRestaurantDetails = closeRestaurantDetails;