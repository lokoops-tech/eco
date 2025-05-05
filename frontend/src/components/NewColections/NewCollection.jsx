import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../pages/Seo.jsx';
import './NewCollection.css';



const API_BASE_URL = "https://ecommerce-axdj.onrender.com";

const NewProducts = () => {
  const [newCollection, setNewCollection] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to calculate discount percentage
  const calculateDiscount = (oldPrice, newPrice) => {
    if (!oldPrice || !newPrice || oldPrice <= 0) return 0;
    const discount = ((oldPrice - newPrice) / oldPrice) * 100;
    return Math.round(discount); // Round to nearest integer
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/product/newcollection`);
        const data = await response.json();
        
        // Check if data has newcollection property (as shown in the backend response)
        if (data && data.success && Array.isArray(data.newcollection)) {
          const itemsWithDiscount = data.newcollection.map(item => ({
            ...item,
            discount: calculateDiscount(item.old_price, item.new_price)
          }));
          setNewCollection(itemsWithDiscount);
        }
        
        // Fallback checks
        else if (Array.isArray(data)) {
          const itemsWithDiscount = data.map(item => ({
            ...item,
            discount: calculateDiscount(item.old_price, item.new_price)
          }));
          setNewCollection(itemsWithDiscount);
        }
        
        else if (data && Array.isArray(data.items)) {
          const itemsWithDiscount = data.items.map(item => ({
            ...item,
            discount: calculateDiscount(item.old_price, item.new_price)
          }));
          setNewCollection(itemsWithDiscount);
        }
        
        else {
          console.error("Received data is not in expected format:", data);
          setError("Data format error");
          setNewCollection([]);
        }
      } catch (error) {
        console.error("Error fetching new collection:", error);
        setError("Failed to load products");
        setNewCollection([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Product card component integrated directly instead of using Item component
  const ProductCard = ({ id, image, name, old_price, new_price, discount, category, subcategory }) => {
    // Format URL-friendly product name for links
    const formatProductUrl = (name) => {
      return name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // Replace spaces with hyphens
        .replace(/[^\w-]/g, '')      // Remove special characters
        .replace(/--+/g, '-');       // Replace multiple hyphens with single hyphen
    };
    
    // Handle scroll to top when clicking on product
    const handleClick = () => {
      window.scrollTo(0, 0);
    };
    
    return (
      <>
        <SEO />
        <div className="product-card">
          {discount > 0 && (
            <div className="product-card__discount">-{discount}%</div>
          )}
          <div className="product-card__image-container">
            <Link to={`/product/${formatProductUrl(name)}-${id}`}>
              <img 
                src={image} 
                alt={name} 
                className="product-card__image" 
                onClick={handleClick}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DefaultImage;
                }}
              />
            </Link>
          </div>
          <div className="product-card__details">
            <Link to={`/product/${formatProductUrl(name)}-${id}`} onClick={handleClick} style={{textDecoration:'none', color:'inherit'}}>
              <h3 className="product-card__name">{name}</h3>
              <div className="product-card__price-container">
              <span className="product-card__new-price">Ksh {new_price}</span>
              {old_price && old_price > new_price && (
                <span className="product-card__old-price">Ksh {old_price}</span>
              )}
            </div>
            </Link>
           
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="new-collection">
      <h1 className="new-collection__title">New Collection || Be First To Experience</h1>
      
      {isLoading ? (
        <div className="new-collection__loading">Loading...</div>
      ) : error ? (
        <div className="new-collection__error">{error}</div>
      ) : newCollection.length === 0 ? (
        <div className="new-collection__empty">No items found in the collection</div>
      ) : (
        <div className="new-collection__grid">
          {newCollection.map((item, i) => (
            <ProductCard
              key={i}
              id={item.id}
              image={item.image}
              name={item.name}
              old_price={item.old_price}
              new_price={item.new_price}
              discount={item.discount}
              category={item.category}
              subcategory={item.subcategory}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewProducts;
