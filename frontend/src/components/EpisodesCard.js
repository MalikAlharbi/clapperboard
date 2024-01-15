import React, { useEffect, useState } from "react";
import { postSavedEpisodes } from "../ApiRequest";
export default function EpisodesCard({
  showId,
  episodes,
  tracker,
  seasonCurrentIndex,
  setTotalSavedEpisodes,
  clickerReset,
  seasons,
}) {
  const [savedEpisodes, setSavedEpisodes] = useState(tracker);
  const [dbIndex, setDbIndex] = useState(-1);

  const setTotal = async () => {
    setTotalSavedEpisodes((prevState) => {
      const newState = [...prevState];
      newState[seasonCurrentIndex] =
        savedEpisodes[seasonCurrentIndex]?.filter(Boolean).length;
      return newState;
    });
  };

  useEffect(() => {
    setTotal();
  }, [savedEpisodes]);

  useEffect(() => {
    setTotal();
  }, []);

  useEffect(() => {
    if (savedEpisodes)
      postSavedEpisodes(
        showId,
        savedEpisodes[seasonCurrentIndex],
        seasonCurrentIndex,
        dbIndex
      );
  }, [savedEpisodes]);

  useEffect(() => {
    if (clickerReset != null) handleAllSave();
  }, [clickerReset]);

  function handleUnknownSeasons(episode) {
    const seasonIndex = seasons.findIndex(function (item) {
      return Object.values(item).includes(episode.season);
    });
    return seasonIndex;
  }

  function handleUnknownSave(index, episode) {
    let epSeason = handleUnknownSeasons(episode);
    let epIndex = 0;
    setSavedEpisodes((prevState) => {
      const newState = prevState.map((seasonEpisodes, seasonIndex) => {
        if (seasonIndex === epSeason) {
          return seasonEpisodes.map((episodeSaved, episodeIndex) => {
            if (episodeIndex === index) {
              epIndex = !episodeSaved ? episodeIndex : -1;
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
    setDbIndex(epIndex);
  }

  function handleOneSave(index) {
    let epIndex = 0;
    setSavedEpisodes((prevState) => {
      const newState = prevState.map((seasonEpisodes, seasonIndex) => {
        if (seasonIndex === episodes[index].season - 1) {
          return seasonEpisodes.map((episodeSaved, episodeIndex) => {
            if (episodeIndex === index) {
              epIndex = !episodeSaved ? episodeIndex : -1;
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
    setDbIndex(epIndex);
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

    setDbIndex(-1);
  }

  return (
    <div className="max-w-[660px] max-h-[350px] md:max-h-[650px] overflow-y-auto scroll-smooth mx-auto">
      {episodes?.map((episode, index) => (
        <div key={episode.id} className="m-4">
          <div className="rounded-lg shadow-md overflow-hidden">
            <div className="p-2 flex flex-col sm:flex-row justify-between">
              <h2 className="text-l font-semibold text-white">
                {/* circle for episodes */}
                {seasons[0].number > 0 ? (
                  <button
                    className={`${
                      savedEpisodes[handleUnknownSeasons(episode)][index]
                        ? "bg-green-500"
                        : "bg-gray-600 hover:bg-red-600"
                    } rounded-full w-5 h-5 mr-2 mb-2`}
                    onClick={() => handleUnknownSave(index, episode)}
                  />
                ) : (
                  <button
                    className={`${
                      savedEpisodes[episode.season - 1][index]
                        ? "bg-green-500"
                        : "bg-gray-600 hover:bg-red-600"
                    } rounded-full w-5 h-5 mr-2 mb-2`}
                    onClick={() => handleOneSave(index)}
                  />
                )}
                {/* episodes details */}({episode.number}) {episode.name} |{" "}
                <span className="text-red-500">{episode.runtime} </span> minutes
              </h2>
              <p className="text-lg font-semibold text-gray-500 mb-2">
                {episode.airdate}
              </p>
            </div>
            <div className="p-4">
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
          <hr className="border-red-600 mb-4 mt-4" />
        </div>
      ))}
    </div>
  );
}
