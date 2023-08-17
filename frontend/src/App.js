import { render } from "react-dom";
import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import BrowsePage from "./BrowsePage";
import UserShowsPage from "./UserShowsPage"
import { is_authenticated } from "./ApiRequest"


export const AuthContext = createContext();


export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function check_authentication() {
    let response = await is_authenticated();
    setIsLoggedIn(response);
    setIsLoading(false);
  }

  useEffect(() => {
    check_authentication();
  }, [])
  return (

    <BrowserRouter>
      {!isLoading && (
        <AuthContext.Provider value={{ isLoggedIn }}>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="browse" element={<BrowsePage />} />
            <Route path="myshows" element={<UserShowsPage />} />
          </Routes>
        </AuthContext.Provider>
      )
      }

    </BrowserRouter>
  );
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
