import ProductForm from './ProductForm'

export default function ProductModal({ product, onClose, onSaved }) {
  const isEditing = Boolean(product)

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="productModalTitle">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Catalog Admin</p>
            <h2 id="productModalTitle">{isEditing ? 'Edit product' : 'Add new product'}</h2>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close form">×</button>
        </div>
        <ProductForm product={product} onClose={onClose} onSaved={onSaved} />
      </div>
    </div>
  )
}
