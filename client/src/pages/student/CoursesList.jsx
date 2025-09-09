import React, { useContext, useEffect, useState } from 'react'
import Footer from '../../components/student/Footer'
import { assets } from '../../assets/assets'
import CourseCard from '../../components/student/CourseCard';
import { AppContext } from '../../context/AppContext';
import { useParams, useNavigate } from 'react-router-dom';
import SearchBar from '../../components/student/SearchBar';
import Loading from '../../components/student/Loading';

const CoursesList = () => {
    const { input } = useParams()
    const { allCourses, fetchAllCourses } = useContext(AppContext)
    const [filteredCourses, setFilteredCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        // Fetch courses if not already loaded
        if (!allCourses || allCourses.length === 0) {
            fetchAllCourses().finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (allCourses && allCourses.length > 0) {
            const tempCourses = [...allCourses]
            
            if (input) {
                setFilteredCourses(
                    tempCourses.filter(
                        item => item.courseTitle.toLowerCase().includes(input.toLowerCase())
                    )
                )
            } else {
                setFilteredCourses(tempCourses)
            }
        }
    }, [allCourses, input])

    if (loading) {
        return <Loading />
    }

    return (
        <>
            <div className="relative md:px-36 px-8 pt-20 text-left min-h-screen bg-gray-900">
                <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
                    <div>
                        <h1 className='text-4xl font-semibold text-green-400'>Security Courses</h1>
                        <p className='text-gray-400'>
                            <span onClick={() => navigate('/')} className='text-green-400 cursor-pointer hover:underline'>Home</span> 
                            / <span>Security Courses</span>
                        </p>
                    </div>
                    <SearchBar data={input} />
                </div>
                
                {input && (
                    <div className='inline-flex items-center gap-4 px-4 py-2 border mt-8 text-gray-300 bg-gray-800 border-gray-700 rounded-md'>
                        <p>Search results for: "{input}"</p>
                        <img 
                            onClick={() => navigate('/course-list')} 
                            className='cursor-pointer w-4 h-4 filter invert' 
                            src={assets.cross_icon} 
                            alt="Clear search" 
                        />
                    </div>
                )}
                
                {filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-6 px-2 md:p-0">
                        {filteredCourses.map((course, index) => (
                            <CourseCard key={course._id || index} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="my-16 text-center py-10 bg-gray-800 rounded-lg border border-gray-700">
                        <h3 className="text-xl font-semibold text-white mb-2">
                            {input ? 'No security courses found' : 'No security courses available'}
                        </h3>
                        <p className="text-gray-400 mb-4">
                            {input 
                                ? `No security courses match your search for "${input}"` 
                                : 'Check back later for new security courses'
                            }
                        </p>
                        {input && (
                            <button
                                onClick={() => navigate('/course-list')}
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 transition-colors"
                            >
                                View All Security Courses
                            </button>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </>
    )
}

export default CoursesList