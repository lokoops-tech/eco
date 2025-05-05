import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ product = null, category = null, defaultData = {} }) => {
  // Use a ref to store the initial valid product/category data
  const initialDataRef = useRef(null);
  
  // Store initial valid data to prevent losing it on subsequent renders
  useEffect(() => {
    if (!initialDataRef.current && (product?.id || category?.id)) {
      initialDataRef.current = { product, category };
    }
  }, [product, category]);

  // Use stored data or current props
  const effectiveProduct = product?.id ? product : initialDataRef.current?.product;
  const effectiveCategory = category?.id ? category : initialDataRef.current?.category;

  // Debug logging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('SEO component updated:', {
        productId: effectiveProduct?.id,
        metaTitle: effectiveProduct?.metaTitle || effectiveCategory?.name || defaultData.title,
        timestamp: new Date().toISOString(),
        fromCache: !product?.id && initialDataRef.current?.product?.id ? true : false
      });
    }
  }, [effectiveProduct, effectiveCategory, defaultData]);

  // Dynamically update document title immediately
  useEffect(() => {
    let title = 'Gich-Tech | Electronics & Tech Accessories Store';
    
    if (effectiveProduct) {
      title = effectiveProduct.metaTitle || `${effectiveProduct.name} | Gich-Tech Electronics`;
    } else if (effectiveCategory) {
      title = `${effectiveCategory.name} | Gich-Tech Electronics`;
    } else if (defaultData.title) {
      title = defaultData.title;
    }

    document.title = title;
  }, [effectiveProduct, effectiveCategory, defaultData]);

  // Product SEO
  if (effectiveProduct) {
    // Clean up meta description - remove any code snippets
    const cleanDescription = (effectiveProduct.metaDescription || effectiveProduct.description || '')
      .replace(/\/\/.*?\n/g, '') // Remove code comments
      .replace(/`.*?`/g, '')     // Remove code blocks
      .trim() || `Buy ${effectiveProduct.name} at Gich-Tech Electronics`;

    return (
      <Helmet prioritizeSeoTags>
        <title>{effectiveProduct.metaTitle || `${effectiveProduct.name} | Gich-Tech Electronics`}</title>
        <meta name="description" content={cleanDescription} />
        {effectiveProduct.metaKeywords && <meta name="keywords" content={effectiveProduct.metaKeywords.join(', ')} />}
        
        <link rel="canonical" href={effectiveProduct.seoData?.canonicalUrl || `http://localhost:5173/products/${effectiveProduct.slug || effectiveProduct.id}`} />
        
        {/* Open Graph */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={effectiveProduct.metaTitle || `${effectiveProduct.name} | Gich-Tech Electronics`} />
        <meta property="og:description" content={cleanDescription} />
        <meta property="og:url" content={effectiveProduct.seoData?.canonicalUrl || `http://localhost:5173/products/${effectiveProduct.slug || effectiveProduct.id}`} />
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
              "name": effectiveProduct.brand || "Gich-Tech"
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
  if (effectiveCategory) {
    return (
      <Helmet>
        <title>{`${effectiveCategory.name} | Gich-Tech Electronics`}</title>
        <meta name="description" content={`Shop ${effectiveCategory.name} at Gich-Tech. Find the best ${effectiveCategory.name.toLowerCase()} products and accessories.`} />
        
        <link rel="canonical" href={`http://localhost:5173/${effectiveCategory.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${effectiveCategory.name} | Gich-Tech Electronics`} />
        <meta property="og:description" content={`Shop ${effectiveCategory.name} at Gich-Tech Electronics`} />
        <meta property="og:url" content={`http://localhost:5173/${effectiveCategory.slug}`} />
        <meta property="og:image" content={effectiveCategory.image || 'http://localhost:5173/default-category-image.jpg'} />
      </Helmet>
    );
  }

  // Default SEO
  return (
    <Helmet>
      <title>{defaultData.title || 'Gich-Tech | Electronics & Tech Accessories Store'}</title>
      <meta name="description" content={defaultData.description || 'Premium electronics and tech accessories at Gich-Tech'} />
      
      <link rel="canonical" href={defaultData.canonicalUrl || 'http://localhost:5173'} />
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={defaultData.title || 'Gich-Tech | Electronics & Tech Accessories Store'} />
      <meta property="og:description" content={defaultData.description || 'Premium electronics and tech accessories at Gich-Tech'} />
      <meta property="og:url" content={defaultData.canonicalUrl || 'http://localhost:5173'} />
      <meta property="og:image" content={defaultData.image || 'http://localhost:5173/og-image.jpg'} />
    </Helmet>
  );
};

export default SEO;