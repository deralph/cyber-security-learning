import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [userType, setUserType] = useState('student');
  const [formData, setFormData] = useState({
    matricNumber: '',
    staffId: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { setUserData, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const { matricNumber, staffId, password } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let endpoint, credentials;
      
      if (userType === 'student') {
        endpoint = '/api/auth/login/student';
        credentials = { matricNumber, password };
      } else {
        endpoint = '/api/auth/login/educator';
        credentials = { staffId, password };
      }

      const res = await axios.post(`${backendUrl}${endpoint}`, credentials);
      
      // Save token to localStorage
      localStorage.setItem('token', res.data.token);
      
      // Set user data in context
      setUserData(res.data.user);
      
      // Redirect based on role
      if (res.data.user.role === 'student') {
        navigate('/');
      } else {
        navigate('/educator/dashboard');
      }
      
      toast.success('Authentication successful');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-2">
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        <h2 className="mt-4 text-center text-3xl font-bold text-green-400">Secure Access Portal</h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Authenticate to access the CyberSec Learning Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-6 shadow-xl border border-green-500/20 rounded-lg sm:px-10">
          <div className="flex justify-center mb-6">
            <div className="flex space-x-1 bg-gray-700 p-1 rounded-md">
              <button
                type="button"
                className={`px-6 py-2 text-sm font-medium rounded-md ${userType === 'student' ? 'bg-green-600 text-white shadow-md' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setUserType('student')}
              >
                Student
              </button>
              <button
                type="button"
                className={`px-6 py-2 text-sm font-medium rounded-md ${userType === 'educator' ? 'bg-green-600 text-white shadow-md' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setUserType('educator')}
              >
                Instructor
              </button>
            </div>
          </div>

          <form className="space-y-6" onSubmit={onSubmit}>
            {userType === 'student' ? (
              <div>
                <label htmlFor="matricNumber" className="block text-sm font-medium text-gray-300">
                  Matric Number
                </label>
                <div className="mt-1">
                  <input
                    id="matricNumber"
                    name="matricNumber"
                    type="text"
                    required
                    value={matricNumber}
                    onChange={onChange}
                    className="appearance-none block w-full px-3 py-3 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Enter your matric number"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="staffId" className="block text-sm font-medium text-gray-300">
                  Staff ID
                </label>
                <div className="mt-1">
                  <input
                    id="staffId"
                    name="staffId"
                    type="text"
                    required
                    value={staffId}
                    onChange={onChange}
                    className="appearance-none block w-full px-3 py-3 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Enter your staff ID"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <a href="#" className="text-sm text-green-400 hover:text-green-300">
                  Forgot password?
                </a>
              </div>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={onChange}
                  className="appearance-none block w-full px-3 py-3 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors duration-200"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  'Secure Login'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">Need system access?</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Link
                to="/register/student"
                className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
              >
                Student Registration
              </Link>
              <Link
                to="/register/educator"
                className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
              >
                Instructor Registration
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By accessing this system, you agree to our <a href="#" className="text-green-400 hover:text-green-300">Security Policy</a> and <a href="#" className="text-green-400 hover:text-green-300">Terms of Use</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;