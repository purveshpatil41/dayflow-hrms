import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';

const Navbar = ({ userName, userRole }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top shadow-sm">
      <div className="container-fluid px-4">
        <div className="d-flex align-items-center">
          <h5 className="mb-0 fw-bold text-primary">Dayflow</h5>
          <span className="ms-3 text-muted small">Every workday, perfectly aligned.</span>
        </div>
        
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <div className="text-end">
              <div className="fw-semibold small">{userName}</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>{userRole}</div>
            </div>
            <div className="dropdown">
              <button
                className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '40px', height: '40px' }}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <i className="bi bi-person-circle fs-5"></i>
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
