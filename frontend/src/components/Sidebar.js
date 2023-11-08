import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AiOutlineHome, AiOutlineSearch, AiOutlineUser } from "react-icons/ai";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { BsFillEnvelopePaperHeartFill } from "react-icons/bs";
import { SlScreenDesktop } from "react-icons/sl";
import { signOut } from "../ApiRequest";
import Auth from "./Auth";
import Profile from "./Profile";

export default function Sidebar({ isLoggedIn }) {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authWindow, setAuthWindow] = useState(true);
  const authRef = useRef(null);

  async function signOutHandler() {
    let signedOut = await signOut();
    if (signedOut) location.replace('/');
  }

  function handleSignIn() {
    setIsAuthOpen(true);
    setAuthWindow(true);
  }

  function handleSignUp() {
    setIsAuthOpen(true);
    setAuthWindow(false);
  }

  function handleClickOutside(event) {
    if (authRef.current && !authRef.current.contains(event.target))
      setIsAuthOpen(false);
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
  }, [authRef]);

  return (
    <div className="text-white fixed left-0 flex  h-full z-30">
      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 pt-10 pr-10"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto ">
          {isLoggedIn && <Profile />}
          {isAuthOpen && <Auth authRef={authRef} login={authWindow} />}
          <ul className="space-y-2 font-medium mt-5">
            <li>
              <Link
                to="/"
                href="#"
                className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-red-700 dark:hover:bg-red-700 group"
              >
                <AiOutlineHome size={20} />

                <span className="ml-3">Home</span>
              </Link>
            </li>

            {isLoggedIn ? (
              <>
                <li className="border-t border-gray-600 pt-2">
                  <Link
                    to="/myshows"
                    className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-red-700 dark:hover:bg-red-700 group"
                  >
                    <SlScreenDesktop size={20} />
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      My Shows
                    </span>
                  </Link>
                </li>
                <li className="border-t border-gray-600 pt-2">
                  <Link
                    to="/browse"
                    className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-red-700 dark:hover:bg-red-700 group"
                  >
                    <AiOutlineSearch size={20} />
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Browse
                    </span>
                  </Link>
                </li>
                <li
                  className="border-t border-gray-600 pt-2"
                  onClick={signOutHandler}
                >
                  <a
                    href="#"
                    className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-red-700 dark:hover:bg-red-700 group"
                  >
                    <BiLogOut size={20} />
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Sign Out
                    </span>
                  </a>
                </li>
              </>
            ) : (
              <>
                <li className="border-t border-gray-600 pt-2">
                  <Link
                    to="/browse"
                    className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-red-700 dark:hover:bg-red-700 group"
                  >
                    <AiOutlineSearch size={20} />
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Browse
                    </span>
                  </Link>
                </li>
                <li
                  className="border-t border-gray-600 pt-2"
                  onClick={handleSignIn}
                >
                  <a
                    href="#"
                    className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-red-700 dark:hover:bg-red-700 group"
                  >
                    <BiLogIn size={20} />
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Sign In
                    </span>
                  </a>
                </li>
                <li
                  className="border-t border-gray-600 pt-2"
                  onClick={handleSignUp}
                >
                  <a
                    href="#"
                    className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-red-700 dark:hover:bg-red-700 group"
                  >
                    <BsFillEnvelopePaperHeartFill size={20} />
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Sign Up
                    </span>
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </aside>
    </div>
  );
}
