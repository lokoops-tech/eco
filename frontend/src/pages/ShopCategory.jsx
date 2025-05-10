import React, { useState, useContext, useEffect } from "react";
import { ArrowUpDown, ArrowDownUp, SortAsc, ShoppingCart, LogIn, AlertCircle } from "lucide-react";
import { shopContext } from "../context/ShopContext";
import Item from "../components/item/Item.jsx";
import { Link, useNavigate } from "react-router-dom";
import watch from '../Assets/watch.png';
import phone from '../Assets/ph.png';
import fridge from '../Assets/fridge.png';
import electric from '../Assets/electricals.png';
import laptops from '../Assets/laptops.png';
import speaker from '../Assets/speaker.png';
import kitchen from '../Assets/kitchen-appliances.png';
import groom from '../Assets/grooming.png';
import tv from '../Assets/tv0.png';
import ear from '../Assets/earpods.png';
import '../pages/css/Shop_category.css';
import SEO from "./Seo.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { categoryBrands } from "../../Seo.js";

// Toast configuration
const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true
};



const ShopCategory = ({ category, subcategory }) => {
    const { 
        allProducts = [], 
        filteredProducts = [], 
        filterByCategory, 
        filterBySubcategory, 
        cartState = {},
        cart = {},
        addToCart, 
        updateCartItemQuantity,
        removeFromCart,
        error,
        clearCartError,
        isLoading = false,
        isAuthenticated = false,
        userProfile = {},
        cartTotal = 0,
        cartItemCount = 0
    } = useContext(shopContext) || {}; // Default to empty object if context is undefined

    const navigate = useNavigate();
    const [sortOption, setSortOption] = useState("default");
    const [visibleCount, setVisibleCount] = useState(12);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
    const [displayProducts, setDisplayProducts] = useState([]);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [hoveredProductId, setHoveredProductId] = useState(null);
    const [addingToCart, setAddingToCart] = useState({});
    const [authToken, setAuthToken] = useState(null);

    const categoryBanners = {
        "phone-accessories": phone,
        "pc-computer-products": laptops,
        "fridge": fridge,
        "tv-appliances": tv,
        "woofers": speaker,
        "kitchen-appliances": kitchen,
        "watch": watch,
        "groomings": groom,
        "earpods": ear,
        "electricals": electric
    };

    // Check for authentication token on component mount and when localStorage changes
    useEffect(() => {
        const token = localStorage.getItem("auth-token");
        setAuthToken(token);
        
        // Listen for storage events (when token is added or removed in another tab)
        const handleStorageChange = () => {
            const newToken = localStorage.getItem("auth-token");
            setAuthToken(newToken);
        };
        
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Improved Add to Cart handler with JWT token validation
    const handleAddToCart = async (productId) => {
        try {
            // Check for auth token directly from localStorage for freshest state
            const token = localStorage.getItem("auth-token");
            
            if (!token) {
                toast.warning("Please log in to add items to your cart", toastConfig);
                navigate("/login", { state: { from: window.location.pathname } });
                return;
            }

            setAddingToCart(prev => ({ ...prev, [productId]: true }));
            
            // Check if product is in stock
            const product = allProducts && allProducts.find?.(p => p && p.id === productId);
            if (product?.stockStatus === 'OUT_OF_STOCK') {
                toast.error("This product is out of stock", toastConfig);
                return;
            }

            // Pass the token to addToCart if needed
            if (typeof addToCart === 'function') {
                await addToCart(productId, 1);
                toast.success("Added to cart successfully", toastConfig);
            } else {
                throw new Error("Add to cart functionality is unavailable");
            }
        } catch (err) {
            if (err.message === "Authentication required") {
                // Handle auth errors specially
                toast.error("Please log in to continue", {
                    ...toastConfig,
                    onClick: () => navigate("/login", { state: { from: window.location.pathname } })
                });
            } else {
                toast.error(err?.response?.data?.message || err?.message || "Failed to add item to cart", toastConfig);
            }
        } finally {
            setAddingToCart(prev => ({ ...prev, [productId]: false }));
        }
    };

    // Handle quantity update with authentication check
    const handleUpdateQuantity = async (productId, newQuantity) => {
        try {
            const token = localStorage.getItem("auth-token");
            
            if (!token) {
                toast.warning("Please log in to update your cart", toastConfig);
                navigate("/login", { state: { from: window.location.pathname } });
                return;
            }

            setAddingToCart(prev => ({ ...prev, [productId]: true }));
            
            if (newQuantity <= 0) {
                if (typeof removeFromCart === 'function') {
                    await removeFromCart(productId);
                    toast.success("Item removed from cart", toastConfig);
                }
            } else {
                if (typeof updateCartItemQuantity === 'function') {
                    await updateCartItemQuantity(productId, newQuantity);
                    toast.success("Cart updated", toastConfig);
                }
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || err?.message || "Failed to update cart", toastConfig);
        } finally {
            setAddingToCart(prev => ({ ...prev, [productId]: false }));
        }
    };

    // Handle remove from cart with authentication check
    const handleRemoveFromCart = async (productId) => {
        try {
            const token = localStorage.getItem("auth-token");
            
            if (!token) {
                toast.warning("Please log in to manage your cart", toastConfig);
                navigate("/login", { state: { from: window.location.pathname } });
                return;
            }

            setAddingToCart(prev => ({ ...prev, [productId]: true }));
            
            if (typeof removeFromCart === 'function') {
                await removeFromCart(productId);
                toast.success("Item removed from cart", toastConfig);
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || err?.message || "Failed to remove item", toastConfig);
        } finally {
            setAddingToCart(prev => ({ ...prev, [productId]: false }));
        }
    };

    // Simplified cart state checking - FIX: Safely handle potential undefined values
    const isInCart = (productId) => {
        // Get items array safely
        let items = [];
        
        if (cartState && Array.isArray(cartState.items)) {
            items = cartState.items;
        } else if (cart && Array.isArray(cart.items)) {
            items = cart.items;
        } else if (Array.isArray(cartState)) {
            items = cartState;
        } else if (Array.isArray(cart)) {
            items = cart;
        }
        
        // Now safely check if product is in cart
        return productId && items.some(item => 
            item && (item.product_id === productId || item.id === productId)
        );
    };
    
    const getItemQuantity = (productId) => {
        // Get items array safely
        let items = [];
        
        if (cartState && Array.isArray(cartState.items)) {
            items = cartState.items;
        } else if (cart && Array.isArray(cart.items)) {
            items = cart.items;
        } else if (Array.isArray(cartState)) {
            items = cartState;
        } else if (Array.isArray(cart)) {
            items = cart;
        }
        
        // Now safely find the item
        const item = productId && items.find(item => 
            item && (item.product_id === productId || item.id === productId)
        );
        
        return item?.quantity || 0;
    };
   
    // Clear cart errors on unmount
    useEffect(() => {
        return () => {
            if (typeof clearCartError === 'function') {
                clearCartError();
            }
        };
    }, [clearCartError]);

    // Display error notifications
    useEffect(() => {
        if (error) {
            toast.error(error?.response?.data?.message || error.message || "An error occurred", toastConfig);
            if (typeof clearCartError === 'function') {
                clearCartError();
            }
        }
    }, [error, clearCartError]);

    // Get available brands for the current category - FIX: Handle potential undefined values
    const getAvailableBrands = () => {
        if (category && categoryBrands && categoryBrands[category]) {
            return Object.keys(categoryBrands[category]) || [];
        }
        return [];
    };

    // Convert backend brand name to display name - FIX: Handle potential undefined values
    const getDisplayBrand = (backendBrand) => {
        if (!backendBrand || !category || !categoryBrands || !categoryBrands[category]) {
            return backendBrand || '';
        }
        
        // Safely access categoryBrands
        const brandEntries = Object.entries(categoryBrands[category] || {});
        const displayBrand = brandEntries.find(
            ([display, lower]) => lower === backendBrand.toLowerCase()
        );
        
        return displayBrand ? displayBrand[0] : (backendBrand || '');
    };

    // Convert display brand to backend brand - FIX: Handle potential undefined values
    const getBackendBrand = (displayBrand) => {
        if (!displayBrand || !category || !categoryBrands || !categoryBrands[category]) {
            return '';
        }
        return categoryBrands[category]?.[displayBrand]?.toLowerCase() || displayBrand.toLowerCase();
    };

    // Initial category/subcategory filter
    useEffect(() => {
        if (subcategory && typeof filterBySubcategory === 'function') {
            filterBySubcategory(subcategory);
        } else if (category && typeof filterByCategory === 'function') {
            filterByCategory(category);
        }
        setSelectedBrands([]);
    }, [category, subcategory, filterByCategory, filterBySubcategory]);

    // Handle filtering and display products - FIX: Handle potential undefined values
    useEffect(() => {
        // Make sure we have an array of products to work with
        const productsToProcess = Array.isArray(filteredProducts) ? [...filteredProducts] : [];
        let productsToDisplay = productsToProcess;

        // Filter by selected brands if any are selected
        if (selectedBrands && selectedBrands.length > 0) {
            productsToDisplay = productsToDisplay.filter(product => 
                product && product.brand && selectedBrands.some(displayBrand => {
                    return getBackendBrand(displayBrand) === product.brand.toLowerCase();
                })
            );
        }

        // Filter by price range
        if (priceRange) {
            productsToDisplay = productsToDisplay.filter(product => {
                const productPrice = product?.new_price || 0;
                return productPrice >= priceRange.min && productPrice <= priceRange.max;
            });
        }

        setDisplayProducts(productsToDisplay);
    }, [selectedBrands, priceRange, filteredProducts]);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleFilter = () => {
        setIsFilterVisible(!isFilterVisible);
    };

    const handleSortChange = (option) => {
        setSortOption(option);
        setVisibleCount(12);
    };

    const handleBrandChange = (displayBrand) => {
        setSelectedBrands(prev => 
            prev.includes(displayBrand)
                ? prev.filter(b => b !== displayBrand)
                : [...prev, displayBrand]
        );
    };

    const handlePriceChange = (e) => {
        const value = Number(e.target.value);
        setPriceChange(prev => ({
            ...prev,
            [e.target.name]: value >= 0 ? value : 0
        }));
    };

    // Sort products - FIX: Handle potential undefined values
    const sortedProducts = Array.isArray(displayProducts) ? [...displayProducts].sort((a, b) => {
        if (!a || !b) return 0;
        
        switch(sortOption) {
            case "priceLowToHigh":
                return (a.new_price || 0) - (b.new_price || 0);
            case "priceHighToLow":
                return (b.new_price || 0) - (a.new_price || 0);
            case "alphabetical":
                return (a.name || '').localeCompare(b.name || '');
            default:
                return 0;
        }
    }) : [];

    // Prepare category data for SEO - FIX: Handle potential undefined values
    const categoryData = {
        name: category ? category.replace(/-/g, ' ') : '',
        slug: category || '',
        subcategories: getAvailableBrands(),
        image: (category && categoryBanners[category]) || 'https://yourstore.com/default-category-image.jpg'
    };

    // Determine if the user is authenticated based on local storage token
    const checkIsAuthenticated = () => {
        return !!localStorage.getItem("auth-token");
    };

    // Fix: Corrected the setPriceRange function name
    const setPriceChange = (newValues) => {
        setPriceRange(newValues);
    };

    return (
        <div className="shop-container">
            {/* Toast notifications */}
            <ToastContainer position="top-right" autoClose={3000} />
            
            {/* Add the SEO component */}
            <SEO category={categoryData} />

            {category && categoryBanners[category] && (
                <div className="category-banner">
                    <img 
                        src={categoryBanners[category]} 
                        alt={`${category} banner`} 
                        className="banner-image"
                    />
                </div>
            )}

            <div className="breadcrumbs">
                <Link to="/">Home</Link>
                <span> / </span>
                <Link to={`/${category}`}>{category ? category.replace(/-/g, ' ') : ''}</Link>
                {subcategory && (
                    <>
                        <span> / </span>
                        <span>{subcategory.replace(/-/g, ' ')}</span>
                    </>
                )}
            </div>

            {!checkIsAuthenticated() && (
                <div className="login-prompt">
                    <LogIn size={18} />
                    <p>Please <Link to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`} className="login-link">log in</Link> to add items to your cart</p>
                </div>
            )}

            <div className="shop-content">
                {windowWidth < 800 && (
                    <button className="filter-toggle" onClick={toggleFilter}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="4" y1="21" x2="4" y2="14"></line>
                            <line x1="4" y1="10" x2="4" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12" y2="3"></line>
                            <line x1="20" y1="21" x2="20" y2="16"></line>
                            <line x1="20" y1="12" x2="20" y2="3"></line>
                            <line x1="1" y1="14" x2="7" y2="14"></line>
                            <line x1="9" y1="8" x2="15" y2="8"></line>
                            <line x1="17" y1="16" x2="23" y2="16"></line>
                        </svg>
                    </button>
                )}

                {(windowWidth >= 800 || isFilterVisible) && (
                    <aside className="filters-sidebar">
                        <div className="filter-section">
                            <h4>Brands ({getAvailableBrands().length})</h4>
                            <div className="brand-list">
                                {getAvailableBrands().map(displayBrand => (
                                    <label key={displayBrand} className="brand-checkbox">
                                        <input
                                            type="checkbox"
                                            value={displayBrand}
                                            checked={selectedBrands.includes(displayBrand)}
                                            onChange={() => handleBrandChange(displayBrand)}
                                        />
                                        <span>{displayBrand}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="sort-bar">
                            <div className="sort-controls">
                                <span>Sort by:</span>
                                <div className="sort-buttons">
                                    <button 
                                        className={`sort-button ${sortOption === "priceLowToHigh" ? "active" : ""}`}
                                        onClick={() => handleSortChange("priceLowToHigh")}
                                    >
                                        <ArrowUpDown />
                                        <span>Price</span>
                                    </button>
                                    <button 
                                        className={`sort-button ${sortOption === "priceHighToLow" ? "active" : ""}`}
                                        onClick={() => handleSortChange("priceHighToLow")}
                                    >
                                        <ArrowDownUp />
                                        <span>Price</span>
                                    </button>
                                    <button 
                                        className={`sort-button ${sortOption === "alphabetical" ? "active" : ""}`}
                                        onClick={() => handleSortChange("alphabetical")}
                                    >
                                        <SortAsc />
                                        <span>A-Z</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="filter-section">
                            <h4>Price Range</h4>
                            <div className="price-inputs">
                                <input 
                                    type="number" 
                                    name="min" 
                                    value={priceRange.min} 
                                    onChange={handlePriceChange} 
                                    placeholder="Min"
                                    min="0"
                                />
                                <input 
                                    type="number" 
                                    name="max" 
                                    value={priceRange.max} 
                                    onChange={handlePriceChange} 
                                    placeholder="Max"
                                    min="0"
                                />
                            </div>
                        </div>
                    </aside>
                )}

                <main className="products-area">
                    <p className="showing-products">
                        {displayProducts && displayProducts.length > 0 ? (
                            <span>
                                Showing 1-{Math.min(visibleCount, displayProducts.length)} out of {displayProducts.length} products
                            </span>
                        ) : (
                            <span>No products found matching the selected filters</span>
                        )}
                    </p>

                    <div className="products-view">
                        {isLoading ? (
                            <div className="loading-products">Loading products...</div>
                        ) : displayProducts && displayProducts.length > 0 ? (
                            sortedProducts.slice(0, visibleCount).map((item) => (
                                item && (
                                    <div 
                                        key={item.id} 
                                        className="product-item"
                                        onMouseEnter={() => setHoveredProductId(item.id)}
                                        onMouseLeave={() => setHoveredProductId(null)}
                                    >
                                        <Item {...item} />
                                        {hoveredProductId === item.id && (
                                            <div className="product-actions">
                                                {item.stockStatus === 'OUT_OF_STOCK' ? (
                                                    <div className="out-of-stock-message">Out of Stock</div>
                                                ) : isInCart(item.id) ? (
                                                    <div className="quantity-controls">
                                                        <button 
                                                            onClick={() => handleUpdateQuantity(item.id, getItemQuantity(item.id) - 1)}
                                                            disabled={addingToCart[item.id]}
                                                        >
                                                            -
                                                        </button>
                                                        <span>{getItemQuantity(item.id)}</span>
                                                        <button 
                                                            onClick={() => handleUpdateQuantity(item.id, getItemQuantity(item.id) + 1)}
                                                            disabled={addingToCart[item.id]}
                                                        >
                                                            +
                                                        </button>
                                                        <button 
                                                            className="remove-from-cart"
                                                            onClick={() => handleRemoveFromCart(item.id)}
                                                            disabled={addingToCart[item.id]}
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button 
                                                        className="add-to-cart-hover"
                                                        onClick={() => handleAddToCart(item.id)}
                                                        disabled={addingToCart[item.id]}
                                                    >
                                                        {addingToCart[item.id] ? (
                                                            <span className="adding-spinner"></span>
                                                        ) : (
                                                            <>
                                                                <ShoppingCart size={16} />
                                                                <span>Add to Cart</span>
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )
                            ))
                        ) : (
                            <div className="no-products">
                                <AlertCircle size={24} />
                                <p>No products found matching the selected filters. 
                                Try adjusting your brand or price selections.</p>
                            </div>
                        )}
                    </div>

                    {displayProducts && visibleCount < displayProducts.length && (
                        <button 
                            className="load-more" 
                            onClick={() => setVisibleCount(prev => prev + 12)}
                        >
                            Load More
                        </button>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ShopCategory;