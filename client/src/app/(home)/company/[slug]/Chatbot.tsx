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

  const[messages, setMessages] = useState([
    {text: "hello, how can i assist you", sender:"bot"}
  ]);
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // prevents the page reload on form submission
    
    if(!inputText.trim()) return; // exit if input is empty or just whitespace

    // add user message to the chat
    setMessages([...messages, { text: inputText, sender:"user" }]);

    // response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { text: "placeholder response", sender: "bot"}
      ])
    }, 1000); // delay for teh response
    setInputText("")
  }

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
        <div className="fixed bottom-20 right-4 w-[31rem] h-[30rem] bg-white shadow-lg rounded-lg flex flex-col dark:bg-black border-2 border-solid border-gray-300">
          {/* Chat Messages */}
          <div className="flex-1 p-3 overflow-y-auto">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-3 p-3 rounded-lg max-w-[80%] ${
                  message.sender === "user" 
                    ? "ml-auto bg-red-400 text-white" 
                    : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          {/* Chat Input */}
            <form onSubmit={handleSubmit} className="p-2 border-t flex items-center">
              <input
                type="text"
                className="w-full p-2 border rounded-full focus:outline-none"
                placeholder={`Ask me about ${slug}'s latest earnings call`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </form>
        </div>
      )}
    </div>
  );
}
