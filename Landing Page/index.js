document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.createElement('div');
    mobileMenuOverlay.classList.add('mobile-menu-overlay');
    document.body.appendChild(mobileMenuOverlay);
    
    hamburgerMenu.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
    
    mobileMenuOverlay.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
    
    // Scroll to Top Button
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Product Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productsGrid = document.querySelector('.products-grid');
    
    // Sample product data
    const products = [
        {
            id: 1,
            title: 'Wireless Bluetooth Headphones',
            category: 'electronics',
            price: 89.99,
            oldPrice: 129.99,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
            rating: 4.5,
            reviews: 124,
            badge: 'Sale'
        },
        
        {
            id: 3,
            title: 'Smart Watch Pro',
            category: 'electronics',
            price: 199.99,
            oldPrice: 249.99,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2599&q=80',
            rating: 4.8,
            reviews: 215,
            badge: 'Bestseller'
        },
        {
            id: 4,
            title: 'Cotton T-Shirt',
            category: 'fashion',
            price: 24.99,
            oldPrice: 34.99,
            image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2264&q=80',
            rating: 4.0,
            reviews: 56,
            badge: 'New'
        },
        {
            id: 5,
            title: 'Ceramic Coffee Mug',
            category: 'home',
            price: 14.99,
            oldPrice: 19.99,
            image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2338&q=80',
            rating: 4.7,
            reviews: 178,
            badge: 'Sale'
        },
        {
            id: 6,
            title: 'Wireless Charger',
            category: 'electronics',
            price: 29.99,
            oldPrice: 39.99,
            image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2348&q=80',
            rating: 4.3,
            reviews: 92,
            badge: null
        },
        {
            id: 7,
            title: 'Linen Throw Pillow',
            category: 'home',
            price: 34.99,
            oldPrice: 44.99,
            image: 'https://images.unsplash.com/photo-1579656592043-a20e25a4aa4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2274&q=80',
            rating: 4.1,
            reviews: 47,
            badge: null
        },
        {
            id: 8,
            title: 'Running Shoes',
            category: 'fashion',
            price: 79.99,
            oldPrice: 99.99,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
            rating: 4.6,
            reviews: 203,
            badge: 'Hot'
        }
    ];
    
    // Render products
    function renderProducts(filter = 'all') {
        productsGrid.innerHTML = '';
        
        const filteredProducts = filter === 'all' 
            ? products 
            : products.filter(product => product.category === filter);
        
        filteredProducts.forEach(product => {
            const stars = Array(Math.floor(product.rating)).fill('<i class="fas fa-star"></i>').join('');
            const halfStar = product.rating % 1 >= 0.5 ? '<i class="fas fa-star-half-alt"></i>' : '';
            const emptyStars = Array(5 - Math.ceil(product.rating)).fill('<i class="far fa-star"></i>').join('');
            
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.category = product.category;
            productCard.innerHTML = `
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}">
                    <div class="product-actions">
                        <button class="product-action-btn"><i class="far fa-heart"></i></button>
                        <button class="product-action-btn"><i class="fas fa-eye"></i></button>
                        <button class="product-action-btn"><i class="fas fa-share-alt"></i></button>
                    </div>
                </div>
                <div class="product-info">
                    <p class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <div class="product-rating">
                        <div class="stars">${stars}${halfStar}${emptyStars}</div>
                        <span class="reviews">(${product.reviews})</span>
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            
            productsGrid.appendChild(productCard);
        });
        
        // Add to cart functionality
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.id;
                const product = products.find(p => p.id == productId);
                
                // In a real app, you would add to cart here
                const cartCount = document.querySelector('.cart-count');
                let count = parseInt(cartCount.textContent);
                cartCount.textContent = count + 1;
                
                // Show added to cart notification
                const notification = document.createElement('div');
                notification.className = 'notification slide-up';
                notification.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <span>Added "${product.title}" to cart</span>
                `;
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.classList.add('fade-out');
                    setTimeout(() => notification.remove(), 300);
                }, 3000);
            });
        });
    }
    
    // Initial render
    renderProducts();
    
    // Filter products
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            renderProducts(this.dataset.category);
        });
    });
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input');
        const email = emailInput.value;
        
        // In a real app, you would send this to your backend
        console.log('Subscribed email:', email);
        
        // Show success message
        const notification = document.createElement('div');
        notification.className = 'notification slide-up';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Thanks for subscribing!</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
      
        emailInput.value = '';
    });
    
    // Chat button functionality
    const chatBtn = document.querySelector('.chat-btn');
    chatBtn.addEventListener('click', function() {
        // In a real app, this would open a chat widget
        alert('Chat support will open here. In a real application, this would connect to a live chat service.');
    });
    
    // Add animations on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.feature-card, .product-card, .testimonial-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('slide-up');
            }
        });
    }
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); 
});