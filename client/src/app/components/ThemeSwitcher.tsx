"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  if (!mounted) return null;

  return (
    <div
      className={`flex w-16 rounded-r-full rounded-l-full h-auto items-center px-1 py-1 ${
        theme === "dark" ? "bg-[#183771] border border-[#183771]" : "bg-white"
      }`}
      style={{
        transition: "background-color 0.3s ease",
        boxShadow: "0px 4px 12px 1px rgba(0, 0, 0, 0.3)",
      }}
    >
      <button
        className="flex items-center justify-center"
        onClick={() => handleThemeChange()}
        style={{
          transform: theme === "dark" ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease",
        }}
      >
        {theme === "dark" ? (
          <DarkModeIcon className="bg-blue-300 w-7 h-7 rounded-full p-0.5 text-white" />
        ) : (
          <WbSunnyIcon className="bg-yellow-500 w-7 h-7 rounded-full p-0.5 text-white" />
        )}
      </button>
    </div>
  );
}
