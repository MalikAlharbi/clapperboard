import React, { useEffect, useRef, useState } from "react";
import { fetchInfo, fetchSeasons } from "../ShowsFetch";
import AddToMyList from "./AddToMyList";
import Auth from "./Auth";
import Loading from './Loading'
import InfoPopup from "./InfoPopUp";
import { getSavedEpisodes } from "../ApiRequest";

export default function ShowsCard({ showId, name, img, year, isLoggedIn }) {
  const [isPopOpen, setIsPopOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [nextEpisode, setNextEpisode] = useState(null);
  const [info, setInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const infoPopUpRef = useRef(null);
  const addToListPopUpRef = useRef(null);

  function handleClickOutside(event) {
    if (
      infoPopUpRef.current &&
      !infoPopUpRef.current.contains(event.target)
    )
      setIsPopOpen(false);

    if (
      addToListPopUpRef.current &&
      !addToListPopUpRef.current.contains(event.target)
    )
      setIsAddOpen(false);
  }

  async function getEpisodes() {
    const seasons = await fetchSeasons(showId);

    getSavedEpisodes(showId).then((data) => {
      if (data.length > 0) {
        setIsWatching(true)
        let next = data[data.length - 1]
        let list = next.watched_episodes.split(',')
        let last = list.lastIndexOf('true')
        if (list.length - 1 !== last) {
          if (next.season < 10)
            setNextEpisode(`Next: S0${next.season}-E${last + 2}`)
          else
            setNextEpisode(`Next: S${next.season}-E${last + 2}`)
        }

        else if (seasons.length > next.season) {
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

  async function fetchData() {
    if (isLoggedIn) {
      await getEpisodes();
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [isLoggedIn]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [infoPopUpRef, addToListPopUpRef]);

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
      {!isLoading && (
        <>
          {isWatching ? (
            <button
              className="inline-flex border border-green-600 absoulte  items-center justify-center w-48 h-12 py-2 rounded-md"
              onClick={() => setIsAddOpen(true)}
            >
              <p className="text-xl text-center text-green-600 ">{nextEpisode}</p>
            </button>
          ) : (
            <button
              className="inline-flex border border-red-600 absoulte  items-center justify-center w-48 h-12 py-2 rounded-md"
              onClick={() => setIsAddOpen(true)}
            >
              <p className="text-xl text-center text-red-600">Add to My List</p>
            </button>
          )}
        </>
      )}

      {isLoading && <Loading />}

      {isAddOpen && (
        <>
          {isLoggedIn ? (
            <AddToMyList
              showId={showId}
              popUpRef={addToListPopUpRef}
              setIsOpen={setIsAddOpen}
              name={name}
            />
          ) : (
            <Auth authRef={addToListPopUpRef} />
          )}
        </>
      )}

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
          loading={isLoading}
          name={name}
          img={img}
          year={year}
        />
      )}

      <br />
    </div>
  );
}