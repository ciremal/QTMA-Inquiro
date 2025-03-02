"use client";

import { Avatar, Menu, MenuItem } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { redirect } from "next/navigation";
import SettingsPopup from "./settingsPopUp"

const ProfilePic = () => {
  const [user] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const getProfileDisplay = (name: string | null | undefined) => {
    const splitName = name?.split(" ");
    if (splitName) {
      return `${splitName[0][0]}${splitName[1][0]}`;
    }
    return null;
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    handleMenuClose();
    signOut(auth);
    document.cookie =
      "firebase-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    redirect("/login");
  };

  const shortenName = (name: string | null | undefined) => {
    const splitName = name?.split(" ");
    if (splitName) {
      return `${splitName[0]} ${splitName[1][0]}.`;
    }
    return null;
  }

  const isMenuOpen = Boolean(anchorEl);

  return (
    <div className="relative w-sm">
      {/* Main Profile Section */}
      <div
        className={`flex items-center justify-between backdrop-blur-md bg-white dark:bg-secondaryBlack p-2 rounded-3xl border border-primaryGray cursor-pointer transition-all duration-300 ${
          isOpen ? "rounded-b-none" : ""
        }`}
        onClick={handleToggle}
      >
        <div className="flex items-center">
          <Avatar
            className="dark:bg-white dark:text-primaryBlack"
            sx={{ backgroundColor: "black" }}
          >
            {getProfileDisplay(user?.displayName)}
          </Avatar>
          <p className="ml-4 font-sans dark:text-white text-center my-auto max-w-[85px] truncate">
            {shortenName(user?.displayName)}
          </p>
        </div>
        <svg
          className={`ml-4 my-auto transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          width="15"
          height="8"
          viewBox="0 0 15 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.427734 0.125L7.34169 7.03896L14.2556 0.125H0.427734Z"
            fill="#323232"
          />
        </svg>
      </div>

      {/* Collapsible Menu */}
      <div
        className={`absolute font-sans top-full left-0 w-full transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white dark:bg-secondaryBlack border border-t-0 border-primaryGray rounded-b-3xl">
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
          onClick={() => setIsSettingsOpen(true)}>
            Settings
          </button>
          <SettingsPopup isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white rounded-b-3xl" onClick={handleSignOut}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};


export default ProfilePic;
