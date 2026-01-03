import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as adminService from '../services/adminService';

const AttendanceView = ({ employeeId }) => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (employeeId) {
      fetchAttendance();
    }
  }, [employeeId, currentMonth, currentYear]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await adminService.getEmployeeAttendance(employeeId);
      if (response.success) {
        setAttendance(response.data);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present':
        return 'bg-success';
      case 'Absent':
        return 'bg-danger';
      case 'Leave':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  };

  const calculateStats = () => {
    const present = attendance.filter(a => a.status === 'Present').length;
    const absent = attendance.filter(a => a.status === 'Absent').length;
    const leave = attendance.filter(a => a.status === 'Leave').length;
    const total = attendance.length;
    const presentPercent = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

    return { present, absent, leave, total, presentPercent };
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
          <i className="bi bi-calendar-check fs-1 mb-3 d-block"></i>
          <p>Select an employee to view attendance</p>
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
            <i className="bi bi-calendar-check me-2 text-primary"></i>
            Attendance Records
          </h5>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card border-0 bg-success text-white">
              <div className="card-body text-center">
                <h3 className="mb-0">{stats.present}</h3>
                <small>Present</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-danger text-white">
              <div className="card-body text-center">
                <h3 className="mb-0">{stats.absent}</h3>
                <small>Absent</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-warning text-white">
              <div className="card-body text-center">
                <h3 className="mb-0">{stats.leave}</h3>
                <small>On Leave</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-info text-white">
              <div className="card-body text-center">
                <h3 className="mb-0">{stats.presentPercent}%</h3>
                <small>Attendance</small>
              </div>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Status</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Hours</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                    No attendance records found
                  </td>
                </tr>
              ) : (
                attendance.map((record, index) => (
                  <tr key={index}>
                    <td>{new Date(record.date).toLocaleDateString('en-IN')}</td>
                    <td>{new Date(record.date).toLocaleDateString('en-IN', { weekday: 'short' })}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td>{record.checkIn || '-'}</td>
                    <td>{record.checkOut || '-'}</td>
                    <td>{record.hours || '-'}</td>
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

export default AttendanceView;
