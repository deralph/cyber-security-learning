import React from 'react'
import { assets } from '../../assets/assets'

const CallToAction = () => {
  return (
    <div className='flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0 bg-gray-900'>
      <h1 className='md:text-4xl text-xl text-green-400 font-semibold text-center'>Secure your future in cybersecurity</h1>
      <p className='text-gray-300 sm:text-sm text-center'>Develop the skills to protect digital infrastructure and defend against cyber threats with our specialized courses.</p>
      <div className='flex items-center font-medium gap-6 mt-4'>
        <button className='px-10 py-3 rounded-md text-white bg-green-600 hover:bg-green-500 transition-colors'>Start Learning</button>
        <button className='flex items-center gap-2 text-gray-300 hover:text-white'>
          Explore programs
          <img src={assets.arrow_icon} alt="arrow_icon" className="filter invert" />
        </button>
      </div>
    </div>
  )
}

export default CallToAction