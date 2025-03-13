import React from "react";
import Logo from "./Logo";
import ProfilePic from "./ProfilePic";

const Navbar = () => {
  return (
    <nav className="w-full flex md:flex-row flex-col md:justify-between justify-center items-center z-10 md:px-20 px-8 py-12">
      {/* Left side: Original Logo */}
      <div className="flex items-center gap-2">
        <Logo />
      </div>

      <ul className="flex items-center space-x-4 pr-8">
        <ProfilePic />
      </ul>
    </nav>
  );
};

export default Navbar;
