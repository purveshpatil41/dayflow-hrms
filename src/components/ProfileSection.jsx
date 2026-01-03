import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';
import './ProfileSection.css';

const ProfileSection = ({ user }) => {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState('https://via.placeholder.com/150');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    employeeId: user?.employeeId || '',
    phone: '',
    address: '',
    jobTitle: 'Senior Software Engineer',
    department: 'Engineering',
    joiningDate: 'January 1, 2024',
    basicSalary: '₹25,000',
    hra: '₹12,500',
    specialAllowance: '₹10,000',
    transportAllowance: '₹2,500',
    totalSalary: '₹50,000',
  });

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get('http://localhost:5000/api/auth/me', config);
        
        if (response.data.success) {
          const userData = response.data.data;
          setFormData(prev => ({
            ...prev,
            fullName: userData.fullName || userData.email?.split('@')[0] || '',
            email: userData.email || '',
            employeeId: userData.employeeId || '',
            phone: userData.phone || '',
            address: userData.address || '',
          }));
          
          if (userData.profilePicture) {
            setProfilePicture(userData.profilePicture);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
        toast.success('Profile picture updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login again');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const updateData = {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        profilePicture: profilePicture,
      };

      const response = await axios.put(
        'http://localhost:5000/api/auth/update-profile',
        updateData,
        config
      );

      if (response.data.success) {
        // Update localStorage with new user data
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const updatedUser = {
          ...currentUser,
          fullName: response.data.data.fullName,
          phone: response.data.data.phone,
          address: response.data.data.address,
          profilePicture: response.data.data.profilePicture,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setIsEditMode(false);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    toast.info('Changes discarded');
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const response = await authService.deleteAccount();
      
      if (response.success) {
        toast.success('Account deleted successfully');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Delete account error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="profile-section">
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading profile...</p>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">My Profile</h3>
          <p className="text-muted mb-0">View and manage your profile information</p>
        </div>
        <div className="d-flex gap-2">
          {!isEditMode && (
            <>
              <button className="btn btn-primary" onClick={() => setIsEditMode(true)}>
                <i className="bi bi-pencil-square me-2"></i>
                Edit Profile
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => setShowDeleteConfirm(true)}
              >
                <i className="bi bi-trash me-2"></i>
                Delete Account
              </button>
            </>
          )}
          {isEditMode && (
            <div className="btn-group">
              <button className="btn btn-success" onClick={handleSave}>
                <i className="bi bi-check-circle me-2"></i>
                Save Changes
              </button>
              <button className="btn btn-secondary" onClick={handleCancel}>
                <i className="bi bi-x-circle me-2"></i>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 text-center">
              <div className="profile-picture-wrapper mb-3">
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="profile-picture rounded-circle mb-3"
                />
                {isEditMode && (
                  <label htmlFor="profilePic" className="profile-edit-overlay">
                    <i className="bi bi-camera-fill fs-4"></i>
                    <input
                      type="file"
                      id="profilePic"
                      className="d-none"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                    />
                  </label>
                )}
              </div>
              <h5 className="fw-bold mb-1">{formData.fullName || formData.email}</h5>
              <p className="text-muted mb-2">{formData.email}</p>
              <span className="badge bg-success">{formData.jobTitle}</span>
              
              <div className="mt-4 pt-4 border-top text-start">
                <div className="info-row mb-3">
                  <small className="text-muted">Employee ID</small>
                  <div className="fw-semibold">{formData.employeeId}</div>
                </div>
                <div className="info-row mb-3">
                  <small className="text-muted">Department</small>
                  <div className="fw-semibold">{formData.department}</div>
                </div>
                <div className="info-row">
                  <small className="text-muted">Joining Date</small>
                  <div className="fw-semibold">{formData.joiningDate}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">
                <i className="bi bi-person-lines-fill me-2 text-primary"></i>
                Personal Details
              </h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    className={`form-control ${isEditMode ? 'border-primary' : ''}`}
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={!isEditMode}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    disabled
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Employee ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.employeeId}
                    disabled
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className={`form-control ${isEditMode ? 'border-primary' : ''}`}
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditMode}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Address</label>
                  <textarea
                    name="address"
                    className={`form-control ${isEditMode ? 'border-primary' : ''}`}
                    rows="3"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditMode}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">
                <i className="bi bi-briefcase-fill me-2 text-primary"></i>
                Job Details
              </h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Job Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.jobTitle}
                    disabled
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Department</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.department}
                    disabled
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Joining Date</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.joiningDate}
                    disabled
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Employment Status</label>
                  <div className="form-control">
                    <span className="badge bg-success">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">
                    <i className="bi bi-cash-stack me-2 text-primary"></i>
                    Salary Structure
                  </h5>
                  <div className="salary-item mb-3 pb-3 border-bottom">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Basic Salary</span>
                      <span className="fw-semibold">{formData.basicSalary}</span>
                    </div>
                  </div>
                  <div className="salary-item mb-3 pb-3 border-bottom">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">HRA</span>
                      <span className="fw-semibold">{formData.hra}</span>
                    </div>
                  </div>
                  <div className="salary-item mb-3 pb-3 border-bottom">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Special Allowance</span>
                      <span className="fw-semibold">{formData.specialAllowance}</span>
                    </div>
                  </div>
                  <div className="salary-item mb-3 pb-3 border-bottom">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Transport Allowance</span>
                      <span className="fw-semibold">{formData.transportAllowance}</span>
                    </div>
                  </div>
                  <div className="salary-item">
                    <div className="d-flex justify-content-between align-items-center p-3 bg-success bg-opacity-10 rounded">
                      <span className="fw-bold text-success">Total Salary</span>
                      <span className="fw-bold text-success fs-5">{formData.totalSalary}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">
                    <i className="bi bi-file-earmark-text me-2 text-primary"></i>
                    Documents
                  </h5>
                  <div className="document-item mb-3">
                    <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                      <div className="d-flex align-items-center gap-3">
                        <i className="bi bi-file-pdf text-danger fs-3"></i>
                        <div>
                          <div className="fw-semibold">Aadhaar Card</div>
                          <small className="text-muted">ID Proof</small>
                        </div>
                      </div>
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-download"></i>
                      </button>
                    </div>
                  </div>
                  <div className="document-item mb-3">
                    <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                      <div className="d-flex align-items-center gap-3">
                        <i className="bi bi-file-pdf text-danger fs-3"></i>
                        <div>
                          <div className="fw-semibold">Offer Letter</div>
                          <small className="text-muted">Employment Document</small>
                        </div>
                      </div>
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-download"></i>
                      </button>
                    </div>
                  </div>
                  <div className="document-item">
                    <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                      <div className="d-flex align-items-center gap-3">
                        <i className="bi bi-file-pdf text-danger fs-3"></i>
                        <div>
                          <div className="fw-semibold">Resume</div>
                          <small className="text-muted">CV Document</small>
                        </div>
                      </div>
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-download"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title text-danger">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Delete Account
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDeleteConfirm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-3">
                  <strong>Are you sure you want to delete your account?</strong>
                </p>
                <p className="text-muted mb-3">
                  This action cannot be undone. Your account and all associated data will be permanently deleted.
                </p>
                <ul className="list-unstyled text-muted small">
                  <li>• Your profile information will be removed</li>
                  <li>• Your attendance records will be deleted</li>
                  <li>• Your leave requests will be removed</li>
                  <li>• You will lose access to the system</li>
                </ul>
              </div>
              <div className="modal-footer border-0">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleDeleteAccount}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-trash me-2"></i>
                      Yes, Delete My Account
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
