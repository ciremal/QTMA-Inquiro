import React from "react";
import { epilogue } from "../ui/fonts";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="w-full fixed flex justify-between items-center px-4 py-2 bg-transparent z-10 top-0">
      {/* Left side: Original Logo */}
      <div className="flex items-center gap-2">
        <div className="navbar px-2 py-2 flex flex-row justify-start items-center gap-x-3">
          <a href="/profile">
            <Image
              src={"/logo.svg"}
              width={44.5}
              height={27}
              alt="logo"
              style={{ verticalAlign: "bottom" }}
            />
          </a>
          <a href="/profile">
            <span
              className={`font-normal ${epilogue.className}`}
              style={{ fontSize: 21.725, lineHeight: 1 }}
            >
              {"inqurio"}
            </span>
          </a>
        </div>
      </div>

      <ul className="flex space-x-4 pr-8">
        <li>
          <a href="/profile">
            <img
              src="/profilepic.svg"
              alt="Profile"
              className="w-11 h-11 cursor-pointer rounded-full"
            />
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;