import React, { useState, useEffect, useRef } from "react";
import { uploadImage, getImg } from "../ApiRequest";
import Resizer from "react-image-file-resizer";
export default function SidebarProfile({ username }) {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState([false, ""]);
  const [image, setImage] = useState(null);
  const handleImageUpload = () => {
    fileInputRef.current.click();
  };

  const resizeFile = (file) => {
    return new Promise((resolve, reject) => {
      Resizer.imageFileResizer(
        file,
        192,
        192,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64",
        192,
        192
      );
    });
  };

  const handleImageChange = async (event) => {
    const selectedFile = event.target.files[0];
    try {
      const resizeImg = await resizeFile(selectedFile);
      const blob = await fetch(resizeImg).then((res) => res.blob());
      const formData = new FormData();
      formData.append("file", blob, selectedFile.name);
      let upload = await uploadImage(formData);
      if (!upload) {
        setError([true, upload.error]);
      } else {
        setImage(URL.createObjectURL(selectedFile));
      }
    } catch (error) {
      // Handle any errors that occurred during the resizing or upload process
      console.error(error);
      setError([true, "An error occurred during image handling"]);
    }
  };

  const retriveProfile = async () => {
    let dbImg = await getImg(username);
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
              src="https://clapperboard-storage-m.s3.eu-north-1.amazonaws.com/users/Default_pfp.png"
              onClick={handleImageUpload}
              style={{ cursor: "pointer" }}
              alt="Upload Image"
            />
          )}

          <b className=" text-red-700 font-mono relative left-5">{username}</b>
        </>
      )}
    </>
  );
}
