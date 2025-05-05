import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './relatedProduct.css';

// Define the API endpoint as a constant
const API_ENDPOINT = 'http://localhost:4000/product/allproducts';

const RelatedProduct = ({ currentCategory, currentProductId }) => {
    const ITEMS_PER_PAGE = 8;
    const navigate = useNavigate();
    const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!currentCategory || !currentProductId) return;

        const fetchRelatedProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch(API_ENDPOINT);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                
                // Check if data is an array before filtering
                const products = Array.isArray(data) ? data : data.products || [];
                
                // Filter products by category and exclude current product
                const filtered = products.filter(product => 
                    product.category === currentCategory && 
                    product.id !== currentProductId
                );
                console.log('Filtered Related Products:', filtered);
                setRelatedProducts(filtered);
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedProducts();
    }, [currentCategory, currentProductId]);

    const handleLoadMore = () => {
        setVisibleItems(prevCount => prevCount + ITEMS_PER_PAGE);
    };

    const handleProductClick = (productName, productId) => {
        navigate(`/product/${productName}-${productId}`);
    };

    const displayedProducts = useMemo(() => {
        return relatedProducts.slice(0, visibleItems);
    }, [relatedProducts, visibleItems]);

    const hasMoreItems = visibleItems < relatedProducts.length;

    if (loading) return (
        <div className="related-loading">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                <div key={index} className="skeleton-item"></div>
            ))}
        </div>
    );

    if (error) return (
        <div className="related-error">
            Error: {error}. <button onClick={() => window.location.reload()}>Retry</button>
        </div>
    );

    return (
        <div className="related">
            <div className="related-header">
                <h1>Related Products</h1>
            </div>
            <div className="related-products-grid">
                {displayedProducts.map((item) => {
                    // Calculate discount percentage
                    const discountPercentage = item.old_price
                        ? Math.round(((item.old_price - item.new_price) / item.old_price) * 100)
                        : 0;

                    return (
                        <div 
                            key={item.id} 
                            onClick={() => handleProductClick(item.name, item.id)}
                            className="product-card"
                        >
                            <div className="product-image-container">
                                <img src={item.image} alt={item.name} className="product-image" />
                                {discountPercentage > 0 && (
                                    <span className="discount-tag">-{discountPercentage}%</span>
                                )}
                            </div>
                            <div className="product-details">
                                <h3 className="product-name">{item.name}</h3>
                                <span className="product-category">{item.category}</span>
                                <div className="product-price">
                                    <span className="new-price">Ksh{item.new_price}</span>
                                    {item.old_price && (
                                        <span className="old-price">Ksh{item.old_price}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {hasMoreItems && (
                <div className="load-more-container">
                    <button className="load-more-button" onClick={handleLoadMore}>
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default RelatedProduct;
