import React, { useEffect, useState } from "react";
import Loading from "./components/Loading.js";
import UsersList from "./components/UsersList.js";
import {
  showFriends,
  showFriendReq,
  sendFriendRequest,
  friendReqDecision,
  searchForUser,
} from "./ApiRequest";

export default function FriendsPage() {
  const [loading, setLoading] = useState(true);
  const [startLoading, setStartLoading] = useState(true);
  const [activeWindow, setActiveWindow] = useState("myFriends");
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState([false, ""]);
  const [friendRequests, setFriendRequests] = useState("");
  async function handleFriends() {
    setActiveWindow("myFriends");
    setLoading(true);
    const friends = await showFriends();
    console.log(friends);
    let friendList = [];
    for (let friend in friends) {
      friendList.push(friends[friend].user_2);
    }
    setUsers(friendList);
    setLoading(false);
  }

  async function handleShowFriendReq() {
    setActiveWindow("friendRequests");
    setLoading(true);
    let requestsList = [];
    console.log(friendRequests);
    console.log(friendRequests.friendReq.length);
    for (let request of friendRequests.friendReq) {
      requestsList.push(request.from_user);
    }
    setUsers(requestsList);
    setLoading(false);
  }

  async function handleSearch() {
    setActiveWindow("search");
    if (searchQuery.length > 0) {
      setSearched(true);
      setLoading(true);
      const searchResult = await searchForUser(searchQuery);
      if (searchResult.success) {
        setError([false, ""]);
        setUsers(searchResult.user_ids);
      } else setError([true, "User not found"]);
      setLoading(false);
    }
  }

  useEffect(() => {
    handleFriends();
    async function getCounts() {
      const requests = await showFriendReq();
      setFriendRequests(requests);
      setStartLoading(false);
    }
    getCounts();
  }, []);

  return (
    <div className="flex flex-col gap-0 items-center justify-center  font-mono text-white overflow-x-hidden mt-9">
      {!startLoading && (
        <div className="divide-x-2 divide-gray-600 text-l text-blue-600 mb-5 ">
          <button
            className={`hover:text-red-600 hover:underline pr-2 ${
              activeWindow === "myFriends" && "font-bold"
            }`}
            onClick={handleFriends}
          >
            My Friends
          </button>
          <button
            className={`hover:text-red-600 hover:underline pl-2 pr-2 ${
              activeWindow === "friendRequests" && "font-bold"
            }`}
            onClick={handleShowFriendReq}
          >
            Friend Requests ({friendRequests.friendReq.length})
          </button>
          <button
            className={`hover:text-red-600 hover:underline pl-2 ${
              activeWindow === "search" && "font-bold"
            }`}
            onClick={() => setActiveWindow("search")}
          >
            Search
          </button>
        </div>
      )}
      {!loading ? (
        <>
          {activeWindow === "myFriends" && (
            <UsersList users={users} isFriend={true} />
          )}
          {activeWindow === "friendRequests" && (
            <UsersList users={users} isFriend={false} />
          )}
          {activeWindow === "search" && (
            <div>
              <input
                type="text"
                value={searchQuery}
                placeholder="Search for friends..."
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearch();
                  }
                }}
                class="border px-10 py-4 text-white rounded-full bg-transparent m-5 "
              />
              <button
                class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                onClick={handleSearch}
              >
                Search
              </button>
              {searched && (
                <>
                  {error[0] ? (
                    <p className="text-red-600 font-bold flex justify-center">
                      {error[1]}
                    </p>
                  ) : (
                    <UsersList users={users} />
                  )}
                </>
              )}
            </div>
          )}
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}
