import React, { useEffect, useState } from "react";

const Typewriter = React.memo(({ prompts }: { prompts: string[] }) => {
  const [promptIndex, setPromptIndex] = useState(0);
  const [typedPrompt, setTypedPrompt] = useState("");

  useEffect(() => {
    const prompt = prompts[promptIndex];

    if (!prompt) return;

    let i = 0;
    let timeoutId: NodeJS.Timeout;

    function resetTypewriter() {
      setTypedPrompt("");
      i = 0;
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * prompts.length);
      } while (newIndex === promptIndex);
      setPromptIndex(newIndex);
    }

    function typeWrite() {
      if (i < prompt.length) {
        setTypedPrompt(prompt.slice(0, i + 1));
        i++;
        timeoutId = setTimeout(typeWrite, 100);
      } else {
        timeoutId = setTimeout(() => {
          resetTypewriter();
        }, 2000);
      }
    }

    setTypedPrompt("");
    typeWrite();

    return () => clearTimeout(timeoutId);
  }, [promptIndex, prompts]);

  return (
    <p
      className="font-sans mb-4 md:text-5xl text-2xl text-center"
      style={{ fontWeight: "bold" }}
    >
      <span className="text-primaryWhite">Ask me about </span>
      <span className="text-gray-400">{typedPrompt}</span>
    </p>
  );
});

export default Typewriter;
