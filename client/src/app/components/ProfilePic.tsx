"use client";

import { Avatar, Menu, MenuItem } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { redirect } from "next/navigation";

const ProfilePic = () => {
  const [user] = useAuthState(auth);
  const userSession = sessionStorage.getItem("user");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (!user && !userSession) {
      redirect("/login");
    }
  }, [user]);

  const getProfileDisplay = (name: string | null | undefined) => {
    const splitName = name?.split(" ");
    if (splitName) {
      return `${splitName[0][0]}${splitName[1][0]}`;
    }
    return null;
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Avatar
        className="dark:bg-white dark:text-primaryBlack cursor-pointer"
        sx={{ backgroundColor: "black" }}
        onClick={handleMenuOpen}
      >
        {getProfileDisplay(user?.displayName)}
      </Avatar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        className="mt-3"
      >
        {/* <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>Settings</MenuItem> */}
        <MenuItem
          onClick={() => {
            handleMenuClose();
            signOut(auth);
            sessionStorage.removeItem("user");
            redirect("/login");
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ProfilePic;
