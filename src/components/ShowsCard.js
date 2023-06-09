import React, { useEffect, useRef, useState } from "react";
import { fetchInfo } from "../ShowsFetch";
import AddToMyList from "./AddToMyList";
import InfoPopup from "./InfoPopUp";
import Loading from "./Loading";

export default function ShowsCard({ showId, name, img, year }) {
  const [isPopOpen, setIsPopOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [info, setInfo] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const popUpRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popUpRef.current && !popUpRef.current.contains(event.target)) {
        setIsPopOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
  }, [popUpRef]);

  const handleInfoButton = () => {
    setIsPopOpen(true);
    setIsLoading(true);
    fetchInfo(showId).then((data) => {
      setInfo(data);
      setIsLoading(false);
    });
  };

  const handleAddToMyListButton = () => {
    setIsAddOpen(true);
  };

  return (
    <div className="w-72 h-full max-h-100 rounded-lg shadow-lg flex flex-col items-center justify-center relative">
      <img
        className="max-h-82 h-full w-82 object-cover rounded-t-lg"
        alt={`${name}`}
        src={`${img}`}
        loading="lazy"
      />
      <br />

      <label className="">
        {year != null ? (
          <p className=" not-italic font-bold text-white">
            {name} ({year.split("-")[0]})
          </p>
        ) : (
          <p className=" not-italic font-bold text-white">{name}</p>
        )}
      </label>
      <br />

      <button
        className="inline-flex border border-red-600 absoulte  items-center justify-center w-48 h-12 py-2 rounded-md"
        onClick={handleAddToMyListButton}
      >
        <p className="text-xl text-center text-red-600 font-montserrat">
          Add to My List
        </p>
      </button>

      {isAddOpen && (
        <AddToMyList
          showId={showId}
          popUpRef={popUpRef}
          setIsOpen={setIsAddOpen}
          name={name}
        />
      )}

      <>
        <button
          className="w-9 h-8 border border-black bg-white rounded-full absolute top-0 right-0"
          onClick={handleInfoButton}
        >
          <p className="text-xl text-center text-black">i</p>
        </button>
        {isPopOpen && (
          <InfoPopup
            popUpRef={popUpRef}
            setIsOpen={setIsPopOpen}
            info={info}
            loading={loading}
            name={name}
            img={img}
            year={year}
          />
        )}
      </>

      <br />
    </div>
  );
}
