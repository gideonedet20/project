// Product Data
const products = [
  { id: 1, name: "Nike Running Shoe", price: 65, img: "image/nike.jpg" },
  { id: 2, name: "Wireless Headphones", price: 45, img: "image/headphone.jpg" },
  { id: 3, name: "Smart Watch Pro", price: 95, img: "image/watch.jpg" },
  { id: 4, name: "Leather Backpack", price: 35, img: "image/backpack.jpg" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Render Products
function renderProducts() {
  const container = document.getElementById("product-list");
  container.innerHTML = "";

  products.forEach((product, index) => {
    container.innerHTML += `
      <div class="card">
        <img src="${product.img}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <button onclick="addToCart(${index})">Add to Cart</button>
      </div>
    `;
  });
}

// Add to Cart with Quantity
function addToCart(index) {
  const product = products[index];
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  
  // Nice feedback
  showNotification(`${product.name} added to cart!`);
}

// Change Quantity
function changeQuantity(index, change) {
  cart[index].quantity += change;
  
  if (cart[index].quantity < 1) {
    cart[index].quantity = 1;
  }
  
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// Remove from Cart
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  displayCart();
}

// Display Cart
function displayCart() {
  const container = document.getElementById("cart-items");
  container.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = `<p style="text-align:center; color:#666; padding:40px 0;">Your cart is empty</p>`;
    document.getElementById("total").innerText = "Total: $0";
    return;
  }

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    container.innerHTML += `
      <div class="cart-item">
        <h4>${item.name}</h4>
        <p>$${item.price} × ${item.quantity}</p>
        
        <div class="quantity-control">
          <button onclick="changeQuantity(${index}, -1)">–</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity(${index}, 1)">+</button>
          <button onclick="removeFromCart(${index})" style="margin-left:auto; background:#ef4444; color:white;">Remove</button>
        </div>
        
        <p style="font-weight:bold; margin-top:8px;">Subtotal: $${itemTotal}</p>
      </div>
    `;
  });

  document.getElementById("total").innerText = `Total: $${total}`;
}

// Toggle Cart
function toggleCart() {
  const cartSidebar = document.getElementById("cart");
  cartSidebar.classList.toggle("open");
  
  if (cartSidebar.classList.contains("open")) {
    displayCart();
  }
}

// Update Cart Count in Navbar
function updateCartCount() {
  const count = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  document.getElementById("cart-count").innerText = count;
}

// Simple Notification
function showNotification(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
    background: #22c55e; color: white; padding: 15px 25px; border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2); z-index: 2000; font-weight: 500;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.transition = "opacity 0.5s";
    notification.style.opacity = "0";
    setTimeout(() => notification.remove(), 500);
  }, 2500);
}

// Checkout
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  
  alert("🎉 Order placed successfully! Thank you for shopping at GideonStore.");
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  toggleCart();
}

// Initialize
renderProducts();
updateCartCount();