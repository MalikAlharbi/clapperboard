export const fetchSearch = async (searchQuery) => {
  const response = await fetch(
    `https://api.tvmaze.com/search/shows?q=${searchQuery}`
  );
  const data = await response.json();
  return data;
};


export const fetchInfo = async (showId) => {
  const response = await fetch(`https://api.tvmaze.com/shows/${showId}`);
  const data = await response.json();
  return data;
};

export const fetchSeasons = async (showId) => {
  const response = await fetch(
    `https://api.tvmaze.com/shows/${showId}/seasons`
  );
  const data = await response.json();
  const filteredData = data.filter(season => season.premiereDate !== null);
  return filteredData;
};

export const fetchEpoisdes = async (showId) => {
  const response = await fetch(
    `https://api.tvmaze.com/shows/${showId}/episodes`
  );
  const data = await response.json();
  return data;
};

export default [fetchSearch, fetchInfo, fetchSeasons, fetchEpoisdes];
