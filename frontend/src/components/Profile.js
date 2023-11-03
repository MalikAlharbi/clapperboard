import React, { useState, useEffect, useRef } from "react";
import { uploadImage, getUsername, getImg } from "../ApiRequest";

export default function Profile() {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState([false, ""]);
  const [username, setUsername] = useState("");
  const [image, setImage] = useState(null);
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
    let username = await getUsername();
    setUsername(username);
    let dbImg = await getImg();
    if (dbImg) setImage(dbImg);
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
          <div class=" bg-red-500 text-white py-2 px-4 rounded shadow-lg transition-all duration-300 transform translate-y-0">
            {error[1]}
          </div>
        </div>
      )}
      {!loading && (
        <>
          <input
            type="file"
            accept=".png, .jpg, .jpeg"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          {image ? (
            <img
              className="rounded-full w-36 h-36 mb-2 object-cover object-center"
              src={image}
              onClick={handleImageUpload}
              style={{ cursor: "pointer" }}
              alt="Upload Image"
            />
          ) : (
            <img
              className="rounded-full w-20 h-20 mb-2"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"
              onClick={handleImageUpload}
              style={{ cursor: "pointer" }}
              alt="Upload Image"
            />
          )}

          <text className=" text-red-700 font-mono relative left-5">
            {username}
          </text>
        </>
      )}
    </>
  );
}
