import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './MyPocket.css';

const API_BASE_URL = "https://gich-backend.onrender.com"; // ✅ Fixed URL format

const MyPocket = () => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('discount');
  const [priceError, setPriceError] = useState('');

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'phone-accessories', name: 'Phone Accessories' },
    { id: 'watch', name: 'Watches' },
    { id: 'fridge', name: 'Fridges' },
    { id: 'pc-computer-products', name: 'PC & Computer Products' },
    { id: 'tv-appliances', name: 'TV & Appliances' },
    { id: 'woofers', name: 'Woofers' },
    { id: 'kitchen-appliances', name: 'Kitchen Appliances' },
    { id: 'groomings', name: 'Grooming' },
    { id: 'earpods', name: 'Earpods' },
    { id: 'electricals', name: 'Electricals' }
  ];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scrolling

  const sortOptions = [
    { value: 'discount', label: 'Highest Discount' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A to Z' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    validatePrices();
  }, [minPrice, maxPrice]);

  const validatePrices = () => {
    setPriceError('');
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    if (minPrice && maxPrice) {
      if (min > max) {
        setPriceError('Minimum price cannot be greater than maximum price');
      } else if (min < 0 || max < 0) {
        setPriceError('Prices cannot be negative');
      }
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/product/allproducts`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      const productsData = Array.isArray(data)
        ? data
        : Array.isArray(data.products)
        ? data.products
        : [];

      setProducts(productsData);
      setError(null);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (value, setPriceFunction) => {
    const numberValue = value.replace(/[^0-9]/g, '');
    setPriceFunction(numberValue);
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedCategory('all');
    setSortBy('discount');
    setPriceError('');
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (minPrice !== '' || maxPrice !== '') {
      const min = minPrice === '' ? 0 : parseFloat(minPrice);
      const max = maxPrice === '' ? Infinity : parseFloat(maxPrice);
      filtered = filtered.filter(product => product.new_price >= min && product.new_price <= max);
    }

    switch (sortBy) {
      case 'price-low':
        return [...filtered].sort((a, b) => a.new_price - b.new_price);
      case 'price-high':
        return [...filtered].sort((a, b) => b.new_price - a.new_price);
      case 'name':
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      case 'discount':
      default:
        return [...filtered].sort((a, b) => {
          const discountA = a.old_price ? ((a.old_price - a.new_price) / a.old_price) * 100 : 0;
          const discountB = b.old_price ? ((b.old_price - b.new_price) / b.old_price) * 100 : 0;
          return discountB - discountA;
        });
    }
  }, [products, selectedCategory, minPrice, maxPrice, sortBy]);

  const renderProduct = (item) => {
    const discount = item.old_price
      ? Math.round(((item.old_price - item.new_price) / item.old_price) * 100)
      : 0;

    return (
      <div key={item.id} className="shop-product-wrapper">
        <div className="shop-product-card">
          {discount > 0 && <div className="shop-discount-badge">-{discount}%</div>}
          <Link to={`/product/${item.name}-${encodeURIComponent(item.id)}`} className="shop-product-link" style={{ textDecoration: "none", color: 'inherit' }}>
            <img
              src={item.image || "/api/placeholder/400/300"}
              alt={item.name}
              className="shop-product-thumbnail"
              onClick={scrollToTop} 
            />
            <div className="shop-product-info">
              <h3 className="shop-product-title">{item.name}</h3>
              <div className="shop-product-category">{item.category}</div>
              <div className="shop-price-wrapper">
                <span className="shop-price-current">Ksh {item.new_price.toLocaleString()}</span>
                {item.old_price && (
                  <span className="shop-price-original">Ksh {item.old_price.toLocaleString()}</span>
                )}
              </div>
            </div>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="shop-container">
      <header className="shop-header">
        <h1 className="shop-main-title">Smart Shopping with GichTech</h1>
        <p className="shop-subtitle">Find the best value products within your budget range</p>
      </header>

      <div className="shop-filter-section">
        <div className="shop-price-filter">
          <label className="shop-filter-label">Price Range (Ksh)</label>
          <div className="shop-price-inputs">
            <input
              type="text"
              value={minPrice}
              onChange={(e) => handlePriceChange(e.target.value, setMinPrice)}
              placeholder="Min price"
              className={`shop-price-input ${priceError ? 'shop-input-error' : ''}`}
            />
            <span className="shop-price-divider">-</span>
            <input
              type="text"
              value={maxPrice}
              onChange={(e) => handlePriceChange(e.target.value, setMaxPrice)}
              placeholder="Max price"
              className={`shop-price-input ${priceError ? 'shop-input-error' : ''}`}
            />
          </div>
          {priceError && <div className="shop-error-text">{priceError}</div>}
        </div>

        <div className="shop-category-filter">
          <label className="shop-filter-label">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="shop-select-input"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="shop-sort-filter">
          <label className="shop-filter-label">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="shop-select-input"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button onClick={clearFilters} className="shop-clear-button">
          Clear Filters
        </button>
      </div>

      {loading ? (
        <div className="shop-loading">
          <div className="shop-spinner"></div>
          <p className="shop-loading-text">Loading products...</p>
        </div>
      ) : error ? (
        <div className="shop-error-message">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="shop-results-count">
            Found {filteredProducts.length} products
          </div>

          <div className="shop-products-grid">
            {filteredProducts.map(renderProduct)}

            {filteredProducts.length === 0 && (
              <div className="shop-empty-state">
                <p className="shop-empty-text">
                  {(minPrice || maxPrice)
                    ? `No products found within price range Ksh ${minPrice || '0'} - ${maxPrice || '∞'}` 
                    : 'No products found in this category'}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      <footer className="shop-footer">
        <p className="shop-footer-text">
          Products are sorted by {sortOptions.find(opt => opt.value === sortBy)?.label.toLowerCase()}
        </p>
      </footer>
    </div>
  );
};

export default MyPocket;
