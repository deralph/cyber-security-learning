import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const MyCourses = () => {
  const { backendUrl, userData, currency, getToken } = useContext(AppContext);
  const [courses, setCourses] = useState(null);

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();
      
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const { data } = await axios.post(
        backendUrl + '/api/educator/courses', 
        { email: userData.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch security modules');
    }
  };

  useEffect(() => {
    if (userData && userData.role === 'educator') {
      fetchEducatorCourses();
    }
  }, [userData]);

  if (!userData || userData.role !== 'educator') {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center p-6 bg-gray-800 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-red-400">Access Denied</h2>
          <p className="text-gray-400 mt-2">Only security instructors can access this portal.</p>
        </div>
      </div>
    );
  }

  return courses ? (
    <div className="min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0 bg-gray-900">
      <div className='w-full'>
        <h2 className="pb-4 text-2xl font-bold text-green-400">My Security Modules</h2>
        {courses.length > 0 ? (
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-gray-800 border border-gray-700">
            <table className="md:table-auto table-fixed w-full overflow-hidden">
              <thead className="text-white border-b border-gray-700 text-sm text-left">
                <tr className="bg-gray-750">
                  <th className="px-4 py-3 font-semibold truncate">Security Modules</th>
                  <th className="px-4 py-3 font-semibold truncate">Trainees</th>
                  <th className="px-4 py-3 font-semibold truncate hidden md:table-cell">Published On</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-300">
                {courses.map((course) => (
                  <tr key={course._id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <img 
                        src={course.courseThumbnail} 
                        alt="Course" 
                        className="w-16 h-10 object-cover rounded border border-gray-600" 
                      />
                      <span className="truncate text-white">{course.courseTitle}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-green-900/50 text-green-400 px-2 py-1 rounded-full text-xs">
                        {course.enrolledStudents?.length || 0} trainees
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-800 p-6 rounded-md border border-gray-700 text-center">
            <p className="text-gray-400">You haven't created any security modules yet.</p>
            <a 
              href="/educator/add-course" 
              className="text-green-400 hover:text-green-300 mt-2 inline-block transition-colors"
            >
              Create your first security module
            </a>
          </div>
        )}
      </div>
    </div>
  ) : <Loading />;
};

export default MyCourses;