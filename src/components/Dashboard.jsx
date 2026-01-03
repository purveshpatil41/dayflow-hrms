import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    const token = authService.getToken();

    if (!token || !currentUser) {
      navigate('/');
      return;
    }

    setUser(currentUser);
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">Dayflow</h1>
          <p className="dashboard-subtitle">Human Resource Management System</p>
        </div>
        <div className="header-right">
          <div className="user-info">
            <div className="user-details">
              <span className="user-name">{user.email}</span>
              <span className="user-role">{user.role}</span>
              <span className="user-id">ID: {user.employeeId}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome to Dayflow HRMS!</h2>
          <p>You have successfully logged in to your account.</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon attendance">📊</div>
            <h3>Attendance</h3>
            <p>Track and manage your attendance records</p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon leaves">🏖️</div>
            <h3>Leave Management</h3>
            <p>Apply for leaves and check balance</p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon payroll">💰</div>
            <h3>Payroll</h3>
            <p>View salary slips and payment history</p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon performance">⭐</div>
            <h3>Performance</h3>
            <p>Track your performance reviews</p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon team">👥</div>
            <h3>Team</h3>
            <p>Connect with your team members</p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon reports">📈</div>
            <h3>Reports</h3>
            <p>Generate and view detailed reports</p>
          </div>
        </div>

        <div className="user-profile-section">
          <h3>Your Profile</h3>
          <div className="profile-info">
            <div className="info-item">
              <span className="info-label">Employee ID:</span>
              <span className="info-value">{user.employeeId}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Role:</span>
              <span className="info-value">{user.role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
