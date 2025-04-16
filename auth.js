// auth.js - Shared across all pages
function updateAuthUI() {
    const user = JSON.parse(localStorage.getItem('quantixgearUser'));
    const userActions = document.getElementById('userActions');
    const cart = JSON.parse(localStorage.getItem('quantixgearCart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (user) {
        // User is logged in - show profile and cart
        userActions.innerHTML = `
            <div class="user-profile">
                <div class="profile-dropdown">
                    <button class="profile-btn">
                        <i class="fas fa-user-circle"></i>
                        <span>${user.firstName}</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="dropdown-content">
                        <a href="account.html"><i class="fas fa-user"></i> My Account</a>
                        <a href="orders.html"><i class="fas fa-box"></i> My Orders</a>
                        <a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                    </div>
                </div>
            </div>
            <a href="cart.html" class="cart-link">
                <i class="fas fa-shopping-cart"></i>
                <span>Cart</span>
                ${cartCount > 0 ? `<span class="cart-count">${cartCount}</span>` : ''}
            </a>
        `;
        
        // Add logout handler
        document.getElementById('logoutBtn')?.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('quantixgearUser');
            window.location.href = 'index.html';
        });
    } else {
        // User is not logged in - show login/register and cart
        userActions.innerHTML = `
            <a href="login.html" class="login-link">
                <i class="fas fa-user"></i>
                <span>Login</span>
            </a>
            <a href="register.html" class="register-link">
                <i class="fas fa-user-plus"></i>
                <span>Register</span>
            </a>
            <a href="cart.html" class="cart-link">
                <i class="fas fa-shopping-cart"></i>
                <span>Cart</span>
                ${cartCount > 0 ? `<span class="cart-count">${cartCount}</span>` : ''}
            </a>
        `;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateAuthUI();
    
    // Protect cart and checkout pages
    const user = JSON.parse(localStorage.getItem('quantixgearUser'));
    if ((window.location.pathname.includes('cart.html')) || 
        (window.location.pathname.includes('checkout.html'))) {
        if (!user) {
            const currentPage = window.location.pathname.split('/').pop();
            window.location.href = `login.html?redirect=${currentPage}`;
        }
    }
});

// Add to cart functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
        e.preventDefault();
        
        const user = JSON.parse(localStorage.getItem('quantixgearUser'));
        if (!user) {
            const currentPage = window.location.pathname.split('/').pop();
            window.location.href = `login.html?redirect=${currentPage}`;
            return;
        }
        
        const productId = e.target.getAttribute('data-id');
        const products = JSON.parse(localStorage.getItem('quantixgearProducts')) || [];
        const product = products.find(p => p.id === productId);
        
        if (product) {
            let cart = JSON.parse(localStorage.getItem('quantixgearCart')) || [];
            const existingIndex = cart.findIndex(item => item.id === productId);
            
            if (existingIndex >= 0) {
                cart[existingIndex].quantity++;
            } else {
                cart.push({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }
            
            localStorage.setItem('quantixgearCart', JSON.stringify(cart));
            updateAuthUI();
            alert(`${product.title} added to cart!`);
        }
    }
});