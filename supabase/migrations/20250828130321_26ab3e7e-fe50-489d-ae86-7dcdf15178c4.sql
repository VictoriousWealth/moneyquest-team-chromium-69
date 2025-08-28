-- Update the password for Alex Johnson's account to match our demo login
-- This will allow the login to work with the existing account
UPDATE auth.users 
SET encrypted_password = crypt('moneyquest123', gen_salt('bf'))
WHERE email = 'alex.johnson@demo.com';