import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { Line } from 'rc-progress';
import Footer from '../../components/student/Footer';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MyEnrollments = () => {
    const { userData, enrolledCourses, fetchEnrolledCourses, backendUrl, getToken, calculateCourseDuration, calculateNoOfLectures } = useContext(AppContext);
    const [progressArray, setProgressData] = useState([]);
    const navigate = useNavigate();

    const getCourseProgress = async () => {
        try {
            const token = await getToken();
            
            if (!token) {
                toast.error('Authentication required');
                return;
            }

            // Use Promise.all to handle multiple async operations
            const tempProgressArray = await Promise.all(
                enrolledCourses.map(async (course) => {
                    try {
                        const { data } = await axios.post(
                            `${backendUrl}/api/user/get-course-progress`,
                            { courseId: course._id, email: userData.email },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );

                        // Calculate total lectures
                        let totalLectures = calculateNoOfLectures(course);

                        const lectureCompleted = data.progressData ? data.progressData.lectureCompleted.length : 0;
                        return { totalLectures, lectureCompleted };
                    } catch (error) {
                        console.error('Error fetching progress for course:', course._id, error);
                        return { totalLectures: 0, lectureCompleted: 0 };
                    }
                })
            );

            setProgressData(tempProgressArray);
        } catch (error) {
            console.error('Error in getCourseProgress:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch course progress');
        }
    };

    useEffect(() => {
        if (userData) {
            fetchEnrolledCourses();
        }
    }, [userData]);

    useEffect(() => {
        if (enrolledCourses && enrolledCourses.length > 0) {
            getCourseProgress();
        }
    }, [enrolledCourses]);

    if (!userData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center p-6 bg-gray-800 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-semibold text-white">Authentication Required</h2>
                    <p className="mt-2 text-gray-400">Please log in to view your security training progress</p>
                    <button 
                        onClick={() => navigate('/login')} 
                        className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 transition-colors"
                    >
                        Secure Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className='md:px-36 px-8 pt-10 min-h-screen bg-gray-900'>
                <h1 className='text-2xl font-semibold text-green-400'>My Security Training</h1>

                {enrolledCourses && enrolledCourses.length > 0 ? (
                    <table className="md:table-auto table-fixed w-full overflow-hidden border mt-10 border-gray-700">
                        <thead className="text-white border-b border-gray-600 text-sm text-left max-sm:hidden">
                            <tr className="bg-gray-800">
                                <th className="px-4 py-3 font-semibold truncate">Security Course</th>
                                <th className="px-4 py-3 font-semibold truncate max-sm:hidden">Duration</th>
                                <th className="px-4 py-3 font-semibold truncate max-sm:hidden">Completed</th>
                                <th className="px-4 py-3 font-semibold truncate">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-300">
                            {enrolledCourses.map((course, index) => {
                                const progress = progressArray[index] || { totalLectures: 0, lectureCompleted: 0 };
                                const progressPercent = progress.totalLectures > 0 
                                    ? (progress.lectureCompleted * 100) / progress.totalLectures 
                                    : 0;
                                
                                return (
                                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
                                        <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">
                                            <img 
                                                src={course.courseThumbnail} 
                                                alt={course.courseTitle} 
                                                className="w-14 sm:w-24 md:w-28 object-cover rounded border border-gray-600" 
                                            />
                                            <div className='flex-1'>
                                                <p className='mb-1 max-sm:text-sm font-medium text-white'>{course.courseTitle}</p>
                                                <div className="flex items-center gap-2">
                                                    <Line 
                                                        className='bg-gray-700 rounded-full' 
                                                        strokeWidth={2} 
                                                        percent={progressPercent} 
                                                        strokeColor="#10B981" 
                                                        trailColor="#374151"
                                                    />
                                                    <span className="text-xs text-green-400">
                                                        {Math.round(progressPercent)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 max-sm:hidden">{calculateCourseDuration(course)}</td>
                                        <td className="px-4 py-3 max-sm:hidden">
                                            {progress.lectureCompleted} / {progress.totalLectures}
                                            <span className='text-xs ml-2 text-gray-400'>Modules</span>
                                        </td>
                                        <td className="px-4 py-3 max-sm:text-right">
                                            <button 
                                                onClick={() => navigate('/player/' + course._id)} 
                                                className='px-3 sm:px-5 py-1.5 sm:py-2 bg-green-600 max-sm:text-xs text-white rounded hover:bg-green-500 transition-colors'
                                            >
                                                {progressPercent === 100 ? 'Certified' : 'Continue Training'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div className="mt-10 bg-gray-800 p-6 rounded-md border border-gray-700 text-center">
                        <p className="text-gray-400">You haven't enrolled in any security courses yet.</p>
                        <button 
                            onClick={() => navigate('/')} 
                            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 transition-colors"
                        >
                            Explore Security Courses
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </>
    )
}

export default MyEnrollments;