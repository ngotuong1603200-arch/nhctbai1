import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './News.css';

const News = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const newsList = [
    {
      id: 1,
      title: "KFT tưng bừng khai trương chi nhánh thứ 50",
      date: "15/06/2026",
      category: "Sự kiện",
      summary: "Đánh dấu cột mốc quan trọng, KFT chính thức mở cửa chi nhánh thứ 50 với hàng ngàn phần quà hấp dẫn dành cho 100 khách hàng đầu tiên.",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 2,
      title: "Ra mắt Combo 'Gà Rán Học Đường' siêu tiết kiệm",
      date: "10/06/2026",
      category: "Khuyến mãi",
      summary: "Đồng hành cùng các bạn học sinh, sinh viên, KFT ra mắt combo mới cực no bụng chỉ với 45.000đ. Đã rẻ nay còn rẻ hơn!",
      image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 3,
      title: "Khám phá bí mật lớp vỏ giòn rụm của gà rán KFT",
      date: "05/06/2026",
      category: "Câu chuyện",
      summary: "Bạn có bao giờ thắc mắc tại sao gà rán KFT lại giữ được độ giòn lâu đến vậy? Cùng vào bếp khám phá công thức tẩm bột độc quyền của chúng tôi.",
      image: "https://images.unsplash.com/photo-1626804475297-41609ea0aa4eb?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 4,
      title: "KFT đồng hành cùng chiến dịch 'Mùa Hè Xanh'",
      date: "01/06/2026",
      category: "Cộng đồng",
      summary: "Hàng trăm suất ăn nóng hổi đã được KFT gửi tặng đến các chiến sĩ tình nguyện trong chiến dịch Mùa Hè Xanh năm nay.",
      image: "https://images.unsplash.com/photo-1593504049359-74330189a345?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 5,
      title: "Pizza hải sản nhiệt đới - 'Tân binh' phá đảo thực đơn",
      date: "25/05/2026",
      category: "Sản phẩm mới",
      summary: "Không chỉ có gà rán, KFT vừa bổ sung dòng Pizza hải sản với tôm, mực tươi rói phủ ngập phô mai béo ngậy. Thử ngay hôm nay!",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 6,
      title: "Hướng dẫn nhận Voucher giảm giá 50% qua App",
      date: "20/05/2026",
      category: "Hướng dẫn",
      summary: "Chỉ với 3 bước đơn giản đăng nhập vào hệ thống, bạn sẽ nhận ngay mã giảm giá cực khủng cho lần đặt hàng tiếp theo.",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600"
    }
  ];

  return (
    <div className="news-container">
      <div className="news-hero">
        <h1>Tin Tức & Sự Kiện</h1>
        <p>Cập nhật những thông tin, khuyến mãi và câu chuyện mới nhất từ KFT</p>
      </div>

      <div className="news-content">
        <div className="news-grid">
          {newsList.map((item) => (
            <div className="news-card" key={item.id}>
              <div className="news-card-image">
                <span className="news-category">{item.category}</span>
                <img src={item.image} alt={item.title} />
              </div>
              <div className="news-card-body">
                <span className="news-date">
                  <i className="far fa-calendar-alt"></i> {item.date}
                </span>
                <h3 className="news-title">{item.title}</h3>
                <p className="news-summary">{item.summary}</p>
                <button className="news-readmore" onClick={() => alert('Chức năng xem chi tiết bài viết đang được cập nhật!')}>
                  Đọc tiếp <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;