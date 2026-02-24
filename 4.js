const products = [
{ id: 1, name: "BANGINAPALLI", price: 100,img: "images/1.banginapalli.jpg" },
  { id: 2, name: "CHERUKU RASALU", price:100,img: "images/cheruku_rasalu.jpeg" },
  { id: 3, name: "CHINNA RASALU", price: 60, img: "images/chinna_rasalu.jpeg" },
  { id: 4, name: "SUVARNAREKHA", price: 60, img: "images/suvarnarekha.jpeg" }
];

let cart = [];
const DELIVERY_CHARGE = 150;

const productList = document.getElementById("product-list");
const cartItems = document.getElementById("cart-items");
const totalSpan = document.getElementById("total");
const cartCount = document.getElementById("cart-count");
const orderNowBtn = document.getElementById("orderNowBtn");
const checkoutSection = document.getElementById("checkout");
const placeOrderBtn = document.getElementById("placeOrderBtn");

/* LOAD PRODUCTS */
products.forEach(p => {
  const div = document.createElement("div");
  div.className = "product";
  div.innerHTML = `
    <img src="${p.img}">
    <h3>${p.name}</h3>
    <p class="price">₹${p.price} <span>/ kg</span></p>
    <p class="info">📍 Andhra Pradesh</p>
    <p class="info">🌿 Naturally Ripened</p>
    <button onclick="addToCart(${p.id})">Add 1 kg to Cart</button>
  `;
  productList.appendChild(div);
});

/* CART FUNCTIONS */
function addToCart(id) {
  const item = cart.find(i => i.id === id);

  if (item) {
    item.qty++;
  } else {
    const product = products.find(p => p.id === id);
    if (!product) return;
    cart.push({ ...product, qty: 1 });
  }

  updateCart();
}

function increase(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.qty++;
  updateCart();
}

function decrease(id) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty--;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  updateCart();
}

function updateCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>🛒 Your cart is empty.</p>";
    totalSpan.textContent = 0;
    cartCount.textContent = 0;
    return;
  }

  let subtotal = 0;
  let count = 0;

  cart.forEach(item => {
    subtotal += item.price * item.qty;
    count += item.qty;

    cartItems.innerHTML += `
      <div class="cart-item">
        <span>${item.name}</span>
        <div>
          <button onclick="decrease(${item.id})">−</button>
          ${item.qty}
          <button onclick="increase(${item.id})">+</button>
        </div>
      </div>
    `;
  });

  const grandTotal = subtotal + DELIVERY_CHARGE;

  totalSpan.textContent = grandTotal;
  cartCount.textContent = count;
}

/* ORDER NOW BUTTON */
orderNowBtn.onclick = () => {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }
  checkoutSection.classList.remove("hidden");
  window.scrollTo(0, document.body.scrollHeight);
};

/* PLACE ORDER */
placeOrderBtn.onclick = () => {

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const payment = document.getElementById("payment").value;

  if (!name || !phone || !address) {
    alert("Please fill all details");
    return;
  }

  if (!/^[6-9]\d{9}$/.test(phone)) {
    alert("Enter valid 10-digit Indian mobile number");
    return;
  }

  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const grandTotal = subtotal + DELIVERY_CHARGE;
  const orderId = "NF" + Date.now();

  let message = `🥭 *New Mango Order - Nandi Farms* 🥭\n\n`;
  message += `Order ID: ${orderId}\n`;
  message += `Name: ${name}\n`;
  message += `Phone: ${phone}\n`;
  message += `Address: ${address}\n`;
  message += `Payment: ${payment}\n\n`;
  message += `--- Order Details ---\n`;

  cart.forEach(item => {
    message += `${item.name} - ${item.qty} kg - ₹${item.price * item.qty}\n`;
  });

  message += `\nSubtotal: ₹${subtotal}`;
  message += `\nDelivery Charges: ₹${DELIVERY_CHARGE}`;
  message += `\nGrand Total: ₹${grandTotal}`;
  message += `\n\nThank you for choosing Nandi Farms 🥭`;

  const phoneNumber = "918688539490";
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");

  cart = [];
  updateCart();
  checkoutSection.classList.add("hidden");
};