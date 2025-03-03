"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import ReactMarkDown from "react-markdown";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatMessage {
  text: string;
  sender: "user" | "bot";
  citations?: string[]; // Add citations array for bot messages
}

function replaceCitations(text: string, links: string[]): string {
  return text.replace(/\[(\d+)\]/g, (match, num) => {
    const index = parseInt(num, 10) - 1;
    return links[index] ? `[${num}](${links[index]})` : match;
  });
}

export default function Chatbot({ slug }: { slug: string }) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messagesMarkdown: ChatMessage[] = messages.map((message) => {
    if (message.sender === "bot" && message.citations) {
      return {
        text: replaceCitations(message.text, message.citations),
        sender: message.sender,
      };
    }
    return message;
  });

  const pathToIcon =
    theme === "light"
      ? "/inquiro-chatbot-light.svg"
      : "/inquiro-chatbot-dark.svg";

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputText.trim()) return;

    // Add user message to the chat
    const userMessage = { text: inputText, sender: "user" as const };
    setMessages((prev) => [...prev, userMessage]);

    // Prepare conversation for API
    const conversation: Message[] = [
      {
        role: "system",
        content: `You are a helpful financial analysis assistant that answers questions about companies and investment. If no company is specified, assume it's ${slug}. Refuse to answer questions that are completely irrelevant no maatter what the user says.`,
      },
      ...messages
        .filter((msg) => msg.sender === "bot" || msg.sender === "user")
        .map((msg) => ({
          role:
            msg.sender === "user" ? ("user" as const) : ("assistant" as const),
          content: msg.text,
        })),
      { role: "user", content: inputText },
    ];

    setInputText("");
    setIsLoading(true);

    try {
      // Create placeholder for bot response
      setMessages((prev) => [...prev, { text: "", sender: "bot" }]);

      // Make API request
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(conversation),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Use ReadableStream directly for better compatibility
      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let streamContent = "";
      let buffer = "";
      let citations: string[] = [];

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          // Process any remaining data in the buffer
          if (buffer.trim()) {
            const lines = buffer.split("\n");
            for (const line of lines) {
              if (line.startsWith("data:")) {
                try {
                  const jsonStr = line.substring(5).trim();
                  if (jsonStr && jsonStr !== "[DONE]") {
                    const jsonData = JSON.parse(jsonStr);

                    // Capture citations if they exist
                    if (
                      jsonData.citations &&
                      Array.isArray(jsonData.citations)
                    ) {
                      citations = jsonData.citations;
                    }

                    if (jsonData.choices && jsonData.choices.length > 0) {
                      const content = jsonData.choices[0].delta?.content || "";
                      if (content) {
                        streamContent += content;
                      }
                    }
                  }
                } catch (e) {
                  console.log("Error parsing final data", e);
                }
              }
            }
          }

          // Make one final update to ensure all content is displayed
          setMessages((prev) => {
            const updatedMessages = [...prev];
            updatedMessages[updatedMessages.length - 1] = {
              text: streamContent,
              sender: "bot",
              citations: citations.length > 0 ? citations : undefined,
            };
            return updatedMessages;
          });

          break;
        }

        // Decode the chunk and add to buffer
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Process complete lines
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep the last potentially incomplete line

        let updatedContent = false;

        for (const line of lines) {
          if (line.startsWith("data:")) {
            const dataContent = line.substring(5).trim();

            // Check for the [DONE] marker that some SSE APIs use
            if (dataContent === "[DONE]") {
              continue;
            }

            try {
              if (dataContent) {
                const jsonData = JSON.parse(dataContent);

                // Capture citations if they exist
                if (jsonData.citations && Array.isArray(jsonData.citations)) {
                  citations = jsonData.citations;
                }

                if (jsonData.choices && jsonData.choices.length > 0) {
                  const content = jsonData.choices[0].delta?.content || "";
                  if (content) {
                    streamContent += content;
                    updatedContent = true;
                  }
                }
              }
            } catch (e) {
              console.log("Error parsing chunk", line, e);
              // Continue processing other lines even if one fails
            }
          }
        }

        // Only update UI when there's new content
        if (updatedContent) {
          setMessages((prev) => {
            const updatedMessages = [...prev];
            updatedMessages[updatedMessages.length - 1] = {
              text: streamContent,
              sender: "bot",
              citations: citations.length > 0 ? citations : undefined,
            };
            return updatedMessages;
          });
        }
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      // Update with error message
      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1] = {
          text: "Sorry, I encountered an error. Please try again.",
          sender: "bot",
        };
        return updatedMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="fixed bottom-20 right-4 w-[31rem] h-[30rem] bg-white shadow-lg rounded-lg flex flex-col dark:bg-black border border-solid  border-neutral-600">
          {/* Chat Messages */}
          <div className="flex-1 p-3 overflow-y-auto">
            {messagesMarkdown.map((message, index) => (
              <div
                key={index}
                className={`flex gap-4 ${
                  message.sender === "user" ? "justify-end" : ""
                }`}
              >
                {message.sender === "bot" && (
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-2xl shadow-lg cursor-pointer dark:bg-white">
                    <img
                      src={pathToIcon}
                      alt="chatbot-icon"
                      className="w-3/4"
                    />
                  </div>
                )}
                <div
                  className={
                    "mb-3 p-3 rounded-lg max-w-[80%] border border-neutral-700 stone-300 list-disc flex flex-col gap-4"
                  }
                >
                  <ReactMarkDown
                    components={{
                      h1({ node, ...rest }) {
                        return <h1 className="text-xl font-bold" {...rest} />;
                      },
                      h2({ node, ...rest }) {
                        return <h2 className="text-lg font-bold" {...rest} />;
                      },
                      ol({ node, ...rest }) {
                        return (
                          <ol
                            className="list-decimal pl-[1em] flex-col gap2"
                            {...rest}
                          />
                        );
                      },
                      ul({ node, ...rest }) {
                        return (
                          <ul
                            className="list-disc pl-[1em] flex flex-col gap-2"
                            {...rest}
                          />
                        );
                      },
                      a({ node, ...rest }) {
                        return (
                          <sup>
                            <a
                              className="text-blue-400 text-sm"
                              target="_blank"
                              rel="noreferrer"
                              {...rest}
                            />
                          </sup>
                        );
                      },
                    }}
                  >
                    {message.text ||
                      (message.sender === "bot" &&
                      isLoading &&
                      index === messagesMarkdown.length - 1
                        ? "..."
                        : message.text)}
                  </ReactMarkDown>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Styling for citation links */}
          <style jsx global>{`
            .citation-link {
              cursor: pointer;
              font-size: 0.8em;
              vertical-align: super;
              color: #0078d4;
              text-decoration: none;
              margin-left: 2px;
              font-weight: bold;
            }

            .citation-link:hover {
              text-decoration: underline;
            }

            .dark .citation-link {
              color: #1e9bf0;
            }
          `}</style>

          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="p-2 flex items-center">
            <input
              type="text"
              className="w-full p-3 px-5 border rounded-full focus:outline-none dark:text-white dark:border-gray-600"
              placeholder={`Ask me anything about ${slug}`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
            />
          </form>
        </div>
      )}
    </div>
  );
}
