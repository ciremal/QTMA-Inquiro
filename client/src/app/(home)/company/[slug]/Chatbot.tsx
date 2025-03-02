"use client";

import { useState } from "react";
import { useTheme } from "next-themes";

export default function Chatbot({ slug }: { slug: string }) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const pathToIcon =
    theme === "light"
      ? "/inquiro-chatbot-light.svg"
      : "/inquiro-chatbot-dark.svg";

  console.log(pathToIcon);

  return (
    <div>
      {/* Chatbot Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 w-16 h-16 rounded-full bg-black flex items-center justify-center text-2xl shadow-lg cursor-pointer dark:bg-white"
      >
        <img src={pathToIcon} alt="chatbot-icon" className="w-3/4" />
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-[31rem] h-[30rem] bg-white shadow-lg rounded-lg flex flex-col dark:bg-black">
          {/* Chat Messages */}
          <div className="flex-1 p-3 overflow-y-auto">
            <p className="text-gray-600">Hello! How can I assist you?</p>
          </div>

          {/* Chat Input */}
          <div className="p-2 border-t flex items-center">
            <input
              type="text"
              className="w-full p-2 border rounded-full focus:outline-none"
              placeholder={`Ask me about ${slug}'s latest earnings call`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
