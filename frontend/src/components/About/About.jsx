import React from 'react';
import './About.css';

const About = () => {
    return (
        <div className="about-container">
            <div className="about-header">
                <h1>About Us</h1>
            </div>
            <div className="about-content">
                <p>
                    Welcome to <strong>Gich-Tech</strong>, your one-stop destination for all electronics equipments.
                </p>
                <p>
                    At Gich-Tech, we pride ourselves on offering a wide range of high-quality electronic products, 
                    including smartphones, laptops, home appliances, audio systems, and much more. Whether you're upgrading your home, 
                    enhancing your workspace, or looking for the latest tech gadgets, we've got you covered.
                </p>
                
                <div className="vision-mission">
                    <div className="vision-section">
                        <h2>Our Vision</h2>
                        <p>
                            At Gich-Tech, we envision a world where high-quality technology is accessible to everyone. 
                            We aim to be the leading provider of innovative electronic solutions that enhance people's 
                            lives and businesses, setting new standards in the tech industry through reliability, 
                            innovation, and exceptional customer experience.
                        </p>
                    </div>
                    
                    <div className="mission-section">
                        <h2>Our Mission</h2>
                        <p>
                            Our mission is to bring you cutting-edge electronic equipment  at competitive prices while delivering exceptional customer service. 
                            With a strong commitment to quality, innovation, and customer satisfaction, we strive to make your shopping experience seamless and enjoyable.
                            We are dedicated to connecting customers with the right electronics that meet their needs and exceed their expectations.
                        </p>
                    </div>
                </div>
                
                <div className="why-choose-us">
                    <h2>Why Choose Us?</h2>
                    <ul>
                        <li><strong>Top-notch Products:</strong> We offer only genuine and reliable electronics from trusted brands.</li>
                        <li><strong>Affordable Prices:</strong> We ensure value for your money without compromising quality.</li>
                        <li><strong>Excellent Support:</strong> Our knowledgeable and friendly team is always here to assist you.</li>
                        <li><strong>Convenient Shopping:</strong> With a user-friendly platform and secure payment options, we make it easy to shop with confidence.</li>
                    </ul>
                </div>
                <div className="about-achievements">
                    <h2>Our Achievements</h2>
                    <ul>
                        <li>Successfully completed <strong>1000+ Orders</strong></li>
                        <li>Served clients across <strong>200+ counties</strong></li>
                        <li>Award-winning tech solutions</li>
                        <li>24/7 customer support</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default About;