// import { useState } from 'react';
// import { tables, reducers } from './module_bindings';
// import { useSpacetimeDB, useTable, useReducer } from 'spacetimedb/react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddImageTemp from "./pages/AddImage-Temp";
import Index from "./pages/Index-Temp";
import Carousel from "./pages/Carousel";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={< Index />} />
          <Route path="/add" element={<AddImageTemp />} />
          <Route path="/carousel/:creator" element={<Carousel />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
