import React, { useEffect, useState, useContext } from "react";
import { fetchSearch } from "./ShowsFetch";
import ItemList from "./components/ItemList";
import Sidebar from "./components/Sidebar";
import { is_authenticated } from "./ApiRequest";
import { AuthContext } from "./App";

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showsJson, setShowsJson] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);

  const handleSearch = () => {
    setIsLoading(true);
    setSearched(true);
    fetchSearch(searchQuery).then((data) => {
      setIsLoading(false);
      setShowsJson(data);
    });
  };
  useEffect(() => { document.title = 'browse' }, [])

  return (
    <div className="flex flex-col h-screen">
      <div class="w-screen h-screen flex flex-col items-center overflow-y-scroll">
        <input
          type="text"
          placeholder="Search for Tv Shows..."
          onChange={(event) => setSearchQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
          class="border px-10 py-4 text-white rounded-full bg-transparent m-5 "
        />
        <button
          class="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
          onClick={handleSearch}
        >
          Search
        </button>
        <br />

        <ItemList
          searched={searched}
          isLoading={isLoading}
          showsJson={showsJson}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  );
}
