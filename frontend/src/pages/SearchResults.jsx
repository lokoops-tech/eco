import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { shopContext } from '../context/ShopContext';
import { Grid, List, Search, Sliders, Loader } from 'lucide-react';
import './SearchResults.css';

const SearchResultsPage = () => {
  const { all } = useContext(shopContext);
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const allProducts = Array.isArray(all) ? all : [];
  
  // Extract unique categories and brands for filters
  const categories = [...new Set(allProducts.map(product => product.category).filter(Boolean))];
  const brands = [...new Set(allProducts.map(product => product.brand).filter(Boolean))];

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const term = queryParams.get('q');
    setSearchTerm(term || '');

    if (term) {
      setIsLoading(true);
      setError('');

      // Added delay for loading state
      const loadingTimer = setTimeout(() => {
        try {
          // Make sure 'all' is an array before filtering
          const productsToFilter = Array.isArray(all) ? all : [];
          
          let filteredResults = productsToFilter.filter(product => {
            const searchValue = term.toLowerCase();
            
            // Enhanced search that checks all relevant product attributes
            return (
              // Basic fields
              product.id?.toString().includes(searchValue) ||
              product.name?.toLowerCase().includes(searchValue) ||
              product.category?.toLowerCase().includes(searchValue) ||
              product.subcategory?.toLowerCase().includes(searchValue) ||
              product.description?.toLowerCase().includes(searchValue) ||
              product.shortDescription?.toLowerCase().includes(searchValue) ||
              
              // SEO fields
              product.metaTitle?.toLowerCase().includes(searchValue) ||
              product.metaDescription?.toLowerCase().includes(searchValue) ||
              product.metaKeywords?.some(keyword => keyword.toLowerCase().includes(searchValue)) ||
              
              // Additional product details
              product.brand?.toLowerCase().includes(searchValue) ||
              product.tags?.some(tag => tag.toLowerCase().includes(searchValue)) ||
              product.sizes?.some(size => size.toLowerCase().includes(searchValue)) ||
              product.keyFeatures?.some(feature => feature.toLowerCase().includes(searchValue)) ||
              
              // Check in technical specs (key-value pairs)
              (product.technicalSpecs && 
                Object.entries(product.technicalSpecs).some(([key, value]) => 
                  key.toLowerCase().includes(searchValue) || 
                  value.toLowerCase().includes(searchValue)
                )) ||
              
              // Model information
              product.modelInfo?.modelNumber?.toLowerCase().includes(searchValue) ||
              product.modelInfo?.series?.toLowerCase().includes(searchValue) ||
              product.modelInfo?.generation?.toLowerCase().includes(searchValue) ||
              
              // Compatibility information
              product.compatibility?.some(item => 
                item.platform?.toLowerCase().includes(searchValue) ||
                item.minVersion?.toLowerCase().includes(searchValue) ||
                item.maxVersion?.toLowerCase().includes(searchValue)
              ) ||
              
              // Warranty information if it contains the search term
              product.warranty?.description?.toLowerCase().includes(searchValue)
            );
          });

          // Apply category filter if selected
          if (selectedCategories.length > 0) {
            filteredResults = filteredResults.filter(product =>
              selectedCategories.includes(product.category)
            );
          }

          // Apply brand filter if selected
          if (selectedBrands.length > 0) {
            filteredResults = filteredResults.filter(product =>
              selectedBrands.includes(product.brand)
            );
          }

          // Apply price range filter
          filteredResults = filteredResults.filter(
            product => 
              product.new_price >= priceRange.min && 
              product.new_price <= priceRange.max
          );

          // Apply sorting
          switch (sortBy) {
            case 'price-low':
              filteredResults.sort((a, b) => a.new_price - b.new_price);
              break;
            case 'price-high':
              filteredResults.sort((a, b) => b.new_price - a.new_price);
              break;
            case 'name':
              filteredResults.sort((a, b) => a.name.localeCompare(b.name));
              break;
            case 'popularity':
              filteredResults.sort((a, b) => 
                (b.metadata?.popularityScore || 0) - (a.metadata?.popularityScore || 0)
              );
              break;
            case 'rating':
              filteredResults.sort((a, b) => 
                (b.ratings?.average || 0) - (a.ratings?.average || 0)
              );
              break;
            case 'newest':
              filteredResults.sort((a, b) => new Date(b.date) - new Date(a.date));
              break;
            default: // relevance - no additional sorting needed
              break;
          }

          if (filteredResults.length === 0) {
            setError('No products found. Try different search terms or filters.');
          }

          setSearchResults(filteredResults);
        } catch (err) {
          console.error("Error processing search results:", err);
          setError('An error occurred while searching. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }, 2000); // 2 second delay for loading state

      // Cleanup timer on component unmount or when dependencies change
      return () => clearTimeout(loadingTimer);
    }
  }, [location.search, all, sortBy, priceRange, selectedCategories, selectedBrands]);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 800) {
        setFiltersOpen(true);
      } else {
        setFiltersOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Call once on mount
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calculateDiscount = (oldPrice, newPrice) => {
    if (!oldPrice || !newPrice) return 0;
    return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
  };

  return (
    <div className="search-page">
      <div className="search-page__header">
        <div>
          <h2 className="search-page__title">
            Search results for <span className="search-page__term">"{searchTerm}"</span>
            {!isLoading && !error && (
              <div className="search-page__count">
                {searchResults.length} {searchResults.length === 1 ? 'product' : 'products'} found
              </div>
            )}
          </h2>
        </div>
        <div className="search-page__controls">
          <div className="search-page__view-buttons">
            <button
              onClick={() => setViewMode('grid')}
              className={`search-page__view-button ${viewMode === 'grid' ? 'search-page__view-button--active' : ''}`}
            >
              <Grid />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`search-page__view-button ${viewMode === 'list' ? 'search-page__view-button--active' : ''}`}
            >
              <List />
            </button>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="search-page__sort-select"
          >
            <option value="relevance">Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name (A-Z)</option>
            <option value="popularity">Popularity</option>
            <option value="rating">Best Rating</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>
      {window.innerWidth <= 800 && (
        <button 
          className="search-page__filter-toggle" 
          onClick={() => setFiltersOpen(prev => !prev)}
        >
          <Sliders className="search-page__filter-icon" /> 
          {filtersOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
      )}
      <div className="search-page__layout">
        <div className={`search-page__sidebar ${filtersOpen ? 'search-page__sidebar--open' : ''}`}>
          <div className="search-filters">
            <h3 className="search-filters__title">
              <Sliders className="search-filters__icon" /> Filters
            </h3>
            
            {/* Price Range Filter */}
            <div className="search-filters__section">
              <h4 className="search-filters__section-title">Price Range</h4>
              <div className="search-filters__price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  className="search-filters__price-input"
                  onChange={(e) => setPriceRange(prev => ({
                    ...prev,
                    min: Number(e.target.value) || 0
                  }))}
                />
                <span className="search-filters__price-separator">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="search-filters__price-input"
                  onChange={(e) => setPriceRange(prev => ({
                    ...prev,
                    max: Number(e.target.value) || Infinity
                  }))}
                />
              </div>
            </div>
            
            {/* Brand Filter */}
            <div className="search-filters__section">
              <h4 className="search-filters__section-title">Brands</h4>
              <div className="search-filters__options">
                {brands.slice(0, 10).map(brand => (
                  <label key={brand} className="search-filters__option">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBrands(prev => [...prev, brand]);
                        } else {
                          setSelectedBrands(prev => 
                            prev.filter(b => b !== brand)
                          );
                        }
                      }}
                      className="search-filters__checkbox"
                    />
                    <span className="search-filters__option-label">{brand}</span>
                  </label>
                ))}
                {brands.length > 10 && (
                  <div className="search-filters__more-options">+ {brands.length - 10} more brands</div>
                )}
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="search-filters__section">
              <h4 className="search-filters__section-title">Categories</h4>
              <div className="search-filters__options">
                {categories.map(category => (
                  <label key={category} className="search-filters__option">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories(prev => [...prev, category]);
                        } else {
                          setSelectedCategories(prev => 
                            prev.filter(cat => cat !== category)
                          );
                        }
                      }}
                      className="search-filters__checkbox"
                    />
                    <span className="search-filters__option-label">{category}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Clear Filters Button */}
            {(selectedCategories.length > 0 || selectedBrands.length > 0 || 
              priceRange.min > 0 || priceRange.max < Infinity) && (
              <button 
                className="search-filters__clear-btn"
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedBrands([]);
                  setPriceRange({ min: 0, max: Infinity });
                }}
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        <div className="search-page__results">
          {isLoading ? (
            <div className="search-page__loading">
              <div className="search-page__loading-content">
                <Loader className="search-page__loading-icon" />
                <span className="search-page__loading-text">Loading results...</span>
              </div>
            </div>
          ) : error ? (
            <div className="search-page__error">
              {error}
            </div>
          ) : (
            <div className={`search-page__products search-page__products--${viewMode}`}>
              {searchResults.map((product) => {
                const discount = calculateDiscount(product.old_price, product.new_price);
                return (
                  <div className="product-card" key={product.id}>
                    <Link to={`/product/${product.name}-${product.id}`} className="product-card__link" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="product-card__image-container">
                        {discount > 0 && (
                          <div className="product-card__discount">
                            -{discount}%
                          </div>
                        )}
                        <img
                          className="product-card__image"
                          src={product.image || "/api/placeholder/400/300"}
                          alt={product.name}
                        />
                      </div>
                      <div className="product-card__details">
                      <h3 className="product-card__name">{product.name}</h3>
                      
                      {/* Rating display */}
                      {product.ratings && product.ratings.average > 0 && (
                        <div className="product-card__rating">
                          {'★'.repeat(Math.round(product.ratings.average))}
                          {'☆'.repeat(5 - Math.round(product.ratings.average))}
                          <span className="product-card__rating-count">({product.ratings.count})</span>
                        </div>
                      )}
                      
                      {/* Price display */}
                      <div className="product-card__price">
                        <span className="product-card__current-price">
                          {product.currency || 'KSH'} {product.new_price}
                        </span>
                        {product.old_price && (
                          <span className="product-card__old-price">
                            {product.currency || 'KSH'} {product.old_price}
                          </span>
                        )}
                      </div>
                      
                      {/* Stock status indicator */}
                      {product.stockStatus && (
                        <div className={`product-card__stock product-card__stock--${product.stockStatus.toLowerCase()}`}>
                          <span className='product-card__stock-dot'>.</span>
                          {product.stockStatus === 'IN_STOCK' ? 'In Stock' : 'Out of Stock'}
                        </div>
                      )}
                    </div>
                    </Link>
                   
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;