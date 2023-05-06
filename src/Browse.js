import { useEffect, useState } from "react";
import ShowsCard from "./components/ShowsCard";
import Loading from "./components/Loading";
import fetchSearch from "./ShowsFetch";

function Browse() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showsJson, setShowsJson] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    setIsLoading(true);
    setSearched(true);
    fetchSearch(searchQuery).then((data) => {
      setIsLoading(false);
      setShowsJson(data);
    });
  };
  return (
    <div class="w-screen h-screen flex flex-col items-center">
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
      {isLoading ? (
        <Loading />
      ) : (
        !isLoading &&
        showsJson.length > 0 && (
          <div className="grid grid-cols-3 gap-7">
            {showsJson.slice(0, 12).map((show, index) => (
              <div
                className={`ShowsCard transition duration-200 ease-in-out delay-${
                  index + 1
                }`}
              >
                {show["show"]["image"] != null ? (
                  <ShowsCard
                    key={show["id"]}
                    name={show["show"]["name"]}
                    img={show["show"]["image"]["original"]}
                    year={show["show"]["premiered"]}
                  />
                ) : (
                  <ShowsCard key={show["id"]} name={show["show"]["name"]} />
                )}
              </div>
            ))}
          </div>
        )
      )}
      {searched && !isLoading && showsJson.length === 0 && (
        <p class="text-red-600 font-bold">NOT FOUND</p>
      )}
    </div>
  );
}
export default Browse;
