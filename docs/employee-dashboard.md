# Employee Dashboard

## Purpose
The Employee Dashboard is the  main place where an employee interacts with the HR system. It allows employees to view their information and manage basic HR tasks without contacting HR for every small request.

---

## What an Employee Can Do
- View their personal profile details
- Check their attendance history
- Apply for leave
- View the status of leave requests
- log out securely

---

## Typical Flow
1. Employee logs in using their credentials.
2. The system redirects them to the dashboard.
3. From the dashboard, the employee can:
   - Submit a leave request
   - Track whether the leave is approved or rejected
   - Review attendance records
4. Employee logs out after completing their tasks.

---

## Permissions
- Employees can only see their own data.
- Employees cannot view or edit data of other employees.
- Salary information is visible but cannot be edited.
- Leave approval actions are restricted to Admin/HR users.

All access rules are enforced by the backend to ensure data security.

---

## Backend Interaction
The dashboard communicates with backend APIs to:
- Fetch employee profile data
- Submit leave requests
- Fetch leave request status
- Fetch attendance records

The backend validates every request before returning data or performing actions.

---

## Notes
This dashboard is designed to keep employee interactions simple while maintaining strict access control and data integrity.
