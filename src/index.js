// Get all elements
const createor = document.getElementById("create");
const container = document.getElementById("container");
const description = document.getElementById("description");
const title = document.getElementById("name");
const price = document.getElementById("price");
const image = document.getElementById("image");
const form = document.querySelector("#itemForm");
const fileBtn = document.getElementById("fileBtn");
const imagePreview = document.getElementById("imagePreview");
const previewCard = document.getElementById("previewCard");

// Product storage
let products = JSON.parse(localStorage.getItem("products")) || [];
let nextId =
  products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

// Initialize products on load
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateLivePreview();
});

// Form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();
  createProduct();
});

// File input trigger
fileBtn.addEventListener("click", () => {
  image.click();
});

// Image preview functionality
image.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.innerHTML = `
        <img src="${e.target.result}" alt="Preview" class="image-preview shadow-lg border-4 border-indigo-200 rounded-2xl w-full h-48 object-cover">
      `;
    };
    reader.readAsDataURL(file);
  }
});

// Live preview updates
title.addEventListener("input", updateLivePreview);
price.addEventListener("input", updateLivePreview);
description.addEventListener("input", updateLivePreview);

function updateLivePreview() {
  const previewTitle = previewCard.querySelector(".preview-title");
  const previewPrice = previewCard.querySelector(".preview-price");
  const previewDesc = previewCard.querySelector(".preview-desc");

  if (previewTitle) previewTitle.textContent = title.value || "Product Name";
  if (previewPrice) previewPrice.textContent = `$${price.value || "0.00"}`;
  if (previewDesc)
    previewDesc.textContent = description.value || "Product description...";

  previewCard.classList.toggle(
    "opacity-50",
    !title.value && !price.value && !description.value,
  );
}

// Initialize live preview
previewCard.innerHTML = `
  <div class="flex flex-col items-center justify-center space-y-4 p-8">
    <div class="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
      <i class="fas fa-box text-2xl text-white"></i>
    </div>
    <div>
      <h4 class="preview-title text-2xl font-bold text-gray-400 mb-1">Product Name</h4>
      <p class="preview-price text-3xl font-bold text-indigo-600 mb-2">$0.00</p>
      <p class="preview-desc text-gray-500 max-w-xs leading-relaxed">Product description...</p>
    </div>
  </div>
`;

// 🆕 ADVANCED PRODUCT FUNCTIONS
function createProduct() {
  // Validation
  if (
    !title.value.trim() ||
    !price.value ||
    !image.files[0] ||
    !description.value.trim()
  ) {
    showNotification("Please fill all fields including image!", "error");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const product = {
      id: nextId++,
      name: title.value.trim(),
      price: parseFloat(price.value).toFixed(2),
      desc: description.value.trim(),
      img: e.target.result, // Base64 image data
    };

    products.unshift(product); // Add to beginning for newest first
    saveProducts();
    renderProducts();
    resetForm();
    showNotification("Product created successfully! 🎉", "success");
  };
  reader.readAsDataURL(image.files[0]);
}

function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    products = products.filter((product) => product.id !== id);
    saveProducts();
    renderProducts();
    showNotification("Product deleted!", "success");
  }
}

function editProduct(id) {
  const product = products.find((p) => p.id === id);
  if (product) {
    title.value = product.name;
    price.value = product.price;
    description.value = product.desc;
    imagePreview.innerHTML = `<img src="${product.img}" alt="Edit Preview" class="image-preview shadow-lg border-4 border-indigo-200 rounded-2xl w-full h-48 object-cover">`;

    // Scroll to form and focus
    form.scrollIntoView({ behavior: "smooth" });
    title.focus();

    // Remove product from list (will be re-added on save)
    products = products.filter((p) => p.id !== id);
    saveProducts();
    renderProducts();

    showNotification("Edit mode activated! Update and save.", "info");
  }
}

function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}

function renderProducts() {
  container.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-3xl shadow-xl hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-2 group relative";

    card.innerHTML = `
      <div class="relative overflow-hidden">
        <img src="${product.img}" class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700">
        <div class="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm">
          <span class="text-green-600 font-bold text-sm">$${parseFloat(product.price).toFixed(2)}</span>
        </div>
        <div class="absolute top-4 right-4 bg-indigo-600/90 backdrop-blur px-3 py-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
          <span class="text-white font-bold text-xs flex items-center space-x-1">
            <i class="fas fa-star"></i>
            <span>Featured</span>
          </span>
        </div>
      </div>
      <div class="p-5">
        <h3 class="text-xl font-bold text-gray-800 mb-2 truncate">${product.name}</h3>
        <p class="text-gray-500 text-sm line-clamp-2 mb-4">${product.desc}</p>
        <div class="flex gap-2 pt-4 border-t border-gray-50">
          <button onclick="deleteProduct(${product.id})" class="flex-1 py-2 px-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center space-x-1">
            <i class="fas fa-trash text-sm"></i>
            <span>Remove</span>
          </button>
          <button onclick="editProduct(${product.id})" class="flex-[2] py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all duration-200 flex items-center justify-center space-x-1">
            <i class="fas fa-edit text-sm"></i>
            <span>Edit Details</span>
          </button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function resetForm() {
  form.reset();
  imagePreview.innerHTML = `
    <div class="text-center p-8">
      <i class="fas fa-image text-4xl mb-4 text-gray-300"></i>
      <p class="text-gray-500">Image preview will appear here</p>
    </div>
  `;
  updateLivePreview();
}

// 🆕 ADVANCED NOTIFICATION SYSTEM
function showNotification(message, type = "success") {
  // Remove existing notifications
  const existing = document.querySelector(".notification");
  if (existing) existing.remove();

  const notification = document.createElement("div");
  notification.className = `notification fixed top-20 right-4 z-50 p-4 rounded-2xl shadow-2xl transform translate-x-full transition-all duration-300 max-w-sm mx-4 backdrop-blur-sm ${
    type === "success"
      ? "bg-green-500/90 border border-green-300 text-white"
      : type === "error"
        ? "bg-red-500/90 border border-red-300 text-white"
        : "bg-blue-500/90 border border-blue-300 text-white"
  }`;

  notification.innerHTML = `
    <div class="flex items-center space-x-3">
      <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-triangle" : "info-circle"} text-lg"></i>
      <span class="font-medium">${message}</span>
    </div>
  `;

  document.body.appendChild(notification);

  // Animate in
  requestAnimationFrame(() => {
    notification.classList.remove("translate-x-full");
  });

  // Auto remove
  setTimeout(() => {
    notification.classList.add("translate-x-full");
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// 🆕 SEARCH & FILTER FUNCTIONALITY
function addSearchFilter() {
  const searchHTML = `
    <div class="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-6 mb-8 border border-white/50 sticky top-4 z-10">
      <div class="flex flex-col sm:flex-row gap-4 items-center">
        <div class="relative flex-1 max-w-md">
          <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input type="text" id="searchInput" placeholder="Search products..." class="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
        </div>
        <select id="sortSelect" class="px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500">
          <option value="newest">Newest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
        <button onclick="clearFilters()" class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-2xl transition-all flex items-center space-x-2">
          <i class="fas fa-times"></i>
          <span>Clear</span>
        </button>
      </div>
    </div>
  `;

  container.insertAdjacentHTML("beforebegin", searchHTML);

  // Search functionality
  document
    .getElementById("searchInput")
    .addEventListener("input", filterProducts);
  document
    .getElementById("sortSelect")
    .addEventListener("change", filterProducts);
}

function filterProducts() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const sortBy = document.getElementById("sortSelect").value;

  let filtered = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.desc.toLowerCase().includes(searchTerm),
  );

  // Sort
  switch (sortBy) {
    case "price-low":
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      break;
    case "price-high":
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(b.price));
      break;
    case "newest":
    default:
      filtered.sort((a, b) => b.id - a.id);
  }

  // Re-render with filtered results
  container.innerHTML = "";
  filtered.forEach((product) => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-3xl shadow-xl hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-2 group relative";
    card.innerHTML = getProductHTML(product);
    container.appendChild(card);
  });
}

function clearFilters() {
  document.getElementById("searchInput").value = "";
  document.getElementById("sortSelect").value = "newest";
  renderProducts();
}

function getProductHTML(product) {
  return `
    <div class="relative overflow-hidden">
      <img src="${product.img}" class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700">
      <div class="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm">
        <span class="text-green-600 font-bold text-sm">$${parseFloat(product.price).toFixed(2)}</span>
      </div>
      <div class="absolute top-4 right-4 bg-indigo-600/90 backdrop-blur px-3 py-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
        <span class="text-white font-bold text-xs flex items-center space-x-1">
          <i class="fas fa-star"></i>
          <span>Featured</span>
        </span>
      </div>
    </div>
    <div class="p-5">
      <h3 class="text-xl font-bold text-gray-800 mb-2 truncate">${product.name}</h3>
      <p class="text-gray-500 text-sm line-clamp-2 mb-4">${product.desc}</p>
      <div class="flex gap-2 pt-4 border-t border-gray-50">
        <button onclick="deleteProduct(${product.id})" class="flex-1 py-2 px-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center space-x-1">
          <i class="fas fa-trash text-sm"></i>
          <span>Remove</span>
        </button>
        <button onclick="editProduct(${product.id})" class="flex-[2] py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all duration-200 flex items-center justify-center space-x-1">
          <i class="fas fa-edit text-sm"></i>
          <span>Edit Details</span>
        </button>
      </div>
    </div>
  `;
}

// Initialize advanced features
addSearchFilter();

// Success feedback
createor.addEventListener("click", () => {
  if (title.value.trim() && price.value && image.files[0]) {
    createor.innerHTML =
      '<i class="fas fa-check mr-2 animate-pulse"></i>Creating...';
    setTimeout(() => {
      createor.innerHTML = '<i class="fas fa-rocket mr-3"></i>Create Product';
    }, 1500);
  }
});
