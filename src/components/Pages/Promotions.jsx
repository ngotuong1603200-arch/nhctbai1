import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Promotions.css';

const Promotions = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const promoList = [
    {
      id: 1,
      title: "KFT Day - Giảm 50% Gà Rán",
      discount: "GIẢM 50%",
      validUntil: "30/06/2026",
      code: "KFTDAY50",
      description: "Mỗi thứ 4 hàng tuần, giảm ngay 50% cho tất cả các phần gà rán truyền thống và gà sốt Hàn Quốc khi nhập mã.",
      image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 2,
      title: "Freeship Toàn Mặt Trận",
      discount: "FREESHIP",
      validUntil: "31/12/2026",
      code: "FREESHPKFT",
      description: "Miễn phí giao hàng cho mọi đơn hàng từ 150.000đ trở lên trong bán kính 5km. Không giới hạn số lần sử dụng.",
      image: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 3,
      title: "Mua 1 Tặng 1 Pizza",
      discount: "TẶNG 1",
      validUntil: "15/07/2026",
      code: "PIZZAB1G1",
      description: "Mua 1 Pizza size L bất kỳ tặng ngay 1 Pizza size S (hương vị tự chọn) cùng 2 ly Pepsi mát lạnh.",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 4,
      title: "Giảm 30K Cho Khách Mới",
      discount: "GIẢM 30K",
      validUntil: "Hết hạn khi đủ số lượng",
      code: "NEWKFT30",
      description: "Chào bạn mới! Nhập mã giảm ngay 30.000đ cho đơn hàng đầu tiên thanh toán qua ứng dụng KFT.",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 5,
      title: "Combo Gà Phô Mai 99K",
      discount: "CHỈ 99K",
      validUntil: "20/06/2026",
      code: "KHONG CAN MA",
      description: "Đại tiệc phô mai với 2 miếng gà phủ phô mai, 1 khoai tây chiên và 1 nước ngọt chỉ với giá 99.000đ.",
      image: "https://images.unsplash.com/photo-1593504049359-74330189a345?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 6,
      title: "Sinh Nhật Rộn Ràng - Tặng Bánh",
      discount: "QUÀ TẶNG",
      validUntil: "Áp dụng trong tháng sinh nhật",
      code: "KFTBDAY",
      description: "Đến KFT tổ chức sinh nhật, nhận ngay 1 bánh Tiramisu cao cấp và ưu đãi giảm 10% tổng bill.",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600"
    }
  ];

  const handleCopyCode = (code) => {
    if (code === "KHONG CAN MA") {
      alert("Chương trình này áp dụng trực tiếp, không cần nhập mã bạn nhé!");
      return;
    }
    navigator.clipboard.writeText(code);
    alert(`Đã copy mã: ${code}`);
  };

  return (
    <div className="promo-container">
      <div className="promo-hero">
        <h1>Khuyến Mãi Khủng</h1>
        <p>Săn ngay deal hời, ăn ngon không lo xẹp ví cùng KFT</p>
      </div>

      <div className="promo-content">
        <div className="promo-grid">
          {promoList.map((promo) => (
            <div className="promo-card" key={promo.id}>
              <div className="promo-image-box">
                <span className="promo-badge">{promo.discount}</span>
                <img src={promo.image} alt={promo.title} />
              </div>
              <div className="promo-body">
                <h3 className="promo-title">{promo.title}</h3>
                <p className="promo-desc">{promo.description}</p>
                <div className="promo-validity">
                  <i className="far fa-clock"></i> HSD: {promo.validUntil}
                </div>
                <div className="promo-coupon">
                  <span className="promo-code">{promo.code}</span>
                  <button className="copy-btn" onClick={() => handleCopyCode(promo.code)}>
                    Lấy Mã
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Promotions;