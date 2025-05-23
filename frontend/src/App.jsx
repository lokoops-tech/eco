import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import WhatsAppButton from "./components/WhatsApp/WhatsAppButton.jsx";
import FindUs from "./pages/Top.jsx";
import { ToastContainer } from "react-toastify";
import All from "./pages/All.jsx";
import SEO from "./pages/Seo.jsx";
import LoginSignup from "../src/pages/loginSignup.jsx";
import Cart from "../src/pages/Cart.jsx";

// Lazy load pages
const Shop = lazy(() => import("./pages/Shop.jsx"));
const ShopCategory = lazy(() => import("./pages/ShopCategory.jsx"));
const Products = lazy(() => import("./pages/Products.jsx"));
const About = lazy(() => import("./components/About/About.jsx"));
const Company = lazy(() => import("./components/company/Company.jsx"));
const Contact = lazy(() => import("./components/contacts/Contacts.jsx"));
const Orders = lazy(() => import("./components/Orders/Orders.jsx"));
const Faq = lazy(() => import("./components/Faq/Faq.jsx"));
const PrivacyPolicy = lazy(() => import("./components/Privacy/Privacy.jsx"));
const ReturnPolicy = lazy(() => import("./components/Return-policy/ReturnPolicy.jsx"));
const ShippingInfo = lazy(() => import("./components/Shipping/Shipping.jsx"));
const PaymentOptions = lazy(() => import("./components/Payment-option/Payment.jsx"));
const StoreLocations = lazy(() => import("./components/Store-location/Store.jsx"));
const TermsAndConditions = lazy(() => import("./components/Terms/Terms.jsx"));
const PaymentGuide = lazy(() => import("./components/Paymentguide/PaymentGuide.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const ForgotPassword = lazy(() => import("./components/Forgetpassword/ForgetPassword.jsx"));
const ResetPassword = lazy(() => import("./components/ResetPassword/ResetPassword.jsx"));
const SearchResultsPage = lazy(() => import("./pages/SearchResults.jsx"));
const Checkout = lazy(() => import("./components/ChekOut/ChekOut.jsx"));
const BestProducts = lazy(() => import("./pages/BestProducts.jsx"));
const Warranty = lazy(() => import("./components/Waranty/Waranty.jsx"));

const App = () => {
  const categoryRoutes = {
  "phone-accessories": ["cases-covers", "screen-protectors", "chargers-cables", "power-banks", "storage-devices", "phones","Batteries","earphone-accessories"],
  "watch": ["smartwatches", "analog-watches", "digital-watches", "luxury-watches", "watch-bands", "smart-watch-chargers"],
  "fridge": ["single-door", "double-door", "side-by-side", "mini-fridges"],
  "pc-computer-products": ["laptops", "Chargers","keyboards-mice", "storage-devices", "networking-equipment","hdmi-cables"],
  "tv-appliances": ["smart-tvs", "led-lcd-tvs", "tv-mounts", "remote-controls", "tv-accessories"],
  "woofers": ["subwoofers", "soundbars", "car-woofers", "wireless-speakers", "amplifiers"],
  "kitchen-appliances": ["mixers-blenders", "microwave-ovens","cookers","dispensers","coffee-makers", "electric-kettles"],
  "groomings": ["shavers-trimmers", "hair-dryers", "straighteners"],
  "earpods": ["wireless-earbuds","noise-canceling","true-wireless"],
  "electricals": ["switches-sockets","room-heaters","wiring-cables", "circuit-breakers", "led-lighting", "fans-ventilation", "voltage-stabilizers","extensions"]
  };

  return (
    <BrowserRouter>
      <SEO />
      <ToastContainer />
      <FindUs />
      <Navbar />

      {/* Suspense wrapper for all routes */}
      <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center" }}>Loading page...</div>}>
        <Routes>
          <Route path="/" element={<Shop />} />

          {Object.keys(categoryRoutes).map(category => (
            <Route
              key={category}
              path={`/${category}`}
              element={<ShopCategory category={category} />}
            />
          ))}

          {Object.entries(categoryRoutes).map(([category, subcategories]) =>
            subcategories.map(subcategory => (
              <Route
                key={`${category}-${subcategory}`}
                path={`/${category}/${subcategory}`}
                element={<ShopCategory category={category} subcategory={subcategory} />}
              />
            ))
          )}

          <Route path="/product/:productName" element={<Products />} />
          <Route path="/product/:productName/:productId" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<Orders />} />
          <Route path="/all-in-one" element={<All />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/cart/checkout" element={<Checkout />} />
          <Route path="/company" element={<Company />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/shipping" element={<ShippingInfo />} />
          <Route path="/payment-options" element={<PaymentOptions />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/warranty" element={<Warranty />} />
          <Route path="/store-locations" element={<StoreLocations />} />
          <Route path="/mpesa-guide" element={<PaymentGuide />} />
          <Route path="/terms-condition" element={<TermsAndConditions />} />
          <Route path="/:mainCategory/:subCategory/:brand" element={<BestProducts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <WhatsAppButton />
      <Footer />
    </BrowserRouter>
  );
};

export default App;
