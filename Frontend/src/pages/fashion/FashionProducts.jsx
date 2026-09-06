import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shirt,
  Search,
  SlidersHorizontal,
  PlusCircle,
  Package,
  Filter,
  X,
  Tag,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import StatusBadge from '../../components/ui/StatusBadge';
import axiosInstance from '../../utils/axiosConfig';
import { getUserRole } from '../../services/authService';

function FashionProducts() {
  const navigate = useNavigate();
  const userRole = getUserRole();
  const isAdmin = userRole === 'ADMIN';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSeason, setSelectedSeason] = useState('ALL');
  const [selectedGender, setSelectedGender] = useState('ALL');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { key: 'ALL', label: 'All Categories' },
    { key: 'CLOTHING_MENS', label: "Men's Apparel" },
    { key: 'CLOTHING_WOMENS', label: "Women's Collection" },
    { key: 'CLOTHING_KIDS', label: "Kids' Collection" },
    { key: 'FOOTWEAR_MENS', label: "Men's Footwear" },
    { key: 'FOOTWEAR_WOMENS', label: "Women's Footwear" },
    { key: 'FOOTWEAR_KIDS', label: "Kids' Footwear" },
    { key: 'ACCESSORIES_BAGS', label: 'Bags & Purses' },
    { key: 'ACCESSORIES_JEWELRY', label: 'Jewelry' },
    { key: 'ACCESSORIES_WATCHES', label: 'Watches' },
    { key: 'ACCESSORIES_SUNGLASSES', label: 'Eyewear' },
  ];

  const seasons = ['ALL', 'SPRING', 'SUMMER', 'AUTUMN', 'WINTER', 'ALL_SEASON'];
  const genders = ['ALL', 'MALE', 'FEMALE', 'UNISEX', 'KIDS'];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/fashion-products');
      setProducts(res.data || []);
    } catch (err) {
      console.error('Error fetching fashion catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchTerm.trim() ||
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSeason = selectedSeason === 'ALL' || p.season === selectedSeason;
    const matchesGender = selectedGender === 'ALL' || p.targetGender === selectedGender;

    return matchesSearch && matchesCategory && matchesSeason && matchesGender;
  });

  const clearFilters = () => {
    setSelectedCategory('ALL');
    setSelectedSeason('ALL');
    setSelectedGender('ALL');
    setSearchTerm('');
  };

  return (
    <AppLayout
      title="Fashion Catalog"
      subtitle="Smart Fashion Retail Cloud • Apparel & Footwear Inventory Matrix"
    >
      <div className="space-y-6">
        {/* Top Control Bar: Search & Action Buttons */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by product name, brand, SKU code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all shadow-2xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                showFilters || selectedCategory !== 'ALL' || selectedSeason !== 'ALL'
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {(selectedCategory !== 'ALL' || selectedSeason !== 'ALL' || selectedGender !== 'ALL') && (
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
              )}
            </button>

            {isAdmin && (
              <button
                onClick={() => navigate('/admin/fashion/add')}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all active:scale-[0.99]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Fashion Item</span>
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Filter Bar */}
        {showFilters && (
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-display flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-indigo-600" /> Filter Catalog
              </span>
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Select */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase text-slate-600 tracking-wider">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
                >
                  {categories.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Season Select */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase text-slate-600 tracking-wider">
                  Collection Season
                </label>
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
                >
                  {seasons.map((s) => (
                    <option key={s} value={s}>
                      {s.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender Select */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase text-slate-600 tracking-wider">
                  Target Demographic
                </label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
                >
                  {genders.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter Pills Quick Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.slice(0, 7).map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === c.key
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Loading fashion catalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3 cloud-card p-8">
            <Package className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold font-display text-slate-900">No Fashion Pieces Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
              No products match your active search or filter parameters. Reset filters to view all products.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-all border border-slate-200"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product) => {
              const totalVariants = product.variants?.length || 0;
              const totalStock = (product.variants || []).reduce((acc, v) => acc + (v.quantity || 0), 0);

              return (
                <div
                  key={product.id}
                  onClick={() => navigate(`/fashion/product/${product.id}`)}
                  className="cloud-card cloud-card-hover cursor-pointer flex flex-col justify-between overflow-hidden group"
                >
                  {/* Card Header & Artwork */}
                  <div>
                    <div className="relative h-44 bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/40 flex items-center justify-center border-b border-slate-100">
                      <Shirt className="w-16 h-16 text-indigo-300 group-hover:text-indigo-600 group-hover:scale-105 transition-all duration-200" />

                      {/* Top Status & Season Pills */}
                      <div className="absolute top-3 left-3">
                        <StatusBadge
                          status={product.outOfStock ? 'Out of Stock' : product.lowStock ? 'Low Stock' : 'In Stock'}
                        />
                      </div>

                      {product.season && (
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/90 border border-slate-200 text-[10px] font-bold text-slate-600 shadow-2xs">
                          {product.season.replace('_', ' ')}
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-5 space-y-2.5">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 font-display">
                          {product.brand || 'Atelier'}
                        </p>
                        <h4 className="text-base font-bold font-display text-slate-900 mt-0.5 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{product.sku || 'SKU-00' + product.id}</p>
                      </div>

                      {product.material && (
                        <p className="text-xs text-slate-500 line-clamp-1 flex items-center gap-1 font-medium">
                          <Tag className="w-3 h-3 text-slate-400" />
                          <span>{product.material}</span>
                        </p>
                      )}

                      {/* Variant Pills Preview */}
                      <div className="flex flex-wrap items-center gap-1 pt-1">
                        {(product.variants || []).slice(0, 4).map((v, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-50 border border-slate-200 text-slate-700"
                          >
                            {v.size} • {v.color}
                          </span>
                        ))}
                        {totalVariants > 4 && (
                          <span className="text-[10px] text-slate-400 font-semibold pl-0.5">
                            +{totalVariants - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Price & Stock Summary */}
                  <div className="p-5 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wide">
                        Base Price
                      </span>
                      <span className="text-base font-bold font-mono text-slate-900">
                        ₹{Number(product.basePrice || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wide">
                        Floor Stock
                      </span>
                      <span
                        className={`text-xs font-bold font-mono ${
                          totalStock === 0 ? 'text-rose-600' : totalStock < 10 ? 'text-amber-600' : 'text-emerald-600'
                        }`}
                      >
                        {totalStock} Units
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default FashionProducts;