import React from 'react';
import { IconContext } from "react-icons";
import { AiOutlineHome, AiOutlineSearch, AiOutlineUser, AiOutlineBell } from 'react-icons/ai';
import { BiLogIn, BiLogOut } from 'react-icons/bi'
import { BsFillEnvelopePaperHeartFill } from 'react-icons/bs'
import { SlScreenDesktop } from 'react-icons/sl';

export default function Navbar() {
    let upcomingepisodes = 0; // to be handled later
    let loggedIn = false; // to be handled later
    return (
        <div className='text-white fixed left-0 flex  h-full mr-5'>
            <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto ">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <AiOutlineHome size={20} />
                                <span className="ml-3">Home</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <SlScreenDesktop size={20} />
                                <span className="flex-1 ml-3 whitespace-nowrap">My Shows</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <AiOutlineSearch size={20} />
                                <span className="flex-1 ml-3 whitespace-nowrap">Browse</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <AiOutlineBell size={20} />
                                <span className="flex-1 ml-3 whitespace-nowrap">Up Coming Episodes</span>
                                <span className="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">{upcomingepisodes}</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <AiOutlineUser size={20} />
                                <span className="flex-1 ml-3 whitespace-nowrap">My Account</span>
                            </a>
                        </li>
                        {loggedIn ? (
                            <li>
                                <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <BiLogOut size={20} />
                                    <span className="flex-1 ml-3 whitespace-nowrap">Sign Out</span>
                                </a>
                            </li>
                        ) : (
                            <>
                                <li>
                                    <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                        <BiLogIn size={20} />
                                        <span className="flex-1 ml-3 whitespace-nowrap">Sign In</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                        <BsFillEnvelopePaperHeartFill size={20} />
                                        <span className="flex-1 ml-3 whitespace-nowrap">Sign Up</span>
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