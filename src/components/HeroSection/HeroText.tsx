"use client";

import React from "react";

const HeroText = () => {
  return (
    <div className="lg:w-1/2 text-center lg:text-left">
      <h1 className="text-3xl md:text-6xl font-extrabold text-[#2F394D] mb-6 font-inter">
        One Platform.
        <br />
        Every Connection.
        <br />
        <span className="text-[#FA8800]">All the Way Home.</span>
      </h1>
      <p className="text-xl text-[#572F22] mb-8 max-w-lg mx-auto lg:mx-0">
        The easiest way to ship barrels and packages to the Caribbean. Compare
        providers, book, and track all in one place.
      </p>
      <button className="bg-[#FA8800] hover:bg-[#cc6e00] text-white font-semibold py-3 px-8 rounded-lg transition duration-300">
        Get Started
      </button>
    </div>
  );
};

export default HeroText;
