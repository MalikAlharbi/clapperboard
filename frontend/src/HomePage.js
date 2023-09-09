import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "./App";
import Sidebar from "./components/Sidebar";
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
      <div className="z-10">
        <Sidebar isLoggedIn={isLoggedIn} />
      </div>
      <div className="w-screen h-screen flex flex-col items-center overflow-y-scroll">
        <div className="text-red-500 text-3xl animate-pulse">HomePage</div>

        <div className="text-3xl pt-5  ">
          {isLoggedIn && !loading && latestJson?.length > 0 && (
            <div className="mb-10">
              <div>
                <p className="text-white items-center text-center font-mono mb-5">
                  <span className="inline-block">
                    Recently watched episodes
                    <div className="border-b border-red-600"></div>
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
          <div className="mx-auto mt-6">
            <ItemList
              isLoading={loading}
              showsJson={topShowsData}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
