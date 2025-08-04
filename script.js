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
    
    // Global ESC key handler for popups
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const popup = document.getElementById('food-detail-popup');
            if (popup && popup.classList.contains('active')) {
                console.log('ESC pressed - closing popup');
                popup.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
    
    // Setup close button handler once on page load
    setTimeout(() => {
        const closeBtn = document.getElementById('close-btn');
        if (closeBtn) {
            console.log('Setting up close button handler');
            
            // Add multiple event types to test
            closeBtn.addEventListener('click', function(e) {
                console.log('Close button CLICK detected');
                e.preventDefault();
                e.stopPropagation();
                
                const popup = document.getElementById('food-detail-popup');
                if (popup) {
                    popup.classList.remove('active');
                    document.body.style.overflow = '';
                    console.log('Popup closed via close button');
                }
            });
            
            closeBtn.addEventListener('mousedown', function(e) {
                console.log('Close button MOUSEDOWN detected');
            });
            
            closeBtn.addEventListener('touchstart', function(e) {
                console.log('Close button TOUCHSTART detected');
                e.preventDefault();
                const popup = document.getElementById('food-detail-popup');
                if (popup) {
                    popup.classList.remove('active');
                    document.body.style.overflow = '';
                    console.log('Popup closed via touch');
                }
            });
            
        } else {
            console.log('Close button not found');
        }
        
        // Setup background click handler
        const popup = document.getElementById('food-detail-popup');
        if (popup) {
            console.log('Setting up background click handler');
            popup.addEventListener('click', function(e) {
                if (e.target === popup) {
                    console.log('Background clicked (global handler)');
                    popup.classList.remove('active');
                    document.body.style.overflow = '';
                    console.log('Popup closed via background click');
                }
            });
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
    setupScrollAnimation();
}

function renderRestaurants(restaurants, containerId) {
    const container = document.getElementById(containerId);
    
    container.innerHTML = restaurants.map((restaurant, index) => `
        <div class="restaurant-card" onclick="openRestaurantDetails(${restaurant.id}, this)" data-restaurant-id="${restaurant.id}" data-index="${index}">
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
    
    // Add event delegation as backup
    setupRestaurantClickHandlers(containerId);
    
    // Setup animation for restaurant cards after render
    if (containerId === 'suggestions-list') {
        setupScrollAnimation();
    }
}

// Collections
function openCollectionView(collectionId) {
    console.log('Opening collection view for:', collectionId);
    
    // Check if data is loaded
    if (!window.appData || !window.appData.restaurants) {
        console.error('App data not loaded yet!');
        setTimeout(() => openCollectionView(collectionId), 100);
        return;
    }
    
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
    
    // Debug: Check available restaurants and collections
    console.log('App data check:', {
        hasAppData: !!window.appData,
        hasRestaurants: !!(window.appData && window.appData.restaurants),
        restaurantCount: window.appData?.restaurants?.length || 0,
        collectionId: collectionId
    });
    
    if (window.appData && window.appData.restaurants) {
        console.log('All restaurants:', window.appData.restaurants.length);
        console.log('Available collections:', [...new Set(window.appData.restaurants.map(r => r.collection))]);
        
        // Filter restaurants
        const filtered = window.appData.restaurants.filter(r => r.collection === collectionId);
        console.log('Filtered restaurants for', collectionId, ':', filtered.length);
        console.log('Filtered restaurant names:', filtered.map(r => r.name));
        
        const container = document.getElementById('collection-restaurants');
        if (!container) {
            console.error('Collection restaurants container not found!');
            return;
        }
        
        if (filtered.length === 0) {
            console.warn('No restaurants found for collection:', collectionId);
            container.innerHTML = '<div class="no-restaurants">Không có quán nào trong khu vực này</div>';
        } else {
            console.log('Rendering', filtered.length, 'restaurants');
            renderRestaurants(filtered, 'collection-restaurants');
        }
    }
    
    // Show view
    console.log('Adding active class to collection view');
    collectionView.classList.add('active');
    
    // Prevent body scrolling when collection view is open
    document.body.style.overflow = 'hidden';
    
    // Setup scroll isolation for collection view
    setupCollectionScrollIsolation(collectionView);
    
    // Force style recalculation and ensure visibility
    setTimeout(() => {
        console.log('Collection view classes:', collectionView.className);
        console.log('Collection view display:', window.getComputedStyle(collectionView).display);
        console.log('Collection view transform:', window.getComputedStyle(collectionView).transform);
        console.log('Collection view opacity:', window.getComputedStyle(collectionView).opacity);
    }, 100);
}

function closeCollectionView() {
    const collectionView = document.getElementById('collection-view');
    collectionView.classList.remove('active');
    
    // Restore body scrolling
    document.body.style.overflow = '';
    
    currentCollection = null;
}

// Restaurant details
function openRestaurantDetails(restaurantId, clickedElement = null) {
    const restaurant = window.appData.restaurants.find(r => r.id === restaurantId);
    if (!restaurant) return;
    
    currentRestaurant = restaurant;
    const detailsView = document.getElementById('restaurant-details');
    
    // Find the clicked restaurant image for animation
    let animatingImage = null;
    if (clickedElement) {
        const restaurantCard = clickedElement.closest('.restaurant-card');
        if (restaurantCard) {
            animatingImage = restaurantCard.querySelector('.restaurant-image');
        }
    }
    
    // Create the detail view content
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
                    ${restaurant.menu.map((item, index) => `
                        <div class="menu-item" onclick="animateMenuItem(this, ${index})">
                            <div class="menu-item-visual">
                                <img src="${restaurant.image}" alt="${item.name}" class="menu-default-img" onerror="this.src='https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'">
                                <div class="menu-plate">
                                    <div class="menu-food">
                                        <img src="${restaurant.image}" alt="${item.name}" onerror="this.src='https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'">
                                    </div>
                                </div>
                            </div>
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
    
    // Setup scroll event isolation
    setupDetailViewScrollHandling(detailsView);
    
    if (animatingImage) {
        animateRestaurantThumbnail(animatingImage, detailsView);
    } else {
        detailsView.classList.add('active');
    }
}

function animateRestaurantThumbnail(originalImage, detailsView) {
    // Get original image position and size
    const rect = originalImage.getBoundingClientRect();
    const restaurantCard = originalImage.closest('.restaurant-card');
    
    // Create a clone of the image for animation
    const clonedImage = originalImage.cloneNode(true);
    clonedImage.classList.add('animating');
    
    // Set initial position and size precisely
    clonedImage.style.position = 'fixed';
    clonedImage.style.left = rect.left + 'px';
    clonedImage.style.top = rect.top + 'px';
    clonedImage.style.width = rect.width + 'px';
    clonedImage.style.height = rect.height + 'px';
    clonedImage.style.zIndex = '2000';
    clonedImage.style.objectFit = 'cover';
    clonedImage.style.margin = '0';
    clonedImage.style.padding = '0';
    clonedImage.style.borderRadius = '8px';
    
    // Add to body
    document.body.appendChild(clonedImage);
    
    // Hide original image and animate the card
    originalImage.style.transition = 'opacity 0.3s ease';
    originalImage.style.opacity = '0';
    if (restaurantCard) {
        restaurantCard.classList.add('animating');
    }
    
    // Show detail view with special animation class
    detailsView.classList.add('appearing');
    
    // Prevent body scroll when detail view is open
    document.body.style.overflow = 'hidden';
    
    // Animate the cloned image
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            clonedImage.classList.add('animating-to-detail');
            
            // Start showing detail view content while thumbnail is moving
            setTimeout(() => {
                detailsView.classList.add('active');
            }, 480); // Show detail view at 40% of animation (480ms of 1200ms)
            
            // When thumbnail reaches destination - trigger fill-in effect
            setTimeout(() => {
                detailsView.classList.add('filled');
                
                // Start fading out cloned image after fill-in triggers
                setTimeout(() => {
                    clonedImage.style.transition = 'opacity 0.5s ease';
                    clonedImage.style.opacity = '0';
                }, 120);
            }, 1080); // When thumbnail reaches banner area (90% of 1200ms)
            
            // Clean up after animation completes
            setTimeout(() => {
                try {
                    if (document.body.contains(clonedImage)) {
                        document.body.removeChild(clonedImage);
                    }
                } catch (e) {
                    console.log('Cloned image already removed');
                }
                
                // Reset original elements
                originalImage.style.opacity = '';
                originalImage.style.transition = '';
                if (restaurantCard) {
                    restaurantCard.classList.remove('animating');
                }
                
                // Remove appearing class after everything settles
                detailsView.classList.remove('appearing');
                
            }, 1700); // Extended cleanup time for refined animation
        });
    });
}

function closeRestaurantDetails() {
    const detailsView = document.getElementById('restaurant-details');
    detailsView.classList.remove('active');
    detailsView.classList.remove('appearing');
    detailsView.classList.remove('filled');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
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
        <div class="restaurant-card" onclick="openRestaurantDetails(${restaurant.id}, this)" data-restaurant-id="${restaurant.id}">
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
    
    // Add event delegation for discover card too
    card.addEventListener('click', handleRestaurantClick);
    
    card.classList.add('active');
}

// Event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Clean event delegation for collection items - use more specific selector
    document.addEventListener('click', (e) => {
        const collectionItem = e.target.closest('.collection-item');
        if (collectionItem && collectionItem.dataset.collection) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Collection clicked:', collectionItem.dataset.collection);
            openCollectionView(collectionItem.dataset.collection);
            return false;
        }
    });
    
    // Additional direct listeners for collection items as backup
    setTimeout(() => {
        const collectionItems = document.querySelectorAll('.collection-item');
        console.log('Setting up direct listeners for', collectionItems.length, 'collection items');
        
        collectionItems.forEach((item, index) => {
            console.log(`Collection item ${index}:`, item.dataset.collection);
            
            item.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Direct click on collection:', this.dataset.collection);
                openCollectionView(this.dataset.collection);
                return false;
            });
            
            // Make sure element is clickable
            item.style.cursor = 'pointer';
            item.style.userSelect = 'none';
        });
    }, 100);
    
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

// Setup scroll animation for restaurant cards
function setupScrollAnimation() {
    // Remove any existing observer
    if (window.restaurantObserver) {
        window.restaurantObserver.disconnect();
    }
    
    // Create intersection observer
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px', // Trigger when 100px before element enters viewport
        threshold: 0.1
    };
    
    window.restaurantObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const index = Array.from(card.parentNode.children).indexOf(card);
                
                // Add staggered delay based on index
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, index * 150); // 150ms delay between each card
                
                // Stop observing this card after animation
                window.restaurantObserver.unobserve(card);
            }
        });
    }, observerOptions);
    
    // Observe all restaurant cards in suggestions list
    const restaurantCards = document.querySelectorAll('#suggestions-list .restaurant-card');
    restaurantCards.forEach(card => {
        window.restaurantObserver.observe(card);
    });
}

// Setup restaurant click handlers with event delegation
function setupRestaurantClickHandlers(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Remove existing event listener if any
    container.removeEventListener('click', handleRestaurantClick);
    
    // Add event delegation
    container.addEventListener('click', handleRestaurantClick);
}

function handleRestaurantClick(event) {
    const restaurantCard = event.target.closest('.restaurant-card');
    if (!restaurantCard) return;
    
    const restaurantId = parseInt(restaurantCard.dataset.restaurantId);
    
    if (restaurantId && !isNaN(restaurantId)) {
        openRestaurantDetails(restaurantId, restaurantCard);
    }
}

// Setup scroll event handling for detail view
function setupDetailViewScrollHandling(detailsView) {
    // Prevent scroll events from bubbling to parent elements
    detailsView.addEventListener('scroll', (e) => {
        e.stopPropagation();
    }, { passive: true });
    
    // Prevent touch events from affecting background
    detailsView.addEventListener('touchstart', (e) => {
        e.stopPropagation();
    }, { passive: true });
    
    detailsView.addEventListener('touchmove', (e) => {
        e.stopPropagation();
    }, { passive: true });
    
    detailsView.addEventListener('touchend', (e) => {
        e.stopPropagation();
    }, { passive: true });
    
    // Handle wheel events for desktop
    detailsView.addEventListener('wheel', (e) => {
        e.stopPropagation();
    }, { passive: true });
}

// Setup scroll isolation for collection view
function setupCollectionScrollIsolation(collectionView) {
    // Prevent scroll events from bubbling to parent elements
    collectionView.addEventListener('scroll', (e) => {
        e.stopPropagation();
    }, { passive: true });
    
    // Prevent touch events from affecting background
    collectionView.addEventListener('touchstart', (e) => {
        e.stopPropagation();
    }, { passive: true });
    
    collectionView.addEventListener('touchmove', (e) => {
        e.stopPropagation();
    }, { passive: true });
    
    collectionView.addEventListener('touchend', (e) => {
        e.stopPropagation();
    }, { passive: true });
    
    // Handle wheel events for desktop
    collectionView.addEventListener('wheel', (e) => {
        e.stopPropagation();
        
        // Only scroll within the collection view boundaries
        const atTop = collectionView.scrollTop === 0;
        const atBottom = collectionView.scrollHeight - collectionView.scrollTop === collectionView.clientHeight;
        
        if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Food detail popup state
let currentFoodIndex = 0;
let currentQuantity = 1;
let touchStartX = 0;
let touchEndX = 0;

// Menu item animation and open food detail
function animateMenuItem(element, index) {
    // Don't animate if already animating
    if (element.classList.contains('animating')) return;
    
    // Open food detail popup
    openFoodDetail(index);
}

// Open food detail popup
function openFoodDetail(index) {
    if (!currentRestaurant || !currentRestaurant.menu[index]) return;
    
    currentFoodIndex = index;
    currentQuantity = 1;
    
    const popup = document.getElementById('food-detail-popup');
    const foodItem = currentRestaurant.menu[index];
    
    // Update content
    document.getElementById('current-food-image').src = currentRestaurant.image;
    document.getElementById('food-name').textContent = foodItem.name;
    document.getElementById('food-description').textContent = foodItem.description || 'Món ăn ngon được chế biến từ nguyên liệu tươi ngon, đảm bảo vệ sinh an toàn thực phẩm.';
    document.getElementById('food-price').textContent = foodItem.price;
    document.getElementById('food-quantity').textContent = currentQuantity;
    
    // Show popup
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Setup swipe handlers
    setupSwipeHandlers();
}

// Close food detail popup
function closeFoodDetail() {
    console.log('Closing food detail popup');
    const popup = document.getElementById('food-detail-popup');
    if (popup) {
        popup.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clean up event handlers
        removeSwipeHandlers();
        console.log('Food detail popup closed');
    } else {
        console.error('Food detail popup not found');
    }
}

// Navigate between food items
function navigateFood(direction) {
    console.log('NavigateFood called with direction:', direction);
    console.log('Current restaurant:', currentRestaurant);
    console.log('Current food index:', currentFoodIndex);
    
    if (!currentRestaurant || !currentRestaurant.menu) {
        console.log('No restaurant or menu available');
        return;
    }
    
    const menuLength = currentRestaurant.menu.length;
    const oldIndex = currentFoodIndex;
    currentFoodIndex = (currentFoodIndex + direction + menuLength) % menuLength;
    
    console.log('Menu length:', menuLength, 'Old index:', oldIndex, 'New index:', currentFoodIndex);
    
    const foodItem = currentRestaurant.menu[currentFoodIndex];
    console.log('New food item:', foodItem);
    
    // Animate plate rotation when changing food
    const plate = document.querySelector('.spinning-plate');
    if (plate) {
        plate.style.animation = 'quickSpin 0.8s ease-out';
        // Clear animation after it completes
        setTimeout(() => {
            plate.style.animation = '';
        }, 800);
    }
    
    // Update content with fade effect
    const foodImage = document.getElementById('current-food-image');
    const foodName = document.getElementById('food-name');
    const foodDesc = document.getElementById('food-description');
    const foodPrice = document.getElementById('food-price');
    
    if (!foodImage || !foodName || !foodDesc || !foodPrice) {
        console.error('Food detail elements not found');
        return;
    }
    
    // Fade out
    foodImage.style.opacity = '0';
    foodName.style.opacity = '0';
    foodDesc.style.opacity = '0';
    foodPrice.style.opacity = '0';
    
    setTimeout(() => {
        // Update content
        foodImage.src = currentRestaurant.image;
        foodName.textContent = foodItem.name;
        foodDesc.textContent = foodItem.description || 'Món ăn ngon được chế biến từ nguyên liệu tươi ngon, đảm bảo vệ sinh an toàn thực phẩm.';
        foodPrice.textContent = foodItem.price;
        
        // Fade in
        foodImage.style.opacity = '1';
        foodName.style.opacity = '1';
        foodDesc.style.opacity = '1';
        foodPrice.style.opacity = '1';
        
        console.log('Food content updated successfully');
    }, 300);
    
    // Reset quantity
    currentQuantity = 1;
    const quantityElement = document.getElementById('food-quantity');
    if (quantityElement) {
        quantityElement.textContent = currentQuantity;
    }
}

// Update quantity
function updateQuantity(change) {
    currentQuantity = Math.max(1, currentQuantity + change);
    document.getElementById('food-quantity').textContent = currentQuantity;
}

// Setup swipe handlers
function setupSwipeHandlers() {
    const foodBanner = document.querySelector('.food-banner');
    
    if (!foodBanner) {
        console.error('Food banner not found for swipe setup');
        return;
    }
    
    // Remove existing listeners to prevent duplicates
    removeSwipeHandlers();
    
    console.log('Setting up swipe handlers on:', foodBanner);
    
    // Simple touch detection
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    let isTouch = false;
    
    // Touch events
    const onTouchStart = (e) => {
        isTouch = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        endX = startX;
        endY = startY;
        
        foodBanner.classList.add('touching');
        console.log('Touch start at:', startX, startY);
    };
    
    const onTouchMove = (e) => {
        if (!isTouch) return;
        endX = e.touches[0].clientX;
        endY = e.touches[0].clientY;
        
        // Prevent scrolling if horizontal movement is significant
        const deltaX = Math.abs(endX - startX);
        const deltaY = Math.abs(endY - startY);
        
        if (deltaX > deltaY && deltaX > 10) {
            e.preventDefault();
        }
    };
    
    const onTouchEnd = (e) => {
        if (!isTouch) return;
        isTouch = false;
        
        foodBanner.classList.remove('touching');
        
        const deltaX = startX - endX;
        const deltaY = Math.abs(startY - endY);
        
        console.log('Touch end - deltaX:', deltaX, 'deltaY:', deltaY);
        
        // Check if it's a horizontal swipe
        if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {
            if (deltaX > 0) {
                console.log('Swipe left detected - going to next');
                navigateFood(1);
            } else {
                console.log('Swipe right detected - going to previous');
                navigateFood(-1);
            }
        }
        
        // Reset
        startX = 0;
        startY = 0;
        endX = 0;
        endY = 0;
    };
    
    // Mouse events for desktop
    let mouseDown = false;
    
    const onMouseDown = (e) => {
        mouseDown = true;
        startX = e.clientX;
        startY = e.clientY;
        endX = startX;
        endY = startY;
        
        foodBanner.classList.add('touching');
        console.log('Mouse down at:', startX, startY);
        e.preventDefault();
    };
    
    const onMouseMove = (e) => {
        if (!mouseDown) return;
        endX = e.clientX;
        endY = e.clientY;
    };
    
    const onMouseUp = (e) => {
        if (!mouseDown) return;
        mouseDown = false;
        
        foodBanner.classList.remove('touching');
        
        const deltaX = startX - endX;
        const deltaY = Math.abs(startY - endY);
        
        console.log('Mouse up - deltaX:', deltaX, 'deltaY:', deltaY);
        
        // Check if it's a horizontal drag
        if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {
            if (deltaX > 0) {
                console.log('Drag left detected - going to next');
                navigateFood(1);
            } else {
                console.log('Drag right detected - going to previous');
                navigateFood(-1);
            }
        }
        
        // Reset
        startX = 0;
        startY = 0;
        endX = 0;
        endY = 0;
    };
    
    const onMouseLeave = () => {
        if (mouseDown) {
            foodBanner.classList.remove('touching');
        }
        mouseDown = false;
        startX = 0;
        startY = 0;
        endX = 0;
        endY = 0;
    };
    
    // Add event listeners
    foodBanner.addEventListener('touchstart', onTouchStart, { passive: false });
    foodBanner.addEventListener('touchmove', onTouchMove, { passive: false });
    foodBanner.addEventListener('touchend', onTouchEnd, { passive: false });
    
    foodBanner.addEventListener('mousedown', onMouseDown);
    foodBanner.addEventListener('mousemove', onMouseMove);
    foodBanner.addEventListener('mouseup', onMouseUp);
    foodBanner.addEventListener('mouseleave', onMouseLeave);
    
    // Store handlers for cleanup
    foodBanner._swipeHandlers = {
        touchstart: onTouchStart,
        touchmove: onTouchMove,
        touchend: onTouchEnd,
        mousedown: onMouseDown,
        mousemove: onMouseMove,
        mouseup: onMouseUp,
        mouseleave: onMouseLeave
    };
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyNavigation);
    
    // Add simple click test for debugging
    foodBanner.addEventListener('click', (e) => {
        console.log('Banner clicked at:', e.clientX, e.clientY);
        // Test navigation on click
        if (e.clientX < window.innerWidth / 2) {
            console.log('Left side clicked - going previous');
            navigateFood(-1);
        } else {
            console.log('Right side clicked - going next');
            navigateFood(1);
        }
    });
    
    console.log('Swipe handlers setup complete');
}

function removeSwipeHandlers() {
    const foodBanner = document.querySelector('.food-banner');
    if (!foodBanner) return;
    
    console.log('Removing swipe handlers');
    
    if (foodBanner._swipeHandlers) {
        foodBanner.removeEventListener('touchstart', foodBanner._swipeHandlers.touchstart);
        foodBanner.removeEventListener('touchmove', foodBanner._swipeHandlers.touchmove);
        foodBanner.removeEventListener('touchend', foodBanner._swipeHandlers.touchend);
        foodBanner.removeEventListener('mousedown', foodBanner._swipeHandlers.mousedown);
        foodBanner.removeEventListener('mousemove', foodBanner._swipeHandlers.mousemove);
        foodBanner.removeEventListener('mouseup', foodBanner._swipeHandlers.mouseup);
        foodBanner.removeEventListener('mouseleave', foodBanner._swipeHandlers.mouseleave);
        
        delete foodBanner._swipeHandlers;
    }
    
    document.removeEventListener('keydown', handleKeyNavigation);
}


function handleKeyNavigation(e) {
    const popup = document.getElementById('food-detail-popup');
    if (!popup.classList.contains('active')) return;
    
    if (e.key === 'ArrowLeft') {
        navigateFood(-1);
        e.preventDefault();
    } else if (e.key === 'ArrowRight') {
        navigateFood(1);
        e.preventDefault();
    } else if (e.key === 'Escape') {
        closeFoodDetail();
        e.preventDefault();
    }
}


// Make functions globally accessible
window.openCollectionView = openCollectionView;
window.closeCollectionView = closeCollectionView;
window.openRestaurantDetails = openRestaurantDetails;
window.closeRestaurantDetails = closeRestaurantDetails;
window.animateMenuItem = animateMenuItem;
window.navigateFood = navigateFood;
window.updateQuantity = updateQuantity;

// Simple background close function
window.closePopupBackground = function(event) {
    if (event.target.id === 'food-detail-popup') {
        console.log('Background clicked - closing popup');
        const popup = document.getElementById('food-detail-popup');
        if (popup) {
            popup.classList.remove('active');
            document.body.style.overflow = '';
            console.log('Popup closed via background click');
        }
    }
};

// Ensure closeFoodDetail is accessible
window.closeFoodDetail = function() {
    console.log('Window.closeFoodDetail called');
    const popup = document.getElementById('food-detail-popup');
    console.log('Popup element:', popup);
    console.log('Popup has active class:', popup?.classList.contains('active'));
    
    if (popup) {
        popup.classList.remove('active');
        document.body.style.overflow = '';
        console.log('Popup active class removed');
        
        // Clean up event handlers
        removeSwipeHandlers();
        console.log('Swipe handlers removed');
    } else {
        console.error('Food detail popup element not found');
    }
};