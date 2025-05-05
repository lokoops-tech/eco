import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router
import SEO from '../../pages/Seo.jsx';
import './Popular.css';

const API_BASE_URL = "https://ecommerce-axdj.onrender.com";

const Popular = () => {
    const [popularProducts, setPopularProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pageData, setPageData] = useState({
        title: 'Premium Earpods Collection | Gich-Tech Electronics',
        description: 'Shop our premium collection of wireless earpods from top brands including Orimo, Apple, Samsung, and more.',
        canonicalUrl: 'http://localhost:5173/earpods-collection'
    });
    
    useEffect(() => {
        console.log("Fetching products from API...");
        
        // First, try the specific endpoint
        fetch(`${API_BASE_URL}/product/bestorimoproducts`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("API Response:", data);
                
                // Extract products from the response
                let products = [];
                
                if (data && data.products && Array.isArray(data.products)) {
                    products = data.products;
                } else if (Array.isArray(data)) {
                    products = data;
                }
                
                if (products.length === 0) {
                    console.log("No products found from bestorimoproducts endpoint, trying fallback...");
                    // If no products found, try the general products endpoint as fallback
                    return fetch(`${API_BASE_URL}/product/allproducts`)
                        .then(response => response.json())
                        .then(fallbackData => {
                            console.log("Fallback API Response:", fallbackData);
                            
                            let fallbackProducts = [];
                            
                            if (fallbackData && Array.isArray(fallbackData)) {
                                fallbackProducts = fallbackData;
                            } else if (fallbackData && fallbackData.products && Array.isArray(fallbackData.products)) {
                                fallbackProducts = fallbackData.products;
                            }
                            
                            // Filter products to only include earpods with specified brands
                            const filteredProducts = fallbackProducts.filter(product =>
                                product.category === "earpods" && 
                                (product.subcategory === "wireless-earbuds" || !product.subcategory) &&
                                ["Orimo", "Xiomi", "Oppo", "Apple", "Samsung", "Huawei", "Sony"].includes(product.brand)
                            );
                            
                            console.log("Filtered products:", filteredProducts);
                            setPopularProducts(filteredProducts);
                        });
                }
                
                setPopularProducts(products);
                return null; // Important to return null to avoid warning
            })
            .catch(error => {
                console.error("Error fetching products:", error);
                setError(error.message);
                
                // Try fallback on error too
                fetch(`${API_BASE_URL}/product/allproducts`)
                    .then(response => response.json())
                    .then(fallbackData => {
                        let fallbackProducts = [];
                        
                        if (fallbackData && Array.isArray(fallbackData)) {
                            fallbackProducts = fallbackData;
                        } else if (fallbackData && fallbackData.products && Array.isArray(fallbackData.products)) {
                            fallbackProducts = fallbackData.products;
                        }
                        
                        // Filter products to only include earpods with specified brands
                        const filteredProducts = fallbackProducts.filter(product =>
                            product.category === "earpods" && 
                            (product.subcategory === "wireless-earbuds" || !product.subcategory) &&
                            ["Orimo", "Xiomi", "Oppo", "Apple", "Samsung", "Huawei", "Sony", "Jbl"].includes(product.brand)
                        );
                        
                        setPopularProducts(filteredProducts);
                        setError(null); // Clear error if fallback works
                    })
                    .catch(fallbackError => {
                        console.error("Error on fallback request:", fallbackError);
                        // Keep the original error if fallback fails too
                    });
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Calculate discount percentage
    const calculateDiscount = (oldPrice, newPrice) => {
        if (!oldPrice || !newPrice) return null;
        const old = parseFloat(oldPrice);
        const current = parseFloat(newPrice);
        if (isNaN(old) || isNaN(current) || old <= current) return null;
        
        const discount = ((old - current) / old) * 100;
        return Math.round(discount); // Round to nearest integer
    };

    // Create our own product card component instead of using Item.jsx
    const ProductCard = ({ product }) => {
        const discountPercentage = calculateDiscount(product.old_price, product.new_price);
        
        return (
            <div className="earpods-product-card">
                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="earpods-product-image">
                        <img src={product.image} alt={product.name} />
                        {discountPercentage && (
                            <div className="earpods-discount-badge">
                                -{discountPercentage}%
                            </div>
                        )}
                    </div>
                    <div className="earpods-product-details">
                        <h3 className="earpods-product-name">{product.name}</h3>
                        <div className="earpods-product-price">
                            <span className="earpods-new-price">Ksh{product.new_price}</span>
                            {product.old_price && (
                                <span className="earpods-old-price">Ksh{product.old_price}</span>
                            )}
                        </div>
                        <div className="earpods-product-brand">{product.brand}</div>
                    </div>
                </Link>
            </div>
        );
    };

    // Create a virtual category object for SEO purposes
    const categoryData = {
        id: 'earpods-collection',
        name: 'Premium Earpods Collection',
        slug: 'earpods-collection',
        image: popularProducts[0]?.image || 'http://localhost:5173/default-earpods-image.jpg'
    };

    return (
        <>
            {/* Pass proper category data to SEO component */}
            <SEO 
                category={categoryData} 
                defaultData={pageData}
            />
            <div className="earpods-popular-section">
                <div className="earpods-section-header">
                    <h1>Earpods || Connect To Pure Sound</h1>
                    <hr />
                </div>
                
                {loading ? (
                    <div className="earpods-loading-container">
                        <div className="earpods-loading-spinner"></div>
                        <p>Loading premium earpods...</p>
                    </div>
                ) : error ? (
                    <div className="earpods-error-message">
                        <p>Error loading products: {error}</p>
                        <button onClick={() => window.location.reload()}>Try Again</button>
                    </div>
                ) : (
                    <div className="earpods-products-grid">
                        {popularProducts.length > 0 ? (
                            popularProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        ) : (
                            <p className="earpods-no-products">No earpods found from our premium brands. Please check back later.</p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default Popular;
