import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as adminService from '../services/adminService';

const EmployeeLeaves = ({ employeeId }) => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeLeaves();
    }
  }, [employeeId]);

  const fetchEmployeeLeaves = async () => {
    try {
      setLoading(true);
      const response = await adminService.getEmployeeLeaves(employeeId);
      if (response.success) {
        setLeaves(response.data);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load leave records');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-success';
      case 'Rejected':
        return 'bg-danger';
      case 'Pending':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  };

  const calculateStats = () => {
    const pending = leaves.filter(l => l.status === 'Pending').length;
    const approved = leaves.filter(l => l.status === 'Approved').length;
    const rejected = leaves.filter(l => l.status === 'Rejected').length;

    return { pending, approved, rejected, total: leaves.length };
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

  if (!employeeId) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-5 text-muted">
          <i className="bi bi-calendar-event fs-1 mb-3 d-block"></i>
          <p>Select an employee to view leave records</p>
        </div>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold mb-0">
            <i className="bi bi-calendar-event me-2 text-primary"></i>
            Leave History
          </h5>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card border-0 bg-warning text-white">
              <div className="card-body text-center">
                <h3 className="mb-0">{stats.pending}</h3>
                <small>Pending</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-success text-white">
              <div className="card-body text-center">
                <h3 className="mb-0">{stats.approved}</h3>
                <small>Approved</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-danger text-white">
              <div className="card-body text-center">
                <h3 className="mb-0">{stats.rejected}</h3>
                <small>Rejected</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-info text-white">
              <div className="card-body text-center">
                <h3 className="mb-0">{stats.total}</h3>
                <small>Total Requests</small>
              </div>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Leave Type</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Admin Comment</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                    No leave requests found
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>
                      <span className="badge bg-info">{leave.leaveType}</span>
                    </td>
                    <td>{new Date(leave.fromDate).toLocaleDateString('en-IN')}</td>
                    <td>{new Date(leave.toDate).toLocaleDateString('en-IN')}</td>
                    <td>{leave.totalDays}</td>
                    <td>
                      <span className="text-truncate d-inline-block" style={{ maxWidth: '200px' }} title={leave.reason}>
                        {leave.reason}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(leave.status)}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td>{leave.adminComment || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeaves;
