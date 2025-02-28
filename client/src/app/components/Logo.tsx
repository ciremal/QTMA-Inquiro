"use client";

import Image from "next/image";
import { epilogue } from "../ui/fonts";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Logo = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="navbar">
      <Link
        href="/"
        className="px-2 py-2 flex flex-row justify-start items-center gap-x-3"
      >
        <Image
          src={theme === "dark" ? "/darkLogo.svg" : "/logo.svg"}
          width={75}
          height={27}
          alt="logo"
          style={{ verticalAlign: "bottom" }}
        />
        <span
          className={`font-normal ${epilogue.className} mt-1`}
          style={{ fontSize: 35, lineHeight: 1 }}
        >
          {"inquiro"}
        </span>
      </Link>
    </div>
  );
};

export default Logo;
