import React, { useState, useEffect, useContext } from "react";
import ItemList from "./components/ItemList";
import Sidebar from "./components/Sidebar";
import { fetchInfo } from "./ShowsFetch";
import { getUserShows } from "./ApiRequest";
import Auth from "./components/Auth";
import { AuthContext } from "./App";

export default function UserShowsPage() {
  const [showsJson, setShowsJson] = useState([]);
  const [noShows, setNoShows] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  async function getShows() {
    let dbShows = await getUserShows();
    let shows = await Promise.all(
      dbShows.map((show) => {
        return fetchInfo(show.showId);
      })
    );
    if (shows.length == 0) setNoShows(true);
    else setShowsJson(shows);
  }

  async function fetchData() {
    if (isLoggedIn) await getShows();
  }
  useEffect(() => {
    fetchData();
    setIsLoading(false);
  }, [isLoggedIn]);
  useEffect(() => { document.title = 'My Shows' }, [])

  return (
    <div className="flex flex-col h-screen">
      {!isLoading && (
        <>
          {!isLoggedIn ? (
            <Auth />
          ) : (
            <div className=" mx-auto mt-6">
              {noShows ? (
                <p className="text-red-600 font-bold text-4xl">
                  Add your shows!
                </p>
              ) : (
                <ItemList
                  isLoading={isLoading}
                  showsJson={showsJson}
                  isLoggedIn={isLoggedIn}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
