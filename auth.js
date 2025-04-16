// auth.js - Shared across all pages
function checkLoginState() {
    const user = JSON.parse(localStorage.getItem('quantixgearUser'));
    const loginLink = document.querySelector('a[href="login.html"]');
    const cartLink = document.querySelector('a[href="cart.html"]');
    const cartCount = document.querySelector('.cart-count');
    
    // Update cart count
    const cart = JSON.parse(localStorage.getItem('quantixgearCart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'flex' : 'none';
    }
    
    // Update auth links
    if (user) {
        if (loginLink) {
            loginLink.innerHTML = '<i class="fas fa-user"></i> <span>My Account</span>';
            loginLink.href = 'account.html';
        }
    } else {
        // Protect cart page
        if (window.location.pathname.includes('cart.html')) {
            window.location.href = 'login.html?redirect=cart.html';
        }
    }
    
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            e.preventDefault();
            
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
                checkLoginState(); // Update cart count
                alert(`${product.title} added to cart!`);
            }
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', checkLoginState);