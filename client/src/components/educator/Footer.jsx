import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const Footer = () => {
  const { navigate } = useContext(AppContext);
  return (
    <footer className="flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-8 border-t border-gray-700 py-4 bg-gray-900">
      <div className="flex items-center gap-4">
        <h1
          className="text-green-400 text-xl font-bold px-5 py-2 rounded-full font-mono cursor-pointer"
          onClick={() => navigate("/")}
        >
          CyberSec AAUA
        </h1>
        <div className="hidden md:block h-7 w-px bg-gray-600"></div>
        <p className="py-4 text-center text-xs md:text-sm text-gray-400">
          Copyright 2025 © CyberSec Academy. All Rights Secured.
        </p>
      </div>
      <div className="flex items-center gap-3 max-md:mt-4">
        <a href="#" className="hover:opacity-80 transition-opacity">
          <img src={assets.facebook_icon} alt="facebook_icon" className="filter invert" />
        </a>
        <a href="#" className="hover:opacity-80 transition-opacity">
          <img src={assets.twitter_icon} alt="twitter_icon" className="filter invert" />
        </a>
        <a href="#" className="hover:opacity-80 transition-opacity">
          <img src={assets.instagram_icon} alt="instagram_icon" className="filter invert" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;