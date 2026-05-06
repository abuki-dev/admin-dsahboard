// Get all elements
if (document.getElementById("login-form")) {
  //login pages code goes here
  // jsut as apractice let us make tehbutton go to the admin
  const form = document.getElementById("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const Accounttype = Checkaccount();
    if (Accounttype === "admin") window.location.href = "./admin/";
    else if (Accounttype === "user") window.location.href = "./users/";
    else alert("please choosse correc account type");
  });
  function Checkaccount() {
    const select = document.getElementById("account-type");
    const slelected = select.options[select.selectedIndex];
    return slelected.value;
  }
}
if (document.getElementById("admin-page")) {
  console.log("helow world");

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
    if (previewPrice) previewPrice.textContent = `${price.value || "0.00"}`;
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
        "glass-panel rounded-3xl overflow-hidden group hover:border-indigo-400/60 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 transform hover:-translate-y-2";
      card.innerHTML = `
      <div class="relative h-56 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
        <img src="${product.img}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        <div class="absolute top-4 right-4">
          <div class="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
            <span class="text-emerald-400 text-sm font-black tracking-wider">$${product.price}</span>
          </div>
        </div>
        <div class="absolute bottom-4 left-4 right-4">
          <h3 class="text-xl font-black text-white mb-1 drop-shadow-lg truncate">${product.name}</h3>
          <div class="flex items-center gap-2">
            <div class="h-1 w-12 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-full"></div>
            <span class="text-xs text-slate-300 font-semibold">Premium Asset</span>
          </div>
        </div>
      </div>
      <div class="p-6 bg-gradient-to-b from-slate-900/50 to-slate-900/80">
        <p class="text-slate-300 text-sm leading-relaxed mb-6 line-clamp-2 min-h-[2.5rem]">${product.desc}</p>
        <div class="flex gap-3">
          <button onclick="editProduct(${product.id})" class="flex-1 py-3 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 hover:from-indigo-600 hover:to-purple-600 border border-indigo-500/30 hover:border-indigo-400 rounded-xl text-sm font-bold text-indigo-200 hover:text-white transition-all duration-300 shadow-lg hover:shadow-indigo-500/50">
            <i class="fas fa-pen-to-square mr-2"></i>Edit
          </button>
          <button onclick="deleteProduct(${product.id})" class="px-5 py-3 bg-gradient-to-r from-red-600/20 to-rose-600/20 hover:from-red-600 hover:to-rose-600 border border-red-500/30 hover:border-red-400 text-red-400 hover:text-white rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-red-500/50">
            <i class="fas fa-trash-can"></i>
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
  /**
   * SEARCH & FILTER MODULE - Nexus Admin
   */

  function addSearchFilter() {
    // Check if it already exists to avoid duplicates
    if (document.getElementById("searchInput")) return;

    const searchHTML = `
    <div class="glass-panel rounded-[2rem] p-6 mb-10 shadow-2xl border border-white/10 sticky top-4 z-30">
      <div class="flex flex-col md:flex-row gap-4 items-stretch">

        <!-- Search input -->
        <div class="search-field-wrap flex-1">
          <span class="search-icon"><i class="fas fa-search"></i></span>
          <input type="text" id="searchInput" placeholder="Search product database..."
            class="search-input" />
        </div>

        <!-- Sort select -->
        <div class="select-field-wrap">
          <span class="select-icon"><i class="fas fa-sliders"></i></span>
          <select id="sortSelect" class="sort-select">
            <option value="newest">Latest Deployment</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
          </select>
          <span class="select-chevron"><i class="fas fa-chevron-down"></i></span>
        </div>

        <!-- Reset button -->
        <button onclick="clearFilters()" class="reset-btn">
          <i class="fas fa-rotate-left"></i>
          <span>Reset</span>
        </button>
      </div>
    </div>
  `;

    // Insert it right above the container
    container.insertAdjacentHTML("beforebegin", searchHTML);

    // Re-attach event listeners
    document
      .getElementById("searchInput")
      .addEventListener("input", filterProducts);
    document
      .getElementById("sortSelect")
      .addEventListener("change", filterProducts);
  }

  function filterProducts() {
    const searchTerm = document
      .getElementById("searchInput")
      .value.toLowerCase();
    const sortBy = document.getElementById("sortSelect").value;

    // 1. Filter the data
    let filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.desc.toLowerCase().includes(searchTerm),
    );

    // 2. Sort the data
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      filtered.sort((a, b) => b.id - a.id); // Default newest
    }

    // 3. Clear and Re-render
    container.innerHTML = "";

    if (filtered.length === 0) {
      container.innerHTML = `
      <div class="col-span-full py-20 text-center glass-panel rounded-[2rem]">
        <i class="fas fa-ghost text-6xl text-slate-700 mb-4"></i>
        <p class="text-slate-500 text-xl font-medium">No assets found matching your query.</p>
      </div>
    `;
      return;
    }

    // Use the new styled card format
    filtered.forEach((product) => {
      const card = document.createElement("div");
      card.className =
        "glass-panel rounded-3xl overflow-hidden group hover:border-indigo-400/60 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 transform hover:-translate-y-2";
      card.innerHTML = `
      <div class="relative h-56 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
        <img src="${product.img}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        <div class="absolute top-4 right-4">
          <div class="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
            <span class="text-emerald-400 text-sm font-black tracking-wider">$${product.price}</span>
          </div>
        </div>
        <div class="absolute bottom-4 left-4 right-4">
          <h3 class="text-xl font-black text-white mb-1 drop-shadow-lg truncate">${product.name}</h3>
          <div class="flex items-center gap-2">
            <div class="h-1 w-12 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-full"></div>
            <span class="text-xs text-slate-300 font-semibold">Premium Asset</span>
          </div>
        </div>
      </div>
      <div class="p-6 bg-gradient-to-b from-slate-900/50 to-slate-900/80">
        <p class="text-slate-300 text-sm leading-relaxed mb-6 line-clamp-2 min-h-[2.5rem]">${product.desc}</p>
        <div class="flex gap-3">
          <button onclick="editProduct(${product.id})" class="flex-1 py-3 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 hover:from-indigo-600 hover:to-purple-600 border border-indigo-500/30 hover:border-indigo-400 rounded-xl text-sm font-bold text-indigo-200 hover:text-white transition-all duration-300 shadow-lg hover:shadow-indigo-500/50">
            <i class="fas fa-pen-to-square mr-2"></i>Edit
          </button>
          <button onclick="deleteProduct(${product.id})" class="px-5 py-3 bg-gradient-to-r from-red-600/20 to-rose-600/20 hover:from-red-600 hover:to-rose-600 border border-red-500/30 hover:border-red-400 text-red-400 hover:text-white rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-red-500/50">
            <i class="fas fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;
      container.appendChild(card);
    });
  }

  function clearFilters() {
    document.getElementById("searchInput").value = "";
    document.getElementById("sortSelect").value = "newest";
    renderProducts(); // Back to main list
  }

  // Call this at the end of your script to initialize
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
}
if (document.getElementById("usesrs-page")) {
  document.querySelectorAll(".pcard-wishlist").forEach((btn) => {
    btn.addEventListener("click", function () {
      this.classList.toggle("active");
      const icon = this.querySelector("i");
      icon.className = this.classList.contains("active")
        ? "fas fa-heart"
        : "far fa-heart";
    });
  });

  // Add to cart feedback
  document.querySelectorAll(".pcard-btn-cart").forEach((btn) => {
    btn.addEventListener("click", function () {
      const orig = this.innerHTML;
      this.innerHTML = '<i class="fas fa-check"></i> Added!';
      this.style.background = "linear-gradient(135deg,#10b981,#059669)";
      setTimeout(() => {
        this.innerHTML = orig;
        this.style.background = "";
      }, 1500);
    });
  });

  // Dropdown
  const profileBtn = document.getElementById("profileBtn");
  const profileDropdown = document.getElementById("profileDropdown");
  const profileChevron = document.getElementById("profileChevron");
  profileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = profileDropdown.classList.toggle("open");
    profileBtn.setAttribute("aria-expanded", open);
    profileChevron.style.transform = open ? "rotate(180deg)" : "";
  });
  document.addEventListener("click", () => {
    profileDropdown.classList.remove("open");
    profileBtn.setAttribute("aria-expanded", "false");
    profileChevron.style.transform = "";
  });
  profileDropdown.addEventListener("click", (e) => e.stopPropagation());

  // Search filter
  document.getElementById("navSearch").addEventListener("input", function () {
    const q = this.value.toLowerCase();
    document.querySelectorAll(".pcard").forEach((card) => {
      const name = card.dataset.name || "";
      card.style.display = name.toLowerCase().includes(q) ? "" : "none";
    });
  });

  function updatepage() {
    const conatiner = document.getElementById("userProductGrid");
    const products = localStorage.getItem("products") || "[]";
    const allproducts = JSON.parse(products);
    if (allproducts.length == 0) return;
    conatiner.innerHTML = "";
    for (let product of allproducts) {
      const div = document.createElement("div");
      div.innerHTML = `
          <div class="pcard" data-name="Masterpiece Pro Bundle">
            <!-- Image area -->
            <div class="pcard-img-wrap">
              <div class="pcard-img-placeholder">
              <img src="${product.img}"/>
                <i class="fas fa-cube"></i>
              </div>

              <!-- Badges -->
              <span class="pcard-badge pcard-badge--new">New</span>
              <button class="pcard-wishlist" aria-label="Add to wishlist">
                <i class="far fa-heart"></i>
              </button>

              <!-- Quick-view overlay -->
              <div class="pcard-overlay">
                <button class="pcard-quickview">
                  <i class="fas fa-eye"></i> Quick View
                </button>
              </div>
            </div>

            <!-- Body -->
            <div class="pcard-body">
              <!-- Category tag -->
              <span class="pcard-tag">Weardrob</span>

              <!-- Name -->
              <h3 class="pcard-name">${product.name}</h3>

              <!-- Description -->
              <p class="pcard-desc">
               ${product.desc}
              </p>

              <!-- Stars + review count -->
              <div class="pcard-rating">
                <span class="pcard-stars">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star-half-stroke"></i>
                </span>
                <span class="pcard-rating-val">4.8</span>
                <span class="pcard-rating-count">(124 reviews)</span>
              </div>

              <!-- Price row -->
              <div class="pcard-price-row">
                <div>
                  <span class="pcard-price">${product.price}</span>
                  <span class="pcard-price-old">$79.00</span>
                </div>
                <span class="pcard-discount">−38%</span>
              </div>

              <!-- Actions -->
              <div class="pcard-actions">
                <button class="pcard-btn-cart">
                  <i class="fas fa-bag-shopping"></i>
                  Add to Cart
                </button>
                <button class="pcard-btn-view">
                  <i class="fas fa-arrow-up-right-from-square"></i>
                </button>
              </div>
            </div>
          </div>`;
      conatiner.appendChild(div);
      // Perform actions with each product here
    }
  }
}
