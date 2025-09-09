import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import CourseCard from './CourseCard';
import { Link } from 'react-router-dom';

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext);

  // fallback if allCourses is undefined or not yet loaded
  const coursesToShow = allCourses && Array.isArray(allCourses) 
    ? allCourses.slice(0, 4) 
    : [];

  return (
    <div className="py-16 md:px-40 px-8 bg-gray-900">
      <h2 className="text-3xl font-medium text-green-400">Master Cyber Defense</h2>
      <p className="md:text-base text-sm text-gray-300 mt-3">
        Discover our top-rated security courses across various specializations. From ethical hacking and network security to digital forensics, our courses are crafted to build your cyber resilience.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4 md:px-0 md:my-16 my-10 gap-4">
        {coursesToShow.length > 0 ? (
          coursesToShow.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))
        ) : (
          <p className="col-span-full text-gray-400 text-center">
            No security courses available
          </p>
        )}
      </div>

      <Link
        to="/course-list"
        onClick={() => scrollTo(0, 0)}
        className="text-gray-300 border border-green-500/50 px-10 py-3 rounded hover:bg-green-500/10 transition-colors"
      >
        Explore all security courses
      </Link>
    </div>
  );
};

export default CoursesSection;