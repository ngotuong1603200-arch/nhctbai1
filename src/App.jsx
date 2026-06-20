import React, { Profiler, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from "./components/Footer/Footer";
import '@fortawesome/fontawesome-free/css/all.min.css';
import DetailProduct from "./components/Body/DetailProduct";
import ProductCard from './components/Body/ProductCard';
import ProductList from './components/Body/ProductList';
import Login from './components/Pages/Login';
import Signup from './components/Pages/Signup';
import Cart from './components/Pages/Cart';
import Banner from './components/Body/Banner';
import Admin from './components/Pages/Admin';
import Profile from './components/Pages/Profile';
import Aboutus from './components/Pages/Aboutus';
import News from './components/Pages/News';
import Stores from './components/Pages/Stores';
import Promotions from './components/Pages/Promotions';
import PromotionalCombos from './components/Pages/PromotionalCombos';
function App() {
  const location = useLocation();
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const hideChrome =
    location.pathname === '/signup' ||
    location.pathname === '/admin';

  return (
    <>
      {!hideChrome && <Header onOpenLogin={() => setIsLoginOpen(true)} />}

      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Banner />
              <ProductList />
           
            </>
          }
        />

        <Route path="/product/:id" element={<DetailProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/category/:slug" element={<ProductList />} />
        <Route path="/about" element={<Aboutus />} />
         < Route path="/news" element={<News />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/combo" element={<PromotionalCombos />} />
      </Routes>

      {!hideChrome && <Footer />}
    </>
  );
}

export default App;