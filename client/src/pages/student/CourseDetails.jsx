import React, { useContext, useEffect, useState } from 'react';
import Footer from '../../components/student/Footer';
import { assets } from '../../assets/assets';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import humanizeDuration from 'humanize-duration'
import YouTube from 'react-youtube';
import Loading from '../../components/student/Loading';

const CourseDetails = () => {
  const { id } = useParams()
  const [courseData, setCourseData] = useState(null)
  const [playerData, setPlayerData] = useState(null)
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false)
  const { backendUrl, currency, userData, calculateChapterTime, calculateCourseDuration, calculateRating, calculateNoOfLectures } = useContext(AppContext)
  const [openSections, setOpenSections] = useState({});

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/course/' + id)
      if (data.success) {
        setCourseData(data.courseData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const enrollCourse = async () => {
    try {
      if (!userData) {
        return toast.warn('Authentication required to enroll')
      }
      if (isAlreadyEnrolled) {
        return toast.warn('Already enrolled in this course')
      }

      const { data } = await axios.post(backendUrl + '/api/user/purchase',
        { courseId: courseData._id, email: userData.email }
      )

      if (data.success) {
        const { session_url } = data
        window.location.replace(session_url)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Function to handle preview based on lecture type
  const handlePreview = (lecture) => {
    if (lecture.lectureType === 'youtube') {
      // Extract video ID for YouTube
      const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
      const match = lecture.lectureUrl.match(regExp);
      const videoId = (match && match[2].length === 11) ? match[2] : null;
      
      setPlayerData({ 
        videoId,
        type: 'youtube'
      });
    } else if (lecture.lectureType === 'pdf' || lecture.lectureType === 'image') {
      // For PDF and image, open in new tab
      window.open(lecture.lectureUrl, '_blank');
    }
  }

  useEffect(() => {
    fetchCourseData()
  }, [])

  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id))
    }
  }, [userData, courseData])

  return courseData ? (
    <>
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-20 pt-10 text-left bg-gray-900 min-h-screen">
        <div className="absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-green-900/30 to-gray-900"></div>

        <div className="max-w-xl z-10 text-gray-300">
          <h1 className="md:text-course-deatails-heading-large text-course-deatails-heading-small font-semibold text-white">
            {courseData.courseTitle}
          </h1>
          <p className="pt-4 md:text-base text-sm" dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) }}>
          </p>

          <div className='flex items-center space-x-2 pt-3 pb-1 text-sm'>
            <p className="text-green-400">{calculateRating(courseData)}</p>
            <div className='flex'>
              {[...Array(5)].map((_, i) => (<img key={i} src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank} alt=''
                className='w-3.5 h-3.5' />
              ))}
            </div>
            <p className='text-green-400'>({courseData.courseRatings.length} {courseData.courseRatings.length > 1 ? 'ratings' : 'rating'})</p>

            <p>{courseData.enrolledStudents.length} {courseData.enrolledStudents.length > 1 ? 'students' : 'student'}</p>
          </div>

          <p className='text-sm'>Course by <span className='text-green-400 underline'>{courseData.educator.name}</span></p>

          <div className="pt-8 text-white">
            <h2 className="text-xl font-semibold">Course Structure</h2>
            <div className="pt-5">
              {courseData.courseContent.map((chapter, index) => (
                <div key={index} className="border border-gray-700 bg-gray-800 mb-2 rounded">
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center gap-2">
                      <img src={assets.down_arrow_icon} alt="arrow icon" className={`transform transition-transform ${openSections[index] ? "rotate-180" : ""} filter invert`} />
                      <p className="font-medium md:text-base text-sm">{chapter.chapterTitle}</p>
                    </div>
                    <p className="text-sm md:text-default">{chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}</p>
                  </div>

                  <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? "max-h-96" : "max-h-0"}`} >
                    <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-300 border-t border-gray-700">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex items-start gap-2 py-1">
                          <img src={assets.play_icon} alt="bullet icon" className="w-4 h-4 mt-1 filter invert" />
                          <div className="flex items-center justify-between w-full text-gray-300 text-xs md:text-default">
                            <p>{lecture.lectureTitle}</p>
                            <div className='flex gap-2'>
                              {lecture.isPreviewFree && (
                                <p 
                                  onClick={() => handlePreview(lecture)} 
                                  className='text-green-400 cursor-pointer hover:text-green-300'
                                >
                                  Preview
                                </p>
                              )}
                              <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="py-20 text-sm md:text-default">
            <h3 className="text-xl font-semibold text-white">Course Description</h3>
            <p className="rich-text pt-3 text-gray-300" dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}>
            </p>
          </div>
        </div>

        <div className="max-w-course-card z-10 border border-gray-700 rounded-t md:rounded overflow-hidden bg-gray-800 min-w-[300px] sm:min-w-[420px]">
          {playerData && playerData.type === 'youtube' ? (
            <YouTube 
              videoId={playerData.videoId} 
              opts={{ playerVars: { autoplay: 1 } }} 
              iframeClassName='w-full aspect-video' 
            />
          ) : (
            <img src={courseData.courseThumbnail} alt="" className="w-full aspect-video object-cover" />
          )}
          <div className="p-5">
            <div className="flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-300">
              <div className="flex items-center gap-1">
                <img src={assets.star} alt="star icon" className="filter invert" />
                <p>{calculateRating(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-gray-600"></div>
              <div className="flex items-center gap-1">
                <img src={assets.time_clock_icon} alt="clock icon" className="filter invert" />
                <p>{calculateCourseDuration(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-gray-600"></div>
              <div className="flex items-center gap-1">
                <img src={assets.lesson_icon} alt="clock icon" className="filter invert" />
                <p>{calculateNoOfLectures(courseData)} lessons</p>
              </div>
            </div>
            <button onClick={enrollCourse} className="md:mt-6 mt-4 w-full py-3 rounded bg-green-600 text-white font-medium hover:bg-green-500 transition-colors">
              {isAlreadyEnrolled ? "Access Course" : "Enroll Now"}
            </button>
            <div className="pt-6">
              <p className="md:text-xl text-lg font-medium text-white">What's in the course?</p>
              <ul className="ml-4 pt-2 text-sm md:text-default list-disc text-gray-300">
                <li>Lifetime access with security updates.</li>
                <li>Hands-on penetration testing labs.</li>
                <li>Downloadable security tools and resources.</li>
                <li>Real-world threat simulation exercises.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : <Loading />
};

export default CourseDetails;