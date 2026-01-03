-- Add new employee management fields to users table
ALTER TABLE users 
ADD COLUMN department VARCHAR(100) DEFAULT NULL AFTER address,
ADD COLUMN jobTitle VARCHAR(100) DEFAULT NULL AFTER department,
ADD COLUMN joiningDate DATE DEFAULT NULL AFTER jobTitle,
ADD COLUMN basicSalary DECIMAL(10,2) DEFAULT 0 AFTER joiningDate,
ADD COLUMN allowances DECIMAL(10,2) DEFAULT 0 AFTER basicSalary;

-- Verify the changes
DESCRIBE users;
