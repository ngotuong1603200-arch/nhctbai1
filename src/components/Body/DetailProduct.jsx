import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { imageMap } from '../../utils/ProductImages';
import './DetailProduct.css';

const DetailProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(location.state?.product || null);
  const [isLoading, setIsLoading] = useState(!location.state?.product);
  const [error, setError] = useState(null);
  
  // Khởi tạo state số lượng
  const [quantity, setQuantity] = useState(1);
  
  // 1. MỚI THÊM: State lưu size đang chọn (mặc định là S)
  const [selectedSize, setSelectedSize] = useState('S');

  useEffect(() => {
    if (product) return;
    const fetchProduct = async () => {
      try {
        const response = await fetch('/products.json');
        if (!response.ok) throw new Error('Không thể tải thông tin sản phẩm');
        const data = await response.json();
        const found = data.find((item) => String(item.id) === String(id));
        if (!found) throw new Error('Sản phẩm không tồn tại');
        setProduct({ ...found, image: imageMap[found.imageKey] || found.image });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id, product]);

  // 2. MỚI THÊM: Hàm tính lại giá tiền theo Size
  const getFinalPrice = () => {
    let basePrice = 0;
    
    // Tách lấy phần số từ giá của thầy (Ví dụ: "50.000đ" -> 50000)
    if (typeof product.currentPrice === 'string') {
      basePrice = parseInt(product.currentPrice.replace(/\D/g, '')) || 0;
    } else {
      basePrice = product.currentPrice || 0;
    }

    // Cộng thêm tiền bằng if/else đơn giản
    let extraPrice = 0;
    if (selectedSize === 'M') extraPrice = 15000;
    if (selectedSize === 'L') extraPrice = 30000;

    // Trả về dạng chuỗi có dấu chấm và chữ đ
    return (basePrice + extraPrice).toLocaleString('vi-VN') + 'đ';
  };

  if (isLoading) return <div className="detail-container">Đang tải chi tiết sản phẩm...</div>;
  if (error) return <div className="detail-container">Lỗi: {error}</div>;
  if (!product) return null;

  return (
    <div className="detail-container">
      <button className="back-button" onClick={() => navigate(-1)}> ← Quay lại </button>

      <div className="detail-card">
        <div className="detail-image">
          <img src={product.image || 'https://via.placeholder.com/500x350'} alt={product.name} />
        </div>

        <div className="detail-info">
          <h2>{product.name}</h2>
          
          <p className="detail-description">
            {product.description || 'Món ăn thơm ngon, nóng hổi được chuẩn bị từ những nguyên liệu tươi sạch nhất. Thưởng thức ngay!'}
          </p>

          <p className="detail-price">
            {/* 3. ĐÃ CHỈNH SỬA: Gọi hàm getFinalPrice() thay vì in giá mặc định */}
            <span className="current-price">{getFinalPrice()}</span>
            {product.originalPrice && <span className="original-price">{product.originalPrice}</span>}
            {product.discount && <span className="discount">{product.discount}</span>}
          </p>

          <div className="detail-sizes">
            {/* 4. ĐÃ CHỈNH SỬA: Gắn sự kiện onClick và class 'active' cho nút chọn Size */}
            <button 
              className={`size-chip ${selectedSize === 'S' ? 'active' : ''}`}
              onClick={() => setSelectedSize('S')}
            >
              {product.sizeS || 'Size Nhỏ'}
            </button>
            <button 
              className={`size-chip ${selectedSize === 'M' ? 'active' : ''}`}
              onClick={() => setSelectedSize('M')}
            >
              {product.sizeM || 'Size Vừa'}
            </button>
            <button 
              className={`size-chip ${selectedSize === 'L' ? 'active' : ''}`}
              onClick={() => setSelectedSize('L')}
            >
              {product.sizeL || 'Size Lớn'}
            </button>
          </div>

          <div className="detail-meta">
            {product.rating && <span>{product.rating}</span>}
            {product.sold && <span>Đã bán {product.sold}</span>}
          </div>

          <div className="detail-quantity">
            <span className="quantity-label">Số lượng:</span>
            <div className="quantity-control">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
              <input type="text" readOnly value={quantity} />
              <button onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
          </div>

          <button className="buy-now-button" onClick={() => {
            const savedCart = localStorage.getItem('cart');
            const cart = savedCart ? JSON.parse(savedCart) : [];
            
            // 5. ĐÃ CHỈNH SỬA: Tách giỏ hàng theo Size (Mua Gà size S và Gà size M tính là 2 dòng riêng biệt)
            const existingItemIndex = cart.findIndex(item => item.id === product.id && item.selectedSize === selectedSize);

            if (existingItemIndex >= 0) {
              cart[existingItemIndex].quantity += quantity;
            } else {
              // Lưu thêm thông tin size và giá mới vào cart
              cart.push({ ...product, quantity: quantity, selectedSize: selectedSize, cartPrice: getFinalPrice() });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            window.dispatchEvent(new Event('cartUpdated'));
            navigate('/cart');
          }}>
            Mua ngay
          </button>

          <div className="detail-policies">
            <div className="policy-item">
              <i className="fas fa-truck"></i>
              <span>Giao hàng tận nơi trong 30 phút</span>
            </div>
            <div className="policy-item">
              <i className="fas fa-utensils"></i>
              <span>Nguyên liệu tươi ngon, an toàn 100%</span>
            </div>
            <div className="policy-item">
              <i className="fas fa-headset"></i>
              <span>Hỗ trợ đặt hàng nhanh: 1900 1234</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;