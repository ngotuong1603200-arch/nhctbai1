import React, { useState, useEffect, useRef, useMemo } from 'react';
// Sửa lại dòng import ở trên cùng của Header.jsx
import { useNavigate, Link } from 'react-router-dom';
import './Header.css';
import logoImage from '../../img/logo.png';
import { imageMap } from '../../utils/ProductImages';
import { normalizeSearchText, rankProductsBySearch }
  from '../../utils/ProductSearch';

const jsonBase = import.meta.env.BASE_URL || '/';

// 1. SỬA CHỖ NÀY: Nhận thêm prop onOpenLogin
const Header = ({ onOpenLogin }) => {
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const searchBoxRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();

  const searchMatches = useMemo(
    () => rankProductsBySearch(products, searchQuery, 10),
    [products, searchQuery]
  );

  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem('cart');
      if (!savedCart) {
        setCartCount(0);
      } else {
        try {
          const cart = JSON.parse(savedCart);
          const totalItems = cart.reduce(
            (sum, item) => sum + (item.quantity || 0),
            0
          );
          setCartCount(totalItems);
        } catch (error) {
          console.error('Lỗi đọc giỏ hàng:', error);
          setCartCount(0);
        }
      }
    };

    const updateCurrentUser = () => {
      const savedUser = localStorage.getItem('currentUser');
      if (!savedUser) {
        setCurrentUser(null);
        return;
      }
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      } catch (error) {
        console.error('Lỗi đọc thông tin người dùng:', error);
        setCurrentUser(null);
      }
    };

    updateCartCount();
    updateCurrentUser();

    const onStorageSync = () => {
      updateCartCount();
      updateCurrentUser();
    };

    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('userUpdated', updateCurrentUser);
    window.addEventListener('storage', onStorageSync);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('userUpdated', updateCurrentUser);
      window.removeEventListener('storage', onStorageSync);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${jsonBase}products.json`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const mapped = data.map((item) => ({
          ...item,
          image: imageMap[item.imageKey] || item.image
        }));
        setProducts(mapped);
      } catch (err) {
        console.error('Lỗi tải sản phẩm cho tìm kiếm:', err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!searchFocused) return;
    const onPointerDown = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [searchFocused]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const onPointerDown = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [userMenuOpen]);

  useEffect(() => {
    if (!currentUser) setUserMenuOpen(false);
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUserMenuOpen(false);
    window.dispatchEvent(new Event('userUpdated'));
    navigate('/');
  };

  const goToProduct = (product) => {
    setSearchQuery('');
    setSearchFocused(false);
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = normalizeSearchText(searchQuery);
    if (!q) return;
    setSearchFocused(false);
    navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const userLabel = currentUser ? (currentUser.name || currentUser.user) : 'Đăng nhập';

  // Dropdown menu cho Thức ăn nhanh
  const foodMenuItems = [
    { text: 'Gà rán & Burger', href: '/category/ga-ran-burger' },
    { text: 'Pizza & Mì Ý', href: '/category/pizza-mi-y' },
    { text: 'Món ăn kèm', href: '/category/mon-an-kem' },
    { text: 'Thức uống & Tráng miệng', href: '/category/thuc-uong' }
  ];

  return (
    <header className="main-header">
      <div className="header-top-bar">
        <div className="header-top-content">
          <div className="header-delivery-info">
            <span className="delivery-text">Hỗ trợ khách hàng</span>
            <i className="fas fa-phone delivery-icon"></i>
            <span className="delivery-phone">1900 1234</span>
            <div className="delivery-scooter">
              <i className="fas fa-truck"></i>
            </div>
          </div>

          <div className="header-logo-container">
            <div className="shop-logo">
              <button
                type="button"
                className="header-logo-btn"
                onClick={() => navigate('/')}
                aria-label="Về trang chủ"
              >
                <img src={logoImage} alt="Logo" className="header-logo-image" />
              </button>
            </div>
          </div>

          <div className="header-user-actions">
            {currentUser ? (
              <div className="header-user-menu" ref={userMenuRef}>
                <button
                  type="button"
                  className="login-link header-user-menu_trigger"
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen}
                  onClick={() => setUserMenuOpen((o) => !o)}
                >
                  {userLabel}
                  <i className={`fas fa-chevron-down header-user-menu_caret ${userMenuOpen ? 'is-open' : ''}`} aria-hidden />
                </button>
                {userMenuOpen && (
                  <div className="header-user-dropdown" role="menu">
                    {/* Dùng Link cho trang Hồ sơ */}
                    <Link
                      to="/profile"
                      className="header-user-dropdown_item"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Hồ sơ
                    </Link>

                    {/* Kiểm tra quyền Admin hoặc Staff để hiển thị nút Quản trị */}
                    {(currentUser.role === 'admin' || currentUser.role === 'staff') && (
                      <Link
                        to="/admin"
                        className="header-user-dropdown_item"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Quản trị
                      </Link>
                    )}

                    <button
                      type="button"
                      className="header-user-dropdown_item header-user-dropdown_item--logout"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                className="login-link"
                // 2. SỬA CHỖ NÀY: Đổi sự kiện onClick để mở Popup
                onClick={onOpenLogin}
              >
                Đăng nhập
              </button>
            )}
            <span className="action-separator"> </span>
            <div className="language-selector">
              <span className="lang-active">VN</span>
              <span className="lang-separator">|</span>
              <span className="lang-option">EN</span>
            </div>
            <button
              className="cart-button"
              onClick={() => navigate('/cart')}
            >
              <i className="fas fa-shopping-cart"></i>
              <span>Giỏ hàng</span>
              <span className="cart-badge">{cartCount}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="header-search-strip" aria-label="Tìm kiếm">
        <div className="header-search-strip_inner" ref={searchBoxRef}>
          <form
            className="header-search_form"
            onSubmit={handleSearchSubmit}
            role="search"
          >
            <i className="fas fa-search header-search_icon" aria-hidden />
            <input
              type="search"
              className="header-search_input"
              placeholder="Bạn muốn tìm sản phẩm gì..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              aria-label="Tìm kiếm sản phẩm"
              aria-autocomplete="list"
              aria-controls="header-search-suggestions"
              autoComplete="off"
            />
            <button type="submit" className="header-search_submit">
              Tìm
            </button>
          </form>
          {searchFocused && searchQuery.trim().length > 0 && (
            <ul
              id="header-search-suggestions"
              className="header-search_dropdown"
              role="listbox"
              aria-label="Gợi ý sản phẩm"
            >
              {searchMatches.length === 0 ? (
                <li className="header-search_empty" role="status">
                  Không tìm thấy sản phẩm gần giống. Thử từ khóa khác.
                </li>
              ) : (
                searchMatches.map((p) => (
                  <li key={p.id} role="presentation">
                    <button
                      type="button"
                      className="header-search_option"
                      role="option"
                      onClick={() => goToProduct(p)}
                    >
                      <span className="header-search_thumb-wrap">
                        <img
                          src={p.image || 'https://via.placeholder.com/88'}
                          alt={p.name}
                          className="header-search_thumb"
                          loading="lazy"
                        />
                      </span>
                      <span className="header-search_meta">
                        <span className="header-search_name">{p.name}</span>
                        {p.currentPrice && (
                          <span className="header-search_price">
                            {p.currentPrice}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Bottom Section: Navigation Bar - Cập nhật cho Thức ăn nhanh */}
      <nav className="header-navigation" aria-label="Điều hướng chính">
        <div className="nav-content">
          <a href="/" className="nav-link">TRANG CHỦ</a>

          {/* THỰC ĐƠN với Dropdown */}
          <div
            className="nav-item-with-dropdown"
            onMouseEnter={() => setHoveredMenu('menu')}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <a href="/menu" className={`nav-link ${hoveredMenu === 'menu' ? 'active' : ''}`}>
              THỰC ĐƠN
            </a>
            {hoveredMenu === 'menu' && (
              <div className="dropdown-menu">
                {foodMenuItems.map((item, index) => (
                  /* Đổi từ thẻ a href thành thẻ Link to */
                  <Link
                    key={index}
                    to={item.href}
                    className="dropdown-item"
                  >
                    {item.text}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <a href="/combo" className="nav-link">COMBO ƯU ĐÃI</a>
          <a href="/promotions" className="nav-link">KHUYẾN MÃI</a>
          <a href="/stores" className="nav-link">HỆ THỐNG CỬA HÀNG</a>
          <a href="/news" className="nav-link">TIN TỨC</a>
          <a href="/about" className="nav-link">VỀ CHÚNG TÔI</a>
        </div>
      </nav>
    </header>
  );
};

export default Header;