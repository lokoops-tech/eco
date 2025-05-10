import React, { useEffect, useRef, useContext, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { shopContext } from '../context/ShopContext';
import { useLocation } from 'react-router-dom';

// Create a singleton store for SEO data with proper page type tracking
const seoDataStore = {
  currentPageType: 'default', // 'default', 'product', 'category', 'path'
  product: null,
  category: null,
  defaultData: {},
  lastUpdated: null,
  
  // Method to update the singleton store
  updateData(newData) {
    const { product, category, defaultData, pageType } = newData;
    
    // Update current page type if provided
    if (pageType) {
      this.currentPageType = pageType;
      
      // Reset other data types when changing page type
      if (pageType === 'default') {
        this.product = null;
        this.category = null;
      } else if (pageType === 'product') {
        this.category = null;
      } else if (pageType === 'category') {
        this.product = null;
      }
    }
    
    // Only update product if it's valid and we're on a product page
    if (product?.id && (pageType === 'product' || !pageType)) {
      this.product = { ...product };
      this.lastUpdated = new Date();
      if (process.env.NODE_ENV === 'development') {
  
      }
    }
    
    // Only update category if it's valid and we're on a category page
    if (category?.id && (pageType === 'category' || !pageType)) {
      this.category = { ...category };
      if (process.env.NODE_ENV === 'development') {

      }
    }
    
    // Update default data if provided
    if (defaultData && Object.keys(defaultData).length > 0) {
      this.defaultData = { ...defaultData };
    }
  },
  
  // Method to get current metadata based on page type
  getCurrentMetadata() {
    // Respect the current page type
    if (this.currentPageType === 'product' && this.product?.id) {
      return {
        title: this.product.metaTitle || `${this.product.name} | Gich-Tech Electronics`,
        description: (this.product.metaDescription || this.product.description || '')
          .replace(/\/\/.*?\n/g, '')
          .replace(/`.*?`/g, '')
          .trim() || `Buy ${this.product.name} at Gich-Tech Electronics`,
        type: 'product',
        id: this.product.id
      };
    }
    
    // Then check for category
    if (this.currentPageType === 'category' && this.category?.id) {
      return {
        title: `${this.category.name} | Gich-Tech Electronics`,
        description: `Shop ${this.category.name} at Gich-Tech. Find the best ${this.category.name.toLowerCase()} products and accessories.`,
        type: 'category',
        id: this.category.id
      };
    }
    
    // Finally use default data
    return {
      title: this.defaultData.title || 'Gich-Tech | Electronics & Tech Accessories Store',
      description: this.defaultData.description || 'Premium electronics and tech accessories at Gich-Tech',
      type: 'default',
      id: null
    };
  },

  // Method to clear all data
  clearAll() {
    this.product = null;
    this.category = null;
    this.currentPageType = 'default';
  }
};

// Flag to track if we're currently rendering SEO component
let isRenderingHelmet = false;

// Helper function to format path for title
const formatPathForTitle = (path) => {
  // Handle root path
  if (path === '/' || path === '') {
    return 'Gich-Tech Electronics & Tech Accessories Store.  Find the latest smartphones, TVs, computers, watches, audio gear, kitchen appliances and more at competitive prices.';
  }
  
  // Remove leading slash and split by additional slashes
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  const pathSegment = cleanPath.split('/')[0]; // Take first segment only
  
  // Format the path segment - capitalize first letter of each word
  const formattedPath = pathSegment
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
    
  return `${formattedPath} | Gich-Tech Electronics & Tech Accessories Store.  Find the latest smartphones, TVs, computers, watches, audio gear, kitchen appliances and more at competitive prices.`;
};

const SEO = ({ product = null, category = null, defaultData = {}, pageType = null }) => {
  const { allProducts } = useContext(shopContext);
  const location = useLocation();
  
  // Use a ref for component instance ID
  const instanceRef = useRef({
    id: Math.random().toString(36).substring(2, 9),
    initialized: false
  });
  
  // Track rendered state
  const [prevPath, setPrevPath] = React.useState(null);
  
  // Detect page type based on location if not explicitly provided
  const detectedPageType = useMemo(() => {
    if (pageType) return pageType;
    
    const path = location.pathname;
    
    // Homepage detection
    if (path === '/' || path === '/home') return 'default';
    
    // Product page detection - handle both singular and plural URL patterns
    if (path.includes('/product/') || path.includes('/products/') || product?.id) return 'product';
    
    // Category page detection - handle various category URL patterns
    if (path.includes('/category/') || path.includes('/categories/') || path.includes('/collection/') || path.includes('/collections/') || category?.id) return 'category';
    
    // For other paths (like /cart, /checkout, etc.)
    return 'path';
  }, [location.pathname, pageType, product, category]);
  
  // Effect to clear SEO data when navigating
  useEffect(() => {
    const currentPath = location.pathname;
    
    // If path changed and not coming from a prev path yet (first render)
    if (!prevPath) {
      setPrevPath(currentPath);
      return;
    }
    
    // If path changed
    if (currentPath !== prevPath) {
      // Reset prev state
      setPrevPath(currentPath);
      
      // Determine new page type
      let newPageType = 'default';
      if (currentPath === '/' || currentPath === '/home') {
        newPageType = 'default';
        // Clear product and category data when returning to homepage
        seoDataStore.clearAll();
      } else if (currentPath.includes('/products/')) {
        newPageType = 'product';
      } else if (currentPath.includes('/category/')) {
        newPageType = 'category';
      } else {
        newPageType = 'path';
      }
      
      // Update the store with new page type
      seoDataStore.updateData({ pageType: newPageType });
      
      if (process.env.NODE_ENV === 'development') {
       
      }
    }
  }, [location.pathname, prevPath]);
  
  // Effect to update the SEO data store
  useEffect(() => {
    // Don't run this effect if we're already rendering a Helmet
    if (isRenderingHelmet) {
      if (process.env.NODE_ENV === 'development') {
      }
      return;
    }
    
    // Mark this component instance as initialized
    instanceRef.current.initialized = true;
    
    // Extract product/category data from URL if needed
    const path = location.pathname;
    let extractedProductSlug = null;
    let extractedCategorySlug = null;
    
    // Extract product slug from URL
    if (path.includes('/product/') || path.includes('/products/')) {
      const segments = path.split('/');
      const productIndex = segments.findIndex(segment => 
        segment === 'product' || segment === 'products'
      );
      
      if (productIndex >= 0 && segments.length > productIndex + 1) {
        extractedProductSlug = segments[productIndex + 1];
        if (process.env.NODE_ENV === 'development') {
        }
      }
    }
    
    // Extract category slug from URL
    if (path.includes('/category/') || path.includes('/categories/') || 
        path.includes('/collection/') || path.includes('/collections/')) {
      const segments = path.split('/');
      const categoryIndex = segments.findIndex(segment => 
        segment === 'category' || segment === 'categories' || 
        segment === 'collection' || segment === 'collections'
      );
      
      if (categoryIndex >= 0 && segments.length > categoryIndex + 1) {
        extractedCategorySlug = segments[categoryIndex + 1];
        if (process.env.NODE_ENV === 'development') {
        }
      }
    }
    
    // Use extracted data to influence page type when needed
    let effectivePageType = detectedPageType;
    
    if (extractedProductSlug && !product) {
      effectivePageType = 'product';
    } else if (extractedCategorySlug && !category) {
      effectivePageType = 'category';
    }
    
    // Update the global store with our data including page type
    seoDataStore.updateData({ 
      product, 
      category, 
      defaultData, 
      pageType: effectivePageType 
    });
    
    // Immediately update document title based on page type and URL
    const productName = extractedProductSlug 
      ? decodeURIComponent(extractedProductSlug).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      : (product?.name || null);
      
    const categoryName = extractedCategorySlug
      ? decodeURIComponent(extractedCategorySlug).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      : (category?.name || null);
    
    // Override title based on URL extraction if needed
    let overrideTitle = null;
    if (effectivePageType === 'product' && productName && !product) {
      overrideTitle = `${productName} | Gich-Tech Electronics & Tech Accessories Store.  Find the latest smartphones, TVs, computers, watches, audio gear, kitchen appliances and more at competitive prices.`;
    } else if (effectivePageType === 'category' && categoryName && !category) {
      overrideTitle = `${categoryName} | Gich-Tech Electronics & Tech Accessories Store.  Find the latest smartphones, TVs, computers, watches, audio gear, kitchen appliances and more at competitive prices.`;
    } else if (effectivePageType === 'path') {
      // Format path-based title
      overrideTitle = formatPathForTitle(path);
    } else if (effectivePageType === 'default' && path === '/') {
      // Special case for home page
      overrideTitle = 'Gich-Tech Electronics & Tech Accessories Store.  Find the latest smartphones, TVs, computers, watches, audio gear, kitchen appliances and more at competitive prices.';
    }
    
    // Get and use metadata
    const seoData = seoDataStore.getCurrentMetadata();
    document.title = overrideTitle || seoData.title;
    
    if (process.env.NODE_ENV === 'development') {
  
    }
  }, [product, category, defaultData, detectedPageType, location.pathname]);
  
  // Set flag that we're rendering a Helmet
  isRenderingHelmet = true;
  
  // Extract product/category name from URL if needed
  const path = location.pathname;
  let extractedProductName = null;
  let extractedCategoryName = null;
  
  // Extract product name from URL
  if (path.includes('/product/') || path.includes('/products/')) {
    const segments = path.split('/');
    const productIndex = segments.findIndex(segment => 
      segment === 'product' || segment === 'products'
    );
    
    if (productIndex >= 0 && segments.length > productIndex + 1) {
      extractedProductName = decodeURIComponent(segments[productIndex + 1])
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
        .replace(/\d+$/, '').trim(); // Remove trailing numbers and trim
    }
  }
  
  // Extract category name from URL
  if (path.includes('/category/') || path.includes('/categories/') || 
      path.includes('/collection/') || path.includes('/collections/')) {
    const segments = path.split('/');
    const categoryIndex = segments.findIndex(segment => 
      segment === 'category' || segment === 'categories' || 
      segment === 'collection' || segment === 'collections'
    );
    
    if (categoryIndex >= 0 && segments.length > categoryIndex + 1) {
      extractedCategoryName = decodeURIComponent(segments[categoryIndex + 1])
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
    }
  }

  // Product SEO
  if (detectedPageType === 'product' && (seoDataStore.product?.id || extractedProductName)) {
    // Use extracted product name if no product data is available
    const effectiveProduct = seoDataStore.product || (extractedProductName ? {
      id: 'url-extracted',
      name: extractedProductName,
      description: `Buy ${extractedProductName} at Gich-Tech Electronics`
    } : null);
    
    if (!effectiveProduct) {
      setTimeout(() => { isRenderingHelmet = false; }, 0);
      return <Helmet><title>Gich-Tech | Electronics & Tech Accessories Store</title></Helmet>;
    }
    
    const cleanDescription = (effectiveProduct.metaDescription || effectiveProduct.description || '')
      .replace(/\/\/.*?\n/g, '')
      .replace(/`.*?`/g, '')
      .trim() || `Buy ${effectiveProduct.name} at Gich-Tech Electronics`;
      
    // Reset flag when done
    setTimeout(() => { isRenderingHelmet = false; }, 0);
      
    return (
      <Helmet prioritizeSeoTags>
        <title>{effectiveProduct.metaTitle || `${effectiveProduct.name} | Gich-Tech Electronics`}</title>
        <meta name="description" content={cleanDescription} />
        {effectiveProduct.metaKeywords && <meta name="keywords" content={effectiveProduct.metaKeywords.join(', ')} />}
        
        <link rel="canonical" href={effectiveProduct.seoData?.canonicalUrl || `https://gich-tech.com/products/${effectiveProduct.slug || effectiveProduct.id}`} />
        
        {/* Open Graph */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={effectiveProduct.metaTitle || `${effectiveProduct.name} | Gich-Tech Electronics`} />
        <meta property="og:description" content={cleanDescription} />
        <meta property="og:url" content={effectiveProduct.seoData?.canonicalUrl || `https://gich-tech.com/products/${effectiveProduct.slug || effectiveProduct.id}`} />
        <meta property="og:image" content={effectiveProduct.images?.[0]?.url || effectiveProduct.image} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={effectiveProduct.metaTitle || `${effectiveProduct.name} | Gich-Tech Electronics`} />
        <meta name="twitter:description" content={cleanDescription} />
        <meta name="twitter:image" content={effectiveProduct.images?.[0]?.url || effectiveProduct.image} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": effectiveProduct.name,
            "description": cleanDescription,
            "brand": {
              "@type": "Brand",
              "name": effectiveProduct.brand || "Gich-Tech Electronics & Tech Accessories Store.  Find the latest smartphones, TVs, computers, watches, audio gear, kitchen appliances and more at competitive prices."
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": effectiveProduct.currency || "KES",
              "price": effectiveProduct.new_price,
              "availability": effectiveProduct.availability || (effectiveProduct.stockStatus === 'IN_STOCK' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock")
            },
            ...(effectiveProduct.seoData?.structuredData || {})
          })}
        </script>
      </Helmet>
    );
  }

  // Category SEO
  if (detectedPageType === 'category' && (seoDataStore.category?.id || extractedCategoryName)) {
    // Use extracted category name if no category data is available
    const effectiveCategory = seoDataStore.category || (extractedCategoryName ? {
      id: 'url-extracted',
      name: extractedCategoryName,
      slug: path.split('/').pop()
    } : null);
    
    // Reset flag when done
    setTimeout(() => { isRenderingHelmet = false; }, 0);
    
    return (
      <Helmet>
        <title>{`${effectiveCategory.name} | Gich-Tech Electronics`}</title>
        <meta name="description" content={`Shop ${effectiveCategory.name} at Gich-Tech. Find the best ${effectiveCategory.name.toLowerCase()} products and accessories.`} />
        
        <link rel="canonical" href={`https://gich-tech.com/${effectiveCategory.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${effectiveCategory.name} | Gich-Tech Electronics`} />
        <meta property="og:description" content={`Shop ${effectiveCategory.name} at Gich-Tech Electronics`} />
        <meta property="og:url" content={`https://gich-tech.com/${effectiveCategory.slug}`} />
        <meta property="og:image" content={effectiveCategory.image || 'https://gich-tech.com/default-category-image.jpg'} />
      </Helmet>
    );
  }

  // Path-based pages (like /cart, /checkout, etc.)
  if (detectedPageType === 'path') {
    const pathTitle = formatPathForTitle(path);
    const pathSegment = path.startsWith('/') ? path.substring(1).split('/')[0] : path.split('/')[0];
    const pathDescription = `${pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1)} page at Gich-Tech Electronics - your trusted source for quality electronics.`;
    
    // Reset flag when done
    setTimeout(() => { isRenderingHelmet = false; }, 0);
    
    return (
      <Helmet>
        <title>{pathTitle}</title>
        <meta name="description" content={pathDescription} />
        
        <link rel="canonical" href={`https://gich-tech.com${path}`} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pathTitle} />
        <meta property="og:description" content={pathDescription} />
        <meta property="og:url" content={`https://gich-tech.com${path}`} />
      </Helmet>
    );
  }

  // Default SEO (homepage or fallback)
  // Handle home page specially
  if (path === '/' || path === '/home') {
    // Reset flag when done
    setTimeout(() => { isRenderingHelmet = false; }, 0);
    
    return (
      <Helmet>
        <title>Gich-Tech Electronics & Tech Accessories Store.  Find the latest smartphones, TVs, computers, watches, audio gear, kitchen appliances and more at competitive prices.</title>
        <meta name="description" content={defaultData.description || seoDataStore.defaultData.description || 'Premium electronics and tech accessories at Gich-Tech'} />
        
        <link rel="canonical" href={defaultData.canonicalUrl || seoDataStore.defaultData.canonicalUrl || 'https://gich-tech.com'} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Gich-Tech | Electronics & Tech Accessories Store.  Find the latest smartphones, TVs, computers, watches, audio gear, kitchen appliances and more at competitive prices." />
        <meta property="og:description" content={defaultData.description || seoDataStore.defaultData.description || 'Premium electronics and tech accessories at Gich-Tech'} />
        <meta property="og:url" content={defaultData.canonicalUrl || seoDataStore.defaultData.canonicalUrl || 'https://gich-tech.com'} />
        <meta property="og:image" content={defaultData.image || seoDataStore.defaultData.image || 'https://gich-tech.com/og-image.jpg'} />
      </Helmet>
    );
  }
  
  // Check if we're on a product or category page based on URL but don't have data yet
  if (extractedProductName && detectedPageType === 'product') {
    return (
      <Helmet>
        <title>{`${extractedProductName} | Gich-Tech Electronics`}</title>
        <meta name="description" content={`Buy ${extractedProductName} at Gich-Tech Electronics - Quality products at great prices.`} />
        <link rel="canonical" href={`https://gich-tech.com${path}`} />
        
        {/* Open Graph */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={`${extractedProductName} | Gich-Tech Electronics`} />
        <meta property="og:description" content={`Buy ${extractedProductName} at Gich-Tech Electronics - Quality products at great prices.`} />
        <meta property="og:url" content={`https://gich-tech.com${path}`} />
      </Helmet>
    );
  }
  
  if (extractedCategoryName && detectedPageType === 'category') {
    return (
      <Helmet>
        <title>{`${extractedCategoryName} | Gich-Tech Electronics`}</title>
        <meta name="description" content={`Shop ${extractedCategoryName} at Gich-Tech. Find the best ${extractedCategoryName.toLowerCase()} products and accessories.`} />
        <link rel="canonical" href={`https://gich-tech.com${path}`} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${extractedCategoryName} | Gich-Tech Electronics`} />
        <meta property="og:description" content={`Shop ${extractedCategoryName} at Gich-Tech Electronics`} />
        <meta property="og:url" content={`https://gich-tech.com${path}`} />
      </Helmet>
    );
  }
  
  // Final fallback
  setTimeout(() => { isRenderingHelmet = false; }, 0);
  
  return (
    <Helmet>
      <title>{defaultData.title || seoDataStore.defaultData.title || 'Gich-Tech | Electronics & Tech Accessories Store'}</title>
      <meta name="description" content={defaultData.description || seoDataStore.defaultData.description || 'Premium electronics and tech accessories at Gich-Tech'} />
      
      <link rel="canonical" href={defaultData.canonicalUrl || seoDataStore.defaultData.canonicalUrl || 'https://gich-tech.com'} />
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={defaultData.title || seoDataStore.defaultData.title || 'Gich-Tech | Electronics & Tech Accessories Store'} />
      <meta property="og:description" content={defaultData.description || seoDataStore.defaultData.description || 'Premium electronics and tech accessories at Gich-Tech'} />
      <meta property="og:url" content={defaultData.canonicalUrl || seoDataStore.defaultData.canonicalUrl || 'https://gich-tech.com'} />
      <meta property="og:image" content={defaultData.image || seoDataStore.defaultData.image || 'https://gich-tech.com/og-image.jpg'} />
    </Helmet>
  );
};

export default SEO;