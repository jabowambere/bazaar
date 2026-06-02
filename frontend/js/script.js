const API = 'http://localhost:5000/api';

const grid = document.getElementById('productsGrid');
const modal = document.getElementById('modal');
const confirmModal = document.getElementById('confirmModal');
const form = document.getElementById('productForm');
const toast = document.getElementById('toast');

let deleteTargetId = null;

// Toast
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Fetch & render all products
async function loadProducts() {
  grid.innerHTML = '<p class="empty-state">Loading...</p>';
  try {
    const res = await fetch(`${API}/products`);
    const products = await res.json();
    renderProducts(products);
  } catch {
    grid.innerHTML = '<p class="empty-state">Failed to load products. Is the server running?</p>';
  }
}

function renderProducts(products) {
  if (!products.length) {
    grid.innerHTML = '<p class="empty-state">No products yet. Add one!</p>';
    return;
  }
  grid.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="http://localhost:5000${p.productimage}" alt="${p.productname}" onerror="this.src='https://placehold.co/400x200/1a1a1a/555?text=No+Image'" />
      <div class="card-body">
        <div class="category">${p.productcategory}</div>
        <h3>${p.productname}</h3>
        <div class="price">$${Number(p.productprice).toFixed(2)}</div>
        <p class="description">${p.productdescription || ''}</p>
        <div class="card-actions">
          <button class="btn-edit" onclick="openEdit('${p._id}', '${escape(p.productname)}', ${p.productprice}, '${escape(p.productcategory)}', '${escape(p.productdescription || '')}', '${p.productimage}')">Edit</button>
          <button class="btn-delete" onclick="openDelete('${p._id}', '${escape(p.productname)}')">Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Open Add modal
document.getElementById('openAddModal').onclick = () => {
  document.getElementById('modalTitle').textContent = 'Add Product';
  document.getElementById('productId').value = '';
  form.reset();
  hideImagePreview();
  modal.classList.remove('hidden');
};

// Open Edit modal
function openEdit(id, name, price, category, description, image) {
  document.getElementById('modalTitle').textContent = 'Edit Product';
  document.getElementById('productId').value = id;
  document.getElementById('productname').value = unescape(name);
  document.getElementById('productprice').value = price;
  document.getElementById('productcategory').value = unescape(category);
  document.getElementById('productdescription').value = unescape(description);
  const preview = document.getElementById('imagePreview');
  preview.src = `http://localhost:5000${image}`;
  preview.classList.remove('hidden');
  modal.classList.remove('hidden');
}

// Image preview on file select
document.getElementById('productimage').onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return hideImagePreview();
  const reader = new FileReader();
  reader.onload = (ev) => {
    const preview = document.getElementById('imagePreview');
    preview.src = ev.target.result;
    preview.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
};

function hideImagePreview() {
  const preview = document.getElementById('imagePreview');
  preview.src = '';
  preview.classList.add('hidden');
}

// Cancel modal
document.getElementById('cancelBtn').onclick = () => modal.classList.add('hidden');
modal.onclick = (e) => { if (e.target === modal) modal.classList.add('hidden'); };

// Submit form (Add or Edit)
form.onsubmit = async (e) => {
  e.preventDefault();
  const id = document.getElementById('productId').value;
  const formData = new FormData();
  formData.append('productname', document.getElementById('productname').value);
  formData.append('productprice', document.getElementById('productprice').value);
  formData.append('productcategory', document.getElementById('productcategory').value);
  formData.append('productdescription', document.getElementById('productdescription').value);
  const imageFile = document.getElementById('productimage').files[0];
  if (imageFile) formData.append('productimage', imageFile);

  try {
    const res = await fetch(`${API}/products${id ? '/' + id : ''}`, {
      method: id ? 'PUT' : 'POST',
      body: formData
    });
    const data = await res.json();
    if (!res.ok) return showToast(data.message || 'Something went wrong');
    modal.classList.add('hidden');
    showToast(id ? 'Product updated!' : 'Product added!');
    loadProducts();
  } catch {
    showToast('Request failed. Is the server running?');
  }
};

// Delete flow
function openDelete(id, name) {
  deleteTargetId = id;
  document.getElementById('confirmText').textContent = `Are you sure you want to delete "${unescape(name)}"? This cannot be undone.`;
  confirmModal.classList.remove('hidden');
}

document.getElementById('confirmDeleteBtn').onclick = async () => {
  if (!deleteTargetId) return;
  try {
    const res = await fetch(`${API}/products/${deleteTargetId}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) return showToast(data.message || 'Delete failed');
    confirmModal.classList.add('hidden');
    deleteTargetId = null;
    showToast('Product deleted.');
    loadProducts();
  } catch {
    showToast('Delete failed. Is the server running?');
  }
};

document.getElementById('cancelDeleteBtn').onclick = () => {
  confirmModal.classList.add('hidden');
  deleteTargetId = null;
};

confirmModal.onclick = (e) => { if (e.target === confirmModal) confirmModal.classList.add('hidden'); };

// Init
loadProducts();
