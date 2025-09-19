let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add to cart
function addToCart(item, price) {
  const existing = cart.find(c => c.item === item);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ item, price, qty: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert(item + " added to cart!");
}

// Load cart page
function loadCart() {
  const cartList = document.getElementById("cartList");
  const totalPrice = document.getElementById("totalPrice");

  if (!cartList) return;

  cartList.innerHTML = "";
  let total = 0;

  cart.forEach((c, index) => {
    total += c.price * c.qty;
    let li = document.createElement("li");
    li.innerHTML = `
      ${c.item} - $${c.price.toFixed(2)} x 
      <input type="number" value="${c.qty}" min="1" onchange="updateQty(${index}, this.value)">
      <button onclick="removeItem(${index})">Remove</button>
    `;
    cartList.appendChild(li);
  });

  totalPrice.innerText = "Total: $" + total.toFixed(2);
}

// Update quantity
function updateQty(index, qty) {
  cart[index].qty = parseInt(qty);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
  updateCartCount();
}

// Remove item
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
  updateCartCount();
}

// Payment
function processPayment(event) {
  event.preventDefault();
  localStorage.setItem("order", JSON.stringify(cart));
  cart = [];
  localStorage.removeItem("cart");
  updateCartCount();
  window.location.href = "confirmation.html";
}

// Confirmation
function loadConfirmation() {
  const order = JSON.parse(localStorage.getItem("order")) || [];
  const summary = document.getElementById("orderSummary");
  if (!summary) return;

  let text = "You ordered:<br>";
  order.forEach(c => {
    text += `${c.item} x ${c.qty}<br>`;
  });
  summary.innerHTML = text + "<br>Thank you for your purchase!";
}

// Floating cart button update
function updateCartCount() {
  const btn = document.getElementById("goToCartBtn");
  if (!btn) return;
  let count = cart.reduce((sum, c) => sum + c.qty, 0);
  btn.innerText = `🛒 Go to Cart (${count})`;
}

// Contact form validation
function validateForm() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  if (!name || !email || !message) {
    alert("All fields are required!");
    return false;
  }
  alert("Message sent successfully!");
  return true;
}

// Auto-load where needed
window.onload = function() {
  loadCart();
  loadConfirmation();
  updateCartCount();
};
