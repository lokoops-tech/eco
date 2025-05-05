import React, { useState, useEffect } from "react";
import { Phone, MessageCircle, CreditCard } from "lucide-react";
import "./FindUs.css";

const FindUs = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const items = [
    { icon: <Phone size={28} className="icon pulse" />, text: "0718 351 313 to Order", link: "tel:+254718351313" },
    { icon: <MessageCircle size={28} className="icon" />, text: "WhatsApp to Order", link: "https://wa.me/254718351313" },
    { icon: <CreditCard size={28} className="icon" />, text: "M-Pesa Paybill: 123456, Account: 123456" },
    {text:"payment Done via M-Pesa, After Order Placement",},
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [items.length]);

  const currentItem = items[currentIndex];

  return (
    <div className="findus-container visible">
      <div className="findus-inner sliding-animation">
        <div key={currentIndex} className="findus-item slide">
          {currentItem.icon}
          {currentItem.link ? (
            <a href={currentItem.link} className="findus-link">
              {currentItem.text}
            </a>
          ) : (
            <span className="findus-text">{currentItem.text}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindUs;
