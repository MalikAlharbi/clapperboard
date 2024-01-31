import { render } from "react-dom";
import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import HomePage from "./HomePage";
import ActivationPage from "./ActivationPage";
import BrowsePage from "./BrowsePage";
import UserShowsPage from "./UserShowsPage";
import ProfilePage from "./ProfilePage";
import FriendsPage from "./FriendsPage";
import NotFoundPage from "./NotFoundPage";
import PasswordResetPage from "./PasswordResetPage"
import WatchListPage from "./WatchListPage";
import { is_authenticated, getUsername } from "./ApiRequest";
import { FaGithub } from "react-icons/fa";
import { GoReport } from "react-icons/go";

export const AuthContext = createContext();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGithubHovered, setIsGithubHovered] = useState(false);
  const [isReportHovered, setIsReportHovered] = useState(false);
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

  const footer = () => {
    return (
      <div className="fixed top-0 right-0 text-gray-600 py-4 px-8">
        <div className="flex items-center">
          <a
            href="https://github.com/MalikAlharbi/clapperboard"
            className="p-3"
            onMouseEnter={() => setIsGithubHovered(true)}
            onMouseLeave={() => setIsGithubHovered(false)}
          >
            <FaGithub color={isGithubHovered ? "white" : "gray"} size={32} />
          </a>
          <a
            href="mailto:clapperboard.m@gmail.com"
            className="p-3"
            onMouseEnter={() => setIsReportHovered(true)}
            onMouseLeave={() => setIsReportHovered(false)}
          >
            <GoReport color={isReportHovered ? "yellow" : "gray"} size={32} />
          </a>
        </div>
      </div>

    )
  }
  return (
    <BrowserRouter>
      {!isLoading && (
        <>
          <Sidebar isLoggedIn={isLoggedIn} username={username} />

          <AuthContext.Provider value={{ isLoggedIn }}>
            <Routes>
              <Route index element={<HomePage />} />
              <Route path="activation" element={<ActivationPage />} />
              <Route path='password_reset/:uidb64/:token' element={<PasswordResetPage />} />
              <Route path="browse" element={<BrowsePage />} />
              <Route path="myshows" element={<UserShowsPage />} />
              <Route path="watchlist" element={<WatchListPage />} />
              <Route path={`profile/:username`} element={<ProfilePage />} />
              <Route path="friends" element={<FriendsPage />} />
              <Route path="404" element={<NotFoundPage />} />
              {/* Redirect all unmatched routes to 404 page */}
              <Route path="*" element={<Navigate to="/404" />} />
            </Routes>
          </AuthContext.Provider>
          {footer()}

        </>
      )}
    </BrowserRouter>
  );
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
