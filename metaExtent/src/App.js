// note: AlgoSigner is automatically detected in the browser no need to import anything
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Homepage from "./views/Homepage"
import Dashboard from "./views/Dashboard"
import Create_1 from "./views/Create-1"
import Create_2 from "./views/Create-2"
import Create_Success from "./views/Create-Success"
import Marketplace from "./views/Marketplace"

function App() {
  return (
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create/step1" element={<Create_1 />} />
        <Route path="/create/step2" element={<Create_2 />} />
        <Route path="/create/success" element={<Create_Success />} />
        <Route path="/marketplace" element={<Marketplace />} />
      </Routes>
  );
}

export default App;