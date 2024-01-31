import React from "react";
import Loading from "./Loading";
import ShowsCard from "./ShowsCard";

export default function ItemList({
  searched,
  isLoading,
  showsJson,
  isLoggedIn,
  username,
}) {
  let filteredShows = [];
  if (searched) {
    filteredShows = showsJson.filter(
      (show) => show?.show?.name && show?.show?.image?.original
    );
  }

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : searched ? (
        filteredShows?.length > 0 && (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredShows.map((show) => (
              <ShowsCard
                key={show["show"]["id"]}
                showId={show["show"]["id"]}
                name={show["show"]["name"]}
                img={show["show"]["image"]["original"]}
                year={show["show"]["premiered"]}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        )

      ) : showsJson?.length > 0 && (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {showsJson.map((show) => (
            <ShowsCard
              key={show["id"]}
              showId={show["id"]}
              name={show["name"]}
              img={show["image"]["original"]}
              year={show["premiered"]}
              isLoggedIn={isLoggedIn}
              username={username}
            />
          ))}
        </div>

      )}
      {searched && !isLoading && showsJson.length === 0 && (
        <p className="text-red-600 font-bold">NOT FOUND</p>
      )}
    </div>
  );
}
