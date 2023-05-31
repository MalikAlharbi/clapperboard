import React from "react";
import Loading from "./Loading";

export default function InfoPopUp({
  popUpRef,
  setIsOpen,
  info,
  loading,
  name,
  img,
  year,
}) {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center pl-10 pr-10">
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-900 opacity-50"></div>

      <div
        className="bg-gray-700 rounded-lg z-10 max-w-4xl right-0 flex relative "
        ref={popUpRef}
      >
        <div class="absolute top-0 right-0">
          {/* close window */}
          <button
            className="w-6 h-6 text-white hover:text-red-400 focus:outline-none mt-2 mr-5"
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
        <div className="flex-shrink-0">
          <img
            className="h-full w-40  object-cover rounded-t-lg"
            alt={`${name}`}
            src={`${img}`}
          />
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center mb-4 ">
            <h2 className="text-white text-lg font-bold">{name}</h2>
          </div>

          <hr className="border-gray-600 mb-4" />
          <div className="text-white">
            {loading ? (
              <Loading />
            ) : (
              <div className="text-white">
                {/* info fields */}
                {info && (
                  <>
                    {info && (
                      <>
                        {info.summary && (
                          <p>
                            <span className="text-red-500 font-bold">
                              Description:
                            </span>{" "}
                            <span className="text-white">
                              {info.summary.replace(/<[^>]*>/g, "")}
                            </span>
                          </p>
                        )}
                        {info.type && (
                          <p className="">
                            <span className="text-red-600">Type:</span>{" "}
                            <span className="text-blue-500">{info.type}</span>
                          </p>
                        )}
                        {info.runtime && (
                          <p className="">
                            <span className="text-red-600">Eposide Time:</span>{" "}
                            <span className="text-blue-500">
                              {info.runtime} Minutes
                            </span>
                          </p>
                        )}
                        {info.language && (
                          <p>
                            <span className="text-red-600">Language:</span>{" "}
                            <span className="text-blue-500">
                              {info.language}
                            </span>
                          </p>
                        )}

                        {info.network && (
                          <p>
                            <span className="text-red-600">Network:</span>{" "}
                            <span className="text-blue-500">
                              {info.network.name}
                            </span>
                          </p>
                        )}
                        {info.genres && info.genres.length > 0 && (
                          <p>
                            <span className="text-red-600">Genres:</span>{" "}
                            <span className="text-blue-500">
                              {info.genres.join(", ")}
                            </span>
                          </p>
                        )}
                        {info.rating && info.rating.average && (
                          <p>
                            <span className="text-red-600">Rating:</span>{" "}
                            <span className="text-blue-500">
                              {info.rating.average}
                            </span>
                          </p>
                        )}

                        {year && (
                          <p>
                            <span className="text-red-600">Premiered:</span>{" "}
                            <span className="text-blue-500">{year}</span>
                          </p>
                        )}

                        {info.status && (
                          <p>
                            <span className="text-red-600">Status:</span>{" "}
                            <span className="text-blue-500">
                              {info.ended
                                ? info.status + " at " + info.ended
                                : info.status}
                            </span>
                          </p>
                        )}
                      </>
                    )}{" "}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
