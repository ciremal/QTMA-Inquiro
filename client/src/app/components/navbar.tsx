import React from "react";
import { epilogue } from "../ui/fonts";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="w-full fixed flex justify-between items-center px-4 py-2 bg-transparent z-10 top-0">
      {/* Left side: Original Logo */}
      <div className="flex items-center gap-2">
        <div className="navbar px-2 py-2 flex flex-row justify-start items-center gap-x-3">
          <Link href="/">
            <Image
              src={"/logo.svg"}
              width={44.5}
              height={27}
              alt="logo"
              style={{ verticalAlign: "bottom" }}
            />
          </Link>
          <Link href="/">
            <span
              className={`font-normal ${epilogue.className}`}
              style={{ fontSize: 21.725, lineHeight: 1 }}
            >
              {"inqurio"}
            </span>
          </Link>
        </div>
      </div>

      <ul className="flex space-x-4 pr-8">
        <li>
          <Link href="/profile">
            <img
              src="/profilepic.svg"
              alt="Profile"
              className="w-11 h-11 cursor-pointer rounded-full"
            />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
