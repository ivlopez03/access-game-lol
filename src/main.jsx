import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router";
import PuzzleOne from "./Puzzles/PuzzleOne.jsx";
import PuzzleTwo from "./Puzzles/PuzzleTwo.jsx";
import PuzzleThree from "./Puzzles/PuzzleThree.jsx";
import HexLockGame from "./Puzzles/GameOver.jsx";
const root = document.getElementById("root");

const pathOne = import.meta.env.VITE_ROUTE_ONE;
const pathTwo = import.meta.env.VITE_ROUTE_TWO;
const pathThree = import.meta.env.VITE_ROUTE_THREE;

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/*" element={<App />} />
      <Route path={`/access-game-lol${pathOne}`} element={<PuzzleOne />} />
      <Route path={`${pathTwo}`} element={<PuzzleTwo />} />
      <Route path={`${pathThree}`} element={<PuzzleThree />} />
      <Route path="/gameover" element={<HexLockGame />} />
    </Routes>
  </BrowserRouter>,
);
