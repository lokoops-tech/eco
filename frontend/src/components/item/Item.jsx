import { Link } from 'react-router-dom';
import SEO from '../../pages/SEO';
import './Item.css';


const Item = (props) => {
    const handleClick = () => {
        window.scrollTo(0, 0);
    };

    // Create URL-friendly product name
    const formatProductUrl = (name) => {
        return name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')        // Replace spaces with hyphens
            .replace(/[^\w-]/g, '')      // Remove special characters
            .replace(/--+/g, '-');       // Replace multiple hyphens with single hyphen
    };

    // Calculate discount percentage if not provided in props
    const calculateDiscount = () => {
        if (props.discount !== undefined) return props.discount;
        if (!props.old_price || !props.new_price || props.old_price <= 0) return 0;
        const discount = ((props.old_price - props.new_price) / props.old_price) * 100;
        return Math.round(discount); // Round to nearest integer
    };

    const discountPercentage = calculateDiscount();
    const hasDiscount = discountPercentage > 0;

    console.log("Product image URL:", props.image);

    return (
        <>
        <SEO 
        
        />
        <div className="all">
            {hasDiscount && (
                <div className="discount-badge">-{discountPercentage}%</div>
            )}
           
            <Link to={`/product/${formatProductUrl(props.name)}-${props.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            
                <img 
                    onClick={handleClick}
                    className="img"
                    src={props.image}
                  
                    alt={props.name}
                    
                />
                
            <div className="name">
                <h3>{props.name}</h3>
            </div>
            <div className="item-price">
                <div className="item-price-new">Ksh {props.new_price}</div>
                {props.old_price && (
                    <div className="oldprice">
                        Ksh {props.old_price}
                    </div>
                )}
            </div>
                
            </Link>
           
        </div>
    
        </>
    );
};

export default Item;
