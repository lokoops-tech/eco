import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { shopContext } from '../context/ShopContext';
import SEO from './SEO';
import './RecentlyViewed.css';

// Utility function to add products to recently viewed
export const addToRecentlyViewed = (productId) => {
    if (!productId) return;
    
    const recentItems = localStorage.getItem('recentlyViewedItems');
    let recentlyViewedIds = recentItems ? JSON.parse(recentItems) : [];
    
    // Remove the product if it's already in the list
    recentlyViewedIds = recentlyViewedIds.filter(id => id !== productId);
    
    // Add the new product at the beginning of the array
    recentlyViewedIds.unshift(productId);
    
    // Keep only the most recent 20 items
    recentlyViewedIds = recentlyViewedIds.slice(0, 20);
    
    // Save back to localStorage
    localStorage.setItem('recentlyViewedItems', JSON.stringify(recentlyViewedIds));
    console.log('Added to recently viewed:', productId);
};

const RecentlyViewedItems = ({ currentProductId }) => {
    const ITEMS_PER_PAGE = 5;
    const navigate = useNavigate();
    const { all, loading, error } = React.useContext(shopContext);
    const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
    const [recentlyViewedItems, setRecentlyViewedItems] = useState([]);

    useEffect(() => {
        // Get recently viewed items from local storage and match with product data
        const fetchRecentItems = () => {
            const storedItems = localStorage.getItem('recentlyViewedItems');
            const recentIds = storedItems ? JSON.parse(storedItems) : [];
            
            console.log('Recent IDs from localStorage:', recentIds);
            
            // Filter out the current product ID
            const filteredIds = recentIds.filter(id => id !== currentProductId);
            
            // Map IDs to full product data
            if (all && all.length > 0) {
                const itemsWithData = filteredIds
                    .map(id => all.find(product => Number(product.id) === Number(id)))
                    .filter(product => product !== undefined); // Remove any undefined results
                
                console.log('Recently Viewed Items with data:', itemsWithData);
                setRecentlyViewedItems(itemsWithData);
            }
        };

        fetchRecentItems();
    }, [all, currentProductId]);

    const handleLoadMore = () => {
        setVisibleItems(prevCount => prevCount + ITEMS_PER_PAGE);
    };

    const handleProductClick = (productName, productId) => {
        navigate(`/product/${productName}-${productId}`);
    };

    const displayedItems = useMemo(() => {
        return recentlyViewedItems.slice(0, visibleItems);
    }, [recentlyViewedItems, visibleItems]);

    const hasMoreItems = visibleItems < recentlyViewedItems.length;

    if (loading) {
        return (
            <div className="recently-viewed-loading">
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                    <div key={index} className="recently-viewed-skeleton">
                        <div className="skeleton-image"></div>
                        <div className="skeleton-text"></div>
                        <div className="skeleton-price"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="recently-viewed-error">
                Error: {error} <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    if (recentlyViewedItems.length === 0) {
        return (
            <div className="recently-viewed-empty">
                <p>No recently viewed items found.</p>
            </div>
        );
    }

    return (
        <>
            <SEO 
                defaultData={{
                    metatitle: 'Gich-tech Recently Viewed Items',
                    description: 'Products you have recently viewed',
                    keywords: 'recent, viewed, products'
                }}
            />
            
            <div className="recently-viewed-container">
                <div className="recently-viewed-header">
                    <h1>Recently Viewed</h1>
                </div>
                
                <div className="recently-viewed-grid">
                    {displayedItems.map((item) => {
                        // Calculate discount percentage
                        const discountPercentage = item.old_price
                            ? Math.round(((item.old_price - item.new_price) / item.old_price) * 100)
                            : 0;

                        return (
                            <div 
                                key={item.id} 
                                onClick={() => handleProductClick(item.name, item.id)}
                                className="recently-viewed-item"
                            >
                                <div className="recently-viewed-image">
                                    <img src={item.image} alt={item.name} />
                                    {discountPercentage > 0 && (
                                        <span className="recently-viewed-discount">
                                            -{discountPercentage}%
                                        </span>
                                    )}
                                </div>
                                <div className="recently-viewed-details">
                                    <h3 className="recently-viewed-name">{item.name}</h3>
                                    <div className="recently-viewed-category">{item.category}</div>
                                    <div className="recently-viewed-prices">
                                        <span className="recently-viewed-new-price">Ksh{item.new_price}</span>
                                        {item.old_price && (
                                            <span className="recently-viewed-old-price">Ksh{item.old_price}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {hasMoreItems && (
                    <div className="recently-viewed-load-more">
                        <button onClick={handleLoadMore}>
                            Load More
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default RecentlyViewedItems;