import React from "react";
import Logo from "./Logo";
import { ThemeSwitcher } from "@/app/components/ThemeSwitcher";

const Navbar = () => {
  return (
    <nav className="w-full flex items-center">
      <div className="flex items-center w-full bg-white pl-16 pt-10 pb-20">
        <Logo />
      </div>

      <div className="flex flex-col items-end w-full pr-16 pt-10 pb-20">
        <ThemeSwitcher />
      </div>
    </nav>
  );
};

export default Navbar;
