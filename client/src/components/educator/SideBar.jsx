import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

const SideBar = () => {
  const { userData } = useContext(AppContext);

  const menuItems = [
    { name: 'Dashboard', path: '/educator/dashboard', icon: assets.home_icon },
    { name: 'Add Module', path: '/educator/add-course', icon: assets.add_icon },
    { name: 'My Modules', path: '/educator/my-courses', icon: assets.my_course_icon },
    { name: 'Trainees', path: '/educator/student-enrolled', icon: assets.person_tick_icon },
  ];

  // Only show sidebar for educators
  if (userData?.role !== 'educator') {
    return null;
  }

  return (
    <div className='md:w-64 w-16 border-r min-h-screen border-gray-700 py-2 flex flex-col bg-gray-800'>
      {menuItems.map((item) => (
        <NavLink
          to={item.path}
          key={item.name}
          end={item.path === '/educator/dashboard'}
          className={({ isActive }) =>
            `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 ${isActive
              ? 'bg-green-900/30 border-r-[6px] border-green-500'
              : 'hover:bg-gray-700/90 border-r-[6px] border-gray-800 hover:border-gray-700/90'
            } text-gray-300 hover:text-white transition-colors`
          }
        >
          <img src={item.icon} alt="" className="w-6 h-6 filter invert" />
          <p className='md:block hidden text-center'>{item.name}</p>
        </NavLink>
      ))}
    </div>
  );
};

export default SideBar;