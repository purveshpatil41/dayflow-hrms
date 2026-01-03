# Admin Employee Management Setup Guide

## Overview
This update adds comprehensive employee management functionality to the Admin Dashboard with:
- Employee list with search and filtering
- Detailed employee view with edit capabilities
- Attendance tracking and visualization
- Leave history per employee
- Master-detail UI pattern (no navigation, single dashboard)

## Files Created/Modified

### Backend Files Created:
1. `backend/controllers/adminController.js` - Admin business logic
2. `backend/routes/adminRoutes.js` - Admin API endpoints
3. `backend/migrations/add_employee_fields.sql` - Database migration script

### Backend Files Modified:
1. `backend/server.js` - Added admin routes registration
2. `backend/models/User.js` - Added job and salary fields

### Frontend Files Created:
1. `src/components/EmployeeList.jsx` - Employee list with search
2. `src/components/EmployeeDetail.jsx` - Employee detail view with tabs
3. `src/components/AttendanceView.jsx` - Attendance records display
4. `src/components/EmployeeLeaves.jsx` - Employee leave history

### Frontend Files Modified:
1. `src/pages/AdminDashboard.jsx` - Integrated all employee management views
2. `src/components/Sidebar.jsx` - Added onClick handlers for view switching
3. `src/services/adminService.js` - Already created (API client)

## Database Migration

### Step 1: Run SQL Migration
Open phpMyAdmin or MySQL command line and execute:

```sql
USE dayflow_hrms;

ALTER TABLE users 
ADD COLUMN department VARCHAR(100) DEFAULT NULL AFTER address,
ADD COLUMN jobTitle VARCHAR(100) DEFAULT NULL AFTER department,
ADD COLUMN joiningDate DATE DEFAULT NULL AFTER jobTitle,
ADD COLUMN basicSalary DECIMAL(10,2) DEFAULT 0 AFTER joiningDate,
ADD COLUMN allowances DECIMAL(10,2) DEFAULT 0 AFTER basicSalary;

DESCRIBE users;
```

### Step 2: Verify Migration
Check that the following columns were added:
- `department` (VARCHAR 100)
- `jobTitle` (VARCHAR 100)
- `joiningDate` (DATE)
- `basicSalary` (DECIMAL 10,2)
- `allowances` (DECIMAL 10,2)

## Backend API Endpoints

All endpoints require JWT authentication and Admin/HR role.

### 1. Get All Employees
**Endpoint:** `GET /api/admin/employees`
**Auth:** Required (Admin/HR)
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "employeeId": "EMP001",
      "fullName": "John Doe",
      "email": "john@dayflow.com",
      "phone": "1234567890",
      "address": "123 Main St",
      "role": "Employee",
      "department": "Engineering",
      "jobTitle": "Software Engineer",
      "joiningDate": "2023-01-15",
      "basicSalary": 50000,
      "allowances": 10000,
      "totalSalary": 60000
    }
  ]
}
```

### 2. Get Employee by ID
**Endpoint:** `GET /api/admin/employees/:id`
**Auth:** Required (Admin/HR)
**Response:** Single employee object

### 3. Update Employee
**Endpoint:** `PUT /api/admin/employees/:id`
**Auth:** Required (Admin/HR)
**Body:**
```json
{
  "fullName": "John Doe Updated",
  "email": "john.updated@dayflow.com",
  "phone": "9876543210",
  "address": "456 New St",
  "department": "Engineering",
  "jobTitle": "Senior Engineer",
  "joiningDate": "2023-01-15",
  "basicSalary": 60000,
  "allowances": 15000,
  "role": "Employee"
}
```

### 4. Get Employee Attendance
**Endpoint:** `GET /api/admin/employees/:id/attendance`
**Auth:** Required (Admin/HR)
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-01-15",
      "status": "Present",
      "checkIn": "09:00 AM",
      "checkOut": "06:00 PM",
      "hours": "9 hrs"
    }
  ]
}
```
**Note:** Currently returns mock data for 30 days. Implement real attendance tracking system later.

### 5. Get Employee Leaves
**Endpoint:** `GET /api/admin/employees/:id/leaves`
**Auth:** Required (Admin/HR)
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "employeeId": "EMP001",
      "userId": 1,
      "leaveType": "Sick Leave",
      "fromDate": "2024-01-20",
      "toDate": "2024-01-22",
      "totalDays": 3,
      "reason": "Medical checkup",
      "status": "Approved",
      "adminComment": "Approved"
    }
  ]
}
```

## Frontend Features

### 1. Employee List View
**Access:** Click "Employees" in sidebar
**Features:**
- Search by name, email, employee ID, or department
- Displays: Employee ID, Name, Email, Department, Role
- Click row or "View" button to see details
- Active row highlighting for selected employee

### 2. Employee Detail View
**Access:** Click employee from list
**Features:**
- Three tabs: Personal Details, Job Details, Salary Structure
- Edit mode: Toggle between view and edit
- Personal tab: Name, Email, Phone, Address, Role
- Job tab: Job Title, Department, Joining Date, Employee ID
- Salary tab: Basic Salary, Allowances, Total (calculated)
- Save/Cancel buttons in edit mode
- Back button to return to list

### 3. Attendance View
**Access:** 
- Sidebar → "Attendance" (master-detail layout)
- Employee Detail page (sidebar widget)
**Features:**
- Statistics cards: Present, Absent, On Leave, Attendance %
- Table: Date, Day, Status, Check In, Check Out, Hours
- Status badges with color coding

### 4. Employee Leaves View
**Access:**
- Sidebar → "Leave Management" (master-detail layout)
- Employee Detail page (sidebar widget)
**Features:**
- Statistics: Pending, Approved, Rejected, Total
- Table: Leave Type, Dates, Days, Reason, Status, Admin Comment
- Status badges with color coding

### 5. Dashboard Navigation
**State Management:**
- `activeView`: Current view (dashboard, employees, employeeDetail, attendance, leaves)
- `selectedEmployeeId`: Currently selected employee
- View switching via sidebar onClick handlers
- No navigation, all within single AdminDashboard

## Testing Workflow

### 1. Start Backend Server
```bash
cd backend
npm start
```
Server should run on port 5000

### 2. Start Frontend Server
```bash
cd human-resource
npm run dev
```
Frontend should run on port 5173

### 3. Login as Admin
- Email: (your admin account)
- Password: (your admin password)
- Ensure user role is "Admin" or "HR"

### 4. Test Employee List
- Click "Employees" in sidebar
- Should see list of all users
- Try search functionality
- Employee IDs should show as EMP001, EMP002, etc.

### 5. Test Employee Detail
- Click any employee in list
- Should navigate to detail view
- Verify three tabs: Personal, Job, Salary
- Click "Edit" button
- Modify fields
- Click "Save" - should update employee
- Click "Cancel" - should revert changes

### 6. Test Attendance View
- From employee detail, check attendance widget
- Should see 30 days of mock data
- Statistics should calculate correctly
- Or click "Attendance" in sidebar for master-detail layout

### 7. Test Leave Management
- From employee detail, check leaves widget
- Should show actual leaves from database
- Statistics should count correctly
- Or click "Leave Management" in sidebar

### 8. Test Security
- Logout
- Login as regular employee (role: "Employee")
- Try accessing admin endpoints manually:
  - Should get 403 Forbidden response
  - Frontend should prevent access

## Troubleshooting

### Backend Won't Start
- Check MySQL is running (XAMPP control panel)
- Verify database `dayflow_hrms` exists
- Check backend/.env file has correct DB credentials
- Run migration script if columns don't exist

### Frontend Components Not Showing
- Check browser console for errors
- Verify all imports in AdminDashboard.jsx
- Check sidebar onClick handlers are working
- Ensure activeView state is updating

### Employee List Empty
- Check database has users
- Verify API endpoint returns data
- Check browser network tab for 401/403 errors
- Ensure JWT token is valid in localStorage

### Update Not Working
- Check request payload in network tab
- Verify backend receives PUT request
- Check adminController.js updateEmployee function
- Ensure User model has new fields

### Attendance Shows Mock Data
- This is expected behavior
- Attendance tracking system needs separate implementation
- Mock data helps visualize UI
- Replace with real data when attendance system is built

## Next Steps (Future Enhancements)

1. **Real Attendance System:**
   - Add Attendance model
   - Create attendance marking endpoints
   - Replace mock data with real records

2. **Add Employee:**
   - Create "Add Employee" modal
   - Registration form with all fields
   - Email verification flow

3. **Delete Employee:**
   - Soft delete functionality
   - Confirmation dialog
   - Archive system

4. **Bulk Operations:**
   - Import employees from CSV
   - Export employee data
   - Bulk salary updates

5. **Advanced Filtering:**
   - Filter by department
   - Filter by date range
   - Filter by status

6. **Reports:**
   - Department-wise reports
   - Salary reports
   - Attendance reports
   - Leave reports

## Security Notes

- All admin endpoints protected with JWT authentication
- Role-based access: Only Admin and HR can access
- Regular employees (role: "Employee") get 403 Forbidden
- Frontend hides admin features for non-admin users
- Password updates require current password verification
- Sensitive data (password) excluded from API responses

## File Structure
```
backend/
  ├── controllers/
  │   └── adminController.js (NEW)
  ├── routes/
  │   └── adminRoutes.js (NEW)
  ├── migrations/
  │   └── add_employee_fields.sql (NEW)
  ├── models/
  │   └── User.js (MODIFIED)
  └── server.js (MODIFIED)

human-resource/
  ├── src/
  │   ├── components/
  │   │   ├── EmployeeList.jsx (NEW)
  │   │   ├── EmployeeDetail.jsx (NEW)
  │   │   ├── AttendanceView.jsx (NEW)
  │   │   ├── EmployeeLeaves.jsx (NEW)
  │   │   └── Sidebar.jsx (MODIFIED)
  │   ├── pages/
  │   │   └── AdminDashboard.jsx (MODIFIED)
  │   └── services/
  │       └── adminService.js (ALREADY EXISTS)
```

## Design Compliance
✅ No CSS changes made
✅ No layout modifications
✅ No color scheme changes
✅ Uses existing Bootstrap classes
✅ Follows existing design patterns
✅ Only logic and functionality added
