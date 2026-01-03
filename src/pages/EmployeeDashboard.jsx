import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';
import ProfileSection from '../components/ProfileSection';
import AttendanceSection from '../components/AttendanceSection';
import LeaveRequestSection from '../components/LeaveRequestSection';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    const token = authService.getToken();

    if (!token || !currentUser) {
      navigate('/');
      return;
    }

    if (currentUser.role !== 'Employee') {
      navigate('/admin/dashboard');
      return;
    }

    setUser(currentUser);
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: 'bi-person' },
    { id: 'attendance', label: 'Attendance', icon: 'bi-calendar-check' },
    { id: 'leave', label: 'Leave Requests', icon: 'bi-calendar-x' },
  ];

  if (loading || !user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection user={user} />;
      case 'attendance':
        return <AttendanceSection />;
      case 'leave':
        return <LeaveRequestSection />;
      default:
        return <ProfileSection user={user} />;
    }
  };

  return (
    <div className="employee-dashboard-wrapper">
      {/* Fixed Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header p-4">
          <h4 className="mb-0 text-white fw-bold">Dayflow</h4>
          <p className="mb-0 text-white-50 small">HRMS Portal</p>
        </div>

        <div className="sidebar-menu p-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`sidebar-menu-item ${activeSection === item.id ? 'active' : ''}`}
            >
              <i className={`bi ${item.icon} fs-5 me-3`}></i>
              <span className="fw-medium">{item.label}</span>
            </button>
          ))}

          <button onClick={handleLogout} className="sidebar-menu-item logout-btn mt-4">
            <i className="bi bi-box-arrow-left fs-5 me-3"></i>
            <span className="fw-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-main-content">
        {/* Top Navbar */}
        <div className="dashboard-navbar">
          <div className="container-fluid px-4 py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0 fw-bold text-primary">Dayflow</h5>
                <small className="text-muted">Every workday, perfectly aligned.</small>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="text-end">
                  <div className="fw-semibold small">{user.email}</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>{user.role}</div>
                </div>
                <div className="user-avatar">
                  <i className="bi bi-person-circle fs-3"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="dashboard-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
