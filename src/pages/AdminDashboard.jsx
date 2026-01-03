import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import * as authService from '../services/authService';
import * as leaveService from '../services/leaveService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    const token = authService.getToken();

    if (!token || !currentUser) {
      navigate('/');
      return;
    }

    if (currentUser.role !== 'Admin' && currentUser.role !== 'HR') {
      navigate('/employee/dashboard');
      return;
    }

    setUser(currentUser);
    fetchAllLeaves();
  }, [navigate]);

  const fetchAllLeaves = async () => {
    try {
      setLoadingLeaves(true);
      const response = await leaveService.getAllLeaves();
      if (response.success) {
        setLeaveRequests(response.data.filter(leave => leave.status === 'Pending'));
      }
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      setLoadingLeaves(false);
    }
  };

  const handleLeaveAction = async (leaveId, status, adminComment = '') => {
    try {
      const response = await leaveService.updateLeaveStatus(leaveId, status, adminComment);
      if (response.success) {
        toast.success(`Leave ${status.toLowerCase()} successfully!`);
        fetchAllLeaves();
      }
    } catch (error) {
      console.error('Error updating leave:', error);
      toast.error(error.response?.data?.message || 'Failed to update leave status');
    }
  };

  const menuItems = [
    { label: 'Dashboard', icon: 'bi-speedometer2', path: '/admin/dashboard' },
    { label: 'Employees', icon: 'bi-people', path: '/admin/employees' },
    { label: 'Attendance', icon: 'bi-calendar-check', path: '/admin/attendance' },
    { label: 'Leave Management', icon: 'bi-calendar-x', path: '/admin/leaves' },
    { label: 'Payroll', icon: 'bi-wallet2', path: '/admin/payroll' },
    { label: 'Reports', icon: 'bi-graph-up', path: '/admin/reports' },
  ];

  if (!user) {
    return <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }

  const employeesData = [
    { id: 'EMP001', name: 'John Doe', dept: 'Engineering', status: 'Present' },
    { id: 'EMP002', name: 'Jane Smith', dept: 'Marketing', status: 'Present' },
    { id: 'EMP003', name: 'Mike Johnson', dept: 'Sales', status: 'Leave' },
    { id: 'EMP004', name: 'Sarah Williams', dept: 'HR', status: 'Present' },
    { id: 'EMP005', name: 'David Brown', dept: 'Engineering', status: 'Absent' },
  ];

  const pendingLeavesCount = leaveRequests.length;

  return (
    <div className="d-flex">
      <Sidebar menuItems={menuItems} role="admin" />
      
      <div className="main-content">
        <Navbar userName={user.email} userRole="HR Admin" />
        
        <div className="dashboard-container p-4">
          <div className="welcome-section mb-4">
            <h2 className="fw-bold mb-1">Welcome, HR Admin 👋</h2>
            <p className="text-muted">Manage employees and workflows efficiently</p>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="stat-card card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted small mb-1">Total Employees</p>
                      <h3 className="fw-bold mb-0">248</h3>
                    </div>
                    <div className="stat-icon bg-primary bg-opacity-10 text-primary rounded-circle p-3">
                      <i className="bi bi-people fs-3"></i>
                    </div>
                  </div>
                  <div className="mt-3">
                    <small className="text-success">
                      <i className="bi bi-arrow-up"></i> 12% from last month
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="stat-card card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted small mb-1">Present Today</p>
                      <h3 className="fw-bold mb-0">235</h3>
                    </div>
                    <div className="stat-icon bg-success bg-opacity-10 text-success rounded-circle p-3">
                      <i className="bi bi-check-circle fs-3"></i>
                    </div>
                  </div>
                  <div className="mt-3">
                    <small className="text-muted">94.8% attendance rate</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="stat-card card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted small mb-1">Pending Leaves</p>
                      <h3 className="fw-bold mb-0">{pendingLeavesCount}</h3>
                    </div>
                    <div className="stat-icon bg-warning bg-opacity-10 text-warning rounded-circle p-3">
                      <i className="bi bi-hourglass-split fs-3"></i>
                    </div>
                  </div>
                  <div className="mt-3">
                    <small className="text-warning">Requires approval</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="stat-card card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted small mb-1">On Leave</p>
                      <h3 className="fw-bold mb-0">13</h3>
                    </div>
                    <div className="stat-icon bg-info bg-opacity-10 text-info rounded-circle p-3">
                      <i className="bi bi-calendar-x fs-3"></i>
                    </div>
                  </div>
                  <div className="mt-3">
                    <small className="text-muted">5.2% of workforce</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mt-2">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="card-title fw-bold mb-0">
                      <i className="bi bi-people me-2 text-primary"></i>
                      Employees Overview
                    </h5>
                    <button className="btn btn-primary btn-sm">
                      <i className="bi bi-plus-circle me-2"></i>
                      Add Employee
                    </button>
                  </div>
                  
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Employee ID</th>
                          <th>Name</th>
                          <th>Department</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employeesData.map((emp) => (
                          <tr key={emp.id}>
                            <td className="fw-semibold">{emp.id}</td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div className="avatar-sm bg-gradient rounded-circle d-flex align-items-center justify-content-center text-white">
                                  {emp.name.charAt(0)}
                                </div>
                                <span>{emp.name}</span>
                              </div>
                            </td>
                            <td>{emp.dept}</td>
                            <td>
                              <span className={`badge ${
                                emp.status === 'Present' ? 'bg-success' : 
                                emp.status === 'Leave' ? 'bg-warning text-dark' : 'bg-danger'
                              }`}>
                                {emp.status}
                              </span>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button className="btn btn-outline-primary">
                                  <i className="bi bi-eye"></i>
                                </button>
                                <button className="btn btn-outline-secondary">
                                  <i className="bi bi-pencil"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm mt-4">
                <div className="card-body p-4">
                  <h5 className="card-title fw-bold mb-4">
                    <i className="bi bi-graph-up me-2 text-primary"></i>
                    Attendance Analytics
                  </h5>
                  
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="analytics-card p-4 border rounded text-center">
                        <div className="analytics-icon bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                          <i className="bi bi-check-circle fs-2"></i>
                        </div>
                        <h4 className="fw-bold mb-1">94.8%</h4>
                        <small className="text-muted">This Week</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="analytics-card p-4 border rounded text-center">
                        <div className="analytics-icon bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                          <i className="bi bi-calendar-check fs-2"></i>
                        </div>
                        <h4 className="fw-bold mb-1">96.2%</h4>
                        <small className="text-muted">This Month</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="analytics-card p-4 border rounded text-center">
                        <div className="analytics-icon bg-info bg-opacity-10 text-info rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                          <i className="bi bi-trophy fs-2"></i>
                        </div>
                        <h4 className="fw-bold mb-1">95.5%</h4>
                        <small className="text-muted">Overall</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="card-title fw-bold mb-0">
                      <i className="bi bi-calendar-x me-2 text-primary"></i>
                      Leave Approvals
                    </h5>
                    <span className="badge bg-warning text-dark">{pendingLeavesCount} Pending</span>
                  </div>
                  
                  {loadingLeaves ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : leaveRequests.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                      <i className="bi bi-inbox fs-1 mb-3 d-block"></i>
                      <p>No pending leave requests</p>
                    </div>
                  ) : (
                    <div className="leave-requests">
                      {leaveRequests.slice(0, 3).map((request) => (
                        <div key={request.id} className="leave-request-card p-3 border rounded mb-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <div className="fw-semibold small">{request.employeeName}</div>
                              <small className="text-muted">{request.leaveType} Leave</small>
                            </div>
                            <span className="badge bg-warning text-dark small">{request.status}</span>
                          </div>
                          <div className="mb-2">
                            <small className="text-muted d-block">
                              <i className="bi bi-calendar-event me-1"></i>
                              {new Date(request.fromDate).toLocaleDateString()} - {new Date(request.toDate).toLocaleDateString()}
                            </small>
                            <small className="text-muted">Reason: {request.reason}</small>
                          </div>
                          <div className="d-flex gap-2">
                            <button 
                              className="btn btn-success btn-sm flex-fill"
                              onClick={() => handleLeaveAction(request.id, 'Approved')}
                            >
                              <i className="bi bi-check-circle me-1"></i>
                              Approve
                            </button>
                            <button 
                              className="btn btn-danger btn-sm flex-fill"
                              onClick={() => handleLeaveAction(request.id, 'Rejected')}
                            >
                              <i className="bi bi-x-circle me-1"></i>
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button className="btn btn-outline-primary w-100 mt-2">
                    View All Requests
                  </button>
                </div>
              </div>

              <div className="card border-0 shadow-sm mt-4">
                <div className="card-body p-4">
                  <h5 className="card-title fw-bold mb-4">
                    <i className="bi bi-wallet2 me-2 text-primary"></i>
                    Payroll Summary
                  </h5>
                  
                  <div className="payroll-summary mb-4">
                    <div className="text-center p-4 bg-gradient rounded text-white">
                      <small className="d-block mb-2 opacity-75">Total Monthly Payroll</small>
                      <h3 className="fw-bold mb-0">₹1,24,00,000</h3>
                      <small className="opacity-75">248 employees</small>
                    </div>
                  </div>

                  <div className="payroll-breakdown">
                    <div className="d-flex justify-content-between align-items-center p-3 border rounded mb-2">
                      <div>
                        <small className="text-muted d-block">Engineering</small>
                        <div className="fw-semibold">₹68,00,000</div>
                      </div>
                      <div className="text-end">
                        <small className="text-muted">120 emp</small>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center p-3 border rounded mb-2">
                      <div>
                        <small className="text-muted d-block">Sales</small>
                        <div className="fw-semibold">₹32,00,000</div>
                      </div>
                      <div className="text-end">
                        <small className="text-muted">68 emp</small>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                      <div>
                        <small className="text-muted d-block">Others</small>
                        <div className="fw-semibold">₹24,00,000</div>
                      </div>
                      <div className="text-end">
                        <small className="text-muted">60 emp</small>
                      </div>
                    </div>
                  </div>

                  <button className="btn btn-primary w-100 mt-3">
                    <i className="bi bi-gear me-2"></i>
                    Manage Payroll
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
