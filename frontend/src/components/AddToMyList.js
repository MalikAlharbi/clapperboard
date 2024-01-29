import React, { useEffect, useState } from "react";
import { fetchSeasons, fetchEpoisdes } from "../ShowsFetch";
import { getSavedEpisodes } from "../ApiRequest";
import EpisodesCard from "./EpisodesCard";
import Loading from "./Loading";

export default function AddToMyList({ showId, popUpRef, setIsOpen }) {
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [tracker, setTracker] = useState([]);
  const [clickedSeasons, setClickedSeasons] = useState([]);
  const [totalSavedEpisodes, setTotalSavedEpisodes] = useState(
    new Array(seasons.length).fill(0)
  );
  const [loading, setLoading] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [clickerReset, setClickerReset] = useState(null);
  const [apiSeason, setApiSeason] = useState(-1);

  async function getSeasons() {
    const data = await fetchSeasons(showId);
    setSeasons(data);
    setClickedSeasons(new Array(data.length).fill(false)); // initialize clickedSeasons array with false values
  }

  async function getEpisodes(seasons) {
    let flag = false;
    if (seasons[0]?.number != 1) flag = true;

    let numOfSeasons = seasons.length;
    const allEpisodes = await fetchEpoisdes(showId);
    let dbEpisodes = await getSavedEpisodes(showId);
    let eps = new Array(numOfSeasons).fill(null).map(() => []);
    let tracker = new Array(numOfSeasons).fill(null).map(() => []);
    let totalSaved = new Array(numOfSeasons).fill(0);

    if (flag) {
      allEpisodes.forEach((episode) => {
        const seasonIndex = seasons.findIndex(function (item) {
          return Object.values(item).includes(episode.season);
        });
        if (seasonIndex >= 0 && seasonIndex < numOfSeasons) {
          eps[seasonIndex].push(episode);
          tracker[seasonIndex].push(false);
        }
      });
    } else {
      allEpisodes.forEach((episode) => {
        const seasonIndex = episode.season - 1;

        if (seasonIndex >= 0 && seasonIndex < numOfSeasons) {
          eps[seasonIndex].push(episode);
          tracker[seasonIndex].push(false);
        }
      });
    }

    dbEpisodes.forEach((watched_episodes) => {
      const seasonIndex = watched_episodes.season - 1;
      const str = watched_episodes.watched_episodes;
      const arr = str.split(",").map((str) => str === "true");
      if (seasonIndex >= 0 && seasonIndex < numOfSeasons) {
        tracker[seasonIndex] = arr;
        totalSaved[seasonIndex] = arr.filter(Boolean).length;
      }
    });
    setEpisodes(eps);

    setTracker(tracker);
    setTotalSavedEpisodes(totalSaved);
  }

  useEffect(() => {
    getSeasons();
  }, []);

  useEffect(() => {
    if (seasons != null) {
      getEpisodes(seasons);
    }
  }, [seasons]);

  useEffect(() => {
    if (totalSavedEpisodes.length > 0) setLoading(false);
  }, [totalSavedEpisodes]);

  function handleButton(index) {
    setIsClicked(true);
    setCurrentIndex(index);
    setClickedSeasons((prevState) => {
      // create a copy of the previous state array
      const newState = [...prevState];

      // toggle the clicked state for the clicked season
      newState[index] = !prevState[index];

      // if the clicked season is not the previously selected season, set the clicked state for the previously
      // selected season to false
      if (prevState.findIndex((clicked) => clicked === true) !== index) {
        const previouslyClickedIndex = prevState.findIndex(
          (clicked) => clicked === true
        );
        if (previouslyClickedIndex >= 0) {
          newState[previouslyClickedIndex] = false;
        }
      }

      return newState;
    });
  }

  async function handleRester(season, index) {
    if (clickerReset === null) setClickerReset(true);
    else setClickerReset((prevState) => !prevState);

    setCurrentIndex(index);
    setIsClicked(true);

    setApiSeason(season)
  }

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-50 justify-center items-center pl-10 pr-10 max-h-2xl h-screen w-screen grid place-items-center overflow-y-scroll">
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-900 opacity-20"></div>

      <div
        className="bg-black border border-red-600 rounded-lg z-10  right-0 flex relative"
        ref={popUpRef}
      >
        <div className="absolute top-0 right-0">
          {/* close window */}
          <button
            className="w-6 h-6 text-white hover:text-red-400 focus:outline-none"
            onClick={() => setIsOpen(false)}
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M11.414 10l4.293-4.293a1 1 0 00-1.414-1.414L10 8.586 5.707 4.293a1 1 0 00-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 001.414 1.414L10 11.414l4.293 4.293a1 1 0 001.414-1.414L11.414 10z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="relative items-center mb-4">
            <h2 className="text-white text-xl font-bold top-0 bottom-0 right-0 left-0">
              Tell us where you <span className="text-red-500">stopped</span>
            </h2>
          </div>

          <hr className="border-red-600 mb-4" />

          {loading ? (
            <Loading />
          ) : (
            <div className="flex flex-col sm:flex-row">
              {/* seasons buttons */}
              <div className="w-full sm:w-[250px] max-h-[650px] overflow-y-auto scroll-smooth">
                {seasons.map((season, index) => (
                  <div key={season.id} className="flex flex-row left-0 mb-2">
                    <div className="inline-block">
                      <button
                        className={`${totalSavedEpisodes[index]
                          ? "bg-blue-600"
                          : "bg-gray-600 hover:bg-blue-600"
                          } rounded-full w-4 h-4 items-center mr-4`}
                        onClick={() => {
                          handleRester(season?.number, index);
                        }}
                      />

                      <button
                        className={`${clickedSeasons[index]
                          ? "text-red-500"
                          : totalSavedEpisodes[index] === season.episodeOrder
                            ? "text-green-500"
                            : "hover:text-red-500 text-gray-300"
                          } rounded-full py-2 px-4 font-bold mr-2 mb-2`}
                        onClick={() => handleButton(index)}
                      >
                        <span className="text-lg">
                          Season {season.number} (
                          {totalSavedEpisodes[index] || 0}/
                          {season.episodeOrder
                            ? season.episodeOrder
                            : episodes[index]?.length}
                          )
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* episodes cards */}
              <div className="flex flex-col items-start float-right">
                {isClicked && (
                  <EpisodesCard
                    showId={showId}
                    episodes={episodes[currentIndex]}
                    tracker={tracker}
                    seasonCurrentIndex={currentIndex}
                    setTotalSavedEpisodes={setTotalSavedEpisodes}
                    clickerReset={clickerReset}
                    seasons={seasons}
                    apiS={apiSeason}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
