import React, { useState, useRef, useEffect } from "react";

const commandMap = {
  help: () => [
    "Available commands:",
    "  help - Displays this list of commands.",
    "  echo <text> - Repeats the input text.",
    "  ls - Lists files in the current directory.",
    "  cat <filename> - Displays the content of a file.",
    "  echo -s <text> - Repeats the input text in a beatiful way",
    "  clear - Clears the terminal history.",
    "  date - Displays the current date and time.",
  ],
  echo: (args) => {
    if (args[1] + " " + args[2] === "-s tailwind") {
      return [
        "Run the following command in your terminal to unlock the secret:",
        "",
        "liquidglassSUCKS -false",
        "",
      ];
    }
    // args[0] is 'echo', args[1] onwards are the arguments
    return [args.slice(1).join(" ")];
  },
  clear: (args, setHistory) => {
    setHistory([]); // Special command to clear the history
    return [];
  },
  date: () => [new Date().toLocaleString()],
  // Add more commands here
  ls: () => ["linus_legacy.txt", "hint.txt", "script.sh"],
  cat: (args) => {
    if (args.length < 2) {
      return ["Usage: cat <filename>"];
    }
    const filename = args[1];
    if (filename === "linus_legacy.txt") {
      return [
        "Linus Torvalds' Legacy:",
        "Linus Torvalds is the creator of Linux, a free and open-source operating system kernel.",
        "His work has revolutionized the software industry and empowered countless developers worldwide.",
      ];
    } else if (filename === "hint.txt") {
      return [
        "Hint: Sometimes, the key to unlocking secrets lies in the details.",
      ];
    } else if (filename === "script.sh") {
      return [
        "#!/bin/bash",
        "echo 'This is a sample script file.'",
        "echo 'tailwind'",
      ];
    } else {
      return [`cat: ${filename}: No such file or directory`];
    }
  },
  liquidglasssucks: (args) => {
    if (args[1] === "-true") {
      return [`/xyz-gfv`];
    } else {
      return ["liquidglasssucks -false u sure?"];
    }
  },
};

const PROMPT = "user@qaengineer:~$ ";
const PuzzleTwo = () => {
  // State to store the history of commands and their outputs
  const [history, setHistory] = useState([
    { type: "output", content: "Welcome to the Linus Terminal!" },
    { type: "output", content: 'Type "help" to see available commands.' },
  ]);
  // State for the current input value
  const [input, setInput] = useState("");
  // Ref to automatically focus the input field
  const inputRef = useRef(null);
  // Ref to scroll the output area to the bottom
  const terminalBodyRef = useRef(null);

  // Effect to focus the input whenever the component mounts or history updates
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [history]);

  // Effect to scroll to the bottom when history updates
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  /**
   * Handles the command execution when the Enter key is pressed.
   * @param {React.KeyboardEvent<HTMLInputElement>} event - The keyboard event.
   */
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      const commandString = input.trim();
      setInput(""); // Clear the input field

      // Add the command to history
      setHistory((prevHistory) => [
        ...prevHistory,
        { type: "command", content: commandString },
      ]);

      if (commandString === "") {
        return;
      }

      // Parse command and arguments
      const args = commandString.split(/\s+/).filter(Boolean);
      const command = args[0].toLowerCase();

      const executeCommand = commandMap[command];

      if (executeCommand) {
        // Execute the command, passing setHistory for special commands like 'clear'
        const output = executeCommand(args, setHistory);

        // Add the output to history (only if it's not a special command like 'clear')
        if (command !== "clear") {
          const outputEntries = output.map((line) => ({
            type: "output",
            content: line,
          }));
          setHistory((prevHistory) => [...prevHistory, ...outputEntries]);
        }
      } else {
        // Handle unknown command
        const unknownOutput = [`Error: command not found: ${command}`];
        const outputEntries = unknownOutput.map((line) => ({
          type: "error",
          content: line,
        }));
        setHistory((prevHistory) => [...prevHistory, ...outputEntries]);
      }
    }
  };

  /**
   * Renders a single line in the terminal history.
   * @param {object} item - The history item.
   * @returns {JSX.Element}
   */
  const renderLine = (item, index) => {
    let content;
    let colorClass = "text-gray-200"; // Default text color

    if (item.type === "command") {
      content = (
        <>
          <span className="text-green-400 mr-2">{PROMPT}</span>
          <span>{item.content}</span>
        </>
      );
    } else if (item.type === "output") {
      content = item.content;
    } else if (item.type === "error") {
      content = item.content;
      colorClass = "text-red-400";
    }

    return (
      <div key={index} className={`mb-1 ${colorClass} whitespace-pre-wrap`}>
        {content}
      </div>
    );
  };
  return (
    // Terminal Container
    <div
      className="bg-gray-900 text-gray-200 font-mono text-sm rounded-lg shadow-2xl w-full h-screen flex flex-col overflow-hidden border border-gray-700"
      onClick={() => inputRef.current.focus()}
    >
      {/* Terminal Header */}
      <div className="bg-gray-800 p-2 flex items-center justify-center border-b border-gray-700">
        <div className="text-xs font-semibold"> Terminal</div>
      </div>

      {/* Terminal Body/Output Area */}
      <div
        className="flex-grow p-4 overflow-y-auto"
        ref={terminalBodyRef}
        // Tailwind utility to hide scrollbar (optional)
        style={{ scrollbarWidth: "none" }} // Firefox
      >
        {history.map(renderLine)}

        {/* Current input prompt */}
        <div className="flex items-center">
          <span className="text-green-400 mr-2">{PROMPT}</span>
          <input
            ref={inputRef}
            type="text"
            className="bg-transparent border-none text-gray-200 outline-none flex-grow p-0 m-0 focus:ring-0"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck="false"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default PuzzleTwo;
