import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';
import './Sidebar.css';

const Sidebar = ({ menuItems, role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <div className="sidebar bg-gradient shadow-sm">
      <div className="sidebar-header p-4 border-bottom">
        <h4 className="mb-0 text-white fw-bold">Dayflow</h4>
        <p className="mb-0 text-white-50 small">HRMS Portal</p>
      </div>
      
      <div className="sidebar-menu p-3">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-item d-flex align-items-center gap-3 p-3 rounded mb-2 text-decoration-none ${
                isActive ? 'active' : ''
              }`
            }
          >
            <i className={`bi ${item.icon} fs-5`}></i>
            <span className="fw-medium">{item.label}</span>
          </NavLink>
        ))}
        
        <button
          onClick={handleLogout}
          className="sidebar-item logout-btn d-flex align-items-center gap-3 p-3 rounded mb-2 w-100 border-0"
        >
          <i className="bi bi-box-arrow-left fs-5"></i>
          <span className="fw-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
