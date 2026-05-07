// ===== PRODUCT DATA =====
const products = [
  {
    id: 1,
    name: "Argentina Jercy (Home)",
    price: 950,
    category: "apparel",
    badges: ["new"],
    image: "/images/argentina_home.jpg",
    desc: "Classic white and sky-blue stripes. Argentina Home Jersey.",
    options: { size: ["M","L","XL","XXL"] }
  },
  {
    id: 2,
    name: "Argentina Jercy (Away)",
    price: 950,
    category: "apparel",
    badges: ["new"],
    image: "/images/argentina_away.jpg",
    desc: "Dark base with artistic blue and white patterns. Argentina Away Jersey.",
    options: { size: ["M","L","XL","XXL"] }
  },
  {
    id: 3,
    name: "Portugal Jercy (Home)",
    price: 950,
    category: "apparel",
    badges: ["new"],
    image: "/images/portugal_home.jpg",
    desc: "Classic Red Portugal Home Jersey.",
    options: { size: ["M","L","XL","XXL"] }
  },
  {
    id: 4,
    name: "Portugal Jercy (Away)",
    price: 950,
    category: "apparel",
    badges: ["new"],
    image: "/images/portugal_away.jpg",
    desc: "Artistic White/Green Portugal Away Jersey.",
    options: { size: ["M","L","XL","XXL"] }
  }
];

// ===== STATE =====
let cart = [];
let activeFilter = "all";

// ===== DOM REFS =====
const grid = document.getElementById("products-grid");
const cartBtn = document.getElementById("cart-btn");
const cartBadge = document.getElementById("cart-badge");
const cartSidebar = document.getElementById("cart-sidebar");
const cartOverlay = document.getElementById("cart-overlay");
const cartClose = document.getElementById("cart-close");
const cartItemsEl = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const cartFooter = document.getElementById("cart-footer");
const cartTotalPrice = document.getElementById("cart-total-price");
const cartCount = document.getElementById("cart-count");
const modalOverlay = document.getElementById("modal-overlay");
const modalClose = document.getElementById("modal-close");
const modalImage = document.getElementById("modal-image");
const modalBadges = document.getElementById("modal-badges");
const modalCategory = document.getElementById("modal-category");
const modalProductName = document.getElementById("modal-product-name");
const modalPrice = document.getElementById("modal-price");
const modalDesc = document.getElementById("modal-desc");
const modalOptions = document.getElementById("modal-options");
const modalAddCart = document.getElementById("modal-add-cart");
const filterBtns = document.querySelectorAll(".filter-btn");

// ===== TIMESTAMP =====
function updateTimestamps() {
  const now = new Date();
  const ts = `[ ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}]`;
  const tsl = document.getElementById("hero-timestamp");
  const tsr = document.getElementById("hero-timestamp-r");
  if (tsl) tsl.textContent = ts;
  if (tsr) tsr.textContent = ts;
}
updateTimestamps();
setInterval(updateTimestamps, 1000);

// ===== RENDER PRODUCTS =====
function badgeHTML(badges) {
  return badges.map(b => {
    if (b === "new") return `<span class="badge badge--new">NEW IN</span>`;
    if (b === "bestseller") return `<span class="badge badge--bestseller">BEST-SELLER</span>`;
    if (b === "limited") return `<span class="badge badge--limited">LIMITED</span>`;
    return "";
  }).join("");
}

function renderProducts(filter = "all") {
  const filtered = filter === "all" ? products : products.filter(p =>
    filter === "bestseller" ? p.badges.includes("bestseller") :
    filter === "new" ? p.badges.includes("new") :
    p.category === filter
  );
  grid.innerHTML = "";
  filtered.forEach(p => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.setAttribute("role", "listitem");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `${p.name} — ${p.price} BDT`);
    card.dataset.id = p.id;
    card.innerHTML = `
      <div class="product-card-image-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
        <div class="product-badges">${badgeHTML(p.badges)}</div>
      </div>
      <div class="product-card-info">
        <span class="product-card-name">${p.name}</span>
        <span class="product-card-price">${p.price} BDT</span>
      </div>
      <a href="https://wa.link/63gh5d" target="_blank" class="order-btn-grid" style="
        display: block;
        margin: 0 1.1rem 1.1rem;
        padding: 0.6rem;
        background: #25D366;
        color: white;
        text-align: center;
        text-decoration: none;
        font-weight: 700;
        font-size: 0.7rem;
        border-radius: 3px;
        transition: opacity 0.2s;
      ">ORDER VIA WHATSAPP</a>
    `;
    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("product-quick-add") || e.target.classList.contains("order-btn-grid")) {
        if (e.target.classList.contains("product-quick-add")) {
          e.stopPropagation();
          addToCart(p, {});
          flashCartBtn();
        }
        return;
      }
      openModal(p);
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") openModal(p);
    });
    grid.appendChild(card);
  });
}
renderProducts();

// ===== FILTERS =====
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => { b.classList.remove("active"); b.setAttribute("aria-selected","false"); });
    btn.classList.add("active");
    btn.setAttribute("aria-selected","true");
    activeFilter = btn.dataset.filter;
    renderProducts(activeFilter);
  });
});

// ===== MODAL =====
let currentProduct = null;

function openModal(p) {
  currentProduct = p;
  modalImage.src = p.image;
  modalImage.alt = p.name;
  modalBadges.innerHTML = badgeHTML(p.badges);
  modalCategory.textContent = p.category.toUpperCase();
  modalProductName.textContent = p.name;
  modalPrice.textContent = `${p.price} BDT`;
  modalDesc.textContent = p.desc;
  modalOptions.innerHTML = "";
  if (p.options.size) {
    const label = document.createElement("label");
    label.setAttribute("for","modal-size-select");
    label.textContent = "SIZE";
    const sel = document.createElement("select");
    sel.id = "modal-size-select";
    p.options.size.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s; opt.textContent = s;
      sel.appendChild(opt);
    });
    modalOptions.appendChild(label);
    modalOptions.appendChild(sel);
  }
  modalOverlay.classList.add("open");
  modalOverlay.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalOverlay.classList.remove("open");
  modalOverlay.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
  currentProduct = null;
}

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", e => { if (e.target === modalOverlay) closeModal(); });

modalAddCart.addEventListener("click", () => {
  if (!currentProduct) return;
  const sizeEl = document.getElementById("modal-size-select");
  const opts = sizeEl ? { size: sizeEl.value } : {};
  addToCart(currentProduct, opts);
  flashCartBtn();
  closeModal();
  openCart();
});

// ===== CART =====
function addToCart(product, opts) {
  const key = product.id + (opts.size ? `-${opts.size}` : "");
  const existing = cart.find(i => i.key === key);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ key, product, opts, qty: 1 });
  }
  renderCart();
}

function removeFromCart(key) {
  cart = cart.filter(i => i.key !== key);
  renderCart();
}

function renderCart() {
  const total = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  cartBadge.textContent = count;
  cartCount.textContent = count;
  if (cart.length === 0) {
    cartEmpty.style.display = "flex";
    cartFooter.style.display = "none";
    cartItemsEl.innerHTML = "";
    cartItemsEl.appendChild(cartEmpty);
  } else {
    cartEmpty.style.display = "none";
    cartFooter.style.display = "flex";
    cartTotalPrice.textContent = `${total} BDT`;
    cartItemsEl.innerHTML = "";
    cart.forEach(item => {
      const el = document.createElement("div");
      el.className = "cart-item";
      el.innerHTML = `
        <img class="cart-item-img" src="${item.product.image}" alt="${item.product.name}" />
        <div class="cart-item-info">
          <div class="cart-item-name">${item.product.name}${item.opts.size ? ` / ${item.opts.size}` : ""}</div>
          <div class="cart-item-price">${item.product.price} BDT × ${item.qty}</div>
        </div>
        <button class="cart-item-remove" data-key="${item.key}" aria-label="Remove ${item.product.name}">✕</button>
      `;
      el.querySelector(".cart-item-remove").addEventListener("click", () => removeFromCart(item.key));
      cartItemsEl.appendChild(el);
    });
  }
}

function openCart() {
  cartSidebar.classList.add("open");
  cartOverlay.classList.add("open");
  cartSidebar.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  cartSidebar.classList.remove("open");
  cartOverlay.classList.remove("open");
  cartSidebar.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
}

cartBtn.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

function flashCartBtn() {
  cartBtn.style.background = "#c8f060";
  cartBtn.style.transform = "scale(1.18)";
  setTimeout(() => {
    cartBtn.style.background = "";
    cartBtn.style.transform = "";
  }, 350);
}

// ===== KEYBOARD ESC =====
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeModal();
    closeCart();
  }
});

// ===== NAV SCROLL EFFECT =====
const nav = document.getElementById("main-nav");
window.addEventListener("scroll", () => {
  if (window.scrollY > 60) {
    nav.style.borderBottomColor = "var(--border)";
  } else {
    nav.style.borderBottomColor = "var(--border)";
  }
}, { passive: true });

// ===== DARK MODE TOGGLE =====
const darkToggle = document.getElementById("dark-toggle");
const darkIcon = document.getElementById("dark-icon");
const darkLabel = document.getElementById("dark-label");
let isDark = localStorage.getItem("prokit-dark") === "true";

function applyDark(on) {
  document.body.classList.toggle("dark", on);
  darkIcon.textContent = on ? "☀" : "☾";
  darkLabel.textContent = on ? "LIGHT" : "DARK";
  localStorage.setItem("prokit-dark", on);
}

applyDark(isDark);

darkToggle.addEventListener("click", () => {
  isDark = !isDark;
  applyDark(isDark);
});
