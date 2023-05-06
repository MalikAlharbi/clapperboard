export const fetchSearch = async (searchQuery) => {
  const response = await fetch(
    `https://api.tvmaze.com/search/shows?q=${searchQuery}`
  );
  const data = await response.json();
  return data;
};

export default fetchSearch;
