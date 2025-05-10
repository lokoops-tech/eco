import React, { useContext, useEffect, useState, useCallback, memo } from "react";
import { shopContext } from "../context/ShopContext";
import { useParams, useLocation } from "react-router-dom";
import BreadCrum from "../components/Breadcrums/Breadcrum";
import Describe from "../components/Descriptionbox/DescriptionBox";
import ProductDisplay from "../components/productDisplay/productDisplay";
import RelatedProduct from "./relatedProducts";
import YouMayLike from "./YouMayLike";
import SEO from "./Seo.jsx";
import RecentlyViewedItems, { addToRecentlyViewed } from "../pages/RecentViewed";

// Memoize SEO component to prevent unnecessary re-renders
const MemoizedSEO = memo(SEO);

const Product = () => {
    const { all, loading: contextLoading, error: contextError } = useContext(shopContext);
    const { pathname } = useLocation();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [parsedProductId, setParsedProductId] = useState(null);
    
    // Keep track of whether we have SEO data prepared
    const [seoData, setSeoData] = useState(null);

    // Extract product ID from URL path
    useEffect(() => {
        try {
            // The path should be something like /product/ProductName-123
            const pathParts = pathname.split('/');
            if (pathParts.length >= 3) {
                const productPath = pathParts[2]; // Get the part after /product/
                const lastHyphenIndex = productPath.lastIndexOf('-');
                
                if (lastHyphenIndex !== -1) {
                    const idPart = productPath.substring(lastHyphenIndex + 1);
                    const extractedId = Number(idPart);
                    
                    console.log("Extracted ID from URL:", extractedId);
                    
                    if (!isNaN(extractedId)) {
                        setParsedProductId(extractedId);
                    } else {
                        console.error("Invalid product ID extracted from URL:", idPart);
                        setError("Invalid product ID");
                    }
                } else {
                    console.error("Could not find product ID in URL:", pathname);
                    setError("Product ID not found in URL");
                }
            } else {
                console.error("Invalid URL format:", pathname);
                setError("Invalid URL format");
            }
        } catch (err) {
            console.error("Error extracting product ID:", err);
            setError("Error parsing product URL");
        }
    }, [pathname]);

    // Find product by ID - using useCallback for stability
    const findProductById = useCallback((id, products) => {
        if (!id || !products || !products.length) return null;
        const numericId = Number(id);
        return products.find((e) => Number(e.id) === numericId);
    }, []);

    // Process product data effect
    useEffect(() => {
        if (all?.length && parsedProductId !== null) {
            console.log("Searching for product with ID:", parsedProductId);
            console.log("Available products:", all.length);
            
            const foundProduct = findProductById(parsedProductId, all);
            
            if (foundProduct) {
                console.log("Found product:", foundProduct.id, foundProduct.name);
                setProduct(foundProduct);
                
                // Prepare SEO data
                const preparedSeoData = {
                    ...foundProduct,
                    metaTitle: `${foundProduct.name} | Gich-Tech Electronics`,
                    metaDescription: foundProduct.description || `Buy ${foundProduct.name} at Gich-Tech Electronics`,
                    metaKeywords: [
                        foundProduct.name, 
                        foundProduct.category, 
                        ...(foundProduct.keyFeatures || [])
                    ],
                    seoData: {
                        canonicalUrl: `https://gich-tech.com/products/${foundProduct.slug || foundProduct.id}`,
                        structuredData: {
                            "@context": "https://schema.org",
                            "@type": "Product",
                            "name": foundProduct.name,
                            "description": foundProduct.description,
                            "brand": foundProduct.brand || "Gich-Tech",
                            "offers": {
                                "@type": "Offer",
                                "priceCurrency": "KES",
                                "price": foundProduct.new_price,
                                "availability": foundProduct.stockStatus === 'IN_STOCK' ? 
                                    "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                            }
                        }
                    }
                };
                
                setSeoData(preparedSeoData);
                
                // Add this product to recently viewed
                addToRecentlyViewed(parsedProductId);
                console.log("Added product to recently viewed:", parsedProductId);
                setLoading(false);
            } else {
                console.log("Product not found for ID:", parsedProductId);
                setProduct(null);
                setSeoData(null);
                setError("Product not found");
                setLoading(false);
            }
        } else if (!contextLoading && all?.length === 0) {
            // If context has loaded but no products are available
            setError("No products available");
            setLoading(false);
        }
    }, [all, parsedProductId, findProductById]);

    // Loading state
    if (contextLoading || loading) {
        return (
            <div className="loading-container">
                <MemoizedSEO defaultData={{
                    title: "Loading Product | Gich-Tech Electronics",
                    description: "Please wait while we load the product details"
                }} />
                <div className="loading-spinner"></div>
                <p>Loading product details...</p>
            </div>
        );
    }

    // Error state
    if (contextError || error) {
        return (
            <div className="error-container">
                <MemoizedSEO defaultData={{
                    title: "Error Loading Product | Gich-Tech Electronics",
                    description: "We encountered an error while loading the product"
                }} />
                <p>Error loading product: {contextError || error}</p>
            </div>
        );
    }

    // Not found state
    if (!product) {
        return (
            <div className="not-found">
                <MemoizedSEO defaultData={{
                    title: "Product Not Found | Gich-Tech Electronics",
                    description: "The product you are looking for does not exist"
                }} />
                <h2>Product Not Found</h2>
                <p>The product you're looking for doesn't exist.</p>
            </div>
        );
    }

    return (
        <div className="product-page">
            {/* Only render SEO when we have valid SEO data */}
            {seoData && <MemoizedSEO product={seoData} />}
       
            <BreadCrum product={product} />
            <ProductDisplay product={product} />
           
            <YouMayLike />
            {/* Pass the current product ID to RecentlyViewedItems */}
            <RecentlyViewedItems currentProductId={parsedProductId} />
            <Describe />
        </div>
    );
};

export default Product;