import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import grooming from '../Assets/groom12.jpg';
import kitchen from '../Assets/kitchen6.jpg';
import earpods from '../Assets/orimo_2.jpg';
import laptops from '../Assets/pc10.jpg';
import phone from '../Assets/product_15.png';
import woofer from '../Assets/speaker_4.jpeg';
import tv from '../Assets/tv3.jpg';
import watch from '../Assets/watch_6.webp';
import hero from '../Assets/face.png';
import './Hero.css';

const holidays = {
    '12-12': "Happy Jamhuri Day! Enjoy Special Discounts!",
    '01-01': "Happy New Year! Start Your Year with Great Deals!",
    '06-01': "Madaraka Day Sale! Celebrate with Exciting Offers!",
    '10-20': "Happy Mashujaa Day! Special Offers Await!",
    '12-25': "Merry Christmas! Enjoy Festive Discounts!",
    '04-18': "Happy Gich-Day! Celebrate with Us!"
};

const categories = [
    { title: "Laptops & Computers", description: "High-performance computing solutions for work and play", image: laptops, path: "/pc-computer-products" },
    { title: "Smart TVs", description: "Immersive entertainment for your home", image: tv, path: "/tv-appliances" },
    { title: "Wireless Earpods", description: "Crystal clear audio on the go", image: earpods, path: "/earpods" },
    { title: "Premium Woofers", description: "Experience powerful, dynamic sound", image: woofer, path: "/woofers" },
    { title: "Phone Accessories", description: "Enhance your mobile experience", image: phone, path: "/phone-accessories" },
    { title: "Smart Watches", description: "Stay connected in style", image: watch, path: "/watch" },
    { title: "Grooming Essentials", description: "Professional grooming tools for your daily routine", image: grooming, path: "/groomings" },
    { title: "Kitchen Appliances", description: "Modern solutions for your kitchen needs", image: kitchen, path: "/kitchen-appliances" },
    { title: "Best products", description: "save money! Enjoy Great Deals", image: hero, path: "/all-in-one" },
];

const Hero = () => {
    const [holidayMessage, setHolidayMessage] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const autoPlayRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        const checkHoliday = () => {
            const today = new Date();
            const dateKey = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            
            if (holidays[dateKey]) {
                setHolidayMessage(holidays[dateKey]);
            } else {
                setHolidayMessage('');
            }
        };

        checkHoliday();
        const interval = setInterval(checkHoliday, 3600000); // Check every hour

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        autoPlayRef.current = () => {
            if (isAutoPlaying) {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % categories.length);
            }
        };
    }, [isAutoPlaying, categories.length]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (autoPlayRef.current) {
                autoPlayRef.current();
            }
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const pauseAutoPlay = () => setIsAutoPlaying(false);
    const resumeAutoPlay = () => setIsAutoPlaying(true);

    const navigateToCategory = (path) => {
        navigate(path);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
        pauseAutoPlay();
        setTimeout(resumeAutoPlay, 8000);
    };

    const goToNextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % categories.length);
        pauseAutoPlay();
        setTimeout(resumeAutoPlay, 8000);
    };

    const goToPrevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? categories.length - 1 : prevIndex - 1));
        pauseAutoPlay();
        setTimeout(resumeAutoPlay, 8000);
    };

    return (
        <div className="hero-container">
            {holidayMessage && (
                <div className="holiday-banner">
                    <div className="holiday-message">{holidayMessage}</div>
                </div>
            )}
            <div className="category-showcase">
                <div className="slider-controls">
                    <button className="slider-arrow prev" onClick={goToPrevSlide}>‹</button>
                    <button className="slider-arrow next" onClick={goToNextSlide}>›</button>
                </div>
                
                <div className="slider-container">
                    <div 
                        className="slider-wrapper" 
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        onMouseEnter={pauseAutoPlay}
                        onMouseLeave={resumeAutoPlay}
                    >
                        {categories.map((category, index) => (
                            <div key={index} className="slide">
                                <div 
                                    className="category-card"
                                    onClick={() => navigateToCategory(category.path)}
                                >
                                    <div className="image-container">
                                        <img 
                                            src={category.image} 
                                            alt={category.title} 
                                            className="category-image" 
                                        />
                                    </div>
                                    <div className="category-overlay">
                                        <h2 className="category-title">{category.title}</h2>
                                        <p className="category-description">{category.description}</p>
                                        <span className="explore-link">
                                            Explore Now
                                            <span className="link-arrow">→</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="slider-indicators">
                    {categories.map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${index === currentIndex ? "active" : ""}`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
            <div className="hero-intro">
                <h1 className="hero-title">
                    Your One-Stop Shop for <span className="accent-text">Quality Electronics</span>
                </h1>
                <div className="promo-banner">
                    <div className="promo-text">
                        <span className="promo-up-to">Up to</span>
                        <span className="promo-percentage">50%</span>
                        <span className="promo-discount">discount on our products</span>
                    </div>
                </div>
                <button 
                    className="explore-button"
                    onClick={() => navigate('/all-in-one')}
                >
                    <span className="button-text">Shop Now</span>
                    <span className="button-icon">→</span>
                </button>
            </div>
            
            <div className="hero-footer">
                <p className="hero-description">
                    From premium smartphones to home appliances - discover amazing deals with 
                    <span className="highlight-text"> up to 50% off</span>.
                </p>
            </div>
        </div>
    );
};

export default Hero;