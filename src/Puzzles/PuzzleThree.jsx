import Prism from "../PrismComponent.jsx";
import { NavLink } from "react-router";
const PuzzleThree = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="relative w-full h-full ">
        <Prism
          animationType="rotate"
          timeScale={0.5}
          height={3.5}
          baseWidth={5.5}
          scale={3.6}
          hueShift={0}
          colorFrequency={1}
          noise={0.5}
          glow={1}
        />
      </div>
      <div className="absolute text-center text-5xl font-bold">
        <p>Welcome to the final round</p>
      </div>
      <NavLink
        to="/gameover"
        className="absolute bottom-90 text-2xl cursor-pointer hover:underline "
      >
        Go for some coffe, take a break , do whatever you need but Click here
        when you feel ready
      </NavLink>
    </div>
  );
};
export default PuzzleThree;
