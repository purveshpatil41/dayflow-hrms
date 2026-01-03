import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';
import './Navbar.css';

const Navbar = ({ userName, userRole }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <nav 
      className="navbar navbar-expand-lg sticky-top shadow-sm" 
      style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderBottom: 'none'
      }}
    >
      <div className="container-fluid px-4" style={{ background: 'transparent' }}>
        <div className="d-flex align-items-center">
          <h5 className="mb-0 fw-bold" style={{ color: '#ffffff', fontSize: '1.5rem' }}>Dayflow</h5>
          <span className="ms-3 small" style={{ color: '#ffffff', fontWeight: '400', opacity: '0.9' }}>Every workday, perfectly aligned.</span>
        </div>
        
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <div className="text-end">
              <div className="fw-semibold small" style={{ color: '#ffffff' }}>{userName}</div>
              <div style={{ fontSize: '0.75rem', color: '#ffffff', opacity: '0.85' }}>{userRole}</div>
            </div>
            <div className="dropdown">
              <button
                className="btn rounded-circle d-flex align-items-center justify-content-center"
                style={{ 
                  width: '40px', 
                  height: '40px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: '#ffffff'
                }}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <i className="bi bi-person-circle fs-5" style={{ color: '#ffffff' }}></i>
              </button>
              {showDropdown && (
                <div className="dropdown-menu dropdown-menu-end show" style={{ position: 'absolute', right: 0 }}>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
