import React from "react";

const Home = () => {
  return (
    <>
      <h1>Min Maxer</h1>
      <div className="flex ">
        <img src="\assets\d20.svg" alt="" className="h-5" />
        <h3>
          <a href="/hit-rate-calculator">Hit Rate Calculator</a>
        </h3>
      </div>

      <div className="flex">
        <img src="\assets\d20.svg" alt="" className="h-5 " />
        <h3>
          <a href="/skills">Skills</a>
        </h3>
      </div>
    </>
  );
};

export default Home;
