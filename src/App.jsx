import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import HitRateCalculator from "./components/HitRateCalculator";
import Home from "./components/Home";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hit-rate-calculator" element={<HitRateCalculator />} /> 
        </Routes>
      </Router>
    </>
  );
}

export default App;
