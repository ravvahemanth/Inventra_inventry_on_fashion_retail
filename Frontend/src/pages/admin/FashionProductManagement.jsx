import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRole } from '../../services/authService';
import axiosInstance from '../../utils/axiosConfig';
import '../Dashboard/Dashboard.css';

function FashionProductManagement() {
  const navigate = useNavigate();
  const userRole = getUserRole();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'CLOTHING_MENS',
    brand: '',
    basePrice: '',
    season: 'ALL_SEASON',
    targetGender: 'UNISEX',
    material: '',
    careInstructions: '',
    variants: [
      {
        size: 'M',
        color: 'BLACK',
        quantity: 0,
        minStockLevel: 5,
        priceAdjustment: 0
      }
    ]
  });

  const categories = [
    { value: 'CLOTHING_MENS', label: "Men's Clothing" },
    { value: 'CLOTHING_WOMENS', label: "Women's Clothing" },
    { value: 'CLOTHING_KIDS', label: "Kids' Clothing" },
    { value: 'FOOTWEAR_MENS', label: "Men's Footwear" },
    { value: 'FOOTWEAR_WOMENS', label: "Women's Footwear" },
    { value: 'FOOTWEAR_KIDS', label: "Kids' Footwear" },
    { value: 'ACCESSORIES_BAGS', label: 'Bags & Purses' },
    { value: 'ACCESSORIES_JEWELRY', label: 'Jewelry' },
    { value: 'ACCESSORIES_WATCHES', label: 'Watches' },
    { value: 'ACCESSORIES_BELTS', label: 'Belts' },
    { value: 'ACCESSORIES_HATS', label: 'Hats & Caps' },
    { value: 'ACCESSORIES_SUNGLASSES', label: 'Sunglasses' }
  ];

  const seasons = [
    { value: 'SPRING', label: 'Spring' },
    { value: 'SUMMER', label: 'Summer' },
    { value: 'AUTUMN', label: 'Autumn' },
    { value: 'WINTER', label: 'Winter' },
    { value: 'ALL_SEASON', label: 'All Season' }
  ];

  const genders = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'UNISEX', label: 'Unisex' },
    { value: 'KIDS', label: 'Kids' }
  ];

  const sizes = [
    { value: 'XS', label: 'XS' },
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: 'XXL', label: 'XXL' },
    { value: 'XXXL', label: 'XXXL' }
  ];

  const colors = [
    { value: 'BLACK', label: 'Black' },
    { value: 'WHITE', label: 'White' },
    { value: 'RED', label: 'Red' },
    { value: 'BLUE', label: 'Blue' },
    { value: 'GREEN', label: 'Green' },
    { value: 'YELLOW', label: 'Yellow' },
    { value: 'PINK', label: 'Pink' },
    { value: 'PURPLE', label: 'Purple' },
    { value: 'ORANGE', label: 'Orange' },
    { value: 'BROWN', label: 'Brown' },
    { value: 'GRAY', label: 'Gray' },
    { value: 'NAVY', label: 'Navy' }
  ];

  useEffect(() => {
    if (userRole !== 'ADMIN' && userRole !== 'MANAGER') {
      navigate('/dashboard');
    }
  }, [userRole, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      variants: updatedVariants
    }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          size: 'M',
          color: 'BLACK',
          quantity: 0,
          minStockLevel: 5,
          priceAdjustment: 0
        }
      ]
    }));
  };

  const removeVariant = (index) => {
    if (formData.variants.length > 1) {
      const updatedVariants = formData.variants.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        variants: updatedVariants
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        basePrice: parseFloat(formData.basePrice),
        variants: formData.variants.map(variant => ({
          ...variant,
          quantity: parseInt(variant.quantity),
          minStockLevel: parseInt(variant.minStockLevel),
          priceAdjustment: parseFloat(variant.priceAdjustment)
        }))
      };

      await axiosInstance.post('/fashion-products', payload);
      alert('✅ Fashion product created successfully!');
      navigate('/fashion');
    } catch (error) {
      console.error('Error creating fashion product:', error);
      alert('❌ Failed to create fashion product: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="main-content">
        <div className="topbar">
          <div className="topbar-left">
            <button className="back-btn" onClick={() => navigate('/fashion')}>
              ← Back to Collection
            </button>
            <div className="page-title-dash">
              <h1>➕ Add Fashion Product</h1>
              <p className="topbar-subtitle">Create new fashion items for your collection</p>
            </div>
          </div>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="fashion-product-form">
            {/* Basic Information */}
            <div className="form-section">
              <h3>📝 Basic Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Premium Cotton T-Shirt"
                  />
                </div>

                <div className="form-group">
                  <label>Brand *</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Nike, Adidas, Zara"
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Base Price (₹) *</label>
                  <input
                    type="number"
                    name="basePrice"
                    value={formData.basePrice}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="999.00"
                  />
                </div>

                <div className="form-group">
                  <label>Season</label>
                  <select
                    name="season"
                    value={formData.season}
                    onChange={handleInputChange}
                  >
                    {seasons.map(season => (
                      <option key={season.value} value={season.value}>
                        {season.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Target Gender</label>
                  <select
                    name="targetGender"
                    value={formData.targetGender}
                    onChange={handleInputChange}
                  >
                    {genders.map(gender => (
                      <option key={gender.value} value={gender.value}>
                        {gender.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Describe the product features, style, and benefits..."
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Material</label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    placeholder="e.g., 100% Cotton, Polyester Blend"
                  />
                </div>

                <div className="form-group">
                  <label>Care Instructions</label>
                  <input
                    type="text"
                    name="careInstructions"
                    value={formData.careInstructions}
                    onChange={handleInputChange}
                    placeholder="e.g., Machine wash cold, Tumble dry low"
                  />
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="form-section">
              <div className="section-header">
                <h3>🎨 Product Variants (Size & Color)</h3>
                <button type="button" onClick={addVariant} className="add-variant-btn">
                  ➕ Add Variant
                </button>
              </div>

              {formData.variants.map((variant, index) => (
                <div key={index} className="variant-card">
                  <div className="variant-header">
                    <h4>Variant {index + 1}</h4>
                    {formData.variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="remove-variant-btn"
                      >
                        🗑️ Remove
                      </button>
                    )}
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Size</label>
                      <select
                        value={variant.size}
                        onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                      >
                        {sizes.map(size => (
                          <option key={size.value} value={size.value}>
                            {size.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Color</label>
                      <select
                        value={variant.color}
                        onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                      >
                        {colors.map(color => (
                          <option key={color.value} value={color.value}>
                            {color.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Initial Stock</label>
                      <input
                        type="number"
                        value={variant.quantity}
                        onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)}
                        min="0"
                        placeholder="50"
                      />
                    </div>

                    <div className="form-group">
                      <label>Min Stock Level</label>
                      <input
                        type="number"
                        value={variant.minStockLevel}
                        onChange={(e) => handleVariantChange(index, 'minStockLevel', e.target.value)}
                        min="0"
                        placeholder="5"
                      />
                    </div>

                    <div className="form-group">
                      <label>Price Adjustment (₹)</label>
                      <input
                        type="number"
                        value={variant.priceAdjustment}
                        onChange={(e) => handleVariantChange(index, 'priceAdjustment', e.target.value)}
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit */}
            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/fashion')}
                className="cancel-btn"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? '⏳ Creating...' : '✅ Create Fashion Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FashionProductManagement;