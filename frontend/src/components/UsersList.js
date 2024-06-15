import React, { useState, useEffect } from "react";
import {
  getUsernameById,
  getProfileData,
  getImg,
  deleteFriend,
  friendshipStatus,
  sendFriendRequest,
  friendReqDecision,
} from "../ApiRequest";

export default function UsersList({ users }) {
  const [usersList, setUsersList] = useState([]);
  async function retriveProfiles() {
    let usersList = [];

    for (let user in users) {
      const currentUsername = await getUsernameById(users[user]);
      let profileData = await getProfileData(currentUsername);
      let dbImg = await getImg(currentUsername);
      //if user in search then we do not know whether users are friends or not//
      let isCurrentAfriend = await friendshipStatus(users[user]);
      let userObject = {
        username: currentUsername,
        current_status: profileData.current_status,
        userImg: dbImg || null,
        friendshipStatus: isCurrentAfriend,
      };
      usersList.push(userObject);
    }
    setUsersList(usersList);
  }

  async function handleAdd(username) {
    const sendFriendReq = await sendFriendRequest(username);
    if (sendFriendReq.success) {
      const updatedList = [...usersList];
      const index = updatedList.findIndex(
        (profile) => profile.username === username
      );

      if (index !== -1) {
        updatedList[index].friendshipStatus = "Pending_sender";
        setUsersList(updatedList);
      }
    }
  }

  async function handleAccept(username, decision) {
    const reqDecision = await friendReqDecision(username, decision);
    if (reqDecision.success) {
      const updatedList = [...usersList];
      const index = updatedList.findIndex(
        (profile) => profile.username === username
      );

      if (index !== -1) {
        updatedList[index].friendshipStatus = decision
          ? "Friend"
          : "Not a friend";
        setUsersList(updatedList);
      }
    }
  }

  async function handleDelete(username) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this friend?"
    );
    if (confirmed) {
      let deletePost = await deleteFriend(username);
      if (deletePost.success) {
        const updatedList = [...usersList];
        const index = updatedList.findIndex(
          (profile) => profile.username === username
        );

        if (index !== -1) {
          updatedList[index].friendshipStatus = "Not a friend";
          setUsersList(updatedList);
        }
      }
    }
  }

  useEffect(() => {
    retriveProfiles();
  }, []);

  return (
    <section>
      {usersList.map((profile, index) => (
        <>
          <div className="flex flex-row p-2" key={profile.userId}>
            <a href={`/profile/${profile.username}`}>
              <img
                className=" w-32 h-32 mr-2"
                src={
                  profile.userImg
                    ? profile.userImg
                    : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"
                }
                alt="Upload Image"
              />
            </a>
            <div className="flex flex-col gap-4">
              <a
                href={`/profile/${profile.username}`}
                className="text-blue-700"
              >
                {profile.username}
              </a>

              <p>
                {profile.current_status === "Online" ? (
                  <span className="text-green-500">
                    {profile.current_status}
                  </span>
                ) : (
                  <>
                    <span className="text-red-500">Offline </span>
                    <span className="text-gray-600 text-sm italic">
                      (last appearance: {profile.current_status})
                    </span>
                  </>
                )}
              </p>

              {profile.friendshipStatus === "Friend" ? (
                <button
                  className="rounded-sm w-[250px] font-mono py-2 px-4 text-white bg-red-700 hover:bg-red-500"
                  onClick={() => handleDelete(profile.username)}
                >
                  Delete Friend
                </button>
              ) : profile.friendshipStatus === "Pending_sender" ? (
                <button className="rounded-sm w-[250px] font-mono py-2 px-4 text-white bg-gray-700 hover:bg-gray-500 cursor-default">
                  Pending
                </button>
              ) : profile.friendshipStatus === "Pending_receiver" ? (
                <div className="flex">
                  <button
                    className="rounded-sm w-[250px] font-mono py-2 px-4 text-white bg-green-700 hover:bg-green-500 mr-1"
                    onClick={() => handleAccept(profile.username, true)}
                  >
                    Accept friendship
                  </button>
                  <button
                    className="rounded-sm w-[250px] font-mono py-2 px-4 text-white bg-red-700 hover:bg-red-500"
                    onClick={() => handleAccept(profile.username, false)}
                  >
                    Decline friendship
                  </button>
                </div>
              ) : (
                <button
                  className="rounded-sm w-[250px] font-mono py-2 px-4 text-white bg-blue-700 hover:bg-blue-500"
                  onClick={() => handleAdd(profile.username)}
                >
                  Add Friend
                </button>
              )}
            </div>
          </div>
          {index != usersList.length - 1 && (
            <hr class="h-px my-2 bg-gray-200 border-0 " />
          )}
        </>
      ))}
    </section>
  );
}
