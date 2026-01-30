import { useState, useEffect } from 'react';
import { addProduct, updateProduct } from '../services/productService';
import './Modal.css';

function ProductModal({ product, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: '',
    unitPrice: '',
    stockQuantity: 0,
    minStockLevel: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.sku || !formData.name || !formData.category || !formData.unitPrice || !formData.minStockLevel) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (formData.unitPrice <= 0) {
      setError('Unit price must be greater than 0');
      setLoading(false);
      return;
    }

    if (formData.minStockLevel < 0) {
      setError('Minimum stock level cannot be negative');
      setLoading(false);
      return;
    }

    try {
      if (product) {
        // Update existing product
        await updateProduct(product.productId, formData);
      } else {
        // Add new product
        await addProduct(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Operation failed');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>
                <span className="label-icon">🏷️</span> SKU *
              </label>
              <input
                type="text"
                name="sku"
                placeholder="e.g., LAP-HP-001"
                value={formData.sku}
                onChange={handleChange}
                disabled={!!product}
                required
              />
              {product && <small className="field-note">SKU cannot be changed</small>}
            </div>

            <div className="form-group">
              <label>
                <span className="label-icon">📦</span> Product Name *
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <span className="label-icon">📂</span> Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Furniture">Furniture</option>
                <option value="Stationery">Stationery</option>
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <span className="label-icon">💰</span> Unit Price (₹) *
              </label>
              <input
                type="number"
                name="unitPrice"
                placeholder="0.00"
                value={formData.unitPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <span className="label-icon">📊</span> Stock Quantity
              </label>
              <input
                type="number"
                name="stockQuantity"
                placeholder="0"
                value={formData.stockQuantity}
                onChange={handleChange}
                min="0"
                disabled={!!product}
              />
              {product && <small className="field-note">Use Stock In/Out buttons to adjust</small>}
            </div>

            <div className="form-group">
              <label>
                <span className="label-icon">⚠️</span> Min Stock Level *
              </label>
              <input
                type="number"
                name="minStockLevel"
                placeholder="Threshold for alerts"
                value={formData.minStockLevel}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span> Saving...
                </>
              ) : (
                product ? 'Update Product' : 'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;
