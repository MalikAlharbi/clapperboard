import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "./App";
import ShowsCarousel from "./components/ShowsCarousel";
import { latestEpisodes, topShows } from "./ApiRequest";
import { fetchInfo } from "./ShowsFetch";
import ItemList from "./components/ItemList";

export default function HomePage() {
  const { isLoggedIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [latestJson, setLatestJson] = useState();
  const [topShowsData, setTopShowsData] = useState();

  async function getLatestEpisodes() {
    const data = await latestEpisodes();
    setLatestJson(data);
  }

  async function getTopShows() {
    const top = await topShows();
    let shows = await Promise.all(
      top.map((show) => {
        return fetchInfo(show.showId);
      })
    );
    setTopShowsData(shows);
  }
  useEffect(() => {
    if (isLoggedIn) {
      getLatestEpisodes();
    }
    setLoading(false);
  }, [isLoggedIn]);

  useEffect(() => {
    //top 3 shows
    getTopShows();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="w-screen h-screen flex flex-col items-center overflow-y-scroll">
        <a
          href="/"
          className="flex items-center p-6 text-2xl font-semibold text-red-600"
        >
          <img
            className="w-10 h-10 mr-2 invert"
            src="static/images/favicon.ico"
            alt="logo"
          />
          clapperboard
        </a>

        <div className="text-3xl pt-5  ">
          {isLoggedIn && !loading && latestJson?.length > 0 && (
            <div className="mb-10">
              <div>
                <p className="text-white items-center text-center font-mono mb-5">
                  <span className="inline-block border-b border-red-600">
                    Recently watched episodes
                  </span>
                </p>
              </div>
              <div className="item-center mx-auto max-w-lg max-h-15">
                <ShowsCarousel showsJson={latestJson} />
              </div>
            </div>
          )}
          <span className="text-red-500 font-mono mt-5">Top 3 </span>{" "}
          <span className="text-white font-mono">
            most watched shows this week
          </span>
        </div>
        <div className="mx-auto mt-6">
          <ItemList
            isLoading={loading}
            showsJson={topShowsData}
            isLoggedIn={isLoggedIn}
          />
        </div>

      </div>
    </div>
  );
}
