import React from "react";
import Logo from "./Logo";
import { ThemeSwitcher } from "./ThemeSwitcher";
import ProfilePic from "./ProfilePic";

const Navbar = () => {
  return (
    <nav className="w-full flex justify-between items-center z-10 md:px-20 px-8 py-12">
      {/* Left side: Original Logo */}
      <div className="flex items-center gap-2">
        <Logo />
      </div>

      <ul className="flex items-center space-x-4 pr-8">
        {/* <ThemeSwitcher /> */}
        <ProfilePic />
      </ul>
    </nav>
  );
};

export default Navbar;
