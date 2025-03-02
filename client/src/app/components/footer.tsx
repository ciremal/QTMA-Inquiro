"use client";
import React from "react";
import Image from "next/image";
import { epilogue } from "@/app/ui/fonts";
import { useTheme } from "next-themes";
import Link from "next/link";

const Footer = () => {
  const { theme } = useTheme();
  return (
    <footer className={`font-normal ${epilogue.className} text-black bg-white dark:bg-black text-black dark:text-white py-6 px-16 flex flex-col md:flex-row justify-between items-center`}>
      <div className="flex flex-col items-center md:items-start">
        <div className="flex items-center space-x-2">
          <Image
                    src={theme === "dark" ? "/darkLogo.svg" : "/logo.svg"}
                    width={75}
                    height={27}
                    alt="logo"
                    style={{ verticalAlign: "bottom" }}
                  />
          <span className="text-xl font-semibold">Inquiro</span>
        </div>
        <p className="mt-2">&copy;Inquiro. 2025 All rights reserved.</p>
        <p className="">Built in Kingston</p>
      </div>
      <div className="flex flex-col items-center md:items-end space-y-2 mt-4 md:mt-0">
        <Link href="/terms-of-service" className="text-sm underline hover:text-gray-400">Terms of Service</Link>
        <Link href="/privacy-policy" className="text-sm underline hover:text-gray-400">Privacy Policy</Link>
        <a href="#" className="text-sm underline hover:text-gray-400">Contact Us</a>
      </div>
    </footer>
  );
};

export default Footer;
