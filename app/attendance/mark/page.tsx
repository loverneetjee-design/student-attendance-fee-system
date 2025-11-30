'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Student {
  id: number
  roll_number: string
  name: string
  class: string
}

export default function MarkAttendancePage() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [attendance, setAttendance] = useState<{ [key: number]: string }>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    const { data } = await supabase
      .from('students')
      .select('*')
      .order('roll_number', { ascending: true })
    
    if (data) {
      setStudents(data)
      const initialAttendance: { [key: number]: string } = {}
      data.forEach(student => {
        initialAttendance[student.id] = 'present'
      })
      setAttendance(initialAttendance)
    }
  }

  const handleStatusChange = (studentId: number, status: string) => {
    setAttendance({
      ...attendance,
      [studentId]: status
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const records = Object.entries(attendance).map(([studentId, status]) => ({
      student_id: parseInt(studentId),
      date: selectedDate,
      status: status
    }))

    const { error } = await supabase
      .from('attendance')
      .upsert(records, { onConflict: 'student_id,date' })

    if (error) {
      alert('Error marking attendance: ' + error.message)
    } else {
      alert('Attendance marked successfully!')
      router.push('/attendance')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">SMS</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Mark Attendance</h1>

          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.roll_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.class}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(student.id, 'present')}
                              className={`px-3 py-1 rounded ${
                                attendance[student.id] === 'present'
                                  ? 'bg-green-600 text-white'
                                  : 'bg-gray-200 text-gray-700'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(student.id, 'absent')}
                              className={`px-3 py-1 rounded ${
                                attendance[student.id] === 'absent'
                                  ? 'bg-red-600 text-white'
                                  : 'bg-gray-200 text-gray-700'
                              }`}
                            >
                              Absent
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(student.id, 'late')}
                              className={`px-3 py-1 rounded ${
                                attendance[student.id] === 'late'
                                  ? 'bg-yellow-600 text-white'
                                  : 'bg-gray-200 text-gray-700'
                              }`}
                            >
                              Late
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <Link href="/attendance" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Attendance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}