import React from "react";

export default function ShowsCard({ name, img, year }) {
  if (!name || !img) return null;
  if (year != null) year = year.split("-")[0];

  return (
    <div className="w-72 h-full max-h-100 rounded-lg shadow-lg flex flex-col items-center justify-center relative">
      <img
        className="max-h-82 h-full w-82 object-cover rounded-t-lg"
        alt={`${name}`}
        src={`${img}`}
      />
      <br />

      <label className="">
        {year != null ? (
          <p className=" not-italic font-bold text-white">
            {name} ({year})
          </p>
        ) : (
          <p className=" not-italic font-bold text-white">{name}</p>
        )}
      </label>
      <br />

      <button className="inline-flex border border-red-600 absoulte  items-center justify-center w-48 h-12 py-2 rounded-md">
        <p className="text-xl text-center text-red-600 font-montserrat">
          Add to My List
        </p>
      </button>
      <button className="w-9 h-8 border border-black bg-white rounded-full absolute top-0 right-0">
        <p className="text-xl text-center text-black">i</p>
      </button>
      <br />
    </div>
  );
}
