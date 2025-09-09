import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const Navbar = ({ bgColor }) => {
  const { userData, isLoggedIn, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // If user is not authenticated, don't show the navbar
  if (!isLoggedIn()) return null;

  return (
    <div
      className={`flex items-center justify-between px-4 md:px-8 border-b border-gray-700 py-3 ${bgColor || 'bg-gray-800'}`}
    >
      <Link to={userData?.role === 'educator' ? '/educator/dashboard' : '/'}>
        <h1 
          className="text-green-400 text-xl font-bold px-5 py-2 rounded-full font-mono cursor-pointer"
        >
          CyberSec AAUA
        </h1>
      </Link>
      <div className="flex items-center gap-5 text-gray-300">
        <p>Welcome, {userData?.fullName}</p>
        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-medium">
          {userData?.fullName?.charAt(0) || 'U'}
        </div>
        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-300 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;