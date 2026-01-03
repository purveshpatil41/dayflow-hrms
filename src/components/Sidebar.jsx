import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';
import './Sidebar.css';

const Sidebar = ({ menuItems, role, activeView = 'dashboard' }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <div 
      className="sidebar shadow-sm" 
      style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        width: '280px',
        minHeight: '100vh',
        position: 'fixed',
        left: '0',
        top: '0',
        zIndex: '1000'
      }}
    >
      <div className="sidebar-header p-4 border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <h4 className="mb-0 fw-bold" style={{ color: '#ffffff' }}>Dayflow</h4>
        <p className="mb-0 small" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>HRMS Portal</p>
      </div>
      
      <div className="sidebar-menu p-3">
        {menuItems.map((item, index) => {
          const isActive = item.path?.includes(activeView) || 
                          (activeView === 'dashboard' && index === 0);
          
          return (
            <div
              key={index}
              onClick={(e) => {
                e.preventDefault();
                if (item.onClick) {
                  item.onClick();
                }
              }}
              className={`sidebar-item d-flex align-items-center gap-3 p-3 rounded mb-2 text-decoration-none ${isActive ? 'active' : ''}`}
              style={{ 
                cursor: 'pointer',
                color: '#ffffff',
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent'
              }}
            >
              <i className={`bi ${item.icon} fs-5`} style={{ color: '#ffffff' }}></i>
              <span className="fw-medium" style={{ color: '#ffffff' }}>{item.label}</span>
            </div>
          );
        })}
        
        <button
          onClick={handleLogout}
          className="sidebar-item logout-btn d-flex align-items-center gap-3 p-3 rounded mb-2 w-100 border-0"
          style={{ 
            backgroundColor: 'transparent',
            color: '#ffffff'
          }}
        >
          <i className="bi bi-box-arrow-left fs-5" style={{ color: '#ffffff' }}></i>
          <span className="fw-medium" style={{ color: '#ffffff' }}>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
