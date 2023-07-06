import React, { useEffect, useRef, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [clickerReset, setClickerReset] = useState(null);

  async function getSeasons() {
    const data = await fetchSeasons(showId);
    setSeasons(data);
    setClickedSeasons(new Array(data.length).fill(false)); // initialize clickedSeasons array with false values
  }

  async function getEpisodes(numOfSeasons) {
    const allEpisodes = await fetchEpoisdes(showId);
    let dbEpisodes = await getSavedEpisodes(showId);
    let eps = new Array(numOfSeasons).fill(null).map(() => []);
    let tracker = new Array(numOfSeasons).fill(null).map(() => []);
    let totalSaved = new Array(numOfSeasons).fill(null).map(() => null);
    allEpisodes.forEach((episode) => {
      const seasonIndex = episode.season - 1;
      if (seasonIndex >= 0 && seasonIndex < numOfSeasons) {
        eps[seasonIndex].push(episode);
        tracker[seasonIndex].push(false);
      }
    });
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
    setLoading(false);
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      await getSeasons();
    }
    fetchData();
  }, []);

  useEffect(() => {
    getEpisodes(seasons.length);
  }, [seasons]);

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

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-50  justify-center items-center pl-10 pr-10 max-h-2xl h-screen w-screen grid place-items-center overflow-y-scroll">
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-900 opacity-50"></div>

      <div
        className="bg-gray-700 rounded-lg z-10  max-w-4xl  right-0 flex relative"
        ref={popUpRef}
      >
        <div className="absolute top-0 right-0 ">
          {/* close window */}
          <button
            className="w-6 h-6 text-white hover:text-red-400 focus:outline-none "
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

        <div className="px-6 py-4 flex flex-col ">
          <div className=" relative items-center mb-4  top-0 ">
            <h2 className="text-white text-xl font-bold">
              Tell us where you <span className="text-red-500">stopped</span>
            </h2>
          </div>

          <hr className="border-gray-600 mb-4" />


          {loading ? (
            <Loading />
          ) : (
            <>
              {/* seasons buttons */}
              <div className="relative flex items-center">
                <div className="w-full h-full max-w-2xl overflow-x-auto whitespace-nowrap scroll-smooth">
                  {seasons.map((season, index) => (
                    <div key={season.id} className="inline-block">
                      <button
                        className={`${clickedSeasons[index]
                          ? "bg-red-600 text-white"
                          : totalSavedEpisodes[index] === season.episodeOrder
                            ? "bg-green-600 text-white"
                            : "bg-gray-800 hover:bg-red-600 text-gray-300"
                          } rounded-full py-2 px-4 font-semibold mr-2 mb-2`}
                        onClick={() => handleButton(index)}
                      >
                        <span
                          className={`${totalSavedEpisodes[index]
                            ? "bg-blue-600"
                            : "bg-gray-600 hover:bg-blue-600"
                            } rounded-full w-6 h-6 inline-flex items-center justify-center mr-2`}
                          onClick={() => {
                            setClickerReset(!clickerReset);
                          }}
                        />
                        <span className=" text-lg">
                          Season {season.number} ({totalSavedEpisodes[index] || 0}
                          /{season.episodeOrder})
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>


              {/* episodes cards */}
              <div className="col-span-1 mt-9 max-w-2xl">
                {isClicked && (
                  <EpisodesCard
                    showId={showId}
                    episodes={episodes[currentIndex]}
                    tracker={tracker}
                    seasonCurrentIndex={currentIndex}
                    setTotalSavedEpisodes={setTotalSavedEpisodes}
                    clickerReset={clickerReset}
                  />
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
