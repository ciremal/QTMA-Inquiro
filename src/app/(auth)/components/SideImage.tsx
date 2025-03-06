"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

const SideImage = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (theme === "dark") {
    return <Image src={"/rebrand-logo.svg"} height={1} width={635} alt="" />;
  } else {
    return <Image src={"/signup-img.svg"} height={1} width={635} alt="" />;
  }
};

export default SideImage;
