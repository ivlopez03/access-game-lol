import React, { useState, useEffect, useCallback, useRef } from "react";

// --- Game Configuration ---
const CODE_LENGTH = 8; // Further increased difficulty
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY_FINAL; // Updated key length
const FLASH_INTERVAL = 400; // Adjusted for new non-consecutive rule
const HEX_COLORS = [
  "bg-red-500", // Index 0
  "bg-blue-500", // Index 1
  "bg-green-500", // Index 2
  "bg-yellow-500", // Index 3
  "bg-purple-500", // Index 4
  "bg-pink-500", // Index 5
  "bg-indigo-500", // Index 6 (New)
  "bg-teal-500", // Index 7 (New)
];
const TOTAL_HEXES = HEX_COLORS.length; // Now 8

// --- Helper Components (Hexagon Button) ---

/**
 * A visually distinct hexagonal button for the game.
 */
const HexagonButton = ({ colorClass, onClick, isFlashing, isActive }) => {
  // Enhanced brightness and visual distinction for flashing
  const flashClasses = isFlashing
    ? `
      animate-pulse ring-8 ring-offset-4 ring-offset-gray-900 
      ${colorClass.replace("500", "300")} shadow-2xl shadow-white/80 scale-110 
    `
    : "hover:scale-105";

  const activeClasses = isActive
    ? "scale-105 shadow-lg shadow-cyan-600/50"
    : "";

  return (
    <div
      className={`
        w-20 h-20 m-2 transition duration-200 cursor-pointer 
        transform rotate-180 
        ${activeClasses}
        ${flashClasses}
      `}
      onClick={onClick}
      style={{
        clipPath:
          "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
      }}
    >
      <div
        className={`w-full h-full transform rotate-180 flex items-center justify-center ${colorClass}`}
      >
        {/* Visual content can go here */}
      </div>
    </div>
  );
};

// --- Main Game Component ---

const HexLockGame = () => {
  const [pattern, setPattern] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isDisplayingPattern, setIsDisplayingPattern] = useState(false);
  const [flashingIndex, setFlashingIndex] = useState(-1);
  const [gameStatus, setGameStatus] = useState("idle"); // idle, memorizing, input, locked, unlocked
  const [statusMessage, setStatusMessage] = useState(
    `Press 'START' to receive the ${CODE_LENGTH}-step sequence.`,
  );
  const [unlockedKey, setUnlockedKey] = useState(null);

  const displayIntervalRef = useRef(null);

  /**
   * Generates a new random pattern of indices (0 to TOTAL_HEXES - 1)
   * ensuring no consecutive flashes.
   */
  const generatePattern = useCallback(() => {
    const newPattern = [];
    let lastIndex = -1;
    for (let i = 0; i < CODE_LENGTH; i++) {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * TOTAL_HEXES);
      } while (nextIndex === lastIndex); // Ensure no consecutive repetition
      newPattern.push(nextIndex);
      lastIndex = nextIndex;
    }
    setPattern(newPattern);
    setUserSequence([]);
    setUnlockedKey(null);
    setGameStatus("memorizing");
    setStatusMessage("MEMORIZING: WATCH CAREFULLY...");
    setIsDisplayingPattern(true);
  }, []);

  // Effect to handle the pattern display sequence
  useEffect(() => {
    if (isDisplayingPattern) {
      let step = 0;
      setFlashingIndex(pattern[0]);

      displayIntervalRef.current = setInterval(() => {
        step++;
        if (step < pattern.length) {
          setFlashingIndex(pattern[step]);
        } else {
          // Sequence finished
          clearInterval(displayIntervalRef.current);
          setIsDisplayingPattern(false);
          setFlashingIndex(-1);
          setGameStatus("input");
          setStatusMessage("INPUT: REPEAT THE SEQUENCE NOW!");
        }
      }, FLASH_INTERVAL);

      // Cleanup on unmount or before running again
      return () => clearInterval(displayIntervalRef.current);
    }
  }, [isDisplayingPattern, pattern]);

  /**
   * Handles user clicking a hex button.
   * @param {number} index - The index of the clicked button (0 to TOTAL_HEXES-1).
   */
  const handleHexClick = (index) => {
    if (gameStatus !== "input") {
      setStatusMessage(
        gameStatus === "unlocked"
          ? "Access granted!"
          : "Wait for the sequence to finish.",
      );
      return;
    }

    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);

    // Provide visual feedback for the click
    setFlashingIndex(index);
    setTimeout(() => setFlashingIndex(-1), 100);

    // Check if the input is correct so far
    const currentStep = newUserSequence.length - 1;
    if (newUserSequence[currentStep] !== pattern[currentStep]) {
      // Incorrect input
      setGameStatus("locked");
      setStatusMessage("CODE FAILED: Sequence broken. System LOCKED.");
      setTimeout(() => setGameStatus("idle"), 1500); // Reset after delay
    } else if (newUserSequence.length === CODE_LENGTH) {
      // Correct and complete sequence
      setGameStatus("unlocked");
      setStatusMessage("ACCESS GRANTED! Secret Key retrieved.");
      setUnlockedKey(SECRET_KEY);
    }
  };

  /**
   * Renders the status display showing the user's progress.
   */
  const renderProgressDisplay = () => {
    const currentStep = userSequence.length;

    return (
      <div className="flex justify-center space-x-1 my-4">
        {Array.from({ length: CODE_LENGTH }).map((_, i) => (
          <div
            key={i}
            className={`
              w-7 h-7 md:w-8 md:h-8 border-2 rounded-full flex items-center justify-center 
              text-xs font-bold transition-all duration-300
              ${i < currentStep && userSequence[i] === pattern[i] ? "bg-green-500 border-green-300" : ""}
              ${i < currentStep && userSequence[i] !== pattern[i] ? "bg-red-500 border-red-300" : ""}
              ${i >= currentStep ? "bg-gray-700 border-gray-500" : ""}
            `}
          >
            {i < currentStep
              ? userSequence[i] === pattern[i]
                ? "✔"
                : "✘"
              : i + 1}
          </div>
        ))}
      </div>
    );
  };

  // Game Reset/Start Button Handler
  const handleStartReset = () => {
    if (gameStatus === "unlocked") {
      setUnlockedKey(null);
      setGameStatus("idle");
      setStatusMessage(
        `System rebooted. Press 'START' to receive the ${CODE_LENGTH}-step sequence.`,
      );
    } else if (
      gameStatus === "memorizing" ||
      gameStatus === "input" ||
      gameStatus === "locked"
    ) {
      // Abort or reset after failure
      setGameStatus("idle");
      clearInterval(displayIntervalRef.current);
      setIsDisplayingPattern(false);
      setFlashingIndex(-1);
      setStatusMessage(
        "Sequence aborted. Press 'START' to begin a new attempt.",
      );
    } else {
      generatePattern();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-4">
      <div className="w-full max-w-lg bg-neutral-900 rounded-xl shadow-2xl p-6 md:p-10 border-1 border-neutral-700/50">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold  text-center mb-4 tracking-wider">
          THE HEX LOCK 🧠
        </h1>
        <p className="text-sm text-gray-400 text-center mb-6">
          Repeat the **{CODE_LENGTH}-step** flashing sequence. Consecutive
          flashes of the same color are{" "}
          <span className="text-yellow-400 font-bold">forbidden</span>.
        </p>

        {/* Status Display */}
        <div
          className={`p-4 mb-4 rounded-lg text-center font-mono ${gameStatus === "unlocked" ? "bg-green-800" : "bg-gray-900"} transition duration-500`}
        >
          <p
            className={`text-lg font-semibold ${gameStatus === "unlocked" ? "text-white" : "text-gray-200"}`}
          >
            {statusMessage}
          </p>
        </div>

        {/* Progress Display */}
        {gameStatus !== "idle" && renderProgressDisplay()}

        {/* Hex Buttons (2 rows of 4) */}
        <div className="flex flex-wrap justify-center my-6">
          {HEX_COLORS.map((colorClass, index) => (
            <HexagonButton
              key={index}
              colorClass={colorClass}
              onClick={() => handleHexClick(index)}
              isFlashing={flashingIndex === index}
              isActive={gameStatus === "input" || gameStatus === "unlocked"}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleStartReset}
          className={`
            w-full py-3 rounded-lg text-lg font-bold transition duration-300 
            ${gameStatus === "unlocked" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-cyan-600 hover:bg-cyan-700 text-white"}
            ${gameStatus === "memorizing" || gameStatus === "input" || gameStatus === "locked" ? "bg-red-600 hover:bg-red-700" : ""}
          `}
          disabled={gameStatus === "memorizing"}
        >
          {gameStatus === "idle"
            ? "START SEQUENCE"
            : gameStatus === "unlocked"
              ? "RE-LOCK SYSTEM"
              : "ABORT/RESET"}
        </button>

        {/* Secret Key Display */}
        {unlockedKey && (
          <div className="mt-8 p-4 bg-yellow-900 border-2 border-yellow-500 rounded-lg text-center animate-bounce">
            <p className="text-xl font-mono text-yellow-300">
              SECRET KEY:{" "}
              <span className="font-extrabold text-white">{unlockedKey}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HexLockGame;
