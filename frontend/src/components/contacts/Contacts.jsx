import React from 'react';
import './Contact.css';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Contact = () => {
    return (
        <div className="contact-container">
            <div className="contact-header">
                <h1>Contact Us</h1>
                <p>We'd love to hear from you! Reach out to us for inquiries, support, or feedback.</p>
            </div>
            <div className="contact-info">
                <div className="contact-details">
                    <h2>Get in Touch</h2>
                    <p><strong>Email:</strong> support@gich-tech.com</p>
                    <p><strong>Phone:</strong> +254703542368</p>
                    <p><strong>Address:</strong> All Uganda Roads</p>
                    <p><strong>Whatsapp:</strong> +254703542368</p>

                </div>
                <div className="social-media">
                    <h2>Follow Us</h2>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="icon facebook"><FaFacebookF /></a>
                        <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="icon x-twitter"><FaXTwitter /></a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="icon instagram"><FaInstagram /></a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="icon linkedin"><FaLinkedinIn /></a>
                        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="icon tiktok"><FaTiktok/></a>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;