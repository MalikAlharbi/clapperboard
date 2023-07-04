function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export const getSavedEpisodes = async (user_id, show_id) => {
  const csrftoken = getCookie("csrftoken");
  const response = await fetch(
    `/api/user-watched-episodes/?user=${user_id}&show=${show_id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    }
  );
  const data = await response.json();
  return data;
};

export const postSavedEpisodes = async (
  showId,
  savedEpisodes,
  seasonCurrentIndex
) => {
  const csrftoken = getCookie("csrftoken");
  fetch("/api/saveshow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({
      user: 1,
      show: showId,
      season: seasonCurrentIndex + 1,
      watched_episodes: savedEpisodes.toString(),
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data));
};

export default [getSavedEpisodes, postSavedEpisodes];
