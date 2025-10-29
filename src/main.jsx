import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router";
import PuzzleOne from "./Puzzles/PuzzleOne.jsx";
import PuzzleTwo from "./Puzzles/PuzzleTwo.jsx";
import PuzzleThree from "./Puzzles/PuzzleThree.jsx";
import HexLockGame from "./Puzzles/GameOver.jsx";
const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/puzzle-one" element={<PuzzleOne />} />
      <Route path="/linus-torvalds-secret" element={<PuzzleTwo />} />
      <Route path="/xyz-gfv" element={<PuzzleThree />} />
      <Route path="/gameover" element={<HexLockGame />} />
    </Routes>
  </BrowserRouter>,
);
