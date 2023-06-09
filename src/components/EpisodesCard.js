import React, { useEffect, useState } from "react";

export default function EpisodesCard({ episodes, seasons }) {
  const [savedEpisodes, setSavedEpisodes] = useState([]);
  const [saveAll, setSaveAll] = useState([{ 0: null }]);
  useEffect(() => {
    setSavedEpisodes(new Array(seasons).fill(null).map(() => []));
  }, []);

  function handleOneSave(index) {
    let season = episodes[index].season - 1;
    setSavedEpisodes((prevState) => {
      const newState = [...prevState];
      //if it is already clicked, remove it//
      if (!newState[index])
        newState[index] = true; // set the clicked episode as saved
      else newState[index] = false;

      return newState;
    });
  }

  useEffect(() => {
    console.log("saved", savedEpisodes);
  }, [savedEpisodes]);

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
                <button className="mr-2" onClick={() => handleOneSave(index)}>
                  <svg height="20" width="20">
                    <circle
                      cx="10"
                      cy="10"
                      r="10"
                      stroke="#020617"
                      fill={savedEpisodes[index] ? "#4ade80" : "#1f2937"}
                    />
                  </svg>
                </button>
                ({episode.number}) {episode.name} |{" "}
                <span className="text-red-500">{episode.runtime} </span> minutes
              </h2>

              {episode.image?.medium && (
                <img
                  className="rounded w-60 h-25"
                  src={episode.image?.medium}
                  alt=""
                  loading="lazy"
                />
              )}
            </div>
            <div className="p-4">
              <p className=" text-lg font-semibold text-gray-500 mb-2">
                {episode.airdate}
              </p>

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
