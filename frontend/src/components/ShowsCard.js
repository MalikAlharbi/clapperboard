import React, { useEffect, useRef, useState } from "react";
import { fetchInfo, fetchSeasons } from "../ShowsFetch";
import AddToMyList from "./AddToMyList";
import InfoPopup from "./InfoPopUp";
import { getSavedEpisodes } from "../ApiRequest";

export default function ShowsCard({ showId, name, img, year }) {
  const [isPopOpen, setIsPopOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [nextEpisode, setNextEpisode] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const infoPopUpRef = useRef(null);
  const addToListPopUpRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        infoPopUpRef.current &&
        !infoPopUpRef.current.contains(event.target)
      ) {
        setIsPopOpen(false);
      }
      if (
        addToListPopUpRef.current &&
        !addToListPopUpRef.current.contains(event.target)
      ) {
        setIsAddOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);


  }, [infoPopUpRef, addToListPopUpRef]);



  useEffect(() => {
    async function getEpisodes() {
      const seasons = await fetchSeasons(showId);
      getSavedEpisodes(showId).then((data) => {
        if (data.length > 0) {
          setIsWatching(true)
          let next = data[data.length - 1]
          let list = next.watched_episodes.split(',')
          let last = list.lastIndexOf('true')
          if (list.length - 1 != last) {
            if (next.season < 10)
              setNextEpisode(`Next: S0${next.season}-E${last + 2}`)
            else
              setNextEpisode(`Next: S${next.season}-E${last + 2}`)
          }

          else if (seasons.length - 1 > next.season) {
            let nextSeason = seasons[next.season]
            if (nextSeason.number < 10)
              setNextEpisode(`Next: S0${nextSeason.number}-E${1}`)
            else
              setNextEpisode(`Next: S${nextSeason.number}-E${1}`)
          }

          else
            setNextEpisode("Completed")

        }
      })

    }

    getEpisodes();

  }, [])

  const handleInfoButton = () => {
    setIsPopOpen(true);
    setIsLoading(true);
    fetchInfo(showId).then((data) => {
      setInfo(data);
      setIsLoading(false);
    });
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
      {isWatching ?
        (
          <button
            className="inline-flex border border-green-600 absoulte  items-center justify-center w-48 h-12 py-2 rounded-md"
            onClick={() => setIsAddOpen(true)}
          >
            <p className="text-xl text-center text-green-600 font-montserrat">
              {nextEpisode}
            </p>
          </button>
        ) : (
          <button
            className="inline-flex border border-red-600 absoulte  items-center justify-center w-48 h-12 py-2 rounded-md"
            onClick={() => setIsAddOpen(true)}
          >
            <p className="text-xl text-center text-red-600 font-montserrat">
              Add to My List
            </p>
          </button>
        )}

      {isAddOpen && (
        <AddToMyList
          showId={showId}
          popUpRef={addToListPopUpRef}
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
            popUpRef={infoPopUpRef}
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
