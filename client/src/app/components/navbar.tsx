import React from "react";
import { epilogue } from "../ui/fonts";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="w-full flex justify-between items-center p-6 z-10 bg-[#F4F3EB] px-20 py-12">
      {/* Left side: Original Logo */}
      <div className="flex items-center gap-2">
        <div className="navbar px-2 py-2 flex flex-row justify-start items-baseline gap-x-3">
          <Link href="/">
            <Image
              src={"/logo.svg"}
              width={65}
              height={27}
              alt="logo"
              style={{ verticalAlign: "bottom" }}
            />
          </Link>
          <Link href="/">
            <span
              className={`font-normal ${epilogue.className}`}
              style={{ fontSize: 35, lineHeight: 1 }}
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
              className="w-14 h-14 cursor-pointer rounded-full"
            />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
