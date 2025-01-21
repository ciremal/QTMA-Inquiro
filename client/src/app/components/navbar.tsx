import React from "react";
import Logo from "./Logo";
import { ThemeSwitcher } from "./ThemeSwitcher";

const Navbar = () => {
  return (
    <nav className="w-full flex justify-between items-center p-6 z-10 px-20 py-12">
      {/* Left side: Original Logo */}
      <div className="flex items-center gap-2">
        <Logo />
      </div>

      <ul className="flex items-center space-x-4 pr-8">
        <ThemeSwitcher />
        <li>
          {/* <Link href="/profile"> */}
          <img
            src="/ProfilePic.svg"
            alt="Profile"
            className="w-14 h-14 cursor-pointer rounded-full"
          />
          {/* </Link> */}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
