import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import * as authService from '../services/authService';
import { toast } from 'react-toastify';
import './EmployeeProfile.css';

const EmployeeProfile = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [profileData, setProfileData] = useState({
    profilePicture: null,
    profilePicturePreview: 'https://via.placeholder.com/150',
    phone: '+91 9876543210',
    address: '123, MG Road, Bangalore, Karnataka - 560001',
    emergencyContact: '+91 9988776655',
    bloodGroup: 'O+',
    dateOfBirth: '1995-05-15',
    gender: 'Male',
  });

  const menuItems = [
    { label: 'Profile', icon: 'bi-person', path: '/employee/profile' },
    { label: 'Attendance', icon: 'bi-calendar-check', path: '/employee/attendance' },
    { label: 'Leave Request', icon: 'bi-calendar-x', path: '/employee/leave' },
  ];

  if (!user) {
    navigate('/');
    return null;
  }

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({
          ...profileData,
          profilePicture: file,
          profilePicturePreview: reader.result,
        });
        toast.success('Profile picture updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePersonalInfoChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSavePersonalInfo = () => {
    setIsEditingPersonal(false);
    toast.success('Personal information updated successfully!');
  };

  return (
    <div className="d-flex">
      <Sidebar menuItems={menuItems} role="employee" />
      
      <div className="main-content">
        <Navbar userName={user.email} userRole={user.role} />
        
        <div className="profile-container p-4">
          <div className="mb-4">
            <h2 className="fw-bold">My Profile</h2>
            <p className="text-muted">View and manage your profile information</p>
          </div>

          {/* Profile Picture & Basic Info */}
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4 text-center">
                  <div className="profile-picture-wrapper position-relative d-inline-block mb-3">
                    <img
                      src={profileData.profilePicturePreview}
                      alt="Profile"
                      className="profile-picture rounded-circle"
                    />
                    <label htmlFor="profilePictureInput" className="profile-picture-overlay">
                      <i className="bi bi-camera-fill fs-4"></i>
                      <input
                        type="file"
                        id="profilePictureInput"
                        className="d-none"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                      />
                    </label>
                  </div>
                  
                  <h5 className="fw-bold mb-1">{user.employeeId}</h5>
                  <p className="text-muted mb-0">{user.email}</p>
                  <span className="badge bg-success mt-2">{user.role}</span>
                  
                  <div className="mt-4 pt-4 border-top">
                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-muted">Department</span>
                      <span className="fw-semibold">Engineering</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-muted">Join Date</span>
                      <span className="fw-semibold">Jan 1, 2024</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Status</span>
                      <span className="badge bg-success">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              {/* Personal Details */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0">
                      <i className="bi bi-person-lines-fill me-2 text-primary"></i>
                      Personal Details
                    </h5>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                    >
                      <i className={`bi ${isEditingPersonal ? 'bi-x-circle' : 'bi-pencil'} me-1`}></i>
                      {isEditingPersonal ? 'Cancel' : 'Edit'}
                    </button>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-muted small">Phone Number</label>
                      {isEditingPersonal ? (
                        <input
                          type="tel"
                          name="phone"
                          className="form-control"
                          value={profileData.phone}
                          onChange={handlePersonalInfoChange}
                        />
                      ) : (
                        <div className="form-control-plaintext fw-semibold">{profileData.phone}</div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted small">Emergency Contact</label>
                      <div className="form-control-plaintext fw-semibold">{profileData.emergencyContact}</div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted small">Date of Birth</label>
                      <div className="form-control-plaintext fw-semibold">{profileData.dateOfBirth}</div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted small">Blood Group</label>
                      <div className="form-control-plaintext fw-semibold">{profileData.bloodGroup}</div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted small">Gender</label>
                      <div className="form-control-plaintext fw-semibold">{profileData.gender}</div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted small">Email</label>
                      <div className="form-control-plaintext fw-semibold">{user.email}</div>
                    </div>

                    <div className="col-12">
                      <label className="form-label text-muted small">Address</label>
                      {isEditingPersonal ? (
                        <textarea
                          name="address"
                          className="form-control"
                          rows="3"
                          value={profileData.address}
                          onChange={handlePersonalInfoChange}
                        />
                      ) : (
                        <div className="form-control-plaintext fw-semibold">{profileData.address}</div>
                      )}
                    </div>

                    {isEditingPersonal && (
                      <div className="col-12">
                        <button className="btn btn-primary" onClick={handleSavePersonalInfo}>
                          <i className="bi bi-check-circle me-2"></i>
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">
                    <i className="bi bi-briefcase-fill me-2 text-primary"></i>
                    Job Details
                  </h5>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-muted small">Employee ID</label>
                      <div className="form-control-plaintext fw-semibold">{user.employeeId}</div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted small">Designation</label>
                      <div className="form-control-plaintext fw-semibold">Senior Software Engineer</div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted small">Department</label>
                      <div className="form-control-plaintext fw-semibold">Engineering</div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted small">Reporting Manager</label>
                      <div className="form-control-plaintext fw-semibold">John Smith</div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted small">Join Date</label>
                      <div className="form-control-plaintext fw-semibold">January 1, 2024</div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted small">Employment Type</label>
                      <div className="form-control-plaintext fw-semibold">Full Time</div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted small">Work Location</label>
                      <div className="form-control-plaintext fw-semibold">Bangalore Office</div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted small">Employee Status</label>
                      <div><span className="badge bg-success">Active</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mt-2">
            {/* Salary Structure */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">
                    <i className="bi bi-cash-stack me-2 text-primary"></i>
                    Salary Structure
                  </h5>

                  <div className="salary-summary mb-4">
                    <div className="text-center p-4 bg-gradient rounded text-white">
                      <small className="d-block mb-2 opacity-75">Gross Monthly Salary</small>
                      <h3 className="fw-bold mb-0">₹50,000</h3>
                      <small className="opacity-75">CTC: ₹6,00,000 / year</small>
                    </div>
                  </div>

                  <div className="salary-breakdown">
                    <h6 className="small fw-bold text-muted mb-3">Earnings</h6>
                    
                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded mb-2">
                      <span className="text-muted">Basic Salary</span>
                      <span className="fw-semibold">₹25,000</span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded mb-2">
                      <span className="text-muted">House Rent Allowance</span>
                      <span className="fw-semibold">₹12,500</span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded mb-2">
                      <span className="text-muted">Special Allowance</span>
                      <span className="fw-semibold">₹10,000</span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded mb-4">
                      <span className="text-muted">Transport Allowance</span>
                      <span className="fw-semibold">₹2,500</span>
                    </div>

                    <h6 className="small fw-bold text-muted mb-3">Deductions</h6>

                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded mb-2">
                      <span className="text-muted">Provident Fund</span>
                      <span className="fw-semibold text-danger">- ₹3,000</span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded mb-2">
                      <span className="text-muted">Professional Tax</span>
                      <span className="fw-semibold text-danger">- ₹200</span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center p-3 bg-success bg-opacity-10 rounded border border-success mt-3">
                      <span className="fw-bold">Net Salary</span>
                      <span className="fw-bold text-success">₹46,800</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">
                    <i className="bi bi-file-earmark-text me-2 text-primary"></i>
                    Documents
                  </h5>

                  <div className="documents-list">
                    <div className="document-item d-flex justify-content-between align-items-center p-3 border rounded mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="document-icon bg-primary bg-opacity-10 text-primary rounded p-3">
                          <i className="bi bi-file-pdf fs-4"></i>
                        </div>
                        <div>
                          <div className="fw-semibold">Aadhaar Card</div>
                          <small className="text-muted">Uploaded on: Jan 1, 2024</small>
                        </div>
                      </div>
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-download"></i>
                      </button>
                    </div>

                    <div className="document-item d-flex justify-content-between align-items-center p-3 border rounded mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="document-icon bg-success bg-opacity-10 text-success rounded p-3">
                          <i className="bi bi-file-pdf fs-4"></i>
                        </div>
                        <div>
                          <div className="fw-semibold">PAN Card</div>
                          <small className="text-muted">Uploaded on: Jan 1, 2024</small>
                        </div>
                      </div>
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-download"></i>
                      </button>
                    </div>

                    <div className="document-item d-flex justify-content-between align-items-center p-3 border rounded mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="document-icon bg-info bg-opacity-10 text-info rounded p-3">
                          <i className="bi bi-file-pdf fs-4"></i>
                        </div>
                        <div>
                          <div className="fw-semibold">Degree Certificate</div>
                          <small className="text-muted">Uploaded on: Jan 1, 2024</small>
                        </div>
                      </div>
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-download"></i>
                      </button>
                    </div>

                    <div className="document-item d-flex justify-content-between align-items-center p-3 border rounded mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="document-icon bg-warning bg-opacity-10 text-warning rounded p-3">
                          <i className="bi bi-file-pdf fs-4"></i>
                        </div>
                        <div>
                          <div className="fw-semibold">Experience Letter</div>
                          <small className="text-muted">Uploaded on: Jan 1, 2024</small>
                        </div>
                      </div>
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-download"></i>
                      </button>
                    </div>

                    <div className="document-item d-flex justify-content-between align-items-center p-3 border rounded mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="document-icon bg-secondary bg-opacity-10 text-secondary rounded p-3">
                          <i className="bi bi-file-pdf fs-4"></i>
                        </div>
                        <div>
                          <div className="fw-semibold">Bank Statement</div>
                          <small className="text-muted">Uploaded on: Jan 1, 2024</small>
                        </div>
                      </div>
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-download"></i>
                      </button>
                    </div>

                    <button className="btn btn-outline-primary w-100 mt-3">
                      <i className="bi bi-cloud-upload me-2"></i>
                      Upload New Document
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
