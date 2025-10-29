import { useState } from "react";
import { useNavigate } from "react-router";
import ASCIIText from "../components/ASCIItext_component.jsx";
import { IoWarning } from "react-icons/io5";
import TextType from "../components/TextTypeComponent.jsx";
const ultimateKey = import.meta.env.VITE_ULTIMATE_KEY;
const batata = import.meta.env.VITE_SECRET_KEY;
const validData = [
  {
    user: "jsanchez",
    id: "j1",
  },
  {
    user: "jtorres",
    id: "j2",
  },
  {
    user: "jtrejo",
    id: "j3",
  },
  {
    user: "jmoyron",
    id: "j4",
  },
  {
    user: "ilopez",
    id: "i5",
  },
  {
    user: "acervera",
    id: "a6",
  },
];

const HomePage = () => {
  const [inputUser, setInputUser] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ultimateKeyNotification, setUltimateKeyNotification] = useState(false);
  const [startCounterDown, setStartCounterDown] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [counterDown, setCounterDown] = useState(5);

  function startCountDownTimer() {
    let timeLeft = 5;

    const timer = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timer);
        setStartCounterDown(false);
      } else {
        timeLeft -= 1;
        setCounterDown(timeLeft);
      }
      if (timeLeft === 0) {
        setShowToken(true);
        console.log(`token: ${batata}`);
      }
    }, 1500);
  }

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const userFound = validData.find((data) => data.user === inputUser);
    if (inputUser === ultimateKey) {
      setUltimateKeyNotification(true);
      setStartCounterDown(true);
      startCountDownTimer();
      setInputUser("");
      return;
    }
    if (userFound && !ultimateKeyNotification) {
      setIsAuthenticated(true);
      setInputUser("");
      alert("Access Granted");
      return navigate(`/puzzle-one`);
    }
    if (!userFound) {
      setIsAuthenticated(false);
      alert("Access Denied");
    }
  };

  return (
    <div>
      <div className="w-full z-50">
        <ASCIIText
          text="Welcome to the matrix"
          enableAnimation={true}
          asciiFontSize={8}
        />
      </div>
      <div className="absolute top-96 w-full flex flex-col items-center z-10">
        <form
          className="bg-neutral-300  shadow-lg max-w-md w-full"
          onSubmit={handleSubmit}
        >
          <label className="flex flex-col  ">
            <span className="flex items-center gap-2 bg-blue-600 px-2 py-2 text-white">
              <IoWarning className="text-yellow-300" />
              Insert your IB username:
            </span>
            <input
              type="text"
              onChange={(e) => {
                setInputUser(e.target.value);
              }}
              className=" w-full text-black px-3 py-2 border-none rounded-md text-sm placeholder-gray-400
               outline-none "
              placeholder="Enter your username"
              required
            />
          </label>
          <button
            type="submit"
            className="relative float-end bg-red-600 text-white px-3 py-2 mt-4 transition-colors active:scale-95 hover:bg-red-700 duration-200 "
          >
            Submit
          </button>
        </form>
      </div>
      {ultimateKeyNotification && (
        <div className="absolute top-80 w-full flex justify-center z-20">
          <div className="bg-yellow-300 text-black px-4 py-2 rounded-md shadow-lg flex items-center gap-2">
            <IoWarning className="text-red-600" />
            <span>Congratulations you have encounter the ultimate Key !</span>
          </div>
        </div>
      )}
      {startCounterDown && (
        <div className="absolute top-72 w-full flex justify-center z-20">
          <div className="bg-black text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2">
            <span>
              System will provide you the token: {counterDown} seconds
            </span>
          </div>
        </div>
      )}
      {isAuthenticated && (
        <div className="absolute top-80 w-full flex justify-center z-20">
          <div className="bg-green-300 text-black px-4 py-2 rounded-md shadow-lg flex items-center gap-2">
            <IoWarning className="text-green-600" />
            <span>Access Granted! Redirecting...</span>
          </div>
        </div>
      )}
      <div>
        {showToken && (
          <div className="absolute bottom-44 w-full flex justify-center z-20">
            <TextType
              text={["The token is in the console", "please not share it!"]}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
