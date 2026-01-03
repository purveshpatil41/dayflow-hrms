import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as adminService from '../services/adminService';

const EmployeeDetail = ({ employeeId, onBack, onUpdate }) => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    if (employeeId) {
      fetchEmployee();
    }
  }, [employeeId]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const response = await adminService.getEmployeeById(employeeId);
      if (response.success) {
        setEmployee(response.data);
        setFormData(response.data);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load employee details');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(employee);
  };

  const handleSave = async () => {
    try {
      const response = await adminService.updateEmployee(employeeId, formData);
      if (response.success) {
        toast.success('Employee updated successfully');
        setEmployee(response.data);
        setIsEditing(false);
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update employee');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-5 text-muted">
          <i className="bi bi-person-x fs-1 mb-3 d-block"></i>
          <p>Select an employee to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <button className="btn btn-sm btn-outline-secondary me-3" onClick={onBack}>
              <i className="bi bi-arrow-left"></i> Back
            </button>
            <h5 className="fw-bold mb-0">
              <i className="bi bi-person-badge me-2 text-primary"></i>
              Employee Details
            </h5>
          </div>
          <div>
            {!isEditing ? (
              <button className="btn btn-primary btn-sm" onClick={handleEdit}>
                <i className="bi bi-pencil me-1"></i>
                Edit
              </button>
            ) : (
              <>
                <button className="btn btn-success btn-sm me-2" onClick={handleSave}>
                  <i className="bi bi-check-lg me-1"></i>
                  Save
                </button>
                <button className="btn btn-secondary btn-sm" onClick={handleCancel}>
                  <i className="bi bi-x-lg me-1"></i>
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-3 text-center">
            {employee.profilePicture ? (
              <img 
                src={employee.profilePicture} 
                alt={employee.fullName} 
                className="rounded-circle mb-3"
                style={{ width: '120px', height: '120px', objectFit: 'cover', border: '3px solid #667eea' }}
              />
            ) : (
              <div className="profile-avatar rounded-circle bg-gradient d-inline-flex align-items-center justify-content-center text-white mb-3"
                   style={{ width: '120px', height: '120px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <span className="fs-1 fw-bold">
                  {employee.fullName ? employee.fullName.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
            )}
            <h5 className="fw-bold mb-1">{employee.fullName || 'N/A'}</h5>
            <p className="text-muted mb-2">{employee.employeeId}</p>
            <span className={`badge ${employee.role === 'Admin' ? 'bg-danger' : 'bg-success'}`}>
              {employee.role}
            </span>
          </div>
          <div className="col-md-9">
            <ul className="nav nav-tabs mb-3">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'personal' ? 'active' : ''}`}
                  onClick={() => setActiveTab('personal')}
                >
                  Personal Details
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'job' ? 'active' : ''}`}
                  onClick={() => setActiveTab('job')}
                >
                  Job Details
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'salary' ? 'active' : ''}`}
                  onClick={() => setActiveTab('salary')}
                >
                  Salary Structure
                </button>
              </li>
            </ul>

            {activeTab === 'personal' && (
              <div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        name="fullName"
                        value={formData.fullName || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="form-control-plaintext">{employee.fullName || 'N/A'}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="form-control-plaintext">{employee.email || 'N/A'}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Phone</label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="form-control-plaintext">{employee.phone || 'N/A'}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Role</label>
                    {isEditing ? (
                      <select
                        className="form-select"
                        name="role"
                        value={formData.role || ''}
                        onChange={handleInputChange}
                      >
                        <option value="Employee">Employee</option>
                        <option value="Admin">Admin</option>
                      </select>
                    ) : (
                      <p className="form-control-plaintext">{employee.role || 'N/A'}</p>
                    )}
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold">Address</label>
                    {isEditing ? (
                      <textarea
                        className="form-control"
                        name="address"
                        rows="3"
                        value={formData.address || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="form-control-plaintext">{employee.address || 'N/A'}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'job' && (
              <div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Job Title</label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        name="jobTitle"
                        value={formData.jobTitle || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="form-control-plaintext">{employee.jobTitle || 'N/A'}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Department</label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        name="department"
                        value={formData.department || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="form-control-plaintext">{employee.department || 'N/A'}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Joining Date</label>
                    {isEditing ? (
                      <input
                        type="date"
                        className="form-control"
                        name="joiningDate"
                        value={formData.joiningDate || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="form-control-plaintext">{employee.joiningDate || 'N/A'}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Employee ID</label>
                    <p className="form-control-plaintext">{employee.employeeId}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'salary' && (
              <div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Basic Salary</label>
                    {isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        name="basicSalary"
                        value={formData.basicSalary || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="form-control-plaintext">₹{employee.basicSalary || 0}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Allowances</label>
                    {isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        name="allowances"
                        value={formData.allowances || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="form-control-plaintext">₹{employee.allowances || 0}</p>
                    )}
                  </div>
                  <div className="col-md-12">
                    <div className="alert alert-info">
                      <strong>Total Salary:</strong> ₹{employee.totalSalary || 0}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
