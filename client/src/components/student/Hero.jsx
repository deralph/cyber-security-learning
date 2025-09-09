import React from 'react';
import { assets } from '../../assets/assets';
import SearchBar from '../../components/student/SearchBar';

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full md:pt-36 pb-6 pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-green-900 via-gray-900 to-black">
      <h1 className="md:text-home-heading-large text-home-heading-small relative font-bold text-white max-w-3xl mx-auto">
        Secure your future with courses designed to
        <span className="text-green-400"> protect the digital world.</span>
        <img src={assets.sketch} alt="cyber security shield" className="md:block hidden absolute -bottom-7 right-0" />
      </h1>
      <p className="md:block hidden text-green-100 max-w-2xl mx-auto">
        We bring together world-class security experts, cutting-edge content, and a secure learning environment to help you defend against cyber threats.
      </p>
      <p className="md:hidden text-green-100 max-w-sm mx-auto">
        Learn from security experts to protect digital assets and infrastructure.
      </p>
      <SearchBar />
    </div>
  );
};

export default Hero;