import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Aboutus.css';

const Aboutus = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-container">
      <div className="about-hero">
        <h1>Về chúng tôi</h1>
        <p>Khám phá câu chuyện phía sau hương vị Gà rán KFT trứ danh</p>
      </div>

      <div className="about-content">
        <div className="about-grid">
          <div className="about-text">
            <h2>Câu chuyện của KFT</h2>
            <p>
              Ra đời với niềm đam mê mang đến những bữa ăn nhanh ngon miệng, tiện lợi và chất lượng nhất, <strong>KFT (Khắc Phục Tốt - Gà Rán Khủng)</strong> đã không ngừng phát triển để trở thành điểm đến yêu thích của hàng triệu thực khách.
            </p>
            <p>
              Chúng tôi tự hào sử dụng 100% nguyên liệu gà tươi được kiểm định nghiêm ngặt, kết hợp cùng công thức tẩm ướp gia vị bí truyền, tạo nên lớp vỏ giòn rụm hoàn hảo và từng thớ thịt mọng nước bên trong. KFT không chỉ là thức ăn nhanh, mà là trải nghiệm ẩm thực tuyệt vời!
            </p>
          </div>
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800" alt="Gà rán KFT" />
          </div>
        </div>
      </div>

      <div className="about-values">
        <h2>Giá trị cốt lõi</h2>
        <div className="values-grid">
          <div className="value-card">
            <i className="fas fa-drumstick-bite"></i>
            <h3>Nguyên liệu tươi sạch</h3>
            <p>Cam kết sử dụng gà tươi 100% trong ngày, tuyệt đối không dùng thực phẩm đông lạnh lâu ngày.</p>
          </div>
          <div className="value-card">
            <i className="fas fa-fire"></i>
            <h3>Hương vị độc bản</h3>
            <p>Công thức tẩm ướp độc quyền giúp món ăn có vị ngon đậm đà, giòn tan khó cưỡng.</p>
          </div>
          <div className="value-card">
            <i className="fas fa-motorcycle"></i>
            <h3>Giao hàng thần tốc</h3>
            <p>Đảm bảo món ăn đến tay khách hàng luôn trong trạng thái nóng hổi nhất chỉ trong 30 phút.</p>
          </div>
          <div className="value-card">
            <i className="fas fa-smile-beam"></i>
            <h3>Phục vụ tận tâm</h3>
            <p>Nụ cười và sự hài lòng của thực khách chính là thước đo thành công lớn nhất của KFT.</p>
          </div>
        </div>
      </div>

      <div className="about-cta">
        <h2>Bạn đã sẵn sàng thưởng thức?</h2>
        <p>Hàng ngàn món ngon đang chờ đón bạn.</p>
        <button className="about-btn" onClick={() => navigate('/')}>
          Xem Thực Đơn Ngay
        </button>
      </div>
    </div>
  );
};

export default Aboutus;