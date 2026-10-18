console.log("Сайт подключён к JavaScript!");

/* тема*/ 
const themeBtn = document.querySelector("#themeBtn");

function getSavedTheme() {
    try {
        return localStorage.getItem("theme");
    } catch (e) {
        return null;
    }
}

function saveTheme(theme) {
    try {
        localStorage.setItem("theme", theme);
    } catch (e) {
    }
}

if (getSavedTheme() === "dark") {
    document.body.classList.add("dark");
}

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    saveTheme(isDark ? "dark" : "light");
});

/* бургер */
const burgerBtn = document.querySelector("#burgerBtn");
const mobileNav = document.querySelector("#mobileNav");
const overlay = document.querySelector("#overlay");

function openMenu() {
    mobileNav.classList.add("open");
    burgerBtn.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden"; 
}

function closeMenu() {
    mobileNav.classList.remove("open");
    burgerBtn.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = ""; 
}

burgerBtn.addEventListener("click", () => {
    if (mobileNav.classList.contains("open")) {
        closeMenu();
    } else {
        openMenu();
    }
});

const mobileLinks = mobileNav.querySelectorAll("a");
mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
});

overlay.addEventListener("click", closeMenu);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileNav.classList.contains("open")) {
        closeMenu();
    }
});

/* корзина */
const products = [
    { id: 1, name: "Попкорн солёный (L)", price: 350 },
    { id: 2, name: "Попкорн карамельный (L)", price: 380 },
    { id: 3, name: "Кола 1 л", price: 250 },
    { id: 4, name: "Начос с соусом", price: 320 },
    { id: 5, name: "Билет на вечерний сеанс", price: 550 },
    { id: 6, name: "Билет на утренний сеанс", price: 350 },
    { id: 7, name: "Комбо: попкорн + кола", price: 550 },
    { id: 8, name: "Хот-дог", price: 280 }
];

/* загрузка корзины из localStorage */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productsGrid = document.getElementById("productsGrid");
const cartItemsEl  = document.getElementById("cartItems");
const cartTotalEl  = document.getElementById("cartTotal");
const clearCartBtn = document.getElementById("clearCartBtn");

/* сохранение и перерисовка */
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    renderProducts();
}

/* добавить товар (или увеличить qty) */
function addToCart(id) {
    const item = cart.find(p => p.id === id);
    if (item) {
        item.qty += 1;
    } else {
        const prod = products.find((p) => p.id === id);
        cart.push({ ...prod, qty: 1 });
    }
    saveCart();
}

/* изменить количество и удалить при qty = 0*/
function changeQty(id, delta) {
    const item = cart.find((p) => p.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(p => p.id !== id);
    }
    saveCart();
}

/* очистить корзину */
function clearCart() {
    cart = [];
    localStorage.removeItem("cart");
    renderCart();
    renderProducts();
}

/* отрисовка каталога */
function renderProducts() {
    let html = "";
    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        const inCart = cart.find((c) => c.id === p.id);
        let controls;
        if (inCart) {
            controls = 
                `<div class="qty-controls">
                    <button class="qty-btn" data-action="minus" data-id="${p.id}">−</button>
                    <span class="qty-value">${inCart.qty}</span>
                    <button class="qty-btn" data-action="plus" data-id="${p.id}">+</button>
                </div>`;
        } else {
            controls = `<button class="add-to-cart-btn" data-action="add" data-id="${p.id}">В корзину</button>`;
        }
        html += 
            `<div class="product-card">
                <h3 class="product-name">${p.name}</h3>
                <p class="product-price">${p.price} ₽</p>
                ${controls}
            </div>`;
    }
    productsGrid.innerHTML = html;
}

/* отрисовка корзины */
function renderCart() {
    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p class="cart-empty">Корзина пуста</p>';
        cartTotalEl.textContent = "0 ₽";
        return;
    }

    let html = "";
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        total += item.price * item.qty;
        html += 
            `<div class="cart-item">
                <div class="cart-item-info">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">${item.price} ₽ × ${item.qty} = ${item.price * item.qty} ₽</span>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" data-action="minus" data-id="${item.id}">−</button>
                    <span class="qty-value">${item.qty}</span>
                    <button class="qty-btn" data-action="plus" data-id="${item.id}">+</button>
                </div>
            </div>`;
    }
    cartItemsEl.innerHTML = html;
    cartTotalEl.textContent = total + " ₽";
}

/* клики по каталогу */
productsGrid.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    if (btn.dataset.action === "add" || btn.dataset.action === "plus") addToCart(id);
    else if (btn.dataset.action === "minus") changeQty(id, -1);
});

/* клики по корзине */
cartItemsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    if (btn.dataset.action === "plus") changeQty(id, 1);
    else if (btn.dataset.action === "minus") changeQty(id, -1);
});

/* очистка */
clearCartBtn.addEventListener("click", clearCart);

/* первичная отрисовка */
renderProducts();
renderCart();