"use client";

import Image from "next/image";
import { epilogue } from "@/app/ui/fonts";
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
      <div className="px-2 py-2 flex flex-row justify-start items-baseline gap-x-3">
        <Image
          src={theme === "dark" ? "/darkLogo.svg" : "/logo.svg"}
          width={65}
          height={27}
          alt="logo"
          style={{ verticalAlign: "bottom" }}
        />
        <span
          className={`font-normal ${epilogue.className}`}
          style={{ fontSize: 35, lineHeight: 1 }}
        >
          {"inquiro"}
        </span>
      </div>
    </div>
  );
};

export default Logo;
