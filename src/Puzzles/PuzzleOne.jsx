import GhostCursor from "../components/GhostCursorComponent.jsx";
const PuzzleOne = () => {
  //store a value in local storage
  localStorage.setItem("route", `/linus-torvalds-secret`);

  return (
    <div className="w-full h-screen ">
      <div style={{ height: 700, position: "relative" }}>
        <GhostCursor
          // Visuals
          color="#fafafa"
          brightness={1}
          edgeIntensity={0}
          // Trail and motion
          trailLength={50}
          inertia={0.5}
          // Post-processing
          grainIntensity={0.05}
          bloomStrength={0.1}
          bloomRadius={1.0}
          bloomThreshold={0.025}
          // Fade-out behavior
          fadeDelayMs={1000}
          fadeDurationMs={1500}
        />
      </div>
      <div className="absolute w-full  ">
        <span className="absolute -top-80 left-40 text-[#242424] ">
          In the quiet of the page where secrets hide,
          <br /> Don’t search the text
        </span>
        <span className="absolute -top-40 left-90 text-[#242424]">
          look where the devs reside. Open the black box, the place code keeps
          score
        </span>
        <span className="absolute -top-50 right-40 text-[#242424]">
          Type, click, and peek — then check <br />
          the browser’s store.
        </span>
      </div>
    </div>
  );
};

export default PuzzleOne;
