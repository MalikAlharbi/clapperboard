import { render } from "react-dom";
import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import HomePage from "./HomePage";
import BrowsePage from "./BrowsePage";
import UserShowsPage from "./UserShowsPage";
import ProfilePage from "./ProfilePage";
import FriendsPage from "./FriendsPage";

import { is_authenticated, getUsername } from "./ApiRequest";

export const AuthContext = createContext();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function check_authentication() {
      let response = await is_authenticated();
      if (response) {
        let user = await getUsername();
        setUsername(user);
      }

      setIsLoggedIn(response);
      setIsLoading(false);
    }
    check_authentication();
  }, []);

  return (
    <BrowserRouter>
      {!isLoading && (
        <>
          <Sidebar isLoggedIn={isLoggedIn} username={username} />

          <AuthContext.Provider value={{ isLoggedIn }}>
            <Routes>
              <Route index element={<HomePage />} />
              <Route path="browse" element={<BrowsePage />} />
              <Route path="myshows" element={<UserShowsPage />} />
              <Route path={`profile/:username`} element={<ProfilePage />} />
              <Route path="friends" element={<FriendsPage />} />
            </Routes>
          </AuthContext.Provider>
        </>
      )}
    </BrowserRouter>
  );
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
