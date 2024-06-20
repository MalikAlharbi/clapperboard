import React, { useState, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Loading from "./Loading";

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
  const [loading, setIsLoading] = useState(true); // Object to store individual loading states

  const [userImagesLoading, setUserImagesLoading] = useState({}); // Object to store individual loading states

  async function retriveProfiles() {
    let usersList = [];

    for (let user in users) {
      const currentUsername = await getUsernameById(users[user]);
      let profileData = await getProfileData(currentUsername);
      let dbImg = await getImg(currentUsername);
      if (dbImg) {
        setUserImagesLoading({ ...userImagesLoading, [currentUsername]: true }); // Initialize loading state for user

        const image = new Image();
        image.src = dbImg;
        image.onload = () => {
          setUserImagesLoading({
            ...userImagesLoading,
            [currentUsername]: false,
          }); // Update specific image state
        };
      } else {
        setUserImagesLoading({
          ...userImagesLoading,
          [currentUsername]: false,
        }); // No image, set loading to false
      }

      let userObject = {
        username: currentUsername,
        current_status: profileData.current_status,
        userImg: dbImg || null,
        friendshipStatus: await friendshipStatus(users[user]),
      };
      usersList.push(userObject);
    }
    setUsersList(usersList);
    setIsLoading(false);
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
      {loading ? (
        <Loading />
      ) : (
        usersList.map((profile, index) => (
          <>
            <div className="flex flex-row p-2" key={profile.userId}>
              <a href={`/profile/${profile.username}`}>
                {userImagesLoading[profile.username] ? (
                  <div className="animate-pulse bg-gray-600 h-[128px] w-[128px] mr-2 rounded-t-lg flex items-center justify-center">
                    <svg
                      className="w-[32px] h-[32px] mr-2 text-gray-200 dark:text-gray-200"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 18"
                    >
                      <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                    </svg>
                  </div>
                ) : (
                  <LazyLoadImage
                    className=" w-32 h-32 mr-2"
                    src={
                      profile.userImg
                        ? profile.userImg
                        : "media/users/Default_pfp.png"
                    }
                    alt="Upload Image"
                  />
                )}
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
        ))
      )}
    </section>
  );
}
