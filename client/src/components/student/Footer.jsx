import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const Footer = () => {
  const { navigate } = useContext(AppContext);
  return (
    <footer className="bg-gray-950 md:px-36 text-left w-full mt-10">
      <div className="flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-gray-700">
        <div className="flex flex-col md:items-start items-center w-full">
          <h1
            className="text-green-400 text-xl font-bold px-5 py-2 rounded-full font-mono cursor-pointer"
            onClick={() => navigate("/")}
          >
            CyberSec AAUA
          </h1>
          <p className="mt-6 text-center md:text-left text-sm text-gray-400">
            Building the next generation of cybersecurity professionals through cutting-edge education and hands-on training in digital defense.
          </p>
        </div>

        <div className="flex flex-col md:items-start items-center w-full">
          <ul className="flex md:flex-col w-full justify-between text-sm text-gray-400 md:space-y-2">
            <li className="hover:text-green-400 cursor-pointer transition-colors">
              <a>Home</a>
            </li>
            <li className="hover:text-green-400 cursor-pointer transition-colors">
              <a>About us</a>
            </li>
            <li className="hover:text-green-400 cursor-pointer transition-colors">
              <a>Contact us</a>
            </li>
            <li className="hover:text-green-400 cursor-pointer transition-colors">
              <a>Privacy policy</a>
            </li>
          </ul>
        </div>

        <div className="hidden md:flex flex-col items-start w-full">
          <h2 className="font-semibold text-white mb-5">
            Join our security alerts
          </h2>
          <p className="text-sm text-gray-400">
            The latest security updates, threat intelligence, and resources, sent to your inbox weekly.
          </p>
          <div className="flex items-center gap-2 pt-4">
            <input
              className="border border-gray-600 bg-gray-800 text-gray-300 placeholder-gray-500 outline-none w-64 h-9 rounded px-2 text-sm"
              type="email"
              placeholder="Enter your email"
            />
            <button className="bg-green-600 w-24 h-9 text-white rounded hover:bg-green-500 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm text-gray-500">
        Copyright 2025 © CyberSec Academy. All Rights Secured.
      </p>
    </footer>
  );
};

export default Footer;