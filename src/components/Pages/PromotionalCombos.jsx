import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PromotionalCombos.css';

const PromotionalCombos = () => {
  const navigate = useNavigate();
  const [combos, setCombos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCombos = async () => {
      setTimeout(() => {
        setCombos([
          {
            id: 'combo-1',
            name: 'Combo Gà Rán Vui Vẻ',
            description: '2 Gà rán truyền thống + 1 Khoai tây chiên + 1 Pepsi',
            oldPrice: '93.000đ',
            currentPrice: '79.000đ',
            image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' 
          },
          {
            id: 'combo-2',
            name: 'Combo Burger Tiết Kiệm',
            description: '1 Hamburger bò + 1 Khoai tây mặt cười + 1 Coca Cola',
            oldPrice: '75.000đ',
            currentPrice: '65.000đ',
            image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
          },
          {
            id: 'combo-3',
            name: 'Combo Tụ Tập Gia Đình',
            description: '1 Pizza thập cẩm + 2 Gà rán sốt phô mai + 1 Mì Ý sốt kem phô mai + 4 Nước ép cam tươi',
            oldPrice: '390.000đ',
            currentPrice: '349.000đ',
            image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
          },
          {
            id: 'combo-4',
            name: 'Combo Sinh Viên Cực Đã',
            description: '1 Hot dog Mỹ truyền thống + 1 Gà Nướng + 1 Trà đào cam sả',
            oldPrice: '75.000đ',
            currentPrice: '59.000đ',
            image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
          }
        ]);
        setIsLoading(false);
      }, 500);
    };

    fetchCombos();
  }, []);

  const handleAddToCart = (combo) => {
    const savedCart = localStorage.getItem('cart');
    let cart = savedCart ? JSON.parse(savedCart) : [];

    const existingItemIndex = cart.findIndex((item) => item.id === combo.id);
    
    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({
        id: combo.id,
        name: combo.name,
        currentPrice: combo.currentPrice, 
        image: combo.image,
        quantity: 1
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    
    navigate('/cart');
  };

  return (
    <div className="promotional-combos-container">
      <div className="combos-header">
        <h1 className="combos-title">COMBO ƯU ĐÃI</h1>
        <p className="combos-subtitle">Tiết kiệm hơn, ăn ngon hơn cùng những combo cực chất!</p>
      </div>

      {isLoading ? (
        <div className="combos-loading">Đang tải danh sách ưu đãi...</div>
      ) : (
        <div className="combos-grid">
          {combos.map((combo) => (
            <div className="combo-card" key={combo.id}>
              <div className="combo-image-wrapper">
                <div className="combo-badge">HOT</div>
                <img src={combo.image} alt={combo.name} className="combo-image" />
              </div>
              
              <div className="combo-content">
                <h3 className="combo-name">{combo.name}</h3>
                <p className="combo-desc">{combo.description}</p>
                
                <div className="combo-price-section">
                  <span className="old-price">{combo.oldPrice}</span>
                  <span className="current-price">{combo.currentPrice}</span>
                </div>
                
                <div className="combo-actions">
                  <button 
                    className="btn-view-detail"
                    onClick={() => navigate(`/product/${combo.id}`, { state: { product: combo } })}
                  >
                    Chi tiết
                  </button>
                  <button 
                    className="btn-add-cart"
                    onClick={() => handleAddToCart(combo)}
                  >
                    <i className="fas fa-cart-plus"></i> Thêm ngay
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromotionalCombos;