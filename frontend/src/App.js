import { render } from "react-dom";
import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage"
import BrowsePage from "./BrowsePage"
export default function App() {
  return (
    <BrowserRouter >
      <Routes>
        <Route index element={<HomePage />} />
        <Route path='browse' element={<BrowsePage />} />
      </Routes>
    </BrowserRouter>
  )
}


const appDiv = document.getElementById("app");
render(<App />, appDiv)