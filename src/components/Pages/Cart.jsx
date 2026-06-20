import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  
  const [selectedVoucher, setSelectedVoucher] = useState(''); 
  const [manualVoucherCode, setManualVoucherCode] = useState('');

  const [appliedDropdownVoucher, setAppliedDropdownVoucher] = useState(null); 
  const [appliedManualVoucher, setAppliedManualVoucher] = useState(null); 
  
  const [dropdownMessage, setDropdownMessage] = useState({ text: '', type: '' });
  const [manualMessage, setManualMessage] = useState({ text: '', type: '' }); 

  const vouchers = [
    { code: '', label: '-- Chọn mã khuyến mãi --', value: 0, type: 'none', minQuantity: 0 },
    
    { code: 'KFTDAY50', label: 'Giảm 50% Gà Rán', value: 50, type: 'percent', minQuantity: 1 },
    { code: 'FREESHPKFT', label: 'Freeship Toàn Mặt Trận', value: 15000, type: 'fixed', minQuantity: 1 },
    { code: 'PIZZAB1G1', label: 'Mua 1 Tặng 1 Pizza (Giảm 50k)', value: 50000, type: 'fixed', minQuantity: 1 },
    { code: 'NEWKFT30', label: 'Giảm 30K Cho Khách Mới', value: 30000, type: 'fixed', minQuantity: 1 },
    { code: 'KFTBDAY', label: 'Sinh Nhật Rộn Ràng (Giảm 10%)', value: 10, type: 'percent', minQuantity: 1 },

    { code: 'KFT10K', label: 'Giảm 10.000đ (Áp dụng mọi đơn)', value: 10000, type: 'fixed', minQuantity: 0 },
    { code: 'BURGER15', label: 'Giảm 15.000đ (Mua từ 2 món trở lên)', value: 15000, type: 'fixed', minQuantity: 2 },
    { code: 'TRASUA20K', label: 'Giảm 20.000đ (Mua từ 3 món trở lên)', value: 20000, type: 'fixed', minQuantity: 3 },
    { code: 'GA30K', label: 'Giảm 30.000đ (Mua từ 4 món trở lên)', value: 30000, type: 'fixed', minQuantity: 4 },
    { code: 'PIZZAPARTY', label: 'Giảm 50.000đ (Mua từ 6 món trở lên)', value: 50000, type: 'fixed', minQuantity: 6 },
    { code: 'SIEUDEAL100', label: 'Giảm 100.000đ (Mua từ 10 món trở lên)', value: 100000, type: 'fixed', minQuantity: 10 },

    { code: 'SALE5PT', label: 'Giảm 5% tổng đơn (Mua từ 2 món)', value: 5, type: 'percent', minQuantity: 2 },
    { code: 'SALE10PT', label: 'Giảm 10% tổng đơn (Mua từ 4 món)', value: 10, type: 'percent', minQuantity: 4 },
    { code: 'SALE15PT', label: 'Giảm 15% tổng đơn (Mua từ 5 món)', value: 15, type: 'percent', minQuantity: 5 },
    { code: 'VIP20PT', label: 'Giảm 20% tổng đơn (Mua từ 8 món)', value: 20, type: 'percent', minQuantity: 8 },

    { code: 'FREESHIP', label: 'Freeship 15.000đ (Áp dụng mọi đơn)', value: 15000, type: 'fixed', minQuantity: 0 },
    { code: 'FREESHIP30K', label: 'Freeship 30.000đ (Mua từ 3 món)', value: 30000, type: 'fixed', minQuantity: 3 },
    { code: 'FREESHIPXTRA', label: 'Freeship 50.000đ (Mua từ 5 món)', value: 50000, type: 'fixed', minQuantity: 5 }
  ];

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const updateCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const increaseQuantity = (index) => {
    const newCart = [...cartItems];
    newCart[index].quantity += 1;
    updateCart(newCart);
  };

  const decreaseQuantity = (index) => {
    const newCart = [...cartItems];
    if (newCart[index].quantity > 1) {
      newCart[index].quantity -= 1;
      updateCart(newCart);
    }
  };

  const removeItem = (index) => {
    const newCart = cartItems.filter((_, i) => i !== index);
    updateCart(newCart);
  };

  const totalItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const calculateSubTotal = () => {
    return cartItems.reduce((total, item) => {
      const priceString = item.cartPrice || item.currentPrice;
      const price = parseFloat(priceString.replace(/[^\d]/g, '')) || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const subTotal = calculateSubTotal();

  const handleApplyDropdownVoucher = () => {
    if (!selectedVoucher) {
      setAppliedDropdownVoucher(null);
      setDropdownMessage({ text: 'Vui lòng chọn mã khuyến mãi!', type: 'error' });
      return;
    }

    const voucher = vouchers.find(v => v.code === selectedVoucher);
    if (totalItemsCount < voucher.minQuantity) {
      setAppliedDropdownVoucher(null);
      setDropdownMessage({ text: `Cần mua ít nhất ${voucher.minQuantity} sản phẩm!`, type: 'error' });
    } else {
      setAppliedDropdownVoucher(voucher);
      setDropdownMessage({ text: 'Áp dụng mã thành công!', type: 'success' });
    }
  };

  const handleApplyManualVoucher = () => {
    if (!manualVoucherCode.trim()) {
      setAppliedManualVoucher(null);
      setManualMessage({ text: 'Vui lòng nhập mã!', type: 'error' });
      return;
    }

    const codeUpper = manualVoucherCode.trim().toUpperCase();
    const voucher = vouchers.find(v => v.code === codeUpper);

    if (!voucher) {
      setAppliedManualVoucher(null);
      setManualMessage({ text: 'Mã không tồn tại!', type: 'error' });
      return;
    }

    if (totalItemsCount < voucher.minQuantity) {
      setAppliedManualVoucher(null);
      setManualMessage({ text: `Cần mua ít nhất ${voucher.minQuantity} sản phẩm!`, type: 'error' });
    } else {
      setAppliedManualVoucher(voucher);
      setManualMessage({ text: 'Áp dụng mã thành công!', type: 'success' });
    }
  };

  useEffect(() => {
    if (appliedDropdownVoucher && totalItemsCount < appliedDropdownVoucher.minQuantity) {
      setAppliedDropdownVoucher(null);
      setDropdownMessage({ text: `Đã gỡ mã do không đủ ${appliedDropdownVoucher.minQuantity} sản phẩm.`, type: 'error' });
    }
    if (appliedManualVoucher && totalItemsCount < appliedManualVoucher.minQuantity) {
      setAppliedManualVoucher(null);
      setManualMessage({ text: `Đã gỡ mã do không đủ ${appliedManualVoucher.minQuantity} sản phẩm.`, type: 'error' });
    }
  }, [totalItemsCount, appliedDropdownVoucher, appliedManualVoucher]);

  const calcVoucherDiscount = (voucher) => {
    if (!voucher) return 0;
    if (voucher.type === 'fixed') return voucher.value;
    if (voucher.type === 'percent') return subTotal * (voucher.value / 100);
    return 0;
  };

  const discount = calcVoucherDiscount(appliedDropdownVoucher) + calcVoucherDiscount(appliedManualVoucher);
  const finalTotal = subTotal - discount > 0 ? subTotal - discount : 0;

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <h2>Giỏ hàng của bạn đang trống</h2>
          <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm!</p>
          <button className="continue-shopping-btn" onClick={() => navigate('/')}>Tiếp tục mua sắm</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Giỏ hàng của bạn</h1>
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item, index) => {
            const priceString = item.cartPrice || item.currentPrice;
            const price = parseFloat(priceString.replace(/[^\d]/g, "")) || 0;
            const itemTotal = price * item.quantity;
            
            return (
              <div key={index} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} />
                </div>
                <div className="cart-item-info">
                  <h3 className="cart-item-name">{item.name}</h3>
                  
                  {item.selectedSize && (
                    <span className="cart-item-size">Size: {item.selectedSize}</span>
                  )}
                  
                  <p className="cart-item-price">{priceString}</p>
                </div>
                <div className="cart-item-quantity">
                  <button className="quantity-btn minus" onClick={() => decreaseQuantity(index)}>-</button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button className="quantity-btn plus" onClick={() => increaseQuantity(index)}>+</button>
                </div>
                <div className="cart-item-total">
                  <p className="item-total-price">{formatPrice(itemTotal)}</p>
                </div>
                <button className="remove-item-btn" onClick={() => removeItem(index)} title="Xóa sản phẩm">x</button>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <h2 className="summary-title">Tổng kết đơn hàng</h2>
          
          <div className="voucher-section">
            <p className="voucher-title">Khuyến mãi có sẵn</p>
            <div className="voucher-input-group" style={{ marginBottom: '5px' }}>
              <select 
                className="voucher-select voucher-input" 
                value={selectedVoucher}
                onChange={(e) => setSelectedVoucher(e.target.value)}
              >
                {vouchers.map(v => (
                  <option key={v.code} value={v.code}>{v.label}</option>
                ))}
              </select>
              <button className="voucher-btn" onClick={handleApplyDropdownVoucher}>Áp dụng</button>
            </div>
            {dropdownMessage.text && <p className={`voucher-msg ${dropdownMessage.type}`} style={{ marginBottom: '15px' }}>{dropdownMessage.text}</p>}

            <p className="voucher-title">Nhập mã từ trang Khuyến Mãi</p>
            <div className="voucher-input-group">
              <input 
                type="text" 
                className="voucher-input" 
                placeholder="VD: KFTDAY50"
                value={manualVoucherCode}
                onChange={(e) => setManualVoucherCode(e.target.value)}
              />
              <button className="voucher-btn" onClick={handleApplyManualVoucher}>Áp dụng</button>
            </div>
            {manualMessage.text && <p className={`voucher-msg ${manualMessage.type}`}>{manualMessage.text}</p>}
          </div>

          <div className="summary-row">
            <span className="subtotal-price">Tạm tính:</span>
            <span>{formatPrice(subTotal)}</span>
          </div>
          
          {discount > 0 && (
            <div className="summary-row discount-row">
              <span>Giảm giá:</span>
              <span className="discount-price">- {formatPrice(discount)}</span>
            </div>
          )}

          <div className="summary-row total-row">
            <span>Tổng tiền:</span>
            <span className="total-price">{formatPrice(finalTotal)}</span>
          </div>
          
          <button className="checkout-btn">Thanh toán</button>
          <button className="continue-shopping-btn" onClick={() => navigate('/')}>Tiếp tục mua sắm</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;