# Student Attendance & Fee Management System

A complete web application for managing student attendance and fee payments built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

### 📊 Dashboard
- Real-time statistics
- Total students count
- Today's attendance summary
- Pending fees overview
- Today's fee collection

### 👨‍🎓 Student Management
- Add/Edit/Delete students
- Student profiles with details
- Search and filter functionality
- Class-wise organization

### ✅ Attendance Tracking
- Daily attendance marking
- Present/Absent/Late status
- Date-wise attendance view
- Bulk attendance marking
- Attendance history

### 💰 Fee Management
- Multiple fee types (Tuition, Transport, Exam, etc.)
- Fee payment recording
- Payment status tracking (Paid/Pending/Overdue)
- Due date management
- Fee collection reports

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Deployment**: Vercel

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/loverneetjee-design/student-attendance-fee-system.git
cd student-attendance-fee-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a Supabase account at https://supabase.com
2. Create a new project
3. Run the following SQL to create tables:

```sql
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
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_fee_payments_student ON fee_payments(student_id);
CREATE INDEX idx_fee_payments_status ON fee_payments(status);
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your Supabase project settings.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production

```bash
npm run build
npm start
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Usage

### Adding Students
1. Navigate to Students page
2. Click "Add Student"
3. Fill in student details
4. Submit the form

### Marking Attendance
1. Go to Attendance page
2. Click "Mark Attendance"
3. Select date
4. Mark each student as Present/Absent/Late
5. Save attendance

### Recording Fee Payments
1. Navigate to Fees page
2. Click "Collect Fee"
3. Select student and fee type
4. Enter amount and dates
5. Record payment

## Database Schema

### Students
- id, roll_number, name, class, email, phone, address, created_at

### Attendance
- id, student_id, date, status, created_at

### Fee Payments
- id, student_id, amount, fee_type, payment_date, due_date, status, created_at

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js and Supabase