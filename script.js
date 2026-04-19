document.addEventListener('DOMContentLoaded', () => {
    // Cart logic with persistence
    let cart = JSON.parse(localStorage.getItem('neo-merch-cart')) || [];
    
    function updateCartUI() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElements.forEach(el => {
            el.textContent = totalItems;
            el.classList.add('bump');
            setTimeout(() => el.classList.remove('bump'), 300);
        });
    }

    updateCartUI();

    const addToCartBtns = document.querySelectorAll('.add-to-cart');

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productCard = btn.closest('.product-card');
            const name = productCard.querySelector('h3').textContent;
            const price = parseFloat(productCard.querySelector('.price').textContent.replace('$', '').replace(',', ''));
            const img = productCard.querySelector('img').src;
            
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name, price, img, quantity: 1 });
            }

            localStorage.setItem('neo-merch-cart', JSON.stringify(cart));
            updateCartUI();
            
            // Success feedback
            const originalText = btn.textContent;
            btn.textContent = 'ADDED!';
            btn.classList.add('btn-success');
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.classList.remove('btn-success');
            }, 2000);
        });
    });

    // Cart Rendering (for cart.html)
    function renderCart() {
        const cartItemsContainer = document.querySelector('.cart-items');
        if (!cartItemsContainer) return;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-msg">
                    <p>Your neural link to the cart is empty.</p>
                    <a href="index.html#products" class="btn btn-secondary">Go Shopping</a>
                </div>
            `;
            updateSummary();
            return;
        }

        cartItemsContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item" data-index="${index}">
                <img src="${item.img}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p class="price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="quantity-controls">
                    <button class="qty-btn minus">-</button>
                    <span class="qty-val">${item.quantity}</span>
                    <button class="qty-btn plus">+</button>
                </div>
                <button class="remove-btn">REMOVE</button>
            </div>
        `).join('');

        // Event listeners for quantity and remove
        cartItemsContainer.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = btn.closest('.cart-item').dataset.index;
                if (btn.classList.contains('plus')) {
                    cart[index].quantity++;
                } else if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                }
                saveAndRefresh();
            });
        });

        cartItemsContainer.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = btn.closest('.cart-item').dataset.index;
                cart.splice(index, 1);
                saveAndRefresh();
            });
        });

        updateSummary();
    }

    function updateSummary() {
        const subtotalEl = document.getElementById('subtotal');
        const totalEl = document.getElementById('total');
        if (!subtotalEl || !totalEl) return;

        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.1; // 10% future tax
        const total = subtotal + tax;

        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        totalEl.textContent = `$${total.toFixed(2)}`;
    }

    function saveAndRefresh() {
        localStorage.setItem('neo-merch-cart', JSON.stringify(cart));
        updateCartUI();
        renderCart();
    }

    renderCart();

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });

    // Custom CSS for JS animations
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        .bump {
            transform: scale(1.2);
            transition: transform 0.1s;
        }
    `;
    document.head.appendChild(style);

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.background = 'rgba(5, 5, 16, 0.95)';
            header.style.padding = '0.5rem 0';
        } else {
            header.style.background = 'rgba(5, 5, 16, 0.8)';
            header.style.padding = '1rem 0';
        }
    });
});
