import React from "react";
import Loading from "./Loading";
import ShowsCard from "./ShowsCard";

export default function ItemList({ searched, isLoading, showsJson }) {
  const filteredShows = showsJson.filter(
    (show) => show?.show?.name && show?.show?.image?.original
  );

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        filteredShows.length > 0 && (
          <div className="grid grid-cols-3 gap-7">
            {filteredShows.map((show) => (
              <ShowsCard
                showId={show["show"]["id"]}
                name={show["show"]["name"]}
                img={show["show"]["image"]["original"]}
                year={show["show"]["premiered"]}
              />
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
