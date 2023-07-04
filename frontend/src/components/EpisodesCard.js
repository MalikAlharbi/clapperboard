import React, { useEffect, useState } from "react";
import { postSavedEpisodes } from "../ApiRequest";
export default function EpisodesCard({
  showId,
  episodes,
  tracker,
  seasonCurrentIndex,
  setTotalSavedEpisodes,
  clickerReset,
}) {
  const [savedEpisodes, setSavedEpisodes] = useState(tracker);

  useEffect(() => {
    setTotalSavedEpisodes((prevState) => {
      const newState = [...prevState];
      newState[seasonCurrentIndex] =
        savedEpisodes[seasonCurrentIndex]?.filter(Boolean).length;
      return newState;
    });
    console.log(savedEpisodes);

    //POST CHANGES TO DB//
    if (savedEpisodes)
      postSavedEpisodes(
        showId,
        savedEpisodes[seasonCurrentIndex],
        seasonCurrentIndex
      );
  }, [savedEpisodes]);

  useEffect(() => {
    if (clickerReset) handleAllSave();
  }, [clickerReset]);

  function handleOneSave(index) {
    setSavedEpisodes((prevState) => {
      const newState = prevState.map((seasonEpisodes, seasonIndex) => {
        if (seasonIndex === episodes[index].season - 1) {
          return seasonEpisodes.map((episodeSaved, episodeIndex) => {
            if (episodeIndex === index) {
              return !episodeSaved; // toggle the saved state of the episode
            } else {
              return episodeSaved;
            }
          });
        } else {
          return seasonEpisodes;
        }
      });
      return newState;
    });
  }

  function handleAllSave() {
    setSavedEpisodes((prevState) => {
      const newState = prevState.map((currentSavedEpisodes, seasonIndex) => {
        if (seasonIndex === seasonCurrentIndex) {
          if (currentSavedEpisodes.some((element) => element === false))
            return (currentSavedEpisodes = currentSavedEpisodes.map(
              () => true
            ));
          else
            return (currentSavedEpisodes = currentSavedEpisodes.map(
              () => false
            ));
        } else return currentSavedEpisodes;
      });
      return newState;
    });
  }

  return (
    <div
      className="w-full"
      style={{
        maxHeight: "calc(100vh - 200px)",
        overflowY: "scroll",
        position: "relative",
      }}
    >
      {episodes?.map((episode, index) => (
        <div key={episode.id} className="mb-4">
          <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-800 p-4 flex justify-between">
              <h2 className="text-xl font-semibold text-white">
                {/* circle for episodes */}
                <button
                  className={`${
                    savedEpisodes[episode.season - 1][index]
                      ? "bg-green-500"
                      : "bg-gray-600 hover:bg-red-600"
                  } rounded-full w-5 h-5 mr-2 mb-2`}
                  onClick={() => handleOneSave(index)}
                />
                {/* episodes details */}({episode.number}) {episode.name} |{" "}
                <span className="text-red-500">{episode.runtime} </span> minutes
              </h2>
            </div>
            <div className="p-4">
              <p className=" text-lg font-semibold text-gray-500 mb-2">
                {episode.airdate}
              </p>
              {episode.image?.medium && (
                <img
                  className="rounded float-left md:float-right p-1"
                  src={episode.image?.medium}
                  alt=""
                  loading="lazy"
                />
              )}
              <span className="text-lg text-white leading-7">
                {episode.summary?.replace(/<[^>]*>/g, "")}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
