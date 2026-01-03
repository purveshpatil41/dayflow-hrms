import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './VerifyEmail.css';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [otpMode, setOtpMode] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (token) {
      verifyEmailToken();
    } else {
      setOtpMode(true);
      setVerifying(false);
    }
  }, [token]);

  const verifyEmailToken = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/auth/verify-email/${token}`);
      
      if (response.data.success) {
        setVerified(true);
        toast.success(response.data.message);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
      toast.error(err.response?.data?.message || 'Verification failed');
      setOtpMode(true);
    } finally {
      setVerifying(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        email,
        otp,
      });

      if (response.data.success) {
        setVerified(true);
        toast.success('Email verified successfully!');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (verifying) {
    return (
      <div className="verify-email-container">
        <div className="verify-email-card">
          <div className="verify-spinner">
            <div className="spinner-border text-primary" style={{ width: '4rem', height: '4rem' }}>
              <span className="visually-hidden">Verifying...</span>
            </div>
          </div>
          <h3 className="mt-4">Verifying your email...</h3>
          <p className="text-muted">Please wait while we verify your email address.</p>
        </div>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="verify-email-container">
        <div className="verify-email-card success">
          <div className="success-icon">
            <i className="bi bi-check-circle-fill"></i>
          </div>
          <h2 className="mb-3">Email Verified!</h2>
          <p className="text-muted mb-4">
            Your email has been successfully verified. You can now login to your account.
          </p>
          <p className="small text-muted">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  if (otpMode) {
    return (
      <div className="verify-email-container">
        <div className="verify-email-card">
          <div className="verify-icon">
            <i className="bi bi-envelope-check"></i>
          </div>
          <h2 className="mb-3">Verify Your Email</h2>
          <p className="text-muted mb-4">
            Enter your email and the OTP code sent to your inbox.
          </p>

          <form onSubmit={handleOtpSubmit} className="otp-form">
            <div className="form-group mb-3">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="otp" className="form-label">OTP Code</label>
              <input
                type="text"
                id="otp"
                className="form-control text-center otp-input"
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-100 py-2"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button 
              onClick={() => navigate('/')} 
              className="btn btn-link text-decoration-none"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="verify-email-container">
      <div className="verify-email-card error">
        <div className="error-icon">
          <i className="bi bi-x-circle-fill"></i>
        </div>
        <h2 className="mb-3">Verification Failed</h2>
        <p className="text-danger mb-4">{error}</p>
        <button 
          onClick={() => setOtpMode(true)} 
          className="btn btn-primary mb-2"
        >
          Try with OTP
        </button>
        <button 
          onClick={() => navigate('/')} 
          className="btn btn-outline-secondary"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
