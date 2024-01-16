import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  uploadImage,
  getImg,
  getProfileData,
  getUsername,
  getProfileShows,
} from "./ApiRequest";
import { fetchInfo } from "./ShowsFetch";
import ItemList from "./components/ItemList";
import Loading from "./components/Loading";
import { AuthContext } from "./App";

export default function ProfilePage() {
  const { isLoggedIn } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState([false, ""]);
  const [notFoundError, setNotFoundError] = useState({ error: false, msg: "" });
  const [image, setImage] = useState(null);
  const [dateJoined, setDateJoined] = useState();
  const [totalShows, setTotalShows] = useState(0);
  const [currentStatus, setCurrentStatus] = useState();
  const [isOwner, setIsOwner] = useState(false);
  const [showsJson, setShowsJson] = useState(null);
  let { username } = useParams();
  const handleImageUpload = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const selectedFile = event.target.files[0];

    const formData = new FormData();
    formData.append("file", selectedFile);
    let upload = await uploadImage(formData);
    if (!upload) setError([true, upload.error]);
    else setImage(URL.createObjectURL(selectedFile));
  };

  const retriveProfile = async () => {
    try {
      const currentUsername = await getUsername();
      if (currentUsername && currentUsername === username) setIsOwner(true);
      let profileData = await getProfileData(username);
      let dbShows = await getProfileShows(username);
      let shows = await Promise.all(
        dbShows.map((show) => {
          return fetchInfo(show.showId);
        })
      );
      if (shows.length != 0) setShowsJson(shows);

      setShowsJson(shows);
      setDateJoined(profileData.date_joined);
      setTotalShows(profileData.total_shows);
      setCurrentStatus(profileData.current_status);
      let dbImg = await getImg(username);
      if (dbImg) setImage(dbImg);
    } catch (error) {
      setNotFoundError({ error: true, msg: "User not found (404)" });
    }

    setLoading(false);
  };

  useEffect(() => {
    retriveProfile();
  }, []);

  async function errorHider() {
    return await new Promise((r) => setTimeout(r, 5000));
  }
  useEffect(() => {
    if (error[0]) {
      errorHider().then(() => {
        setError([false, ""]);
      });
    }
  }, [error]);
  return (
    <>
      {error[0] && (
        <div class="absloute bottom-0  right-0 inset-x-0 flex justify-center items-center">
          <div class="bg-red-500 text-white py-2 px-4 rounded shadow-lg transition-all duration-300 transform translate-y-0">
            {error[1]}
          </div>
        </div>
      )}

      {notFoundError.error && (
        <div class="flex flex-col items-center">
          <div class="text-red-500 text-2xl">{notFoundError.msg}</div>
        </div>
      )}

      {!loading && !notFoundError.error ? (
        <div className="flex flex-col items-center mt-10">
          <div className="flex flex-row mb-10">
            <>
              {isOwner && (
                <input
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              )}
              {image ? (
                <img
                  className="rounded-md w-48 h-48 mb-2 object-cover object-center"
                  src={image}
                  onClick={handleImageUpload}
                  style={{ cursor: isOwner ? "pointer" : "default" }}
                  alt="Upload Image"
                />
              ) : (
                <img
                  className="rounded-full w-40 h-40"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"
                  onClick={handleImageUpload}
                  style={{ cursor: isOwner ? "pointer" : "default" }}
                  alt="Upload Image"
                />
              )}
            </>
            <div className="text-white font-mono relative left-5 space-y-4">
              <p className="text-red-700">{username}</p>

              <p>
                Current Status:{" "}
                {currentStatus === "Online" ? (
                  <span className="text-green-500">{currentStatus}</span>
                ) : (
                  <>
                    <span className="text-red-500">Offline </span>
                    <span className="text-gray-600 text-sm italic">
                      (last appearance: {currentStatus})
                    </span>
                  </>
                )}
              </p>
              <p>
                Total Shows Watched:{" "}
                <span className="text-orange-400">{totalShows} </span>
              </p>

              <p>Joined: {dateJoined}</p>
            </div>
          </div>
          <ItemList
            isLoading={loading}
            showsJson={showsJson}
            isLoggedIn={isLoggedIn}
            username={username}
          />
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <Loading size={16} />
        </div>
      )}
    </>
  );
}
