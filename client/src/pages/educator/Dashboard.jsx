import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const Dashboard = () => {
  const { backendUrl, userData, currency, getToken } = useContext(AppContext)
  const [dashboardData, setDashboardData] = useState(null)

  const fetchDashboardData = async () => {
    try {
      const token = await getToken()
      
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const { data } = await axios.post(
        backendUrl + '/api/educator/dashboard',
        { email: userData.email },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        setDashboardData(data.dashboardData)
        console.log("dashboard data = ",data.dashboardData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Dashboard error: ", error)
      toast.error(error.response?.data?.message || 'Failed to fetch dashboard data')
    }
  }

  useEffect(() => {
    if (userData && userData.role === 'educator') {
      fetchDashboardData()
    }
  }, [userData])

  // Function to generate avatar from name
  const getAvatarFromName = (name) => {
    if (!name) return assets.profile_img;
    
    const colors = ['bg-green-600', 'bg-green-500', 'bg-green-700', 'bg-green-800'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    return (
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-medium ${randomColor}`}>
        {name.charAt(0).toUpperCase()}
      </div>
    );
  };

  return dashboardData ? (
    <div className='min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0 bg-gray-900'>
      <div className='space-y-5 w-full'>
        <h1 className='text-2xl font-bold text-green-400'>Security Instructor Dashboard</h1>
        
        <div className='flex flex-wrap gap-5 items-center'>
          <div className='flex items-center gap-3 border border-green-500/30 bg-gray-800 p-4 w-56 rounded-md'>
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <img src={assets.patients_icon} alt="students_icon" className="w-5 h-5 filter invert" />
            </div>
            <div>
              <p className='text-2xl font-medium text-white'>{dashboardData.enrolledStudentsData.length
 || 0}</p>
              <p className='text-base text-gray-400'>Security Trainees</p>
            </div>
          </div>
          <div className='flex items-center gap-3 border border-green-500/30 bg-gray-800 p-4 w-56 rounded-md'>
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <img src={assets.appointments_icon} alt="courses_icon" className="w-5 h-5 filter invert" />
            </div>
            <div>
              <p className='text-2xl font-medium text-white'>{dashboardData.totalCourses || 0}</p>
              <p className='text-base text-gray-400'>Security Modules</p>
            </div>
          </div>
        </div>
        
        <div className='w-full'>
          <h2 className="pb-4 text-lg font-medium text-white">Recent Security Trainees</h2>
          {dashboardData.enrolledStudentsData && dashboardData.enrolledStudentsData.length > 0 ? (
            <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-gray-800 border border-gray-700">
              <table className="table-fixed md:table-auto w-full overflow-hidden">
                <thead className="text-white border-b border-gray-700 text-sm text-left">
                  <tr className="bg-gray-750">
                    <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th>
                    <th className="px-4 py-3 font-semibold">Trainee Name</th>
                    <th className="px-4 py-3 font-semibold">Security Module</th>
                    <th className="px-4 py-3 font-semibold">Enrollment Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-300">
                  {dashboardData.enrolledStudentsData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3 text-center hidden sm:table-cell">{index + 1}</td>
                      <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                        {getAvatarFromName(item.student?.email)}
                        <span className="truncate text-white">{item.student?.email || 'Unknown Trainee'}</span>
                      </td>
                      <td className="px-4 py-3 truncate">{item.courseTitle || 'Unknown Module'}</td>
                      <td className="px-4 py-3">
                        {/* {item.enrollmentDate ? new Date(item.enrollmentDate).toLocaleDateString() : 'N/A'} */}
                        {item.enrolledDate ? new Date(item.enrolledDate).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-gray-800 p-6 rounded-md border border-gray-700 text-center">
              <p className="text-gray-400">No training enrollments yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : <Loading />
}

export default Dashboard