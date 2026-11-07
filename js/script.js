const products = [
  {
    id: 1,
    name: "Classic Leather Tote",
    category: "Bags",
    price: 89,
    image: "assets/images/products/product-1.webp",
  },
  {
    id: 2,
    name: "City Backpack",
    category: "Bags",
    price: 64,
    image: "assets/images/products/product-2.webp",
  },
  {
    id: 3,
    name: "Canvas Crossbody Bag",
    category: "Bags",
    price: 42,
    image: "assets/images/products/product-3.webp",
  },
  {
    id: 4,
    name: "Weekend Travel Bag",
    category: "Bags",
    price: 115,
    image: "assets/images/products/product-4.webp",
  },
  {
    id: 5,
    name: "Minimal Steel Watch",
    category: "Watches",
    price: 120,
    image: "assets/images/products/product-5.webp",
  },
  {
    id: 6,
    name: "Sport Digital Watch",
    category: "Watches",
    price: 59,
    image: "assets/images/products/product-6.webp",
  },
  {
    id: 7,
    name: "Leather Strap Watch",
    category: "Watches",
    price: 85,
    image: "assets/images/products/product-7.webp",
  },
  {
    id: 8,
    name: "White Everyday Sneakers",
    category: "Shoes",
    price: 72,
    image: "assets/images/products/product-8.webp",
  },
  {
    id: 9,
    name: "Light Summer Sandals",
    category: "Shoes",
    price: 35,
    image: "assets/images/products/product-9.webp",
  },
  {
    id: 10,
    name: "Running Trainers",
    category: "Shoes",
    price: 98,
    image: "assets/images/products/product-10.webp",
  },
  {
    id: 11,
    name: "Suede Loafers",
    category: "Shoes",
    price: 110,
    image: "assets/images/products/product-11.webp",
  },
  {
    id: 12,
    name: "Round Sunglasses",
    category: "Accessories",
    price: 38,
    image: "assets/images/products/product-12.webp",
  },
  {
    id: 13,
    name: "Everyday Cap",
    category: "Accessories",
    price: 24,
    image: "assets/images/products/product-13.webp",
  },
  {
    id: 14,
    name: "Slim Leather Wallet",
    category: "Accessories",
    price: 35,
    image: "assets/images/products/product-14.webp",
  },
  {
    id: 15,
    name: "Soft Knit Scarf",
    category: "Accessories",
    price: 28,
    image: "assets/images/products/product-15.webp",
  },
  {
    id: 16,
    name: "Straw Sun Hat",
    category: "Accessories",
    price: 29,
    image: "assets/images/products/product-16.webp",
  },
];

const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const priceFilter = document.getElementById("price-filter");
const categoriesBox = document.getElementById("category-list");
const resultCount = document.getElementById("result-count");
const noResults = document.getElementById("no-results");
const clearButton = document.getElementById("clear-filters");

const cartButton = document.getElementById("cart-button");
const closeCartButton = document.getElementById("close-cart");
const cartPanel = document.getElementById("cart");
const overlay = document.getElementById("overlay");
const cartItemsList = document.getElementById("cart-items");
const emptyCart = document.getElementById("empty-cart");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");

let selectedCategory = "All";

let cart = [];

function formatPrice(price) {
  return "$" + price.toFixed(2);
}

function saveCart() {
  localStorage.setItem("lumiCart", JSON.stringify(cart));
}

function loadCart() {
  const savedCart = localStorage.getItem("lumiCart");
  if (savedCart !== null) {
    cart = JSON.parse(savedCart);
  }
}

function matchesPrice(price, range) {
  if (range === "under50") return price < 50;
  if (range === "50to100") return price >= 50 && price <= 100;
  if (range === "over100") return price > 100;
  return true;
}

function getFilteredProducts() {
  const searchText = searchInput.value.trim().toLowerCase();
  const priceRange = document.querySelector(
    'input[name="price"]:checked',
  ).value;

  return products.filter(function (product) {
    const matchesSearch = product.name.toLowerCase().includes(searchText);
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return (
      matchesSearch &&
      matchesCategory &&
      matchesPrice(product.price, priceRange)
    );
  });
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();

  productGrid.innerHTML = "";

  for (let i = 0; i < filteredProducts.length; i++) {
    const product = filteredProducts[i];

    productGrid.innerHTML +=
      '<article class="product-card">' +
      '<div class="product-image">' +
      '<img src="' +
      product.image +
      '" alt="' +
      product.name +
      '" loading="lazy">' +
      '<button type="button" class="add-button" data-id="' +
      product.id +
      '">Add to Cart</button>' +
      "</div>" +
      '<div class="product-info">' +
      '<span class="product-category">' +
      product.category +
      "</span>" +
      '<div class="product-row">' +
      '<h3 class="product-name">' +
      product.name +
      "</h3>" +
      '<p class="product-price">' +
      formatPrice(product.price) +
      "</p>" +
      "</div>" +
      "</div>" +
      "</article>";
  }

  if (filteredProducts.length === 0) {
    noResults.classList.remove("hidden");
    resultCount.textContent = "";
  } else {
    noResults.classList.add("hidden");
    resultCount.textContent =
      "Showing " +
      filteredProducts.length +
      " of " +
      products.length +
      " products";
  }
}

function addToCart(productId) {
  const cartItem = cart.find(function (item) {
    return item.id === productId;
  });

  if (cartItem) {
    cartItem.quantity++;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart();
  renderCart();
  bumpCartCount();
}

function changeQuantity(productId, change) {
  const cartItem = cart.find(function (item) {
    return item.id === productId;
  });

  cartItem.quantity += change;

  if (cartItem.quantity < 1) {
    removeFromCart(productId);
    return;
  }

  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(function (item) {
    return item.id !== productId;
  });

  saveCart();
  renderCart();
}

function renderCart() {
  cartItemsList.innerHTML = "";

  for (let i = 0; i < cart.length; i++) {
    const cartItem = cart[i];
    const product = products.find(function (p) {
      return p.id === cartItem.id;
    });

    cartItemsList.innerHTML +=
      '<li class="cart-item">' +
      '<img src="' +
      product.image +
      '" alt="' +
      product.name +
      '">' +
      "<div>" +
      '<p class="cart-item-name">' +
      product.name +
      "</p>" +
      '<p class="cart-item-price">' +
      formatPrice(product.price) +
      " each</p>" +
      '<div class="cart-item-row">' +
      '<div class="quantity">' +
      '<button type="button" data-action="decrease" data-id="' +
      product.id +
      '" aria-label="Decrease quantity">&minus;</button>' +
      "<span>" +
      cartItem.quantity +
      "</span>" +
      '<button type="button" data-action="increase" data-id="' +
      product.id +
      '" aria-label="Increase quantity">+</button>' +
      "</div>" +
      '<span class="line-total">' +
      formatPrice(product.price * cartItem.quantity) +
      "</span>" +
      "</div>" +
      '<button type="button" class="remove-button" data-action="remove" data-id="' +
      product.id +
      '">Remove</button>' +
      "</div>" +
      "</li>";
  }

  if (cart.length === 0) {
    emptyCart.classList.add("show");
  } else {
    emptyCart.classList.remove("show");
  }

  updateCartSummary();
}

function updateCartSummary() {
  const totalItems = cart.reduce(function (sum, item) {
    return sum + item.quantity;
  }, 0);

  const totalPrice = cart.reduce(function (sum, item) {
    const product = products.find(function (p) {
      return p.id === item.id;
    });
    return sum + product.price * item.quantity;
  }, 0);

  cartCount.textContent = totalItems;
  cartTotal.textContent = formatPrice(totalPrice);
}

function bumpCartCount() {
  cartCount.classList.remove("bump");
  void cartCount.offsetWidth;
  cartCount.classList.add("bump");
}

function openCart() {
  cartPanel.classList.add("open");
  overlay.classList.add("open");
  document.body.classList.add("cart-open");
}

function closeCart() {
  cartPanel.classList.remove("open");
  overlay.classList.remove("open");
  document.body.classList.remove("cart-open");
}

searchInput.addEventListener("input", renderProducts);
priceFilter.addEventListener("change", renderProducts);

function setActiveCategory(category) {
  selectedCategory = category;

  const chips = categoriesBox.querySelectorAll(".chip");
  for (let i = 0; i < chips.length; i++) {
    if (chips[i].dataset.category === category) {
      chips[i].classList.add("active");
    } else {
      chips[i].classList.remove("active");
    }
  }
}

categoriesBox.addEventListener("click", function (event) {
  const chip = event.target.closest(".chip");
  if (!chip) return;

  setActiveCategory(chip.dataset.category);
  renderProducts();
});

clearButton.addEventListener("click", function () {
  searchInput.value = "";
  document.querySelector('input[name="price"][value="all"]').checked = true;
  setActiveCategory("All");
  renderProducts();
});

productGrid.addEventListener("click", function (event) {
  const button = event.target.closest(".add-button");
  if (button) {
    addToCart(Number(button.dataset.id));
  }
});

cartItemsList.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;

  const productId = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "increase") changeQuantity(productId, 1);
  if (action === "decrease") changeQuantity(productId, -1);
  if (action === "remove") removeFromCart(productId);
});

cartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") closeCart();
});

loadCart();
renderProducts();
renderCart();
