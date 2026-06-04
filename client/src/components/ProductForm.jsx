import { useRef, useState } from 'react'

const API = import.meta.env.VITE_API_URL || ''

export default function ProductForm({ product, onClose, onSaved }) {
  const isEditing = Boolean(product)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const imageRef = useRef()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const form = e.target
    const file = imageRef.current.files[0]

    if (!isEditing && !file) {
      setError('Please choose a product image.')
      return
    }

    const formData = new FormData()
    formData.append('productname', form.productname.value.trim())
    formData.append('productprice', form.productprice.value)
    formData.append('productcategory', form.productcategory.value.trim())
    formData.append('productdescription', form.productdescription.value.trim())
    if (file) formData.append('productimage', file)

    setLoading(true)
    try {
      const url = isEditing ? `${API}/products/${product._id}` : `${API}/products`
      const method = isEditing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        body: formData,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        credentials: 'include'
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Saving product failed')
      onSaved(isEditing ? 'Product updated successfully.' : 'Product created successfully.')
      onClose()
    } catch (err) {
      setError(err.message || 'Unable to save product.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <label>
        Product name
        <input style={{color:'#9f3518'}}type="text" name="productname" defaultValue={product?.productname || ''} required />
      </label>
      <label>
        Price
        <input style={{color:'#9f3518'}}type="number" name="productprice" min="0" step="0.01" defaultValue={product?.productprice ?? ''} required />
      </label>
      <label>
        Category
        <input style={{color:'#9f3518'}}type="text" name="productcategory" placeholder="Shoes, Electronics, Clothes..." defaultValue={product?.productcategory || ''} required />
      </label>
      <label>
        Description
        <textarea style={{color:'#9f3518'}}name="productdescription" rows="4" placeholder="Short product pitch" defaultValue={product?.productdescription || ''} />
      </label>
      <label>
        Product image
        <input style={{color:'#9f3518'}}type="file" name="productimage" accept=".jpg,.jpeg,.png,.webp" ref={imageRef} />
      </label>

      <p className="form-hint">
        {isEditing ? 'Leave the image empty to keep the current one.' : 'Image is required for new products.'}
      </p>

      {error && <div className="form-error">{error}</div>}

      <div className="form-actions">
        <button style={{color:'#9f3518'}}className="ghost-button" type="button" onClick={onClose}>Cancel</button>
        <button className="solid-button" type="submit" disabled={loading}>
          {loading
            ? (isEditing ? 'Updating...' : 'Saving...')
            : (isEditing ? 'Update product' : 'Save product')}
        </button>
      </div>
    </form>
  )
}
