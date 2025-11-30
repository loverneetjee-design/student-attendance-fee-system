'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    pendingFees: 0,
    collectedToday: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const today = new Date().toISOString().split('T')[0]
    
    const { count: studentCount } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
    
    const { count: presentCount } = await supabase
      .from('attendance')
      .select('*', { count: 'exact', head: true })
      .eq('date', today)
      .eq('status', 'present')
    
    const { data: feeData } = await supabase
      .from('fee_payments')
      .select('amount')
      .eq('status', 'pending')
    
    const { data: todayFees } = await supabase
      .from('fee_payments')
      .select('amount')
      .eq('payment_date', today)
      .eq('status', 'paid')
    
    setStats({
      totalStudents: studentCount || 0,
      presentToday: presentCount || 0,
      pendingFees: feeData?.reduce((sum, f) => sum + f.amount, 0) || 0,
      collectedToday: todayFees?.reduce((sum, f) => sum + f.amount, 0) || 0
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">Student Management System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/students" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Students
              </Link>
              <Link href="/attendance" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Attendance
              </Link>
              <Link href="/fees" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Fees
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow-lg rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                      <dd className="text-3xl font-semibold text-gray-900">{stats.totalStudents}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-lg rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Present Today</dt>
                      <dd className="text-3xl font-semibold text-gray-900">{stats.presentToday}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-lg rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Pending Fees</dt>
                      <dd className="text-3xl font-semibold text-gray-900">₹{stats.pendingFees}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-lg rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Collected Today</dt>
                      <dd className="text-3xl font-semibold text-gray-900">₹{stats.collectedToday}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Link href="/students/add" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition duration-200">
                Add New Student
              </Link>
              <Link href="/attendance/mark" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition duration-200">
                Mark Attendance
              </Link>
              <Link href="/fees/collect" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition duration-200">
                Collect Fee
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}