import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as adminService from '../services/adminService';

const EmployeeList = ({ onSelectEmployee, selectedEmployeeId }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
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
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="card-title fw-bold mb-0">
            <i className="bi bi-people me-2 text-primary"></i>
            Employee List
          </h5>
          <span className="badge bg-primary">{filteredEmployees.length} Employees</span>
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, email, ID, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-inbox fs-1 mb-3 d-block"></i>
            <p>No employees found</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Profile</th>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className={selectedEmployeeId === employee.id ? 'table-active' : ''}
                    style={{ cursor: 'pointer' }}
                  >
                    <td onClick={() => onSelectEmployee(employee.id)}>
                      {employee.profilePicture ? (
                        <img 
                          src={employee.profilePicture} 
                          alt={employee.fullName} 
                          className="rounded-circle"
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div 
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                          style={{ width: '40px', height: '40px', fontSize: '0.9rem' }}
                        >
                          {employee.fullName ? employee.fullName.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                    </td>
                    <td onClick={() => onSelectEmployee(employee.id)}>
                      <strong>{employee.employeeId}</strong>
                    </td>
                    <td onClick={() => onSelectEmployee(employee.id)}>
                      {employee.fullName || 'N/A'}
                    </td>
                    <td onClick={() => onSelectEmployee(employee.id)}>
                      {employee.email}
                    </td>
                    <td onClick={() => onSelectEmployee(employee.id)}>
                      <span className="badge bg-info">
                        {employee.department || 'Not Set'}
                      </span>
                    </td>
                    <td onClick={() => onSelectEmployee(employee.id)}>
                      <span className={`badge ${employee.role === 'Admin' ? 'bg-danger' : 'bg-success'}`}>
                        {employee.role}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => onSelectEmployee(employee.id)}
                      >
                        <i className="bi bi-eye me-1"></i>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
