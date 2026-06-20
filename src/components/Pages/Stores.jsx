
import React, { useState, useEffect } from 'react';
import './Stores.css';

const Stores = () => {
  const cities = ['Tất cả', 'Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng'];
  
  const [selectedCity, setSelectedCity] = useState('Tất cả');
  
  const storeList = [
    {
      id: 1,
      name: "KFT Nguyễn Ảnh Thủ",
      city: "Hồ Chí Minh",
      address: "Số 392 Nguyễn Ảnh Thủ, Phường Hiệp Thành, Quận 12, TP. HCM",
      phone: "028 7300 1234",
      time: "09:00 - 22:00",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.474929299499!2d106.62423717583925!3d10.851432457805175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752a23d8555555%3A0x1b5a5c69b7f9fc!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEtpbmggdOG6vyAtIEvhu7kgdGh14bqt dCBUUC5IQ00!5e0!3m2!1svi!2s!4v1710000000000!3m2!1svi!2s"
    },
    {
      id: 2,
      name: "KFT Quang Trung",
      city: "Hồ Chí Minh",
      address: "Số 102 Quang Trung, Phường 10, Quận Gò Vấp, TP. HCM",
      phone: "028 7300 5678",
      time: "08:30 - 22:30",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.925247953258!2d106.6561121!3d10.8166712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ5JzAwLjAiTiAxMDbCsDM5JzIyLjAiRQ!5e0!3m2!1svi!2s!4v1710000000001"
    },
    {
      id: 3,
      name: "KFT Bà Triệu",
      city: "Hà Nội",
      address: "Số 191 Bà Triệu, Phường Lê Đại Hành, Quận Hai Bà Trưng, Hà Nội",
      phone: "024 7300 9999",
      time: "09:00 - 22:00",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.4855845688556!2d105.8474241!3d21.0132336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDAwJzQ3LjYiTiAxMDXCsDUwJzUwLjciRQ!5e0!3m2!1svi!2s!4v1710000000002"
    },
    {
      id: 4,
      name: "KFT Cầu Giấy",
      city: "Hà Nội",
      address: "Số 233 Cầu Giấy, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội",
      phone: "024 7300 8888",
      time: "09:00 - 22:00",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.897745314979!2d105.7989505!3d21.0367803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDAyJzEyLjQiTiAxMDXCsDQ3JzU2LjIiRQ!5e0!3m2!1svi!2s!4v1710000000003"
    },
    {
      id: 5,
      name: "KFT Điện Biên Phủ",
      city: "Đà Nẵng",
      address: "Số 456 Điện Biên Phủ, Phường Hòa Khê, Quận Thanh Khê, Đà Nẵng",
      phone: "0236 730 1111",
      time: "09:00 - 22:00",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.897745314979!2d108.1989505!3d16.0667803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDA0JzAwLjQiTiAxMDjCsDExJzU2LjIiRQ!5e0!3m2!1svi!2s!4v1710000000004"
    }
  ];

  const [activeMap, setActiveMap] = useState(storeList[0].mapUrl);
  const [activeStoreId, setActiveStoreId] = useState(storeList[0].id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredStores = storeList.filter(store => 
    selectedCity === 'Tất cả' || store.city === selectedCity
  );

  const handleSelectStore = (store) => {
    setActiveMap(store.mapUrl);
    setActiveStoreId(store.id);
  };

  return (
    <div className="stores-page-container">
      <div className="stores-hero-banner">
        <h1>Hệ Thống Cửa Hàng KFT</h1>
        <p>Tìm ngay cửa hàng KFT gần bạn nhất để thưởng thức gà rán nóng hổi</p>
      </div>

      <div className="stores-main-content">
        <div className="stores-sidebar-list">
          <div className="city-filter-box">
            <h3>Chọn Tỉnh / Thành phố:</h3>
            <div className="city-tabs">
              {cities.map((city) => (
                <button
                  key={city}
                  className={`city-tab-btn ${selectedCity === city ? 'is-active' : ''}`}
                  onClick={() => setSelectedCity(city)}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div className="stores-cards-scroll">
            <p className="stores-count-text">Tìm thấy <b>{filteredStores.length}</b> cửa hàng tương ứng</p>
            {filteredStores.map((store) => (
              <div 
                key={store.id} 
                className={`store-info-card ${activeStoreId === store.id ? 'active-border' : ''}`}
                onClick={() => handleSelectStore(store)}
              >
                <h4>{store.name}</h4>
                <p className="store-detail-row">
                  <i className="fas fa-map-marker-alt"></i> <span>{store.address}</span>
                </p>
                <p className="store-detail-row">
                  <i className="fas fa-phone-alt"></i> <span>{store.phone}</span>
                </p>
                <p className="store-detail-row">
                  <i className="fas fa-clock"></i> <span>{store.time} (Cả tuần)</span>
                </p>
                <button type="button" className="view-map-trigger-btn">
                  <i className="fas fa-directions"></i> Xem vị trí trên bản đồ
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="stores-map-display-panel">
          <iframe
            src={activeMap}
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: '16px' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="KFT Store Map Locator"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Stores;