import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '../../components/educator/SideBar'
import Navbar from '../../components/educator/Navbar'
import Footer from '../../components/educator/Footer'

const Educator = () => {
    return (
        <div className="text-gray-300 min-h-screen bg-gray-900">
            <Navbar />
            <div className='flex'>
                <SideBar />
                <div className='flex-1'>
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Educator