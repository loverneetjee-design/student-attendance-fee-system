-- Student Attendance & Fee Management System
-- Supabase Database Setup Script

-- Drop existing tables if they exist (be careful in production!)
DROP TABLE IF EXISTS fee_payments CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- Students table
CREATE TABLE students (
  id BIGSERIAL PRIMARY KEY,
  roll_number VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  class VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance table
CREATE TABLE attendance (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, date)
);

-- Fee payments table
CREATE TABLE fee_payments (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  fee_type VARCHAR(50) NOT NULL,
  payment_date DATE NOT NULL,
  due_date DATE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('paid', 'pending', 'overdue')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_students_roll_number ON students(roll_number);
CREATE INDEX idx_students_class ON students(class);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_status ON attendance(status);
CREATE INDEX idx_fee_payments_student ON fee_payments(student_id);
CREATE INDEX idx_fee_payments_status ON fee_payments(status);
CREATE INDEX idx_fee_payments_date ON fee_payments(payment_date);

-- Insert sample data (optional)
INSERT INTO students (roll_number, name, class, email, phone, address) VALUES
('2024001', 'Rahul Kumar', '10th A', 'rahul@example.com', '9876543210', 'Delhi'),
('2024002', 'Priya Sharma', '10th A', 'priya@example.com', '9876543211', 'Mumbai'),
('2024003', 'Amit Patel', '10th B', 'amit@example.com', '9876543212', 'Ahmedabad'),
('2024004', 'Sneha Singh', '9th A', 'sneha@example.com', '9876543213', 'Bangalore'),
('2024005', 'Vikram Reddy', '9th B', 'vikram@example.com', '9876543214', 'Hyderabad');

-- Insert sample attendance (today's date)
INSERT INTO attendance (student_id, date, status) VALUES
(1, CURRENT_DATE, 'present'),
(2, CURRENT_DATE, 'present'),
(3, CURRENT_DATE, 'absent'),
(4, CURRENT_DATE, 'present'),
(5, CURRENT_DATE, 'late');

-- Insert sample fee payments
INSERT INTO fee_payments (student_id, amount, fee_type, payment_date, due_date, status) VALUES
(1, 5000.00, 'tuition', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'paid'),
(2, 5000.00, 'tuition', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'pending'),
(3, 1500.00, 'transport', CURRENT_DATE, CURRENT_DATE + INTERVAL '15 days', 'paid'),
(4, 5000.00, 'tuition', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '1 day', 'overdue'),
(5, 2000.00, 'exam', CURRENT_DATE, CURRENT_DATE + INTERVAL '20 days', 'pending');

-- Enable Row Level Security (RLS) - Optional but recommended
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your security needs)
CREATE POLICY "Enable read access for all users" ON students FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON students FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON students FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON students FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON attendance FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON attendance FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON attendance FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON fee_payments FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON fee_payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON fee_payments FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON fee_payments FOR DELETE USING (true);

-- Success message
SELECT 'Database setup completed successfully!' as message;