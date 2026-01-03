const AttendanceSection = () => {
  return (
    <div className="attendance-section p-4">
      <h3 className="fw-bold mb-4">My Attendance</h3>
      
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-check-circle-fill text-success fs-1 mb-3"></i>
              <h4 className="fw-bold">Present</h4>
              <p className="text-muted mb-0">Today's Status</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-calendar-week text-primary fs-1 mb-3"></i>
              <h4 className="fw-bold">22 Days</h4>
              <p className="text-muted mb-0">This Month</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-clock-history text-info fs-1 mb-3"></i>
              <h4 className="fw-bold">9:00 AM</h4>
              <p className="text-muted mb-0">Check In Time</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-graph-up text-warning fs-1 mb-3"></i>
              <h4 className="fw-bold">96.5%</h4>
              <p className="text-muted mb-0">Attendance Rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4">Attendance History</h5>
          <div className="text-center text-muted py-5">
            <i className="bi bi-calendar-check fs-1 mb-3 d-block"></i>
            <p>Attendance tracking coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSection;
