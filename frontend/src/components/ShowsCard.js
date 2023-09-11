import React, { useEffect, useRef, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { fetchInfo, fetchSeasons } from "../ShowsFetch";
import AddToMyList from "./AddToMyList";
import Auth from "./Auth";
import Loading from "./Loading";
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
  const [imageLoading, setImageLoading] = useState(true);

  function handleClickOutside(event) {
    if (infoPopUpRef.current && !infoPopUpRef.current.contains(event.target))
      setIsPopOpen(false);

    if (
      addToListPopUpRef.current &&
      !addToListPopUpRef.current.contains(event.target)
    )
      setIsAddOpen(false);
  }

  async function getEpisodes() {
    const seasons = await fetchSeasons(showId);
    const data = await getSavedEpisodes(showId);
    let flag = false;
    if (seasons[0]?.number != 1) flag = true;

    if (data.length > 0) {
      setIsWatching(true);
      const next = data[data.length - 1];
      const list = next.watched_episodes.split(",");
      const last = list.lastIndexOf("true");

      if (list.length - 1 !== last) {
        const seasonNumber = flag
          ? seasons[next.season - 1].number
          : next.season;
        const episodeNumber = last + 2;
        const seasonString =
          seasonNumber < 10 ? `0${seasonNumber}` : seasonNumber;
        setNextEpisode(`Next: S${seasonString}-E${episodeNumber}`);
      } else if (seasons.length > next.season) {
        const nextSeason = seasons[next.season];
        const seasonString =
          nextSeason.number < 10 ? `0${nextSeason.number}` : nextSeason.number;
        setNextEpisode(`Next: S${seasonString}-E01`);
      } else {
        setNextEpisode("Completed");
      }
    }
  }
  async function fetchData() {
    await isLoggedIn;
    if (isLoggedIn) {
      await getEpisodes();
    }
    setIsLoading(false);
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

  useEffect(() => {
    const image = new Image();
    image.src = img;
    image.onload = () => {
      setImageLoading(false);
    };
  }, [img]);

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
      {imageLoading ? (
        <div className="animate-pulse bg-gray-600 h-[434px] w-[288px] rounded-t-lg flex items-center justify-center">
          <svg
            className="w-[100px] h-[90px] text-gray-200 dark:text-gray-200"
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
          className="h-[434px] w-[288px] object-cover rounded-t-lg"
          alt={name}
          src={img}
          loading="lazy"
        />
      )}
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
              <p className="text-xl text-center text-green-600 ">
                {nextEpisode}
              </p>
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
