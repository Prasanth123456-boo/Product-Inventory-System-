import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(location.pathname);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  return (
    <div>
      <div className="primary-menu">
        <ul className="nav border border-1 rounded">
          <li className={`nav-item ${activeMenu === '/' ? 'active ' : ''}`}>
            <Link
              to="/"
              className="nav-link dropdown-toggle-nocaret text-dark"
              onClick={() => handleMenuClick('/')}
            >
              <div className="menu-title d-flex align-items-center">
                Product
              </div>
            </Link>
          </li>
          <li className={`nav-item ${activeMenu === '/add-product' ? 'active ' : ''}`}>
            <Link
              to="/add-product"
              className="nav-link dropdown-toggle-nocaret text-dark"
              onClick={() => handleMenuClick('/add-product')}
            >
              <div className="menu-title d-flex align-items-center">
                Add Product
              </div>
            </Link>
          </li>
          <li className={`nav-item ${activeMenu === '/manage-stock' ? 'active ' : ''}`}>
            <Link
              to="/manage-stock"
              className="nav-link dropdown-toggle-nocaret text-dark"
              onClick={() => handleMenuClick('/manage-stock')}
            >
              <div className="menu-title d-flex align-items-center">
                Stock Management
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
