import { useState } from 'react';
import { stockIn, stockOut } from '../services/productService';
import './Modal.css';

function StockModal({ product, operation, onClose, onSuccess }) {
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!quantity || quantity <= 0) {
      setError('Please enter a valid quantity');
      setLoading(false);
      return;
    }

    try {
      if (operation === 'in') {
        await stockIn(product.productId, parseInt(quantity));
      } else {
        await stockOut(product.productId, parseInt(quantity));
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Operation failed');
      setLoading(false);
    }
  };

  const newQuantity = operation === 'in' 
    ? product.stockQuantity + (parseInt(quantity) || 0)
    : product.stockQuantity - (parseInt(quantity) || 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container modal-small" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {operation === 'in' ? '⬆️ Stock In' : '⬇️ Stock Out'}
          </h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="stock-info">
          <div className="info-row">
            <span className="info-label">Product:</span>
            <span className="info-value">{product.name}</span>
          </div>
          <div className="info-row">
            <span className="info-label">SKU:</span>
            <span className="info-value sku-value">{product.sku}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Current Stock:</span>
            <span className="info-value quantity-value">{product.stockQuantity}</span>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <span className="label-icon">📦</span> 
              {operation === 'in' ? 'Quantity to Add' : 'Quantity to Remove'}
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => { setQuantity(e.target.value); setError(''); }}
              placeholder="Enter quantity"
              min="1"
              autoFocus
              required
            />
          </div>

          {quantity > 0 && (
            <div className="stock-preview">
              <div className="preview-label">New Stock Level:</div>
              <div className={`preview-value ${newQuantity < 0 ? 'negative' : ''} ${newQuantity <= product.minStockLevel ? 'warning' : ''}`}>
                {newQuantity}
                {newQuantity <= product.minStockLevel && newQuantity > 0 && (
                  <span className="warning-badge">⚠️ Below Threshold</span>
                )}
                {newQuantity < 0 && (
                  <span className="error-badge">❌ Insufficient Stock</span>
                )}
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className={operation === 'in' ? 'btn-stock-in-action' : 'btn-stock-out-action'}
              disabled={loading || (operation === 'out' && newQuantity < 0)}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Processing...
                </>
              ) : (
                operation === 'in' ? 'Add Stock' : 'Remove Stock'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StockModal;
