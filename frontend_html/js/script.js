const API = 'http://localhost:5000/api';

let allProducts = [];
let activeCategory = 'all';
let searchTerm = '';
let deleteTargetId = null;

document.getElementById('year').textContent = new Date().getFullYear();

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0);
}

// ── Load ──────────────────────────────────────────────────────────────────────
async function loadProducts() {
  try {
    const res = await fetch(`${API}/products`);
    allProducts = await res.json();
    buildCategoryFilters();
    updateStats();
    renderFeatured();
    renderGrid();
    lucide.createIcons();
  } catch {
    document.getElementById('productGrid').innerHTML =
      '<article class="empty-state product-card"><h3>Failed to load</h3><p>Is the server running?</p></article>';
  }
}

// ── Filters & stats ───────────────────────────────────────────────────────────
function buildCategoryFilters() {
  const cats = [...new Set(allProducts.map(p => (p.productcategory || '').trim()).filter(Boolean))].sort();
  const row = document.getElementById('filterRow');
  row.innerHTML = `<button class="filter-pill active" onclick="setCategory('all',this)">All</button>`;
  cats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-pill';
    btn.style.color = '#9f3518';
    btn.textContent = cat;
    btn.onclick = () => setCategory(cat.toLowerCase(), btn);
    row.appendChild(btn);
  });
}

function setCategory(cat, btn) {
  activeCategory = cat;
  document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderGrid();
}

function handleSearch(e) {
  e.preventDefault();
  searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
  renderGrid();
}

function updateStats() {
  const avg = allProducts.length
    ? allProducts.reduce((s, p) => s + (Number(p.productprice) || 0), 0) / allProducts.length : 0;
  const cats = new Set(allProducts.map(p => (p.productcategory || '').trim()).filter(Boolean));
  document.getElementById('statCount').textContent = allProducts.length;
  document.getElementById('statCats').textContent = cats.size;
  document.getElementById('statAvg').textContent = formatCurrency(avg);
}

// ── Featured panel ────────────────────────────────────────────────────────────
function renderFeatured() {
  const p = allProducts[0];
  const panel = document.getElementById('featuredPanel');
  if (!p) return;
  const artHtml = p.productimage
    ? `<div class="feature-art has-image"><span class="art-card">${p.productcategory || 'Category'}</span><img src="http://localhost:5000${p.productimage}" alt="${p.productname}" /></div>`
    : `<div class="feature-art"><span class="art-orb art-orb-one"></span><span class="art-orb art-orb-two"></span><span class="art-card">${p.productcategory || 'Category'}</span></div>`;
  panel.innerHTML = `
    <div class="feature-glow"></div>
    <p class="panel-label">Featured Drop</p>
    <h2>${p.productname}</h2>
    <p class="panel-text" style="color:#9f3518">${p.productdescription || 'No description yet.'}</p>
    ${artHtml}
    <div class="panel-meta">
      <div><span style="color:#9f3518">Category</span><strong style="color:#9f3518">${p.productcategory || 'Uncategorized'}</strong></div>
      <div><span style="color:#9f3518">Value</span><strong style="color:#9f3518">${formatCurrency(p.productprice)}</strong></div>
    </div>`;
}

// ── Product grid ──────────────────────────────────────────────────────────────
function renderGrid() {
  const grid = document.getElementById('productGrid');
  const filtered = allProducts.filter(p => {
    const matchCat = activeCategory === 'all' || (p.productcategory || '').trim().toLowerCase() === activeCategory;
    const haystack = [p.productname, p.productcategory, p.productdescription].filter(Boolean).join(' ').toLowerCase();
    return matchCat && (!searchTerm || haystack.includes(searchTerm));
  });

  if (!filtered.length) {
    grid.innerHTML = '<article class="empty-state product-card"><h3>No products found</h3><p>Try a different search or category.</p></article>';
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <article class="product-card">
      <div class="product-image">
        ${p.productimage ? `<img src="http://localhost:5000${p.productimage}" alt="${p.productname}" onerror="this.parentElement.style.background=''">` : ''}
      </div>
      <div class="product-content">
        <p class="product-tool">${p.productcategory || 'Uncategorized'}</p>
        <h3>${p.productname}</h3>
        <p class="product-description">${p.productdescription || 'No description added yet.'}</p>
        <div class="product-meta">
          <span>Catalog item</span>
          <strong>${formatCurrency(p.productprice)}</strong>
        </div>
        <div class="product-actions">
          <button class="product-action edit-btn" onclick="openEdit('${p._id}')"><i data-lucide="pencil"></i> Edit</button>
          <button class="product-action delete-btn" onclick="openConfirm('${p._id}', '${p.productname.replace(/'/g, "\\'")}')"><i data-lucide="trash-2"></i> Delete</button>
        </div>
      </div>
    </article>
  `).join('');
  lucide.createIcons();
}

// ── Add / Edit modal ──────────────────────────────────────────────────────────
function openModal() {
  document.getElementById('modalTitle').textContent = 'Add new product';
  document.getElementById('productId').value = '';
  document.getElementById('productForm').reset();
  document.getElementById('imagePreview').classList.add('hidden');
  document.getElementById('formError').classList.add('hidden');
  document.getElementById('productModal').classList.remove('hidden');
}

function openEdit(id) {
  const p = allProducts.find(x => x._id === id);
  if (!p) return;
  document.getElementById('modalTitle').textContent = 'Edit product';
  document.getElementById('productId').value = p._id;
  document.getElementById('fname').value = p.productname;
  document.getElementById('fprice').value = p.productprice;
  document.getElementById('fcategory').value = p.productcategory;
  document.getElementById('fdescription').value = p.productdescription || '';
  document.getElementById('formError').classList.add('hidden');
  const preview = document.getElementById('imagePreview');
  if (p.productimage) {
    preview.src = `http://localhost:5000${p.productimage}`;
    preview.classList.remove('hidden');
  } else {
    preview.classList.add('hidden');
  }
  document.getElementById('productModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('productModal').classList.add('hidden');
}

document.getElementById('fimage').addEventListener('change', e => {
  const file = e.target.files[0];
  const preview = document.getElementById('imagePreview');
  if (!file) return preview.classList.add('hidden');
  const reader = new FileReader();
  reader.onload = ev => { preview.src = ev.target.result; preview.classList.remove('hidden'); };
  reader.readAsDataURL(file);
});

document.getElementById('productForm').addEventListener('submit', async e => {
  e.preventDefault();
  const id = document.getElementById('productId').value;
  const formData = new FormData();
  formData.append('productname', document.getElementById('fname').value);
  formData.append('productprice', document.getElementById('fprice').value);
  formData.append('productcategory', document.getElementById('fcategory').value);
  formData.append('productdescription', document.getElementById('fdescription').value);
  const file = document.getElementById('fimage').files[0];
  if (file) formData.append('productimage', file);

  try {
    const res = await fetch(`${API}/products${id ? '/' + id : ''}`, {
      method: id ? 'PUT' : 'POST',
      body: formData
    });
    const data = await res.json();
    if (!res.ok) {
      const err = document.getElementById('formError');
      err.textContent = data.message || 'Something went wrong.';
      err.classList.remove('hidden');
      return;
    }
    closeModal();
    await loadProducts();
  } catch {
    const err = document.getElementById('formError');
    err.textContent = 'Request failed. Is the server running?';
    err.classList.remove('hidden');
  }
});

// Close modal on backdrop click
document.getElementById('productModal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});

// ── Delete ────────────────────────────────────────────────────────────────────
function openConfirm(id, name) {
  deleteTargetId = id;
  document.getElementById('confirmText').textContent = `Are you sure you want to delete "${name}"? This cannot be undone.`;
  document.getElementById('confirmModal').classList.remove('hidden');
}

function closeConfirm() {
  deleteTargetId = null;
  document.getElementById('confirmModal').classList.add('hidden');
}

async function confirmDelete() {
  if (!deleteTargetId) return;
  try {
    const res = await fetch(`${API}/products/${deleteTargetId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error();
    closeConfirm();
    await loadProducts();
  } catch {
    alert('Delete failed. Is the server running?');
  }
}

document.getElementById('confirmModal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeConfirm();
});

// ── Init ──────────────────────────────────────────────────────────────────────
loadProducts();
