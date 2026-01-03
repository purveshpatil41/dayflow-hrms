-- Update existing users who don't have fullName set
-- This sets their fullName to a default value based on their email
UPDATE users 
SET fullName = SUBSTRING_INDEX(email, '@', 1)
WHERE fullName IS NULL OR fullName = '';

-- Verify the update
SELECT id, employeeId, email, fullName, role FROM users;
