import { render } from "react-dom";
import React from 'react'
import BrowsePage from "./BrowsePage"
export default function App() {
  return (
    <BrowsePage />
  )
}


const appDiv = document.getElementById("app");
render(<App />, appDiv)