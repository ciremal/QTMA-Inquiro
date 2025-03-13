import React from "react";
import Logo from "./Logo";

const Navbar = () => {
  return (
    <nav className="w-full flex items-center">
      <div className="flex items-center w-full bg-background pl-16 pt-10 pb-20">
        <Logo />
      </div>
    </nav>
  );
};

export default Navbar;
