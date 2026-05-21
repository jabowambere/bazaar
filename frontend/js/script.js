const API_BASE = (() => {
    if (window.location.origin === "http://localhost:5000" || window.location.origin === "http://127.0.0.1:5000") {
        return "/products";
    }

    return "http://localhost:5000/products";
})();

const state = {
    products: [],
    filteredProducts: [],
    activeCategory: "all",
    searchTerm: "",
    editingProductId: null
};

const elements = {
    productGrid: document.getElementById("productGrid"),
    categoryFilters: document.getElementById("categoryFilters"),
    statusBanner: document.getElementById("statusBanner"),
    searchForm: document.getElementById("searchForm"),
    searchInput: document.getElementById("search"),
    refreshButton: document.getElementById("refreshProducts"),
    openModalButton: document.getElementById("openProductModal"),
    modal: document.getElementById("productModal"),
    closeModalButton: document.getElementById("closeProductModal"),
    cancelModalButton: document.getElementById("cancelProductModal"),
    productForm: document.getElementById("productForm"),
    submitButton: document.getElementById("submitProductForm"),
    formError: document.getElementById("formError"),
    imageHint: document.getElementById("imageHint"),
    modalTitle: document.getElementById("productModalTitle"),
    productId: document.getElementById("productId"),
    productName: document.getElementById("productname"),
    productPrice: document.getElementById("productprice"),
    productCategory: document.getElementById("productcategory"),
    productDescription: document.getElementById("productdescription"),
    productImage: document.getElementById("productimage"),
    statProductCount: document.getElementById("statProductCount"),
    statCategoryCount: document.getElementById("statCategoryCount"),
    statAveragePrice: document.getElementById("statAveragePrice"),
    featuredTitle: document.getElementById("featuredTitle"),
    featuredDescription: document.getElementById("featuredDescription"),
    featuredCategory: document.getElementById("featuredCategory"),
    featuredMetaCategory: document.getElementById("featuredMetaCategory"),
    featuredPrice: document.getElementById("featuredPrice"),
    featuredArt: document.getElementById("featuredArt")
};

function escapeHtml(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function formatCurrency(value) {
    const number = Number(value) || 0;
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(number);
}

function showStatus(message, type = "success") {
    elements.statusBanner.textContent = message;
    elements.statusBanner.className = `status-banner ${type}`;
    elements.statusBanner.hidden = false;
}

function clearStatus() {
    elements.statusBanner.hidden = true;
    elements.statusBanner.textContent = "";
    elements.statusBanner.className = "status-banner";
}

function showFormError(message) {
    elements.formError.textContent = message;
    elements.formError.hidden = false;
}

function clearFormError() {
    elements.formError.textContent = "";
    elements.formError.hidden = true;
}

function normalizeCategory(category) {
    return (category || "").trim().toLowerCase();
}

function getFilteredProducts() {
    return state.products.filter((product) => {
        const matchesCategory = state.activeCategory === "all" ||
            normalizeCategory(product.productcategory) === state.activeCategory;

        const haystack = [
            product.productname,
            product.productcategory,
            product.productdescription
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        const matchesSearch = !state.searchTerm || haystack.includes(state.searchTerm);
        return matchesCategory && matchesSearch;
    });
}

function renderCategoryFilters() {
    const categories = [...new Set(
        state.products
            .map((product) => product.productcategory ? product.productcategory.trim() : "")
            .filter(Boolean)
    )].sort((a, b) => a.localeCompare(b));

    const buttons = [
        '<button class="filter-pill active" type="button" data-category="all">All</button>',
        ...categories.map((category) => (
            `<button class="filter-pill" type="button" data-category="${escapeHtml(normalizeCategory(category))}">${escapeHtml(category)}</button>`
        ))
    ];

    elements.categoryFilters.innerHTML = buttons.join("");

    [...elements.categoryFilters.querySelectorAll(".filter-pill")].forEach((button) => {
        if (button.dataset.category === state.activeCategory) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });
}

function renderFeaturedProduct() {
    const featured = state.products[0];

    if (!featured) {
        elements.featuredTitle.textContent = "Your next hero product";
        elements.featuredDescription.textContent = "Add a product and it will automatically appear as the featured item here.";
        elements.featuredCategory.textContent = "Catalog";
        elements.featuredMetaCategory.textContent = "No category yet";
        elements.featuredPrice.textContent = "$0.00";
        elements.featuredArt.classList.remove("has-image");
        elements.featuredArt.innerHTML = `
            <span class="art-orb art-orb-one"></span>
            <span class="art-orb art-orb-two"></span>
            <span class="art-card">Catalog</span>
        `;
        return;
    }

    elements.featuredTitle.textContent = featured.productname;
    elements.featuredDescription.textContent = featured.productdescription || "No description yet for this product.";
    elements.featuredCategory.textContent = featured.productcategory || "Category";
    elements.featuredMetaCategory.textContent = featured.productcategory || "Uncategorized";
    elements.featuredPrice.textContent = formatCurrency(featured.productprice);

    if (featured.productimage) {
        elements.featuredArt.classList.add("has-image");
        elements.featuredArt.innerHTML = `
            <span class="art-card">${escapeHtml(featured.productcategory || "Category")}</span>
            <img src="${escapeHtml(featured.productimage)}" alt="${escapeHtml(featured.productname)}">
        `;
    }
}

function renderStats() {
    const categories = new Set(
        state.products
            .map((product) => product.productcategory ? product.productcategory.trim() : "")
            .filter(Boolean)
    );

    const averagePrice = state.products.length
        ? state.products.reduce((sum, product) => sum + (Number(product.productprice) || 0), 0) / state.products.length
        : 0;

    elements.statProductCount.textContent = String(state.products.length);
    elements.statCategoryCount.textContent = String(categories.size);
    elements.statAveragePrice.textContent = formatCurrency(averagePrice);
}

function renderProducts() {
    state.filteredProducts = getFilteredProducts();

    if (!state.filteredProducts.length) {
        elements.productGrid.innerHTML = `
            <article class="empty-state product-card">
                <h3>No products match your current filters</h3>
                <p>Try a different search, switch categories, or add a new product.</p>
            </article>
        `;
        return;
    }

    elements.productGrid.innerHTML = state.filteredProducts.map((product, index) => `
        <article class="product-card">
            ${index === 0 ? '<span class="product-badge">Featured</span>' : ""}
            <div class="product-image">
                ${product.productimage
                    ? `<img src="${escapeHtml(product.productimage)}" alt="${escapeHtml(product.productname)}">`
                    : ""}
            </div>
            <div class="product-content">
                <p class="product-tool">${escapeHtml(product.productcategory || "Uncategorized")}</p>
                <h3>${escapeHtml(product.productname)}</h3>
                <p class="product-description">${escapeHtml(product.productdescription || "No description added yet.")}</p>
                <div class="product-meta">
                    <span>Catalog item</span>
                    <strong>${formatCurrency(product.productprice)}</strong>
                </div>
                <div class="product-actions">
                    <button class="product-action" type="button" data-action="edit" data-id="${escapeHtml(product._id)}">Edit</button>
                    <button class="product-action danger" type="button" data-action="delete" data-id="${escapeHtml(product._id)}">Delete</button>
                </div>
            </div>
        </article>
    `).join("");
}

function syncUi() {
    renderCategoryFilters();
    renderFeaturedProduct();
    renderStats();
    renderProducts();
}

async function fetchProducts() {
    clearStatus();

    try {
        const response = await fetch(API_BASE);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Fetching products failed");
        }

        state.products = Array.isArray(data) ? data : [];
        syncUi();
    } catch (error) {
        showStatus(
            error.message || "Unable to fetch products. Make sure the backend is running on http://localhost:5000.",
            "error"
        );
    }
}

function openModal(product = null) {
    clearFormError();
    elements.productForm.reset();
    elements.productId.value = "";
    state.editingProductId = null;

    if (product) {
        state.editingProductId = product._id;
        elements.modalTitle.textContent = "Edit product";
        elements.submitButton.textContent = "Update product";
        elements.imageHint.textContent = "Leave the image empty to keep the current one.";
        elements.productId.value = product._id;
        elements.productName.value = product.productname || "";
        elements.productPrice.value = product.productprice !== undefined && product.productprice !== null
            ? product.productprice
            : "";
        elements.productCategory.value = product.productcategory || "";
        elements.productDescription.value = product.productdescription || "";
        elements.productImage.required = false;
    } else {
        elements.modalTitle.textContent = "Add new product";
        elements.submitButton.textContent = "Save product";
        elements.imageHint.textContent = "Image is required for new products.";
        elements.productImage.required = true;
    }

    elements.modal.hidden = false;
    document.body.style.overflow = "hidden";
}

function closeModal() {
    elements.modal.hidden = true;
    document.body.style.overflow = "";
    clearFormError();
    elements.productForm.reset();
    elements.productImage.required = true;
    state.editingProductId = null;
}

function buildFormData() {
    const formData = new FormData();
    formData.append("productname", elements.productName.value.trim());
    formData.append("productprice", elements.productPrice.value);
    formData.append("productcategory", elements.productCategory.value.trim());
    formData.append("productdescription", elements.productDescription.value.trim());

    const file = elements.productImage.files[0];
    if (file) {
        formData.append("productimage", file);
    }

    return formData;
}

async function createProduct() {
    const response = await fetch(API_BASE, {
        method: "POST",
        body: buildFormData()
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Creating product failed");
    }

    return data;
}

async function updateProduct(productId) {
    const response = await fetch(`${API_BASE}/${productId}`, {
        method: "PUT",
        body: buildFormData()
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Updating product failed");
    }

    return data;
}

async function deleteProduct(productId) {
    const response = await fetch(`${API_BASE}/${productId}`, {
        method: "DELETE"
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Deleting product failed");
    }

    return data;
}

async function handleProductSubmit(event) {
    event.preventDefault();
    clearFormError();

    const isEditing = Boolean(state.editingProductId);
    const hasImage = Boolean(elements.productImage.files[0]);
    if (!isEditing && !hasImage) {
        showFormError("Please choose a product image.");
        return;
    }

    elements.submitButton.disabled = true;
    elements.submitButton.textContent = isEditing ? "Updating..." : "Saving...";

    try {
        if (isEditing) {
            await updateProduct(state.editingProductId);
            showStatus("Product updated successfully.");
        } else {
            await createProduct();
            showStatus("Product created successfully.");
        }

        closeModal();
        await fetchProducts();
    } catch (error) {
        showFormError(error.message || "Unable to save product.");
    } finally {
        elements.submitButton.disabled = false;
        elements.submitButton.textContent = isEditing ? "Update product" : "Save product";
    }
}

async function handleProductGridClick(event) {
    const button = event.target.closest("[data-action]");
    if (!button) {
        return;
    }

    const { action, id } = button.dataset;
    const product = state.products.find((item) => item._id === id);
    if (!product) {
        return;
    }

    if (action === "edit") {
        openModal(product);
        return;
    }

    if (action === "delete") {
        const confirmed = window.confirm(`Delete "${product.productname}"?`);
        if (!confirmed) {
            return;
        }

        try {
            await deleteProduct(product._id);
            showStatus("Product deleted successfully.");
            await fetchProducts();
        } catch (error) {
            showStatus(error.message || "Unable to delete product.", "error");
        }
    }
}

function handleCategoryFilterClick(event) {
    const button = event.target.closest("[data-category]");
    if (!button) {
        return;
    }

    state.activeCategory = button.dataset.category;

    [...elements.categoryFilters.querySelectorAll(".filter-pill")].forEach((pill) => {
        pill.classList.toggle("active", pill.dataset.category === state.activeCategory);
    });

    renderProducts();
}

function handleSearch(event) {
    event.preventDefault();
    state.searchTerm = elements.searchInput.value.trim().toLowerCase();
    renderProducts();
}

function initializeEventListeners() {
    elements.searchForm.addEventListener("submit", handleSearch);
    elements.refreshButton.addEventListener("click", fetchProducts);
    elements.openModalButton.addEventListener("click", () => openModal());
    elements.closeModalButton.addEventListener("click", closeModal);
    elements.cancelModalButton.addEventListener("click", closeModal);
    elements.productForm.addEventListener("submit", handleProductSubmit);
    elements.productGrid.addEventListener("click", handleProductGridClick);
    elements.categoryFilters.addEventListener("click", handleCategoryFilterClick);

    elements.modal.addEventListener("click", (event) => {
        if (event.target === elements.modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !elements.modal.hidden) {
            closeModal();
        }
    });
}

async function init() {
    try {
        initializeEventListeners();
        await fetchProducts();
    } catch (error) {
        showStatus(
            "Frontend failed to initialize. Refresh the page in http://localhost:5000 and check the browser console.",
            "error"
        );
        console.error(error);
    }
}

init();
