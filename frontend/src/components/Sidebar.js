import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AiOutlineHome, AiOutlineSearch, AiOutlineUser } from "react-icons/ai";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { BsFillEnvelopePaperHeartFill } from "react-icons/bs";
import { SlScreenDesktop } from "react-icons/sl";
import { FaUserFriends } from "react-icons/fa";
import { IoBookmarks } from "react-icons/io5";

import { signOut, showFriendReq } from "../ApiRequest";
import Auth from "./Auth";
import SidebarProfile from "./SidebarProfile";

export default function Sidebar({ isLoggedIn, username }) {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authWindow, setAuthWindow] = useState(true);
  const [friendRequests, setFriendRequests] = useState(0);
  const authRef = useRef(null);


  async function signOutHandler() {
    let signedOut = await signOut();
    if (signedOut) location.replace("/");
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

  useEffect(() => {
    if (isLoggedIn) {
      async function getFriendsReqCount() {
        const requests = await showFriendReq();
        setFriendRequests(requests.friendReq.length);

      }
      getFriendsReqCount();
    }
  }, [isLoggedIn])

  return (
    <div className="text-white fixed left-0 flex  h-full z-30">
      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 pt-10 pr-10"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto ">
          {isLoggedIn && <SidebarProfile username={username} />}
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
                    to="/watchlist"
                    className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-red-700 dark:hover:bg-red-700 group"
                  >
                    <IoBookmarks size={20} />
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Watchlist
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

                <li className="border-t border-gray-600 pt-2">
                  <a
                    href={`/profile/${username}`}
                    className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-red-700 dark:hover:bg-red-700 group"
                  >
                    <AiOutlineUser size={20} />
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      My Account
                    </span>
                  </a>
                </li>

                <li className="border-t border-gray-600 pt-2">
                  <Link
                    to="/friends"
                    className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-red-700 dark:hover:bg-red-700 group"
                  >
                    <FaUserFriends size={20} />
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Friends
                    </span>
                    {friendRequests > 0 &&
                      <span className="inline-flex items-center justify-center w-3 h-3 p-3 m-2  text-sm font-medium text-white rounded-sm bg-orange-400">{friendRequests}</span>
                    }
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
