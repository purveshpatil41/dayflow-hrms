import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as adminService from '../services/adminService';

const MarkAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllEmployees();
      if (response.success) {
        setEmployees(response.data);
        // Initialize attendance data with default "Present" status
        const initialData = {};
        response.data.forEach(emp => {
          initialData[emp.id] = 'Present';
        });
        setAttendanceData(initialData);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (employeeId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [employeeId]: status
    }));
  };

  const handleMarkAll = (status) => {
    const newData = {};
    filteredEmployees.forEach(emp => {
      newData[emp.id] = status;
    });
    setAttendanceData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const handleSubmit = async () => {
    try {
      const attendanceRecords = Object.entries(attendanceData).map(([employeeId, status]) => ({
        employeeId: parseInt(employeeId),
        date: selectedDate,
        status
      }));

      const response = await adminService.markBulkAttendance(attendanceRecords);
      if (response.success) {
        toast.success(response.message || 'Attendance marked successfully');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to mark attendance');
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusCounts = () => {
    const present = Object.values(attendanceData).filter(s => s === 'Present').length;
    const absent = Object.values(attendanceData).filter(s => s === 'Absent').length;
    const leave = Object.values(attendanceData).filter(s => s === 'Leave').length;
    return { present, absent, leave };
  };

  const stats = getStatusCounts();

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

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold mb-0">
            <i className="bi bi-calendar-check me-2 text-primary"></i>
            Mark Attendance
          </h5>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <label className="form-label fw-bold">Select Date</label>
            <input
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="col-md-9">
            <label className="form-label fw-bold">Search Employee</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card border-0 bg-success text-white">
              <div className="card-body text-center py-2">
                <h4 className="mb-0">{stats.present}</h4>
                <small>Present</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-danger text-white">
              <div className="card-body text-center py-2">
                <h4 className="mb-0">{stats.absent}</h4>
                <small>Absent</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-warning text-white">
              <div className="card-body text-center py-2">
                <h4 className="mb-0">{stats.leave}</h4>
                <small>On Leave</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 bg-info text-white">
              <div className="card-body text-center py-2">
                <h4 className="mb-0">{filteredEmployees.length}</h4>
                <small>Total</small>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-3 d-flex gap-2">
          <button className="btn btn-success btn-sm" onClick={() => handleMarkAll('Present')}>
            <i className="bi bi-check-circle me-1"></i> Mark All Present
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => handleMarkAll('Absent')}>
            <i className="bi bi-x-circle me-1"></i> Mark All Absent
          </button>
          <button className="btn btn-warning btn-sm" onClick={() => handleMarkAll('Leave')}>
            <i className="bi bi-calendar-x me-1"></i> Mark All Leave
          </button>
        </div>

        <div className="table-responsive mb-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table className="table table-hover align-middle">
            <thead className="table-light sticky-top">
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">
                    No employees found
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="fw-semibold">{employee.employeeId}</td>
                    <td>{employee.fullName || 'N/A'}</td>
                    <td>
                      <span className="badge bg-info">
                        {employee.department || 'Not Set'}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm" role="group">
                        <button
                          type="button"
                          className={`btn ${attendanceData[employee.id] === 'Present' ? 'btn-success' : 'btn-outline-success'}`}
                          onClick={() => handleStatusChange(employee.id, 'Present')}
                        >
                          <i className="bi bi-check-circle me-1"></i>
                          Present
                        </button>
                        <button
                          type="button"
                          className={`btn ${attendanceData[employee.id] === 'Absent' ? 'btn-danger' : 'btn-outline-danger'}`}
                          onClick={() => handleStatusChange(employee.id, 'Absent')}
                        >
                          <i className="bi bi-x-circle me-1"></i>
                          Absent
                        </button>
                        <button
                          type="button"
                          className={`btn ${attendanceData[employee.id] === 'Leave' ? 'btn-warning' : 'btn-outline-warning'}`}
                          onClick={() => handleStatusChange(employee.id, 'Leave')}
                        >
                          <i className="bi bi-calendar-x me-1"></i>
                          Leave
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-end">
          <button className="btn btn-primary" onClick={handleSubmit}>
            <i className="bi bi-save me-2"></i>
            Save Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;
