import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as authService from '../services/authService';
import './Auth.css';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    employeeId: '',
    email: '',
    password: '',
    role: 'Employee'
  });
  const [loading, setLoading] = useState(false);

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Attempting login for:', loginForm.email);
      const response = await authService.login(loginForm);
      console.log('Login response:', response);
      if (response.success) {
        toast.success('Login successful! Redirecting...');
        console.log('Login Successful', response.data);
        
        const userRole = response.data.user.role;
        const redirectPath = userRole === 'Admin' || userRole === 'HR' 
          ? '/admin/dashboard' 
          : '/employee/dashboard';
        
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 1500);
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      
      if (error.response?.data?.emailNotVerified) {
        toast.error('📧 Email not verified! Please check your inbox and verify your email first.', {
          autoClose: 7000,
        });
      } else {
        toast.error(error.response?.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.register(registerForm);
      if (response.success) {
        toast.success('Registration successful!');
        toast.info('📧 Verification email sent! Please check your inbox and verify your email before logging in.', {
          autoClose: 7000,
          position: 'top-center',
        });
        setRegisterForm({
          fullName: '',
          employeeId: '',
          email: '',
          password: '',
          role: 'Employee'
        });
        setTimeout(() => {
          setActiveTab('login');
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-left">
          <div className="auth-branding">
            <h1 className="brand-name">Dayflow</h1>
            <p className="brand-tagline">Every workday, perfectly aligned.</p>
            <p className="brand-description">
              Streamline your HR operations with intelligent automation. 
              Manage attendance, leaves, payroll, and performance reviews 
              all in one unified platform designed for modern workplaces.
            </p>
            <div className="brand-features">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Smart Attendance Tracking</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Automated Leave Management</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Real-time Analytics</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </div>

          {activeTab === 'login' && (
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <h2 className="form-title">Welcome Back</h2>
              <p className="form-subtitle">Login to access your dashboard</p>

              <div className="form-group">
                <label htmlFor="login-email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="login-password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="login-password"
                  name="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  required
                />
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login to Dashboard'}
              </button>
            </form>
          )}

          {activeTab === 'register' && (
            <form className="auth-form" onSubmit={handleRegisterSubmit}>
              <h2 className="form-title">Create Account</h2>
              <p className="form-subtitle">Register to get started with Dayflow</p>

              <div className="form-group">
                <label htmlFor="register-fullname" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  id="register-fullname"
                  name="fullName"
                  className="form-control"
                  placeholder="Enter your full name"
                  value={registerForm.fullName}
                  onChange={handleRegisterChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-empid" className="form-label">
                  Employee ID
                </label>
                <input
                  type="text"
                  id="register-empid"
                  name="employeeId"
                  className="form-control"
                  placeholder="Enter employee ID"
                  value={registerForm.employeeId}
                  onChange={handleRegisterChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="register-email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="register-password"
                  name="password"
                  className="form-control"
                  placeholder="Create a password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-role" className="form-label">
                  Role
                </label>
                <select
                  id="register-role"
                  name="role"
                  className="form-control"
                  value={registerForm.role}
                  onChange={handleRegisterChange}
                  required
                >
                  <option value="Employee">Employee</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Auth;
