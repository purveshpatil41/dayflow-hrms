import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as leaveService from '../services/leaveService';
import * as authService from '../services/authService';

const LeaveRequestSection = () => {
  const [showForm, setShowForm] = useState(false);
  const [leaveData, setLeaveData] = useState({
    leaveType: 'Paid',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  const fetchMyLeaves = async () => {
    try {
      setLoading(true);
      const response = await leaveService.getMyLeaves();
      if (response.success) {
        setLeaveRequests(response.data);
      }
    } catch (error) {
      console.error('Error fetching leaves:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = authService.getCurrentUser();
      const requestData = {
        employeeName: user.fullName || user.email,
        leaveType: leaveData.leaveType,
        fromDate: leaveData.startDate,
        toDate: leaveData.endDate,
        reason: leaveData.reason,
      };

      const response = await leaveService.applyLeave(requestData);
      if (response.success) {
        toast.success('Leave request submitted successfully!');
        setShowForm(false);
        setLeaveData({ leaveType: 'Paid', startDate: '', endDate: '', reason: '' });
        fetchMyLeaves();
      }
    } catch (error) {
      console.error('Error submitting leave:', error);
      toast.error(error.response?.data?.message || 'Failed to submit leave request');
    }
  };

  // Calculate counts based on leave status
  const pendingCount = leaveRequests.filter(leave => leave.status === 'Pending').length;
  const approvedCount = leaveRequests.filter(leave => leave.status === 'Approved').length;

  return (
    <div className="leave-section p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Leave Requests</h3>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <i className="bi bi-plus-circle me-2"></i>
          Request New Leave
        </button>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-calendar-event text-primary fs-1 mb-3"></i>
              <h4 className="fw-bold">12 Days</h4>
              <p className="text-muted mb-0">Leave Balance</p>
              <small className="text-muted">Annual: 8 | Sick: 4</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-hourglass-split text-warning fs-1 mb-3"></i>
              <h4 className="fw-bold">{pendingCount}</h4>
              <p className="text-muted mb-0">Pending Requests</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-check-circle text-success fs-1 mb-3"></i>
              <h4 className="fw-bold">{approvedCount}</h4>
              <p className="text-muted mb-0">Approved Leaves</p>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-4">New Leave Request</h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Leave Type</label>
                  <select
                    className="form-select"
                    value={leaveData.leaveType}
                    onChange={(e) => setLeaveData({ ...leaveData, leaveType: e.target.value })}
                  >
                    <option value="Paid">Paid Leave</option>
                    <option value="Sick">Sick Leave</option>
                    <option value="Unpaid">Unpaid Leave</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={leaveData.startDate}
                    onChange={(e) => setLeaveData({ ...leaveData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={leaveData.endDate}
                    onChange={(e) => setLeaveData({ ...leaveData, endDate: e.target.value })}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Reason</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={leaveData.reason}
                    onChange={(e) => setLeaveData({ ...leaveData, reason: e.target.value })}
                    required
                  />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-primary me-2">
                    Submit Request
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4">Leave History</h5>
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : leaveRequests.length === 0 ? (
            <div className="text-center py-4 text-muted">
              <i className="bi bi-inbox fs-1 mb-3 d-block"></i>
              <p>No leave requests found. Create your first request!</p>
            </div>
          ) : (
            <div className="row g-3">
              {leaveRequests.map((leave) => (
                <div key={leave.id} className="col-12">
                  <div className="border rounded p-3 hover-shadow">
                    <div className="row align-items-center">
                      <div className="col-md-3">
                        <div className="fw-semibold">{leave.leaveType} Leave</div>
                        <small className="text-muted">
                          {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                        </small>
                      </div>
                      <div className="col-md-3">
                        <small className="text-muted">Reason</small>
                        <div className="fw-semibold text-truncate">{leave.reason}</div>
                      </div>
                      <div className="col-md-3">
                        <span className={`badge ${
                          leave.status === 'Approved' ? 'bg-success' : 
                          leave.status === 'Rejected' ? 'bg-danger' : 
                          'bg-warning text-dark'
                        }`}>
                          {leave.status}
                        </span>
                        {leave.adminComment && (
                          <div className="mt-1">
                            <small className="text-muted">Comment: {leave.adminComment}</small>
                          </div>
                        )}
                      </div>
                      <div className="col-md-3 text-end">
                        <small className="text-muted d-block">
                          {new Date(leave.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestSection;
