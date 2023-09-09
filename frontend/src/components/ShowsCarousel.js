import React, { useEffect, useState } from "react";
import { fetchEpisode, fetchInfo } from "../ShowsFetch";
import Loading from "./Loading";
import { Carousel } from "flowbite-react";

export default function ShowsCarousel({ showsJson }) {
  const [latestEpisodes, setLatestEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getShows() {
    if (showsJson && showsJson.length > 0) {
      const latestEp = await Promise.all(
        showsJson.map(async (element) => {
          if (element.modified_index > -1) {
            const data = await fetchEpisode(
              element.showId,
              element.season,
              element.modified_index + 1
            );
            return data;
          } else {
            const list = element.watched_episodes.split(",");
            const last = list.lastIndexOf("true") + 1;
            const data = await fetchEpisode(
              element.showId,
              element.season,
              last
            );
            return data;
          }
        })
      );

      setLatestEpisodes(latestEp);
    }

    setLoading(false);
  }

  useEffect(() => {
    getShows();
  }, [showsJson]);

  return (
    <>
      {!loading ? (
        latestEpisodes.length > 0 && (
          <Carousel pauseOnHover>
            {latestEpisodes.map((show, index) => (
              <div className="relative">
                <div className="flex justify-center items-center">
                  <img
                    src={show?.image?.original}
                    alt="Episode"
                    className="max-w-lg max-h-screen relative rounded-md"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center pb-4">
                  <div className="bg-black bg-opacity-50 text-white p-4 text-center">
                    <p className="text-lg font-bold">{show.name}</p>
                    <p className="text-sm text-gray-300">
                      Season {show.season} | Episode {show.number} <br />
                      {showsJson[index].showName}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        )
      ) : (
        <Loading />
      )}
    </>
  );
}
